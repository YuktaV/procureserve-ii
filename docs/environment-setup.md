# Environment Configuration Setup Script

## Setting up Supabase Access Token for MCP

### 1. Get Your Supabase Access Token

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to**: Account Settings → Access Tokens
3. **Create New Token**: Click "Generate new token"
4. **Copy the token**

### 2. Set Environment Variable on Mac

```bash
# Add to your shell profile (~/.zshrc or ~/.bash_profile)
echo 'export SUPABASE_ACCESS_TOKEN="your_token_here"' >> ~/.zshrc

# Reload shell
source ~/.zshrc

# Verify
echo $SUPABASE_ACCESS_TOKEN
```

### 3. Verify MCP Integration

```bash
# Test if Supabase MCP is working
# This should now work with Claude's Supabase tools
```

## Current Process Issues

### Current Script-Based Flow
```
1. Manual scripts → Local Supabase
2. Port conflicts → Manual port changes
3. Test data → Script creation
4. Environment → Hardcoded URLs
```

### Improved Docker-Based Flow
```
1. Docker Supabase → Consistent environment
2. Standard ports → Kill conflicting processes
3. Supabase MCP → Direct database operations
4. Environment variables → Proper configuration
```

## Port Management Solution

### Find and Kill Processes on Standard Ports

```bash
# Find what's using Supabase ports
lsof -i :54321  # API
lsof -i :54322  # DB
lsof -i :54323  # Studio

# Kill processes if needed
sudo kill -9 $(lsof -ti:54321)
sudo kill -9 $(lsof -ti:54322)
sudo kill -9 $(lsof -ti:54323)

# Start Supabase on standard ports
npx supabase start
```

## Environment Configuration

### .env Files Location
```
/apps/customer-app/.env.local
/apps/console-app/.env.local
```

### Standard Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production (when deployed)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```
