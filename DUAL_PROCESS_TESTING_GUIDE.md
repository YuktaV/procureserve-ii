# ProcureServe II - Dual-Process Testing Guide

## Overview
ProcureServe II now supports **both business processes** with complete data integration:

1. **Recruitment Process**: Job postings, candidate management, applications, interviews
2. **Bench Sales Process**: Consultant management, client relationships, project placements

## Process Architecture

### Users & Permissions
| User Type | Recruitment Access | Bench Sales Access | Expected Flow |
|-----------|-------------------|-------------------|---------------|
| Admin | ✅ | ✅ | Process selection → Choose dashboard |
| Manager | ✅ | ✅ | Process selection → Choose dashboard |
| Recruiter | ✅ | ❌ | Direct to `/recruitment/dashboard` |
| Bench Sales Rep | ❌ | ✅ | Direct to `/bench-sales/dashboard` |
| No Access | ❌ | ❌ | Redirect to `/access-denied` |

## Test Accounts

### Dual-Process Users (See Both Dashboards)
- **Admin**: `admin@acme-staffing.com` / `password123`
- **Manager**: `manager@acme-staffing.com` / `password123`

### Single-Process Users
- **Recruitment Only**: `recruiter@acme-staffing.com` / `password123`
- **Bench Sales Only**: `bench@acme-staffing.com` / `password123`
- **No Access**: `noprocess@acme-staffing.com` / `password123`

## Expected Dashboard Data

### Recruitment Dashboard (`/recruitment/dashboard`)
- **Active Jobs**: 2 (Senior Full Stack Developer, DevOps Engineer)
- **Active Candidates**: 3 (John Doe, Jane Smith, Mike Wilson)
- **Total Applications**: 4 (various statuses: applied, screening, interview, hired)
- **Placements This Month**: 1

### Bench Sales Dashboard (`/bench-sales/dashboard`)
- **Available Consultants**: 3 (Sarah, David, Alex)
- **Placed Consultants**: 1 (Maria)
- **Active Clients**: 2 (TechCorp Inc, FinanceStream LLC)
- **Prospect Clients**: 1 (Healthcare Analytics)
- **Active Projects**: 2 (E-commerce Platform, Data Analytics Platform)
- **Active Placements**: 2 (revenue-generating assignments)

## Testing Flows

### 1. Dual-Process User Flow (Admin/Manager)
```
1. Login → `/select-process`
2. Click "Recruitment" → `/recruitment/dashboard` 
3. Navigate back → `/select-process`
4. Click "Bench Sales" → `/bench-sales/dashboard`
5. Verify different data on each dashboard
```

### 2. Single-Process User Flow (Recruiter)
```
1. Login → Direct to `/recruitment/dashboard`
2. Verify recruitment data only
3. Cannot access `/bench-sales/*` routes
```

### 3. Single-Process User Flow (Bench Sales)
```
1. Login → Direct to `/bench-sales/dashboard`  
2. Verify bench sales data only
3. Cannot access `/recruitment/*` routes
```

### 4. No Access User Flow
```
1. Login → `/access-denied`
2. Cannot access any process dashboards
```

## Route Structure
```
/login                          # Authentication
/select-process                 # Multi-process selection
/recruitment/dashboard          # Recruitment metrics & activity
/bench-sales/dashboard          # Bench sales metrics & activity
/access-denied                  # No permissions page
```

## Data Verification Scripts

### Test All Data
```bash
# Verify recruitment data
node verify-dashboard-data.cjs

# Verify bench sales data  
node verify-bench-sales-data.cjs

# Test authentication flows
node test-login-flow.cjs
node test-bench-sales-login.cjs
```

### Create Test Data
```bash
# Create all test data from scratch
node create-auth-users.cjs
node create-test-data.cjs          # Recruitment data
node create-bench-sales-data.cjs   # Bench sales data
```

## Database Schema

### Recruitment Process Tables
- `jobs` - Job postings
- `candidates` - People applying for jobs
- `applications` - Job applications/submissions
- `interviews` - Interview scheduling

### Bench Sales Process Tables  
- `consultants` - People on bench (available for placement)
- `clients` - Companies that hire consultants
- `projects` - Client engagement opportunities
- `placements` - Consultant-project assignments

### Shared Infrastructure
- `companies` - Multi-tenant root
- `users` - Authentication with process permissions
- `configurable_enums` - Console-managed dropdown values
- `activity_logs` - Audit trail across both processes

## Expected Metrics Summary

| Metric | Recruitment | Bench Sales |
|--------|-------------|-------------|
| **Primary Entities** | 2 Active Jobs | 3 Available Consultants |
| **Secondary Entities** | 3 Active Candidates | 2 Active Clients |
| **Activities** | 4 Applications | 2 Active Placements |
| **Revenue Indicators** | 1 Hire | 2 Revenue Streams |

## Key Architectural Features

### ✅ Process Isolation
- Separate dashboards with process-specific metrics
- Route-level access control based on permissions
- Process-specific data queries and statistics

### ✅ Shared Components
- Same 22 UI components work for both processes
- Consistent authentication and authorization
- Unified navigation and layout structure

### ✅ Configurable Enums
- Status values managed via console app
- Process-specific enum categories
- Dynamic badge colors and labels

### ✅ Multi-tenant Security
- All data scoped by company_id
- Row-Level Security policies for both processes
- Proper authentication and session management

## Development URLs
- **Customer App**: http://localhost:3004
- **Supabase Studio**: http://127.0.0.1:54323
- **Database Direct**: postgresql://postgres:postgres@127.0.0.1:54322/postgres

---

## Success Criteria ✅
- [x] Both processes have functional dashboards with real data
- [x] User permissions correctly route to appropriate dashboards  
- [x] Process selection works for dual-permission users
- [x] Single-process users bypass selection screen
- [x] All authentication flows tested and working
- [x] Database schema supports both business processes
- [x] UI components reused across both processes
- [x] Real business metrics displayed on both dashboards

**Status**: Complete dual-process foundation ready for advanced features! 🚀
