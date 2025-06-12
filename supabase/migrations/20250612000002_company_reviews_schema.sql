-- Add company_reviews table for registration tracking
-- This table tracks the review history of company registrations

CREATE TABLE company_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  review_status TEXT NOT NULL CHECK (review_status IN ('submitted', 'under_review', 'approved', 'rejected', 'suspended')),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_company_reviews_company_id ON company_reviews(company_id);
CREATE INDEX idx_company_reviews_reviewed_at ON company_reviews(reviewed_at DESC);

-- Add RLS policy for company_reviews
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see reviews for their own company
CREATE POLICY "Company reviews are company-scoped" ON company_reviews 
FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

-- Add missing columns to companies table if they don't exist
ALTER TABLE companies ADD COLUMN IF NOT EXISTS registration_status TEXT DEFAULT 'draft' 
  CHECK (registration_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended'));
ALTER TABLE companies ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create trigger to update companies table when reviews are added
CREATE OR REPLACE FUNCTION update_company_status_from_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE companies 
  SET 
    registration_status = NEW.review_status,
    reviewed_at = NEW.reviewed_at,
    rejection_reason = CASE 
      WHEN NEW.review_status = 'rejected' THEN NEW.review_notes 
      ELSE NULL 
    END
  WHERE id = NEW.company_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_status
  AFTER INSERT ON company_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_company_status_from_review();

-- Add activity logging for company status changes
CREATE OR REPLACE FUNCTION log_company_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when registration status changes
  IF OLD.registration_status IS DISTINCT FROM NEW.registration_status THEN
    INSERT INTO activity_logs (
      entity_type,
      entity_id,
      action,
      changes,
      user_id,
      company_id
    ) VALUES (
      'company',
      NEW.id,
      'status_changed',
      jsonb_build_object(
        'old_status', OLD.registration_status,
        'new_status', NEW.registration_status,
        'rejection_reason', NEW.rejection_reason
      ),
      auth.uid(),
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_company_status_change
  AFTER UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION log_company_status_change();
