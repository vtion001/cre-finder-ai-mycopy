# API Documentation

This document describes the API architecture and endpoints for CRE Finder AI.

## 🏗️ API Architecture

The application uses multiple API patterns:

1. **tRPC** - Type-safe API for client-server communication
2. **Next.js Server Actions** - Form submissions and mutations
3. **Supabase REST API** - Direct database queries
4. **Webhook Endpoints** - External service integrations
5. **Background Jobs** - Trigger.dev for async processing

## 🔧 tRPC API

The main API is built with tRPC for end-to-end type safety.

### Router Structure

```typescript
// apps/web/src/trpc/routers/_app.ts
export const appRouter = createTRPCRouter({
  records: recordsRouter,
  licenses: licensesRouter,
});
```

### Records Router (`/api/trpc/records`)

Handles property record operations.

#### `records.getByLicense`

Get property records for a specific license.

**Input:**
```typescript
{
  licenseId: string;
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    priceMin?: number;
    priceMax?: number;
    squareFeetMin?: number;
    squareFeetMax?: number;
  };
}
```

**Output:**
```typescript
{
  records: PropertyRecord[];
  totalCount: number;
  hasMore: boolean;
}
```

#### `records.export`

Export property records to CSV/Excel.

**Input:**
```typescript
{
  licenseId: string;
  format: 'csv' | 'excel';
  filters?: PropertyFilters;
}
```

**Output:**
```typescript
{
  downloadUrl: string;
  filename: string;
}
```

### Licenses Router (`/api/trpc/licenses`)

Handles license management operations.

#### `licenses.getByUser`

Get all licenses for the current user.

**Input:**
```typescript
{
  assetType?: string;
  includeExpired?: boolean;
}
```

**Output:**
```typescript
{
  assetLicenses: AssetLicense[];
  locationLicenses: LocationLicense[];
}
```

#### `licenses.checkAvailability`

Check if a location + asset type combination is available for licensing.

**Input:**
```typescript
{
  locations: string[];
  assetTypeSlug: string;
}
```

**Output:**
```typescript
{
  available: boolean;
  estimatedCount: number;
  pricing: {
    oneTime: number;
    monthly: number;
  };
}
```

## 🎯 Server Actions

Next.js Server Actions handle form submissions and mutations.

### Property Search Actions

#### `searchPropertiesAction`

Initiate a property search and create licenses.

**Location:** `apps/web/src/actions/search-properties-action.ts`

**Input:**
```typescript
{
  locations: Location[];
  assetTypeSlug: string;
  searchParams: SearchFilters;
}
```

**Output:**
```typescript
{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}
```

#### `getRealEstateLocationsAction`

Get location suggestions for autocomplete.

**Location:** `apps/web/src/actions/get-real-estate-locations-action.ts`

**Input:**
```typescript
{
  query: string;
  searchTypes?: ('C' | 'N')[]; // City or County
}
```

**Output:**
```typescript
Location[]
```

### User Management Actions

#### `updateUserProfileAction`

Update user profile information.

**Input:**
```typescript
{
  fullName?: string;
  phoneNumber?: string;
  timezone?: string;
  locale?: string;
}
```

#### `deleteUserAccountAction`

Delete user account and all associated data.

**Input:**
```typescript
{
  confirmEmail: string;
}
```

## 🔗 Webhook Endpoints

### Stripe Webhooks (`/api/webhook/stripe`)

Handles Stripe events for billing and subscription management.

**Location:** `apps/web/src/app/api/webhook/stripe/route.ts`

**Supported Events:**
- `checkout.session.completed` - License purchase completion
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Subscription cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

**Security:**
- Validates Stripe signature
- Verifies webhook secret

### Cache Revalidation (`/api/webhook/cache/revalidate`)

Revalidates Next.js cache tags from background jobs.

**Location:** `apps/web/src/app/api/webhook/cache/revalidate/route.ts`

**Input:**
```typescript
{
  tag: 'licenses' | 'records';
  id: string;
}
```

**Authentication:**
- Bearer token authentication
- Uses `NEXT_CACHE_API_SECRET`

## 🔄 Background Jobs (Trigger.dev)

Asynchronous processing for data-intensive operations.

### Update Property Records Job

**ID:** `update-property-records`
**Location:** `packages/jobs/src/update-property-records.ts`

**Purpose:** Fetch property data from external APIs and store in database.

**Input:**
```typescript
{
  licenseId: string;
  count?: boolean; // Whether to just count results
}
```

**Process:**
1. Fetch license and search parameters
2. Query external Real Estate API
3. Transform and store property records
4. Trigger skip trace job
5. Revalidate cache

### Skip Trace Job

**ID:** `skip-trace-task`
**Location:** `packages/jobs/src/skip-trace-results.ts`

**Purpose:** Perform skip tracing on property records to find owner contact information.

**Input:**
```typescript
{
  licenseId: string;
}
```

**Process:**
1. Fetch property records without skip trace data
2. Call skip trace API for each property
3. Store results in `skip_trace_data` field
4. Revalidate cache

## 🌐 External API Integrations

### Real Estate API

**Purpose:** Property data retrieval
**Provider:** RealEstateAPI.com
**Authentication:** API Key

**Endpoints Used:**
- Property search by location and filters
- Property details by ID
- Location autocomplete

### Skip Trace API

**Purpose:** Owner contact information
**Authentication:** API Key

**Data Retrieved:**
- Phone numbers
- Email addresses
- Additional addresses
- Social media profiles

### Google Places API

**Purpose:** Location autocomplete and validation
**Authentication:** API Key

**Endpoints Used:**
- Place autocomplete
- Place details
- Geocoding

## 🔒 Authentication & Authorization

### Supabase Auth

**Methods Supported:**
- Email/Password
- Magic Link
- Google OAuth
- Phone (SMS)

**Session Management:**
- JWT tokens
- Automatic refresh
- Server-side validation

### API Security

**tRPC:**
- Automatic user context injection
- Type-safe input validation
- Error handling

**Server Actions:**
- CSRF protection
- Input validation with Zod
- User authentication checks

**Webhooks:**
- Signature verification
- Secret validation
- Idempotency handling

## 📊 Rate Limiting

### External APIs

**Real Estate API:**
- 100 requests per minute
- Handled by queue system in background jobs

**Skip Trace API:**
- 50 requests per minute
- Automatic retry with exponential backoff

### Internal APIs

**tRPC:**
- No explicit rate limiting (handled by Vercel)
- Caching for expensive queries

**Server Actions:**
- Form submission rate limiting
- User-based throttling

## 🔍 Error Handling

### tRPC Errors

```typescript
// Standard error format
{
  code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR';
  message: string;
  data?: any;
}
```

### Server Action Errors

```typescript
// ActionResponse format
{
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Background Job Errors

- Automatic retry with exponential backoff
- Error logging to console and external services
- Graceful degradation for non-critical failures

## 📈 Performance Optimization

### Caching Strategy

**Next.js Cache:**
- Static page caching
- API route caching
- Database query caching

**React Query:**
- Client-side query caching
- Background refetching
- Optimistic updates

**Supabase:**
- Connection pooling
- Query optimization
- Index usage

### Database Optimization

**Indexes:**
- Property records by license
- Geographic queries
- User-specific lookups

**Query Patterns:**
- Pagination for large datasets
- Selective field loading
- Batch operations

## 🧪 Testing

### API Testing

**tRPC:**
- Unit tests for procedures
- Integration tests with test database
- Type safety validation

**Server Actions:**
- Form submission testing
- Error handling validation
- Authentication testing

**Background Jobs:**
- Mock external API responses
- Database state validation
- Error scenario testing

### Tools

- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **MSW** - API mocking
- **Supabase Test Helpers** - Database testing
