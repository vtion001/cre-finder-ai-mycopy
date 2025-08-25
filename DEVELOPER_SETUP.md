# Developer Setup Guide for CRE Finder AI

This guide will help you set up a development environment with developer credentials and access to all test functionality.

## 🚀 Quick Start

### Option 1: One-Command Setup (Recommended)
```bash
./scripts/setup-developer.sh
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Start Supabase
cd apps/api
supabase start
cd ../..

# 3. Seed developer data
npm run db:seed

# 4. Start development server
npm run dev
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase CLI installed
- Docker running (for Supabase)
- Git

## 🔧 Installation Steps

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd cre-finder-ai
npm install
```

### 2. Environment Configuration
Copy the environment template and configure it:
```bash
cp env.example .env.local
```

Update `.env.local` with your specific values:
```bash
# Database Configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Development Mode
NODE_ENV=development
DEVELOPER_MODE=true
```

### 3. Start Supabase
```bash
cd apps/api
supabase start
cd ../..
```

### 4. Seed Developer Data
```bash
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

## 🔑 Developer Credentials

After running the seed script, you'll have access to:

**Email:** `dev@example.com`  
**Password:** `devpassword123`

## 🌐 Access Points

### Developer Login
- **URL:** `http://localhost:3001/auth/signin`
- **Purpose:** Developer authentication and access control

### Dashboard
- **URL:** `http://localhost:3001/dashboard`
- **Access:** Requires developer login

### VAPI Test
- **URL:** `http://localhost:3001/vapi-test`
- **Purpose:** Test VAPI integration functionality
- **Access:** Requires developer login

### Twilio Test
- **URL:** `http://localhost:3001/twilio-test`
- **Purpose:** Test Twilio SMS/Voice functionality
- **Access:** Requires developer login

## 🗄️ Database Schema

The seed script creates:

- **Developer User Account** (`auth.users` + `public.users`)
- **VAPI Configuration** (`vapi_configs`)
- **Twilio Configuration** (`twilio_configs`)
- **Test Property Records** (`properties`)
- **Integration Statuses** (`integration_statuses`)

## 🔍 Troubleshooting

### Common Issues

#### 1. Supabase Not Running
```bash
cd apps/api
supabase status
supabase start
cd ../..
```

#### 2. Database Connection Failed
- Verify Supabase is running
- Check environment variables
- Ensure database is accessible

#### 3. Seed Script Fails
```bash
# Check detailed error messages
npm run db:seed

# Reset database if needed
npm run db:reset
```

#### 4. Authentication Issues
- Verify developer user was created
- Check user role and permissions
- Ensure middleware is configured correctly

### Debug Commands

```bash
# Check Supabase status
supabase status

# View Supabase logs
supabase logs

# Reset database
supabase db reset

# Check user in database
supabase db query "SELECT * FROM auth.users WHERE email = 'dev@example.com';"
```

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:seed      # Seed developer data
npm run db:reset     # Reset database and seed

# Code Quality
npm run lint         # Run linter
npm run format       # Format code
npm run typecheck    # TypeScript type checking
```

## 🏗️ Architecture Overview

### Authentication Flow
1. User visits protected route
2. Middleware checks authentication
3. Redirects to `/auth/signin` if not authenticated
4. User logs in with developer credentials
5. Redirected to requested route

### Route Protection
- **Public Routes:** `/`, `/auth/signin`
- **Protected Routes:** `/dashboard/*`, `/vapi-test`, `/twilio-test`
- **Middleware:** Handles authentication and redirects

### Database Structure
- **Auth Tables:** `auth.users` (Supabase Auth)
- **Public Tables:** `users`, `vapi_configs`, `twilio_configs`, `properties`
- **Row Level Security:** Enabled on all public tables

## 🔒 Security Features

- **Row Level Security (RLS):** Users can only access their own data
- **Service Role Access:** Seed script uses service role for setup
- **Password Hashing:** bcrypt with salt rounds
- **Session Management:** Secure cookie-based sessions
- **Route Protection:** Middleware-based access control

## 🧪 Testing Features

### VAPI Integration
- Configuration management
- API testing
- Property record creation
- Database connectivity verification

### Twilio Integration
- Configuration management
- SMS capability testing
- Voice capability testing
- Webhook configuration

### Test Data Management
- One-click test data setup
- Status monitoring
- Automatic refresh
- Clear visual indicators

## 📝 Development Notes

### Adding New Protected Routes
1. Add route to middleware protection logic
2. Ensure user has appropriate permissions
3. Test authentication flow

### Modifying Seed Data
1. Update `scripts/seed-developer.ts`
2. Run `npm run db:seed` to apply changes
3. Verify data creation

### Environment Variables
- Never commit `.env.local` files
- Use `env.example` as template
- Document new variables in this guide

## 🚨 Production Considerations

**⚠️ IMPORTANT:** This setup is for development only!

- Never use these credentials in production
- Implement proper authentication in production
- Use environment-specific configurations
- Secure all API endpoints
- Implement proper logging and monitoring

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console logs and error messages
3. Verify all prerequisites are met
4. Check Supabase status and logs
5. Ensure environment variables are correct

## 🎯 Next Steps

After successful setup:

1. **Explore the Dashboard:** Navigate through different sections
2. **Test VAPI Integration:** Configure and test VAPI functionality
3. **Test Twilio Integration:** Configure and test Twilio functionality
4. **Review Test Data:** Check that all test data was created
5. **Customize Configuration:** Modify settings for your development needs

---

**Happy Coding! 🚀**

For additional help, check the project documentation or create an issue in the repository.
