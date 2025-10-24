# RichText Guide: Links & Formatting

## Overview

Your richtext fields now support:

- **Internal links** (interlinks) between pages and franchises
- **External links** to any URL
- **Text colors and inline styles** via HTML pasting
- Full text formatting (bold, italic, lists, headings, etc.)

This allows you to create a rich, connected content experience!

## Features Enabled

### 1. **Basic Links**

- Link to any external URL
- Open in new tab option
- Custom link text

### 2. **Internal Links (Interlinks)**

- Link to other **Pages** (e.g., link from a franchise description to your "About Us" page)
- Link to other **Franchises** (e.g., link from one franchise to a related franchise)
- Automatic URL generation
- SEO-friendly rel attributes

## How to Use in Admin Panel

### Adding a Link in RichText Editor

1. **Select text** in the richtext editor that you want to turn into a link
2. Click the **Link icon** (🔗) in the toolbar
3. A popup will appear with several options:

### Link Options

#### Option A: External URL

- **Link Type**: Select "Custom URL"
- **URL**: Enter the full URL (e.g., `https://example.com`)
- **Open in new tab**: Check if you want the link to open in a new tab
- **Rel attributes**: Add SEO attributes like `nofollow`, `noopener`, `noreferrer`

#### Option B: Internal Link to a Page

- **Link Type**: Select "Internal link"
- **Relationship**: Choose "pages"
- **Select Page**: Pick the page you want to link to from the dropdown
- The URL will be automatically generated based on the page slug

#### Option C: Internal Link to a Franchise

- **Link Type**: Select "Internal link"
- **Relationship**: Choose "franchises"
- **Select Franchise**: Pick the franchise you want to link to
- The URL will be automatically generated (e.g., `/franchises/[franchise-id]`)

## Example Use Cases

### 1. Cross-reference Franchises

In your franchise description for "McDonald's", you could write:

```
"Similar to [Burger King], we offer comprehensive training programs..."
```

Where "Burger King" links to another franchise in your system.

### 2. Link to Landing Pages

```
"Learn more about our [franchise opportunities] and [financing options]."
```

Where these phrases link to your Pages collection items.

### 3. External Resources

```
"Read our latest blog post on [franchise trends]."
```

Where the link points to an external blog article.

## Configuration Details

The configuration in `src/collections/Franchises.ts` enables:

```typescript
LinkFeature({
  enabledCollections: ['pages', 'franchises'],
  // Additional SEO-friendly rel attributes
})
```

### Available Collections for Internal Links

- ✅ **pages** - Link to any page (About, Contact, etc.)
- ✅ **franchises** - Link to other franchise listings

### Want to add more?

To enable links to other collections (e.g., Industries, Agents), simply add them to the `enabledCollections` array:

```typescript
LinkFeature({
  enabledCollections: ['pages', 'franchises', 'industries', 'agents'],
})
```

## Rendering Links on Frontend

### Using the RichTextRenderer Component

We've created a custom `RichTextRenderer` component that properly renders Lexical richtext with clickable links:

```typescript
import { RichTextRenderer } from '@/components/RichTextRenderer'

// In your component
<RichTextRenderer
  content={franchise.description}
  className="text-gray-700 leading-relaxed"
/>
```

### Features of RichTextRenderer

The component automatically handles:

- ✅ **Internal Links**: Links to pages and franchises with proper Next.js `<Link>` components
- ✅ **External Links**: Regular `<a>` tags with proper attributes
- ✅ **Text Formatting**: Bold, italic, code, etc.
- ✅ **Lists**: Ordered and unordered lists
- ✅ **Headings**: H1-H6 with proper styling
- ✅ **Blockquotes**: Styled quotes
- ✅ **SEO Attributes**: Proper rel attributes for external links

### Link Rendering Logic

**Internal Links** (to pages/franchises):

- Automatically generates URLs based on collection type
- Uses Next.js `<Link>` for client-side navigation
- Pages: `/{page-slug}`
- Franchises: `/franchises/{franchise-id}`

**External Links**:

- Uses standard `<a>` tags
- Supports `target="_blank"` and custom `rel` attributes
- Blue, underlined styling with hover effects

### Styling

Links are styled with:

- Blue color (`text-blue-600`)
- Underline for accessibility
- Darker blue on hover (`hover:text-blue-800`)
- Smooth color transitions

### Example Implementation

```typescript
// src/app/(frontend)/franchises/[id]/page.tsx
import { RichTextRenderer } from '@/components/RichTextRenderer'

export default async function FranchiseDetailPage({ params }) {
  const franchise = await payload.findByID({
    collection: 'franchises',
    id: params.id,
    depth: 2, // Important: Load related docs for internal links
  })

  return (
    <div>
      <h2>About This Franchise</h2>
      <RichTextRenderer
        content={franchise.description}
        className="text-gray-700"
      />
    </div>
  )
}
```

### Important: Set Depth for Internal Links

When fetching documents with richtext that contains internal links, always set `depth: 2` or higher to load the related documents:

```typescript
const franchise = await payload.findByID({
  collection: 'franchises',
  id: franchiseId,
  depth: 2, // This ensures linked pages/franchises are populated
})
```

## SEO Best Practices

When creating links, consider:

- **Internal links**: Help with site navigation and SEO
- **nofollow**: Use for untrusted content or paid links
- **noopener**: Security best practice for external links opening in new tabs
- **noreferrer**: Prevents referrer information from being passed

## Troubleshooting

### "I don't see the link option in my richtext editor"

- Make sure you've saved the collection config changes
- Restart your Payload CMS development server
- Clear your browser cache

### "Internal links aren't working"

- Verify the linked page/franchise is published
- Check that the URL routing matches your frontend setup
- Ensure the relationship collection exists in your config

## Additional Customization

You can customize the link fields further by modifying the `fields` option in `LinkFeature`:

```typescript
LinkFeature({
  enabledCollections: ['pages', 'franchises'],
  fields: ({ defaultFields }) => {
    return [
      ...defaultFields,
      {
        name: 'customAttribute',
        type: 'text',
        admin: {
          description: 'Add custom data to links',
        },
      },
    ]
  },
})
```

## Text Colors & Advanced Formatting

For information on adding text colors and other inline styles, see:

- **[RICHTEXT_TEXT_COLOR.md](./RICHTEXT_TEXT_COLOR.md)** - Complete guide on using colors in richtext

## Resources

- [Payload CMS Lexical Editor Docs](https://payloadcms.com/docs/rich-text/lexical)
- [LinkFeature Documentation](https://payloadcms.com/docs/rich-text/lexical#link-feature)
- [HTMLConverterFeature Documentation](https://payloadcms.com/docs/rich-text/lexical#html-converter)
- [SEO Link Best Practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
