-- Fix infinite recursion in console_users policies
-- This migration fixes the RLS policies that were causing infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Console users can view themselves" ON console_users;
DROP POLICY IF EXISTS "Only super_admins can modify console users" ON console_users;
DROP POLICY IF EXISTS "Console users can view their own permissions" ON console_user_permissions;
DROP POLICY IF EXISTS "Console users can view security events" ON console_security_events;
DROP POLICY IF EXISTS "Console users can view enum operations for their companies" ON enum_operations;

-- Create a function to check if user is super admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM console_users 
    WHERE id = user_id 
    AND role = 'super_admin' 
    AND is_active = TRUE
  );
$$;

-- Create simplified policies for console_users table
CREATE POLICY "Console users can view themselves" ON console_users
    FOR SELECT USING (
        id = auth.uid()
    );

CREATE POLICY "Console users can update themselves" ON console_users
    FOR UPDATE USING (
        id = auth.uid()
    );

-- Super admins can do everything (separate policies to avoid recursion)
CREATE POLICY "Super admins can view all console users" ON console_users
    FOR SELECT USING (
        is_super_admin(auth.uid())
    );

CREATE POLICY "Super admins can modify all console users" ON console_users
    FOR ALL USING (
        is_super_admin(auth.uid())
    );

-- Console user permissions policies
CREATE POLICY "Console users can view their own permissions" ON console_user_permissions
    FOR SELECT USING (
        user_id = auth.uid() OR is_super_admin(auth.uid())
    );

CREATE POLICY "Super admins can manage all permissions" ON console_user_permissions
    FOR ALL USING (
        is_super_admin(auth.uid())
    );

-- Security events policies
CREATE POLICY "Console users can view their own security events" ON console_security_events
    FOR SELECT USING (
        user_id::UUID = auth.uid() OR is_super_admin(auth.uid())
    );

CREATE POLICY "Console users can insert their own security events" ON console_security_events
    FOR INSERT WITH CHECK (
        user_id::UUID = auth.uid() OR is_super_admin(auth.uid())
    );

-- Enum operations policies
CREATE POLICY "Console users can view enum operations" ON enum_operations
    FOR SELECT USING (
        is_super_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM console_users cu
            WHERE cu.id = auth.uid() 
            AND cu.is_active = TRUE
            AND company_id::TEXT = ANY(cu.company_ids)
        )
    );

CREATE POLICY "Console users can insert enum operations" ON enum_operations
    FOR INSERT WITH CHECK (
        is_super_admin(auth.uid()) OR
        EXISTS (
            SELECT 1 FROM console_users cu
            WHERE cu.id = auth.uid() 
            AND cu.is_active = TRUE
            AND company_id::TEXT = ANY(cu.company_ids)
        )
    );

-- Console user invitations policies
CREATE POLICY "Super admins can manage invitations" ON console_user_invitations
    FOR ALL USING (
        is_super_admin(auth.uid())
    );

CREATE POLICY "Console users can view invitations they sent" ON console_user_invitations
    FOR SELECT USING (
        invited_by::UUID = auth.uid() OR is_super_admin(auth.uid())
    );
