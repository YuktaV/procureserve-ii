# Process Selection - User Stories & Requirements

## 🎯 **USER STORIES**

### **Story 1: Dual-Process User (Admin/Manager)**
**As a** company admin or manager with access to both recruitment and bench sales  
**I want to** choose which process to work with when I log in  
**So that** I can focus on the relevant tasks and see the appropriate dashboard

**Acceptance Criteria:**
- ✅ I see a process selection screen after login
- ✅ I can choose between "Recruitment" and "Bench Sales"
- ✅ The dashboard changes based on my selection
- ✅ I can switch processes without logging out
- ✅ My last selection is remembered for future sessions

### **Story 2: Single-Process User (Recruiter)**
**As a** recruiter with only recruitment access  
**I want to** go directly to the recruitment dashboard  
**So that** I don't waste time on an unnecessary selection screen

**Acceptance Criteria:**
- ✅ I bypass the process selection screen completely
- ✅ I land directly on the recruitment dashboard
- ✅ I don't see bench sales navigation or features
- ✅ My permissions are enforced at the API level

### **Story 3: Single-Process User (Bench Sales)**
**As a** bench sales specialist with only bench sales access  
**I want to** go directly to the bench sales dashboard  
**So that** I can immediately start working with my candidates

**Acceptance Criteria:**
- ✅ I bypass the process selection screen completely
- ✅ I land directly on the bench sales dashboard
- ✅ I don't see recruitment navigation or features
- ✅ My permissions are enforced at the API level

### **Story 4: New User Setup**
**As a** company admin setting up new users  
**I want to** assign specific process permissions to each user  
**So that** they only see what's relevant to their role

**Acceptance Criteria:**
- ✅ I can assign process permissions during user creation
- ✅ I can modify user permissions after creation
- ✅ Process permissions are separate from role permissions
- ✅ Users get appropriate access based on their assignments

### **Story 5: Process Switching**
**As a** dual-process user currently in one process  
**I want to** easily switch to the other process  
**So that** I can handle different types of work efficiently

**Acceptance Criteria:**
- ✅ I see a process switcher in the navigation
- ✅ Switching preserves my current context when possible
- ✅ I get a confirmation if switching would lose unsaved work
- ✅ The switch is instant without full page reload

## 🔐 **TECHNICAL REQUIREMENTS**

### **Database Schema Changes:**
```sql
-- Add process permissions to users table
ALTER TABLE users ADD COLUMN process_permissions TEXT[] DEFAULT '{}';
-- Options: ['recruitment', 'bench_sales']

-- Add current process session tracking
ALTER TABLE users ADD COLUMN current_process TEXT;
-- Current active process for dual-process users

-- Add process permission constraints
ALTER TABLE users ADD CONSTRAINT valid_process_permissions 
CHECK (process_permissions <@ ARRAY['recruitment', 'bench_sales']);

ALTER TABLE users ADD CONSTRAINT valid_current_process 
CHECK (current_process IN ('recruitment', 'bench_sales') OR current_process IS NULL);
```

### **User Permission Matrix:**
| Role | Default Processes | Can Change | Description |
|------|------------------|------------|-------------|
| Admin | Both | ✅ | Full system access |
| Manager | Both | ✅ | Department oversight |
| Recruiter | Recruitment only | ❌ | Job posting & candidate sourcing |
| Bench Sales | Bench Sales only | ❌ | Available candidate placement |
| Viewer | Based on assignment | ❌ | Read-only access |

### **Navigation Logic:**
```typescript
// User login flow decision tree
if (user.process_permissions.length === 0) {
  // No process access - error state
  redirect('/access-denied')
} else if (user.process_permissions.length === 1) {
  // Single process - direct redirect
  const process = user.process_permissions[0]
  redirect(`/dashboard/${process}`)
} else {
  // Multiple processes - show selection
  if (user.current_process && user.process_permissions.includes(user.current_process)) {
    // Use last selected process
    redirect(`/dashboard/${user.current_process}`)
  } else {
    // Show process selection
    redirect('/select-process')
  }
}
```

## 🎨 **UI/UX REQUIREMENTS**

### **Process Selection Screen (Dual-Process Users Only):**
- Clean, clear distinction between processes
- Visual icons and descriptions for each process
- Remember last selection
- Option to "always use this process"
- Quick access to switch processes later

### **Dashboard Customization:**
- Process-specific navigation menus
- Process-specific widgets and metrics
- Process-specific quick actions
- Clear indication of current process

### **Process Switcher Component:**
- Dropdown or toggle in main navigation
- Shows current process clearly
- Instant switching with confirmation if needed
- Available only to dual-process users

## 🔒 **SECURITY REQUIREMENTS**

### **API Access Control:**
```typescript
// Every API endpoint must check process permissions
async function checkProcessPermission(userId: string, requiredProcess: string) {
  const user = await getUserWithPermissions(userId)
  
  if (!user.process_permissions.includes(requiredProcess)) {
    throw new Error('Insufficient process permissions')
  }
  
  return true
}
```

### **Route Protection:**
- `/recruitment/*` routes require 'recruitment' permission
- `/bench-sales/*` routes require 'bench_sales' permission  
- `/dashboard` redirects based on permissions
- API endpoints enforce process permissions

## 📊 **ANALYTICS REQUIREMENTS**

### **Usage Tracking:**
- Track which process users select most often
- Monitor process switching frequency
- Measure time spent in each process
- Identify users who might benefit from additional access

### **Business Metrics:**
- Process adoption rates by role
- User productivity by process access type
- Feature usage by process
- Training needs identification

## 🧪 **TESTING SCENARIOS**

### **Test Cases:**
1. **Admin with both processes** - should see selection screen
2. **Recruiter with recruitment only** - should bypass selection
3. **Bench sales with bench sales only** - should bypass selection
4. **User with no processes** - should see access denied
5. **Process switching** - should work seamlessly
6. **Permission changes** - should take effect immediately
7. **Session persistence** - should remember selection
8. **API security** - should block unauthorized process access

This comprehensive approach ensures that users only see what they need while maintaining flexibility for users who work across both processes.
