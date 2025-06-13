import { createSupabaseAdminClient } from '../supabase-admin'
import type { 
  ConsoleUser, 
  ConsoleRole, 
  Permission, 
  SecurityEvent,
  LoginCredentials,
  AuthResponse 
} from '$types/auth.types'
import { randomUUID } from 'crypto'

const DEBUG_AUTH = process.env.NODE_ENV === 'development'

function log(message: string, data?: any) {
  if (DEBUG_AUTH) {
    console.log(`[CONSOLE-AUTH] ${message}`, data || '')
  }
}

export class ConsoleAuthManager {
  private supabase = createSupabaseAdminClient()

  /**
   * Authenticate console user with enhanced security
   */
  async authenticateUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      log('Authenticating console user', { email: credentials.email })

      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        await this.logSecurityEvent({
          event_type: 'login_failed',
          user_id: '',
          user_email: credentials.email,
          user_role: 'company_manager',
          success: false,
          error_message: authError.message,
          timestamp: new Date().toISOString()
        })
        
        return {
          success: false,
          error: 'Invalid credentials'
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Authentication failed'
        }
      }

      // Get console user data with permissions
      const consoleUser = await this.getConsoleUser(authData.user.id)
      
      if (!consoleUser) {
        await this.logSecurityEvent({
          event_type: 'login_failed',
          user_id: authData.user.id,
          user_email: credentials.email,
          user_role: 'company_manager',
          success: false,
          error_message: 'User not found in console_users table',
          timestamp: new Date().toISOString()
        })

        return {
          success: false,
          error: 'Access denied - not a console user'
        }
      }

      if (!consoleUser.is_active) {
        return {
          success: false,
          error: 'Account is inactive'
        }
      }

      // Update last login
      await this.updateLastLogin(consoleUser.id)

      // Log successful login
      await this.logSecurityEvent({
        event_type: 'login',
        user_id: consoleUser.id,
        user_email: consoleUser.email,
        user_role: consoleUser.role,
        success: true,
        timestamp: new Date().toISOString()
      })

      log('Console user authenticated successfully', { 
        userId: consoleUser.id, 
        role: consoleUser.role 
      })

      return {
        success: true,
        user: consoleUser,
        session: {
          user: consoleUser,
          access_token: authData.session?.access_token || '',
          refresh_token: authData.session?.refresh_token || '',
          expires_at: authData.session?.expires_at || 0,
          created_at: Date.now()
        }
      }

    } catch (error) {
      log('Authentication error', error)
      return {
        success: false,
        error: 'Authentication failed'
      }
    }
  }

  /**
   * Get console user with permissions
   */
  async getConsoleUser(userId: string): Promise<ConsoleUser | null> {
    try {
      const { data: userData, error: userError } = await this.supabase
        .from('console_users' as any)
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (userError || !userData) {
        log('Console user not found', { userId, error: userError })
        return null
      }

      // Get permissions separately to avoid type issues
      const { data: permissionsData } = await this.supabase
        .from('console_user_permissions' as any)
        .select('resource, actions, company_id')
        .eq('user_id', userId)

      const permissions: Permission[] = permissionsData?.map((p: any) => ({
        resource: p.resource,
        actions: p.actions,
        company_id: p.company_id
      })) || []

      const user = userData as any
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        company_ids: user.company_ids || [],
        permissions,
        last_login: user.last_login,
        mfa_enabled: user.mfa_enabled || false,
        created_at: user.created_at,
        updated_at: user.updated_at,
        is_active: user.is_active
      }

    } catch (error) {
      log('Error fetching console user', error)
      return null
    }
  }

  /**
   * Validate user has required role
   */
  async validateRole(userId: string, requiredRole: ConsoleRole): Promise<boolean> {
    const user = await this.getConsoleUser(userId)
    if (!user) return false

    const roleHierarchy: Record<ConsoleRole, number> = {
      'super_admin': 3,
      'company_admin': 2,
      'company_manager': 1
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  /**
   * Validate user has permission for resource/action
   */
  async validatePermission(
    userId: string, 
    resource: string, 
    action: string, 
    companyId?: string
  ): Promise<boolean> {
    const user = await this.getConsoleUser(userId)
    if (!user) return false

    // Super admins have all permissions
    if (user.role === 'super_admin') return true

    // Check specific permissions
    return user.permissions.some(permission => 
      permission.resource === resource &&
      permission.actions.includes(action as any) &&
      (!companyId || !permission.company_id || permission.company_id === companyId)
    )
  }

  /**
   * Log security events for audit trail
   */
  async logSecurityEvent(event: Omit<SecurityEvent, 'id'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('console_security_events' as any)
        .insert({
          id: randomUUID(),
          ...event,
          timestamp: event.timestamp || new Date().toISOString()
        })

      if (error) {
        console.error('Failed to log security event:', error)
      }
    } catch (error) {
      console.error('Error logging security event:', error)
    }
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('console_users' as any)
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
    } catch (error) {
      log('Error updating last login', error)
    }
  }

  /**
   * Get console user by email address
   */
  async getConsoleUserByEmail(email: string): Promise<ConsoleUser | null> {
    try {
      const { data, error } = await this.supabase
        .from('console_users' as any)
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        log('Error fetching console user by email', error)
        return null
      }

      return data as any
    } catch (error) {
      log('Exception fetching console user by email', error)
      return null
    }
  }

  /**
   * Create console user invitation
   */
  async inviteUser(
    email: string,
    role: ConsoleRole,
    companyId: string,
    permissions: Permission[],
    invitedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await this.supabase
        .from('console_users' as any)
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { success: false, error: 'User already exists' }
      }

      // Create invitation
      const invitationId = randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

      const { error: inviteError } = await this.supabase
        .from('console_user_invitations' as any)
        .insert({
          id: invitationId,
          email,
          role,
          company_id: companyId,
          invited_by: invitedBy,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })

      if (inviteError) {
        return { success: false, error: 'Failed to create invitation' }
      }

      // Log security event
      await this.logSecurityEvent({
        event_type: 'user_invited',
        user_id: invitedBy,
        user_email: email,
        user_role: role,
        success: true,
        metadata: { invited_email: email, company_id: companyId },
        timestamp: new Date().toISOString()
      })

      return { success: true }

    } catch (error) {
      return { success: false, error: 'Failed to invite user' }
    }
  }
}