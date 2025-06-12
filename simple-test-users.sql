-- Create Test Users for ACME Staffing Demo
-- Simple user creation for testing ProcureServe II

-- Create test users for ACME Staffing (Demo Company)
INSERT INTO users (email, company_id, role, process_permissions, current_process, profile) VALUES 
-- Admin User (both processes)
('admin@acme-staffing.com', '01e1f1a1-1111-1111-1111-111111111111', 'admin', 
 ARRAY['recruitment', 'bench_sales'], NULL,
 '{"first_name": "Admin", "last_name": "User"}'),

-- Manager User (both processes, currently using recruitment)
('manager@acme-staffing.com', '01e1f1a1-1111-1111-1111-111111111111', 'manager', 
 ARRAY['recruitment', 'bench_sales'], 'recruitment',
 '{"first_name": "Manager", "last_name": "User"}'),

-- Recruiter User (recruitment only)
('recruiter@acme-staffing.com', '01e1f1a1-1111-1111-1111-111111111111', 'recruiter', 
 ARRAY['recruitment'], NULL,
 '{"first_name": "Recruiter", "last_name": "User"}'),

-- Bench Sales User (bench sales only)
('bench@acme-staffing.com', '01e1f1a1-1111-1111-1111-111111111111', 'viewer', 
 ARRAY['bench_sales'], NULL,
 '{"first_name": "Bench", "last_name": "Sales"}'),

-- No Access User (no processes)
('noprocess@acme-staffing.com', '01e1f1a1-1111-1111-1111-111111111111', 'viewer', 
 ARRAY[]::TEXT[], NULL,
 '{"first_name": "NoProcess", "last_name": "User"}')

ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  process_permissions = EXCLUDED.process_permissions,
  current_process = EXCLUDED.current_process,
  profile = EXCLUDED.profile;

-- Display the created test accounts
SELECT 
  'TEST USERS CREATED' as status,
  email,
  role,
  array_to_string(process_permissions, ', ') as processes
FROM users 
WHERE company_id = '01e1f1a1-1111-1111-1111-111111111111'
ORDER BY role, email;
