-- Jobs Multi-Location System - Database Schema
-- Security-first implementation with proper RLS and constraints

-- First, let's extend the existing jobs table with additional required fields
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS reports_to TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE;

-- Job locations table - supports unlimited locations per job
CREATE TABLE job_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Location details
  location_type TEXT NOT NULL CHECK (location_type IN ('office', 'remote', 'hybrid')),
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- Address information (optional for remote/hybrid)
  country TEXT,
  state_province TEXT,
  city TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  postal_code TEXT,
  timezone TEXT,
  
  -- Location-specific settings
  headcount INTEGER DEFAULT 1 CHECK (headcount > 0),
  local_requirements TEXT,
  hiring_manager_id UUID REFERENCES users(id),
  
  -- Remote work options
  remote_countries_allowed TEXT[], -- Array of country codes
  hybrid_days_in_office INTEGER CHECK (hybrid_days_in_office >= 0 AND hybrid_days_in_office <= 7),
  travel_requirements TEXT,
  visa_sponsorship_available BOOLEAN DEFAULT FALSE,
  relocation_assistance_available BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(job_id, is_primary) DEFERRABLE INITIALLY DEFERRED -- Only one primary location per job
);
-- Job compensation table - location-specific salary ranges
CREATE TABLE job_compensation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_location_id UUID REFERENCES job_locations(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Salary information
  salary_min DECIMAL(15,2),
  salary_max DECIMAL(15,2),
  salary_currency TEXT DEFAULT 'USD' CHECK (LENGTH(salary_currency) = 3),
  salary_frequency TEXT DEFAULT 'annual' CHECK (salary_frequency IN ('hourly', 'monthly', 'annual')),
  
  -- Additional compensation
  bonus_eligible BOOLEAN DEFAULT FALSE,
  commission_eligible BOOLEAN DEFAULT FALSE,
  equity_eligible BOOLEAN DEFAULT FALSE,
  benefits_summary TEXT,
  
  -- Location-specific adjustments
  cost_of_living_adjustment DECIMAL(5,2) DEFAULT 0.00, -- Percentage adjustment
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
  CHECK (cost_of_living_adjustment >= -50.00 AND cost_of_living_adjustment <= 100.00)
);

-- Job custom fields table - UDF support for unlimited customization
CREATE TABLE job_custom_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Field definition
  field_name TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'multi_select')),
  field_value JSONB,
  
  -- Display configuration
  section TEXT DEFAULT 'custom',
  display_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- Validation rules
  validation_rules JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(job_id, field_name) -- Prevent duplicate field names per job
);
-- Row Level Security policies for new tables
-- CRITICAL: These policies enforce multi-tenant isolation

-- Job locations policies
ALTER TABLE job_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job locations are company-scoped" ON job_locations FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Job locations match job company" ON job_locations FOR ALL USING (
  job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid()))
);

-- Job compensation policies  
ALTER TABLE job_compensation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job compensation is company-scoped" ON job_compensation FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Job compensation matches job company" ON job_compensation FOR ALL USING (
  job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid()))
);

-- Job custom fields policies
ALTER TABLE job_custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job custom fields are company-scoped" ON job_custom_fields FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Job custom fields match job company" ON job_custom_fields FOR ALL USING (
  job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid()))
);

-- Performance indexes for new tables
CREATE INDEX idx_job_locations_job_id ON job_locations(job_id);
CREATE INDEX idx_job_locations_company_id ON job_locations(company_id);
CREATE INDEX idx_job_locations_type ON job_locations(location_type);
CREATE INDEX idx_job_locations_primary ON job_locations(job_id, is_primary) WHERE is_primary = TRUE;

CREATE INDEX idx_job_compensation_job_id ON job_compensation(job_id);
CREATE INDEX idx_job_compensation_company_id ON job_compensation(company_id);
CREATE INDEX idx_job_compensation_location_id ON job_compensation(job_location_id);

CREATE INDEX idx_job_custom_fields_job_id ON job_custom_fields(job_id);
CREATE INDEX idx_job_custom_fields_company_id ON job_custom_fields(company_id);
CREATE INDEX idx_job_custom_fields_name ON job_custom_fields(job_id, field_name);

-- Updated_at triggers for new tables
CREATE TRIGGER update_job_locations_updated_at BEFORE UPDATE ON job_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_compensation_updated_at BEFORE UPDATE ON job_compensation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_custom_fields_updated_at BEFORE UPDATE ON job_custom_fields
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Validation functions for data integrity
-- These functions ensure business logic compliance

-- Function to validate primary location constraint
CREATE OR REPLACE FUNCTION validate_primary_location()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure exactly one primary location per job
  IF NEW.is_primary = TRUE THEN
    -- Check if another primary location already exists
    IF EXISTS (
      SELECT 1 FROM job_locations 
      WHERE job_id = NEW.job_id 
      AND is_primary = TRUE 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) THEN
      -- Update existing primary to false
      UPDATE job_locations 
      SET is_primary = FALSE 
      WHERE job_id = NEW.job_id 
      AND is_primary = TRUE 
      AND id != NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_location
    BEFORE INSERT OR UPDATE ON job_locations
    FOR EACH ROW EXECUTE FUNCTION validate_primary_location();

-- Function to log job-related activities
CREATE OR REPLACE FUNCTION log_job_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_logs (
    company_id,
    user_id,
    entity_type,
    entity_id,
    action,
    details
  ) VALUES (
    COALESCE(NEW.company_id, OLD.company_id),
    auth.uid(),
    'job',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      WHEN TG_OP = 'DELETE' THEN 'deleted'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'changes', CASE 
        WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
        ELSE jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply activity logging to all job-related tables
CREATE TRIGGER log_jobs_activity
    AFTER INSERT OR UPDATE OR DELETE ON jobs
    FOR EACH ROW EXECUTE FUNCTION log_job_activity();

CREATE TRIGGER log_job_locations_activity
    AFTER INSERT OR UPDATE OR DELETE ON job_locations
    FOR EACH ROW EXECUTE FUNCTION log_job_activity();

CREATE TRIGGER log_job_compensation_activity
    AFTER INSERT OR UPDATE OR DELETE ON job_compensation
    FOR EACH ROW EXECUTE FUNCTION log_job_activity();
