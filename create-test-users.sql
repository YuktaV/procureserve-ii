-- Create Test Users for ProcureServe II Testing
-- Run this after database reset to create test accounts

-- First, get the demo company ID from seed data
DO $$
DECLARE
    demo_company_id UUID;
BEGIN
    -- Get the demo company ID
    SELECT id INTO demo_company_id FROM companies WHERE domain = 'demo.procureserve.com';
    
    IF demo_company_id IS NULL THEN
        RAISE EXCEPTION 'Demo company not found. Please run seed.sql first.';
    END IF;
    
    -- Create test users in our users table
    -- Note: In production, these would be created via Supabase Auth
    
    -- Admin User (both processes)
    INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
    ('admin-test-123', 'admin@acme-staffing.com', demo_company_id, 'admin', 
     ARRAY['recruitment', 'bench_sales'], 
     '{"first_name": "Admin", "last_name": "User", "avatar_url": null}')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        process_permissions = EXCLUDED.process_permissions;
    
    -- Manager User (both processes, current = recruitment)
    INSERT INTO users (id, email, company_id, role, process_permissions, current_process, profile) VALUES 
    ('manager-test-123', 'manager@acme-staffing.com', demo_company_id, 'manager', 
     ARRAY['recruitment', 'bench_sales'], 'recruitment',
     '{"first_name": "Manager", "last_name": "User", "avatar_url": null}')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        process_permissions = EXCLUDED.process_permissions;
    
    -- Recruiter User (recruitment only)
    INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
    ('recruiter-test-123', 'recruiter@acme-staffing.com', demo_company_id, 'recruiter', 
     ARRAY['recruitment'], 
     '{"first_name": "Recruiter", "last_name": "User", "avatar_url": null}')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        process_permissions = EXCLUDED.process_permissions;
    
    -- Bench Sales User (bench sales only)
    INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
    ('bench-test-123', 'bench@acme-staffing.com', demo_company_id, 'viewer', 
     ARRAY['bench_sales'], 
     '{"first_name": "Bench", "last_name": "Sales", "avatar_url": null}')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        process_permissions = EXCLUDED.process_permissions;
    
    -- No Access User (empty permissions)
    INSERT INTO users (id, email, company_id, role, process_permissions, profile) VALUES 
    ('noprocess-test-123', 'noprocess@acme-staffing.com', demo_company_id, 'viewer', 
     ARRAY[]::TEXT[], 
     '{"first_name": "NoProcess", "last_name": "User", "avatar_url": null}')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        process_permissions = EXCLUDED.process_permissions;

    RAISE NOTICE 'Test users created successfully for company: %', demo_company_id;
END $$;

-- Display created test accounts
SELECT 
  'TEST ACCOUNTS CREATED' as "🎯 SECTION",
  'EMAIL' as "📧 EMAIL",
  'PASSWORD' as "🔑 PASSWORD", 
  'ROLE' as "👤 ROLE",
  'PROCESS ACCESS' as "🔄 PROCESS ACCESS";

SELECT 
  '====================' as "🎯 SECTION",
  email as "📧 EMAIL",
  'password123' as "🔑 PASSWORD",
  role as "👤 ROLE", 
  array_to_string(process_permissions, ', ') as "🔄 PROCESS ACCESS"
FROM users 
WHERE company_id = (SELECT id FROM companies WHERE domain = 'demo.procureserve.com')
ORDER BY 
  CASE role 
    WHEN 'admin' THEN 1 
    WHEN 'manager' THEN 2 
    WHEN 'recruiter' THEN 3 
    ELSE 4 
  END, email;

SELECT '✅ Test user creation complete!' as "RESULT";
