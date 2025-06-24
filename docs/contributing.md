# Contributing Guide

Welcome to the CRE Finder AI development team! This guide will help you get started with contributing to the project.

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Bun** (v1.1.26+) installed
- **Node.js** (v18+) installed
- **Git** configured with your GitHub account
- **VS Code** (recommended) with suggested extensions

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cre-finder-ai
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up environment variables:**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/marketing/.env.example apps/marketing/.env.local
   ```

4. **Start development environment:**
   ```bash
   # Start Supabase
   cd apps/api && bun run dev

   # Start all applications
   bun dev
   ```

## 📋 Development Workflow

### Branch Strategy

We use **Git Flow** with the following branches:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature

1. **Create a feature branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes:**
   ```bash
   bun lint
   bun typecheck
   bun test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new property search filter"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript

- **Strict mode enabled** - No `any` types
- **Explicit return types** for functions
- **Interface over type** for object definitions
- **Functional programming** patterns preferred

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
}

function getUserProfile(id: string): Promise<UserProfile | null> {
  return supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
}

// ❌ Avoid
type UserProfile = {
  id: any;
  email: any;
  fullName: any;
}

const getUserProfile = async (id) => {
  // Implementation
}
```

### React Components

- **Functional components** only
- **TypeScript interfaces** for props
- **Descriptive component names**
- **Single responsibility principle**

```typescript
// ✅ Good
interface PropertyCardProps {
  property: PropertyRecord;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export function PropertyCard({ property, onSelect, isSelected }: PropertyCardProps) {
  return (
    <Card className={cn("cursor-pointer", isSelected && "ring-2 ring-primary")}>
      {/* Component content */}
    </Card>
  );
}

// ❌ Avoid
export function PropertyCard(props: any) {
  // Implementation
}
```

### File Naming

- **kebab-case** for files and directories
- **PascalCase** for React components
- **camelCase** for functions and variables

```
✅ Good:
components/property-search-form.tsx
utils/format-currency.ts
hooks/use-property-search.ts

❌ Avoid:
components/PropertySearchForm.tsx
utils/formatCurrency.ts
hooks/usePropertySearch.ts
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. External library imports
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// 3. Internal package imports
import { Button } from '@v1/ui/button';
import { createClient } from '@v1/supabase/client';

// 4. Relative imports
import { PropertyCard } from './property-card';
import { usePropertySearch } from '../hooks/use-property-search';
```

## 🎨 UI/UX Guidelines

### Design System

- **Use Shadcn/UI components** as the foundation
- **Follow Tailwind CSS** utility-first approach
- **Maintain consistent spacing** using Tailwind scale
- **Responsive design** with mobile-first approach

### Component Structure

```typescript
// Component structure template
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks and state
  const [state, setState] = useState();
  const query = useQuery();

  // 2. Event handlers
  const handleClick = () => {
    // Implementation
  };

  // 3. Computed values
  const computedValue = useMemo(() => {
    return someCalculation(prop1);
  }, [prop1]);

  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 5. Render
  return (
    <div className="space-y-4">
      {/* JSX content */}
    </div>
  );
}
```

### Styling Guidelines

```typescript
// ✅ Good - Use Tailwind utilities
<div className="flex items-center justify-between p-4 bg-card rounded-lg border">
  <h2 className="text-lg font-semibold">Title</h2>
  <Button variant="outline" size="sm">Action</Button>
</div>

// ✅ Good - Use cn() for conditional classes
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)}>

// ❌ Avoid - Custom CSS
<div style={{ display: 'flex', padding: '16px' }}>
```

## 🧪 Testing

### Testing Strategy

- **Unit tests** for utilities and hooks
- **Component tests** for UI components
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows

### Writing Tests

```typescript
// Unit test example
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format-currency';

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

// Component test example
import { render, screen } from '@testing-library/react';
import { PropertyCard } from './property-card';

describe('PropertyCard', () => {
  it('should display property information', () => {
    const property = {
      id: '1',
      address: '123 Main St',
      price: 500000,
    };

    render(<PropertyCard property={property} />);
    
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });
});
```

### Running Tests

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

## 📦 Package Management

### Adding Dependencies

```bash
# Add to specific workspace
bun add <package> --filter=@v1/web

# Add dev dependency
bun add -D <package> --filter=@v1/ui

# Add to root (shared dependency)
bun add <package>
```

### Workspace Dependencies

```json
// Reference workspace packages
{
  "dependencies": {
    "@v1/ui": "workspace:*",
    "@v1/supabase": "workspace:*"
  }
}
```

## 🔄 Database Changes

### Creating Migrations

```bash
cd apps/api

# Create new migration
supabase migration new add_new_table

# Edit the migration file
# apps/api/supabase/migrations/YYYYMMDD_add_new_table.sql
```

### Migration Best Practices

```sql
-- ✅ Good - Reversible changes
ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

-- Add index for performance
CREATE INDEX CONCURRENTLY idx_users_phone_verified ON users(phone_verified);

-- ❌ Avoid - Destructive changes without backup
DROP TABLE important_data;
```

### Updating Types

```bash
# Generate TypeScript types after migration
cd apps/api
bun run generate
```

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations tested
- [ ] Environment variables updated
- [ ] Documentation updated

### Deployment Process

1. **Merge to develop** for staging deployment
2. **Test on staging** environment
3. **Create release PR** to main
4. **Deploy to production** after approval

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 91
- OS: macOS 12
- App Version: 1.2.3

## Screenshots
If applicable, add screenshots
```

## 📖 Documentation

### Code Documentation

```typescript
/**
 * Formats a currency value for display
 * @param amount - The numeric amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
```

### README Updates

When adding new features:
- Update relevant documentation
- Add examples if applicable
- Update API documentation
- Include migration notes

## 🔍 Code Review

### Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling implemented

**Code Quality:**
- [ ] Follows coding standards
- [ ] No code duplication
- [ ] Proper TypeScript usage

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Efficient database queries
- [ ] Proper caching implemented

**Security:**
- [ ] Input validation
- [ ] Authentication checks
- [ ] No sensitive data exposed

**Testing:**
- [ ] Tests included
- [ ] Tests pass
- [ ] Good test coverage

### Review Process

1. **Self-review** your changes first
2. **Request review** from team members
3. **Address feedback** promptly
4. **Update documentation** if needed
5. **Merge** after approval

## 🆘 Getting Help

### Resources

- **Documentation**: Check existing docs first
- **GitHub Issues**: Search for similar problems
- **Team Chat**: Ask questions in development channel
- **Code Review**: Request help during review process

### Escalation

1. **Check documentation** and existing issues
2. **Ask team members** for guidance
3. **Create detailed issue** if problem persists
4. **Schedule pairing session** for complex problems

## 🎉 Recognition

We appreciate all contributions! Contributors will be:
- Recognized in release notes
- Added to contributors list
- Invited to team celebrations
- Considered for additional responsibilities

Thank you for contributing to CRE Finder AI! 🚀
