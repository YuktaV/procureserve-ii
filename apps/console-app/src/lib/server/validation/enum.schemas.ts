import { z } from 'zod'

// Core enum value schema
export const enumValueSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .max(30, 'Key must be 30 characters or less')
    .regex(/^[a-z0-9_]+$/, 'Key must contain only lowercase letters, numbers, and underscores'),
  label: z
    .string()
    .min(1, 'Label is required')
    .max(100, 'Label must be 100 characters or less'),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF5733)'),
  active: z.boolean().default(true),
  sort_order: z
    .number()
    .min(0, 'Sort order must be 0 or greater')
    .max(999, 'Sort order must be 999 or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
})

// Enum category validation
export const enumCategorySchema = z.enum([
  'work_authorization_types',
  'job_statuses',
  'candidate_statuses',
  'application_statuses',  
  'priority_levels',
  'interview_types',
  'skill_levels',
  'employment_types',
  'custom'
])

// Create enum schema
export const createEnumSchema = z.object({
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be 50 characters or less')
    .regex(/^[a-z_]+$/, 'Category must contain only lowercase letters and underscores'),
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be 100 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
  values: z
    .array(enumValueSchema)
    .min(1, 'At least one enum value is required')
    .max(50, 'Maximum 50 enum values allowed')
    .refine(
      (values) => {
        const keys = values.map(v => v.key)
        return keys.length === new Set(keys).size
      },
      { message: 'Enum value keys must be unique' }
    )
    .refine(
      (values) => values.some(v => v.active),
      { message: 'At least one enum value must be active' }
    ),
  company_id: z.string().uuid('Invalid company ID'),
  metadata: z.object({
    is_system: z.boolean().default(false),
    is_required: z.boolean().default(true),
    max_values: z.number().min(1).max(100).optional(),
    allow_custom_colors: z.boolean().default(true),
    validation_rules: z.array(z.object({
      type: z.enum(['regex', 'length', 'custom']),
      rule: z.string(),
      message: z.string()
    })).optional()
  }).optional()
})

// Update enum schema
export const updateEnumSchema = createEnumSchema.partial().extend({
  id: z.string().uuid('Invalid enum ID'),
  version: z.number().min(1).optional()
})

// Bulk operation schemas
export const bulkEnumOperationSchema = z.object({
  operation_type: z.enum(['import', 'export', 'duplicate', 'bulk_update']),
  target_category: enumCategorySchema.optional(),
  target_company_id: z.string().uuid().optional(),
  data: z.array(z.any()).max(1000),
  options: z.object({
    merge_strategy: z.enum(['replace', 'merge', 'append']).default('merge'),
    validate_only: z.boolean().default(false),
    preserve_ids: z.boolean().default(false),
    batch_size: z.number().min(1).max(100).default(10)
  })
})

// Enum reorder schema
export const reorderEnumValuesSchema = z.object({
  enum_id: z.string().uuid(),
  values: z.array(z.object({
    key: z.string(),
    sort_order: z.number().min(0).max(999)
  })).min(1)
})

// Export validation schemas
export const enumValidationSchemas = {
  enumValue: enumValueSchema,
  enumCategory: enumCategorySchema,
  createEnum: createEnumSchema,
  updateEnum: updateEnumSchema,
  bulkOperation: bulkEnumOperationSchema,
  reorderValues: reorderEnumValuesSchema
}

// Helper function to validate enum data
export function validateEnumData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}

// Predefined enum categories with metadata
export const ENUM_CATEGORIES = {
  work_authorization_types: {
    label: 'Work Authorization Types',
    description: 'Types of work authorization status for candidates',
    common_values: [
      { key: 'us_citizen', label: 'US Citizen', color: '#22c55e' },
      { key: 'green_card', label: 'Green Card', color: '#3b82f6' },
      { key: 'h1b', label: 'H1B Visa', color: '#f59e0b' },
      { key: 'opt', label: 'OPT', color: '#8b5cf6' },
      { key: 'tn_visa', label: 'TN Visa', color: '#06b6d4' }
    ]
  },
  job_statuses: {
    label: 'Job Statuses',
    description: 'Current status of job postings',
    common_values: [
      { key: 'draft', label: 'Draft', color: '#6b7280' },
      { key: 'open', label: 'Open', color: '#22c55e' },
      { key: 'in_progress', label: 'In Progress', color: '#f59e0b' },
      { key: 'on_hold', label: 'On Hold', color: '#ef4444' },
      { key: 'closed', label: 'Closed', color: '#374151' }
    ]
  },
  candidate_statuses: {
    label: 'Candidate Statuses',
    description: 'Current status of candidates in the system',
    common_values: [
      { key: 'new', label: 'New', color: '#3b82f6' },
      { key: 'active', label: 'Active', color: '#22c55e' },
      { key: 'interviewing', label: 'Interviewing', color: '#f59e0b' },
      { key: 'placed', label: 'Placed', color: '#10b981' },
      { key: 'inactive', label: 'Inactive', color: '#6b7280' }
    ]
  },
  application_statuses: {
    label: 'Application Statuses',
    description: 'Status of job applications',
    common_values: [
      { key: 'submitted', label: 'Submitted', color: '#3b82f6' },
      { key: 'screening', label: 'Screening', color: '#f59e0b' },
      { key: 'interview', label: 'Interview', color: '#8b5cf6' },
      { key: 'offer', label: 'Offer', color: '#22c55e' },
      { key: 'hired', label: 'Hired', color: '#10b981' },
      { key: 'rejected', label: 'Rejected', color: '#ef4444' }
    ]
  },
  priority_levels: {
    label: 'Priority Levels',
    description: 'Priority levels for tasks and jobs',
    common_values: [
      { key: 'critical', label: 'Critical', color: '#ef4444' },
      { key: 'high', label: 'High', color: '#f59e0b' },
      { key: 'medium', label: 'Medium', color: '#3b82f6' },
      { key: 'low', label: 'Low', color: '#6b7280' }
    ]
  },
  skill_levels: {
    label: 'Skill Levels',
    description: 'Proficiency levels for skills and competencies',
    common_values: [
      { key: 'beginner', label: 'Beginner', color: '#ef4444' },
      { key: 'intermediate', label: 'Intermediate', color: '#f59e0b' },
      { key: 'advanced', label: 'Advanced', color: '#22c55e' },
      { key: 'expert', label: 'Expert', color: '#8b5cf6' }
    ]
  },
  employment_types: {
    label: 'Employment Types',
    description: 'Types of employment arrangements',
    common_values: [
      { key: 'full_time', label: 'Full Time', color: '#22c55e' },
      { key: 'part_time', label: 'Part Time', color: '#3b82f6' },
      { key: 'contract', label: 'Contract', color: '#f59e0b' },
      { key: 'temporary', label: 'Temporary', color: '#8b5cf6' },
      { key: 'internship', label: 'Internship', color: '#06b6d4' }
    ]
  },
  interview_types: {
    label: 'Interview Types',
    description: 'Different types of interviews',
    common_values: [
      { key: 'phone', label: 'Phone Screen', color: '#3b82f6' },
      { key: 'video', label: 'Video Interview', color: '#22c55e' },
      { key: 'in_person', label: 'In Person', color: '#f59e0b' },
      { key: 'technical', label: 'Technical', color: '#8b5cf6' },
      { key: 'panel', label: 'Panel Interview', color: '#ef4444' }
    ]
  },
  custom: {
    label: 'Custom Category',
    description: 'Create your own custom enum category',
    common_values: []
  }
} as const
