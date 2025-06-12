# ProcureServe II - Testing Implementation Guide

## 🧪 **TESTING SETUP STEPS**

### **1. Fix Environment Configuration**
The Supabase API URL in `.env.local` doesn't match the config.toml port. Let's fix this:

**Current Issue:**
- `.env.local` has: `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
- `config.toml` has: `port = 54331`

**Fix Required:**
Update `.env.local` to use the correct port from config.toml

### **2. Database Setup & Migration**
Apply all our database migrations:

```bash
# Navigate to project root
cd /Users/vasanthan/Desktop/PSII

# Start Supabase locally
supabase start

# Apply our migrations
supabase migration up

# Verify migrations applied
supabase db diff

# Optional: Run our test SQL scripts
supabase db reset --debug
```

### **3. Install Dependencies & Start Application**

```bash
# Install customer app dependencies
cd apps/customer-app
npm install

# Start the development server
npm run dev
```

## 🎯 **TESTING CHECKLIST**

### **Phase 1: Basic Application Startup**
- [ ] Supabase starts without errors
- [ ] Database migrations apply successfully  
- [ ] Frontend application starts on correct port
- [ ] No console errors on initial load
- [ ] Environment variables load correctly

### **Phase 2: Authentication & Process Selection Testing**

#### **Test Scenario 1: New User Registration**
- [ ] Visit `/auth/register`
- [ ] Create new company account
- [ ] Verify email/password validation
- [ ] Check redirect after registration

#### **Test Scenario 2: User Login & Process Flow**
- [ ] Create test users with different permissions
- [ ] Test admin login (should see process selection)
- [ ] Test recruiter login (should bypass to recruitment)
- [ ] Test bench sales login (should bypass to bench sales)
- [ ] Test no-access user (should see access denied)

#### **Test Scenario 3: Process Selection Interface**
- [ ] Dual-process user sees selection screen
- [ ] Process cards display correctly
- [ ] Selection saves to database
- [ ] Redirect works after selection
- [ ] Remember choice option works

### **Phase 3: Dashboard & Navigation Testing**

#### **Test Scenario 4: Recruitment Dashboard**
- [ ] Recruitment dashboard loads
- [ ] Stats cards show correct data
- [ ] Navigation menu shows recruitment features
- [ ] Quick actions work
- [ ] Process switcher (if dual-access) works

#### **Test Scenario 5: Bench Sales Dashboard**
- [ ] Bench sales dashboard loads
- [ ] Stats cards show correct data
- [ ] Navigation menu shows bench sales features
- [ ] Quick actions work
- [ ] Process switcher (if dual-access) works

### **Phase 4: Multi-Location Jobs Testing**

#### **Test Scenario 6: Job Creation Workflow**
- [ ] Access `/jobs/create`
- [ ] Step 1: Basic info form validation
- [ ] Step 2: Requirements form works
- [ ] Step 3: Location manager (add multiple locations)
- [ ] Step 4: Compensation by location
- [ ] Final submission creates job correctly
- [ ] Multi-location data saves to database

#### **Test Scenario 7: Job Listing & Details**
- [ ] Jobs list page shows created jobs
- [ ] Filtering works
- [ ] Pagination works
- [ ] Job detail page shows all locations
- [ ] Location-specific compensation displays
- [ ] Edit job workflow works

### **Phase 5: UI/UX Evaluation**

#### **Visual Testing Checklist**
- [ ] **Responsive Design**: Test on mobile/tablet/desktop
- [ ] **Typography**: Fonts load correctly, hierarchy clear
- [ ] **Colors**: Consistent color scheme, good contrast
- [ ] **Navigation**: Intuitive menu structure
- [ ] **Loading States**: Spinners/loading indicators work
- [ ] **Error States**: Error messages are helpful
- [ ] **Form Validation**: Real-time validation feedback
- [ ] **Component Consistency**: Buttons, cards, inputs match

#### **User Experience Issues to Look For**
- [ ] **Confusing Navigation**: Users get lost
- [ ] **Slow Performance**: Long loading times
- [ ] **Poor Error Handling**: Cryptic error messages  
- [ ] **Missing Feedback**: No confirmation of actions
- [ ] **Accessibility Issues**: Poor keyboard navigation
- [ ] **Mobile Issues**: Touch targets too small

## 🐛 **COMMON ISSUES & FIXES**

### **Supabase Connection Issues**
```bash
# If Supabase won't start
supabase stop
supabase start

# If migrations fail
supabase db reset
supabase migration up
```

### **Frontend Build Issues**
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear SvelteKit cache
rm -rf .svelte-kit
npm run dev
```

### **Environment Variable Issues**
- Check `.env.local` exists and has correct values
- Restart dev server after environment changes
- Verify Supabase URL matches running instance

## 📊 **TESTING DATA SETUP**

### **Create Test Users**
```sql
-- Admin user (dual process)
INSERT INTO users (email, company_id, role, process_permissions, profile) VALUES 
('admin@test.com', 'your-company-id', 'admin', 
 ARRAY['recruitment', 'bench_sales'], 
 '{"first_name": "Test", "last_name": "Admin"}');

-- Recruiter user (recruitment only)  
INSERT INTO users (email, company_id, role, process_permissions, profile) VALUES 
('recruiter@test.com', 'your-company-id', 'recruiter', 
 ARRAY['recruitment'], 
 '{"first_name": "Test", "last_name": "Recruiter"}');

-- Bench sales user (bench sales only)
INSERT INTO users (email, company_id, role, process_permissions, profile) VALUES 
('bench@test.com', 'your-company-id', 'viewer', 
 ARRAY['bench_sales'], 
 '{"first_name": "Test", "last_name": "BenchSales"}');
```

### **Create Test Jobs**
```sql
-- Multi-location job for testing
INSERT INTO jobs (company_id, title, description, created_by) VALUES 
('your-company-id', 'Senior Developer - Multi Location', 
 'Test job with multiple locations', 'admin-user-id');
```

## 📝 **UI FEEDBACK TEMPLATE**

When testing, document feedback in this format:

### **Page: [Page Name]**
**Issues Found:**
- [ ] Issue 1: Description + Screenshot location
- [ ] Issue 2: Description + Screenshot location

**Suggestions:**
- [ ] Suggestion 1: Specific improvement
- [ ] Suggestion 2: Specific improvement

**Overall Rating:** [1-5 stars]
**Priority:** [High/Medium/Low]

## 🎯 **SUCCESS CRITERIA**

The implementation is ready to continue development when:

1. **✅ Application starts without errors**
2. **✅ All user authentication flows work**
3. **✅ Process selection logic works correctly**
4. **✅ Dashboard navigation is intuitive**
5. **✅ Multi-location job creation works**
6. **✅ UI is responsive and professional**
7. **✅ No critical bugs found**
8. **✅ Performance is acceptable**

Let's start testing! 🚀
