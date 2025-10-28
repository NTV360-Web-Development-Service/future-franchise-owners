# SEO Implementation Guide

## ✅ What's Been Implemented

### 1. **Robots.txt** (`src/app/robots.ts`)

- Tells search engines which pages to crawl
- Blocks admin, API, and import routes
- Points to your sitemap

### 2. **Dynamic Sitemap** (`src/app/sitemap.ts`)

- Auto-generates from your CMS content
- Includes all pages and franchises
- Updates automatically when content changes
- Proper priority and change frequency settings

### 3. **Enhanced Metadata**

- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs to prevent duplicate content
- Keywords for search engines
- Proper title and description tags

### 4. **Structured HTML**

- Semantic HTML5 elements
- Proper heading hierarchy (h1, h2, h3)
- Alt text support for images
- Screen reader friendly content

## 🚀 Next Steps to Improve SEO

### 1. **Add SEO Fields to Pages Collection**

Add these fields to `src/collections/Pages.tsx`:

```typescript
{
  name: 'seo',
  type: 'group',
  label: 'SEO Settings',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      admin: {
        description: 'SEO title (50-60 characters). Leave empty to use page title.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      maxLength: 160,
      admin: {
        description: 'SEO description (150-160 characters). Appears in search results.',
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Focus Keywords',
      admin: {
        description: 'Comma-separated keywords for this page',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Share Image',
      admin: {
        description: 'Image for social media sharing (1200x630px recommended)',
      },
    },
  ],
}
```

### 2. **Submit to Search Engines**

Once deployed, submit your sitemap to:

- **Google Search Console**: https://search.google.com/search-console
  - Add property → Enter your domain
  - Submit sitemap: `https://yourdomain.com/sitemap.xml`
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
  - Add site → Submit sitemap

### 3. **Add Structured Data (Schema.org)**

Create `src/lib/generateSchema.ts`:

```typescript
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Future Franchise Owners',
    url: 'https://futurefranchiseowners.com',
    logo: 'https://futurefranchiseowners.com/logo.png',
    description: 'Expert franchise consulting and opportunities',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@futurefranchiseowners.com',
    },
  }
}

export function generateFranchiseSchema(franchise: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: franchise.name,
    description: franchise.description,
    image: franchise.logo?.url,
    // Add more franchise-specific data
  }
}
```

Then add to your pages:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateOrganizationSchema()),
  }}
/>
```

### 4. **Performance Optimization**

- ✅ Already using Next.js Image optimization
- ✅ Already using modern image formats (AVIF, WebP)
- Consider adding:
  - Lazy loading for below-the-fold content
  - Preloading critical resources
  - Font optimization

### 5. **Content Best Practices**

- **Unique titles**: Each page should have a unique, descriptive title
- **Meta descriptions**: Write compelling 150-160 character descriptions
- **Heading structure**: Use h1 → h2 → h3 hierarchy properly
- **Internal linking**: Link between related pages
- **Alt text**: Add descriptive alt text to all images
- **Content length**: Aim for 300+ words on important pages
- **Keywords**: Use naturally, don't stuff

### 6. **Technical SEO Checklist**

- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Mobile responsive
- ✅ Fast loading (Next.js SSR)
- ✅ HTTPS (when deployed)
- ⬜ 404 page (already exists)
- ⬜ Breadcrumbs (consider adding)
- ⬜ XML sitemap index (if you have 1000+ pages)

### 7. **Monitor & Improve**

Tools to use:

- **Google Search Console**: Track rankings, clicks, impressions
- **Google Analytics**: Track user behavior
- **PageSpeed Insights**: Monitor performance
- **Lighthouse**: Audit SEO, performance, accessibility
- **Ahrefs/SEMrush**: Keyword research and competitor analysis

## 📊 Testing Your SEO

### Local Testing

```bash
# Build and start production server
pnpm run build
pnpm run start

# Visit these URLs:
# http://localhost:3000/robots.txt
# http://localhost:3000/sitemap.xml
```

### Online Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Lighthouse**: Built into Chrome DevTools

## 🔧 Configuration

### Environment Variables

Make sure to set in production:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Next.js Config

Already configured in `next.config.mjs`:

- Image optimization
- Modern image formats
- Proper caching

## 📝 Content Guidelines

### Writing Good Meta Descriptions

**Good:**

> "Discover top franchise opportunities across 20+ industries. Connect with expert consultants and find your perfect franchise match. Free consultation available."

**Bad:**

> "Welcome to our website. We have franchises."

### Title Tag Best Practices

- Keep under 60 characters
- Include primary keyword
- Make it compelling
- Include brand name at the end

**Example:**

- Homepage: "Find Your Perfect Franchise | Future Franchise Owners"
- About: "Expert Franchise Consulting Services | Future Franchise Owners"
- Industry: "Food & Restaurant Franchises | Future Franchise Owners"

## 🎯 Quick Wins

1. **Add Google Analytics** - Track your traffic
2. **Set up Google Search Console** - Monitor search performance
3. **Create a blog** - Regular content helps SEO
4. **Get backlinks** - Reach out to industry sites
5. **Optimize images** - Compress and add alt text
6. **Speed up site** - Already fast with Next.js!
7. **Mobile-first** - Already responsive!

## 📞 Need Help?

Common issues:

- **Site not indexed**: Submit sitemap to Google Search Console
- **Low rankings**: Focus on quality content and backlinks
- **Slow site**: Check PageSpeed Insights for recommendations
- **Duplicate content**: Use canonical URLs (already implemented)

---

**Remember**: SEO is a marathon, not a sprint. It takes 3-6 months to see significant results. Focus on creating quality content and a great user experience!
