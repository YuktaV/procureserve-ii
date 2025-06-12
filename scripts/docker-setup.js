#!/usr/bin/env node

/**
 * Docker Supabase Integration Script
 * 
 * Uses Docker-based Supabase instead of scripts for production alignment
 * Usage: npm run docker-setup
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function dockerSupabaseSetup() {
  console.log('🐳 Setting up Docker-based Supabase workflow...')
  
  try {
    // Check if Docker is running
    await execAsync('docker ps')
    console.log('✅ Docker is running')
    
    // Stop any existing Supabase containers
    try {
      await execAsync('docker stop $(docker ps -q --filter "name=supabase")')
      console.log('✅ Stopped existing Supabase containers')
    } catch (e) {
      // No containers to stop
    }
    
    // Start Supabase with Docker
    await execAsync('npx supabase start')
    console.log('✅ Supabase started with Docker')
    
    // Get connection details
    const { stdout } = await execAsync('npx supabase status')
    console.log('\n📊 Supabase Status:')
    console.log(stdout)
    
    // Create environment file with Docker endpoints
    const envContent = `# Docker Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Database Direct Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Studio
SUPABASE_STUDIO_URL=http://localhost:54323
`
    
    await execAsync(`echo '${envContent}' > apps/customer-app/.env.local`)
    console.log('✅ Created environment file for customer app')
    
  } catch (error) {
    console.error('❌ Docker setup failed:', error.message)
    process.exit(1)
  }
}

dockerSupabaseSetup().catch(console.error)
