# Design Document: Team Section Block

## Overview

The Team Section Block is a flexible content component that displays team member profiles in either a carousel or grid layout. It integrates with Payload CMS's page builder system and follows the established patterns used by other blocks in the project (FranchiseGridBlock, BlogHighlightsBlock, etc.).

The component will be implemented as a server-side rendered React component that receives configuration from Payload CMS and renders team member information with responsive layouts, smooth interactions, and accessibility features.

## Architecture

### Component Structure

```
src/
├── collections/
│   └── Pages.tsx (add teamSection block definition)
├── components/
│   └── blocks/
│       ├── TeamSectionBlock.tsx (new - main component)
│       └── index.ts (update - export new block)
```

### Data Flow

1. Content editor configures Team Section Block in Payload CMS admin
2. Block configuration is stored in the Pages collection layout field
3. Page component receives block data and passes to TeamSectionBlock
4. TeamSectionBlock renders based on layout mode (carousel or grid)
5. Team member data is mapped to card components with proper styling

## Components and Interfaces

### Block Configuration Interface

The block will be added to the Pages collection with the following structure:

```typescript
{
  slug: 'teamSection',
  fields: [
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      defaultValue: 'Meet Our Team',
    },
    {
      name: 'subheading',
      type: 'text',
      required: false,
    },
    {
      name: 'layoutMode',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'teamMembers',
      type: 'array',
      required: false,
      minRows: 0,
      maxRows: 50,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: false,
        },
        {
          name: 'biography',
          type: 'richText',
          required: false,
          editor: lexicalEditor with LinkFeature
        },
      ],
    },
  ],
}
```

### TypeScript Interfaces

```typescript
interface TeamSectionBlockProps {
  block: {
    blockType: 'teamSection'
    published?: boolean | null
    heading?: string | null
    subheading?: string | null
    layoutMode?: 'grid' | 'carousel' | null
    teamMembers?: TeamMember[] | null
    id?: string | null
    blockName?: string | null
  }
}

interface TeamMember {
  photo?:
    | {
        url?: string
        alt?: string
      }
    | string
    | null
  name: string
  title?: string | null
  biography?: any // Lexical rich text format
  id?: string
}
```

## Design Patterns

### Layout Modes

#### Grid Layout

- Responsive grid using Tailwind CSS grid utilities
- 1 column on mobile (< 768px)
- 2 columns on tablet (768px - 1024px)
- 3 columns on desktop (> 1024px)
- Equal height cards using flexbox
- Consistent spacing with gap utilities

#### Carousel Layout

- Uses existing Carousel component from `@/components/ui/carousel`
- Displays 1 card on mobile, 2 on tablet, 3 on desktop
- Navigation arrows positioned outside carousel on desktop
- Dot indicators below carousel for position tracking
- Loop enabled for continuous navigation
- Smooth transitions with Embla Carousel

### Team Member Card Design

Each team member card will include:

1. **Photo Section**
   - Circular avatar image (aspect-square with rounded-full)
   - Fallback to initials avatar if no photo provided
   - Consistent size across all cards (e.g., 160px diameter)
   - Object-cover for proper image scaling

2. **Content Section**
   - Name: Large, bold text (text-xl font-semibold)
   - Title: Medium text with muted color (text-base text-gray-600)
   - Biography: Smaller text with line clamping (text-sm line-clamp-4)

3. **Card Styling**
   - White background with subtle border
   - Hover effect: shadow-xl and slight background color change
   - Smooth transitions (transition-all duration-300)
   - Padding for comfortable spacing
   - Rounded corners for modern appearance

### Rich Text Rendering

Biography content will use the existing RichTextRenderer component:

- Supports Lexical rich text format
- Handles internal links to pages and franchises
- Applies proper HTML formatting
- Maintains consistent typography

## Data Models

### Team Member Data Structure

```typescript
{
  photo: {
    url: string,
    alt: string
  } | null,
  name: string,
  title: string | null,
  biography: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: string }
          ]
        }
      ]
    }
  } | null
}
```

### Initials Avatar Generation

For team members without photos:

```typescript
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

## Error Handling

### Empty State

- When no team members are configured, display a message: "No team members to display"
- Optionally hide the entire block if empty (based on published toggle)

### Missing Data

- Missing photo: Display initials avatar with gradient background
- Missing title: Omit title section, adjust spacing
- Missing biography: Omit biography section, adjust card height
- Missing name: Should not occur (required field), but fallback to "Team Member"

### Image Loading

- Use Next.js Image component for optimization
- Provide proper alt text from media collection
- Handle loading states with blur placeholder
- Graceful fallback for broken images

## Testing Strategy

### Unit Tests

- Test initials generation function with various name formats
- Test data transformation from Payload format to component props
- Test conditional rendering based on layout mode
- Test empty state handling

### Integration Tests

- Test block rendering in grid mode with multiple team members
- Test block rendering in carousel mode with navigation
- Test responsive behavior at different breakpoints
- Test rich text biography rendering with links
- Test image loading and fallback behavior

### Visual Regression Tests

- Capture screenshots of grid layout at mobile, tablet, desktop
- Capture screenshots of carousel layout with navigation
- Capture screenshots of hover states
- Capture screenshots of empty states and missing data scenarios

### Accessibility Tests

- Verify keyboard navigation works in carousel mode
- Verify screen reader announcements for navigation controls
- Verify color contrast meets WCAG AA standards
- Verify focus indicators are visible
- Verify semantic HTML structure

## Component Implementation Details

### Grid Layout Implementation

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {teamMembers.map((member) => (
    <TeamMemberCard key={member.id} member={member} />
  ))}
</div>
```

### Carousel Layout Implementation

```typescript
<Carousel
  opts={{
    align: 'start',
    loop: true,
  }}
  className="w-full"
>
  <CarouselContent className="-ml-2 md:-ml-4">
    {teamMembers.map((member) => (
      <CarouselItem key={member.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
        <TeamMemberCard member={member} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>
```

### Team Member Card Component

```typescript
function TeamMemberCard({ member }: { member: TeamMember }) {
  const photoUrl = typeof member.photo === 'object' ? member.photo?.url : null
  const photoAlt = typeof member.photo === 'object' ? member.photo?.alt : member.name

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white hover:bg-blue-50 border h-full flex flex-col">
      <CardContent className="p-6 flex flex-col items-center text-center">
        {/* Photo or Avatar */}
        <div className="mb-4 relative w-40 h-40">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={photoAlt || member.name}
              fill
              className="rounded-full object-cover"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(member.name)}
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {member.name}
        </h3>

        {/* Title */}
        {member.title && (
          <p className="text-base text-gray-600 mb-3">
            {member.title}
          </p>
        )}

        {/* Biography */}
        {member.biography && (
          <div className="text-sm text-gray-600 line-clamp-4">
            <RichTextRenderer content={member.biography} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## Styling Approach

### Color Palette

- Primary: #004AAD (brand blue)
- Background: white (#ffffff)
- Hover background: blue-50 (#eff6ff)
- Text primary: gray-900 (#111827)
- Text secondary: gray-600 (#4b5563)
- Avatar gradient: blue-500 to blue-700

### Typography

- Heading: text-3xl font-bold
- Subheading: text-lg text-gray-600
- Member name: text-xl font-semibold
- Member title: text-base
- Biography: text-sm

### Spacing

- Section padding: py-16
- Container padding: px-4 sm:px-6 lg:px-8
- Card gap: gap-6
- Card padding: p-6
- Element margins: mb-4, mb-3, mb-1

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Performance Considerations

### Image Optimization

- Use Next.js Image component with proper sizes attribute
- Lazy load images below the fold
- Provide appropriate image dimensions (160x160 for avatars)
- Use blur placeholder for loading states

### Server-Side Rendering

- Implement as async server component
- No client-side data fetching required
- Minimal JavaScript shipped to client (only carousel interactions)

### Code Splitting

- Carousel component is client-side only (uses 'use client')
- Main block component is server-side
- Optimal bundle size with tree shaking

## Accessibility Features

### Semantic HTML

- Use proper heading hierarchy (h2 for section, h3 for names)
- Use semantic Card components
- Proper alt text for images

### Keyboard Navigation

- Carousel navigation accessible via keyboard
- Arrow keys for carousel navigation
- Tab navigation through interactive elements

### Screen Reader Support

- Proper ARIA labels on carousel controls
- Descriptive alt text for images
- Semantic structure for content hierarchy

### Color Contrast

- Ensure text meets WCAG AA standards (4.5:1 for normal text)
- Sufficient contrast for hover states
- Visible focus indicators

## Integration Points

### Payload CMS Integration

- Add block definition to Pages.tsx collection
- Follow existing block pattern with published toggle
- Use existing field types and components
- Integrate with media collection for photos

### Component Library Integration

- Use Card, CardContent from @/components/ui/card
- Use Carousel components from @/components/ui/carousel
- Use RichTextRenderer from @/components/RichTextRenderer
- Use Image from next/image

### Styling Integration

- Use Tailwind CSS utility classes
- Follow existing color scheme (#004AAD)
- Match spacing and typography patterns
- Consistent hover effects with other blocks

## Future Enhancements

Potential future improvements (not in current scope):

- Social media links for team members
- Email contact buttons
- Modal view for expanded biographies
- Team member filtering by department
- Animated entrance effects
- Video introductions
- Custom avatar colors per member
