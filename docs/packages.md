# Shared Packages Documentation

This document describes the shared packages in the CRE Finder AI monorepo and how to use them effectively.

## 📦 Package Overview

The monorepo contains several shared packages that provide reusable functionality across applications:

- **`@v1/ui`** - Shared UI components and design system
- **`@v1/supabase`** - Database client and query utilities
- **`@v1/jobs`** - Background job processing
- **`@v1/property-data`** - Property data utilities and external API integrations
- **`@v1/stripe`** - Payment processing utilities
- **`@v1/logger`** - Centralized logging

## 🎨 UI Package (`@v1/ui`)

### Overview

The UI package provides a comprehensive component library built on Shadcn/UI, Radix UI, and Tailwind CSS.

### Installation

```typescript
// In your app's package.json
{
  "dependencies": {
    "@v1/ui": "workspace:*"
  }
}
```

### Usage

```typescript
// Import components
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardHeader } from '@v1/ui/card';
import { Input } from '@v1/ui/input';
import { cn } from '@v1/ui/cn';

// Use in your components
export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>Property Search</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Enter location..." />
        <Button className={cn("w-full")}>Search</Button>
      </CardContent>
    </Card>
  );
}
```

### Available Components

#### Form Components
- `Button` - Various button styles and sizes
- `Input` - Text input with validation states
- `Textarea` - Multi-line text input
- `Select` - Dropdown selection
- `Checkbox` - Boolean input
- `RadioGroup` - Single selection from options
- `Switch` - Toggle switch
- `Slider` - Range input

#### Layout Components
- `Card` - Content container
- `Sheet` - Slide-out panel
- `Dialog` - Modal dialog
- `Drawer` - Mobile-friendly drawer
- `Tabs` - Tabbed interface
- `Accordion` - Collapsible content
- `Separator` - Visual divider

#### Data Display
- `Table` - Data tables with sorting
- `Badge` - Status indicators
- `Avatar` - User profile images
- `Progress` - Progress indicators
- `Skeleton` - Loading placeholders

#### Navigation
- `Sidebar` - Application sidebar
- `Breadcrumb` - Navigation breadcrumbs
- `Pagination` - Page navigation
- `NavigationMenu` - Top navigation

#### Feedback
- `Alert` - Notification messages
- `Toast` (via Sonner) - Temporary notifications
- `Tooltip` - Hover information
- `HoverCard` - Rich hover content

### Styling System

The UI package uses a design token system:

```typescript
// Import global styles
import '@v1/ui/globals.css';

// Use design tokens
<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Heading</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Customization

```typescript
// Extend Tailwind config
import { tailwindConfig } from '@v1/ui/tailwind.config';

export default {
  ...tailwindConfig,
  content: [
    ...tailwindConfig.content,
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...tailwindConfig.theme,
    extend: {
      // Your customizations
    },
  },
};
```

## 🗄️ Supabase Package (`@v1/supabase`)

### Overview

Provides type-safe database clients and query utilities for Supabase integration.

### Exports

```typescript
// Database clients
import { createClient } from '@v1/supabase/client';      // Browser client
import { createClient } from '@v1/supabase/server';      // Server client
import { createClient } from '@v1/supabase/job';         // Background job client

// Query utilities
import { getUser, getUserLicenses } from '@v1/supabase/cached-queries';
import { insertPropertyRecord } from '@v1/supabase/mutations';

// Types
import type { Database, Tables } from '@v1/supabase/types';
```

### Client Usage

```typescript
// Browser client (client components)
'use client';
import { createClient } from '@v1/supabase/client';

export function useUserProfile() {
  const supabase = createClient();
  
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .single();
      return data;
    },
  });
}

// Server client (server components)
import { createClient } from '@v1/supabase/server';

export async function UserProfile() {
  const supabase = createClient();
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .single();
    
  return <div>{user?.full_name}</div>;
}
```

### Cached Queries

Pre-built queries with caching:

```typescript
import { getUser, getUserLicenses } from '@v1/supabase/cached-queries';

// In server components
export async function Dashboard() {
  const user = await getUser();
  const licenses = await getUserLicenses(user.id);
  
  return (
    <div>
      <h1>Welcome, {user.full_name}</h1>
      <LicenseList licenses={licenses} />
    </div>
  );
}
```

### Mutations

```typescript
import { insertPropertyRecord, updateUserProfile } from '@v1/supabase/mutations';

// In server actions
export async function updateProfile(formData: FormData) {
  const result = await updateUserProfile({
    fullName: formData.get('fullName') as string,
    phoneNumber: formData.get('phoneNumber') as string,
  });
  
  return result;
}
```

### Types

```typescript
import type { Database, Tables } from '@v1/supabase/types';

// Use generated types
type User = Tables<'users'>;
type PropertyRecord = Tables<'property_records'>;
type AssetLicense = Tables<'asset_licenses'>;

// Function with typed parameters
function processUser(user: User): string {
  return user.full_name || user.email;
}
```

## ⚡ Jobs Package (`@v1/jobs`)

### Overview

Background job processing using Trigger.dev for async operations.

### Available Jobs

```typescript
// Import job functions
import { updatePropertyRecordsTask } from '@v1/jobs/update-property-records';
import { skipTraceTask } from '@v1/jobs/skip-trace-results';
```

### Triggering Jobs

```typescript
import { tasks } from '@trigger.dev/sdk/v3';

// Trigger property update job
const handle = await tasks.trigger(
  'update-property-records',
  {
    licenseId: 'license-uuid',
    count: false,
  }
);

// Batch trigger multiple jobs
const handles = await tasks.batchTrigger(
  'update-property-records',
  licenses.map(license => ({
    payload: { licenseId: license.id }
  }))
);
```

### Job Development

```typescript
import { schemaTask } from '@trigger.dev/sdk/v3';
import { z } from 'zod';

export const myCustomTask = schemaTask({
  id: 'my-custom-task',
  schema: z.object({
    userId: z.string(),
    data: z.any(),
  }),
  queue: {
    concurrencyLimit: 5,
  },
  maxDuration: 300, // 5 minutes
  run: async (payload, { ctx }) => {
    // Job implementation
    console.log(`Processing for user: ${payload.userId}`);
    
    // Your logic here
    
    return { success: true };
  },
});
```

## 🏠 Property Data Package (`@v1/property-data`)

### Overview

Utilities for property data processing and external API integrations.

### Exports

```typescript
// API queries
import { getPropertySearchQuery, getAutocompleteQuery } from '@v1/property-data/queries';

// Utility functions
import { mapPropertyToRecord, parseLocationCode, getStateFullName, isValidStateCode } from '@v1/property-data/utils';

// Types
import type { PropertySearchParams, Location } from '@v1/property-data/types';
```

### Usage

```typescript
// Property search
import { getPropertySearchQuery } from '@v1/property-data/queries';

const properties = await getPropertySearchQuery({
  location: 'miami-fl',
  assetType: 'office',
  filters: {
    priceMin: 100000,
    priceMax: 1000000,
  },
});

// Location autocomplete
import { getAutocompleteQuery } from '@v1/property-data/queries';

const suggestions = await getAutocompleteQuery({
  query: 'miami',
  searchTypes: ['C', 'N'], // Cities and Counties
});

// Data transformation
import { mapPropertyToRecord } from '@v1/property-data/utils';

const record = mapPropertyToRecord(apiProperty, licenseId, userId);

// State code utilities
import { getStateFullName, isValidStateCode } from '@v1/property-data/utils';

const fullStateName = getStateFullName('FL'); // Returns "Florida"
const isValid = isValidStateCode('CA'); // Returns true
```

### Types

```typescript
import type { 
  PropertySearchParams,
  Location,
  PropertyRecord,
  SearchFilters 
} from '@v1/property-data/types';

// Use in your functions
function searchProperties(params: PropertySearchParams): Promise<PropertyRecord[]> {
  // Implementation
}
```

## 💳 Stripe Package (`@v1/stripe`)

### Overview

Payment processing utilities and Stripe integration.

### Exports

```typescript
// Stripe clients
import { stripe } from '@v1/stripe/server';           // Server-side Stripe
import { getStripe } from '@v1/stripe/client';        // Client-side Stripe

// Configuration
import { stripeConfig } from '@v1/stripe/config';

// Utilities
import { formatPrice, createCheckoutSession } from '@v1/stripe/helpers';
```

### Server Usage

```typescript
import { stripe } from '@v1/stripe/server';

// Create checkout session
export async function createLicenseCheckout(licenseData: LicenseData) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${licenseData.assetType} License`,
        },
        unit_amount: licenseData.totalCost * 100,
        recurring: {
          interval: 'month',
        },
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/licenses?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/search`,
    metadata: {
      type: 'license',
      userId: licenseData.userId,
      // Additional metadata
    },
  });
  
  return session;
}
```

### Client Usage

```typescript
'use client';
import { getStripe } from '@v1/stripe/client';

export function CheckoutButton({ sessionId }: { sessionId: string }) {
  const handleCheckout = async () => {
    const stripe = await getStripe();
    
    if (!stripe) return;
    
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
    
    if (error) {
      console.error('Stripe checkout error:', error);
    }
  };
  
  return (
    <Button onClick={handleCheckout}>
      Complete Purchase
    </Button>
  );
}
```

### Webhook Handling

```typescript
import { stripe } from '@v1/stripe/server';

export async function handleStripeWebhook(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
  }
}
```

## 📝 Logger Package (`@v1/logger`)

### Overview

Centralized logging using Pino for structured logging.

### Usage

```typescript
import { logger } from '@v1/logger';

// Basic logging
logger.info('User logged in', { userId: '123' });
logger.error('Database connection failed', { error: error.message });
logger.warn('Rate limit approaching', { requests: 95, limit: 100 });

// Structured logging
logger.info({
  event: 'property_search',
  userId: '123',
  location: 'miami-fl',
  assetType: 'office',
  resultCount: 45,
  duration: 1250,
}, 'Property search completed');

// Child loggers
const userLogger = logger.child({ userId: '123' });
userLogger.info('Profile updated');
userLogger.error('Payment failed');
```

### Configuration

```typescript
// Custom logger configuration
import { createLogger } from '@v1/logger';

const customLogger = createLogger({
  level: 'debug',
  redact: ['password', 'token'],
  serializers: {
    error: (err) => ({
      message: err.message,
      stack: err.stack,
    }),
  },
});
```

## 🔧 Package Development

### Creating a New Package

1. **Create package directory:**
   ```bash
   mkdir packages/my-package
   cd packages/my-package
   ```

2. **Initialize package.json:**
   ```json
   {
     "name": "@v1/my-package",
     "version": "0.1.0",
     "private": true,
     "main": "./src/index.ts",
     "exports": {
       ".": "./src/index.ts",
       "./utils": "./src/utils/index.ts"
     },
     "scripts": {
       "clean": "rm -rf .turbo node_modules",
       "lint": "biome check .",
       "typecheck": "tsc --noEmit"
     },
     "devDependencies": {
       "typescript": "^5.8.3"
     }
   }
   ```

3. **Create TypeScript config:**
   ```json
   {
     "extends": "@v1/typescript/base.json",
     "include": ["src"],
     "exclude": ["node_modules"]
   }
   ```

4. **Add to workspace:**
   ```json
   // Root package.json
   {
     "workspaces": ["packages/*", "apps/*"]
   }
   ```

### Best Practices

- **Single responsibility** - Each package should have a clear purpose
- **Minimal dependencies** - Only include necessary dependencies
- **Clear exports** - Use explicit exports in package.json
- **Type safety** - Provide TypeScript types for all exports
- **Documentation** - Include README and examples
- **Testing** - Add unit tests for utilities
- **Versioning** - Use semantic versioning for releases
