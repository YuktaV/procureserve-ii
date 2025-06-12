// Password validation
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  const isValid = errors.length === 0
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (password.length >= 12 && isValid) {
    strength = 'strong'
  } else if (password.length >= 8 && isValid) {
    strength = 'medium'
  }
  
  return { isValid, errors, strength }
}
