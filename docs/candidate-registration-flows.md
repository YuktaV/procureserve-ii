# Candidate Registration & Profile Management

## Overview
ProcureServe II implements a progressive disclosure approach to candidate registration, separating account creation from profile completion to reduce friction and improve conversion rates.

## Candidate Creation Methods

### 1. Self-Registration (Implemented)
**Route:** `/register/candidate`
**API:** `POST /api/register/candidate`

**Flow:**
1. Candidate provides minimal information (name, email, password)
2. Supabase Auth account created
3. Basic candidate record created in database
4. Redirected to profile completion wizard
5. Profile completion is optional but encouraged

**Database Records:**
- `candidates` table with basic info
- `candidate_creation_methods` with method='self_registration'

### 2. Company-Created Candidate (Future)
**Route:** `/dashboard/candidates/create`
**API:** `POST /api/candidates/create`

**Flow:**
1. Company user creates candidate profile with resume/basic info
2. Candidate record created without auth account
3. Optional: Send invitation email to candidate
4. Candidate can claim account later via invitation link

**Use Cases:**
- Recruiter adds candidate from resume received via email
- Bulk import from ATS migration
- Adding candidates for immediate job submissions

### 3. Invitation-Based Creation (Future)
**Route:** `/invite/accept/{token}`
**API:** `POST /api/invitations/accept`

**Flow:**
1. Company sends invitation with pre-filled candidate info
2. Candidate clicks invitation link
3. Candidate completes registration (password, additional info)
4. Links existing candidate record to new auth account

**Use Cases:**
- Recruiter wants candidate to have login access
- Candidate referral programs
- Converting passive candidates to active users

### 4. Import/Bulk Creation (Future)
**Route:** `/dashboard/candidates/import`
**API:** `POST /api/candidates/bulk-import`

**Flow:**
1. Company uploads CSV/Excel file or connects to ATS
2. System processes and validates candidate data
3. Creates candidate records in batches
4. Generates import report with success/failure details

## Profile Completion Wizard

### Step 1: Work Authorization & Contact (Required)
- Phone number
- Work authorization status
- Visa expiration date (if applicable)

### Step 2: Optional Information
- Representing agency
- LinkedIn profile
- Preferred work location
- Availability date

### Step 3: Review & Complete
- Summary of provided information
- Option to skip remaining fields
- Completion confirmation

## Work Authorization Management

### Visa Tracking Features
- Automatic expiration alerts (60 days, 30 days, 7 days)
- Renewal reminder system
- Compliance reporting for companies
- Historical tracking of authorization changes

### Configurable Authorization Types
All work authorization types are managed via `configurable_enums`:
- US Citizen
- Green Card Holder
- H1B Visa
- L1 Visa
- OPT (Optional Practical Training)
- CPT (Curricular Practical Training)
- TN Visa (NAFTA)
- Other (with custom description)

## Representing Agency Management

### Agency Relationship Tracking
- Current agency relationship in `candidates.representing_agency`
- Historical relationships in `candidate_agency_history`
- Support for agency changes over time
- Audit trail of who made changes and when

### Agency Change Scenarios
1. **Initial Assignment:** Set during profile completion
2. **Agency Switch:** Candidate moves to different agency
3. **Direct Representation:** Candidate becomes self-representing
4. **Multiple Agencies:** Support for overlapping relationships (future)

## Profile Status Tracking

### Status Levels
- **incomplete:** Missing essential information
- **basic_complete:** Name, email, phone, work auth provided
- **full_complete:** All recommended fields completed

### Profile Completion Benefits
- Better job matching algorithm results
- Increased visibility to recruiters
- Access to premium features (future)
- Personalized job recommendations

## Security & Privacy

### Data Protection
- PII encryption for sensitive fields
- Row-level security for multi-tenant isolation
- Audit logging for all profile changes
- GDPR-compliant data deletion

### Access Control
- Candidates can only edit their own profiles
- Companies can view candidates they have relationships with
- Agencies can view their represented candidates
- Admin users have full access with audit trails

## API Endpoints

### Registration
- `POST /api/register/candidate` - Create new candidate account
- `GET /api/profile/complete` - Get current profile status
- `POST /api/profile/complete` - Update profile information

### Future Endpoints
- `POST /api/candidates/create` - Company creates candidate
- `POST /api/invitations/send` - Send candidate invitation
- `POST /api/invitations/accept` - Accept invitation
- `GET /api/candidates/profile/{id}` - Get candidate profile
- `PUT /api/candidates/profile/{id}` - Update candidate profile
- `POST /api/candidates/bulk-import` - Bulk import candidates

## Database Schema Key Tables

### Core Tables
- `candidates` - Main candidate information
- `candidate_creation_methods` - Track how candidate was created
- `candidate_agency_history` - Historical agency relationships

### Supporting Tables
- `configurable_enums` - Work authorization types, statuses
- `candidate_profile_status` - View with computed profile status
- `activity_logs` - Audit trail for all changes

## Performance Considerations

### Component Architecture
- All profile components kept under 50 lines
- Reusable components for work auth, status badges
- Progressive loading for large candidate lists
- Efficient database queries with proper indexing

### Token Efficiency
- Modular file structure to avoid large context windows
- Focused API endpoints with single responsibilities
- Minimal component dependencies
- Clear separation of concerns

## Future Enhancements

### Advanced Features
- Resume parsing and auto-population
- Skills extraction and matching
- Certification tracking and verification
- Interview scheduling integration
- Reference check management
- Background check status tracking

### Integration Opportunities
- ATS import/export capabilities
- Job board posting automation
- Social media profile enrichment
- Video interview platform integration
- Assessment tool integration
