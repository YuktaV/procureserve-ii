# ProcureServe II - Strategic Testing Plan
**Testing Session Date:** $(date)
**Objective:** Validate current implementation without changing existing functionality

## Environment Status ✅
- **Docker:** Running (confirmed by user)
- **Supabase Config:** Verified - port 54321 correct for API access
- **Environment Files:** `.env.local` properly configured
- **Development Port:** 3004 (as configured)

## Testing Strategy

### Phase 1: Infrastructure Validation (5 mins)
**Objective:** Ensure all services are running correctly

```bash
# Step 1: Verify Supabase is running
cd /Users/vasanthan/Desktop/PSII
npx supabase status

# Step 2: Start development server (if not running)
cd apps/customer-app
npm run dev
```

**Expected Output:**
- API URL: http://127.0.0.1:54321 ✅
- DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres ✅  
- Studio URL: http://127.0.0.1:54333 ✅
- Customer App: http://localhost:3004 ✅

### Phase 2: Test User Authentication Flows (15 mins)
**Objective:** Validate all 5 user scenarios from NEXT_CHAT_PROMPT.md

#### Test Users & Expected Behaviors:
| Email | Password | Expected Flow | Process Access |
|-------|----------|---------------|----------------|
| `admin@acme-staffing.com` | `password123` | Process Selection Screen | `['recruitment', 'bench_sales']` |
| `manager@acme-staffing.com` | `password123` | Process Selection Screen | `['recruitment', 'bench_sales']` |
| `recruiter@acme-staffing.com` | `password123` | Direct → Recruitment Dashboard | `['recruitment']` |
| `bench@acme-staffing.com` | `password123` | Direct → Bench Sales Dashboard | `['bench_sales']` |
| `noprocess@acme-staffing.com` | `password123` | Access Denied Page | `[]` |

#### Test Procedure for Each User:
1. **Navigate to:** http://localhost:3004/login
2. **Enter credentials** and sign in
3. **Document actual behavior** vs expected
4. **Sign out** before testing next user
5. **Clear session storage** (if needed)

### Phase 3: Process Selection Interface Testing (10 mins)
**Focus:** Admin and Manager users only (dual-process access)

#### Test Scenarios:
1. **Process Selection Display:**
   - [ ] Two process cards visible
   - [ ] Recruitment card: Blue theme, Search icon
   - [ ] Bench Sales card: Green theme, Users icon
   - [ ] Clear descriptions and features listed

2. **Process Selection Functionality:**
   - [ ] Click "Recruitment" → Navigate to `/recruitment/dashboard`
   - [ ] Click "Bench Sales" → Navigate to `/bench_sales/dashboard`
   - [ ] Session storage updated with selected process
   - [ ] API call to `/api/set-process` successful

3. **Navigation After Selection:**
   - [ ] Recruitment dashboard loads correctly
   - [ ] Bench sales dashboard loads correctly
   - [ ] Process context maintained

### Phase 4: Dashboard Content Validation (10 mins)
**Objective:** Verify process-specific dashboards display correctly

#### Recruitment Dashboard Tests:
- [ ] Correct title and branding
- [ ] Recruitment-specific stats (jobs, candidates, etc.)
- [ ] Recruitment-focused quick actions
- [ ] Proper navigation elements

#### Bench Sales Dashboard Tests:
- [ ] Distinct title and theme
- [ ] Bench sales-specific stats (bench candidates, placements, etc.)
- [ ] Bench sales-focused quick actions
- [ ] Proper navigation elements

#### Candidate Dashboard Tests (if applicable):
- [ ] Profile completion prompts
- [ ] Candidate-specific interface
- [ ] Job search functionality

### Phase 5: Route Protection Testing (5 mins)
**Objective:** Verify access control enforcement

#### Test Scenarios:
1. **Direct URL Access (logged out):**
   - Navigate to `/recruitment/dashboard` → Should redirect to login
   - Navigate to `/bench_sales/dashboard` → Should redirect to login

2. **Unauthorized Process Access:**
   - Login as `recruiter@acme-staffing.com`
   - Try to access `/bench_sales/dashboard` → Should be blocked/redirected

3. **No Process Access:**
   - Login as `noprocess@acme-staffing.com`
   - Should see access denied page
   - All dashboard URLs should be blocked

## Issue Documentation Template

### Issue #1: [Title]
**User:** [email]
**Expected:** [behavior]
**Actual:** [behavior]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Browser Console Errors:** [if any]
**Network Tab Issues:** [if any]
**Priority:** High/Medium/Low

## Success Criteria Checklist

### ✅ Authentication System
- [ ] All 5 test users can log in successfully
- [ ] Proper routing based on process permissions
- [ ] Session management works correctly
- [ ] Sign out functionality works

### ✅ Process Selection
- [ ] Interface displays correctly for dual-process users
- [ ] Process selection API calls work
- [ ] Navigation to correct dashboards
- [ ] Single-process users bypass selection

### ✅ Dashboard Functionality
- [ ] Process-specific content displays
- [ ] Stats and metrics show (even if mock data)
- [ ] Quick actions are relevant to process
- [ ] Navigation is process-aware

### ✅ Security & Access Control
- [ ] Route protection enforces permissions
- [ ] Unauthorized access is prevented
- [ ] No process users see appropriate messaging
- [ ] Session security is maintained

## Next Steps After Testing

### If All Tests Pass ✅
- **Priority 1:** Enhance navigation with ProcessSwitcher
- **Priority 2:** Connect dashboards to real data
- **Priority 3:** Build missing UI components (Toast, Modal, etc.)

### If Issues Found ❌
- **Document all issues** using template above
- **Prioritize critical auth/security issues**
- **Create fix plan without disrupting working functionality**

## Testing Notes
[Space for real-time testing observations]

---
**Test Completed:** [Date/Time]
**Overall Status:** [Pass/Fail/Partial]
**Critical Issues:** [Count]
**Ready for Next Phase:** [Yes/No]
