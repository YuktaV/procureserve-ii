-- Seed data for ProcureServe II
-- Default company and configurable enums

-- Insert default company for development
INSERT INTO companies (id, name, domain, settings, recruitment_enabled, bench_sales_enabled) VALUES 
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'Demo Company',
  'demo.procureserve.com',
  '{
    "ai_settings": {
      "enabled": true,
      "resume_parsing": true,
      "candidate_matching": true,
      "job_suggestions": true
    },
    "notification_preferences": {
      "email_notifications": true,
      "push_notifications": true,
      "digest_frequency": "daily"
    }
  }',
  true,
  true
);

-- Insert default configurable enums for the demo company
INSERT INTO configurable_enums (company_id, category, values) VALUES 
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'work_authorization_types',
  '[
    {"key": "us_citizen", "label": "US Citizen", "description": "United States citizen", "color": "#22c55e", "order": 1, "active": true},
    {"key": "green_card", "label": "Green Card", "description": "Permanent resident", "color": "#3b82f6", "order": 2, "active": true},
    {"key": "h1b", "label": "H1B Visa", "description": "H1B work visa", "color": "#f59e0b", "order": 3, "active": true},
    {"key": "opt", "label": "OPT/CPT", "description": "Optional Practical Training", "color": "#8b5cf6", "order": 4, "active": true},
    {"key": "tn", "label": "TN Visa", "description": "NAFTA professional visa", "color": "#06b6d4", "order": 5, "active": true},
    {"key": "requires_sponsorship", "label": "Requires Sponsorship", "description": "Needs work authorization sponsorship", "color": "#ef4444", "order": 6, "active": true}
  ]'
),
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'employment_types',
  '[
    {"key": "full_time", "label": "Full-time", "description": "Full-time permanent position", "color": "#22c55e", "order": 1, "active": true},
    {"key": "part_time", "label": "Part-time", "description": "Part-time position", "color": "#3b82f6", "order": 2, "active": true},
    {"key": "contract", "label": "Contract", "description": "Contract position", "color": "#f59e0b", "order": 3, "active": true},
    {"key": "contract_to_hire", "label": "Contract-to-Hire", "description": "Contract with possibility of permanent hire", "color": "#8b5cf6", "order": 4, "active": true},
    {"key": "freelance", "label": "Freelance", "description": "Freelance/project-based work", "color": "#06b6d4", "order": 5, "active": true},
    {"key": "internship", "label": "Internship", "description": "Internship position", "color": "#84cc16", "order": 6, "active": true}
  ]'
),
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'experience_levels',
  '[
    {"key": "entry", "label": "Entry Level", "description": "0-2 years of experience", "color": "#22c55e", "order": 1, "active": true},
    {"key": "junior", "label": "Junior", "description": "2-4 years of experience", "color": "#3b82f6", "order": 2, "active": true},
    {"key": "mid", "label": "Mid-level", "description": "4-7 years of experience", "color": "#f59e0b", "order": 3, "active": true},
    {"key": "senior", "label": "Senior", "description": "7-12 years of experience", "color": "#8b5cf6", "order": 4, "active": true},
    {"key": "lead", "label": "Lead/Principal", "description": "12+ years with leadership experience", "color": "#ef4444", "order": 5, "active": true},
    {"key": "executive", "label": "Executive", "description": "C-level or VP positions", "color": "#06b6d4", "order": 6, "active": true}
  ]'
),
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'job_statuses',
  '[
    {"key": "draft", "label": "Draft", "description": "Job is being created", "color": "#6b7280", "order": 1, "active": true},
    {"key": "active", "label": "Active", "description": "Actively recruiting", "color": "#22c55e", "order": 2, "active": true},
    {"key": "paused", "label": "Paused", "description": "Temporarily not recruiting", "color": "#f59e0b", "order": 3, "active": true},
    {"key": "filled", "label": "Filled", "description": "Position has been filled", "color": "#3b82f6", "order": 4, "active": true},
    {"key": "cancelled", "label": "Cancelled", "description": "Job posting cancelled", "color": "#ef4444", "order": 5, "active": true},
    {"key": "on_hold", "label": "On Hold", "description": "Hiring process on hold", "color": "#8b5cf6", "order": 6, "active": true}
  ]'
),
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'candidate_statuses',
  '[
    {"key": "active", "label": "Active", "description": "Available for opportunities", "color": "#22c55e", "order": 1, "active": true},
    {"key": "passive", "label": "Passive", "description": "Not actively looking", "color": "#f59e0b", "order": 2, "active": true},
    {"key": "placed", "label": "Placed", "description": "Successfully placed in position", "color": "#3b82f6", "order": 3, "active": true},
    {"key": "do_not_contact", "label": "Do Not Contact", "description": "Do not reach out", "color": "#ef4444", "order": 4, "active": true},
    {"key": "blacklisted", "label": "Blacklisted", "description": "Permanently excluded", "color": "#991b1b", "order": 5, "active": true}
  ]'
),
(
  '01e1f1a1-1111-1111-1111-111111111111',
  'application_statuses',
  '[
    {"key": "applied", "label": "Applied", "description": "Application submitted", "color": "#3b82f6", "order": 1, "active": true},
    {"key": "screening", "label": "Screening", "description": "Under initial review", "color": "#f59e0b", "order": 2, "active": true},
    {"key": "phone_screen", "label": "Phone Screen", "description": "Phone interview scheduled/completed", "color": "#8b5cf6", "order": 3, "active": true},
    {"key": "interview", "label": "Interview", "description": "In interview process", "color": "#06b6d4", "order": 4, "active": true},
    {"key": "final_round", "label": "Final Round", "description": "Final interview stage", "color": "#84cc16", "order": 5, "active": true},
    {"key": "offer", "label": "Offer", "description": "Offer extended", "color": "#22c55e", "order": 6, "active": true},
    {"key": "hired", "label": "Hired", "description": "Offer accepted and hired", "color": "#059669", "order": 7, "active": true},
    {"key": "rejected", "label": "Rejected", "description": "Application rejected", "color": "#ef4444", "order": 8, "active": true},
    {"key": "withdrawn", "label": "Withdrawn", "description": "Candidate withdrew", "color": "#6b7280", "order": 9, "active": true}
  ]'
);

-- Insert default admin user for development
INSERT INTO users (id, email, company_id, role, profile) VALUES 
(
  '02e1f1a1-1111-1111-1111-111111111111',
  'admin@demo.procureserve.com',
  '01e1f1a1-1111-1111-1111-111111111111',
  'admin',
  '{
    "first_name": "Demo",
    "last_name": "Admin",
    "phone": "+1-555-0123",
    "avatar_url": null,
    "preferences": {
      "theme": "light",
      "notifications": true,
      "language": "en"
    }
  }'
);

-- Insert sample job for development
INSERT INTO jobs (id, company_id, title, description, requirements, status, created_by) VALUES 
(
  '03e1f1a1-1111-1111-1111-111111111111',
  '01e1f1a1-1111-1111-1111-111111111111',
  'Senior Software Engineer',
  'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.',
  '{
    "experience_level": "senior",
    "employment_type": "full_time",
    "work_authorization": ["us_citizen", "green_card", "h1b"],
    "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL"],
    "location": "San Francisco, CA (Remote OK)",
    "salary_range": {
      "min": 140000,
      "max": 180000,
      "currency": "USD"
    }
  }',
  'active',
  '02e1f1a1-1111-1111-1111-111111111111'
);

-- Insert sample candidate for development
INSERT INTO candidates (id, email, first_name, last_name, phone, skills, experience_level, work_authorization, status) VALUES 
(
  '04e1f1a1-1111-1111-1111-111111111111',
  'john.doe@example.com',
  'John',
  'Doe',
  '+1-555-0199',
  '["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "AWS"]',
  'senior',
  'us_citizen',
  'active'
);

-- Insert sample application for development
INSERT INTO applications (id, job_id, candidate_id, company_id, status) VALUES 
(
  '05e1f1a1-1111-1111-1111-111111111111',
  '03e1f1a1-1111-1111-1111-111111111111',
  '04e1f1a1-1111-1111-1111-111111111111',
  '01e1f1a1-1111-1111-1111-111111111111',
  'screening'
);
