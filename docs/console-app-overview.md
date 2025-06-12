# Console App - Business Settings Management

## Overview
The Console App is an internal management interface for ProcureServe II that allows administrators to:
- Manage configurable enums across all companies
- Review and activate business registrations
- Monitor system health and usage
- Configure platform-wide settings

## Architecture
- **Separate application** from customer-app for security isolation
- **Admin-only access** with role-based permissions
- **Shared components** with customer-app via packages
- **Direct Supabase integration** for real-time data management

## Key Features

### 1. Configurable Enums Management
- Work authorization types
- Job statuses and priorities
- Application statuses
- Candidate experience levels
- Interview types and statuses
- Company settings options

### 2. Business Registration Management
- Review pending registrations
- Approve/reject company applications
- Activate new companies
- Send activation emails

### 3. System Monitoring
- User activity tracking
- Performance metrics
- Error monitoring
- Usage analytics

### 4. Platform Configuration
- Global settings management
- Feature flags
- Email templates
- Notification settings

## Routes Structure
```
/
├── dashboard/              # Admin dashboard overview
├── registrations/          # Business registration management
│   ├── pending/           # Review pending registrations
│   ├── approved/          # Manage approved companies
│   └── rejected/          # Review rejected registrations
├── enums/                 # Configurable enums management
│   ├── work-auth/         # Work authorization types
│   ├── job-statuses/      # Job status configurations
│   ├── app-statuses/      # Application status flows
│   └── custom/            # Custom enum categories
├── companies/             # Company management
│   ├── list/              # All companies overview
│   ├── [id]/              # Individual company details
│   └── settings/          # Company-specific settings
├── monitoring/            # System monitoring
│   ├── activity/          # Activity logs
│   ├── performance/       # Performance metrics
│   └── errors/            # Error tracking
└── settings/              # Platform configuration
    ├── global/            # Global settings
    ├── features/          # Feature flags
    └── notifications/     # Notification templates
```

## Development Status
- 🔄 **In Progress**: Basic structure and routing
- 📋 **Next**: Admin authentication and dashboard
- 📋 **Future**: Enum management interfaces
- 📋 **Future**: Registration approval workflows

## Security Considerations
- **Separate domain**: console.procureserve.com
- **Admin-only access**: Role-based authentication
- **Audit logging**: All actions logged with user attribution
- **Rate limiting**: API protection for admin operations
- **Secure headers**: Enhanced security for admin interface

This console app will be developed in parallel with the main customer app features.
