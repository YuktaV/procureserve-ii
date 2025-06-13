-- Temporarily disable RLS to fix recursion issues
-- We'll handle authorization in the application layer for now

-- Drop all existing policies and functions that cause recursion
DROP POLICY IF EXISTS "Allow console users to view themselves" ON console_users;
DROP POLICY IF EXISTS "Allow console users to update themselves" ON console_users;
DROP POLICY IF EXISTS "Allow security event access" ON console_security_events;
DROP POLICY IF EXISTS "Allow permission access" ON console_user_permissions;
DROP POLICY IF EXISTS "Allow enum operations access" ON enum_operations;
DROP POLICY IF EXISTS "Allow invitation access" ON console_user_invitations;

DROP FUNCTION IF EXISTS is_super_admin(UUID);

-- Disable RLS on all console tables temporarily
ALTER TABLE console_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE console_user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE console_security_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE enum_operations DISABLE ROW LEVEL SECURITY;
ALTER TABLE console_user_invitations DISABLE ROW LEVEL SECURITY;

-- Ensure the console user exists with the correct data
INSERT INTO console_users (id, email, role, company_ids, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@procureserve.com', 'super_admin', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (email) DO UPDATE SET
    id = EXCLUDED.id,
    role = EXCLUDED.role,
    company_ids = EXCLUDED.company_ids,
    is_active = EXCLUDED.is_active;
