-- Final fix for console_users recursion issue
-- Temporarily disable RLS and create proper console user data

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Console users can view themselves" ON console_users;
DROP POLICY IF EXISTS "Console users can update themselves" ON console_users;
DROP POLICY IF EXISTS "Super admins can view all console users" ON console_users;
DROP POLICY IF EXISTS "Super admins can modify all console users" ON console_users;

-- Temporarily disable RLS to insert data
ALTER TABLE console_users DISABLE ROW LEVEL SECURITY;

-- Ensure the console user exists with the correct ID from Supabase Auth
INSERT INTO console_users (id, email, role, company_ids, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@procureserve.com', 'super_admin', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    role = EXCLUDED.role,
    company_ids = EXCLUDED.company_ids,
    is_active = EXCLUDED.is_active;

-- Re-enable RLS
ALTER TABLE console_users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "Allow console users to view themselves" ON console_users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Allow console users to update themselves" ON console_users
    FOR UPDATE USING (id = auth.uid());

-- For super admin access, we'll handle this in the application logic
-- rather than in database policies to avoid recursion

-- Also fix the security events table policies
DROP POLICY IF EXISTS "Console users can view their own security events" ON console_security_events;
DROP POLICY IF EXISTS "Console users can insert their own security events" ON console_security_events;

CREATE POLICY "Allow security event access" ON console_security_events
    FOR ALL USING (user_id::UUID = auth.uid());

-- Fix other table policies to avoid recursion
DROP POLICY IF EXISTS "Console users can view their own permissions" ON console_user_permissions;
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON console_user_permissions;

CREATE POLICY "Allow permission access" ON console_user_permissions
    FOR ALL USING (user_id = auth.uid());

-- Enum operations - simplified
DROP POLICY IF EXISTS "Console users can view enum operations" ON enum_operations;
DROP POLICY IF EXISTS "Console users can insert enum operations" ON enum_operations;

CREATE POLICY "Allow enum operations access" ON enum_operations
    FOR ALL USING (true); -- We'll handle authorization in application logic

-- Console user invitations - simplified
DROP POLICY IF EXISTS "Super admins can manage invitations" ON console_user_invitations;
DROP POLICY IF EXISTS "Console users can view invitations they sent" ON console_user_invitations;

CREATE POLICY "Allow invitation access" ON console_user_invitations
    FOR ALL USING (true); -- We'll handle authorization in application logic
