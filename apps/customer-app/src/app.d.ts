import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import type { Database } from '../../packages/database-types'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>
      session: Session | null
      user: User | null
    }
    interface PageData {
      session: Session | null
      user: User | null
    }
  }
}

export {}
