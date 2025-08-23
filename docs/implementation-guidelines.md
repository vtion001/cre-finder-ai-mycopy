# 🛠️ CRE Finder AI - Implementation Guidelines

## 🎯 Purpose
**Think of this as your recipe book for building and maintaining CRE Finder AI!**

This document provides step-by-step instructions for developers to implement, extend, and maintain the CRE Finder AI platform. It's like having a senior developer sitting next to you, guiding you through every decision.

---

## 🏗️ Implementation Architecture

```mermaid
graph TB
    subgraph "Development Layers"
        A[Developer Experience Layer<br/>Tools & Workflow]
        B[Application Layer<br/>React Components & Pages]
        C[Business Logic Layer<br/>APIs & Services]
        D[Data Layer<br/>Database & Storage]
        E[Infrastructure Layer<br/>Hosting & Deployment]
    end
    
    subgraph "Development Tools"
        F[TypeScript<br/>Type Safety]
        G[Next.js 14<br/>React Framework]
        H[Tailwind CSS<br/>Styling]
        I[tRPC<br/>API Layer]
        J[Prisma/Supabase<br/>Database ORM]
    end
    
    subgraph "Quality Assurance"
        K[ESLint/Biome<br/>Code Quality]
        L[Testing Framework<br/>Unit & Integration]
        M[Type Checking<br/>TypeScript Compiler]
        N[Code Reviews<br/>Pull Request Process]
    end
    
    subgraph "Deployment Pipeline"
        O[Git Repository<br/>Version Control]
        P[GitHub Actions<br/>CI/CD Pipeline]
        Q[Vercel<br/>Hosting Platform]
        R[Supabase<br/>Database & Auth]
    end
    
    A --> F
    A --> G
    A --> H
    B --> I
    B --> J
    C --> K
    C --> L
    D --> M
    D --> N
    E --> O
    E --> P
    
    F --> Q
    G --> Q
    I --> R
    J --> R
```

---

## 🛠️ Development Environment Setup

### 📋 Prerequisites Checklist
**Like gathering all your cooking ingredients before you start!**

```bash
# 1. Install Bun (Package Manager)
curl -fsSL https://bun.sh/install | bash

# 2. Install Supabase CLI
npm install -g supabase

# 3. Install Node.js (v18+)
# Download from nodejs.org or use nvm

# 4. Verify installations
bun --version    # Should show 1.2.20+
supabase --version # Should show latest
node --version   # Should show v18+
```

### 🗂️ Project Structure Deep Dive
**Like organizing your toolbox so you can find everything quickly!**

```
cre-finder-ai/
├── 📱 apps/
│   ├── 🌐 web/                     # Main user application
│   │   ├── src/
│   │   │   ├── app/                # Next.js 14 App Router
│   │   │   │   ├── [locale]/       # Internationalization
│   │   │   │   ├── api/            # API routes
│   │   │   │   └── globals.css     # Global styles
│   │   │   ├── components/         # React components
│   │   │   │   ├── ui/             # Base UI components
│   │   │   │   ├── forms/          # Form components
│   │   │   │   ├── tables/         # Data table components
│   │   │   │   └── integrations/   # Integration-specific components
│   │   │   ├── lib/                # Utility libraries
│   │   │   ├── actions/            # Server actions
│   │   │   └── middleware.ts       # Request middleware
│   │   ├── package.json            # Dependencies
│   │   └── next.config.mjs         # Next.js configuration
│   │
│   ├── 📢 marketing/               # Public marketing site
│   │   ├── src/
│   │   │   ├── app/                # Marketing pages
│   │   │   ├── components/         # Marketing components
│   │   │   └── lib/                # Marketing utilities
│   │   └── package.json
│   │
│   ├── 🗄️ api/                    # Database configuration
│   │   ├── supabase/
│   │   │   ├── migrations/         # Database migrations
│   │   │   ├── config.toml         # Supabase configuration
│   │   │   └── seed.sql            # Initial data
│   │   └── package.json
│   │
│   └── 🤖 n8n/                    # Automation workflows
│       ├── workflows/              # N8N workflow files
│       ├── docker-compose.yml      # N8N setup
│       └── README.md
│
├── 📦 packages/                   # Shared libraries
│   ├── 🎨 ui/                     # UI component library
│   │   ├── src/
│   │   │   ├── components/         # Shadcn/UI components
│   │   │   ├── lib/                # UI utilities
│   │   │   └── index.ts            # Component exports
│   │   └── package.json
│   │
│   ├── 🗃️ supabase/              # Database client & queries
│   │   ├── src/
│   │   │   ├── clients/            # Database clients
│   │   │   ├── queries/            # Database queries
│   │   │   ├── validations/        # Zod schemas
│   │   │   └── types/              # TypeScript types
│   │   └── package.json
│   │
│   ├── ⚡ jobs/                   # Background processing
│   │   ├── src/                    # Trigger.dev jobs
│   │   └── package.json
│   │
│   ├── 🏢 property-data/          # Property utilities
│   │   ├── src/                    # Property data types
│   │   └── package.json
│   │
│   ├── 💳 stripe/                 # Payment processing
│   │   ├── src/                    # Stripe utilities
│   │   └── package.json
│   │
│   └── 📊 logger/                 # Logging utilities
│       ├── src/                    # Logging functions
│       └── package.json
│
├── 🔧 tooling/                    # Development tools
│   └── typescript/                # Shared TypeScript config
│       ├── base.json              # Base TS configuration
│       ├── nextjs.json            # Next.js specific config
│       └── react-library.json     # Library config
│
├── 📝 docs/                       # Documentation
│   ├── system-architecture.md     # System overview
│   ├── implementation-guidelines.md # This document
│   └── integration-guidelines.md   # Integration details
│
├── 🚀 scripts/                    # Build and deployment
│   ├── build.sh                   # Build script
│   └── deploy.sh                  # Deployment script
│
├── package.json                   # Root dependencies
├── turbo.json                     # Turborepo configuration
├── bun.lockb                      # Dependency lock file
└── README.md                      # Project overview
```

### 🔧 Environment Configuration

#### 1. **Root Environment Setup**
```bash
# Clone the repository
git clone <repository-url>
cd cre-finder-ai

# Install all dependencies
bun install

# Copy environment templates
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

#### 2. **Database Setup**
```bash
# Navigate to API directory
cd apps/api

# Start local Supabase
supabase start

# This will output:
# - API URL: http://127.0.0.1:54321
# - DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# - Studio URL: http://127.0.0.1:54323
# - Anon key: eyJ... (copy this)
# - Service key: eyJ... (copy this)
```

#### 3. **Environment Variables**
```bash
# apps/web/.env.local
NODE_ENV=development
PORT=3001

# Supabase (from supabase start output)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here

# Application secrets
TRIGGER_SECRET_KEY=your_trigger_secret
NEXT_CACHE_API_SECRET=your_cache_secret

# Integration API keys (development placeholders)
VAPI_API_KEY=vapi_dev_key
TWILIO_ACCOUNT_SID=AC_dev_sid
TWILIO_AUTH_TOKEN=dev_auth_token
SENDGRID_API_KEY=SG.dev_key
STRIPE_SECRET_KEY=sk_test_dev_key
```

---

## 🎨 Frontend Development Implementation

### 🧩 Component Architecture
**Like building with LEGO blocks - each piece fits perfectly together!**

```mermaid
graph TD
    subgraph "Component Hierarchy"
        A[App Layout<br/>Root layout with providers]
        B[Page Components<br/>Route-specific pages]
        C[Feature Components<br/>Business logic components]
        D[UI Components<br/>Reusable building blocks]
        E[Utility Components<br/>Helper components]
    end
    
    subgraph "State Management"
        F[Server State<br/>React Query + tRPC]
        G[Client State<br/>React useState/useReducer]
        H[Global State<br/>Zustand stores]
        I[Form State<br/>React Hook Form]
    end
    
    subgraph "Styling System"
        J[Design Tokens<br/>CSS variables]
        K[Component Styles<br/>Tailwind classes]
        L[Theme System<br/>Dark/light modes]
        M[Responsive Design<br/>Mobile-first approach]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    
    C --> F
    C --> G
    C --> H
    C --> I
    
    D --> J
    D --> K
    D --> L
    D --> M
```

#### 1. **Component Structure Template**
```typescript
// components/example-component.tsx
"use client"; // Only if component needs interactivity

import { useState } from "react";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { api } from "@/lib/trpc";

// 1. Define TypeScript interfaces
interface ExampleComponentProps {
  title: string;
  items: Item[];
  onItemSelect: (item: Item) => void;
  className?: string;
}

interface Item {
  id: string;
  name: string;
  status: "active" | "inactive";
}

// 2. Component implementation
export function ExampleComponent({
  title,
  items,
  onItemSelect,
  className
}: ExampleComponentProps) {
  // 3. State management
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 4. Server state (if needed)
  const { data, isLoading: dataLoading } = api.items.getAll.useQuery();
  
  // 5. Event handlers
  const handleItemClick = (item: Item) => {
    setSelectedId(item.id);
    onItemSelect(item);
  };
  
  // 6. Derived state
  const activeItems = items.filter(item => item.status === "active");
  
  // 7. Render logic
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {dataLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {activeItems.map((item) => (
              <Button
                key={item.id}
                variant={selectedId === item.id ? "default" : "outline"}
                onClick={() => handleItemClick(item)}
                disabled={isLoading}
                className="w-full justify-start"
              >
                {item.name}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 8. Default props (if needed)
ExampleComponent.defaultProps = {
  className: ""
};
```

#### 2. **Page Component Pattern**
```typescript
// app/[locale]/dashboard/campaigns/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@v1/supabase/server";
import { CampaignsList } from "@/components/campaigns/campaigns-list";
import { CreateCampaignButton } from "@/components/campaigns/create-campaign-button";
import { SiteHeader } from "@/components/site-header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// 1. Page metadata
export const metadata = {
  title: "Campaigns - CRE Finder AI",
  description: "Manage your property marketing campaigns"
};

// 2. Server component with data fetching
export default async function CampaignsPage() {
  // 3. Authentication check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // 4. Initial data loading (optional)
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  // 5. Render with proper loading states
  return (
    <>
      <SiteHeader title="Campaigns" user={user} />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Campaigns</h1>
          <CreateCampaignButton />
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <CampaignsList initialData={campaigns} />
        </Suspense>
      </div>
    </>
  );
}
```

### 🔄 State Management Implementation

#### 1. **Server State with tRPC**
```typescript
// lib/trpc.ts - tRPC client setup
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@v1/trpc";

export const api = createTRPCReact<AppRouter>();

// hooks/use-campaigns.ts - Custom hooks for campaigns
export function useCampaigns() {
  return api.campaigns.getAll.useQuery({
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateCampaign() {
  const utils = api.useUtils();
  
  return api.campaigns.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch campaigns
      utils.campaigns.getAll.invalidate();
    },
    onError: (error) => {
      console.error("Failed to create campaign:", error);
    }
  });
}

// components/campaigns-list.tsx - Using the hooks
export function CampaignsList() {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const createCampaign = useCreateCampaign();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="space-y-4">
      {campaigns?.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
```

#### 2. **Global State with Zustand**
```typescript
// stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// components/user-menu.tsx - Using global state
export function UserMenu() {
  const { user, logout } = useAuthStore();
  
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### 3. **Form State with React Hook Form**
```typescript
// components/create-campaign-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Define validation schema
const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(100),
  channels: z.array(z.enum(["sms", "voice", "email"])).min(1, "Select at least one channel"),
  propertyIds: z.array(z.string()).min(1, "Select at least one property"),
  message: z.string().min(1, "Message is required").max(500),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export function CreateCampaignForm({ onSubmit }: { onSubmit: (data: CampaignFormData) => void }) {
  // 2. Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      channels: [],
      propertyIds: [],
    }
  });
  
  // 3. Watch form values for dynamic behavior
  const selectedChannels = watch("channels");
  
  // 4. Form submission handler
  const onFormSubmit = async (data: CampaignFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Campaign Name */}
      <div>
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          {...register("name")}
          placeholder="Enter campaign name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>
      
      {/* Channel Selection */}
      <div>
        <Label>Communication Channels</Label>
        <div className="flex gap-4 mt-2">
          {["sms", "voice", "email"].map((channel) => (
            <label key={channel} className="flex items-center gap-2">
              <Checkbox
                {...register("channels")}
                value={channel}
                checked={selectedChannels.includes(channel as any)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setValue("channels", [...selectedChannels, channel as any]);
                  } else {
                    setValue("channels", selectedChannels.filter(c => c !== channel));
                  }
                }}
              />
              {channel.toUpperCase()}
            </label>
          ))}
        </div>
        {errors.channels && (
          <p className="text-sm text-red-500 mt-1">{errors.channels.message}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
      </Button>
    </form>
  );
}
```

---

## 🗄️ Backend Development Implementation

### 🛢️ Database Implementation Patterns

```mermaid
graph TD
    subgraph "Database Layer Architecture"
        A[Migration Files<br/>Schema definitions] --> B[Query Functions<br/>Typed database access]
        B --> C[Cached Queries<br/>Performance optimized]
        C --> D[API Routes<br/>HTTP endpoints]
        D --> E[Server Actions<br/>Form submissions]
        
        F[Row Level Security<br/>Data isolation] --> B
        G[Database Indexes<br/>Query performance] --> A
        H[Validation Schemas<br/>Input validation] --> D
        I[Background Jobs<br/>Async processing] --> B
    end
    
    subgraph "Data Flow"
        J[Client Request] --> D
        D --> K{Authenticated?}
        K -->|Yes| L[Validate Input]
        K -->|No| M[Return 401]
        L --> N{Valid Data?}
        N -->|Yes| O[Execute Query]
        N -->|No| P[Return 400]
        O --> Q[Return Response]
        
        R[Background Job] --> I
        I --> S[Process Data]
        S --> T[Update Database]
        T --> U[Send Notification]
    end
```

#### 1. **Database Migration Pattern**
```sql
-- apps/api/supabase/migrations/20240101000000_create_example_table.sql

-- Create table with proper constraints
CREATE TABLE IF NOT EXISTS public.example_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_example_table_user_id ON public.example_table(user_id);
CREATE INDEX IF NOT EXISTS idx_example_table_status ON public.example_table(status);
CREATE INDEX IF NOT EXISTS idx_example_table_created_at ON public.example_table(created_at);

-- Create update trigger
CREATE OR REPLACE FUNCTION public.example_table_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_example_table_updated_at ON public.example_table;
CREATE TRIGGER trg_example_table_updated_at
    BEFORE UPDATE ON public.example_table
    FOR EACH ROW EXECUTE FUNCTION public.example_table_set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.example_table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS select_own_records ON public.example_table;
CREATE POLICY select_own_records ON public.example_table
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_own_records ON public.example_table;
CREATE POLICY insert_own_records ON public.example_table
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_own_records ON public.example_table;
CREATE POLICY update_own_records ON public.example_table
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS delete_own_records ON public.example_table;
CREATE POLICY delete_own_records ON public.example_table
    FOR DELETE USING (auth.uid() = user_id);
```

#### 2. **Query Function Pattern**
```typescript
// packages/supabase/src/queries/example.ts
import type { Client } from "../types";
import { z } from "zod";

// 1. Define validation schemas
export const createExampleSchema = z.object({
  name: z.string().min(1).max(100),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  metadata: z.record(z.unknown()).default({}),
});

export const updateExampleSchema = createExampleSchema.partial();

export type CreateExampleInput = z.infer<typeof createExampleSchema>;
export type UpdateExampleInput = z.infer<typeof updateExampleSchema>;

// 2. Query functions
export async function getExampleRecords(
  supabase: Client,
  userId: string,
  options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
) {
  let query = supabase
    .from("example_table")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  
  if (options?.status) {
    query = query.eq("status", options.status);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch records: ${error.message}`);
  }
  
  return { data: data || [], count };
}

export async function createExampleRecord(
  supabase: Client,
  userId: string,
  input: CreateExampleInput
) {
  // Validate input
  const validatedInput = createExampleSchema.parse(input);
  
  const { data, error } = await supabase
    .from("example_table")
    .insert({
      user_id: userId,
      ...validatedInput,
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create record: ${error.message}`);
  }
  
  return data;
}

export async function updateExampleRecord(
  supabase: Client,
  userId: string,
  id: string,
  input: UpdateExampleInput
) {
  // Validate input
  const validatedInput = updateExampleSchema.parse(input);
  
  const { data, error } = await supabase
    .from("example_table")
    .update(validatedInput)
    .eq("id", id)
    .eq("user_id", userId) // Ensure user owns the record
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update record: ${error.message}`);
  }
  
  return data;
}

export async function deleteExampleRecord(
  supabase: Client,
  userId: string,
  id: string
) {
  const { error } = await supabase
    .from("example_table")
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // Ensure user owns the record
  
  if (error) {
    throw new Error(`Failed to delete record: ${error.message}`);
  }
  
  return { success: true };
}
```

#### 3. **API Route Pattern**
```typescript
// app/api/examples/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { getExampleRecords, createExampleRecord } from "@v1/supabase/queries/example";
import { z } from "zod";

// Query parameters schema
const getExamplesQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

// GET /api/examples
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 2. Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const parseResult = getExamplesQuerySchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid query parameters",
          details: parseResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    // 3. Execute query
    const { data, count } = await getExampleRecords(
      supabase,
      user.id,
      parseResult.data
    );
    
    // 4. Return response
    return NextResponse.json({
      data,
      pagination: {
        total: count,
        limit: parseResult.data.limit,
        offset: parseResult.data.offset,
      }
    });
    
  } catch (error) {
    console.error("GET /api/examples error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/examples
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // 2. Parse and validate request body
    const body = await request.json();
    
    // 3. Create record
    const record = await createExampleRecord(supabase, user.id, body);
    
    // 4. Return created record
    return NextResponse.json(
      { data: record },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("POST /api/examples error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### 4. **Server Action Pattern**
```typescript
// actions/example-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@v1/supabase/server";
import { createExampleRecord, updateExampleRecord } from "@v1/supabase/queries/example";
import { z } from "zod";

// Form schema for server action
const exampleFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  status: z.enum(["active", "inactive", "pending"]),
  redirectPath: z.string().optional(),
});

export async function createExampleAction(formData: FormData) {
  try {
    // 1. Parse form data
    const rawData = {
      name: formData.get("name") as string,
      status: formData.get("status") as string,
      redirectPath: formData.get("redirectPath") as string,
    };
    
    // 2. Validate form data
    const validatedData = exampleFormSchema.parse(rawData);
    
    // 3. Authenticate user
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }
    
    // 4. Create record
    const record = await createExampleRecord(supabase, user.id, {
      name: validatedData.name,
      status: validatedData.status,
    });
    
    // 5. Revalidate cache
    revalidatePath("/examples");
    
    // 6. Redirect if specified
    if (validatedData.redirectPath) {
      redirect(validatedData.redirectPath);
    }
    
    return { success: true, data: record };
    
  } catch (error) {
    console.error("Create example action error:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        details: error.flatten().fieldErrors,
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Usage in component
export function ExampleForm() {
  return (
    <form action={createExampleAction}>
      <input name="name" placeholder="Enter name" required />
      <select name="status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
      <input type="hidden" name="redirectPath" value="/examples" />
      <button type="submit">Create Example</button>
    </form>
  );
}
```

### ⚡ Background Jobs Implementation

#### 1. **Job Definition Pattern**
```typescript
// packages/jobs/src/example-job.ts
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { createClient } from "@v1/supabase/admin";
import { logger } from "@v1/logger";

// 1. Define job schema
export const exampleJobTask = schemaTask({
  id: "example-job",
  schema: z.object({
    userId: z.string().uuid(),
    recordId: z.string().uuid(),
    options: z.object({
      priority: z.enum(["low", "normal", "high"]).default("normal"),
      retryCount: z.number().min(0).max(5).default(3),
    }).default({}),
  }),
  queue: {
    concurrencyLimit: 10,
  },
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  machine: {
    preset: "small-1x",
  },
  run: async (payload, { ctx }) => {
    const { userId, recordId, options } = payload;
    
    // 2. Initialize services
    const supabase = createClient();
    
    try {
      // 3. Log job start
      logger.info("Starting example job", {
        jobId: ctx.task.id,
        userId,
        recordId,
        options,
      });
      
      // 4. Fetch required data
      const { data: record, error: fetchError } = await supabase
        .from("example_table")
        .select("*")
        .eq("id", recordId)
        .eq("user_id", userId)
        .single();
      
      if (fetchError || !record) {
        throw new Error(`Record not found: ${recordId}`);
      }
      
      // 5. Process the record
      const processedData = await processRecord(record, options);
      
      // 6. Update the record
      const { error: updateError } = await supabase
        .from("example_table")
        .update({
          metadata: processedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recordId)
        .eq("user_id", userId);
      
      if (updateError) {
        throw new Error(`Failed to update record: ${updateError.message}`);
      }
      
      // 7. Send notification (if needed)
      if (options.priority === "high") {
        await sendNotification(userId, recordId, "processing_complete");
      }
      
      // 8. Log success
      logger.info("Example job completed successfully", {
        jobId: ctx.task.id,
        userId,
        recordId,
        processingTime: ctx.task.durationMs,
      });
      
      return {
        success: true,
        recordId,
        processedAt: new Date().toISOString(),
        processingTime: ctx.task.durationMs,
      };
      
    } catch (error) {
      // 9. Log error
      logger.error("Example job failed", {
        jobId: ctx.task.id,
        userId,
        recordId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      // 10. Update record with error status
      await supabase
        .from("example_table")
        .update({
          status: "error",
          metadata: {
            error: error instanceof Error ? error.message : String(error),
            failedAt: new Date().toISOString(),
          },
        })
        .eq("id", recordId)
        .eq("user_id", userId);
      
      // 11. Re-throw to trigger retry
      throw error;
    }
  },
});

// Helper functions
async function processRecord(record: any, options: any) {
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...record.metadata,
    processedAt: new Date().toISOString(),
    priority: options.priority,
  };
}

async function sendNotification(userId: string, recordId: string, type: string) {
  // Implementation would send email, push notification, etc.
  logger.info("Sending notification", { userId, recordId, type });
}

// 2. Job trigger function
export async function triggerExampleJob(
  userId: string,
  recordId: string,
  options?: { priority?: "low" | "normal" | "high" }
) {
  const { handle } = await exampleJobTask.trigger({
    userId,
    recordId,
    options: options || {},
  });
  
  return handle;
}
```

---

## 🧪 Testing Implementation

### 🔍 Testing Architecture

```mermaid
graph TD
    subgraph "Testing Layers"
        A[Unit Tests<br/>Individual functions & components]
        B[Integration Tests<br/>API endpoints & database]
        C[End-to-End Tests<br/>User workflows]
        D[Performance Tests<br/>Load & stress testing]
    end
    
    subgraph "Testing Tools"
        E[Vitest<br/>Unit test runner]
        F[React Testing Library<br/>Component testing]
        G[Playwright<br/>E2E testing]
        H[MSW<br/>API mocking]
    end
    
    subgraph "Test Environment"
        I[Test Database<br/>Isolated test data]
        J[Mock Services<br/>External API mocks]
        K[Test Fixtures<br/>Reusable test data]
        L[CI/CD Integration<br/>Automated testing]
    end
    
    A --> E
    A --> F
    B --> H
    B --> I
    C --> G
    C --> K
    
    E --> L
    F --> L
    G --> L
    H --> J
```

#### 1. **Component Testing Pattern**
```typescript
// components/__tests__/example-component.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ExampleComponent } from "../example-component";

// 1. Test utilities
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// 2. Test data
const mockItems = [
  { id: "1", name: "Item 1", status: "active" as const },
  { id: "2", name: "Item 2", status: "inactive" as const },
];

// 3. Test suite
describe("ExampleComponent", () => {
  const defaultProps = {
    title: "Test Title",
    items: mockItems,
    onItemSelect: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders component with title", () => {
    render(<ExampleComponent {...defaultProps} />, { wrapper: TestWrapper });
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
  
  it("displays only active items", () => {
    render(<ExampleComponent {...defaultProps} />, { wrapper: TestWrapper });
    
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
  });
  
  it("calls onItemSelect when item is clicked", async () => {
    const onItemSelect = jest.fn();
    render(
      <ExampleComponent {...defaultProps} onItemSelect={onItemSelect} />,
      { wrapper: TestWrapper }
    );
    
    fireEvent.click(screen.getByText("Item 1"));
    
    await waitFor(() => {
      expect(onItemSelect).toHaveBeenCalledWith(mockItems[0]);
    });
  });
  
  it("shows selected item with different styling", async () => {
    render(<ExampleComponent {...defaultProps} />, { wrapper: TestWrapper });
    
    const itemButton = screen.getByText("Item 1");
    fireEvent.click(itemButton);
    
    await waitFor(() => {
      expect(itemButton).toHaveClass("bg-primary");
    });
  });
  
  it("disables buttons when loading", () => {
    render(
      <ExampleComponent {...defaultProps} />,
      { wrapper: TestWrapper }
    );
    
    // Simulate loading state
    // This would depend on your component's loading logic
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
```

#### 2. **API Testing Pattern**
```typescript
// app/api/examples/__tests__/route.test.ts
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { createMockSupabaseClient } from "@/test-utils/supabase-mock";

// 1. Mock Supabase
jest.mock("@v1/supabase/server", () => ({
  createClient: jest.fn(),
}));

const mockSupabase = createMockSupabaseClient();

// 2. Test suite
describe("/api/examples", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require("@v1/supabase/server").createClient as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe("GET", () => {
    it("returns examples for authenticated user", async () => {
      // 3. Setup mocks
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [{ id: "1", name: "Test Item" }],
          error: null,
          count: 1,
        }),
      });
      
      // 4. Make request
      const request = new NextRequest("http://localhost:3000/api/examples");
      const response = await GET(request);
      const data = await response.json();
      
      // 5. Assertions
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe("Test Item");
    });
    
    it("returns 401 for unauthenticated user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });
      
      const request = new NextRequest("http://localhost:3000/api/examples");
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
    
    it("validates query parameters", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      
      const request = new NextRequest("http://localhost:3000/api/examples?limit=invalid");
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
    });
  });
  
  describe("POST", () => {
    it("creates new example for authenticated user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-1" } },
        error: null,
      });
      
      // Mock the query chain
      const mockInsert = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: "new-id", name: "New Item" },
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });
      
      const request = new NextRequest("http://localhost:3000/api/examples", {
        method: "POST",
        body: JSON.stringify({ name: "New Item" }),
        headers: { "Content-Type": "application/json" },
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.data.name).toBe("New Item");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "user-1",
        name: "New Item",
        status: "active",
        metadata: {},
      });
    });
  });
});
```

#### 3. **Database Testing Pattern**
```typescript
// packages/supabase/__tests__/queries/example.test.ts
import { createTestSupabaseClient } from "@/test-utils/supabase-test-client";
import { getExampleRecords, createExampleRecord } from "../queries/example";

describe("Example Queries", () => {
  let supabase: ReturnType<typeof createTestSupabaseClient>;
  
  beforeEach(async () => {
    // 1. Setup test database
    supabase = createTestSupabaseClient();
    await supabase.cleanDatabase();
    await supabase.seedTestData();
  });
  
  afterEach(async () => {
    // 2. Cleanup
    await supabase.cleanDatabase();
  });
  
  describe("getExampleRecords", () => {
    it("returns records for specific user", async () => {
      const userId = "test-user-1";
      
      const { data, count } = await getExampleRecords(supabase, userId);
      
      expect(data).toHaveLength(2); // Based on seed data
      expect(count).toBe(2);
      expect(data[0].user_id).toBe(userId);
    });
    
    it("filters by status", async () => {
      const userId = "test-user-1";
      
      const { data } = await getExampleRecords(supabase, userId, {
        status: "active",
      });
      
      expect(data).toHaveLength(1);
      expect(data[0].status).toBe("active");
    });
    
    it("respects pagination", async () => {
      const userId = "test-user-1";
      
      const { data } = await getExampleRecords(supabase, userId, {
        limit: 1,
        offset: 0,
      });
      
      expect(data).toHaveLength(1);
    });
  });
  
  describe("createExampleRecord", () => {
    it("creates record with valid data", async () => {
      const userId = "test-user-1";
      const input = { name: "Test Record", status: "active" as const };
      
      const record = await createExampleRecord(supabase, userId, input);
      
      expect(record.id).toBeTruthy();
      expect(record.name).toBe("Test Record");
      expect(record.status).toBe("active");
      expect(record.user_id).toBe(userId);
    });
    
    it("throws error with invalid data", async () => {
      const userId = "test-user-1";
      const input = { name: "", status: "invalid" as any };
      
      await expect(createExampleRecord(supabase, userId, input))
        .rejects
        .toThrow("Validation failed");
    });
  });
});
```

---

## 🚀 Deployment Implementation

### 📦 Build & Deployment Pipeline

```mermaid
graph LR
    subgraph "Development"
        A[Local Development] --> B[Feature Branch]
        B --> C[Pull Request]
    end
    
    subgraph "CI Pipeline"
        C --> D[Code Quality Checks]
        D --> E[Type Checking]
        E --> F[Unit Tests]
        F --> G[Integration Tests]
    end
    
    subgraph "Staging Deploy"
        G --> H[Build Application]
        H --> I[Deploy to Staging]
        I --> J[E2E Tests]
        J --> K[Manual QA]
    end
    
    subgraph "Production Deploy"
        K --> L[Merge to Main]
        L --> M[Production Build]
        M --> N[Database Migrations]
        N --> O[Deploy to Production]
        O --> P[Health Checks]
    end
    
    subgraph "Monitoring"
        P --> Q[Error Tracking]
        Q --> R[Performance Monitoring]
        R --> S[User Analytics]
    end
```

#### 1. **Environment Configuration**
```bash
# .env.production
NODE_ENV=production

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_KEY=your_production_service_key

# External Services
VAPI_API_KEY=your_production_vapi_key
TWILIO_ACCOUNT_SID=your_production_twilio_sid
TWILIO_AUTH_TOKEN=your_production_twilio_token
SENDGRID_API_KEY=your_production_sendgrid_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key

# Application Secrets
TRIGGER_SECRET_KEY=your_production_trigger_key
NEXT_CACHE_API_SECRET=your_production_cache_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn
VERCEL_URL=your-domain.com
```

#### 2. **Database Migration Strategy**
```bash
# scripts/deploy-database.sh
#!/bin/bash

set -e

echo "🗄️ Deploying database changes..."

# 1. Check connection
supabase db ping --project-ref $SUPABASE_PROJECT_REF

# 2. Run migrations
echo "Running migrations..."
supabase db push --project-ref $SUPABASE_PROJECT_REF

# 3. Verify schema
echo "Verifying schema..."
supabase db diff --project-ref $SUPABASE_PROJECT_REF

# 4. Update types (if needed)
echo "Generating types..."
supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > packages/supabase/src/types/database.ts

echo "✅ Database deployment complete!"
```

#### 3. **Production Checklist**
```typescript
// scripts/pre-deploy-check.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.literal("production"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  VAPI_API_KEY: z.string().min(1),
  TWILIO_ACCOUNT_SID: z.string().startsWith("AC"),
  SENDGRID_API_KEY: z.string().startsWith("SG."),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_live_"),
});

async function preDeployCheck() {
  console.log("🔍 Running pre-deployment checks...");
  
  // 1. Environment validation
  try {
    envSchema.parse(process.env);
    console.log("✅ Environment variables valid");
  } catch (error) {
    console.error("❌ Environment validation failed:", error);
    process.exit(1);
  }
  
  // 2. Database connectivity
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    });
    
    if (response.ok) {
      console.log("✅ Database connection successful");
    } else {
      throw new Error(`Database connection failed: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
  
  // 3. External service checks
  const services = [
    { name: "VAPI", check: checkVAPIConnection },
    { name: "Twilio", check: checkTwilioConnection },
    { name: "SendGrid", check: checkSendGridConnection },
  ];
  
  for (const service of services) {
    try {
      await service.check();
      console.log(`✅ ${service.name} connection successful`);
    } catch (error) {
      console.error(`❌ ${service.name} connection failed:`, error);
      process.exit(1);
    }
  }
  
  console.log("🚀 All pre-deployment checks passed!");
}

async function checkVAPIConnection() {
  // Implementation for VAPI health check
}

async function checkTwilioConnection() {
  // Implementation for Twilio health check
}

async function checkSendGridConnection() {
  // Implementation for SendGrid health check
}

if (require.main === module) {
  preDeployCheck();
}
```

---

## 📊 Monitoring & Maintenance

### 🔍 Application Monitoring

```mermaid
graph TD
    subgraph "Error Tracking"
        A[Sentry Integration] --> B[Error Capture]
        B --> C[Error Grouping]
        C --> D[Alert Notifications]
    end
    
    subgraph "Performance Monitoring"
        E[Core Web Vitals] --> F[API Response Times]
        F --> G[Database Query Performance]
        G --> H[User Experience Metrics]
    end
    
    subgraph "Business Metrics"
        I[Campaign Success Rates] --> J[User Engagement]
        J --> K[Revenue Tracking]
        K --> L[Integration Usage]
    end
    
    subgraph "Infrastructure Monitoring"
        M[Server Health] --> N[Database Status]
        N --> O[External Service Status]
        O --> P[Resource Usage]
    end
```

#### 1. **Error Tracking Setup**
```typescript
// lib/monitoring.ts
import * as Sentry from "@sentry/nextjs";

// 1. Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error && error.message.includes("ResizeObserver loop limit exceeded")) {
        return null; // Don't send this error
      }
    }
    return event;
  },
  
  // User context
  initialScope: {
    tags: {
      component: "web-app",
    },
  },
});

// 2. Custom error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("additional_info", context);
    }
    Sentry.captureException(error);
  });
}

// 3. Performance tracking
export function trackPerformance(name: string, duration: number, tags?: Record<string, string>) {
  Sentry.addBreadcrumb({
    category: "performance",
    message: `${name} took ${duration}ms`,
    level: "info",
    data: tags,
  });
}

// 4. User action tracking
export function trackUserAction(action: string, userId?: string, metadata?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (userId) {
      scope.setUser({ id: userId });
    }
    scope.setTag("action", action);
    if (metadata) {
      scope.setContext("action_metadata", metadata);
    }
    Sentry.addBreadcrumb({
      category: "user_action",
      message: action,
      level: "info",
    });
  });
}
```

#### 2. **Health Check Implementation**
```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";

interface HealthCheck {
  service: string;
  status: "healthy" | "unhealthy" | "degraded";
  responseTime?: number;
  error?: string;
}

export async function GET() {
  const checks: HealthCheck[] = [];
  const startTime = Date.now();
  
  // 1. Database health check
  try {
    const dbStart = Date.now();
    const supabase = createClient();
    
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1);
    
    checks.push({
      service: "database",
      status: error ? "unhealthy" : "healthy",
      responseTime: Date.now() - dbStart,
      error: error?.message,
    });
  } catch (error) {
    checks.push({
      service: "database",
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  
  // 2. External service checks
  const externalServices = [
    { name: "vapi", url: "https://api.vapi.ai/health" },
    { name: "twilio", url: "https://status.twilio.com/api/v2/status.json" },
  ];
  
  for (const service of externalServices) {
    try {
      const serviceStart = Date.now();
      const response = await fetch(service.url, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      checks.push({
        service: service.name,
        status: response.ok ? "healthy" : "degraded",
        responseTime: Date.now() - serviceStart,
      });
    } catch (error) {
      checks.push({
        service: service.name,
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  
  // 3. Overall health calculation
  const overallStatus = checks.every(check => check.status === "healthy")
    ? "healthy"
    : checks.some(check => check.status === "unhealthy")
    ? "unhealthy"
    : "degraded";
  
  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
    services: checks,
  };
  
  const statusCode = overallStatus === "healthy" ? 200 : 503;
  
  return NextResponse.json(response, { status: statusCode });
}
```

---

## 🎯 Summary

This implementation guide provides a complete framework for building and maintaining CRE Finder AI. Key takeaways:

### **🔑 Best Practices:**
1. **Type Safety First**: Use TypeScript everywhere with strict configuration
2. **Database-First Design**: Start with proper schema and RLS policies
3. **Component Composition**: Build reusable, testable components
4. **Error Handling**: Implement comprehensive error tracking and recovery
5. **Performance**: Optimize from the start with caching and lazy loading
6. **Security**: Validate all inputs and implement proper authentication
7. **Testing**: Write tests as you develop, not after
8. **Monitoring**: Track everything that matters to users and business

### **🚀 Deployment Strategy:**
1. **Environment Separation**: Clear separation between dev, staging, and production
2. **Automated Testing**: Run all tests before deployment
3. **Database Migrations**: Careful, reversible database changes
4. **Health Monitoring**: Continuous monitoring of all critical systems
5. **Rollback Planning**: Always have a rollback strategy

### **📈 Scaling Considerations:**
1. **Horizontal Scaling**: Design for multiple instances from the start
2. **Database Optimization**: Index appropriately and monitor query performance
3. **Caching Strategy**: Implement multiple layers of caching
4. **Background Processing**: Use job queues for heavy operations
5. **CDN Usage**: Leverage edge computing for global performance

This guide ensures that any developer can contribute effectively to the CRE Finder AI platform while maintaining high code quality and system reliability.
