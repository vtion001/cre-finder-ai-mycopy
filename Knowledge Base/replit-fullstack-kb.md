# 🚀 Ultimate Replit Full-Stack Development Knowledge Base

## Table of Contents
1. [Replit Environment Setup & Best Practices](#replit-environment)
2. [Next.js Configuration & Optimization](#nextjs-configuration)
3. [Authentication & OAuth Implementation](#authentication)
4. [Database Setup with Prisma](#database-prisma)
5. [Component Architecture & Organization](#component-architecture)
6. [Environment Variables & Security](#environment-variables)
7. [Package Management & Dependencies](#package-management)
8. [API Development Best Practices](#api-development)
9. [State Management Patterns](#state-management)
10. [Testing & Quality Assurance](#testing)
11. [Performance Optimization](#performance)
12. [Deployment & CI/CD](#deployment)
13. [Claude AI Integration for Development](#claude-integration)
14. [Common Issues & Solutions](#troubleshooting)
15. [Code Snippets Library](#code-snippets)

---

## 1. Replit Environment Setup & Best Practices {#replit-environment}

### Initial Setup Checklist
```bash
# Essential files for Replit
.replit              # Replit configuration
replit.nix           # Nix packages configuration
.env.local           # Local environment variables
.env.example         # Example environment template
```

### `.replit` Configuration
```toml
run = "npm run dev"
entrypoint = "app/page.tsx"
hidden = [".config", ".next", ".git"]
modules = ["nodejs-20:v26-20240213-d3de848"]

[nix]
channel = "stable-23_11"

[env]
NEXT_TELEMETRY_DISABLED = "1"
NODE_ENV = "development"

[packager]
language = "nodejs"

[packager.features]
enabledForHosting = true
packageSearch = true
guessImports = true
```

### `replit.nix` Configuration
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.postgresql_15
    pkgs.prisma
    pkgs.openssl
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.openssl
    ];
  };
}
```

### Replit-Specific Tips
- **Always use environment variables** for sensitive data
- **Enable "Always On"** for production deployments
- **Use Replit Database** for quick prototyping
- **Configure proper .gitignore** to exclude Replit-specific files
- **Use Secrets tab** for API keys instead of .env files in production

---

## 2. Next.js Configuration & Optimization {#nextjs-configuration}

### `next.config.mjs` Best Practices
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['localhost', 'your-domain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle node modules that need to be transpiled
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true,
      },
    ];
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
```

### `postcss.config.mjs` for Tailwind
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
};

export default config;
```

### App Directory Structure Best Practices
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── layout.tsx
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   └── trpc/
│       └── [trpc]/
│           └── route.ts
├── layout.tsx
├── page.tsx
└── globals.css
```

---

## 3. Authentication & OAuth Implementation {#authentication}

### NextAuth.js Complete Setup

#### Installation
```bash
pnpm add next-auth @auth/prisma-adapter
pnpm add -D @types/next-auth
```

#### `/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    
    // Email/Password Authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }
        
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        
        return user;
      }
    })
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: { email: token.email! },
      });
      
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
      };
    },
    
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  
  events: {
    async signIn({ user, account, profile }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`User signed out`);
    },
  },
  
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Authentication Context Provider
```typescript
// /components/providers/auth-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

#### Custom Auth Hook
```typescript
// /hooks/use-auth.ts
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const login = useCallback(async (provider?: string) => {
    const result = await signIn(provider || "credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
    
    if (result?.ok) {
      router.push(result.url || "/dashboard");
    }
    
    return result;
  }, [router]);
  
  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
  }, [router]);
  
  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading",
    login,
    logout,
    update,
  };
}
```

#### Protected Route Middleware
```typescript
// /middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                       req.nextUrl.pathname.startsWith("/register");
    
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }
    
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
    
    // Role-based access control
    if (req.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
```

---

## 4. Database Setup with Prisma {#database-prisma}

### Prisma Configuration

#### `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// User model with OAuth support
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  hashedPassword String?
  role          Role      @default(USER)
  
  // OAuth accounts
  accounts      Account[]
  sessions      Session[]
  
  // User data
  posts         Post[]
  comments      Comment[]
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  tags      Tag[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([authorId])
  @@index([published])
  @@map("posts")
}

model Comment {
  id       String @id @default(cuid())
  content  String
  postId   String
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([postId])
  @@index([authorId])
  @@map("comments")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
  
  @@map("tags")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

#### Database Connection Utility
```typescript
// /lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  errorFormat: "pretty",
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Utility functions
export async function disconnectDB() {
  await prisma.$disconnect();
}

export async function connectDB() {
  await prisma.$connect();
}
```

#### Prisma Scripts in `package.json`
```json
{
  "scripts": {
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:format": "prisma format"
  }
}
```

#### Database Seeding Script
```typescript
// /prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tag.deleteMany();
  
  // Create users
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      hashedPassword,
      role: "ADMIN",
    },
  });
  
  const normalUser = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Normal User",
      hashedPassword,
      role: "USER",
    },
  });
  
  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Technology" } }),
    prisma.tag.create({ data: { name: "Programming" } }),
    prisma.tag.create({ data: { name: "Web Development" } }),
  ]);
  
  // Create posts
  await prisma.post.create({
    data: {
      title: "Getting Started with Next.js 14",
      content: "This is a comprehensive guide to Next.js 14...",
      published: true,
      authorId: adminUser.id,
      tags: {
        connect: tags.map(tag => ({ id: tag.id })),
      },
      comments: {
        create: [
          {
            content: "Great post!",
            authorId: normalUser.id,
          },
        ],
      },
    },
  });
  
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 5. Component Architecture & Organization {#component-architecture}

### Component Structure Best Practices

#### Folder Structure
```
components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── card.tsx
├── forms/                 # Form components
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── post-form.tsx
├── layouts/              # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── main-layout.tsx
├── features/             # Feature-specific components
│   ├── posts/
│   │   ├── post-list.tsx
│   │   ├── post-item.tsx
│   │   └── post-detail.tsx
│   └── users/
│       ├── user-profile.tsx
│       └── user-avatar.tsx
└── providers/            # Context providers
    ├── theme-provider.tsx
    └── auth-provider.tsx
```

#### Base Button Component with Variants
```typescript
// /components/ui/button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

#### Form Component with React Hook Form
```typescript
// /components/forms/dynamic-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

// Schema definition
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export function DynamicForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Registration failed");
      
      toast.success("Registration successful!");
      reset();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
```

#### Data Table Component
```typescript
// /components/ui/data-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });
  
  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={`Filter ${searchKey}...`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## 6. Environment Variables & Security {#environment-variables}

### Environment Variables Structure

#### `.env.local` Template
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Email Service
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# External APIs
OPENAI_API_KEY="your-openai-api-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket"

# Redis
REDIS_URL="redis://localhost:6379"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_BETA_FEATURES="false"

# Public Environment Variables (accessible in browser)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

#### Environment Validation
```typescript
// /lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Public variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// Validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
```

---

## 7. Package Management & Dependencies {#package-management}

### Essential Dependencies

#### `package.json` Complete Setup
```json
{
  "name": "fullstack-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{js,ts,tsx,md,json}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    // Core
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    
    // Database & ORM
    "@prisma/client": "^5.12.0",
    "prisma": "^5.12.0",
    
    // Authentication
    "next-auth": "^4.24.0",
    "@auth/prisma-adapter": "^1.5.0",
    "bcryptjs": "^2.4.3",
    
    // Forms & Validation
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    
    // UI Components
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    
    // Styling
    "tailwindcss": "^3.4.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    
    // Data Fetching
    "@tanstack/react-query": "^5.28.0",
    "axios": "^1.6.0",
    "swr": "^2.2.5",
    
    // State Management
    "zustand": "^4.5.0",
    "immer": "^10.0.4",
    
    // Utilities
    "date-fns": "^3.6.0",
    "lodash": "^4.17.21",
    "nanoid": "^5.0.7",
    "slugify": "^1.6.6",
    
    // Icons
    "lucide-react": "^0.365.0",
    "@heroicons/react": "^2.1.0",
    
    // Tables
    "@tanstack/react-table": "^8.15.0",
    
    // Charts
    "recharts": "^2.12.0",
    
    // Notifications
    "sonner": "^1.4.0",
    
    // File Upload
    "react-dropzone": "^14.2.3",
    
    // Rich Text Editor
    "@tiptap/react": "^2.2.0",
    "@tiptap/starter-kit": "^2.2.0",
    
    // API Development
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/next": "^11.0.0",
    
    // Email
    "@react-email/components": "^0.0.15",
    "resend": "^3.2.0",
    
    // Payments
    "stripe": "^14.21.0",
    
    // Analytics
    "@vercel/analytics": "^1.2.0",
    
    // SEO
    "next-seo": "^6.5.0"
  },
  "devDependencies": {
    // Types
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/lodash": "^4.17.0",
    
    // Linting & Formatting
    "eslint": "^8.56.0",
    "eslint-config-next": "14.2.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.11",
    
    // Testing
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@playwright/test": "^1.42.0",
    
    // Development
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "concurrently": "^8.2.0",
    "dotenv-cli": "^7.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### PNPM Configuration

#### `.npmrc`
```ini
# Use PNPM's strict mode
strict-peer-dependencies=false
auto-install-peers=true
shamefully-hoist=true

# Performance
prefer-offline=true
network-concurrency=16

# Security
audit-level=moderate

# Registry
registry=https://registry.npmjs.org/
```

---

## 8. API Development Best Practices {#api-development}

### REST API Routes

#### API Route Handler Pattern
```typescript
// /app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Input validation schema
const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    
    const skip = (page - 1) * limit;
    
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true },
          },
          tags: true,
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where }),
    ]);
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);
    
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
        tags: validatedData.tags
          ? {
              connectOrCreate: validatedData.tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        author: true,
        tags: true,
      },
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### tRPC Setup

#### tRPC Configuration
```typescript
// /server/api/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(authOptions);
  
  return {
    prisma,
    session,
    req,
    res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

#### tRPC Router
```typescript
// /server/api/routers/post.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  // Get all posts
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;
      
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        where: search
          ? {
              OR: [
                { title: { contains: search } },
                { content: { contains: search } },
              ],
            }
          : undefined,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          tags: true,
        },
      });
      
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }
      
      return {
        posts,
        nextCursor,
      };
    }),
  
  // Create post
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
      });
    }),
  
  // Update post
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      // Check ownership
      const post = await ctx.prisma.post.findUnique({
        where: { id },
        select: { authorId: true },
      });
      
      if (!post || post.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      
      return ctx.prisma.post.update({
        where: { id },
        data,
      });
    }),
  
  // Delete post
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });
      
      if (!post || post.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      
      return ctx.prisma.post.delete({
        where: { id: input.id },
      });
    }),
});
```

---

## 9. State Management Patterns {#state-management}

### Zustand Store Setup

#### Global Store
```typescript
// /store/use-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  
  // Data
  posts: any[];
  selectedPost: any | null;
  
  // Actions
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setPosts: (posts: any[]) => void;
  selectPost: (post: any) => void;
  clearState: () => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        sidebarOpen: true,
        theme: "system",
        posts: [],
        selectedPost: null,
        
        // Actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),
        
        toggleSidebar: () =>
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          }),
        
        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),
        
        setPosts: (posts) =>
          set((state) => {
            state.posts = posts;
          }),
        
        selectPost: (post) =>
          set((state) => {
            state.selectedPost = post;
          }),
        
        clearState: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.posts = [];
            state.selectedPost = null;
          }),
      })),
      {
        name: "app-storage",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    )
  )
);

// Selectors
export const useUser = () => useStore((state) => state.user);
export const useIsAuthenticated = () => useStore((state) => state.isAuthenticated);
export const useSidebarOpen = () => useStore((state) => state.sidebarOpen);
export const useTheme = () => useStore((state) => state.theme);
```

---

## 10. Testing & Quality Assurance {#testing}

### Jest Configuration

#### `jest.config.js`
```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
};

module.exports = createJestConfig(customJestConfig);
```

#### Component Testing Example
```typescript
// /components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });
  
  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });
  
  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## 11. Performance Optimization {#performance}

### Next.js Performance Tips

#### Image Optimization
```typescript
// /components/optimized-image.tsx
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);
  
  return (
    <div className="relative overflow-hidden bg-gray-100">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        className={`
          duration-700 ease-in-out
          ${isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"}
        `}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
```

#### Dynamic Imports
```typescript
// /app/dashboard/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load heavy components
const HeavyChart = dynamic(() => import("@/components/charts/heavy-chart"), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});

const DataTable = dynamic(() => import("@/components/data-table"), {
  loading: () => <div>Loading table...</div>,
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyChart />
      </Suspense>
      
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable />
      </Suspense>
    </div>
  );
}
```

#### React Query Configuration
```typescript
// /lib/react-query.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

// Custom hooks with React Query
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 12. Deployment & CI/CD {#deployment}

### Replit Deployment Configuration

#### Production Environment Setup
```bash
# Production .env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.repl.co
DATABASE_URL=postgresql://user:pass@db.replit.com:5432/prod
```

#### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Replit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run type check
        run: pnpm type-check
        
      - name: Run linter
        run: pnpm lint
        
      - name: Run tests
        run: pnpm test
        
      - name: Build application
        run: pnpm build
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Replit
        env:
          REPLIT_TOKEN: ${{ secrets.REPLIT_TOKEN }}
        run: |
          # Deploy script here
```

---

## 13. Claude AI Integration for Development {#claude-integration}

### How Claude Can Help with Your Development

#### 1. Code Generation
When working with Claude for code generation:
- **Be specific**: Provide exact requirements, file paths, and context
- **Include existing code**: Share relevant parts of your codebase
- **Specify frameworks**: Mention Next.js 14, App Router, TypeScript, etc.
- **Request complete files**: Ask for full implementations, not fragments

#### 2. Debugging Assistance
Claude excels at:
- Analyzing error messages and stack traces
- Identifying common pitfalls in your setup
- Suggesting fixes with explanations
- Reviewing code for potential issues

#### 3. Architecture Decisions
Use Claude for:
- Evaluating different approaches
- Designing database schemas
- Planning API structures
- Optimizing performance strategies

#### 4. Best Practices Implementation
Claude can help with:
- Security best practices
- Performance optimization
- Code organization
- Testing strategies

#### 5. Learning and Documentation
Claude provides:
- Detailed explanations of concepts
- Step-by-step tutorials
- Custom documentation for your project
- Code examples tailored to your needs

### Effective Prompting for Development

#### Good Prompt Example:
```
"I'm building a Next.js 14 app with App Router, TypeScript, Prisma, and PostgreSQL. 
I need to create a comment system where users can:
1. Post comments on articles
2. Reply to other comments (nested)
3. Edit their own comments
4. Delete their own comments

Please provide:
1. Prisma schema for the comments
2. API routes for CRUD operations
3. React components for displaying and managing comments
4. Include proper TypeScript types and error handling"
```

#### Tips for Better Results:
1. **Provide context**: Share your tech stack and project structure
2. **Be explicit**: Specify versions, libraries, and patterns you're using
3. **Ask for explanations**: Request reasoning behind suggestions
4. **Iterate**: Build on previous responses for refinement
5. **Validate**: Always test and verify generated code

---

## 14. Common Issues & Solutions {#troubleshooting}

### Replit-Specific Issues

#### 1. Port Configuration
```javascript
// Ensure correct port binding in Replit
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
```

#### 2. Database Connection Issues
```typescript
// Handle Replit database connection timeouts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ["error", "warn"],
  errorFormat: "pretty",
});

// Connection retry logic
async function connectWithRetry() {
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.$connect();
      console.log("Database connected successfully");
      break;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1} failed`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
```

#### 3. Memory Optimization
```javascript
// next.config.js for Replit's limited resources
module.exports = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  swcMinify: true,
  compress: true,
};
```

#### 4. File Upload Handling
```typescript
// Handle file uploads in Replit environment
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({
    uploadDir: "/tmp", // Use /tmp in Replit
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });
  
  // Process upload...
}
```

---

## 15. Code Snippets Library {#code-snippets}

### Authentication Snippets

#### Protected Server Component
```typescript
// /app/protected/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
    </div>
  );
}
```

#### Client-Side Auth Check
```typescript
// /components/auth-guard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (session) {
    return <>{children}</>;
  }
  
  return null;
}
```

### API Snippets

#### Rate Limiting Middleware
```typescript
// /lib/rate-limit.ts
import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });
  
  return async function rateLimitMiddleware(req: Request) {
    const token = req.headers.get("x-forwarded-for") || "anonymous";
    const tokenCount = (tokenCache.get(token) as number[]) || [0];
    
    if (tokenCount[0] === 0) {
      tokenCache.set(token, [1]);
    } else {
      tokenCount[0] += 1;
      tokenCache.set(token, tokenCount);
    }
    
    const currentUsage = tokenCount[0];
    const isRateLimited = currentUsage > 10; // 10 requests per interval
    
    if (isRateLimited) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
  };
}
```

#### Error Handling Wrapper
```typescript
// /lib/api-handler.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type Handler = (req: NextRequest) => Promise<NextResponse>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: error.errors },
          { status: 400 }
        );
      }
      
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
```

### Database Snippets

#### Transaction Example
```typescript
// /lib/db-transactions.ts
import { prisma } from "@/lib/prisma";

export async function transferCredits(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return await prisma.$transaction(async (tx) => {
    // Decrease credits from sender
    const sender = await tx.user.update({
      where: { id: fromUserId },
      data: { credits: { decrement: amount } },
    });
    
    if (sender.credits < 0) {
      throw new Error("Insufficient credits");
    }
    
    // Increase credits for receiver
    const receiver = await tx.user.update({
      where: { id: toUserId },
      data: { credits: { increment: amount } },
    });
    
    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        fromUserId,
        toUserId,
        amount,
        type: "TRANSFER",
      },
    });
    
    return { sender, receiver, transaction };
  });
}
```

#### Pagination Helper
```typescript
// /lib/pagination.ts
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") || "desc") as "asc" | "desc",
  };
}

export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
) {
  const { page = 1, limit = 10 } = params;
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
```

### UI Component Snippets

#### Loading Skeleton
```typescript
// /components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Usage example
export function PostSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}
```

#### Infinite Scroll Hook
```typescript
// /hooks/use-infinite-scroll.ts
import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean
) {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!hasMore) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [callback, hasMore]
  );
  
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);
  
  return lastElementRef;
}
```

### Utility Functions

#### Debounce Hook
```typescript
// /hooks/use-debounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### Local Storage Hook
```typescript
// /hooks/use-local-storage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}
```

---

## Quick Reference Cheat Sheet

### Terminal Commands
```bash
# Development
pnpm dev                  # Start dev server
pnpm build               # Build for production
pnpm start               # Start production server

# Database
pnpm db:push             # Push schema changes
pnpm db:migrate          # Create migration
pnpm db:studio           # Open Prisma Studio
pnpm db:seed             # Seed database

# Testing
pnpm test                # Run tests
pnpm test:watch          # Watch mode
pnpm e2e                 # Run E2E tests

# Code Quality
pnpm lint                # Run ESLint
pnpm format              # Format with Prettier
pnpm type-check          # TypeScript check
```

### Environment Variables Template
```bash
# Quick copy-paste for .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### CSS Classes (Tailwind)
```css
/* Common utility classes */
container mx-auto px-4
flex items-center justify-between
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
absolute inset-0
fixed top-0 left-0 right-0 bottom-0
transition-all duration-300 ease-in-out
hover:scale-105 hover:shadow-lg
focus:outline-none focus:ring-2 focus:ring-blue-500
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Conclusion

This comprehensive knowledge base covers everything you need to build production-ready full-stack applications in Replit. Remember to:

1. **Start simple**: Begin with basic features and iterate
2. **Test early**: Write tests as you develop
3. **Optimize gradually**: Don't premature optimize
4. **Document everything**: Keep your code well-documented
5. **Use TypeScript**: Leverage type safety throughout
6. **Follow conventions**: Stick to established patterns
7. **Security first**: Always validate and sanitize inputs
8. **Monitor performance**: Use analytics and monitoring tools

For specific issues or advanced topics not covered here, don't hesitate to ask Claude for detailed assistance with your exact use case. Happy coding! 🚀