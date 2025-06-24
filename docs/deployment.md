# Deployment Guide

This guide covers deploying CRE Finder AI to production environments.

## 🏗️ Infrastructure Overview

The application is deployed across multiple services:

- **Frontend**: Vercel (Web App + Marketing Site)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Background Jobs**: Trigger.dev
- **Payments**: Stripe
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Supabase Logs

## 🚀 Production Deployment

### Prerequisites

1. **Accounts Required:**
   - Vercel account
   - Supabase account
   - Trigger.dev account
   - Stripe account
   - Domain name (optional)

2. **CLI Tools:**
   - Vercel CLI
   - Supabase CLI
   - Trigger.dev CLI
   - Stripe CLI (for testing)

### 1. Database Setup (Supabase)

#### Create Production Project

```bash
# Login to Supabase
supabase login

# Create new project
supabase projects create cre-finder-ai-prod

# Link local project to production
supabase link --project-ref <project-ref>
```

#### Deploy Database Schema

```bash
cd apps/api

# Push migrations to production
supabase db push

# Verify schema
supabase db diff
```

#### Configure Authentication

1. **Go to Supabase Dashboard** → Authentication → Settings
2. **Configure Site URL:**
   - Site URL: `https://app.crefinder.ai`
   - Redirect URLs: `https://app.crefinder.ai/**`

3. **Enable OAuth Providers:**
   - Google OAuth (configure client ID/secret)
   - Email/Password
   - Magic Link

4. **Email Templates:**
   - **Development**: Use templates from `apps/api/supabase/templates/`
   - **Production**: Email templates are managed through Loops (not Supabase templates)

#### Set Environment Variables

In Supabase Dashboard → Settings → API:

```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
```

### 2. Background Jobs (Trigger.dev)

#### Deploy Jobs

```bash
cd packages/jobs

# Login to Trigger.dev
npx trigger.dev login

# Deploy to production
npx trigger.dev deploy --env prod
```

#### Configure Environment

In Trigger.dev Dashboard → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
REALESTATEAPI_API_KEY=xxx
NEXT_PUBLIC_APP_URL=https://app.crefinder.ai
NEXT_CACHE_API_SECRET=xxx
```

### 3. Payment Processing (Stripe)

#### Configure Stripe

1. **Create Production Account**
2. **Configure Products:**
   ```bash
   stripe fixtures packages/stripe/src/fixtures/stripe-fixtures.json
   ```

3. **Set up Webhooks:**
   - Endpoint: `https://app.crefinder.ai/api/webhook/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

4. **Get API Keys:**
   - Publishable Key
   - Secret Key
   - Webhook Secret

### 4. Frontend Deployment (Vercel)

#### Deploy Web App

```bash
cd apps/web

# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External APIs
GOOGLE_API_KEY=AIza...
REALESTATEAPI_API_KEY=xxx

# Trigger.dev
TRIGGER_SECRET_KEY=tr_...

# Cache
NEXT_CACHE_API_SECRET=xxx
```

#### Deploy Marketing Site

```bash
cd apps/marketing

# Deploy marketing site
vercel --prod
```

#### Configure Domains

1. **Add Custom Domains:**
   - Web App: `app.crefinder.ai`
   - Marketing: `crefinder.ai`

2. **SSL Certificates:**
   - Automatically provisioned by Vercel

3. **DNS Configuration:**
   ```
   CNAME app.crefinder.ai → cname.vercel-dns.com
   CNAME crefinder.ai → cname.vercel-dns.com
   ```

## 🔧 Environment Configuration

### Production Environment Variables

#### Web App (`apps/web`)

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External APIs
GOOGLE_API_KEY=AIza...
REALESTATEAPI_API_KEY=xxx

# Background Jobs
TRIGGER_SECRET_KEY=tr_...

# Security
NEXT_CACHE_API_SECRET=xxx
NEXTAUTH_SECRET=xxx

# URLs
NEXT_PUBLIC_APP_URL=https://app.crefinder.ai
NEXT_PUBLIC_MARKETING_URL=https://crefinder.ai
```

#### Marketing Site (`apps/marketing`)

```env
# Database (read-only)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# URLs
NEXT_PUBLIC_APP_URL=https://app.crefinder.ai
```

### Staging Environment

Create staging versions of all services:

- **Database**: `cre-finder-ai-staging`
- **Domains**: `staging.crefinder.ai`, `app-staging.crefinder.ai`
- **Stripe**: Test mode
- **Trigger.dev**: Staging environment

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: Build applications
        run: bun build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Database Migrations

Automated migration deployment:

```yaml
- name: Deploy Database Migrations
  run: |
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    supabase db push
```

### Background Jobs Deployment

```yaml
- name: Deploy Trigger.dev Jobs
  run: |
    cd packages/jobs
    npx trigger.dev deploy --env prod
```

## 📊 Monitoring & Observability

### Application Monitoring

1. **Vercel Analytics:**
   - Page views and performance
   - Core Web Vitals
   - Error tracking

2. **Supabase Logs:**
   - Database queries
   - Authentication events
   - API usage

3. **Trigger.dev Dashboard:**
   - Job execution status
   - Error rates
   - Performance metrics

### Health Checks

Create health check endpoints:

```typescript
// apps/web/src/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    stripe: await checkStripe(),
    jobs: await checkTriggerDev(),
  };
  
  return Response.json(checks);
}
```

### Alerting

Set up alerts for:
- Database connection failures
- Payment processing errors
- Background job failures
- High error rates
- Performance degradation

## 🔒 Security Considerations

### Environment Security

1. **Secrets Management:**
   - Use Vercel environment variables
   - Rotate API keys regularly
   - Separate staging/production keys

2. **Database Security:**
   - Enable Row Level Security (RLS)
   - Use service role for background jobs only
   - Regular security updates

3. **API Security:**
   - Rate limiting
   - Input validation
   - CORS configuration

### SSL/TLS

- Automatic SSL certificates via Vercel
- HTTPS redirects enabled
- HSTS headers configured

## 🔄 Backup & Recovery

### Database Backups

Supabase provides:
- Automatic daily backups
- Point-in-time recovery
- Manual backup creation

### Application Backups

- Code: Git repository
- Environment variables: Documented and versioned
- Configuration: Infrastructure as Code

## 📈 Scaling Considerations

### Database Scaling

- **Vertical scaling**: Upgrade Supabase plan
- **Read replicas**: For read-heavy workloads
- **Connection pooling**: Built into Supabase

### Application Scaling

- **Vercel**: Automatic scaling
- **Edge functions**: For global performance
- **CDN**: Static asset optimization

### Background Jobs

- **Concurrency limits**: Configure in Trigger.dev
- **Queue management**: Built-in retry logic
- **Resource allocation**: Scale based on usage

## 🧪 Testing in Production

### Smoke Tests

Post-deployment verification:

```bash
# Health check
curl https://app.crefinder.ai/api/health

# Authentication
curl https://app.crefinder.ai/api/auth/session

# Database connectivity
curl https://app.crefinder.ai/api/trpc/licenses.getByUser
```

### Monitoring

- Set up synthetic monitoring
- Monitor key user journeys
- Track business metrics

## 🚨 Rollback Procedures

### Application Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Or deploy specific commit
vercel --prod --force
```

### Database Rollback

```bash
# Restore from backup
supabase db restore <backup-id>

# Or rollback specific migration
supabase migration down <migration-name>
```

### Background Jobs Rollback

```bash
# Deploy previous version
cd packages/jobs
npx trigger.dev deploy --env prod --version <previous-version>
```
