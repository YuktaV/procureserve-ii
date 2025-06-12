# PSII Testing Guide

## Overview

This guide covers all testing procedures for the ProcureServe II authentication system and application functionality.

## Script Locations

All testing scripts are located in `/scripts/` directory:

- `scripts/auth-test.js` - Comprehensive authentication system tests
- `scripts/create-test-users.js` - Creates test users in Supabase Auth
- `scripts/check-db.js` - Database and auth user verification
- `scripts/fix-user-ids.js` - Fixes user ID synchronization issues

## Quick Start Testing

### 1. Setup Test Environment

```bash
# Ensure Supabase is running
npx supabase start

# Create test users
npm run create-test-users

# Run authentication tests
npm run test-auth
```

### 2. Access Test Interface

Navigate to: `http://localhost:3004/test-users`

This interface provides:
- One-click login for all test users
- Sign out functionality
- Expected behavior descriptions
- Debug information display

## Authentication Testing

### Automated Tests

```bash
# Run comprehensive authentication tests
npm run test-auth
```

**Test Coverage:**
- Direct authentication for all user types
- Session validation with `getUser()` method
- Permission verification
- Route protection testing
- Complete authentication flow validation

### Expected Results

```
🎯 Overall Result: ✅ ALL TESTS PASSED
🎉 Authentication system is working correctly!

✅ Admin with both processes    - Auth: ✅ | Routes: ✅ | Permissions: ✅
✅ Manager with both processes  - Auth: ✅ | Routes: ✅ | Permissions: ✅  
✅ Recruiter (recruitment only) - Auth: ✅ | Routes: ✅ | Permissions: ✅
✅ Bench sales (bench only)     - Auth: ✅ | Routes: ✅ | Permissions: ✅
✅ No permissions user          - Auth: ✅ | Routes: ✅ | Permissions: ✅
```

## Manual Testing Procedures

### User Authentication Flow Testing

1. **Multi-Process Users (Admin, Manager)**
   ```
   Login → /dashboard → /select-process → Choose process → Process dashboard
   ```

2. **Single-Process Users (Recruiter, Bench)**
   ```
   Login → /dashboard → Direct redirect to process dashboard
   ```

3. **No Access Users**
   ```
   Login → /dashboard → /access-denied
   ```

### Route Protection Testing

Test these routes with different user types:

| Route | Admin | Manager | Recruiter | Bench | No Access |
|-------|-------|---------|-----------|-------|-----------|
| `/dashboard` | ✅ Redirect | ✅ Redirect | ✅ Redirect | ✅ Redirect | ❌ Access Denied |
| `/select-process` | ✅ Allow | ✅ Allow | ❌ Redirect | ❌ Redirect | ❌ Access Denied |
| `/recruitment/dashboard` | ✅ Allow | ✅ Allow | ✅ Allow | ❌ Access Denied | ❌ Access Denied |
| `/bench-sales/dashboard` | ✅ Allow | ✅ Allow | ❌ Access Denied | ✅ Allow | ❌ Access Denied |

### Permission Testing Steps

1. **Login as Admin:**
   ```bash
   # Expected: Process selection screen
   # Can access both recruitment and bench sales
   ```

2. **Login as Recruiter:**
   ```bash
   # Expected: Direct to recruitment dashboard
   # Cannot access bench-sales routes
   ```

3. **Test Route Protection:**
   ```bash
   # Try accessing restricted routes manually
   # Verify proper redirect behavior
   ```

## Database Testing

### User Synchronization

```bash
# Check if database users match auth users
npm run check-db
```

**Expected Output:**
- Lists all users in database table
- Lists all users in Supabase Auth
- Shows successful authentication test
- Displays user profile information

### Fix User ID Issues

```bash
# If users IDs don't match between Auth and DB
npm run fix-user-ids
```

This script:
- Gets all auth users
- Updates database records with correct auth user IDs
- Verifies the fix with a test authentication

## Test Data

### Test Users Configuration

```javascript
const TEST_USERS = [
  {
    email: 'admin@acme-staffing.com',
    password: 'password123',
    expectedPermissions: ['recruitment', 'bench_sales'],
    description: 'Admin with both processes'
  },
  {
    email: 'manager@acme-staffing.com', 
    password: 'password123',
    expectedPermissions: ['recruitment', 'bench_sales'],
    description: 'Manager with both processes'
  },
  {
    email: 'recruiter@acme-staffing.com',
    password: 'password123', 
    expectedPermissions: ['recruitment'],
    description: 'Recruiter with recruitment only'
  },
  {
    email: 'bench@acme-staffing.com',
    password: 'password123',
    expectedPermissions: ['bench_sales'],
    description: 'Bench sales with bench_sales only'
  },
  {
    email: 'noprocess@acme-staffing.com',
    password: 'password123',
    expectedPermissions: [],
    description: 'User with no process permissions'
  }
]
```

### Test Company Data

```sql
-- Acme Staffing test company
Company ID: 99e1f1a1-1111-1111-1111-111111111111
Domain: acme-staffing.com
Recruitment: Enabled
Bench Sales: Enabled
```

## Debugging Failed Tests

### Common Issues and Solutions

1. **Database Connection Failed**
   ```bash
   # Check Supabase status
   npx supabase status
   
   # Restart if needed
   npx supabase stop
   npx supabase start
   ```

2. **Test Users Don't Exist**
   ```bash
   # Recreate test users
   npm run create-test-users
   ```

3. **User ID Mismatch**
   ```bash
   # Check synchronization
   npm run check-db
   
   # Fix if needed
   npm run fix-user-ids
   ```

4. **Permission Errors**
   ```bash
   # Check RLS policies are disabled for testing
   # Verify process_permissions column exists
   # Check user permissions in database
   ```

### Debug Logging

Enable debug logging in development:

```javascript
// hooks.server.ts
const DEBUG_AUTH = true // Enable for development

// dashboard/+page.server.ts  
const DEBUG_AUTH = true // Enable for development
```

Debug logs show:
- Route analysis and decisions
- User authentication status
- Permission checks
- Redirect logic

## Performance Testing

### Load Testing

```bash
# Test with multiple concurrent users
# Monitor response times
# Check for memory leaks
```

### Database Performance

```bash
# Monitor query performance
# Check index usage
# Verify RLS policy efficiency
```

## Security Testing

### Authentication Security

1. **Session Security**
   - Verify `getUser()` is used server-side
   - Test session expiration
   - Check for session fixation vulnerabilities

2. **Permission Validation**
   - Test privilege escalation attempts
   - Verify route protection
   - Check for permission bypass

3. **Input Validation**
   - Test SQL injection resistance
   - Verify XSS protection
   - Check for CSRF vulnerabilities

### Audit Testing

```bash
# Check activity logs
# Verify audit trail completeness
# Test security event logging
```

## Continuous Integration

### Automated Test Pipeline

```yaml
# Example CI configuration
test:
  - npm install
  - npx supabase start
  - npm run create-test-users
  - npm run test-auth
  - npm run check-db
```

### Test Coverage Requirements

- **Authentication:** 100% of auth flows tested
- **Permissions:** All permission combinations verified
- **Routes:** All protected routes tested
- **Database:** User sync and permissions validated

## Troubleshooting Guide

### Test Failures

1. **Authentication Tests Fail**
   - Check Supabase connection
   - Verify test user creation
   - Check database permissions

2. **Route Protection Tests Fail**
   - Verify RLS policies
   - Check permission logic
   - Test with debug logging

3. **Database Tests Fail**
   - Check database connection
   - Verify schema migrations
   - Test user synchronization

### Getting Help

1. **Check Debug Logs** - Enable detailed logging
2. **Run Database Checks** - Use provided scripts
3. **Verify Environment** - Check all services running
4. **Review Documentation** - Check `/docs/authentication.md`

This testing guide ensures comprehensive validation of the PSII authentication system and maintains high quality standards.
