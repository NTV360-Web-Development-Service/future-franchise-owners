# Requirements Document

## Introduction

This feature adds support for anchor IDs on all page blocks, enabling fragment navigation (e.g., `/contact#contact-form`). Users will be able to set custom IDs for blocks in the CMS, and the frontend will render these as HTML `id` attributes, allowing smooth scrolling to specific sections via URL fragments or anchor links.

## Glossary

- **Block**: A reusable content component in the CMS (e.g., Hero, FormBuilder, ContactInfo, FranchiseGrid)
- **Fragment**: The portion of a URL after the `#` symbol (e.g., `#contact-form` in `/contact#contact-form`)
- **Anchor ID**: An HTML `id` attribute that serves as a navigation target for URL fragments
- **CMS**: Content Management System (Payload CMS)
- **Frontend**: The Next.js application that renders pages for visitors

## Requirements

### Requirement 1

**User Story:** As a content editor, I want to assign custom anchor IDs to blocks, so that I can create direct links to specific sections of a page

#### Acceptance Criteria

1. WHEN a content editor creates or edits any block in the CMS, THE CMS SHALL display an optional "Anchor ID" text field
2. THE CMS SHALL validate that the Anchor ID contains only lowercase letters, numbers, and hyphens
3. THE CMS SHALL display a helper description explaining the purpose and format of anchor IDs
4. THE CMS SHALL allow the Anchor ID field to remain empty (optional)
5. THE CMS SHALL auto-generate a suggested anchor ID based on the block type and heading when the field is empty

### Requirement 2

**User Story:** As a content editor, I want to see a preview of how the anchor link will look, so that I can verify it will work correctly

#### Acceptance Criteria

1. WHEN a content editor enters an anchor ID value, THE CMS SHALL display a preview showing the full URL with fragment (e.g., `/contact#contact-form`)
2. THE CMS SHALL update the preview in real-time as the editor types
3. THE CMS SHALL show the preview below the anchor ID input field

### Requirement 3

**User Story:** As a website visitor, I want to navigate directly to a specific section using a URL fragment, so that I can quickly access the content I need

#### Acceptance Criteria

1. WHEN a visitor navigates to a URL with a fragment (e.g., `/contact#contact-form`), THE Frontend SHALL scroll to the block with the matching anchor ID
2. THE Frontend SHALL apply smooth scrolling behavior when navigating to the anchor
3. WHEN no matching anchor ID exists, THE Frontend SHALL load the page normally at the top
4. THE Frontend SHALL render the anchor ID as an HTML `id` attribute on the block's container element

### Requirement 4

**User Story:** As a developer, I want all blocks to support anchor IDs consistently, so that the feature works uniformly across the entire site

#### Acceptance Criteria

1. THE CMS SHALL add the anchor ID field to all existing block types (franchiseGrid, ribbon, navbar, hero, aboutTeaser, callToAction, blogHighlights, map, teamSection, formBuilder, contactInfo)
2. THE Frontend SHALL render the anchor ID for all block types that have one defined
3. THE Frontend SHALL ensure the anchor ID is applied to the outermost container element of each block
4. WHEN a block has no anchor ID defined, THE Frontend SHALL not render an `id` attribute

### Requirement 5

**User Story:** As a content editor, I want to ensure anchor IDs are unique within a page, so that navigation works correctly without conflicts

#### Acceptance Criteria

1. WHEN a content editor saves a page, THE CMS SHALL validate that all anchor IDs within that page are unique
2. IF duplicate anchor IDs exist on the same page, THEN THE CMS SHALL display a validation error preventing the save
3. THE CMS SHALL display which blocks have duplicate IDs in the error message
4. THE CMS SHALL allow the same anchor ID to be used on different pages
