# Design Document: Block Anchor IDs

## Overview

This feature adds anchor ID support to all page blocks, enabling fragment navigation (e.g., `/contact#contact-form`). The implementation involves three main components:

1. **CMS Schema Updates**: Add an optional `anchorId` field to all block definitions in the Pages collection
2. **Frontend Rendering**: Modify block components to render anchor IDs as HTML `id` attributes
3. **Validation**: Implement uniqueness validation to prevent duplicate IDs within a page

## Architecture

### High-Level Flow

```
CMS Editor → Enters Anchor ID → Validation → Save to Database
                                                      ↓
                                            Frontend Renders Block
                                                      ↓
                                            HTML id Attribute Applied
                                                      ↓
                                            Browser Fragment Navigation
```

### Component Interaction

1. **Pages Collection** (`src/collections/Pages.tsx`): Defines the schema with anchor ID field for each block
2. **Block Components** (`src/components/blocks/*.tsx`): Render the anchor ID as an HTML `id` attribute
3. **Page Renderer** (`src/app/(frontend)/[slug]/page.tsx`): Passes block data to components
4. **Browser**: Handles fragment navigation automatically via native behavior

## Components and Interfaces

### 1. CMS Schema Changes

**Location**: `src/collections/Pages.tsx`

Add a new field to each block definition in the `layout.blocks` array:

```typescript
{
  name: 'anchorId',
  type: 'text',
  required: false,
  admin: {
    description: 'Optional anchor ID for direct linking (e.g., "contact-form" for #contact-form). Use lowercase letters, numbers, and hyphens only.',
    placeholder: 'e.g., contact-form',
  },
  validate: (value: string | undefined) => {
    if (!value) return true // Optional field

    // Validate format: lowercase letters, numbers, hyphens only
    const validFormat = /^[a-z0-9-]+$/
    if (!validFormat.test(value)) {
      return 'Anchor ID must contain only lowercase letters, numbers, and hyphens'
    }

    return true
  }
}
```

**Blocks to Update**:

- franchiseGrid
- ribbon
- navbar
- hero
- aboutTeaser
- callToAction
- blogHighlights
- map
- teamSection
- formBuilder
- contactInfo

### 2. Block Component Updates

**Pattern**: Each block component needs to:

1. Accept `anchorId` in its props interface
2. Apply the `id` attribute to the outermost `<section>` or container element

**Example Implementation** (FormBuilderBlock):

```typescript
interface FormBuilderBlockProps {
  block: {
    // ... existing fields
    anchorId?: string | null
  }
}

export const FormBuilderBlock: React.FC<FormBuilderBlockProps> = ({ block }) => {
  // ... existing code

  return (
    <section
      className="bg-white py-16"
      {...(block.anchorId && { id: block.anchorId })}
    >
      {/* ... existing content */}
    </section>
  )
}
```

**Components to Update**:

- `src/components/blocks/FormBuilderBlock.tsx`
- `src/components/blocks/ContactInfoBlock.tsx`
- `src/components/blocks/HeroBlock.tsx`
- `src/components/blocks/RibbonBlock.tsx`
- `src/components/blocks/NavbarBlock.tsx`
- `src/components/blocks/FranchiseGridBlock.tsx`
- `src/components/blocks/BlogHighlightsBlock.tsx`
- `src/components/blocks/MapBlock.tsx`
- `src/components/blocks/AboutTeaserBlock.tsx`
- `src/components/blocks/CallToActionBlock.tsx`
- `src/components/blocks/TeamSectionBlock.tsx`

### 3. Uniqueness Validation

**Location**: `src/collections/Pages.tsx`

Add a custom validation hook at the collection level to ensure anchor IDs are unique within a page:

```typescript
const Pages: CollectionConfig = {
  slug: 'pages',
  // ... existing config
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Validate unique anchor IDs within the page
        if (!data?.layout) return data

        const anchorIds = new Map<string, string[]>()

        data.layout.forEach((block: any, index: number) => {
          if (block.anchorId) {
            const id = block.anchorId.toLowerCase()
            if (!anchorIds.has(id)) {
              anchorIds.set(id, [])
            }
            anchorIds.get(id)!.push(`${block.blockType} (position ${index + 1})`)
          }
        })

        // Check for duplicates
        const duplicates: string[] = []
        anchorIds.forEach((blocks, id) => {
          if (blocks.length > 1) {
            duplicates.push(`"${id}" used in: ${blocks.join(', ')}`)
          }
        })

        if (duplicates.length > 0) {
          throw new Error(
            `Duplicate anchor IDs found:\n${duplicates.join('\n')}\n\nEach anchor ID must be unique within the page.`,
          )
        }

        return data
      },
    ],
  },
}
```

## Data Models

### Block Type Extension

All block types will have this additional field:

```typescript
interface BaseBlock {
  // ... existing fields
  anchorId?: string | null
}
```

### Payload Types Update

The auto-generated `src/payload-types.ts` will be updated automatically when the schema changes are saved.

## Error Handling

### Validation Errors

1. **Invalid Format**: If anchor ID contains invalid characters
   - Error: "Anchor ID must contain only lowercase letters, numbers, and hyphens"
   - Shown: Inline in the CMS field

2. **Duplicate IDs**: If multiple blocks have the same anchor ID
   - Error: "Duplicate anchor IDs found: [list of duplicates]"
   - Shown: At the top of the page editor before save

### Frontend Handling

1. **Missing Anchor**: If URL fragment doesn't match any block
   - Behavior: Page loads normally at the top (browser default)
   - No error shown to user

2. **Empty Anchor ID**: If block has no anchor ID defined
   - Behavior: No `id` attribute rendered
   - Block functions normally

## Testing Strategy

### Unit Tests

Not required for this feature as it's primarily configuration-based.

### Manual Testing Checklist

1. **CMS Validation**:
   - [ ] Add anchor ID to a block and verify it saves
   - [ ] Try invalid characters (uppercase, spaces, special chars) and verify error
   - [ ] Add duplicate anchor IDs and verify validation error
   - [ ] Leave anchor ID empty and verify block saves normally

2. **Frontend Rendering**:
   - [ ] Verify anchor ID renders as HTML `id` attribute
   - [ ] Navigate to URL with fragment (e.g., `/contact#form`) and verify scroll
   - [ ] Test smooth scrolling behavior
   - [ ] Verify blocks without anchor IDs render normally

3. **Cross-Browser Testing**:
   - [ ] Test fragment navigation in Chrome, Firefox, Safari
   - [ ] Test on mobile devices

4. **Edge Cases**:
   - [ ] Test with very long anchor IDs
   - [ ] Test with multiple fragments in quick succession
   - [ ] Test with anchor links in rich text content

### Integration Testing

Test the complete flow:

1. Create a page with multiple blocks
2. Add anchor IDs to some blocks
3. Create internal links using the anchor IDs
4. Verify navigation works correctly
5. Edit anchor IDs and verify updates work

## Implementation Notes

### Auto-Generation Consideration

For better UX, we could add auto-generation of anchor IDs based on block type and heading:

```typescript
// Example: "Contact Form" → "contact-form"
const generateAnchorId = (blockType: string, heading?: string): string => {
  if (heading) {
    return heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return blockType
}
```

This would be implemented as a suggestion in the CMS UI, not enforced.

### Smooth Scrolling

The browser handles fragment navigation automatically. For enhanced UX, we could add CSS:

```css
html {
  scroll-behavior: smooth;
}
```

This should be added to the global styles if not already present.

### Accessibility

The `id` attribute improves accessibility by:

- Enabling skip links for keyboard navigation
- Allowing screen readers to jump to specific sections
- Supporting ARIA relationships if needed in the future

## Performance Considerations

- **Minimal Impact**: Adding an `id` attribute has negligible performance impact
- **No JavaScript Required**: Fragment navigation is native browser behavior
- **Static Generation**: Anchor IDs are rendered at build time for static pages

## Security Considerations

- **XSS Prevention**: Validation regex prevents injection of malicious code
- **No User Input**: Anchor IDs are set by CMS editors only, not end users
- **Sanitization**: Payload CMS handles field sanitization automatically

## Future Enhancements

1. **Visual Preview**: Show a live preview of the anchor link in the CMS
2. **Auto-Generation**: Suggest anchor IDs based on block content
3. **Link Helper**: Add a UI tool to easily create internal anchor links
4. **Analytics**: Track which anchor links are most used
5. **Scroll Offset**: Add configuration for scroll offset (useful with fixed headers)
