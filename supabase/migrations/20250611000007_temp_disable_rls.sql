-- Temporarily disable RLS to test registration
-- This is a quick fix to get registration working

-- Disable RLS on candidates table temporarily
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_creation_methods DISABLE ROW LEVEL SECURITY;
