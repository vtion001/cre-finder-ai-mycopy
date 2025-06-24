# Development Setup Guide

This guide provides detailed instructions for setting up the CRE Finder AI development environment.

## 🛠️ Prerequisites

### Required Software

1. **Bun** (v1.1.26+)
   ```bash
   # Install Bun
   curl -fsSL https://bun.sh/install | bash
   
   # Verify installation
   bun --version
   ```

2. **Node.js** (v18+)
   ```bash
   # Using nvm (recommended)
   nvm install 18
   nvm use 18
   
   # Verify installation
   node --version
   npm --version
   ```

3. **Git**
   ```bash
   # Configure Git
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. **Supabase CLI**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Verify installation
   supabase --version
   ```

5. **Docker** (for Supabase local development)
   - Download and install Docker Desktop
   - Ensure Docker is running

### Optional Tools

1. **Stripe CLI** (for webhook testing)
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   ```

2. **VS Code Extensions**
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint
   - GitLens
   - Thunder Client (API testing)

## 🚀 Project Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd cre-finder-ai

# Install dependencies
bun install
```

### 2. Environment Configuration

#### Web App Environment

```bash
# Copy environment template
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here

# External APIs
GOOGLE_API_KEY=your-google-api-key
REALESTATEAPI_API_KEY=your-realestate-api-key

# Stripe Configuration (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Trigger.dev
TRIGGER_SECRET_KEY=tr_dev_...

# Security
NEXT_CACHE_API_SECRET=your-cache-secret

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MARKETING_URL=http://localhost:3001
```

#### Marketing Site Environment

```bash
# Copy environment template
cp apps/marketing/.env.example apps/marketing/.env.local
```

Edit `apps/marketing/.env.local`:

```env
# Supabase (for user checks)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Start Supabase

```bash
cd apps/api

# Start Supabase services
bun run dev
```

This will start:
- PostgreSQL database (port 54322)
- Supabase API (port 54321)
- Supabase Studio (port 54323)
- Auth server
- Storage server

#### Access Supabase Studio

1. Open http://localhost:54323
2. Default credentials are usually auto-configured
3. Explore the database schema and data

**Note:** For email configuration:
- **Development**: Uses local email templates from `apps/api/supabase/templates/`
- **Production**: Email templates are managed through Loops service, not Supabase

#### Run Migrations

```bash
cd apps/api

# Apply database migrations
bun run migrate

# Seed the database with test data
bun run seed
```

#### Generate TypeScript Types

```bash
cd apps/api

# Generate types from database schema
bun run generate
```

### 4. External API Setup

#### Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Places API
4. Create API key
5. Add key to environment variables

#### Real Estate API

1. Sign up at [RealEstateAPI.com](https://realestateapi.com/)
2. Get API key from dashboard
3. Add key to environment variables

#### Stripe Setup

1. Create [Stripe account](https://stripe.com/)
2. Get test API keys from dashboard
3. Install Stripe CLI for webhook testing
4. Add keys to environment variables

### 5. Background Jobs Setup

#### Trigger.dev Configuration

1. Sign up at [Trigger.dev](https://trigger.dev/)
2. Create new project
3. Get development API key
4. Add key to environment variables

#### Start Jobs Development

```bash
cd packages/jobs

# Start Trigger.dev development server
bun run dev
```

## 🏃‍♂️ Running the Application

### Start All Services

```bash
# From project root
bun dev
```

This starts:
- Web app (http://localhost:3000)
- Marketing site (http://localhost:3001)
- Supabase services
- Background job development

### Start Individual Services

```bash
# Web app only
bun dev:web

# Marketing site only
cd apps/marketing && bun dev

# Supabase only
cd apps/api && bun run dev

# Background jobs only
cd packages/jobs && bun run dev
```

## 🧪 Testing Setup

### Run Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test property-card.test.tsx
```

### Test Database

For integration tests, you may want a separate test database:

```bash
# Create test environment
cp apps/api/.env.example apps/api/.env.test

# Start test Supabase instance
supabase start --env test
```

## 🔧 Development Tools

### Code Quality

```bash
# Lint all packages
bun lint

# Fix linting issues
bun lint --fix

# Format code
bun format

# Type checking
bun typecheck
```

### Database Tools

```bash
cd apps/api

# Reset database (destructive)
bun run reset

# Create new migration
supabase migration new migration_name

# View database diff
supabase db diff

# Backup database
supabase db dump > backup.sql
```

### Package Management

```bash
# Add dependency to specific workspace
bun add <package> --filter=@v1/web

# Add dev dependency
bun add -D <package> --filter=@v1/ui

# Remove dependency
bun remove <package> --filter=@v1/web

# Update dependencies
bun update
```

## 🐛 Troubleshooting

### Common Issues

#### Supabase Won't Start

```bash
# Check Docker is running
docker ps

# Stop and restart Supabase
cd apps/api
supabase stop
supabase start

# Check logs
supabase logs
```

#### Port Conflicts

```bash
# Check what's using ports
lsof -i :3000
lsof -i :54321

# Kill processes if needed
kill -9 <PID>
```

#### Environment Variables Not Loading

```bash
# Verify .env.local files exist
ls -la apps/web/.env.local
ls -la apps/marketing/.env.local

# Check file permissions
chmod 644 apps/web/.env.local
```

#### TypeScript Errors

```bash
# Regenerate database types
cd apps/api
bun run generate

# Clear TypeScript cache
rm -rf node_modules/.cache
bun install

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### Package Installation Issues

```bash
# Clear package manager cache
bun pm cache rm

# Remove node_modules and reinstall
rm -rf node_modules
bun install

# Check for conflicting versions
bun why <package-name>
```

### Performance Issues

#### Slow Database Queries

1. Check Supabase Studio for slow queries
2. Add appropriate indexes
3. Optimize query patterns

#### Slow Build Times

```bash
# Clear Turbo cache
bun clean

# Use Turbo cache
bun build --cache-dir=.turbo
```

## 📱 Mobile Development

### Testing on Mobile

1. **Find your local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. **Update environment variables:**
   ```env
   NEXT_PUBLIC_APP_URL=http://192.168.1.100:3000
   ```

3. **Access from mobile device:**
   - Connect to same WiFi network
   - Open http://192.168.1.100:3000

### Responsive Testing

Use browser dev tools:
1. Open Chrome DevTools
2. Click device toolbar icon
3. Select device presets or custom dimensions

## 🔒 Security Considerations

### Local Development

- Never commit `.env.local` files
- Use test API keys only
- Keep Supabase local instance isolated
- Regularly update dependencies

### API Keys

- Store in environment variables only
- Use different keys for development/production
- Rotate keys regularly
- Monitor API usage

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community

- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com/)
- [Tailwind CSS Discord](https://discord.gg/tailwindcss)

### Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## 🆘 Getting Help

If you encounter issues:

1. **Check this documentation** first
2. **Search existing GitHub issues**
3. **Ask in team chat** for quick questions
4. **Create detailed issue** for bugs
5. **Schedule pairing session** for complex problems

Include in your help request:
- Operating system and version
- Node.js and Bun versions
- Error messages and stack traces
- Steps to reproduce the issue
- What you've already tried
