-- Test data for registration status page
-- Run this to test the registration status functionality

-- Insert test company and user
INSERT INTO companies (id, name, domain, registration_status, created_at) VALUES 
('test-company-123', 'Test Company Inc', 'testcompany.com', 'under_review', NOW() - INTERVAL '5 days');

INSERT INTO users (id, email, company_id, role, profile) VALUES 
('test-user-123', 'test@testcompany.com', 'test-company-123', 'admin', '{"first_name": "Test", "last_name": "User"}');

-- Add a company review
INSERT INTO company_reviews (company_id, reviewed_by, review_status, review_notes, reviewed_at) VALUES 
('test-company-123', 'test-user-123', 'under_review', 'Documents received and under review', NOW() - INTERVAL '2 days');

-- Test queries that the page load function will run

-- 1. Get user's company information
SELECT 
  u.id,
  u.company_id,
  c.id as company_id,
  c.name,
  c.registration_status,
  c.created_at,
  c.submitted_at,
  c.reviewed_at,
  c.rejection_reason
FROM users u
INNER JOIN companies c ON u.company_id = c.id
WHERE u.id = 'test-user-123';

-- 2. Get latest review
SELECT * FROM company_reviews 
WHERE company_id = 'test-company-123'
ORDER BY reviewed_at DESC 
LIMIT 1;

-- Test different registration statuses
UPDATE companies SET registration_status = 'draft' WHERE id = 'test-company-123';
UPDATE companies SET registration_status = 'submitted', submitted_at = NOW() WHERE id = 'test-company-123';
UPDATE companies SET registration_status = 'approved', reviewed_at = NOW() WHERE id = 'test-company-123';
UPDATE companies SET registration_status = 'rejected', reviewed_at = NOW(), rejection_reason = 'Missing business license document' WHERE id = 'test-company-123';

-- Cleanup
DELETE FROM company_reviews WHERE company_id = 'test-company-123';
DELETE FROM users WHERE id = 'test-user-123';
DELETE FROM companies WHERE id = 'test-company-123';

SELECT 'Registration status page test data created and cleaned up successfully' as result;
