-- Migration to support simplified candidate registration and profile completion
-- Date: 2025-06-11

-- Add profile completion tracking and additional fields to candidates table
ALTER TABLE candidates 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN profile_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN visa_valid_until DATE,
ADD COLUMN representing_agency TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN preferred_location TEXT,
ADD COLUMN availability_date DATE,
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update name field to be computed from first_name and last_name
-- We'll keep the name field for backwards compatibility but update it via trigger

-- Create function to update name field
CREATE OR REPLACE FUNCTION update_candidate_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL THEN
    NEW.name = COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, '');
    NEW.name = TRIM(NEW.name);
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update name field
CREATE TRIGGER trigger_update_candidate_name
  BEFORE INSERT OR UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_candidate_name();

-- Create candidate profile status enum for tracking completion stages
-- This will be managed via configurable_enums, but we'll set up some defaults

-- Insert default profile completion statuses (these can be customized per company)
INSERT INTO configurable_enums (company_id, category, values) VALUES 
(NULL, 'candidate_profile_statuses', '[
  {"key": "incomplete", "label": "Profile Incomplete", "color": "#f59e0b", "active": true},
  {"key": "basic_complete", "label": "Basic Info Complete", "color": "#3b82f6", "active": true},
  {"key": "full_complete", "label": "Profile Complete", "color": "#22c55e", "active": true}
]');

-- Add index for faster candidate lookups by auth user
CREATE INDEX idx_candidates_auth_user_id ON candidates(auth_user_id);

-- Add index for visa expiration monitoring
CREATE INDEX idx_candidates_visa_expiry ON candidates(visa_valid_until) WHERE visa_valid_until IS NOT NULL;

-- Create candidate creation tracking table for multiple creation methods
CREATE TABLE candidate_creation_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  method TEXT NOT NULL, -- 'self_registration', 'company_created', 'invitation', 'import'
  created_by_user_id UUID REFERENCES users(id), -- NULL for self-registration
  invitation_token TEXT, -- For invitation-based creation
  invitation_expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}', -- Additional context like import source, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create representing agency history table for tracking changes
CREATE TABLE candidate_agency_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  agency_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL means current
  notes TEXT,
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE candidate_creation_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_agency_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for candidate_creation_methods (company-scoped through candidate)
CREATE POLICY "Candidate creation methods are company-scoped" ON candidate_creation_methods
FOR ALL USING (
  candidate_id IN (
    SELECT c.id FROM candidates c 
    JOIN applications a ON c.id = a.candidate_id 
    WHERE a.company_id = (SELECT company_id FROM users WHERE id = auth.uid())
  )
);

-- RLS policies for candidate_agency_history (company-scoped through candidate)
CREATE POLICY "Candidate agency history is company-scoped" ON candidate_agency_history
FOR ALL USING (
  candidate_id IN (
    SELECT c.id FROM candidates c 
    JOIN applications a ON c.id = a.candidate_id 
    WHERE a.company_id = (SELECT company_id FROM users WHERE id = auth.uid())
  )
);

-- Function to handle representing agency changes
CREATE OR REPLACE FUNCTION update_candidate_agency(
  p_candidate_id UUID,
  p_new_agency TEXT,
  p_start_date DATE DEFAULT CURRENT_DATE,
  p_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  current_agency TEXT;
BEGIN
  -- Get current agency
  SELECT representing_agency INTO current_agency 
  FROM candidates 
  WHERE id = p_candidate_id;
  
  -- If agency is changing
  IF current_agency IS DISTINCT FROM p_new_agency THEN
    -- End current agency relationship if exists
    IF current_agency IS NOT NULL THEN
      UPDATE candidate_agency_history 
      SET end_date = p_start_date - INTERVAL '1 day'
      WHERE candidate_id = p_candidate_id 
        AND end_date IS NULL 
        AND agency_name = current_agency;
    END IF;
    
    -- Update candidate record
    UPDATE candidates 
    SET representing_agency = p_new_agency,
        updated_at = NOW()
    WHERE id = p_candidate_id;
    
    -- Add new agency history record if new agency is not null
    IF p_new_agency IS NOT NULL THEN
      INSERT INTO candidate_agency_history (
        candidate_id, 
        agency_name, 
        start_date, 
        notes, 
        created_by_user_id
      ) VALUES (
        p_candidate_id, 
        p_new_agency, 
        p_start_date, 
        p_notes, 
        auth.uid()
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for candidate profile completion status
CREATE VIEW candidate_profile_status AS
SELECT 
  c.*,
  CASE 
    WHEN c.profile_completed_at IS NOT NULL THEN 'full_complete'
    WHEN c.first_name IS NOT NULL AND c.last_name IS NOT NULL AND c.email IS NOT NULL THEN 'basic_complete'
    ELSE 'incomplete'
  END as profile_status,
  CASE 
    WHEN c.visa_valid_until IS NOT NULL AND c.visa_valid_until <= CURRENT_DATE + INTERVAL '30 days' THEN true
    ELSE false
  END as visa_expiring_soon
FROM candidates c;

-- Grant permissions on the view
GRANT SELECT ON candidate_profile_status TO authenticated;
