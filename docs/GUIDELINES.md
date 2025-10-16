# Future Franchise Owners - Development Guidelines

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Coding Standards](#coding-standards)
5. [Component Guidelines](#component-guidelines)
6. [Database Guidelines](#database-guidelines)
7. [API Guidelines](#api-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Git Workflow](#git-workflow)
10. [Deployment Guidelines](#deployment-guidelines)

---

## 🎯 Project Overview

### Architecture
- **Framework**: Next.js 15 with App Router
- **CMS**: Payload CMS 3.x
- **Database**: Vercel Postgres
- **Styling**: Tailwind CSS 4.x + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

### Key Principles
- **Performance First**: Optimize for Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO Optimized**: Structured data and meta tags
- **Mobile First**: Responsive design approach
- **Type Safety**: Comprehensive TypeScript usage

---

## 📁 Project Structure

```
future-franchise-owners/
├── docs/                          # Project documentation
│   ├── CLIENT_REQUEST.md          # Client requirements
│   ├── TODO.md                    # Task tracking
│   ├── PROGRESS.md                # Progress tracking
│   └── GUIDELINES.md              # This file
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (frontend)/            # Public-facing pages
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── about/             # About page
│   │   │   ├── contact/           # Contact page
│   │   │   ├── blog/              # Blog pages
│   │   │   └── franchises/        # Franchise pages
│   │   ├── (payload)/             # Payload CMS admin
│   │   │   └── admin/             # Admin interface
│   │   ├── api/                   # API routes
│   │   ├── globals.css            # Global styles
│   │   └── layout.tsx             # Root layout
│   ├── collections/               # Payload collections
│   │   ├── Franchises.ts          # Franchise data model
│   │   ├── Agents.ts              # Agent management
│   │   ├── BlogPosts.ts           # Blog content
│   │   ├── Pages.ts               # Static pages
│   │   ├── Media.ts               # Media management
│   │   └── Users.ts               # User management
│   ├── components/                # Reusable components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Layout components
│   │   ├── forms/                 # Form components
│   │   ├── franchise/             # Franchise-specific
│   │   └── blog/                  # Blog components
│   ├── lib/                       # Utility functions
│   │   ├── utils.ts               # General utilities
│   │   ├── validations.ts         # Form validations
│   │   ├── api.ts                 # API helpers
│   │   └── constants.ts           # App constants
│   ├── hooks/                     # Custom React hooks
│   ├── types/                     # TypeScript type definitions
│   ├── payload-types.ts           # Generated Payload types
│   └── payload.config.ts          # Payload configuration
├── public/                        # Static assets
│   ├── images/                    # Image assets
│   ├── icons/                     # Icon files
│   └── favicon.ico                # Favicon
├── tests/                         # Test files
│   ├── e2e/                       # End-to-end tests
│   └── int/                       # Integration tests
└── [config files]                # Various config files
```

---

## 🛠️ Technology Stack

### Core Technologies
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5.7**: Type safety
- **Payload CMS 3.56**: Headless CMS
- **Tailwind CSS 4.x**: Utility-first CSS

### UI Components
- **shadcn/ui**: Component library
- **Lucide React**: Icon library
- **class-variance-authority**: Component variants
- **clsx & tailwind-merge**: Conditional styling

### Database & Backend
- **Vercel Postgres**: Database
- **Payload CMS**: Content management
- **GraphQL**: API query language

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Playwright**: E2E testing
- **Vitest**: Unit testing

---

## 📝 Coding Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// Use interfaces for object shapes
interface FranchiseData {
  id: string
  name: string
  category: string
  minInvestment: number
  maxInvestment: number
  tags: string[]
}

// Use types for unions and computed types
type FranchiseStatus = 'active' | 'pending' | 'inactive'
type FranchiseWithStatus = FranchiseData & { status: FranchiseStatus }
```

#### Function Declarations
```typescript
// Use explicit return types for public functions
export async function getFranchises(): Promise<FranchiseData[]> {
  // Implementation
}

// Use arrow functions for inline callbacks
const filteredFranchises = franchises.filter((franchise) => 
  franchise.status === 'active'
)
```

### File Naming Conventions
- **Components**: PascalCase (`FranchiseCard.tsx`)
- **Pages**: lowercase with hyphens (`about-us/page.tsx`)
- **Utilities**: camelCase (`apiHelpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types**: PascalCase (`FranchiseTypes.ts`)

### Import Organization
```typescript
// 1. React and Next.js imports
import React from 'react'
import { NextPage } from 'next'

// 2. Third-party libraries
import { clsx } from 'clsx'
import { z } from 'zod'

// 3. Internal utilities and types
import { cn } from '@/lib/utils'
import type { FranchiseData } from '@/types/franchise'

// 4. Internal components
import { Button } from '@/components/ui/button'
import { FranchiseCard } from '@/components/franchise/FranchiseCard'
```

---

## 🧩 Component Guidelines

### Component Structure
```typescript
// Component file structure
interface ComponentProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState()
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // Render
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  )
}
```

### Styling Guidelines
```typescript
// Use Tailwind classes with cn() utility
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        // Variant styles
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
        },
        // Size styles
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
```

### Component Organization
- **One component per file**
- **Export component as named export**
- **Include prop types interface**
- **Use forwardRef for components that need refs**

---

## 🗄️ Database Guidelines

### Payload Collections Structure
```typescript
// collections/Franchises.ts
import type { CollectionConfig } from 'payload/types'

export const Franchises: CollectionConfig = {
  slug: 'franchises',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Food & Beverage', value: 'food-beverage' },
        { label: 'Retail', value: 'retail' },
        { label: 'Services', value: 'services' },
      ],
      required: true,
    },
    {
      name: 'investment',
      type: 'group',
      fields: [
        {
          name: 'min',
          type: 'number',
          required: true,
        },
        {
          name: 'max',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Top Pick', value: 'top-pick' },
        { label: 'Easy Start Up', value: 'easy-startup' },
        { label: 'Low Investment', value: 'low-investment' },
      ],
    },
  ],
}
```

### Data Validation
- **Use Payload's built-in validation**
- **Add custom validation hooks when needed**
- **Validate data on both client and server**

---

## 🔌 API Guidelines

### API Route Structure
```typescript
// app/api/franchises/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    
    const franchises = await payload.find({
      collection: 'franchises',
      where: {
        status: {
          equals: 'published',
        },
      },
    })
    
    return NextResponse.json(franchises)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch franchises' },
      { status: 500 }
    )
  }
}
```

### Error Handling
```typescript
// lib/api.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    )
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

---

## 🧪 Testing Guidelines

### Test Structure
```typescript
// tests/components/FranchiseCard.test.tsx
import { render, screen } from '@testing-library/react'
import { FranchiseCard } from '@/components/franchise/FranchiseCard'

const mockFranchise = {
  id: '1',
  name: 'Test Franchise',
  category: 'food-beverage',
  minInvestment: 50000,
  maxInvestment: 100000,
  tags: ['top-pick'],
}

describe('FranchiseCard', () => {
  it('renders franchise information correctly', () => {
    render(<FranchiseCard franchise={mockFranchise} />)
    
    expect(screen.getByText('Test Franchise')).toBeInTheDocument()
    expect(screen.getByText('$50,000 - $100,000')).toBeInTheDocument()
  })
})
```

### E2E Testing
```typescript
// tests/e2e/franchise-search.spec.ts
import { test, expect } from '@playwright/test'

test('franchise search functionality', async ({ page }) => {
  await page.goto('/franchises')
  
  // Test search input
  await page.fill('[data-testid="search-input"]', 'food')
  await page.click('[data-testid="search-button"]')
  
  // Verify results
  await expect(page.locator('[data-testid="franchise-card"]')).toHaveCount(3)
})
```

---

## 🔄 Git Workflow

### Branch Naming
- **Feature**: `feature/franchise-search`
- **Bug Fix**: `fix/contact-form-validation`
- **Hotfix**: `hotfix/security-patch`
- **Documentation**: `docs/update-guidelines`

### Commit Messages
```
feat: add franchise search functionality

- Implement search input component
- Add filter by category
- Include pagination for results

Closes #123
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

---

## 🚀 Deployment Guidelines

### Environment Variables
```bash
# .env.local
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=your-database-url
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

### Build Process
```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Testing
pnpm test
pnpm test:e2e
```

### Performance Checklist
- [ ] Images optimized with Next.js Image component
- [ ] Lazy loading implemented for non-critical content
- [ ] Bundle size analyzed and optimized
- [ ] Core Web Vitals targets met
- [ ] SEO meta tags implemented

---

## 📚 Additional Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Code Quality Tools
- **ESLint Config**: Extends Next.js recommended
- **Prettier Config**: Consistent code formatting
- **TypeScript**: Strict mode enabled
- **Husky**: Git hooks for quality checks

---

**Last Updated**: Project initialization  
**Version**: 1.0  
**Maintainer**: Development Team