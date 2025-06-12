-- Temporarily disable RLS on users table to fix infinite recursion
-- This allows the authentication system to work while we fix the policies

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Log this change
INSERT INTO activity_logs (entity_type, entity_id, action, details, user_id, company_id) 
VALUES ('system', gen_random_uuid(), 'rls_disabled', 
        jsonb_build_object('table', 'users', 'reason', 'infinite_recursion_fix'), 
        NULL, NULL);
