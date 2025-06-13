// Company management types
export interface ConsoleCompany {
  id: string
  name: string
  slug: string
  logo_url?: string
  settings: CompanySettings
  features: CompanyFeatures
  subscription: CompanySubscription
  created_at: string
  updated_at: string
  is_active: boolean
  user_count: number
  enum_count: number
}

export interface CompanySettings {
  timezone: string
  date_format: string
  language: string
  currency: string
  fiscal_year_start: string
  branding: CompanyBranding
  security: CompanySecuritySettings
  integrations: CompanyIntegrations
}

export interface CompanyBranding {
  primary_color: string
  secondary_color: string
  logo_url?: string
  favicon_url?: string
  custom_css?: string
}

export interface CompanySecuritySettings {
  require_mfa: boolean
  session_timeout_minutes: number
  password_policy: PasswordPolicy
  ip_whitelist: string[]
  audit_log_retention_days: number
}

export interface PasswordPolicy {
  min_length: number
  require_uppercase: boolean
  require_lowercase: boolean
  require_numbers: boolean
  require_symbols: boolean
  max_age_days: number
}

export interface CompanyIntegrations {
  email_provider?: EmailIntegration
  storage_provider?: StorageIntegration
  analytics_provider?: AnalyticsIntegration
}

export interface EmailIntegration {
  provider: 'sendgrid' | 'ses' | 'mailgun'
  api_key: string
  from_email: string
  from_name: string
}

export interface StorageIntegration {
  provider: 's3' | 'gcs' | 'azure'
  bucket_name: string
  region: string
  credentials: Record<string, string>
}

export interface AnalyticsIntegration {
  provider: 'google_analytics' | 'mixpanel' | 'posthog'
  tracking_id: string
  api_key?: string
}

export interface CompanyFeatures {
  enum_management: boolean
  user_management: boolean
  audit_logging: boolean
  analytics: boolean
  api_access: boolean
  custom_branding: boolean
  advanced_permissions: boolean
  bulk_operations: boolean
  data_export: boolean
  integrations: boolean
}

export interface CompanySubscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trial'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  limits: SubscriptionLimits
}

export interface SubscriptionLimits {
  max_users: number
  max_enums: number
  max_companies: number  // For super admins
  api_calls_per_month: number
  storage_gb: number
}

// User invitation and management
export interface ConsoleUserInvitation {
  id: string
  email: string
  role: ConsoleRole
  company_id: string
  invited_by: string
  invited_at: string
  expires_at: string
  accepted_at?: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  permissions: Permission[]
}

export interface UserManagementOperation {
  operation_type: 'invite' | 'activate' | 'deactivate' | 'update_role' | 'update_permissions'
  target_user_id?: string
  target_email?: string
  changes: Record<string, any>
  performed_by: string
  timestamp: string
}