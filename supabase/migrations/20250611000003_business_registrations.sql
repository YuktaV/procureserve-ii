-- Migration to add business registration tracking
-- Date: 2025-06-11

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create business registrations table for tracking company signups
CREATE TABLE business_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_person_name TEXT NOT NULL,
  contact_person_title TEXT,
  contact_person_email TEXT NOT NULL,
  contact_person_phone TEXT,
  company_name TEXT NOT NULL,
  company_domain TEXT NOT NULL,
  company_phone TEXT,
  company_address TEXT,
  decision_maker_name TEXT,
  decision_maker_title TEXT,
  decision_maker_email TEXT,
  hear_about TEXT,
  comments TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, activated
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  activated_company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger to update timestamp
CREATE TRIGGER trigger_update_business_registrations_timestamp
  BEFORE UPDATE ON business_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for efficient queries
CREATE INDEX idx_business_registrations_status ON business_registrations(status);
CREATE INDEX idx_business_registrations_email ON business_registrations(contact_person_email);
CREATE INDEX idx_business_registrations_domain ON business_registrations(company_domain);

-- Enable RLS
ALTER TABLE business_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for business registrations
-- Only admins and the registrant can see their registration
CREATE POLICY "Business registrations are viewable by admins and registrant" ON business_registrations
FOR SELECT USING (
  -- Admin users can see all registrations
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
  OR
  -- Registrants can see their own registration
  contact_person_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- Only allow inserts from public (no auth required for registration)
CREATE POLICY "Allow public registration" ON business_registrations
FOR INSERT WITH CHECK (true);

-- Only admins can update registrations
CREATE POLICY "Only admins can update business registrations" ON business_registrations
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Function to activate a business registration
CREATE OR REPLACE FUNCTION activate_business_registration(
  registration_id UUID,
  reviewer_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
  registration_record business_registrations;
  new_company_id UUID;
  new_user_id UUID;
  temp_password TEXT;
BEGIN
  -- Get registration details
  SELECT * INTO registration_record 
  FROM business_registrations 
  WHERE id = registration_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registration not found or already processed';
  END IF;
  
  -- Create company
  INSERT INTO companies (
    name,
    domain,
    settings,
    recruitment_enabled,
    bench_sales_enabled
  ) VALUES (
    registration_record.company_name,
    registration_record.company_domain,
    '{"onboarding_completed": false}',
    true,
    true
  ) RETURNING id INTO new_company_id;
  
  -- Generate temporary password (they'll reset via email)
  temp_password := 'temp_' || substring(md5(random()::text) from 1 for 12);
  
  -- Create admin user account in auth.users via Supabase Auth API
  -- This would typically be done via the Supabase API, but for now we'll create a placeholder
  -- The actual user creation should be done via the application layer
  
  -- Create user record in our users table
  INSERT INTO users (
    id,
    email,
    role,
    company_id
  ) VALUES (
    uuid_generate_v4(), -- This will be replaced with actual auth user ID
    registration_record.contact_person_email,
    'admin',
    new_company_id
  ) RETURNING id INTO new_user_id;
  
  -- Update registration status
  UPDATE business_registrations 
  SET 
    status = 'activated',
    reviewed_by = reviewer_user_id,
    reviewed_at = NOW(),
    activated_company_id = new_company_id,
    updated_at = NOW()
  WHERE id = registration_id;
  
  -- Log the activation
  INSERT INTO activity_logs (
    company_id,
    user_id,
    entity_type,
    entity_id,
    action,
    details
  ) VALUES (
    new_company_id,
    reviewer_user_id,
    'business_registration',
    registration_id,
    'activated',
    jsonb_build_object(
      'company_name', registration_record.company_name,
      'contact_email', registration_record.contact_person_email
    )
  );
  
  RETURN new_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for registration management
CREATE VIEW business_registration_summary AS
SELECT 
  br.*,
  c.name as activated_company_name,
  u.email as reviewer_email
FROM business_registrations br
LEFT JOIN companies c ON br.activated_company_id = c.id
LEFT JOIN users u ON br.reviewed_by = u.id;

-- Grant permissions
GRANT SELECT ON business_registration_summary TO authenticated;
