# Payload CMS Deployment Guide for Vercel

## Table of Contents

1. [Overview](#overview)
2. [Content Architecture](#content-architecture)
3. [Media Management](#media-management)
4. [Vercel Deployment](#vercel-deployment)
5. [Client Access Control](#client-access-control)
6. [Dependencies & Requirements](#dependencies--requirements)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive documentation for deploying a Payload CMS instance on Vercel, specifically configured for the Future Franchise Owners website. The CMS will support editable content sections including pages and franchises, with robust media management and client access controls.

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Payload CMS   │    │ Vercel Postgres │
│   (Frontend)    │◄──►│   (Admin)       │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │  Media Storage  │    │   Audit Logs   │
│   (Static)      │    │   (Vercel)      │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Content Architecture

### Collection Schema Design

#### 1. Pages Collection

The Pages collection manages all website pages with flexible content sections and SEO optimization.

**Core Fields:**
```typescript
interface Page {
  title: string                    // Page title for browser and SEO
  slug: string                     // URL-friendly identifier (unique)
  status: 'draft' | 'published' | 'archived'
  pageType: 'home' | 'about' | 'contact' | 'blog' | 'franchises' | 'generic'
  publishedAt: Date
}
```

**Content Structure:**
```typescript
interface PageContent {
  hero: {
    enabled: boolean
    title?: string
    subtitle?: string
    backgroundImage?: MediaReference
    ctaButton?: {
      text: string
      url: string
      style: 'primary' | 'secondary' | 'outline'
    }
  }
  content: RichText              // Main content area
  sections: ContentSection[]     // Flexible content blocks
}
```

**Content Sections Types:**
- **Text Block**: Rich text content with formatting
- **Image Gallery**: Multiple images with captions
- **Call to Action**: Promotional sections with buttons
- **Franchise Grid**: Dynamic franchise listings with filters
- **Contact Form**: Embedded contact forms
- **Map**: Interactive location maps
- **Assessment Tool**: Franchise assessment integration

**SEO Configuration:**
```typescript
interface PageSEO {
  metaTitle?: string            // Override page title (max 60 chars)
  metaDescription?: string      // Search description (max 160 chars)
  metaImage?: MediaReference    // Social sharing image
  noIndex: boolean             // Prevent search indexing
}
```

#### 2. Franchises Collection

Comprehensive franchise business management with detailed business information.

**Basic Information:**
```typescript
interface Franchise {
  businessName: string          // Official franchise name
  slug: string                 // URL identifier (auto-generated)
  status: 'draft' | 'published' | 'featured' | 'archived'
  isTopPick: boolean           // Featured franchise flag
  description: RichText        // Detailed business description
  shortDescription: string     // Brief summary (max 200 chars)
}
```

**Categorization:**
```typescript
interface FranchiseCategory {
  category: CategoryReference           // Primary business category
  subCategories: CategoryReference[]   // Additional categories
  tags: string[]                      // Search keywords
  investmentRange: 'under-50k' | '50k-100k' | '100k-250k' | 
                  '250k-500k' | '500k-1m' | 'over-1m'
}
```

**Financial Information:**
```typescript
interface FranchiseFinancials {
  initialInvestment: {
    min: number                 // Minimum investment
    max: number                 // Maximum investment
  }
  franchiseFee: number         // Initial franchise fee
  royaltyFee: {
    percentage?: number        // Ongoing royalty %
    flatFee?: number          // Fixed monthly/annual fee
  }
  marketingFee: number        // Marketing fee %
  liquidCapitalRequired: number
  netWorthRequired: number
  financingAvailable: boolean
}
```

**Business Operations:**
```typescript
interface FranchiseOperations {
  businessModel: ('retail' | 'service' | 'home-based' | 'mobile' | 
                 'online' | 'food-beverage' | 'multi-unit')[]
  territoryRights: 'exclusive' | 'protected' | 'non-exclusive'
  multiUnitDevelopment: boolean
  absenteeOwnership: boolean
  veteranIncentives: boolean
}
```

**Training & Support:**
```typescript
interface FranchiseSupport {
  initialTraining: {
    duration: string           // e.g., "2 weeks"
    location: string          // Training location
    included: boolean         // Included in franchise fee
  }
  ongoingSupport: {
    supportType: 'marketing' | 'operations' | 'technology' | 
                'training' | 'site-selection' | 'grand-opening' | 'field-support'
    description: string
  }[]
}
```

#### 3. Franchise Categories Collection

Hierarchical categorization system for organizing franchises.

```typescript
interface FranchiseCategory {
  name: string                 // Category name
  slug: string                // URL identifier
  description: string         // Category description
  parentCategory?: CategoryReference  // For subcategories
  icon?: MediaReference       // Category icon (SVG preferred)
  color: string              // Hex color for theming
  featured: boolean          // Homepage display
  sortOrder: number          // Display order
  franchiseCount: number     // Auto-calculated count
}
```

#### 4. Media Collection

Enhanced media management with optimization and metadata.

```typescript
interface Media {
  filename: string
  alt: string                // Required alt text
  caption?: string          // Optional caption
  filesize: number
  width?: number
  height?: number
  mimeType: string
  url: string
  sizes?: {                 // Responsive image sizes
    thumbnail: ImageSize
    card: ImageSize
    feature: ImageSize
  }
}
```

### Relationship Definitions

**Page ↔ Franchise Relationships:**
- Pages can reference franchises through "Franchise Grid" sections
- Franchise filters allow dynamic content based on categories and tags
- Top Picks integration for featured franchise display

**Category Hierarchy:**
- Self-referential parent-child relationships
- Cascading franchise counts through category tree
- Flexible tagging system for cross-category relationships

**Media Relationships:**
- Pages: Hero images, section images, SEO images
- Franchises: Logos, featured images, gallery images
- Categories: Icons and promotional images

### Field Validation Rules

**Required Fields:**
- Page: `title`, `slug`, `pageType`
- Franchise: `businessName`, `slug`, `description`, `category`
- Category: `name`, `slug`
- Media: `alt` (for accessibility)

**Unique Constraints:**
- All `slug` fields must be unique within their collection
- Category `name` must be unique
- Franchise `businessName` should be unique

**Data Validation:**
- Email fields use built-in email validation
- URL fields validate proper URL format
- Phone numbers accept various formats
- Investment amounts must be positive numbers
- Percentage fields limited to 0-100 range

---

## Media Management

### File Storage Setup

**Vercel Blob Storage Configuration:**
```typescript
// payload.config.ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          prefix: 'franchise-media',
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

**Environment Variables:**
```bash
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### Image Processing Pipeline

**Automatic Image Optimization:**
```typescript
// Sharp configuration for image processing
import sharp from 'sharp'

const imageProcessing = {
  sharp,
  imageSizes: [
    {
      name: 'thumbnail',
      width: 150,
      height: 150,
      crop: 'center',
      formatOptions: {
        format: 'webp',
        options: { quality: 80 }
      }
    },
    {
      name: 'card',
      width: 400,
      height: 300,
      crop: 'center',
      formatOptions: {
        format: 'webp',
        options: { quality: 85 }
      }
    },
    {
      name: 'feature',
      width: 1200,
      height: 675,
      crop: 'center',
      formatOptions: {
        format: 'webp',
        options: { quality: 90 }
      }
    }
  ]
}
```

**Supported File Types:**
- **Images**: JPEG, PNG, WebP, SVG, GIF
- **Documents**: PDF
- **Video**: MP4, WebM (for promotional content)

**File Size Limits:**
- Images: 10MB maximum
- Documents: 25MB maximum
- Videos: 100MB maximum

### CDN Integration

**Vercel Edge Network:**
- Automatic global CDN distribution
- Edge caching for static assets
- Optimized delivery based on user location
- Automatic format conversion (WebP, AVIF)

**Cache Headers Configuration:**
```typescript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['your-blob-store.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  headers: async () => [
    {
      source: '/media/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### Media Optimization Strategies

**Responsive Images:**
```typescript
// Automatic srcset generation
const responsiveImage = {
  src: '/media/franchise-logo.jpg',
  srcSet: [
    '/media/franchise-logo-400w.webp 400w',
    '/media/franchise-logo-800w.webp 800w',
    '/media/franchise-logo-1200w.webp 1200w',
  ],
  sizes: '(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px'
}
```

**Lazy Loading:**
- Automatic lazy loading for all images
- Intersection Observer API implementation
- Progressive image loading with blur placeholders

**SEO Optimization:**
- Required alt text for all images
- Structured data for image content
- Proper file naming conventions
- Image sitemaps for search engines

---

## Vercel Deployment

### Infrastructure Diagram

```
Internet
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Static    │  │   API       │  │    Serverless       │  │
│  │   Assets    │  │   Routes    │  │    Functions        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
    │                    │                    │
    ▼                    ▼                    ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐
│   Vercel    │  │   Payload   │  │   Vercel Postgres   │
│   Blob      │  │   CMS       │  │   Database          │
│   Storage   │  │   Admin     │  │                     │
└─────────────┘  └─────────────┘  └─────────────────────┘
```

### Environment Variables Configuration

**Required Environment Variables:**
```bash
# Database Configuration
POSTGRES_URL="postgres://username:password@host:port/database"
POSTGRES_PRISMA_URL="postgres://username:password@host:port/database?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://username:password@host:port/database"

# Payload CMS Configuration
PAYLOAD_SECRET="your-super-secret-key-here"
PAYLOAD_CONFIG_PATH="src/payload.config.ts"

# Media Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"

# Next.js Configuration
NEXT_PUBLIC_SERVER_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics (optional)
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

**Environment Variable Security:**
- Use Vercel's encrypted environment variables
- Separate variables for preview and production
- Regular rotation of secrets and tokens
- No sensitive data in client-side code

### Build and Deployment Workflows

**Vercel Configuration (`vercel.json`):**
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "PAYLOAD_CONFIG_PATH": "src/payload.config.ts"
  }
}
```

**Build Process:**
1. **Dependency Installation**: `pnpm install`
2. **Type Generation**: `payload generate:types`
3. **Database Migration**: Automatic schema sync
4. **Next.js Build**: `next build`
5. **Static Export**: Pre-rendered pages
6. **Function Deployment**: API routes and Payload admin

**Deployment Triggers:**
- **Production**: Push to `main` branch
- **Preview**: Pull requests and feature branches
- **Manual**: Vercel CLI or dashboard deployment

**Build Optimization:**
```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@payloadcms/ui'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  output: 'standalone',
}
```

### Performance Optimization Strategies

**Database Optimization:**
- Connection pooling with PgBouncer
- Optimized queries with proper indexing
- Database query caching
- Read replicas for high-traffic scenarios

**Caching Strategy:**
```typescript
// API route caching
export const revalidate = 3600 // 1 hour

// Static page generation
export async function generateStaticParams() {
  const pages = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' } },
    limit: 100,
  })
  
  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}
```

**Edge Functions:**
- Geolocation-based content delivery
- A/B testing at the edge
- Authentication middleware
- Rate limiting and security

**Monitoring and Analytics:**
- Vercel Analytics integration
- Core Web Vitals tracking
- Error monitoring with Sentry
- Performance budgets and alerts

---

## Client Access Control

### Role-Based Permission System

**User Roles Definition:**
```typescript
interface UserRole {
  name: string
  permissions: Permission[]
  collections: CollectionAccess[]
}

const roles = {
  admin: {
    name: 'Administrator',
    permissions: ['create', 'read', 'update', 'delete'],
    collections: ['*'], // All collections
  },
  editor: {
    name: 'Content Editor',
    permissions: ['create', 'read', 'update'],
    collections: ['pages', 'franchises', 'media'],
  },
  contributor: {
    name: 'Content Contributor',
    permissions: ['create', 'read'],
    collections: ['franchises', 'media'],
  },
  viewer: {
    name: 'Read Only',
    permissions: ['read'],
    collections: ['pages', 'franchises'],
  }
}
```

**Collection-Level Access Control:**
```typescript
// Example: Franchise collection access
const franchiseAccess = {
  create: ({ req: { user } }) => {
    return ['admin', 'editor', 'contributor'].includes(user?.role)
  },
  read: ({ req: { user } }) => {
    if (!user) return { status: { equals: 'published' } }
    return true // Authenticated users see all
  },
  update: ({ req: { user } }) => {
    if (user?.role === 'admin') return true
    if (user?.role === 'editor') return true
    // Contributors can only edit their own content
    if (user?.role === 'contributor') {
      return { createdBy: { equals: user.id } }
    }
    return false
  },
  delete: ({ req: { user } }) => {
    return ['admin'].includes(user?.role)
  }
}
```

**Field-Level Permissions:**
```typescript
// Sensitive fields restricted by role
const restrictedFields = {
  analytics: {
    access: {
      read: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
      update: ({ req: { user } }) => ['admin'].includes(user?.role),
    }
  },
  seo: {
    access: {
      update: ({ req: { user } }) => ['admin', 'editor'].includes(user?.role),
    }
  }
}
```

### Editor Interface Customization

**Admin Panel Customization:**
```typescript
// payload.config.ts
export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Franchise CMS',
      favicon: '/favicon.ico',
      ogImage: '/admin-og-image.jpg',
    },
    css: path.resolve(__dirname, 'admin/custom.css'),
    components: {
      Nav: CustomNavigation,
      Dashboard: CustomDashboard,
    },
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@admin': path.resolve(__dirname, 'admin'),
        },
      },
    }),
  },
})
```

**Custom Dashboard Components:**
```typescript
// Custom dashboard with franchise metrics
const CustomDashboard = () => {
  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard title="Total Franchises" value={franchiseCount} />
        <MetricCard title="Published Pages" value={pageCount} />
        <MetricCard title="Media Files" value={mediaCount} />
        <MetricCard title="Monthly Views" value={viewCount} />
      </div>
      <RecentActivity />
      <QuickActions />
    </div>
  )
}
```

**Collection Customization:**
```typescript
// Custom list view for franchises
const franchiseAdmin = {
  defaultColumns: ['businessName', 'category', 'investmentRange', 'status'],
  useAsTitle: 'businessName',
  group: 'Content Management',
  pagination: {
    defaultLimit: 25,
    limits: [10, 25, 50, 100],
  },
  listSearchableFields: ['businessName', 'description', 'tags'],
}
```

### Content Approval Workflows

**Draft and Review System:**
```typescript
interface ContentWorkflow {
  status: 'draft' | 'pending-review' | 'approved' | 'published' | 'rejected'
  reviewer?: UserReference
  reviewNotes?: string
  reviewedAt?: Date
  publishedBy?: UserReference
}
```

**Approval Process:**
1. **Content Creation**: Contributors create draft content
2. **Review Request**: Submit for editorial review
3. **Editorial Review**: Editors review and approve/reject
4. **Publication**: Approved content can be published
5. **Audit Trail**: All changes tracked with timestamps

**Workflow Hooks:**
```typescript
const workflowHooks = {
  beforeChange: [
    ({ data, operation, req }) => {
      // Auto-assign reviewer based on content type
      if (data.status === 'pending-review' && !data.reviewer) {
        data.reviewer = getAvailableEditor(req.payload)
      }
      
      // Track publication
      if (data.status === 'published' && !data.publishedBy) {
        data.publishedBy = req.user.id
        data.publishedAt = new Date()
      }
      
      return data
    }
  ],
  afterChange: [
    ({ doc, operation, req }) => {
      // Send notifications for status changes
      if (doc.status === 'pending-review') {
        sendReviewNotification(doc, req.payload)
      }
    }
  ]
}
```

### Audit Logging Implementation

**Audit Log Schema:**
```typescript
interface AuditLog {
  id: string
  collection: string
  documentId: string
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish'
  user: UserReference
  timestamp: Date
  changes: FieldChange[]
  ipAddress: string
  userAgent: string
}

interface FieldChange {
  field: string
  oldValue: any
  newValue: any
}
```

**Automatic Audit Logging:**
```typescript
const auditPlugin = {
  name: 'audit-log',
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const changes = compareDocuments(previousDoc, doc)
        
        await req.payload.create({
          collection: 'audit-logs',
          data: {
            collection: req.collection.slug,
            documentId: doc.id,
            action: operation,
            user: req.user?.id,
            timestamp: new Date(),
            changes,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        })
      }
    ]
  }
}
```

**Audit Log Viewing:**
- Admin-only access to audit logs
- Filterable by collection, user, date range
- Exportable for compliance requirements
- Real-time activity monitoring

---

## Dependencies & Requirements

### Required Dependencies

**Core Framework Dependencies:**
```json
{
  "dependencies": {
    "@payloadcms/db-vercel-postgres": "^3.56.0",
    "@payloadcms/next": "^3.56.0",
    "@payloadcms/payload-cloud": "^3.56.0",
    "@payloadcms/richtext-lexical": "^3.56.0",
    "@payloadcms/storage-vercel-blob": "^3.56.0",
    "@payloadcms/ui": "^3.56.0",
    "payload": "^3.56.0",
    "next": "^15.4.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

**Database and Storage:**
```json
{
  "dependencies": {
    "@vercel/postgres": "^0.10.0",
    "postgres": "^3.4.4",
    "sharp": "^0.34.2"
  }
}
```

**Development Dependencies:**
```json
{
  "devDependencies": {
    "@types/node": "^22.5.4",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "typescript": "^5.7.3",
    "eslint": "^9.16.0",
    "eslint-config-next": "^15.4.4",
    "prettier": "^3.4.2"
  }
}
```

### System Requirements

**Node.js Version:**
- **Minimum**: Node.js 18.20.2
- **Recommended**: Node.js 20.9.0 or higher
- **Package Manager**: pnpm 9.x or 10.x

**Database Requirements:**
- **PostgreSQL**: Version 13 or higher
- **Connection Pooling**: PgBouncer recommended
- **Storage**: Minimum 1GB, scales with content

**Vercel Account Requirements:**
- **Plan**: Pro plan recommended for production
- **Regions**: Choose closest to target audience
- **Limits**: 
  - Function execution: 30 seconds max
  - Memory: 1024MB default
  - Bandwidth: Based on plan

### Version Compatibility Matrix

| Component | Version | Compatibility |
|-----------|---------|---------------|
| Payload CMS | 3.56.0+ | ✅ Latest stable |
| Next.js | 15.4.4+ | ✅ App Router required |
| React | 19.1.0+ | ✅ Server Components |
| Node.js | 18.20.2+ | ✅ LTS versions |
| PostgreSQL | 13+ | ✅ All versions |
| TypeScript | 5.7.3+ | ✅ Latest features |

### Optional Enhancements

**Analytics and Monitoring:**
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.3.1",
    "@sentry/nextjs": "^8.40.0",
    "posthog-js": "^1.165.0"
  }
}
```

**SEO and Performance:**
```json
{
  "dependencies": {
    "next-sitemap": "^4.2.3",
    "next-seo": "^6.6.0",
    "@next/bundle-analyzer": "^15.4.4"
  }
}
```

**Email and Notifications:**
```json
{
  "dependencies": {
    "nodemailer": "^6.9.15",
    "@sendgrid/mail": "^8.1.4",
    "resend": "^4.0.1"
  }
}
```

---

## Troubleshooting

### Common Deployment Issues

#### 1. Database Connection Errors

**Problem**: `Error: Connection terminated unexpectedly`

**Solutions:**
```bash
# Check environment variables
echo $POSTGRES_URL
echo $POSTGRES_PRISMA_URL

# Verify database accessibility
npx payload migrate:status

# Reset database connection
npx payload migrate:reset
```

**Prevention:**
- Use connection pooling URLs
- Set appropriate timeout values
- Monitor connection limits

#### 2. Build Failures

**Problem**: `Module not found: Can't resolve '@payloadcms/...'`

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install

# Regenerate types
npx payload generate:types

# Check import paths
npx payload generate:importmap
```

#### 3. Media Upload Issues

**Problem**: `Failed to upload file to Vercel Blob`

**Solutions:**
```bash
# Verify blob token
echo $BLOB_READ_WRITE_TOKEN

# Check file size limits
# Images: 10MB max
# Documents: 25MB max

# Test blob connection
curl -X POST "https://blob.vercel-storage.com" \
  -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN"
```

#### 4. Performance Issues

**Problem**: Slow admin panel or API responses

**Solutions:**
```typescript
// Optimize database queries
const optimizedQuery = {
  limit: 25,
  select: {
    id: true,
    title: true,
    status: true,
  },
  where: {
    status: { equals: 'published' }
  }
}

// Enable caching
export const revalidate = 3600 // 1 hour cache
```

### Environment-Specific Issues

#### Development Environment

**Common Issues:**
- Hot reload not working
- Type generation errors
- Local database connection

**Solutions:**
```bash
# Development server with debugging
NODE_OPTIONS="--inspect" pnpm dev

# Force type regeneration
rm src/payload-types.ts
npx payload generate:types

# Reset local database
npx payload migrate:reset --local
```

#### Production Environment

**Common Issues:**
- Function timeout errors
- Memory limit exceeded
- Cold start performance

**Solutions:**
```typescript
// Optimize function performance
export const maxDuration = 30
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Reduce bundle size
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@payloadcms/ui'],
  },
}
```

### Monitoring and Debugging

#### Error Tracking Setup

```typescript
// Sentry configuration
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  tracesSampleRate: 0.1,
})
```

#### Performance Monitoring

```typescript
// Custom performance tracking
export async function middleware(request: NextRequest) {
  const start = Date.now()
  
  const response = NextResponse.next()
  
  const duration = Date.now() - start
  console.log(`${request.method} ${request.url} - ${duration}ms`)
  
  return response
}
```

#### Health Check Endpoints

```typescript
// API route: /api/health
export async function GET() {
  try {
    // Test database connection
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    })
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message,
    }, { status: 500 })
  }
}
```

### Support Resources

**Official Documentation:**
- [Payload CMS Docs](https://payloadcms.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

**Community Support:**
- [Payload Discord](https://discord.gg/payload)
- [GitHub Issues](https://github.com/payloadcms/payload)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/payload-cms)

**Professional Support:**
- Payload CMS Enterprise Support
- Vercel Pro Support
- Custom development consultation

---

## Conclusion

This comprehensive guide provides all necessary information for deploying and managing a Payload CMS instance on Vercel for the Future Franchise Owners website. The documented architecture supports scalable content management with robust security, performance optimization, and client access controls.

For additional support or custom requirements, refer to the troubleshooting section or contact the development team.