# PSII Production-Ready Setup

## Current Issues Addressed

### ✅ Docker-Based Workflow
- **Problem**: Using scripts instead of Docker Supabase
- **Solution**: `npm run smart-setup` - Docker-first approach
- **Benefit**: Production environment parity

### ✅ Port Management  
- **Problem**: Manual port switching in .env files
- **Solution**: Kill processes and use standard ports
- **Benefit**: Consistent, predictable configuration

### ✅ Supabase MCP Integration
- **Problem**: Script-based database operations
- **Solution**: Set `SUPABASE_ACCESS_TOKEN` for MCP tools
- **Benefit**: Direct database access via Claude tools

## Quick Setup Commands

```bash
# 1. Complete setup (Docker + ports + environment)
npm run smart-setup

# 2. Set your Supabase access token
export SUPABASE_ACCESS_TOKEN="your_token_from_dashboard"

# 3. Test authentication
npm run test-auth
```

## Supabase Access Token Setup

1. **Get Token**: https://supabase.com/dashboard → Account Settings → Access Tokens
2. **Set Environment**: 
   ```bash
   echo 'export SUPABASE_ACCESS_TOKEN="your_token"' >> ~/.zshrc
   source ~/.zshrc
   ```
3. **Verify**: `echo $SUPABASE_ACCESS_TOKEN`

## Docker vs Script Workflow

### Before (Script-Based)
```bash
npm run create-test-users  # Script creates users
npm run check-db          # Script checks database  
npm run fix-user-ids      # Script fixes sync issues
```

### After (Docker + MCP)
```bash
npm run smart-setup       # Docker setup
# Then use Claude Supabase MCP tools:
# - list_projects
# - execute_sql  
# - apply_migration
```

## Standard Ports (No More Conflicts)

- **API**: http://localhost:54321
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres  
- **Studio**: http://localhost:54323
- **Test Interface**: http://localhost:3004/test-users

## Environment Files Auto-Generated

```bash
# apps/customer-app/.env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Production Benefits

1. **Docker Consistency** - Local mirrors production
2. **MCP Integration** - Direct database operations
3. **Standard Ports** - No configuration drift
4. **Environment Parity** - Identical setup across stages

## File Organization Maintained

- **Documentation**: `/docs/` folder
- **Scripts**: `/scripts/` folder  
- **Components**: Max 50 lines each
- **Standards**: Follow `/docs/development.md`

The setup now prioritizes Docker-based Supabase with MCP integration for production alignment.
