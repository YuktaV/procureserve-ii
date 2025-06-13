// Enum management types with enhanced security
export interface ConfigurableEnum {
  id: string
  company_id: string
  category: EnumCategory
  values: EnumValue[]
  metadata: EnumMetadata
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  version: number
}

export interface EnumValue {
  key: string
  label: string
  color: string
  active: boolean
  sort_order: number
  description?: string
  metadata?: Record<string, any>
}

export interface EnumMetadata {
  display_name: string
  description?: string
  is_system: boolean  // System enums cannot be deleted
  is_required: boolean  // Required enums must have at least one active value
  max_values?: number
  allow_custom_colors: boolean
  validation_rules?: ValidationRule[]
  usage_count?: number  // How many records use this enum
}

export interface ValidationRule {
  type: 'regex' | 'length' | 'custom'
  rule: string
  message: string
}

export type EnumCategory = 
  | 'work_authorization_types'
  | 'job_statuses'
  | 'candidate_statuses'
  | 'application_statuses'
  | 'priority_levels'
  | 'interview_types'
  | 'skill_levels'
  | 'employment_types'
  | 'custom'

// Enum operation types for audit and real-time updates
export interface EnumOperation {
  id: string
  enum_id: string
  operation_type: EnumOperationType
  user_id: string
  changes: EnumChangeSet
  timestamp: string
  ip_address?: string
}

export type EnumOperationType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'bulk_update'
  | 'reorder'
  | 'activate'
  | 'deactivate'
  | 'import'
  | 'export'

export interface EnumChangeSet {
  before?: Partial<ConfigurableEnum>
  after?: Partial<ConfigurableEnum>
  affected_values?: string[]  // Keys of affected enum values
  operation_details?: Record<string, any>
}

// Bulk operations
export interface BulkEnumOperation {
  operation_type: 'import' | 'export' | 'duplicate' | 'bulk_update'
  target_category?: EnumCategory
  target_company_id?: string
  data: any[]
  options: BulkOperationOptions
}

export interface BulkOperationOptions {
  merge_strategy?: 'replace' | 'merge' | 'append'
  validate_only?: boolean
  preserve_ids?: boolean
  batch_size?: number
}

export interface BulkOperationResult {
  success: boolean
  processed_count: number
  error_count: number
  errors: BulkOperationError[]
  warnings: string[]
  operation_id: string
}

export interface BulkOperationError {
  row_index: number
  field: string
  error_message: string
  invalid_value: any
}