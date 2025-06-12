# PSII E2E Testing Documentation

## Playwright Test Suite

### Setup Commands
```bash
# Complete test setup and execution
npm run test-complete

# Run E2E tests only
npm run test-e2e

# Run with UI (interactive)
npm run test-e2e-ui
```

### Test Coverage

#### Authentication Flows
- **Multi-process users**: Admin/Manager → Process selection
- **Single-process users**: Direct dashboard routing
- **No-access users**: Access denied pages
- **Route protection**: Permission-based access control
- **Sign out flows**: Session clearing and redirects

#### Specific Test Cases
1. **Admin Flow**: Login → Process selection → Both dashboards accessible
2. **Recruiter Flow**: Login → Recruitment dashboard → Bench sales blocked
3. **Bench Sales Flow**: Login → Bench sales dashboard → Recruitment blocked
4. **No Access Flow**: Login → Access denied
5. **Sign Out Flow**: Authentication clearing → Login redirect

### Test Configuration
- **Browser**: Chromium (desktop)
- **Timeout**: 30s per test
- **Retry**: 2x on CI
- **Screenshots**: On failure only
- **Video**: Retained on failure

### Reports
- **HTML Report**: `npx playwright show-report`
- **Traces**: Available on retry attempts
- **Screenshots/Videos**: In test-results folder

### Test Structure
```
scripts/e2e-tests.spec.js
├── Authentication flow tests (5 users)
├── Process selection flow
├── Route protection tests
└── Sign out flow validation
```

This ensures comprehensive validation of all authentication scenarios implemented.
