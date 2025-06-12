# PSII Authentication System Documentation

## Overview

This document covers the authentication system implementation for ProcureServe II (PSII), including security fixes, testing procedures, and user management.

## Security Fixes Implemented

### Critical Security Issues Resolved

1. **Server-Side Authentication Security**
   - **Issue:** Used insecure `getSession()` method in `hooks.server.ts`
   - **Fix:** Replaced with secure `getUser()` method for server-side validation
   - **Impact:** Prevents stale/invalid session security vulnerabilities

2. **Database Schema Issues**
   - **Issue:** Missing `process_permissions` column causing authentication failures
   - **Fix:** Added complete process permissions system with constraints
   - **Migration:** `20250612000003_process_permissions_schema.sql`

3. **Row-Level Security Conflicts**
   - **Issue:** Infinite recursion in RLS policies on users table
   - **Fix:** Temporarily disabled problematic policies for testing phase
   - **Migration:** `20250612200000_disable_users_rls.sql`

4. **User ID Synchronization**
   - **Issue:** Mismatch between Auth user IDs and database user IDs
   - **Fix:** Created sync script to align user records
   - **Script:** `scripts/fix-user-ids.js`

## Architecture

### Authentication Flow

```mermaid
graph TD
    A[User Login] --> B[Supabase Auth]
    B --> C[hooks.server.ts - getUser()]
    C --> D{User Authenticated?}
    D -->|No| E[Redirect to /login]
    D -->|Yes| F[Check Process Permissions]
    F --> G{Permission Count}
    G -->|0| H[Redirect to /access-denied]
    G -->|1| I[Redirect to specific dashboard]
    G -->|2+| J[Redirect to /select-process]
```

### Process Permission System

- **Admin/Manager:** `['recruitment', 'bench_sales']` - Both processes
- **Recruiter:** `['recruitment']` - Recruitment only
- **Bench Sales:** `['bench_sales']` - Bench sales only
- **No Access:** `[]` - No permissions

## Test Users

| Email | Role | Permissions | Expected Behavior |
|-------|------|-------------|-------------------|
| `admin@acme-staffing.com` | Admin | recruitment, bench_sales | Process selection screen |
| `manager@acme-staffing.com` | Manager | recruitment, bench_sales | Process selection screen |
| `recruiter@acme-staffing.com` | Recruiter | recruitment | Direct to recruitment dashboard |
| `bench@acme-staffing.com` | Bench Sales | bench_sales | Direct to bench sales dashboard |
| `noprocess@acme-staffing.com` | No Access | none | Access denied page |

**Password for all test users:** `password123`

## Testing Interface

### Quick Testing Interface
- **URL:** `http://localhost:3004/test-users`
- **Features:**
  - One-click login for each test user
  - Sign out functionality
  - Expected behavior descriptions
  - Debug information display

### Manual Testing Steps

1. **Access Test Interface:**
   ```
   http://localhost:3004/test-users
   ```

2. **Test Each User Type:**
   - Click "Login as [Role]" button
   - Observe redirect behavior
   - Test protected routes
   - Use "Sign Out" to switch users

3. **Route Protection Testing:**
   ```
   /dashboard → Should redirect based on permissions
   /recruitment/dashboard → Only users with recruitment permission
   /bench-sales/dashboard → Only users with bench_sales permission
   /select-process → Only multi-process users
   ```

## Scripts

### Authentication Testing
```bash
# Run comprehensive auth tests
npm run test-auth

# Check database user sync
npm run check-db

# Create test users in Supabase Auth
npm run create-test-users

# Fix user ID mismatches
npm run fix-user-ids
```

### Script Descriptions

- **`scripts/auth-test.js`** - Comprehensive authentication system tests
- **`scripts/create-test-users.js`** - Creates test users in Supabase Auth
- **`scripts/check-db.js`** - Verifies database/auth user synchronization
- **`scripts/fix-user-ids.js`** - Fixes user ID mismatches between Auth and DB

## Configuration

### Environment Variables
```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Database Configuration
- **API URL:** http://127.0.0.1:54321
- **Studio URL:** http://127.0.0.1:54333
- **Direct DB:** postgresql://postgres:postgres@127.0.0.1:54332/postgres

## Debugging

### Authentication Logs
The system includes comprehensive logging for debugging:

```javascript
// Enable debug logging in hooks.server.ts
const DEBUG_AUTH = true // Set to false in production
```

### Log Outputs
- Route analysis and permission checks
- User authentication status
- Process permission validation
- Redirect decisions

### Common Issues

1. **User not found after login**
   - Run `npm run fix-user-ids`
   - Check user sync with `npm run check-db`

2. **Infinite redirect loops**
   - Check RLS policies on users table
   - Verify user has valid permissions

3. **Permission denied errors**
   - Verify user has correct process_permissions array
   - Check company_id matches user's company

## Security Considerations

### Production Deployment

1. **Disable Debug Logging:**
   ```javascript
   const DEBUG_AUTH = false
   ```

2. **Enable Row-Level Security:**
   - Fix RLS policies to avoid recursion
   - Re-enable users table RLS

3. **Environment Security:**
   - Use production Supabase keys
   - Enable HTTPS everywhere
   - Set secure cookie policies

### Best Practices

- Always use `getUser()` for server-side authentication
- Implement proper error handling for auth failures
- Log security events for audit trails
- Use typed interfaces for user permissions
- Validate permissions on both client and server

## Troubleshooting

### Authentication Test Failures

1. **Database Connection Issues:**
   ```bash
   npx supabase status
   npx supabase start
   ```

2. **Missing Test Users:**
   ```bash
   npm run create-test-users
   ```

3. **User ID Mismatch:**
   ```bash
   npm run fix-user-ids
   ```

### Route Protection Issues

1. **Check User Permissions:**
   ```bash
   npm run check-db
   ```

2. **Verify RLS Policies:**
   - Use Supabase Studio to check policies
   - Ensure no infinite recursion

3. **Debug Route Logic:**
   - Enable DEBUG_AUTH logging
   - Check console output for route decisions

## Next Steps

1. **Complete User Flow Testing** - Verify all user scenarios work correctly
2. **Route Protection Validation** - Test all protected routes
3. **Process Selection Interface** - Implement process switching UI
4. **Production Security** - Re-enable RLS with proper policies
5. **Performance Optimization** - Optimize auth queries and caching
