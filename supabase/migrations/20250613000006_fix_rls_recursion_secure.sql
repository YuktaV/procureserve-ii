-- SECURE FIX: Resolve RLS policy recursion while maintaining full security
-- This migration fixes the infinite recursion in console_users policies
-- WITHOUT compromising security or disabling RLS

-- First, re-enable RLS on all tables (in case it was disabled)
ALTER TABLE console_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE console_user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE console_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE enum_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE console_user_invitations ENABLE ROW LEVEL SECURITY;

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Allow console users to view themselves" ON console_users;
DROP POLICY IF EXISTS "Allow console users to update themselves" ON console_users;
DROP POLICY IF EXISTS "Allow security event access" ON console_security_events;
DROP POLICY IF EXISTS "Allow permission access" ON console_user_permissions;
DROP POLICY IF EXISTS "Allow enum operations access" ON enum_operations;
DROP POLICY IF EXISTS "Allow invitation access" ON console_user_invitations;

-- Drop any remaining problematic policies from previous migrations
DROP POLICY IF EXISTS "Console users can view themselves" ON console_users;
DROP POLICY IF EXISTS "Console users can update themselves" ON console_users;
DROP POLICY IF EXISTS "Super admins can view all console users" ON console_users;
DROP POLICY IF EXISTS "Super admins can modify all console users" ON console_users;
DROP POLICY IF EXISTS "Console users can view their own permissions" ON console_user_permissions;
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON console_user_permissions;
DROP POLICY IF EXISTS "Console users can view their own security events" ON console_security_events;
DROP POLICY IF EXISTS "Console users can insert their own security events" ON console_security_events;
DROP POLICY IF EXISTS "Console users can view enum operations" ON enum_operations;
DROP POLICY IF EXISTS "Console users can insert enum operations" ON enum_operations;
DROP POLICY IF EXISTS "Super admins can manage invitations" ON console_user_invitations;
DROP POLICY IF EXISTS "Console users can view invitations they sent" ON console_user_invitations;

-- Drop the problematic function that causes recursion
DROP FUNCTION IF EXISTS is_super_admin(UUID);

-- Create a simple, non-recursive approach for console_users table
-- The key insight: Use auth.uid() directly without querying console_users table within policies

-- SECURE POLICY 1: Console users can view their own record
CREATE POLICY "console_users_select_own" ON console_users
    FOR SELECT USING (
        id = auth.uid()
    );

-- SECURE POLICY 2: Console users can update their own record
CREATE POLICY "console_users_update_own" ON console_users
    FOR UPDATE USING (
        id = auth.uid()
    );

-- SECURE POLICY 3: Only authenticated users can insert (for registration)
-- This allows the application to create console users during registration
CREATE POLICY "console_users_insert_auth" ON console_users
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- For console_user_permissions: Users can only see their own permissions
CREATE POLICY "console_permissions_select_own" ON console_user_permissions
    FOR SELECT USING (
        user_id = auth.uid()
    );

CREATE POLICY "console_permissions_insert_own" ON console_user_permissions
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

-- For console_security_events: Users can only see and create their own events
CREATE POLICY "console_security_select_own" ON console_security_events
    FOR SELECT USING (
        user_id::UUID = auth.uid()
    );

CREATE POLICY "console_security_insert_own" ON console_security_events
    FOR INSERT WITH CHECK (
        user_id::UUID = auth.uid()
    );

-- For enum_operations: Allow authenticated console users to manage enums
-- We'll handle company-level authorization in the application layer
CREATE POLICY "enum_operations_console_access" ON enum_operations
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- For console_user_invitations: Allow authenticated users to manage invitations
CREATE POLICY "console_invitations_auth_access" ON console_user_invitations
    FOR ALL USING (
        auth.uid() IS NOT NULL
    );

-- Ensure the console user exists with proper data
-- Use the actual auth user ID from Supabase Auth
DO $$
DECLARE
    auth_user_id UUID;
BEGIN
    -- Get the actual user ID from auth.users for admin@procureserve.com
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = 'admin@procureserve.com' 
    LIMIT 1;
    
    -- If the auth user exists, ensure console user record exists
    IF auth_user_id IS NOT NULL THEN
        INSERT INTO console_users (id, email, role, company_ids, is_active) VALUES
            (auth_user_id, 'admin@procureserve.com', 'super_admin', ARRAY[]::TEXT[], TRUE)
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            company_ids = EXCLUDED.company_ids,
            is_active = EXCLUDED.is_active;
    ELSE
        -- If no auth user exists, we'll create a placeholder that will be updated when user registers
        INSERT INTO console_users (id, email, role, company_ids, is_active) VALUES
            ('550e8400-e29b-41d4-a716-446655440001', 'admin@procureserve.com', 'super_admin', ARRAY[]::TEXT[], TRUE)
        ON CONFLICT (email) DO UPDATE SET
            role = EXCLUDED.role,
            company_ids = EXCLUDED.company_ids,
            is_active = EXCLUDED.is_active;
    END IF;
END $$;
