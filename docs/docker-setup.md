# PSII Docker-Based Setup Guide

## Overview

This guide transitions from script-based testing to Docker-based Supabase workflow for production alignment.

## Step 1: Supabase Access Token Setup

### Get Token
1. Go to https://supabase.com/dashboard
2. Account Settings → Access Tokens  
3. Generate new token
4. Copy token

### Set Environment Variable
```bash
# Add to ~/.zshrc or ~/.bash_profile
export SUPABASE_ACCESS_TOKEN="your_token_here"

# Reload shell
source ~/.zshrc

# Verify
echo $SUPABASE_ACCESS_TOKEN
```

## Step 2: Port Management

### Clean Setup (Recommended)
```bash
# Kill all processes on Supabase ports and start fresh
npm run setup-ports
```

### Manual Port Cleanup
```bash
# Find processes
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Kill if needed
sudo kill -9 $(lsof -ti:54321)
sudo kill -9 $(lsof -ti:54322)
sudo kill -9 $(lsof -ti:54323)
```

## Step 3: Docker-Based Workflow

### Quick Setup
```bash
# Complete Docker setup with environment files
npm run docker-setup
```

### Manual Docker Setup
```bash
# Start Supabase with Docker
npx supabase start

# Check status
npx supabase status
```

## Step 4: MCP Integration Testing

With proper token setup, you can now use Claude's Supabase MCP tools instead of scripts:

### Instead of Scripts:
```bash
# Old way
npm run create-test-users
npm run check-db
```

### Use MCP Tools:
- `list_projects` - List your Supabase projects
- `get_project` - Get project details
- `execute_sql` - Run SQL directly
- `apply_migration` - Apply database changes

## Environment Files

### Customer App (.env.local)
```bash
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

## Production Benefits

1. **Consistent Environment** - Docker mirrors production
2. **Direct Database Access** - MCP tools instead of scripts
3. **Standard Ports** - No conflicts, predictable URLs
4. **Environment Parity** - Local matches deployed setup

## Troubleshooting

### Port Conflicts
```bash
npm run setup-ports
```

### Docker Issues
```bash
docker ps
docker restart $(docker ps -q --filter "name=supabase")
```

### MCP Not Working
```bash
echo $SUPABASE_ACCESS_TOKEN
# Should show your token
```

This approach eliminates custom scripts in favor of standardized Docker + MCP workflow.
