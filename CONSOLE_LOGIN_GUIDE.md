# Console App Login Guide

## Quick Fix for Authentication Error

If you're getting "Authentication Error - An unexpected error occurred while trying to use console login page", the issue is likely that you're using incorrect login credentials.

### Default Login Credentials

The console app has three pre-configured test accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@procureserve.com` | `admin123` | Super Admin |
| `support@procureserve.com` | `admin123` | Company Admin |
| `sales@procureserve.com` | `admin123` | Company Manager |

### How to Login

1. Go to http://localhost:3005/login
2. Use any of the email addresses above
3. Enter password: `admin123`
4. Click "Sign In"

### Changing Your Password

To set a custom password for any console user:

1. Run the password reset script:
   ```bash
   node reset-console-password.js
   ```

2. Select the user you want to update
3. Enter a new password (minimum 6 characters)
4. Confirm the password

### Development Mode Features

When running in development mode (localhost), the login page will show:
- A blue info box with available test accounts
- More detailed error messages if login fails
- Helpful hints about correct credentials

### Troubleshooting

#### "Invalid email or password"
- Make sure you're using one of the test email addresses exactly as shown
- Make sure you're using the password `admin123`
- Check that Supabase is running: `npx supabase status`

#### "Access denied - not a console user"
- You're trying to log in with an email that's not registered as a console user
- Use one of the pre-configured test accounts listed above

#### "Account is inactive"
- The user account has been deactivated
- Contact an administrator to reactivate the account

### System Requirements

- Supabase must be running locally
- Console app must be running on port 3005
- Database must have console users properly configured

### Security Notes

- The default password `admin123` is only for development
- In production, users should set strong, unique passwords
- The forgot password functionality is available for password resets
- All login attempts are logged for security auditing

### Need Help?

If you're still having issues:

1. Check that Supabase is running: `npx supabase status`
2. Verify console users exist: `node debug-console-auth.js`
3. Check the console app logs for detailed error messages
4. Try the password reset tool: `node reset-console-password.js`
