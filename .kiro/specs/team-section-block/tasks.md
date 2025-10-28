# Implementation Plan: Team Section Block

- [x] 1. Add Team Section block definition to Payload CMS Pages collection
  - Add the teamSection block configuration to the layout blocks array in src/collections/Pages.tsx
  - Include all fields: published toggle, heading, subheading, layoutMode selector, and teamMembers array
  - Configure the teamMembers array with photo upload, name, title, and biography fields
  - Set up the rich text editor for biography with LinkFeature for internal links
  - Use existing ColorPickerField pattern for any color customization if needed
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 5.1, 5.2, 5.3_

- [ ] 2. Create TeamSectionBlock component with layout mode support
  - [x] 2.1 Create src/components/blocks/TeamSectionBlock.tsx with TypeScript interfaces
    - Define TeamSectionBlockProps interface matching the Payload block structure
    - Define TeamMember interface for type safety
    - Implement async server component function
    - Add published toggle check to conditionally render the block
    - _Requirements: 1.4, 9.2, 9.4, 9.6_

  - [ ] 2.2 Implement section header with heading and subheading
    - Render heading as h2 with proper styling (text-3xl font-bold)
    - Render optional subheading with muted color
    - Apply container and spacing classes matching project patterns
    - _Requirements: 2.1, 2.2, 9.7_

  - [ ] 2.3 Implement conditional rendering for grid vs carousel layouts
    - Check layoutMode prop to determine which layout to render
    - Create separate rendering logic for grid and carousel modes
    - Handle empty state when no team members are provided
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 3. Implement grid layout mode
  - [ ] 3.1 Create responsive grid container with Tailwind classes
    - Use grid with 1 column on mobile, 2 on tablet, 3 on desktop
    - Apply consistent gap spacing between cards
    - Map over teamMembers array to render cards

    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 3.2 Create TeamMemberCard component for grid items
    - Implement card with photo/avatar, name, title, and biography sections
    - Add hover effects with shadow and background color transitions
    - Ensure cards have equal heights using flexbox
    - Apply proper spacing and typography

    - _Requirements: 8.1, 8.2, 8.5_

- [ ] 4. Implement carousel layout mode
  - [x] 4.1 Integrate Carousel component from UI library
    - Import Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots
    - Configure carousel with loop enabled and proper alignment
    - Set responsive basis for items (1 on mobile, 2 on tablet, 3 on desktop)
    - _Requirements: 2.5, 6.1_

  - [ ] 4.2 Add carousel navigation controls
    - Include previous and next arrow buttons
    - Add dot indicators for position tracking
    - Ensure navigation buttons are properly positioned
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  - [ ] 4.3 Render TeamMemberCard components within carousel items
    - Map teamMembers to CarouselItem components

    - Reuse TeamMemberCard component from grid implementation
    - Apply proper spacing and sizing
    - _Requirements: 2.5_

- [x] 5. Implement team member card with photo and avatar fallback
  - [ ] 5.1 Create photo rendering with Next.js Image component
    - Extract photo URL and alt text from member data
    - Use Image component with fill, rounded-full, and object-cover
    - Set proper sizes attribute for optimization (160px)
    - Handle image loading with blur placeholder

    - _Requirements: 4.3, 4.4, 4.5_

  - [ ] 5.2 Create initials avatar fallback for missing photos
    - Implement getInitials helper function to extract first letters of name
    - Create circular div with gradient background (blue-500 to blue-700)
    - Display initials in white, bold, large text

    - _Requirements: 4.3_

  - [ ] 5.3 Implement member information display
    - Render name as h3 with bold styling
    - Render optional title with muted color
    - Apply proper spacing between elements

    - _Requirements: 8.5_

- [ ] 6. Implement biography rich text rendering
  - [ ] 6.1 Integrate RichTextRenderer for biography content
    - Import RichTextRenderer component
    - Pass biography data to renderer

    - Apply line-clamp-4 for text truncation
    - Style with appropriate text size and color
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7. Add hover effects and transitions
  - Apply hover:shadow-xl and hover:bg-blue-50 to cards

  - Add transition-all duration-300 for smooth animations
  - Ensure group hover effects work properly
  - Test hover states across both layout modes
  - _Requirements: 8.1, 8.2_

- [ ] 8. Implement accessibility features
  - Add proper ARIA labels to carousel navigation controls
  - Ensure semantic HTML structure with proper heading hierarchy
  - Verify keyboard navigation works in carousel mode
  - Add descriptive alt text for images
  - _Requirements: 8.3, 8.4_

- [ ] 9. Export component and integrate with page rendering
  - Add TeamSectionBlock export to src/components/blocks/index.ts
  - Verify block appears in Payload CMS admin interface
  - Test block rendering on a sample page
  - _Requirements: 9.1, 9.5_

- [ ] 10. Create test data and validate rendering
  - Create sample team members in Payload CMS with various data combinations
  - Test grid layout with 3, 6, and 9 team members
  - Test carousel layout with different numbers of members
  - Test with missing photos, titles, and biographies
  - Verify responsive behavior at mobile, tablet, and desktop breakpoints
  - Test hover effects and transitions
  - Validate rich text rendering with links
  - _Requirements: All requirements validation_
