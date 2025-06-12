-- Fix RLS policy recursion issues
-- Date: 2025-06-11

-- Drop existing problematic policies and recreate them properly
DROP POLICY IF EXISTS "Jobs are company-scoped" ON jobs;
DROP POLICY IF EXISTS "Candidates are visible to related companies" ON candidates;
DROP POLICY IF EXISTS "Applications are company-scoped" ON applications;
DROP POLICY IF EXISTS "Users can see their own company data" ON users;

-- Fix users table policy to avoid recursion
-- Users can see their own record and other users in their company
CREATE POLICY "Users can access own company data" ON users
FOR ALL USING (
  id = auth.uid() OR
  company_id = (
    SELECT company_id FROM users 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- Allow user creation during registration (no auth.uid() yet)
CREATE POLICY "Allow user creation during registration" ON users
FOR INSERT WITH CHECK (true);

-- Jobs are scoped to the user's company
CREATE POLICY "Jobs are company-scoped" ON jobs
FOR ALL USING (
  company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
);

-- Candidates policies - they don't need to reference users table directly
CREATE POLICY "Candidates can manage own data" ON candidates
FOR ALL USING (
  auth_user_id = auth.uid()
);

-- Allow candidate creation during registration
CREATE POLICY "Allow candidate creation during registration" ON candidates
FOR INSERT WITH CHECK (true);

-- Companies can see candidates that have applications with them
CREATE POLICY "Companies can see candidates with applications" ON candidates
FOR SELECT USING (
  id IN (
    SELECT candidate_id FROM applications 
    WHERE company_id IN (
      SELECT company_id FROM users 
      WHERE id = auth.uid() 
      AND company_id IS NOT NULL
    )
  )
);

-- Applications are scoped to companies
CREATE POLICY "Applications are company-scoped" ON applications
FOR ALL USING (
  company_id IN (
    SELECT company_id FROM users 
    WHERE id = auth.uid() 
    AND company_id IS NOT NULL
  )
  OR
  candidate_id IN (
    SELECT id FROM candidates 
    WHERE auth_user_id = auth.uid()
  )
);

-- Allow application creation
CREATE POLICY "Allow application creation" ON applications
FOR INSERT WITH CHECK (true);
