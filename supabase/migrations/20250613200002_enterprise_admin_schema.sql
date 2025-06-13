-- Enterprise Admin Settings Schema Extension
-- Supporting company administration, user management, and business units

-- Enhance companies table with admin settings
ALTER TABLE companies ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{
  "monday": {"start": "09:00", "end": "17:00", "enabled": true},
  "tuesday": {"start": "09:00", "end": "17:00", "enabled": true},
  "wednesday": {"start": "09:00", "end": "17:00", "enabled": true},
  "thursday": {"start": "09:00", "end": "17:00", "enabled": true},
  "friday": {"start": "09:00", "end": "17:00", "enabled": true},
  "saturday": {"start": "09:00", "end": "17:00", "enabled": false},
  "sunday": {"start": "09:00", "end": "17:00", "enabled": false}
}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'));
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS description TEXT;

-- Business units/departments table
CREATE TABLE IF NOT EXISTS business_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES business_units(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES users(id),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User invitations table
CREATE TABLE IF NOT EXISTS user_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'recruiter', 'manager', 'viewer')) NOT NULL,
  process_permissions TEXT[] DEFAULT '{}',
  business_unit_id UUID REFERENCES business_units(id),
  invited_by UUID REFERENCES users(id),
  invitation_token UUID DEFAULT uuid_generate_v4(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance users table with admin fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_unit_id UUID REFERENCES business_units(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS accepted_invitation_at TIMESTAMP WITH TIME ZONE;

-- User sessions table for activity monitoring
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Company audit logs (admin actions)
CREATE TABLE IF NOT EXISTS company_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  performed_by UUID REFERENCES users(id),
  action_type TEXT NOT NULL, -- 'user_invited', 'user_role_changed', 'settings_updated', etc.
  target_user_id UUID REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on new tables
ALTER TABLE business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_audit_logs ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for admin tables
CREATE POLICY "Business units are company-scoped" ON business_units FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "User invitations are company-scoped" ON user_invitations FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "User sessions are company-scoped" ON user_sessions FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Company audit logs are company-scoped" ON company_audit_logs FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_units_company_id ON business_units(company_id);
CREATE INDEX IF NOT EXISTS idx_business_units_parent_id ON business_units(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_company_id ON user_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON user_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_company_id ON user_sessions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_audit_logs_company_id ON company_audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_users_business_unit_id ON users(business_unit_id);
