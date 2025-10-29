# Implementation Plan: Block Anchor IDs

- [x] 1. Add anchorId field to all block definitions in Pages collection
  - Add the `anchorId` field configuration to each of the 11 block types in `src/collections/Pages.tsx`
  - Include validation regex to enforce lowercase letters, numbers, and hyphens only
  - Add helpful admin descriptions and placeholders
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement uniqueness validation for anchor IDs
  - Add a `beforeValidate` hook to the Pages collection
  - Check for duplicate anchor IDs within the same page
  - Throw descriptive error messages listing which blocks have duplicate IDs
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Update block component interfaces and rendering
  - [x] 3.1 Update FormBuilderBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost `<section>` element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.2 Update ContactInfoBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost `<section>` element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.3 Update HeroBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.4 Update RibbonBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.5 Update NavbarBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.6 Update FranchiseGridBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.7 Update BlogHighlightsBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.8 Update MapBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.9 Update AboutTeaserBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.10 Update CallToActionBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

  - [x] 3.11 Update TeamSectionBlock component
    - Add `anchorId` to the block props interface
    - Apply `id` attribute to the outermost container element
    - _Requirements: 3.4, 4.1, 4.2, 4.3_

- [x] 4. Add smooth scrolling CSS
  - Add `scroll-behavior: smooth` to global styles for enhanced UX
  - Ensure it doesn't conflict with existing styles
  - _Requirements: 3.2_

- [x] 5. Verify and regenerate TypeScript types
  - Run Payload to regenerate `src/payload-types.ts` with the new anchorId field
  - Verify no TypeScript errors in block components
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
