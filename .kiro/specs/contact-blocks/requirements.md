# Requirements Document

## Introduction

This feature adds flexible contact-related blocks to the Payload CMS block system, enabling content editors to build contact pages and embed contact forms anywhere on the site. The primary focus is a reusable Contact Form Block that can be placed on any page, along with supporting blocks for displaying contact information and location details.

## Glossary

- **Contact Form Block**: A reusable content block containing a form for visitors to submit inquiries
- **Contact Info Block**: A content block displaying business contact details (phone, email, address, hours)
- **Form Submission Handler**: Server-side API endpoint that processes contact form submissions
- **CMS**: Content Management System (Payload CMS)
- **Block System**: Payload CMS's modular content architecture allowing editors to compose pages from reusable components
- **Frontend**: The Next.js application that renders pages for site visitors
- **Admin Panel**: The Payload CMS administrative interface used by content editors

## Requirements

### Requirement 1

**User Story:** As a content editor, I want to add a contact form block to any page, so that visitors can submit inquiries from multiple locations on the site

#### Acceptance Criteria

1. WHEN a content editor creates or edits a page in the Admin Panel, THE Block System SHALL include a "contactForm" block option in the available blocks list
2. THE Contact Form Block SHALL include configurable fields for heading, description, submit button text, and success message
3. THE Contact Form Block SHALL include a published toggle that defaults to true
4. THE Contact Form Block SHALL support optional configuration of which form fields to display (name, email, phone, company, subject, message)
5. THE Contact Form Block SHALL allow editors to mark individual form fields as required or optional

### Requirement 2

**User Story:** As a site visitor, I want to fill out and submit a contact form, so that I can send an inquiry to the business

#### Acceptance Criteria

1. WHEN a visitor views a page containing a published Contact Form Block, THE Frontend SHALL render a form with the configured fields
2. THE Frontend SHALL validate required fields before allowing form submission
3. THE Frontend SHALL validate email format for email fields before allowing form submission
4. WHEN a visitor submits a valid form, THE Form Submission Handler SHALL process the submission and store the data
5. WHEN form submission succeeds, THE Frontend SHALL display the configured success message to the visitor
6. WHEN form submission fails, THE Frontend SHALL display an error message to the visitor

### Requirement 3

**User Story:** As a content editor, I want to add a contact information block to pages, so that visitors can see our business contact details

#### Acceptance Criteria

1. WHEN a content editor creates or edits a page in the Admin Panel, THE Block System SHALL include a "contactInfo" block option in the available blocks list
2. THE Contact Info Block SHALL include configurable fields for heading, phone number, email address, physical address, and business hours
3. THE Contact Info Block SHALL include a published toggle that defaults to true
4. THE Contact Info Block SHALL support optional integration with the existing Map Block for displaying location
5. THE Contact Info Block SHALL allow editors to configure which contact details to display (phone, email, address, hours)

### Requirement 4

**User Story:** As a site visitor, I want to view contact information clearly, so that I can reach the business through my preferred method

#### Acceptance Criteria

1. WHEN a visitor views a page containing a published Contact Info Block, THE Frontend SHALL render the configured contact details
2. THE Frontend SHALL render phone numbers as clickable tel: links
3. THE Frontend SHALL render email addresses as clickable mailto: links
4. THE Frontend SHALL format the physical address for readability
5. WHERE business hours are configured, THE Frontend SHALL display them in a structured format

### Requirement 5

**User Story:** As a business owner, I want contact form submissions to be stored securely, so that I can review and respond to inquiries

#### Acceptance Criteria

1. WHEN a visitor submits a contact form, THE Form Submission Handler SHALL create a new record in a "contactSubmissions" collection
2. THE Form Submission Handler SHALL store the submission timestamp, form data, and visitor IP address
3. THE Admin Panel SHALL provide a "Contact Submissions" collection interface for viewing submissions
4. THE Admin Panel SHALL display submissions in reverse chronological order (newest first)
5. THE Admin Panel SHALL allow administrators to mark submissions as read or archived

### Requirement 6

**User Story:** As a content editor, I want contact blocks to follow the same patterns as existing blocks, so that the interface is consistent and familiar

#### Acceptance Criteria

1. THE Contact Form Block SHALL follow the same configuration pattern as existing blocks (published toggle, heading, description)
2. THE Contact Info Block SHALL follow the same configuration pattern as existing blocks (published toggle, heading)
3. THE Contact Form Block component SHALL use the same styling system as existing blocks (Tailwind CSS, Figtree font)
4. THE Contact Info Block component SHALL use the same styling system as existing blocks (Tailwind CSS, Figtree font)
5. THE Contact Form Block SHALL integrate with existing UI components (Button, Input, Label from shadcn/ui)
