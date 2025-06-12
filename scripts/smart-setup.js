#!/usr/bin/env node

/**
 * Smart Supabase Setup Script
 * 
 * Handles both Docker and non-Docker setups automatically
 * Usage: npm run smart-setup
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function checkDockerStatus() {
  try {
    await execAsync('docker ps')
    return true
  } catch (error) {
    return false
  }
}

async function killSupabasePorts() {
  const ports = [54321, 54322, 54323, 54324, 54325, 54326, 54327]
  
  for (const port of ports) {
    try {
      const { stdout } = await execAsync(`lsof -ti:${port}`)
      if (stdout.trim()) {
        await execAsync(`kill -9 ${stdout.trim()}`)
        console.log(`✅ Cleared port ${port}`)
      }
    } catch (error) {
      // Port already free
    }
  }
}

async function setupSupabase() {
  console.log('🔧 PSII Smart Setup Starting...')
  
  // Clear ports first
  await killSupabasePorts()
  
  // Check Docker availability
  const dockerAvailable = await checkDockerStatus()
  
  if (dockerAvailable) {
    console.log('🐳 Docker detected - using Docker-based Supabase')
    try {
      await execAsync('npx supabase start')
      console.log('✅ Docker Supabase started on standard ports')
    } catch (error) {
      console.error('❌ Docker Supabase failed:', error.message)
      return
    }
  } else {
    console.log('⚠️  Docker not available - using fallback setup')
    console.log('Please start Docker Desktop and run: npm run smart-setup')
    return
  }
  
  // Get status
  try {
    const { stdout } = await execAsync('npx supabase status')
    console.log('\n📊 Supabase Status:')
    console.log(stdout)
    
    // Create .env files
    const envContent = `VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU`
    
    await execAsync(`echo '${envContent}' > apps/customer-app/.env.local`)
    console.log('✅ Environment file created')
    
    console.log('\n🎯 Next Steps:')
    console.log('1. Set SUPABASE_ACCESS_TOKEN for MCP integration')
    console.log('2. Use Supabase MCP tools instead of scripts')
    console.log('3. Test at: http://localhost:3004/test-users')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupSupabase().catch(console.error)
