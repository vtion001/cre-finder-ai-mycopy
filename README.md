# CRE Finder AI - Commercial Real Estate Search Platform

CRE Finder AI is a comprehensive commercial real estate search platform that enables users to find off-market commercial properties with AI-powered search capabilities. The platform provides property data, skip tracing, and subscription-based licensing for commercial real estate professionals.

## 🏗️ Architecture Overview

This is a **Turborepo monorepo** built with modern web technologies:

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI**: Shadcn/UI + Radix UI + Tailwind CSS
- **Background Jobs**: Trigger.dev v3
- **Payments**: Stripe
- **Package Manager**: Bun
- **Build System**: Turbo

## 📁 Project Structure

```
cre-finder-ai/
├── apps/
│   ├── web/           # Main web application (Next.js)
│   ├── marketing/     # Marketing website (Next.js)
│   └── api/           # Supabase configuration & migrations
├── packages/
│   ├── ui/            # Shared UI components (Shadcn/UI)
│   ├── supabase/      # Database client & queries
│   ├── jobs/          # Background jobs (Trigger.dev)
│   ├── property-data/ # Property data utilities & types
│   ├── stripe/        # Stripe integration
│   └── logger/        # Logging utilities
├── tooling/
│   └── typescript/    # Shared TypeScript configuration
└── scripts/           # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- **Bun** (v1.1.26+) - Package manager
- **Node.js** (v18+)
- **Supabase CLI** - For local database
- **Stripe CLI** - For webhook testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cre-finder-ai
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/web/.env.example apps/web/.env.local
   cp apps/marketing/.env.example apps/marketing/.env.local
   ```

4. **Start Supabase locally**
   ```bash
   cd apps/api
   bun run dev  # Starts Supabase stack
   ```

5. **Run the development servers**
   ```bash
   # Start all apps in parallel
   bun dev

   # Or start specific apps
   bun dev:web     # Web app only (port 3000)
   ```

### Development URLs

- **Web App**: http://localhost:3000
- **Marketing Site**: http://localhost:3001
- **Supabase Studio**: http://localhost:54323
- **Supabase API**: http://localhost:54321

## 🏢 Applications

### Web App (`apps/web`)

The main application where users search for commercial real estate properties.

**Key Features:**
- User authentication (Supabase Auth)
- Property search with filters
- Interactive maps (MapLibre GL)
- License management & billing
- Property data export
- Skip tracing integration

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/UI
- tRPC for API
- React Query for data fetching
- Zustand for state management

### Marketing Site (`apps/marketing`)

Static marketing website for customer acquisition.

**Features:**
- Landing page
- Pricing information
- Feature showcase
- Call-to-action sections

### API (`apps/api`)

Supabase configuration including database migrations, seed data, and configuration.

**Components:**
- Database schema & migrations
- Row Level Security (RLS) policies
- Auth configuration
- Storage buckets
- Edge functions

**Note:** Production email templates are managed through Loops, not the local templates folder.

## 📦 Shared Packages

### UI Package (`packages/ui`)

Shared component library built on Shadcn/UI and Radix UI.

**Components:**
- Form components (Input, Select, Button, etc.)
- Layout components (Card, Dialog, Sheet, etc.)
- Data display (Table, Badge, Avatar, etc.)
- Navigation (Sidebar, Breadcrumb, etc.)
- Feedback (Alert, Toast, Loading, etc.)

### Supabase Package (`packages/supabase`)

Database client and query utilities.

**Exports:**
- `client` - Browser client
- `server` - Server-side client
- `job` - Background job client
- `queries` - Cached queries
- `mutations` - Database mutations
- `types` - TypeScript types

### Jobs Package (`packages/jobs`)

Background job processing with Trigger.dev.

**Jobs:**
- `updatePropertyRecordsTask` - Fetch and store property data
- `skipTraceTask` - Perform skip tracing on properties
- Cache revalidation utilities

### Property Data Package (`packages/property-data`)

Property data utilities and external API integrations.

**Features:**
- Real Estate API integration
- Data transformation utilities
- Property search queries
- Location formatting

### Stripe Package (`packages/stripe`)

Payment processing and subscription management.

**Features:**
- Stripe client configuration
- Webhook handling
- Subscription management
- Payment utilities

### Logger Package (`packages/logger`)

Centralized logging with Pino.

## 🗄️ Database Schema

The application uses PostgreSQL via Supabase with the following key tables:

### Core Tables

- **`users`** - User profiles and settings
- **`asset_types`** - Property types (office, retail, industrial, etc.)
- **`asset_licenses`** - User licenses for property types
- **`location_licenses`** - Location-specific licenses with expiration
- **`property_records`** - Stored property data from searches

### Billing Tables

- **`customers`** - Stripe customer mapping
- **`products`** - Stripe products
- **`prices`** - Stripe pricing
- **`subscriptions`** - Active subscriptions

## 🔧 Development Commands

```bash
# Development
bun dev                 # Start all apps
bun dev:web            # Start web app only

# Building
bun build              # Build all apps
bun clean              # Clean all build artifacts

# Database
cd apps/api
bun run migrate        # Run migrations
bun run seed          # Seed database
bun run reset         # Reset database
bun run generate      # Generate TypeScript types

# Jobs
cd packages/jobs
bun run dev           # Start Trigger.dev development
bun run deploy        # Deploy jobs to Trigger.dev

# Code Quality
bun lint              # Lint all packages
bun format            # Format code
bun typecheck         # Type checking
```

## 🌍 Environment Variables

### Required Environment Variables

**Web App (`apps/web/.env.local`):**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# External APIs
GOOGLE_API_KEY=
REALESTATEAPI_API_KEY=

# Trigger.dev
TRIGGER_SECRET_KEY=

# Cache
NEXT_CACHE_API_SECRET=
```

**Marketing Site (`apps/marketing/.env.local`):**
```env
# Supabase (for user checks)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 📋 Getting Started for New Developers

1. **Read this documentation** thoroughly
2. **Set up the development environment** following the Quick Start guide
3. **Explore the codebase** starting with:
   - `apps/web/src/app` - Main application routes
   - `packages/ui/src/components` - UI components
   - `packages/supabase/src` - Database queries
4. **Run the application locally** and test core features
5. **Check the database schema** in Supabase Studio
6. **Review the background jobs** in `packages/jobs`

## 🔗 Additional Documentation

- [Architecture Overview](./docs/architecture.md) - System design and technical decisions
- [Development Setup](./docs/development-setup.md) - Detailed setup instructions
- [Database Schema](./docs/database-schema.md) - Complete database documentation
- [API Documentation](./docs/api.md) - API endpoints and integration guide
- [Shared Packages](./docs/packages.md) - Monorepo package documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [Contributing Guidelines](./docs/contributing.md) - Development workflow and standards

## 🤝 Team Integration

For new team members:

1. **Access Requirements:**
   - GitHub repository access
   - Supabase project access
   - Stripe dashboard access
   - Trigger.dev project access

2. **Development Setup:**
   - Follow the Quick Start guide
   - Request environment variables from team lead
   - Test local development environment

3. **Code Standards:**
   - TypeScript strict mode
   - Biome for linting and formatting
   - Conventional commits
   - Component-driven development

## 📞 Support

For questions or issues:
- Check existing documentation
- Review GitHub issues
- Contact the development team
- Refer to individual package READMEs for specific details
