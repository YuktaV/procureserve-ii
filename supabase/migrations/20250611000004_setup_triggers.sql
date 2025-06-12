-- Add missing trigger function for updated_at timestamps
-- This function is referenced in other migrations

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add missing fields to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS recruitment_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS bench_sales_enabled BOOLEAN DEFAULT true;

-- Add triggers for existing tables that need updated_at automation
CREATE TRIGGER trigger_update_companies_timestamp
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_configurable_enums_timestamp
  BEFORE UPDATE ON configurable_enums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_jobs_timestamp
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
