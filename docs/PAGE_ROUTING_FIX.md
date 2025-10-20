# Page Routing Fix

## Changes Made

### 1. Homepage Route (/)

- **Updated**: `src/app/(frontend)/page.tsx`
  - Changed slug lookup from `'landing-page'` to `'homepage'`
- **Updated**: `src/seed.ts`
  - Changed landing page slug from `'landing-page'` to `'homepage'`

**Result**: The homepage now properly displays at `/` (root URL)

### 2. Dynamic Page Routes (e.g., /franchises)

- **Created**: `src/app/(frontend)/[slug]/page.tsx`
  - New dynamic route that handles any page from Payload CMS based on slug
  - Supports all block types (Hero, Ribbon, Navbar, FranchiseGrid, etc.)
  - Includes `generateStaticParams()` for static generation at build time
  - Includes `generateMetadata()` for SEO

**Result**: Any page created in Payload CMS will now be accessible at `/<slug>`

- Example: A page with slug "franchises" will be accessible at `/franchises`
- Example: A page with slug "about-us" will be accessible at `/about-us`

### 3. Pages Collection Improvements

- **Updated**: `src/collections/Pages.tsx`
  - Added auto-slug generation from title
  - Made slug unique
  - Added helpful admin description
  - Made slug read-only with sidebar position

**Result**: When creating pages in admin, the slug is automatically generated from the title

## How It Works

1. **Homepage (`/`)**: Handled by `src/app/(frontend)/page.tsx`
   - Looks for a page with slug `'homepage'`
2. **All Other Pages (`/[slug]`)**: Handled by `src/app/(frontend)/[slug]/page.tsx`
   - Looks for a page with the matching slug
   - Returns 404 if page not found
3. **Franchise Detail Pages (`/franchises/[id]`)**: Handled by existing route
   - Continues to work as before for individual franchise detail pages

## Testing Steps

1. **Update the database**:

   ```bash
   pnpm payload generate:types
   ```

2. **Re-run seed** (if you want to recreate homepage with correct slug):

   ```bash
   # In admin, delete the old "landing-page" page if it exists
   # Then run: pnpm payload seed
   ```

3. **Test the pages**:
   - Visit `/` - should show the homepage
   - Visit `/franchises` - should show your franchises page
   - Visit any other page slug you create

## Creating New Pages

To create a new page:

1. Go to admin panel → Pages → Create New
2. Enter a title (e.g., "About Us")
3. Slug will auto-generate (e.g., "about-us")
4. Add blocks to the layout
5. Save
6. Visit `/<slug>` (e.g., `/about-us`)

**Note**: The homepage should use slug "homepage" to be displayed at `/`
