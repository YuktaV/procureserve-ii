# 🧪 ProcureServe II - Testing Instructions

## 🚀 **QUICK START TESTING**

### **Step 1: Start the Application**
```bash
# Navigate to the project directory
cd /Users/vasanthan/Desktop/PSII

# Run the startup script (this handles everything)
./start-dev.sh
```

**What the script does:**
- ✅ Starts Supabase locally
- ✅ Applies all database migrations  
- ✅ Installs dependencies
- ✅ Starts the development server
- ✅ Shows you all the URLs

### **Step 2: Apply Test Data (Optional)**
Once the app is running, in a new terminal:
```bash
# Navigate to project directory
cd /Users/vasanthan/Desktop/PSII

# Apply test data
supabase db reset --debug
# OR manually run the test data script:
psql "postgresql://postgres:postgres@127.0.0.1:54332/postgres" -f docs/test-data-setup.sql
```

## 🎯 **TEST ACCOUNTS**

After applying test data, you can login with these accounts:

| Email | Password | Role | Process Access | Expected Behavior |
|-------|----------|------|----------------|-------------------|
| `admin@acme-staffing.com` | `password123` | Admin | Both | See process selection screen |
| `manager@acme-staffing.com` | `password123` | Manager | Both (recruitment current) | Direct to recruitment dashboard |
| `recruiter@acme-staffing.com` | `password123` | Recruiter | Recruitment only | Bypass selection → recruitment |
| `bench@acme-staffing.com` | `password123` | Viewer | Bench Sales only | Bypass selection → bench sales |
| `noprocess@acme-staffing.com` | `password123` | Viewer | None | Access denied page |

## 📱 **TESTING SCENARIOS**

### **🔐 Scenario 1: Process Selection Logic**

**Test Admin Login (Dual Process):**
1. Go to `http://localhost:3000/auth/login`
2. Login with `admin@acme-staffing.com` / `password123`
3. **Expected:** See process selection screen
4. **Test:** Click "Continue with Recruitment"
5. **Expected:** Redirect to recruitment dashboard
6. **Test:** Logout and login again
7. **Expected:** Direct redirect to recruitment (remembered choice)

**Test Recruiter Login (Single Process):**
1. Login with `recruiter@acme-staffing.com` / `password123`
2. **Expected:** Bypass selection, direct to recruitment dashboard
3. **Verify:** No process switcher in navigation
4. **Verify:** Only recruitment features visible

**Test Bench Sales Login (Single Process):**
1. Login with `bench@acme-staffing.com` / `password123`
2. **Expected:** Bypass selection, direct to bench sales dashboard
3. **Verify:** No process switcher in navigation
4. **Verify:** Only bench sales features visible

**Test No Access Login:**
1. Login with `noprocess@acme-staffing.com` / `password123`
2. **Expected:** Access denied page
3. **Verify:** Clear messaging and support contact

### **🎨 Scenario 2: User Interface Testing**

**Dashboard Visual Test:**
1. Login as admin and go to recruitment dashboard
2. **Check:** Stats cards display correctly
3. **Check:** Recent jobs/candidates sections populate
4. **Check:** Quick actions work
5. **Check:** Responsive design on mobile (resize browser)

**Process Switcher Test (Admin/Manager only):**
1. Login as admin
2. **Check:** Process switcher appears in navigation
3. **Test:** Switch from recruitment to bench sales
4. **Expected:** Dashboard changes to bench sales interface
5. **Test:** Switch back to recruitment
6. **Expected:** Smooth transition, no data loss

### **💼 Scenario 3: Multi-Location Jobs Testing**

**Job Creation Workflow:**
1. Login as admin or recruiter
2. Go to `/jobs/create`
3. **Step 1:** Fill basic info (test form validation)
4. **Step 2:** Add required skills (test dynamic skill adding)
5. **Step 3:** Add multiple locations:
   - Office location (NYC)
   - Remote location
   - Hybrid location (SF)
6. **Step 4:** Set different compensation per location
7. **Test:** Submit job and verify creation

**Job Viewing Test:**
1. Go to `/jobs` list
2. **Check:** Jobs display with location summaries
3. **Test:** Click on a multi-location job
4. **Verify:** All locations show in detail view
5. **Verify:** Location-specific compensation displays
6. **Check:** Primary location is highlighted

### **📱 Scenario 4: Mobile Responsiveness**

**Mobile Test Checklist:**
1. Resize browser to mobile width (375px)
2. **Test:** Navigation works on mobile
3. **Test:** Process selection cards stack properly
4. **Test:** Dashboard stats cards are readable
5. **Test:** Job creation form is usable
6. **Test:** Touch targets are adequate size

## 🐛 **COMMON ISSUES & FIXES**

### **Issue: "Failed to fetch" errors**
**Cause:** Supabase not running or wrong URL
**Fix:** 
```bash
supabase stop
supabase start
# Check the URL in .env.local matches the running instance
```

### **Issue: "User not found" on login**
**Cause:** Test data not applied
**Fix:**
```bash
supabase db reset --debug
# This applies migrations and seed data
```

### **Issue: Process selection not working**
**Cause:** Database migration not applied
**Fix:**
```bash
supabase migration up
# Check if process_permissions column exists
```

### **Issue: Components not styled correctly**
**Cause:** Tailwind CSS not loading
**Fix:**
```bash
cd apps/customer-app
npm run build
npm run dev
```

## 📊 **TESTING FEEDBACK TEMPLATE**

### **Overall Application**
- **Performance:** ⭐⭐⭐⭐⭐ (1-5 stars)
- **Visual Design:** ⭐⭐⭐⭐⭐ 
- **User Experience:** ⭐⭐⭐⭐⭐
- **Mobile Experience:** ⭐⭐⭐⭐⭐

### **Specific Pages**

**Process Selection Page:**
- [ ] ✅ Works correctly
- [ ] ❌ Issues found: ________________
- [ ] 💡 Suggestions: ________________

**Recruitment Dashboard:**
- [ ] ✅ Works correctly  
- [ ] ❌ Issues found: ________________
- [ ] 💡 Suggestions: ________________

**Bench Sales Dashboard:**
- [ ] ✅ Works correctly
- [ ] ❌ Issues found: ________________
- [ ] 💡 Suggestions: ________________

**Job Creation Flow:**
- [ ] ✅ Works correctly
- [ ] ❌ Issues found: ________________
- [ ] 💡 Suggestions: ________________

**Multi-Location Features:**
- [ ] ✅ Works correctly
- [ ] ❌ Issues found: ________________
- [ ] 💡 Suggestions: ________________

### **Priority Issues**
1. **High Priority:** _________________________________
2. **Medium Priority:** _____________________________
3. **Low Priority:** ________________________________

### **UI/UX Recommendations**
1. **Design Changes:** ______________________________
2. **Navigation Improvements:** ______________________
3. **Mobile Optimizations:** _________________________

## 🎯 **SUCCESS CRITERIA**

The application is ready for continued development when:

- [ ] **All test accounts login successfully**
- [ ] **Process selection logic works for all user types**
- [ ] **Dashboard interfaces are visually appealing**
- [ ] **Multi-location job creation works end-to-end**
- [ ] **Mobile experience is usable**
- [ ] **No critical bugs or crashes**
- [ ] **Performance is acceptable (< 3 seconds load time)**
- [ ] **UI feels professional and polished**

## 🔧 **Development URLs**

While testing, you'll have access to:
- **Application:** http://localhost:3000
- **Supabase Studio:** http://localhost:54333
- **Email Testing:** http://localhost:54324
- **API Docs:** http://localhost:54331/rest/v1/

---

**Ready to test? Run `./start-dev.sh` and let's see how ProcureServe II looks! 🚀**
