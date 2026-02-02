# Database Structure Overview

## Database Technology
- **Database**: PostgreSQL (via Supabase)
- **ORM/Adapter**: Vercel Postgres Adapter (Payload CMS)
- **Primary Key Type**: UUID v7 (universally unique identifiers)
- **Storage**: Supabase S3-compatible storage for media files

## Collections (Tables)

### 1. Users
**Purpose**: Administrative users with authentication
- `id` (UUID) - Primary key
- `name` (text) - User's full name
- `email` (email) - Login email (unique)
- `password` (hashed) - Authentication
- `createdAt`, `updatedAt` (timestamps)

**Access**: Auth-enabled, admin only

---

### 2. Media
**Purpose**: File uploads (images, documents)
- `id` (UUID) - Primary key
- `filename` (text) - Sanitized filename with timestamp
- `alt` (text) - Alt text for accessibility
- `url` (text) - File URL (S3 or local)
- `mimeType` (text) - File type
- `filesize` (number) - File size in bytes
- `width`, `height` (number) - Image dimensions
- `createdAt`, `updatedAt` (timestamps)

**Storage**: Supabase S3 bucket (`media` prefix)
**Access**: Public read

---

### 3. Industries
**Purpose**: Franchise industry categories
- `id` (UUID) - Primary key
- `name` (text, unique) - Industry name (e.g., "Food & Beverage")
- `slug` (text, unique) - URL-friendly identifier
- `description` (textarea) - Optional description
- `icon` (select) - Lucide icon name (e.g., "Coffee", "Dumbbell")
- `color` (text) - Badge background color (hex)
- `textColor` (text) - Badge text color (hex)
- `createdBy`, `updatedBy` (UUID) - Audit fields
- `createdAt`, `updatedAt` (timestamps)

**Access**: Public read, admin write

---

### 4. Tags
**Purpose**: Feature tags for franchises (e.g., "Low Cost", "Home Based")
- `id` (UUID) - Primary key
- `name` (text, unique) - Tag name
- `slug` (text, unique) - URL-friendly identifier
- `type` (select) - Category: feature, investment, model, location, other
- `description` (textarea) - Optional description
- `color` (text) - Badge background color (hex)
- `textColor` (text) - Badge text color (hex)
- `createdBy`, `updatedBy` (UUID) - Audit fields
- `createdAt`, `updatedAt` (timestamps)

**Access**: Public read, admin write

---

### 5. Agents
**Purpose**: Franchise consultants/agents
- `id` (UUID) - Primary key
- `name` (text) - Agent's full name
- `email` (email) - Contact email
- `phone` (text) - Contact phone
- `title` (text) - Job title
- `bio` (richText/Lexical) - Biography with links
- `photo` (UUID) - Relationship to Media
- `specialties` (array) - Array of specialty categories
- `isActive` (checkbox) - Active status
- `ghlWebhook` (text) - GoHighLevel webhook URL
- `createdBy`, `updatedBy` (UUID) - Audit fields
- `createdAt`, `updatedAt` (timestamps)

**Access**: Public read, admin write

---

### 6. Franchises
**Purpose**: Franchise business listings
- `id` (UUID) - Primary key (used in URLs)
- `businessName` (text) - Franchise name
- `slug` (text) - Legacy URL identifier (hidden, optional)
- `status` (select) - draft, published, archived
- `isFeatured` (checkbox) - Featured flag
- `isSponsored` (checkbox) - Sponsored flag
- `isTopPick` (checkbox) - Top pick flag
- `shortDescription` (text) - Brief summary for cards/SEO
- `description` (richText/Lexical) - Full description with links
- `industry` (UUID[]) - Relationship to Industries (many-to-many)
- `tags` (UUID[]) - Relationship to Tags (many-to-many)
- `investment` (group):
  - `min` (number) - Minimum investment
  - `max` (number) - Maximum investment
  - `badgeColor` (text) - Custom badge background color
  - `badgeTextColor` (text) - Custom badge text color
- `logo` (UUID) - Relationship to Media
- `assignedAgent` (UUID) - Relationship to Agents
- `useMainContact` (checkbox) - Override agent assignment
- `createdBy`, `updatedBy` (UUID) - Audit fields
- `createdAt`, `updatedAt` (timestamps)

**Access**: Public read, admin write

---

### 7. Pages
**Purpose**: Dynamic page builder with block-based layouts
- `id` (UUID) - Primary key
- `title` (text) - Page title
- `slug` (text, unique) - URL path (e.g., "homepage", "franchises")
- `layout` (blocks[]) - Array of content blocks:
  - **franchiseGrid**: Display franchise listings with filters
  - **ribbon**: Scrolling ticker/announcement bar
  - **navbar**: Navigation header
  - **hero**: Hero section with CTA buttons
  - **aboutTeaser**: About section with highlights
  - **callToAction**: CTA section
  - **contentImage**: Content with image
  - **gridCards**: Card grid layout
  - **imageCard**: Single image card
  - **teamSection**: Team member showcase
  - **video**: Video embed
  - **map**: Map embed
  - **blogHighlights**: Blog post highlights
  - **contactInfo**: Contact information
  - **formBuilder**: Dynamic form builder
  - **addToCart**: Add to cart functionality
  - **footer**: Footer section
- `createdAt`, `updatedAt` (timestamps)

**Block Features**:
- Each block has `published` (checkbox) for visibility control
- Each block has optional `anchorId` for deep linking
- Blocks support rich customization (colors, layouts, content)

**Access**: Public read, admin write

---

### 8. ContactSubmissions
**Purpose**: Contact form submissions
- `id` (UUID) - Primary key
- `name` (text) - Submitter name
- `email` (email) - Submitter email
- `phone` (text) - Submitter phone
- `company` (text) - Company name
- `subject` (text) - Message subject
- `message` (textarea) - Message content
- `ipAddress` (text) - Submitter IP (auto-captured)
- `status` (select) - new, read, archived
- `createdBy`, `updatedBy` (UUID) - Audit fields
- `createdAt`, `updatedAt` (timestamps)

**Access**: Admin only (read/write), API can create

---

### 9. AuditLogs
**Purpose**: System-wide activity tracking
- `id` (UUID) - Primary key
- `collection` (text, indexed) - Which collection was modified
- `recordId` (text, indexed) - ID of modified record
- `operation` (select, indexed) - create, update, delete
- `user` (UUID) - Relationship to Users (who made the change)
- `changes` (json) - Detailed before/after values
- `changedFields` (array) - List of modified field names
- `ipAddress` (text) - User's IP address
- `userAgent` (textarea) - Browser/client info
- `createdAt` (timestamp)

**Access**: Admin read only, auto-created via hooks
**Note**: Cannot be manually created/updated, only via system hooks

---

## Globals (Singleton Tables)

### SiteSettings
**Purpose**: Site-wide configuration
- `id` (UUID) - Primary key (singleton)
- **Navbar Tab**:
  - `navbarPublished` (checkbox) - Show/hide navbar globally
  - `navbarVisibility` (select) - all, include, exclude
  - `navbarPages` (UUID[]) - Pages to include/exclude
  - `navbar` (group) - Logo, links, CTA button config
- **Footer Tab**:
  - `footerPublished` (checkbox) - Show/hide footer globally
  - `footerVisibility` (select) - all, include, exclude
  - `footerPages` (UUID[]) - Pages to include/exclude
  - `footer` (group) - Company info, columns, social links, bottom links
- **Global Ticker Tab**:
  - `tickerEnabled` (checkbox) - Enable site-wide ticker
  - `ticker` (group) - Text, colors, animation, link config
- **General Tab**:
  - `enableCart` (checkbox) - Enable cart feature
  - `showWishlistButton`, `showCartButton` (checkbox)
  - `siteName`, `siteDescription` (text)
  - `contactEmail`, `contactPhone` (text)
- **SEO Tab**:
  - `seo` (group) - Default title, description, keywords, OG image
  - Social verification codes (Google, Bing, Facebook, Twitter)

**Access**: Public read, admin write

---

## Relationships & Indexes

### Many-to-Many Relationships
- **Franchises ↔ Industries**: A franchise can have multiple industries
- **Franchises ↔ Tags**: A franchise can have multiple tags
- **Pages ↔ SiteSettings**: Pages can be included/excluded from navbar/footer

### One-to-Many Relationships
- **Agents → Franchises**: An agent can be assigned to multiple franchises
- **Media → Multiple Collections**: Media files can be referenced by franchises, agents, pages, etc.
- **Users → AuditLogs**: A user can have many audit log entries

### Indexes
- `auditLogs.collection` - For filtering by collection
- `auditLogs.recordId` - For finding changes to specific records
- `auditLogs.operation` - For filtering by operation type
- `auditLogs.user` - For filtering by user

---

## Storage Configuration

### Supabase S3 Storage
```env
SUPABASE_STORAGE_BUCKET="media"
SUPABASE_S3_ENDPOINT="https://aqhplikvpatbcuiguzmg.supabase.co/storage/v1/s3"
SUPABASE_S3_REGION="us-east-1"
SUPABASE_S3_ACCESS_KEY_ID="..."
SUPABASE_S3_SECRET_ACCESS_KEY="..."
```

**Media Collection**: Configured to use S3 storage with `media` prefix
**Filename Sanitization**: Automatic sanitization with timestamp appending

---

## Audit Trail System

All collections (except AuditLogs itself) have audit fields:
- `createdBy` (UUID) - User who created the record
- `updatedBy` (UUID) - User who last updated the record

**Automatic Logging**: 
- `afterChange` hook logs all create/update operations
- `afterDelete` hook logs all delete operations
- Captures: user, IP, user agent, changed fields, before/after values

---

## Data Flow

### Frontend → Database
1. User submits form → API route → Payload API → PostgreSQL
2. Admin edits content → Payload Admin → PostgreSQL
3. File upload → Payload → Supabase S3 → Media record in PostgreSQL

### Database → Frontend
1. Page request → Next.js → Payload API → PostgreSQL → Render
2. Media request → Next.js → Supabase S3 → Serve file
3. Live preview → Payload Admin → PostgreSQL → Preview render

---

## Current Issues (From Error Log)

### Missing Media Files
The errors show media files referenced in the database but missing from disk:
- `future-franchise-owners-1761709843616.png`
- `pexels-photo-7175985.jpeg-...`
- `abs_logo-300x116-1761880055150.png`
- And several others

**Root Cause**: Database has media records, but files don't exist in storage

**Solution**: 
1. S3 storage is now properly configured (added `SUPABASE_S3_ENDPOINT`)
2. Re-upload missing images through Payload admin
3. Or delete orphaned media records from database

---

## Schema Migrations

Located in `src/migrations/`:
- Migration files track schema changes over time
- Includes JSON snapshots and TypeScript migration scripts
- Latest migration: `20251205_031318`

---

## Type Safety

**Generated Types**: `src/payload-types.ts`
- Auto-generated from Payload config
- Provides TypeScript types for all collections and globals
- Regenerated on schema changes

---

## Best Practices

1. **Always use UUIDs**: All primary keys are UUID v7
2. **Audit everything**: All collections have audit fields and hooks
3. **Public read, admin write**: Standard access pattern
4. **Sanitize filenames**: Media collection auto-sanitizes uploads
5. **Use relationships**: Leverage Payload's relationship fields
6. **Block-based pages**: Use layout blocks for flexible page building
7. **S3 for production**: Always use S3 storage, not local disk
