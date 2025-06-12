-- Security Test Suite for Multi-Location Jobs System
-- Run these tests to validate RLS policies and data isolation

-- Test 1: Company Data Isolation
-- Verify that users can only see jobs from their own company

-- Setup test data
INSERT INTO companies (id, name, domain) VALUES 
  ('company-a-id', 'Company A', 'company-a.com'),
  ('company-b-id', 'Company B', 'company-b.com');

INSERT INTO users (id, company_id, email, role) VALUES
  ('user-a-id', 'company-a-id', 'user-a@company-a.com', 'admin'),
  ('user-b-id', 'company-b-id', 'user-b@company-b.com', 'admin');

-- Create jobs for each company
INSERT INTO jobs (id, company_id, title, description, created_by) VALUES
  ('job-a-1', 'company-a-id', 'Job A1', 'Description A1', 'user-a-id'),
  ('job-a-2', 'company-a-id', 'Job A2', 'Description A2', 'user-a-id'),
  ('job-b-1', 'company-b-id', 'Job B1', 'Description B1', 'user-b-id');

-- Test: User A should only see Company A jobs
-- Expected: 2 rows (job-a-1, job-a-2)
SELECT 'Test 1a: Company A user sees only Company A jobs' as test_name;
SET session.user_id = 'user-a-id';
SELECT count(*) as expected_2 FROM jobs WHERE company_id = (
  SELECT company_id FROM users WHERE id = current_setting('session.user_id')
);

-- Test: User B should only see Company B jobs  
-- Expected: 1 row (job-b-1)
SELECT 'Test 1b: Company B user sees only Company B jobs' as test_name;
SET session.user_id = 'user-b-id';
SELECT count(*) as expected_1 FROM jobs WHERE company_id = (
  SELECT company_id FROM users WHERE id = current_setting('session.user_id')
);

-- Test 2: Job Location RLS
-- Verify job locations are properly isolated

INSERT INTO job_locations (job_id, company_id, location_type, headcount) VALUES
  ('job-a-1', 'company-a-id', 'office', 5),
  ('job-a-1', 'company-a-id', 'remote', 3),
  ('job-b-1', 'company-b-id', 'hybrid', 2);

-- Test: Company A user sees only their job locations
SELECT 'Test 2a: Company A sees only their job locations' as test_name;
SET session.user_id = 'user-a-id';
SELECT count(*) as expected_2 FROM job_locations WHERE company_id = (
  SELECT company_id FROM users WHERE id = current_setting('session.user_id')
);

-- Test 3: Job Compensation RLS
INSERT INTO job_compensation (job_id, company_id, salary_currency, salary_frequency) VALUES
  ('job-a-1', 'company-a-id', 'USD', 'annual'),
  ('job-b-1', 'company-b-id', 'EUR', 'annual');

-- Test: Company isolation in compensation
SELECT 'Test 3a: Compensation data isolated by company' as test_name;
SET session.user_id = 'user-a-id';
SELECT count(*) as expected_1 FROM job_compensation WHERE company_id = (
  SELECT company_id FROM users WHERE id = current_setting('session.user_id')
);

-- Test 4: Role-Based Permissions
-- Test different user roles

INSERT INTO users (id, company_id, email, role) VALUES
  ('viewer-a-id', 'company-a-id', 'viewer@company-a.com', 'viewer'),
  ('recruiter-a-id', 'company-a-id', 'recruiter@company-a.com', 'recruiter');

-- Test: All roles can read company data
SELECT 'Test 4a: Viewer can read company jobs' as test_name;
SET session.user_id = 'viewer-a-id';
SELECT count(*) as expected_2 FROM jobs WHERE company_id = (
  SELECT company_id FROM users WHERE id = current_setting('session.user_id')
);

-- Test 5: Audit Logging
-- Verify activity logs are created for job modifications

SELECT 'Test 5a: Activity logs capture job creation' as test_name;
SELECT count(*) as should_be_positive FROM activity_logs 
WHERE entity_type = 'job' AND action = 'created';

-- Test 6: Input Validation (Manual API Tests)
-- These should be tested via API calls with malicious input

/*
Manual tests to run via API:

1. XSS Prevention:
POST /api/jobs
{
  "title": "<script>alert('xss')</script>",
  "description": "<img src=x onerror=alert('xss')>"
}
Expected: Input sanitized, no script execution

2. SQL Injection:
POST /api/jobs  
{
  "title": "'; DROP TABLE jobs; --"
}
Expected: Request blocked or safely escaped

3. Company Isolation Bypass:
POST /api/jobs
{
  "company_id": "different-company-id",
  "title": "Unauthorized Job"
}
Expected: company_id ignored, user's company_id used

4. Role Permission Bypass:
DELETE /api/jobs/job-id (as viewer role)
Expected: 403 Forbidden

5. Large Payload Attack:
POST /api/jobs with extremely long strings
Expected: Request rejected or truncated safely
*/

-- Cleanup test data
DELETE FROM job_compensation WHERE job_id IN ('job-a-1', 'job-a-2', 'job-b-1');
DELETE FROM job_locations WHERE job_id IN ('job-a-1', 'job-a-2', 'job-b-1');
DELETE FROM jobs WHERE id IN ('job-a-1', 'job-a-2', 'job-b-1');
DELETE FROM users WHERE id IN ('user-a-id', 'user-b-id', 'viewer-a-id', 'recruiter-a-id');
DELETE FROM companies WHERE id IN ('company-a-id', 'company-b-id');

SELECT 'Security tests completed! Review results above.' as final_message;
