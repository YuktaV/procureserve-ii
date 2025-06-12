-2', 'test-company-123', 110000, 140000, 'USD', 'annual', true, false, true, -10), -- Austin lower cost
('job-test-2', 'test-company-123', 100000, 130000, 'USD', 'annual', true, false, true, -15), -- Remote lower

-- Job 3 compensation (Product Manager)
('job-test-3', 'test-company-123', 150000, 190000, 'USD', 'annual', true, false, true, 0), -- NYC
('job-test-3', 'test-company-123', 170000, 210000, 'USD', 'annual', true, false, true, 20) -- SF higher
ON CONFLICT DO NOTHING;

-- Create test candidates
INSERT INTO candidates (id, email, name, phone, skills, experience_level, work_authorization, status, created_at) VALUES 
('candidate-1', 'john.doe@email.com', 'John Doe', '+1-555-1001', 
 '["JavaScript", "React", "Node.js", "PostgreSQL", "AWS"]', 'Senior Level', 'US Citizen', 'active', NOW()),
 
('candidate-2', 'jane.smith@email.com', 'Jane Smith', '+1-555-1002', 
 '["DevOps", "AWS", "Docker", "Kubernetes", "Python"]', 'Mid Level', 'Green Card', 'active', NOW()),
 
('candidate-3', 'mike.wilson@email.com', 'Mike Wilson', '+1-555-1003', 
 '["Product Management", "Analytics", "Leadership", "B2B"]', 'Senior Level', 'US Citizen', 'bench', NOW()),
 
('candidate-4', 'sarah.johnson@email.com', 'Sarah Johnson', '+1-555-1004', 
 '["Full Stack", "TypeScript", "React", "GraphQL"]', 'Mid Level', 'H1B', 'active', NOW()),
 
('candidate-5', 'david.brown@email.com', 'David Brown', '+1-555-1005', 
 '["Cloud Architecture", "Terraform", "Monitoring", "CI/CD"]', 'Senior Level', 'US Citizen', 'bench', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create test applications
INSERT INTO applications (id, job_id, candidate_id, company_id, status, notes, created_at) VALUES 
('app-1', 'job-test-1', 'candidate-1', 'test-company-123', 'applied', 
 '[{"id": "note-1", "content": "Strong technical background, good culture fit", "created_by": "admin-user-123", "created_at": "2024-01-15T10:00:00Z", "type": "comment"}]', 
 '2024-01-15T09:00:00Z'),
 
('app-2', 'job-test-1', 'candidate-4', 'test-company-123', 'interview_scheduled', 
 '[{"id": "note-2", "content": "Initial screening passed, scheduling technical interview", "created_by": "recruiter-user-123", "created_at": "2024-01-16T14:00:00Z", "type": "status_change"}]', 
 '2024-01-16T11:00:00Z'),
 
('app-3', 'job-test-2', 'candidate-2', 'test-company-123', 'under_review', 
 '[{"id": "note-3", "content": "Excellent DevOps experience, fits the remote role well", "created_by": "admin-user-123", "created_at": "2024-01-17T16:00:00Z", "type": "comment"}]', 
 '2024-01-17T13:00:00Z'),

('app-4', 'job-test-3', 'candidate-3', 'test-company-123', 'placed', 
 '[{"id": "note-4", "content": "Successfully placed! Start date confirmed for next month", "created_by": "manager-user-123", "created_at": "2024-01-18T12:00:00Z", "type": "status_change"}]', 
 '2024-01-18T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Create configurable enums for the test company
INSERT INTO configurable_enums (company_id, category, values) VALUES 
('test-company-123', 'work_authorization_types', '[
  {"key": "us_citizen", "label": "US Citizen", "color": "#22c55e", "order": 1, "active": true},
  {"key": "green_card", "label": "Green Card", "color": "#16a34a", "order": 2, "active": true},
  {"key": "h1b", "label": "H1B Visa", "color": "#f59e0b", "order": 3, "active": true},
  {"key": "opt", "label": "OPT", "color": "#eab308", "order": 4, "active": true},
  {"key": "tn", "label": "TN Visa", "color": "#84cc16", "order": 5, "active": true},
  {"key": "other", "label": "Other", "color": "#6b7280", "order": 6, "active": true}
]'),

('test-company-123', 'employment_types', '[
  {"key": "full_time", "label": "Full-time", "color": "#3b82f6", "order": 1, "active": true},
  {"key": "part_time", "label": "Part-time", "color": "#8b5cf6", "order": 2, "active": true},
  {"key": "contract", "label": "Contract", "color": "#f59e0b", "order": 3, "active": true},
  {"key": "contract_to_hire", "label": "Contract-to-Hire", "color": "#10b981", "order": 4, "active": true},
  {"key": "temporary", "label": "Temporary", "color": "#f97316", "order": 5, "active": true},
  {"key": "internship", "label": "Internship", "color": "#06b6d4", "order": 6, "active": true}
]'),

('test-company-123', 'experience_levels', '[
  {"key": "entry_level", "label": "Entry Level", "color": "#22c55e", "order": 1, "active": true},
  {"key": "mid_level", "label": "Mid Level", "color": "#3b82f6", "order": 2, "active": true},
  {"key": "senior_level", "label": "Senior Level", "color": "#f59e0b", "order": 3, "active": true},
  {"key": "executive_level", "label": "Executive Level", "color": "#dc2626", "order": 4, "active": true}
]'),

('test-company-123', 'job_statuses', '[
  {"key": "draft", "label": "Draft", "color": "#6b7280", "order": 1, "active": true},
  {"key": "published", "label": "Published", "color": "#22c55e", "order": 2, "active": true},
  {"key": "on_hold", "label": "On Hold", "color": "#f59e0b", "order": 3, "active": true},
  {"key": "closed", "label": "Closed", "color": "#dc2626", "order": 4, "active": true},
  {"key": "archived", "label": "Archived", "color": "#4b5563", "order": 5, "active": true}
]'),

('test-company-123', 'candidate_statuses', '[
  {"key": "active", "label": "Active", "color": "#22c55e", "order": 1, "active": true},
  {"key": "bench", "label": "On Bench", "color": "#3b82f6", "order": 2, "active": true},
  {"key": "placed", "label": "Placed", "color": "#10b981", "order": 3, "active": true},
  {"key": "inactive", "label": "Inactive", "color": "#6b7280", "order": 4, "active": true},
  {"key": "do_not_contact", "label": "Do Not Contact", "color": "#dc2626", "order": 5, "active": true}
]'),

('test-company-123', 'application_statuses', '[
  {"key": "applied", "label": "Applied", "color": "#3b82f6", "order": 1, "active": true},
  {"key": "screening", "label": "Screening", "color": "#f59e0b", "order": 2, "active": true},
  {"key": "interview_scheduled", "label": "Interview Scheduled", "color": "#8b5cf6", "order": 3, "active": true},
  {"key": "under_review", "label": "Under Review", "color": "#06b6d4", "order": 4, "active": true},
  {"key": "submitted_to_client", "label": "Submitted to Client", "color": "#10b981", "order": 5, "active": true},
  {"key": "client_interview", "label": "Client Interview", "color": "#f97316", "order": 6, "active": true},
  {"key": "offered", "label": "Offered", "color": "#22c55e", "order": 7, "active": true},
  {"key": "placed", "label": "Placed", "color": "#16a34a", "order": 8, "active": true},
  {"key": "rejected", "label": "Rejected", "color": "#dc2626", "order": 9, "active": true},
  {"key": "withdrawn", "label": "Withdrawn", "color": "#6b7280", "order": 10, "active": true}
]')
ON CONFLICT (company_id, category) DO NOTHING;

-- Log test data creation
INSERT INTO activity_logs (entity_type, entity_id, action, changes, user_id, company_id) VALUES 
('company', 'test-company-123', 'test_data_created', 
 '{"users_created": 5, "jobs_created": 3, "candidates_created": 5, "applications_created": 4}', 
 'admin-user-123', 'test-company-123');

-- Display created test accounts
SELECT 
  '🎯 TEST ACCOUNTS CREATED' as section,
  '' as email,
  '' as password,
  '' as role,
  '' as process_access;

SELECT 
  '📧 Login Credentials' as section,
  email,
  'password123' as password,
  role,
  array_to_string(process_permissions, ', ') as process_access
FROM users 
WHERE company_id = 'test-company-123'
ORDER BY role, email;

SELECT 
  '📊 Test Data Summary' as section,
  '' as count,
  '' as type;

SELECT 
  '📈 Statistics' as section,
  (SELECT COUNT(*) FROM users WHERE company_id = 'test-company-123')::text as user_count,
  'Users' as type
UNION ALL
SELECT 
  '' as section,
  (SELECT COUNT(*) FROM jobs WHERE company_id = 'test-company-123')::text as job_count,
  'Jobs' as type
UNION ALL
SELECT 
  '' as section,
  (SELECT COUNT(*) FROM candidates)::text as candidate_count,
  'Candidates' as type
UNION ALL
SELECT 
  '' as section,
  (SELECT COUNT(*) FROM applications WHERE company_id = 'test-company-123')::text as application_count,
  'Applications' as type;

SELECT 'Test data setup complete! 🎉' as result;
