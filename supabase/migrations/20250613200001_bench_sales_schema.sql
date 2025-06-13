-- Bench Sales Database Schema Extension
-- Supporting the second process: selling consultants to client projects

-- Consultants table (people on the bench available for placement)
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  skills JSONB DEFAULT '[]',
  experience_level TEXT, -- Configurable via console
  work_authorization TEXT, -- Configurable via console
  hourly_rate DECIMAL(10,2),
  preferred_rate DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available', -- available, placed, unavailable
  bench_start_date DATE,
  resume_url TEXT,
  resume_text TEXT,
  notes JSONB DEFAULT '[]',
  vector_embedding vector(1536), -- For AI matching
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table (companies that hire our consultants)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address JSONB DEFAULT '{}',
  preferred_rates JSONB DEFAULT '{}', -- Rate preferences by skill/level
  payment_terms TEXT,
  relationship_status TEXT DEFAULT 'active', -- active, inactive, prospect
  notes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (specific client engagements)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills JSONB DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  estimated_duration TEXT, -- "3 months", "6 months", etc.
  hourly_rate DECIMAL(10,2),
  project_value DECIMAL(12,2),
  status TEXT DEFAULT 'draft', -- draft, active, on_hold, completed, cancelled
  location_type TEXT DEFAULT 'remote', -- remote, hybrid, onsite
  location_details TEXT,
  requirements JSONB DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placements table (consultant-project assignments)
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  hourly_rate DECIMAL(10,2) NOT NULL,
  weekly_hours INTEGER DEFAULT 40,
  status TEXT DEFAULT 'active', -- active, completed, terminated, on_hold
  performance_rating INTEGER, -- 1-5 scale
  notes JSONB DEFAULT '[]',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant Availability History (track bench periods)
CREATE TABLE consultant_availability_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES consultants(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- available, placed, unavailable, terminated
  start_date DATE NOT NULL,
  end_date DATE,
  reason TEXT, -- "project_end", "client_request", "performance", etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_availability_history ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
CREATE POLICY "Consultants are company-scoped" ON consultants FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Clients are company-scoped" ON clients FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Projects are company-scoped" ON projects FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Placements are company-scoped" ON placements FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Consultant availability history is company-scoped" ON consultant_availability_history FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

-- Indexes for performance
CREATE INDEX idx_consultants_company_id ON consultants(company_id);
CREATE INDEX idx_consultants_availability_status ON consultants(availability_status);
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_placements_company_id ON placements(company_id);
CREATE INDEX idx_placements_consultant_id ON placements(consultant_id);
CREATE INDEX idx_placements_project_id ON placements(project_id);
