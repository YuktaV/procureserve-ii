-- Console app database schema additions
-- This should be added to the existing migration file

-- Console users table (separate from regular users)
CREATE TABLE IF NOT EXISTS console_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'company_manager')),
    company_ids TEXT[] DEFAULT ARRAY[]::TEXT[], -- Super admins can access multiple companies
    last_login TIMESTAMPTZ,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Console user permissions
CREATE TABLE IF NOT EXISTS console_user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES console_users(id) ON DELETE CASCADE,
    resource TEXT NOT NULL CHECK (resource IN ('enums', 'companies', 'users', 'settings', 'audit_logs', 'analytics')),
    actions TEXT[] NOT NULL, -- ['create', 'read', 'update', 'delete', 'manage']
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- NULL for super_admin global permissions
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource, company_id)
);

-- Console user invitations
CREATE TABLE IF NOT EXISTS console_user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'company_admin', 'company_manager')),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES console_users(id) ON DELETE CASCADE,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT
);

-- Console security events for audit logging
CREATE TABLE IF NOT EXISTS console_security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id TEXT, -- Can be empty for failed login attempts
    user_email TEXT,
    user_role TEXT,
    resource TEXT,
    resource_id TEXT,
    action TEXT,
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL
);

-- Enhanced configurable_enums table with console-specific fields
ALTER TABLE configurable_enums ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES console_users(id);
ALTER TABLE configurable_enums ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES console_users(id);
ALTER TABLE configurable_enums ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE configurable_enums ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;

-- Enum operations history for tracking changes
CREATE TABLE IF NOT EXISTS enum_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enum_id UUID NOT NULL REFERENCES configurable_enums(id) ON DELETE CASCADE,
    operation_type TEXT NOT NULL CHECK (operation_type IN ('create', 'update', 'delete', 'bulk_update', 'reorder', 'activate', 'deactivate', 'import', 'export')),
    user_id UUID NOT NULL REFERENCES console_users(id),
    changes JSONB NOT NULL DEFAULT '{}'::JSONB,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_console_users_email ON console_users(email);
CREATE INDEX IF NOT EXISTS idx_console_users_role ON console_users(role);
CREATE INDEX IF NOT EXISTS idx_console_users_active ON console_users(is_active);
CREATE INDEX IF NOT EXISTS idx_console_user_permissions_user ON console_user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_console_user_permissions_resource ON console_user_permissions(resource);
CREATE INDEX IF NOT EXISTS idx_console_security_events_user ON console_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_console_security_events_timestamp ON console_security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_console_security_events_type ON console_security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_enum_operations_enum ON enum_operations(enum_id);
CREATE INDEX IF NOT EXISTS idx_enum_operations_timestamp ON enum_operations(timestamp DESC);

-- Row Level Security policies for console tables

-- Console users can only see themselves unless they're super_admin
ALTER TABLE console_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Console users can view themselves" ON console_users
    FOR SELECT USING (
        id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM console_users cu 
            WHERE cu.id = auth.uid() AND cu.role = 'super_admin'
        )
    );

CREATE POLICY "Only super_admins can modify console users" ON console_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM console_users cu 
            WHERE cu.id = auth.uid() AND cu.role = 'super_admin'
        )
    );

-- Console user permissions
ALTER TABLE console_user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Console users can view their own permissions" ON console_user_permissions
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM console_users cu 
            WHERE cu.id = auth.uid() AND cu.role = 'super_admin'
        )
    );

-- Security events - users can only see their own events, super_admins see all
ALTER TABLE console_security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Console users can view security events" ON console_security_events
    FOR SELECT USING (
        user_id = auth.uid()::TEXT OR
        EXISTS (
            SELECT 1 FROM console_users cu 
            WHERE cu.id = auth.uid() AND cu.role = 'super_admin'
        )
    );

-- Enum operations - scoped by company access
ALTER TABLE enum_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Console users can view enum operations for their companies" ON enum_operations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM console_users cu
            WHERE cu.id = auth.uid() AND (
                cu.role = 'super_admin' OR
                company_id::TEXT = ANY(cu.company_ids)
            )
        )
    );

-- Functions for console operations

-- Function to check if user has console permission
CREATE OR REPLACE FUNCTION has_console_permission(
    user_id UUID,
    required_resource TEXT,
    required_action TEXT,
    target_company_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
    has_permission BOOLEAN := FALSE;
BEGIN
    -- Get user role
    SELECT role INTO user_role
    FROM console_users
    WHERE id = user_id AND is_active = TRUE;
    
    -- Super admins have all permissions
    IF user_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check specific permissions
    SELECT TRUE INTO has_permission
    FROM console_user_permissions cup
    WHERE cup.user_id = user_id
        AND cup.resource = required_resource
        AND required_action = ANY(cup.actions)
        AND (target_company_id IS NULL OR cup.company_id IS NULL OR cup.company_id = target_company_id);
    
    RETURN COALESCE(has_permission, FALSE);
END;
$$;

-- Function to log enum operations
CREATE OR REPLACE FUNCTION log_enum_operation(
    p_enum_id UUID,
    p_operation_type TEXT,
    p_user_id UUID,
    p_changes JSONB,
    p_ip_address TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    operation_id UUID;
    target_company_id UUID;
BEGIN
    -- Get company_id from enum
    SELECT company_id INTO target_company_id
    FROM configurable_enums
    WHERE id = p_enum_id;
    
    -- Insert operation log
    INSERT INTO enum_operations (
        id, enum_id, operation_type, user_id, changes, ip_address, company_id
    ) VALUES (
        gen_random_uuid(), p_enum_id, p_operation_type, p_user_id, p_changes, p_ip_address, target_company_id
    ) RETURNING id INTO operation_id;
    
    RETURN operation_id;
END;
$$;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_console_users_updated_at BEFORE UPDATE ON console_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample console users (for development)
-- Note: Sample data with company references will be added via seed.sql after companies are created
INSERT INTO console_users (id, email, role, company_ids, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@procureserve.com', 'super_admin', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (email) DO NOTHING;