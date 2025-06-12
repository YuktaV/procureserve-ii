-- RLS Policies and Performance Indexes

-- RLS Policies for multi-tenant isolation
CREATE POLICY "Company isolation" ON companies FOR ALL USING (id = (
  SELECT company_id FROM users WHERE id = auth.uid()
) OR auth.uid() IN (
  SELECT id FROM users WHERE role = 'admin'
));

CREATE POLICY "Users can access their company data" ON users FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Jobs are company-scoped" ON jobs FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Candidates are accessible by company users" ON candidates FOR ALL USING (
  id IN (
    SELECT candidate_id FROM applications 
    WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
  )
);

CREATE POLICY "Applications are company-scoped" ON applications FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Configurable enums are company-scoped" ON configurable_enums FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Vendors are company-scoped" ON vendors FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Interviews are company-scoped" ON interviews FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "Activity logs are company-scoped" ON activity_logs FOR ALL USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);

-- Indexes for performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_applications_company_id ON applications(company_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_configurable_enums_company_category ON configurable_enums(company_id, category);

-- Vector similarity search indexes
CREATE INDEX ON jobs USING ivfflat (vector_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON candidates USING ivfflat (vector_embedding vector_cosine_ops) WITH (lists = 100);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configurable_enums_updated_at BEFORE UPDATE ON configurable_enums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
