# PSII Development Guidelines

## File Organization Standards

### Directory Structure

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
├── docs/                     # 📖 ALL DOCUMENTATION FILES (.md)
├── scripts/                  # 🔧 ALL TESTING & UTILITY SCRIPTS
└── README.md                 # Project overview
```

### File Organization Rules

#### Documentation Files (`/docs/`)
**ALL `.md` files MUST be placed in `/docs/` folder**

Examples:
- `/docs/authentication.md` - Authentication system docs
- `/docs/development.md` - Development guidelines  
- `/docs/deployment.md` - Deployment instructions
- `/docs/api.md` - API documentation
- `/docs/database.md` - Database schema docs

#### Script Files (`/scripts/`)
**ALL testing, utility, and automation scripts MUST be placed in `/scripts/` folder**

Examples:
- `/scripts/auth-test.js` - Authentication testing
- `/scripts/create-test-users.js` - User creation utilities
- `/scripts/setup-dev.js` - Development environment setup
- `/scripts/migrate-data.js` - Data migration utilities
- `/scripts/cleanup.js` - Cleanup utilities

### Component Architecture

#### Size Constraints
- **Maximum 50 lines per component** (token limit optimization)
- Split large components into focused modules
- Use imports/exports for modularity

#### Component Structure
```typescript
// Keep components focused and under 50 lines
// JobCard.svelte (45 lines max)
// JobList.svelte (40 lines max) 
// JobModal.svelte (50 lines max)
```

### Technical Standards

#### Technology Stack
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions + Storage + Real-time)
- **Frontend:** SvelteKit with TypeScript
- **Hosting:** Vercel (both applications)
- **AI:** pgvector + OpenAI integration
- **Styling:** Tailwind CSS + Shadcn
- **Architecture:** Multi-tenant with Row-Level Security

#### Database Principles
- **Configurable Enums:** All dropdown values managed via console
- **Row-Level Security:** Multi-tenant data isolation at database level
- **Process Permissions:** Array-based user permissions system
- **Audit Logging:** All changes tracked in activity_logs table

#### Security Requirements
- **Authentication:** Supabase Auth with JWT tokens
- **Server-side Validation:** Always use `getUser()` not `getSession()`
- **Input Sanitization:** DOMPurify for all user inputs
- **HTTPS Everywhere:** Vercel + Supabase default
- **Environment Protection:** All secrets in environment variables

### Development Workflow

#### Before Starting Any Task
1. **Understand Project Scope** - Check existing documentation
2. **Review Codebase Structure** - Use Desktop Commander tools
3. **Identify Token Limits** - Plan file organization
4. **Check Dependencies** - Verify compatibility

#### File Management Best Practices
1. **Use Desktop Commander Tools:**
   - `read_file` to understand existing code
   - `list_directory` to verify organization
   - `search_code` to find related code
   - Never provide code snippets for manual pasting

2. **Documentation First:**
   - Create `.md` files in `/docs/` for any new features
   - Update existing documentation when making changes
   - Include examples and troubleshooting steps

3. **Script Organization:**
   - Place all utility scripts in `/scripts/`
   - Update `package.json` scripts section
   - Include usage documentation in script headers

#### Cost Considerations
- **Target:** $0-45/month total (Supabase + Vercel)
- **Development:** Free tier (Supabase free + Vercel free)
- **Production:** $45/month (Supabase Pro $25 + Vercel Pro $20)
- **Prioritize:** Open-source solutions over proprietary APIs

### Code Quality Standards

#### TypeScript Usage
- Strict typing for all new code
- Shared types in `/packages/shared-types/`
- Generate database types from Supabase schema

#### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation for failed operations

#### Testing Standards
- Unit tests for utility functions
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- All test scripts in `/scripts/` folder

### Collaboration Guidelines

#### Communication
- Document all architectural decisions
- Include reasoning for technology choices
- Provide cost-benefit analysis for paid services

#### Code Reviews
- Focus on security and performance
- Verify file organization standards
- Check documentation completeness

#### Version Control
- Clear commit messages with scope
- Feature branches for new development
- Squash commits before merging

### Migration Guidelines

When moving files to comply with organization standards:

1. **Identify File Types:**
   - Documentation (`.md`) → `/docs/`
   - Scripts (`.js`, `.ts`, utilities) → `/scripts/`
   - Application code → appropriate app folder

2. **Update References:**
   - Update `package.json` script paths
   - Fix import statements
   - Update documentation links

3. **Verify Functionality:**
   - Test all moved scripts
   - Verify documentation renders correctly
   - Check application builds successfully

### Performance Optimization

#### Token Management
- Keep individual files under 300 lines
- Split large files proactively at 200 lines
- Use modular imports effectively

#### Build Optimization
- Tree-shake unused code
- Optimize bundle sizes
- Lazy load non-critical components

#### Database Performance
- Index frequently queried columns
- Use materialized views for complex queries
- Optimize RLS policies for performance

### Security Best Practices

#### Authentication
- Server-side session validation only
- Proper permission checking on all routes
- Audit trail for sensitive operations

#### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies

#### Access Control
- Principle of least privilege
- Role-based access control
- Regular permission audits

This document ensures consistent development practices and proper file organization across the PSII project.
