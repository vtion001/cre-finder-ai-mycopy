# Architecture Overview

This document provides a comprehensive overview of the CRE Finder AI system architecture, including technical decisions, data flow, and integration patterns.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Marketing     │    │    Web App      │    │   Background    │
│   Website       │    │   (Next.js)     │    │     Jobs        │
│   (Next.js)     │    │                 │    │  (Trigger.dev)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Supabase     │
                    │   (Database +   │
                    │   Auth + API)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Stripe      │
                    │   (Payments)    │
                    └─────────────────┘
```

### Technology Stack

**Frontend:**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Component library built on Radix UI
- **React Query** - Server state management
- **Zustand** - Client state management

**Backend:**
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + API)
- **tRPC** - End-to-end type-safe APIs
- **Next.js Server Actions** - Server-side mutations
- **Trigger.dev** - Background job processing

**Infrastructure:**
- **Vercel** - Hosting and deployment
- **Stripe** - Payment processing
- **Google APIs** - Location services
- **Real Estate API** - Property data

## 🔄 Data Flow Architecture

### User Journey Flow

```
1. User Registration/Login
   ↓
2. Property Search Setup
   ↓
3. License Purchase (Stripe)
   ↓
4. Background Job Triggered
   ↓
5. Property Data Fetched
   ↓
6. Skip Trace Processing
   ↓
7. Data Available to User
```

### Detailed Data Flow

#### 1. User Authentication Flow

```
Browser → Supabase Auth → Database (users table) → Session Cookie
```

#### 2. Property Search Flow

```
Search Form → Server Action → License Creation → Stripe Checkout
     ↓
Stripe Webhook → License Activation → Background Job Trigger
     ↓
External API → Property Data → Database Storage → Cache Invalidation
```

#### 3. Data Access Flow

```
User Request → tRPC → Supabase Query → Cached Response → UI Update
```

## 🏢 Application Architecture

### Web Application (`apps/web`)

**Structure:**
```
apps/web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/        # Internationalization
│   │   ├── (sidebar)/       # Route groups
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── actions/             # Server actions
│   ├── trpc/               # tRPC configuration
│   └── lib/                # Utilities
```

**Key Patterns:**
- **Server Components** for data fetching
- **Client Components** for interactivity
- **Server Actions** for mutations
- **tRPC** for type-safe APIs

### Marketing Site (`apps/marketing`)

**Purpose:** Customer acquisition and product information

**Structure:**
```
apps/marketing/
├── src/
│   ├── app/                 # Static pages
│   ├── components/          # Marketing components
│   └── lib/                # Utilities
```

**Features:**
- Static site generation
- SEO optimization
- Lead capture forms
- Product showcases

### Database Layer (`apps/api`)

**Supabase Configuration:**
```
apps/api/
├── supabase/
│   ├── config.toml          # Supabase configuration
│   ├── migrations/          # Database schema changes
│   ├── seed.sql            # Test data
│   └── templates/          # Email templates
```

**Key Features:**
- Row Level Security (RLS)
- Real-time subscriptions
- Auto-generated APIs
- Built-in authentication

## 📦 Package Architecture

### Shared Packages Design

```
packages/
├── ui/                      # Design system
├── supabase/               # Database layer
├── jobs/                   # Background processing
├── property-data/          # External API integration
├── stripe/                 # Payment processing
└── logger/                 # Logging utilities
```

### Dependency Graph

```
apps/web → @v1/ui, @v1/supabase, @v1/jobs, @v1/property-data, @v1/stripe
apps/marketing → @v1/ui, @v1/supabase
packages/jobs → @v1/supabase, @v1/property-data
packages/supabase → @v1/logger, @v1/property-data
```

## 🔐 Security Architecture

### Authentication & Authorization

**Supabase Auth:**
- JWT-based authentication
- Row Level Security (RLS)
- OAuth providers (Google)
- Magic link authentication

**Authorization Patterns:**
```sql
-- Example RLS policy
CREATE POLICY "Users can only see their own data" ON users
FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only see their own licenses" ON asset_licenses
FOR ALL USING (auth.uid() = user_id);
```

### API Security

**tRPC Security:**
- Automatic user context injection
- Input validation with Zod
- Type-safe error handling

**Server Actions Security:**
- CSRF protection
- Input sanitization
- Authentication checks

**Webhook Security:**
- Signature verification (Stripe)
- Secret validation
- Idempotency handling

## 🔄 Background Job Architecture

### Trigger.dev Integration

**Job Types:**
1. **Property Data Fetching** - Fetch from external APIs
2. **Skip Trace Processing** - Contact information lookup
3. **Cache Invalidation** - Update cached data

**Job Flow:**
```
Stripe Webhook → License Creation → Job Trigger → External API → Database Update → Cache Invalidation
```

**Error Handling:**
- Automatic retries with exponential backoff
- Dead letter queues for failed jobs
- Comprehensive logging

## 💳 Payment Architecture

### Stripe Integration

**Payment Flow:**
```
License Selection → Checkout Session → Payment → Webhook → License Activation
```

**Subscription Model:**
- One-time fee: $1 per property record
- Monthly subscription: 50% of one-time fee
- Grace period on cancellation

**Webhook Events:**
- `checkout.session.completed` - License purchase
- `customer.subscription.updated` - Billing changes
- `invoice.payment_failed` - Payment failures

## 🗄️ Database Architecture

### Schema Design

**Core Entities:**
- **Users** - User profiles and settings
- **Asset Types** - Property categories
- **Licenses** - Search permissions (two-tier: asset + location)
- **Property Records** - Stored property data

**Relationships:**
```
users (1) → (n) asset_licenses (1) → (n) location_licenses (1) → (n) property_records
```

**Indexing Strategy:**
- Primary keys (UUID)
- Foreign key indexes
- Geographic indexes (lat/lng)
- Search indexes (text fields)

### Data Consistency

**ACID Compliance:**
- PostgreSQL transactions
- Foreign key constraints
- Check constraints
- Unique constraints

**Eventual Consistency:**
- Background job processing
- Cache invalidation
- Real-time updates

## 🚀 Performance Architecture

### Caching Strategy

**Multi-Level Caching:**
1. **Browser Cache** - Static assets
2. **CDN Cache** - Vercel Edge Network
3. **Application Cache** - Next.js cache
4. **Database Cache** - Supabase connection pooling

**Cache Invalidation:**
- Tag-based invalidation
- Background job triggers
- Real-time updates

### Database Optimization

**Query Optimization:**
- Selective field loading
- Pagination for large datasets
- Index usage monitoring
- Query plan analysis

**Connection Management:**
- Connection pooling
- Read replicas (future)
- Query timeout handling

## 🔍 Monitoring Architecture

### Observability Stack

**Application Monitoring:**
- Vercel Analytics
- Error tracking
- Performance metrics
- User behavior analytics

**Database Monitoring:**
- Supabase dashboard
- Query performance
- Connection metrics
- Storage usage

**Background Jobs:**
- Trigger.dev dashboard
- Job execution metrics
- Error rates
- Performance tracking

### Logging Strategy

**Structured Logging:**
- JSON format
- Correlation IDs
- User context
- Performance metrics

**Log Levels:**
- ERROR - System errors
- WARN - Business logic warnings
- INFO - Important events
- DEBUG - Detailed debugging

## 🌐 Deployment Architecture

### Multi-Environment Setup

**Environments:**
- **Development** - Local development
- **Staging** - Pre-production testing
- **Production** - Live application

**Environment Isolation:**
- Separate databases
- Separate API keys
- Separate domains
- Separate monitoring

### CI/CD Pipeline

**Deployment Flow:**
```
Git Push → GitHub Actions → Tests → Build → Deploy → Health Check
```

**Rollback Strategy:**
- Vercel instant rollbacks
- Database migration rollbacks
- Feature flag toggles

## 🔮 Future Architecture Considerations

### Scalability

**Horizontal Scaling:**
- Microservices extraction
- Database sharding
- CDN optimization
- Edge computing

**Performance Optimization:**
- Query optimization
- Caching improvements
- Background job optimization
- Real-time features

### Technology Evolution

**Potential Upgrades:**
- React Server Components adoption
- Edge runtime migration
- AI/ML integration
- Real-time collaboration

### Business Growth

**Feature Expansion:**
- Multi-tenant architecture
- API marketplace
- Third-party integrations
- Mobile applications

## 📊 Architecture Metrics

### Key Performance Indicators

**Technical Metrics:**
- Response time < 200ms (p95)
- Uptime > 99.9%
- Error rate < 0.1%
- Background job success rate > 99%

**Business Metrics:**
- User conversion rate
- License utilization
- Data accuracy
- Customer satisfaction

### Monitoring Dashboards

**Application Dashboard:**
- Request volume
- Response times
- Error rates
- User activity

**Infrastructure Dashboard:**
- Database performance
- Background job status
- Payment processing
- External API health

This architecture provides a solid foundation for the CRE Finder AI platform while maintaining flexibility for future growth and evolution.
