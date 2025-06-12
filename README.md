# ProcureServe II (PSII)

## Overview

Next-generation enterprise staffing platform rebuilt with Supabase-first architecture. Features dual-process workflow (recruitment + bench sales), configurable enums, and enterprise-grade security.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for Supabase)
- Git

### Setup
```bash
# Clone repository
git clone <repository-url>
cd PSII

# Install dependencies
npm install

# Start Supabase
npx supabase start

# Create test users
npm run create-test-users

# Start development server
cd apps/customer-app
npm install
npm run dev
```

### Testing Authentication
```bash
# Run comprehensive auth tests
npm run test-auth

# Access test interface
open http://localhost:3004/test-users
```

## 📁 Project Structure

```
/Users/vasanthan/Desktop/PSII/
├── apps/
│   ├── customer-app/          # app.procureserve.com (SvelteKit)
│   └── console-app/           # console.procureserve.com (SvelteKit)
├── packages/
│   ├── shared-types/          # TypeScript interfaces
│   ├── shared-utils/          # Common functions
│   └── database-types/        # Supabase generated types
├── supabase/                  # Backend services
│   ├── migrations/            # Database schema
│   ├── seed.sql              # Initial data
│   └── config.toml           # Local configuration
├── docs/                     # 📖 ALL DOCUMENTATION (.md files)
│   ├── authentication.md     # Auth system documentation
│   ├── development.md         # Development guidelines
│   └── testing.md            # Testing procedures
├── scripts/                  # 🔧 ALL TESTING & UTILITY SCRIPTS
│   ├── auth-test.js          # Authentication testing
│   ├── create-test-users.js  # Test user creation
│   ├── check-db.js           # Database verification
│   ├── fix-user-ids.js       # User sync utilities
│   └── README.md             # Scripts documentation
└── package.json              # Root dependencies & scripts
```

## 🏗️ Architecture

### Technology Stack
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions + Storage + Real-time)
- **Frontend:** SvelteKit with TypeScript
- **Hosting:** Vercel (both applications)
- **AI:** pgvector + OpenAI integration
- **Styling:** Tailwind CSS + Shadcn
- **Architecture:** Multi-tenant with Row-Level Security

### Key Features
- **Dual Process System:** Recruitment + Bench Sales workflows
- **Configurable Enums:** All dropdown values managed via console
- **Multi-tenant Architecture:** Company-scoped data isolation
- **Enterprise Security:** Row-Level Security, audit logging, PII protection
- **AI Integration:** Resume parsing, candidate matching, job suggestions

## 🔐 Authentication System

### User Types & Permissions

| User Type | Permissions | Behavior |
|-----------|-------------|----------|
| Admin | `['recruitment', 'bench_sales']` | Process selection screen |
| Manager | `['recruitment', 'bench_sales']` | Process selection screen |
| Recruiter | `['recruitment']` | Direct to recruitment dashboard |
| Bench Sales | `['bench_sales']` | Direct to bench sales dashboard |
| No Access | `[]` | Access denied |

### Test Users
All test users use password: `password123`

- `admin@acme-staffing.com` - Admin with both processes
- `manager@acme-staffing.com` - Manager with both processes
- `recruiter@acme-staffing.com` - Recruitment only
- `bench@acme-staffing.com` - Bench sales only
- `noprocess@acme-staffing.com` - No permissions

### Quick Testing
```bash
# Test interface with one-click login
http://localhost:3004/test-users
```

## 🧪 Testing

### Automated Testing
```bash
# Run all authentication tests
npm run test-auth

# Check database synchronization
npm run check-db

# Fix user ID mismatches
npm run fix-user-ids
```

### Manual Testing
1. Access test interface: `http://localhost:3004/test-users`
2. Click "Login as [Role]" for each user type
3. Verify expected redirect behavior
4. Test route protection manually

## 📖 Documentation

### Available Docs
- **[Authentication System](/docs/authentication.md)** - Complete auth documentation
- **[Development Guidelines](/docs/development.md)** - File organization & standards
- **[Testing Guide](/docs/testing.md)** - Comprehensive testing procedures
- **[Scripts Documentation](/scripts/README.md)** - All utility scripts

### File Organization Rules
- **Documentation:** ALL `.md` files → `/docs/` folder
- **Scripts:** ALL testing/utility scripts → `/scripts/` folder
- **Components:** Maximum 50 lines per component
- **Imports:** Modular, tree-shakeable structure

## 🛠️ Development

### Environment URLs
- **Customer App:** http://localhost:3004/
- **Supabase Studio:** http://localhost:54333
- **API URL:** http://127.0.0.1:54321
- **DB Direct:** postgresql://postgres:postgres@127.0.0.1:54332/postgres

### Development Workflow
1. **File Organization:** Follow `/docs/development.md` guidelines
2. **Component Architecture:** Keep components under 50 lines
3. **Testing:** Use provided scripts for validation
4. **Documentation:** Update relevant `.md` files for changes

### Available Scripts
```bash
# Authentication & Testing
npm run test-auth              # Run auth tests
npm run create-test-users      # Create test users
npm run check-db              # Check database sync
npm run fix-user-ids          # Fix user ID issues

# Development
cd apps/customer-app
npm run dev                   # Start customer app
npm run build                 # Build for production

# Database
npx supabase start            # Start local Supabase
npx supabase db reset         # Reset database
npx supabase studio           # Open Supabase Studio
```

## 🔧 Configuration

### Supabase Configuration
- **API URL:** http://127.0.0.1:54321
- **DB URL:** postgresql://postgres:postgres@127.0.0.1:54332/postgres
- **Studio URL:** http://127.0.0.1:54333
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Cost Structure
- **Development:** Free (Supabase free + Vercel free)
- **Production:** $45/month (Supabase Pro $25 + Vercel Pro $20)
- **Target:** Cost-effective, open-source first approach

## 🚨 Current Status

### ✅ Completed
- **Authentication System:** Fully functional with comprehensive testing
- **Database Schema:** Complete with process permissions
- **Test Infrastructure:** Automated testing & user management
- **File Organization:** Proper structure with docs & scripts folders
- **Security Fixes:** Resolved all critical authentication vulnerabilities

### 🔄 In Progress
- **User Interface Testing:** Manual validation of all user scenarios
- **Route Protection:** Verification of permission-based access
- **Process Selection:** Testing multi-process user workflows

### 📋 Next Steps
1. **Complete Manual Testing** - Validate all user scenarios
2. **Process Selection UI** - Test switching between processes
3. **Dashboard Development** - Build process-specific dashboards
4. **Production Deployment** - Configure production environment

## 🤝 Contributing

### Development Standards
- Follow file organization in `/docs/development.md`
- All documentation in `/docs/` folder
- All scripts in `/scripts/` folder
- Maximum 50 lines per component
- Comprehensive testing for all changes

### Before Contributing
1. Review development guidelines
2. Test authentication system
3. Verify file organization
4. Update relevant documentation

## 📞 Support

### Troubleshooting
1. **Check Documentation:** Review `/docs/` folder
2. **Run Tests:** Use scripts in `/scripts/` folder  
3. **Verify Environment:** Ensure Supabase is running
4. **Check Logs:** Enable debug logging for issues

### Common Issues
- **Authentication failures:** Run `npm run fix-user-ids`
- **Missing test users:** Run `npm run create-test-users`
- **Database connection:** Check `npx supabase status`

## 📄 License

[License information to be added]

---

**Built with ❤️ using Supabase, SvelteKit, and modern web technologies**
