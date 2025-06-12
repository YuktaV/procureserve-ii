// Email validation for business vs personal domains
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 
  'aol.com', 'icloud.com', 'live.com', 'msn.com'
]

export function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return PERSONAL_EMAIL_DOMAINS.includes(domain)
}

export function validateBusinessEmail(email: string): boolean {
  return !isPersonalEmail(email)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
