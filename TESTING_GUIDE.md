# ProcureServe II - Testing Guide

## Quick Start Testing

### 1. Start Development Environment
```bash
cd /Users/vasanthan/Desktop/PSII

# Start Supabase (if not running)
npx supabase start

# Start Customer App
cd apps/customer-app
npm run dev
```

### 2. Access Points
- **Customer App**: http://localhost:3004
- **Supabase Studio**: http://127.0.0.1:54323
- **Login URL**: http://localhost:3004/login

### 3. Test Accounts
| Email | Password | Role | Permissions | Expected Behavior |
|-------|----------|------|-------------|------------------|
| `admin@acme-staffing.com` | `password123` | admin | recruitment, bench_sales | Access to process selection |
| `manager@acme-staffing.com` | `password123` | manager | recruitment, bench_sales | Access to process selection |
| `recruiter@acme-staffing.com` | `password123` | recruiter | recruitment | Direct to recruitment dashboard |
| `bench@acme-staffing.com` | `password123` | viewer | bench_sales | Direct to bench_sales dashboard |
| `noprocess@acme-staffing.com` | `password123` | viewer | none | Redirect to access-denied |

### 4. Expected Dashboard Data
After logging in with recruitment access, you should see:
- **Active Jobs**: 2
- **Active Candidates**: 3  
- **Total Applications**: 4
- **Placements This Month**: 1

### 5. Recent Activity
- **Recent Jobs**: 3 jobs (Senior Full Stack Developer, DevOps Engineer, Product Manager)
- **Recent Submissions**: 4 applications with different statuses

## Testing Flow

### Basic Authentication Test
1. Navigate to http://localhost:3004
2. Should redirect to `/login` (not authenticated)
3. Login with `recruiter@acme-staffing.com` / `password123`
4. Should redirect to `/recruitment/dashboard` (single permission)
5. Verify dashboard shows real data metrics
6. Logout should return to login page

### Multi-Process User Test  
1. Login with `admin@acme-staffing.com` / `password123`
2. Should redirect to `/select-process` (multiple permissions)
3. Select "Recruitment" process
4. Should navigate to `/recruitment/dashboard`
5. Verify same dashboard data as recruiter

### No Access Test
1. Login with `noprocess@acme-staffing.com` / `password123`  
2. Should redirect to `/access-denied` (no permissions)

## Data Verification Scripts

### Verify Test Data
```bash
cd /Users/vasanthan/Desktop/PSII
node verify-dashboard-data.cjs
```

### Test Login Flow
```bash
cd /Users/vasanthan/Desktop/PSII  
node test-login-flow.cjs
```

### Recreate Test Data (if needed)
```bash
cd /Users/vasanthan/Desktop/PSII
node create-auth-users.cjs
node create-test-data.cjs
```

## Database Access

### Direct Database Queries (via Supabase Studio)
1. Open http://127.0.0.1:54323
2. Go to "Table Editor"
3. Browse: companies, users, jobs, candidates, applications

### Reset Database (if needed)
```bash
cd /Users/vasanthan/Desktop/PSII
npx supabase db reset
# Then recreate test users and data
```

## Troubleshooting

### Common Issues
1. **"Not authenticated" errors**: Ensure Supabase is running and users exist
2. **Empty dashboard**: Run test data creation scripts
3. **Login redirect loops**: Check RLS policies and user permissions
4. **Database connection errors**: Verify Supabase status with `npx supabase status`

### Debug Mode
Set `DEBUG_AUTH = true` in dashboard `+page.server.ts` for detailed logging.

## Next Development Steps
Ready for Phase 4: Real-time features and CRUD operations! 🚀
