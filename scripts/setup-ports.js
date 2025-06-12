#!/usr/bin/env node

/**
 * Port Management & Supabase Setup Script
 * 
 * Kills processes on standard Supabase ports and ensures clean startup
 * Usage: npm run setup-ports
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const SUPABASE_PORTS = [54321, 54322, 54323, 54324, 54325, 54326, 54327]

async function killProcessOnPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`)
    if (stdout.trim()) {
      const pids = stdout.trim().split('\n')
      for (const pid of pids) {
        await execAsync(`kill -9 ${pid}`)
        console.log(`✅ Killed process ${pid} on port ${port}`)
      }
    }
  } catch (error) {
    // No process on port (which is good)
  }
}

async function setupPorts() {
  console.log('🔧 Cleaning up Supabase ports...')
  
  for (const port of SUPABASE_PORTS) {
    await killProcessOnPort(port)
  }
  
  console.log('✅ All Supabase ports cleared')
  console.log('🚀 Starting Supabase on standard ports...')
  
  try {
    await execAsync('npx supabase start')
    console.log('✅ Supabase started successfully')
  } catch (error) {
    console.error('❌ Error starting Supabase:', error.message)
  }
}

setupPorts().catch(console.error)
