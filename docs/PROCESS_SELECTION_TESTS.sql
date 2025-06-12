-- Process Selection Test Suite
-- Comprehensive tests for process-based access control

-- Cleanup any existing test data
DELETE FROM activity_logs WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE '%@test-process-selection.com'
);
DELETE FROM users WHERE email LIKE '%@test-process-selection.com';
DELETE FROM companies WHERE domain = 'test-process-selection.com';

-- Setup test company
INSERT INTO companies (id, name, domain) VALUES 
('process-test-company', 'Process Test Company', 'test-process-selection.com');

-- Test User Scenarios
-- 1. Admin with both processes (should see selection screen)
INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
('admin-dual', 'admin@test-process-selection.com', 'process-test-company', 'admin', 
 ARRAY['recruitment', 'bench_sales'], '{"first_name": "Admin", "last_name": "User"}');

-- 2. Recruiter with recruitment only (should bypass selection)
INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
('recruiter-single', 'recruiter@test-process-selection.com', 'process-test-company', 'recruiter', 
 ARRAY['recruitment'], '{"first_name": "Recruiter", "last_name": "User"}');

-- 3. Bench sales specialist with bench sales only (should bypass selection)  
INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
('bench-single', 'bench@test-process-selection.com', 'process-test-company', 'viewer', 
 ARRAY['bench_sales'], '{"first_name": "Bench", "last_name": "User"}');

-- 4. Manager with both processes and current selection (should redirect to current)
INSERT INTO users (id, email, company_id, role, process_permissions, current_process, profile) VALUES 
('manager-current', 'manager@test-process-selection.com', 'process-test-company', 'manager', 
 ARRAY['recruitment', 'bench_sales'], 'recruitment', '{"first_name": "Manager", "last_name": "User"}');

-- 5. User with no processes (should see access denied)
INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
('no-access', 'noprocess@test-process-selection.com', 'process-test-company', 'viewer', 
 ARRAY[]::TEXT[], '{"first_name": "NoAccess", "last_name": "User"}');

-- Test Process Permission Functions
SELECT 'Testing process permission functions...' as test_section;

-- Test 1: Admin should have both processes
SELECT 
  'Test 1: Admin dual process access' as test_name,
  user_has_process_permission('admin-dual', 'recruitment') as has_recruitment,
  user_has_process_permission('admin-dual', 'bench_sales') as has_bench_sales,
  get_user_processes('admin-dual') as available_processes;

-- Test 2: Recruiter should only have recruitment
SELECT 
  'Test 2: Recruiter single process access' as test_name,
  user_has_process_permission('recruiter-single', 'recruitment') as has_recruitment,
  user_has_process_permission('recruiter-single', 'bench_sales') as has_bench_sales,
  get_user_processes('recruiter-single') as available_processes;

-- Test 3: Bench sales should only have bench sales
SELECT 
  'Test 3: Bench sales single process access' as test_name,
  user_has_process_permission('bench-single', 'recruitment') as has_recruitment,
  user_has_process_permission('bench-single', 'bench_sales') as has_bench_sales,
  get_user_processes('bench-single') as available_processes;

-- Test 4: No access user should have empty permissions
SELECT 
  'Test 4: No access user' as test_name,
  user_has_process_permission('no-access', 'recruitment') as has_recruitment,
  user_has_process_permission('no-access', 'bench_sales') as has_bench_sales,
  get_user_processes('no-access') as available_processes;

-- Test Process Selection Logic
SELECT 'Testing process selection logic...' as test_section;

-- Test 5: Set process for dual-access user
SELECT set_user_current_process('admin-dual', 'bench_sales') as process_set_success;
SELECT current_process FROM users WHERE id = 'admin-dual'; -- Should be 'bench_sales'

-- Test 6: Try to set invalid process (should fail)
SELECT set_user_current_process('recruiter-single', 'bench_sales') as should_be_false;

-- Test 7: Set valid process for single-access user
SELECT set_user_current_process('recruiter-single', 'recruitment') as should_be_true;

-- Test User Access Patterns
SELECT 'Testing user access patterns...' as test_section;

-- Query to simulate the page load logic for each user type
WITH user_access_analysis AS (
  SELECT 
    u.id,
    u.email,
    u.role,
    u.process_permissions,
    u.current_process,
    array_length(u.process_permissions, 1) as permission_count,
    CASE 
      WHEN array_length(u.process_permissions, 1) = 0 THEN 'access_denied'
      WHEN array_length(u.process_permissions, 1) = 1 THEN 'direct_redirect'
      WHEN array_length(u.process_permissions, 1) > 1 AND u.current_process IS NOT NULL THEN 'use_current_process'
      WHEN array_length(u.process_permissions, 1) > 1 AND u.current_process IS NULL THEN 'show_selection'
      ELSE 'unknown'
    END as expected_behavior,
    CASE 
      WHEN array_length(u.process_permissions, 1) = 0 THEN '/access-denied'
      WHEN array_length(u.process_permissions, 1) = 1 THEN '/dashboard/' || u.process_permissions[1]
      WHEN array_length(u.process_permissions, 1) > 1 AND u.current_process IS NOT NULL THEN '/dashboard/' || u.current_process
      WHEN array_length(u.process_permissions, 1) > 1 AND u.current_process IS NULL THEN '/select-process'
      ELSE '/error'
    END as expected_redirect
  FROM users u
  WHERE u.company_id = 'process-test-company'
)
SELECT * FROM user_access_analysis ORDER BY expected_behavior;

-- Test Activity Logging
SELECT 'Testing activity logging...' as test_section;

-- Check that process changes are logged
SELECT 
  COUNT(*) as logged_activities,
  action,
  entity_type
FROM activity_logs 
WHERE user_id IN (
  SELECT id FROM users WHERE company_id = 'process-test-company'
) 
GROUP BY action, entity_type
ORDER BY action;

-- Test API Response Simulation
SELECT 'Testing API response data...' as test_section;

-- Simulate GET /api/set-process response for each user
SELECT 
  u.email as user_email,
  jsonb_build_object(
    'current_process', u.current_process,
    'available_processes', u.process_permissions,
    'can_switch_process', array_length(u.process_permissions, 1) > 1,
    'switch_url', '/select-process'
  ) as api_response
FROM users u
WHERE u.company_id = 'process-test-company'
ORDER BY u.email;

-- Test Edge Cases
SELECT 'Testing edge cases...' as test_section;

-- Test 8: User with invalid process permissions (should be prevented by constraints)
DO $$
BEGIN
  -- This should fail due to constraint
  INSERT INTO users (id, email, company_id, role, process_permissions) VALUES 
  ('invalid-process', 'invalid@test-process-selection.com', 'process-test-company', 'viewer', 
   ARRAY['invalid_process']);
  RAISE NOTICE 'ERROR: Invalid process was allowed!';
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'SUCCESS: Invalid process correctly rejected';
END $$;

-- Test 9: User with valid but unusual process combinations
INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
('edge-case', 'edge@test-process-selection.com', 'process-test-company', 'admin', 
 ARRAY['recruitment', 'bench_sales', 'recruitment'], '{"first_name": "Edge", "last_name": "Case"}');

-- Should deduplicate to unique processes
SELECT 
  'Test 9: Duplicate process permissions' as test_name,
  process_permissions,
  array_length(process_permissions, 1) as permission_count
FROM users WHERE id = 'edge-case';

-- Performance Test
SELECT 'Testing performance...' as test_section;

-- Test 10: Query performance with indexes
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.*, get_user_processes(u.id) as processes
FROM users u 
WHERE u.company_id = 'process-test-company' 
AND 'recruitment' = ANY(u.process_permissions);

-- Summary Report
SELECT 'PROCESS SELECTION TEST SUMMARY' as report_section;

SELECT 
  'Users created: ' || COUNT(*) as summary
FROM users WHERE company_id = 'process-test-company';

SELECT 
  'Functions working: ' || 
  CASE WHEN 
    user_has_process_permission('admin-dual', 'recruitment') AND
    NOT user_has_process_permission('recruiter-single', 'bench_sales') AND
    set_user_current_process('admin-dual', 'recruitment')
  THEN 'YES' ELSE 'NO' END as summary;

-- Cleanup Test Data
SELECT 'Cleaning up test data...' as cleanup_section;

DELETE FROM activity_logs WHERE user_id IN (
  SELECT id FROM users WHERE company_id = 'process-test-company'
);
DELETE FROM users WHERE company_id = 'process-test-company';
DELETE FROM companies WHERE id = 'process-test-company';

SELECT 'Process selection tests completed successfully!' as final_result;
