// Re-export all types for easy importing
export * from './auth.types'
export * from './enum.types'
export * from './company.types'

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  metadata?: {
    page?: number
    limit?: number
    total?: number
    has_more?: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  company_id?: string
  category?: string
  active?: boolean
  created_after?: string
  created_before?: string
  updated_after?: string
  updated_before?: string
}

// Form types
export interface FormState<T = any> {
  data: T
  errors: Record<string, string>
  loading: boolean
  touched: Record<string, boolean>
  dirty: boolean
  valid: boolean
}

export interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'textarea' | 'color' | 'number'
  label: string
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
  options?: { value: string; label: string }[]
  help_text?: string
}

// Component props types
export interface BaseComponentProps {
  class?: string
  id?: string
  'data-testid'?: string
}

export interface LoadingState {
  loading: boolean
  error?: string
  data?: any
}

// Event types for real-time updates
export interface RealtimeEvent<T = any> {
  event_type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: T
  old_record?: T
  timestamp: string
  user_id?: string
}

// Navigation types
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  active?: boolean
  permissions?: Permission[]
  children?: NavigationItem[]
  badge?: {
    text: string
    color: string
  }
}

// Toast/notification types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: ToastAction[]
}

export interface ToastAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}