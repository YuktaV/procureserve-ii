// Shared TypeScript types for ProcureServe II
// This file contains types used across both customer and console applications

export interface User {
  id: string
  email: string
  company_id: string
  role: UserRole
  profile: UserProfile
  created_at: string
  updated_at: string
}

export interface UserProfile {
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  preferences?: Record<string, any>
}

export interface Company {
  id: string
  name: string
  domain: string
  settings: CompanySettings
  created_at: string
  updated_at: string
}

export interface CompanySettings {
  // All enums are now configurable via console!
  work_authorization_types?: string[]
  employment_types?: string[]
  experience_levels?: string[]
  job_statuses?: string[]
  candidate_statuses?: string[]
  application_statuses?: string[]
  notification_preferences?: Record<string, boolean>
  ai_settings?: {
    enabled: boolean
    resume_parsing: boolean
    candidate_matching: boolean
    job_suggestions: boolean
  }
}

export interface Job {
  id: string
  company_id: string
  title: string
  description: string
  requirements: JobRequirements
  status: string // Configurable via console
  vector_embedding?: number[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface JobRequirements {
  experience_level?: string // Configurable
  employment_type?: string // Configurable
  work_authorization?: string[] // Configurable
  skills: string[]
  location?: string
  salary_range?: {
    min: number
    max: number
    currency: string
  }
}

export interface Candidate {
  id: string
  email: string
  name: string
  phone?: string
  resume_text?: string
  resume_url?: string
  skills: string[]
  experience_level?: string // Configurable
  work_authorization?: string // Configurable
  vector_embedding?: number[]
  status: string // Configurable
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  company_id: string
  status: string // Configurable via console
  notes: ApplicationNote[]
  attachments?: string[]
  created_at: string
  updated_at: string
}

export interface ApplicationNote {
  id: string
  content: string
  created_by: string
  created_at: string
  type: 'comment' | 'status_change' | 'interview_scheduled'
}

// Configurable enum management
export interface ConfigurableEnum {
  id: string
  company_id: string
  category: EnumCategory
  values: EnumValue[]
  created_at: string
  updated_at: string
}

export interface EnumValue {
  key: string
  label: string
  description?: string
  color?: string
  order: number
  active: boolean
}

export type EnumCategory = 
  | 'work_authorization_types'
  | 'employment_types'
  | 'experience_levels'
  | 'job_statuses'
  | 'candidate_statuses'
  | 'application_statuses'

export type UserRole = 'admin' | 'recruiter' | 'manager' | 'viewer'

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    has_more: boolean
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  company_name: string
  first_name: string
  last_name: string
}
// Enhanced Job interfaces for multi-location system
// Extends existing job types with comprehensive location support

export interface JobLocation {
  id: string
  job_id: string
  company_id: string
  location_type: 'office' | 'remote' | 'hybrid'
  is_primary: boolean
  
  // Address information
  country?: string
  state_province?: string
  city?: string
  address_line1?: string
  address_line2?: string
  postal_code?: string
  timezone?: string
  
  // Location-specific settings
  headcount: number
  local_requirements?: string
  hiring_manager_id?: string
  
  // Remote work options
  remote_countries_allowed?: string[]
  hybrid_days_in_office?: number
  travel_requirements?: string
  visa_sponsorship_available: boolean
  relocation_assistance_available: boolean
  
  created_at: string
  updated_at: string
}

export interface JobCompensation {
  id: string
  job_id: string
  job_location_id?: string
  company_id: string
  
  // Salary information
  salary_min?: number
  salary_max?: number
  salary_currency: string
  salary_frequency: 'hourly' | 'monthly' | 'annual'
  
  // Additional compensation
  bonus_eligible: boolean
  commission_eligible: boolean
  equity_eligible: boolean
  benefits_summary?: string
  
  // Location adjustments
  cost_of_living_adjustment: number
  
  created_at: string
  updated_at: string
}

export interface JobCustomField {
  id: string
  job_id: string
  company_id: string
  field_name: string
  field_type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select'
  field_value: any
  section: string
  display_order: number
  is_required: boolean
  is_visible: boolean
  validation_rules: Record<string, any>
  created_at: string
  updated_at: string
}

// Enhanced Job interface with multi-location support
export interface EnhancedJob extends Job {
  // Employment details
  employment_type?: string
  experience_level?: string
  department?: string
  reports_to?: string
  start_date?: string
  application_deadline?: string
  is_published: boolean
  published_at?: string
  closed_at?: string
  
  // Related data
  locations?: JobLocation[]
  compensation?: JobCompensation[]
  custom_fields?: JobCustomField[]
  
  // Computed fields
  primary_location?: JobLocation
  total_headcount?: number
  has_remote_options?: boolean
  countries_available?: string[]
}

// Job creation/update forms
export interface CreateJobForm {
  // Basic information
  title: string
  description: string
  employment_type: string
  experience_level: string
  department?: string
  reports_to?: string
  start_date?: string
  application_deadline?: string
  
  // Requirements
  skills_required: string[]
  skills_preferred?: string[]
  requirements: {
    education?: string
    experience_years?: number
    certifications?: string[]
    languages?: string[]
  }
  
  // Locations (unlimited)
  locations: Omit<JobLocation, 'id' | 'job_id' | 'company_id' | 'created_at' | 'updated_at'>[]
  
  // Compensation per location
  compensation: Omit<JobCompensation, 'id' | 'job_id' | 'company_id' | 'created_at' | 'updated_at'>[]
  
  // Custom fields
  custom_fields?: Omit<JobCustomField, 'id' | 'job_id' | 'company_id' | 'created_at' | 'updated_at'>[]
}

// Job search and filtering
export interface JobSearchFilters {
  title?: string
  location_type?: ('office' | 'remote' | 'hybrid')[]
  countries?: string[]
  cities?: string[]
  employment_type?: string[]
  experience_level?: string[]
  salary_min?: number
  salary_max?: number
  skills?: string[]
  status?: string[]
  published_after?: string
  published_before?: string
  has_visa_sponsorship?: boolean
  has_relocation_assistance?: boolean
}

// Job posting workflow
export interface JobPostingSettings {
  auto_publish: boolean
  publish_to_job_boards: string[]
  require_approval: boolean
  approval_workflow: string[]
  notification_settings: {
    new_applications: boolean
    deadline_reminders: boolean
    status_changes: boolean
  }
}

// Company registration and review interfaces
export interface CompanyReview {
  id: string
  company_id: string
  reviewed_by?: string
  review_status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended'
  review_notes?: string
  reviewed_at: string
  created_at: string
}

// Enhanced Company interface with registration fields
export interface EnhancedCompany extends Company {
  registration_status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended'
  submitted_at?: string
  reviewed_at?: string
  rejection_reason?: string
  
  // Related data
  reviews?: CompanyReview[]
  latest_review?: CompanyReview
}

// Registration status tracking
export interface RegistrationTimeline {
  step: string
  title: string
  description: string
  completed: boolean
  completed_at?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

// Process access control types
export type ProcessType = 'recruitment' | 'bench_sales'

// Enhanced User interface with process permissions
export interface EnhancedUser extends User {
  process_permissions: ProcessType[]
  current_process?: ProcessType
  
  // Helper methods (computed)
  has_single_process?: boolean
  has_dual_process?: boolean
  needs_process_selection?: boolean
}

// Process selection data
export interface ProcessSelectionData {
  user: EnhancedUser
  available_processes: ProcessType[]
  requires_selection: boolean
  redirect_to?: string
}

// Process configuration
export interface ProcessConfig {
  recruitment: {
    name: string
    description: string
    icon: string
    color: string
    features: string[]
    dashboard_route: string
  }
  bench_sales: {
    name: string
    description: string
    icon: string
    color: string
    features: string[]
    dashboard_route: string
  }
}

// API request types
export interface SetProcessRequest {
  process: ProcessType
}

export interface UpdateUserProcessPermissionsRequest {
  user_id: string
  process_permissions: ProcessType[]
}

// Navigation context
export interface ProcessContext {
  current_process?: ProcessType
  available_processes: ProcessType[]
  can_switch_process: boolean
  switch_url?: string
}

// User Management Types for Phase 6
export interface UserInvitation {
  id: string
  company_id: string
  email: string
  role: UserRole
  process_permissions: ProcessType[]
  business_unit_id?: string
  invited_by: string
  invitation_token: string
  expires_at: string
  accepted_at?: string
  created_at: string
}

export interface BusinessUnit {
  id: string
  company_id: string
  name: string
  description?: string
  parent_id?: string
  manager_id?: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserManagementUser extends EnhancedUser {
  business_unit_id?: string
  last_login_at?: string
  is_active: boolean
  invited_by?: string
  accepted_invitation_at?: string
  business_unit?: BusinessUnit
  invited_by_user?: Pick<User, 'id' | 'email' | 'profile'>
}

export interface UserInviteForm {
  email: string
  role: UserRole
  process_permissions: ProcessType[]
  business_unit_id?: string
  message?: string
}

export interface UserEditForm {
  role: UserRole
  process_permissions: ProcessType[]
  business_unit_id?: string
  is_active: boolean
}

export interface UserSearchFilters {
  search?: string
  role?: UserRole[]
  process_permissions?: ProcessType[]
  business_unit_id?: string
  is_active?: boolean
  invited_status?: 'pending' | 'accepted'
}

export interface CompanyAuditLog {
  id: string
  company_id: string
  performed_by: string
  action_type: string
  target_user_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  performed_by_user?: Pick<User, 'id' | 'email' | 'profile'>
  target_user?: Pick<User, 'id' | 'email' | 'profile'>
}
