-- Add business registration fields to companies table
-- This enables the business registration and approval workflow

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS registration_status TEXT CHECK (registration_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS business_type TEXT CHECK (business_type IN ('staffing_agency', 'direct_employer')) DEFAULT 'staffing_agency',
ADD COLUMN IF NOT EXISTS legal_entity_type TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS business_address JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primary_contact JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estimated_annual_volume TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS time_zone TEXT DEFAULT 'America/New_York',
ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create business_documents table for file uploads
CREATE TABLE IF NOT EXISTS business_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'insurance_certificate', 'contact_id', 'other')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, document_type, file_name)
);

-- Enable RLS for business_documents
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;

-- Add trigger for business_documents
CREATE TRIGGER trigger_update_business_documents_timestamp
  BEFORE UPDATE ON business_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for business_documents
CREATE POLICY "Business documents are company-scoped" ON business_documents FOR ALL USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- Create registration_reviews table for ProcureServe staff reviews
CREATE TABLE IF NOT EXISTS registration_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  reviewed_by_email TEXT NOT NULL, -- ProcureServe staff email
  review_status TEXT NOT NULL CHECK (review_status IN ('approved', 'rejected', 'needs_clarification')),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for registration_reviews (ProcureServe staff only)
ALTER TABLE registration_reviews ENABLE ROW LEVEL SECURITY;

-- Index for faster registration queries
CREATE INDEX IF NOT EXISTS idx_companies_registration_status ON companies(registration_status);
CREATE INDEX IF NOT EXISTS idx_companies_submitted_at ON companies(submitted_at);
CREATE INDEX IF NOT EXISTS idx_business_documents_company_id ON business_documents(company_id);
