-- Process Access Control - Database Schema Enhancement
-- Adds proper process permissions to users for selective access

-- Add process permissions to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS process_permissions TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_process TEXT;

-- Add constraints for valid process permissions (using DO block to handle IF NOT EXISTS)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_process_permissions') THEN
    ALTER TABLE users ADD CONSTRAINT valid_process_permissions 
    CHECK (process_permissions <@ ARRAY['recruitment', 'bench_sales']);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_current_process') THEN
    ALTER TABLE users ADD CONSTRAINT valid_current_process 
    CHECK (current_process IN ('recruitment', 'bench_sales') OR current_process IS NULL);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_process_permissions ON users USING GIN (process_permissions);
CREATE INDEX IF NOT EXISTS idx_users_current_process ON users(current_process);

-- Set default process permissions based on existing roles
UPDATE users SET process_permissions = CASE 
  WHEN role IN ('admin', 'manager') THEN ARRAY['recruitment', 'bench_sales']
  WHEN role = 'recruiter' THEN ARRAY['recruitment']
  WHEN role = 'viewer' THEN ARRAY['recruitment'] -- Default to recruitment for viewers
  ELSE ARRAY['recruitment']
END WHERE process_permissions = '{}';

-- Add process permission tracking to activity logs
INSERT INTO activity_logs (entity_type, entity_id, action, details, user_id, company_id)
SELECT 
  'user',
  id,
  'process_permissions_initialized',
  jsonb_build_object('process_permissions', process_permissions),
  id,
  company_id
FROM users 
WHERE process_permissions != '{}';

-- Create helper function to check process permissions
CREATE OR REPLACE FUNCTION user_has_process_permission(user_id UUID, required_process TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions TEXT[];
BEGIN
  SELECT process_permissions INTO user_permissions
  FROM users 
  WHERE id = user_id;
  
  RETURN required_process = ANY(user_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get user's available processes
CREATE OR REPLACE FUNCTION get_user_processes(user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  user_permissions TEXT[];
BEGIN
  SELECT process_permissions INTO user_permissions
  FROM users 
  WHERE id = user_id;
  
  RETURN COALESCE(user_permissions, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user's current process
CREATE OR REPLACE FUNCTION set_user_current_process(user_id UUID, process TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions TEXT[];
  success BOOLEAN := FALSE;
BEGIN
  -- Check if user has permission for this process
  SELECT process_permissions INTO user_permissions
  FROM users 
  WHERE id = user_id;
  
  IF process = ANY(user_permissions) THEN
    UPDATE users 
    SET current_process = process,
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Log the process switch
    INSERT INTO activity_logs (
      entity_type, entity_id, action, details, user_id, company_id
    ) SELECT 
      'user', user_id, 'process_switched',
      jsonb_build_object('new_process', process),
      user_id, company_id
    FROM users WHERE id = user_id;
    
    success := TRUE;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for process-based access (example for jobs table)
-- This ensures users only see data relevant to their current process
CREATE OR REPLACE FUNCTION user_current_process_matches(required_process TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_process TEXT;
BEGIN
  SELECT current_process INTO user_process
  FROM users 
  WHERE id = auth.uid();
  
  -- If user has access to both processes, allow access regardless of current process
  -- This allows admins/managers to see all data
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND process_permissions @> ARRAY['recruitment', 'bench_sales']
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- For single-process users, check if they have permission for required process
  RETURN user_has_process_permission(auth.uid(), required_process);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Add process-based filtering to jobs (if needed in future)
-- CREATE POLICY "Jobs filtered by process permission" ON jobs 
-- FOR ALL USING (
--   user_current_process_matches('recruitment') AND
--   company_id = (SELECT company_id FROM users WHERE id = auth.uid())
-- );

COMMENT ON TABLE users IS 'Users table with process-based access control';
COMMENT ON COLUMN users.process_permissions IS 'Array of processes this user can access: recruitment, bench_sales';
COMMENT ON COLUMN users.current_process IS 'Currently selected process for dual-process users';
