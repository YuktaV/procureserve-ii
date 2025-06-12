-- Simple Test Data for ProcureServe II Testing

-- Create test jobs
INSERT INTO jobs (id, company_id, title, description, status, created_by, created_at) VALUES 
('test-job-1', '01e1f1a1-1111-1111-1111-111111111111', 
 'Senior Full Stack Developer', 
 'Looking for an experienced full stack developer to join our team. Must have React, Node.js, and PostgreSQL experience.',
 'active', 
 (SELECT id FROM users WHERE email = 'admin@acme-staffing.com'), 
 NOW()),
 
('test-job-2', '01e1f1a1-1111-1111-1111-111111111111', 
 'DevOps Engineer', 
 'Seeking a DevOps engineer with AWS, Docker, and Kubernetes experience. Remote work available.',
 'active', 
 (SELECT id FROM users WHERE email = 'admin@acme-staffing.com'), 
 NOW()),
 
('test-job-3', '01e1f1a1-1111-1111-1111-111111111111', 
 'Product Manager', 
 'Product Manager needed for B2B SaaS platform. Experience with analytics and user research required.',
 'active', 
 (SELECT id FROM users WHERE email = 'admin@acme-staffing.com'), 
 NOW())

ON CONFLICT (id) DO NOTHING;

-- Create test candidates
INSERT INTO candidates (id, email, name, phone, skills, experience_level, work_authorization, status, created_at) VALUES 
('candidate-1', 'john.doe@email.com', 'John Doe', '+1-555-1001', 
 '["JavaScript", "React", "Node.js", "PostgreSQL", "AWS"]', 'senior', 'us_citizen', 'active', NOW()),
 
('candidate-2', 'jane.smith@email.com', 'Jane Smith', '+1-555-1002', 
 '["DevOps", "AWS", "Docker", "Kubernetes", "Python"]', 'mid', 'green_card', 'active', NOW()),
 
('candidate-3', 'mike.wilson@email.com', 'Mike Wilson', '+1-555-1003', 
 '["Product Management", "Analytics", "Leadership", "B2B"]', 'senior', 'us_citizen', 'active', NOW())

ON CONFLICT (id) DO NOTHING;

-- Create test applications
INSERT INTO applications (id, job_id, candidate_id, company_id, status, created_at) VALUES 
('app-1', 'test-job-1', 'candidate-1', '01e1f1a1-1111-1111-1111-111111111111', 'applied', NOW()),
('app-2', 'test-job-2', 'candidate-2', '01e1f1a1-1111-1111-1111-111111111111', 'screening', NOW()),
('app-3', 'test-job-3', 'candidate-3', '01e1f1a1-1111-1111-1111-111111111111', 'interview', NOW())

ON CONFLICT (id) DO NOTHING;

SELECT 'Test data created successfully!' as result;
