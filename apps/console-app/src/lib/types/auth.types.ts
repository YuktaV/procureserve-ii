// Console-specific user types with security model
export interface ConsoleUser {
  id: string
  email: string
  role: ConsoleRole
  company_ids: string[]  // Super admins can access multiple companies
  permissions: Permission[]
  last_login: string | null
  mfa_enabled: boolean
  created_at: string
  updated_at: string
  is_active: boolean
}

export type ConsoleRole = 'super_admin' | 'company_admin' | 'company_manager'

export interface Permission {
  resource: PermissionResource
  actions: PermissionAction[]
  company_id?: string  // null for super_admin global permissions
}

export type PermissionResource = 
  | 'enums' 
  | 'companies' 
  | 'users' 
  | 'settings' 
  | 'audit_logs' 
  | 'analytics'

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage'

// Authentication types
export interface ConsoleSession {
  user: ConsoleUser
  access_token: string
  refresh_token: string
  expires_at: number
  created_at: number
}

export interface LoginCredentials {
  email: string
  password: string
  mfa_code?: string
}

export interface AuthResponse {
  success: boolean
  user?: ConsoleUser
  session?: ConsoleSession
  error?: string
  requires_mfa?: boolean
}

// Security event types for audit logging
export interface SecurityEvent {
  id?: string
  event_type: SecurityEventType
  user_id: string
  user_email: string
  user_role: ConsoleRole
  resource?: string
  resource_id?: string
  action?: string
  ip_address?: string
  user_agent?: string
  success: boolean
  error_message?: string
  metadata?: Record<string, any>
  timestamp: string
  company_id?: string
}

export type SecurityEventType = 
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_reset'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'permission_granted'
  | 'permission_revoked'
  | 'enum_created'
  | 'enum_updated'
  | 'enum_deleted'
  | 'company_created'
  | 'company_updated'
  | 'user_invited'
  | 'user_activated'
  | 'user_deactivated'
  | 'settings_updated'
  | 'bulk_operation'
  | 'data_export'
  | 'suspicious_activity'