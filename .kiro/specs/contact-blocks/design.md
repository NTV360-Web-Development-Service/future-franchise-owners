# Design Document: Contact Blocks

## Overview

This design implements two reusable contact-related blocks for the Payload CMS block system: a Contact Form Block and a Contact Info Block. These blocks follow the existing architectural patterns established in the codebase, using Payload CMS for content management, Next.js for rendering, and shadcn/ui components for the UI.

The Contact Form Block provides a flexible, configurable form that can be embedded on any page, allowing visitors to submit inquiries. The Contact Info Block displays business contact details in a structured, accessible format. Both blocks integrate seamlessly with the existing block system and follow the same configuration patterns as other blocks (published toggle, heading, description).

A new `contactSubmissions` collection will store form submissions in Payload CMS, allowing administrators to review and manage inquiries through the admin panel. The design leverages the existing contact API endpoint pattern for form submission handling.

## Architecture

### System Components

The contact blocks feature consists of four main components:

1. **Payload CMS Block Definitions** - Configuration schemas for the Contact Form and Contact Info blocks in the Pages collection
2. **React Block Components** - Frontend components that render the blocks (`ContactFormBlock.tsx`, `ContactInfoBlock.tsx`)
3. **Contact Submissions Collection** - Payload CMS collection for storing form submissions
4. **Form Submission Handler** - Server-side API endpoint for processing contact form submissions (extends existing `/api/contact` route)

### Data Flow

```
User fills form → ContactFormBlock validates → POST to /api/contact →
Store in contactSubmissions collection → Return success/error →
Display feedback to user
```

### Integration Points

- **Pages Collection**: Add `contactForm` and `contactInfo` block definitions to the existing blocks array
- **Block Components**: Create new components following the pattern of `CallToActionBlock.tsx` and `MapBlock.tsx`
- **API Routes**: Extend the existing `/api/contact/route.ts` to handle contact form submissions
- **Collections**: Create new `ContactSubmissions` collection alongside existing collections

## Components and Interfaces

### 1. Contact Form Block (Payload CMS Schema)

**Location**: `src/collections/Pages.tsx` (add to blocks array)

**Block Configuration**:

```typescript
{
  slug: 'contactForm',
  fields: [
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
        position: 'sidebar',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      defaultValue: 'Get in Touch',
      admin: {
        description: 'Form section heading',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description text above the form',
      },
    },
    {
      name: 'submitButtonText',
      type: 'text',
      required: false,
      defaultValue: 'Send Message',
      admin: {
        description: 'Text for the submit button',
      },
    },
    {
      name: 'successMessage',
      type: 'text',
      required: false,
      defaultValue: 'Thank you! We\'ll get back to you soon.',
      admin: {
        description: 'Message displayed after successful submission',
      },
    },
    {
      name: 'formFields',
      type: 'group',
      fields: [
        {
          name: 'showName',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show name field' },
        },
        {
          name: 'nameRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Make name field required',
            condition: (data, siblingData) => siblingData?.showName === true,
          },
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show email field' },
        },
        {
          name: 'emailRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Make email field required',
            condition: (data, siblingData) => siblingData?.showEmail === true,
          },
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show phone field' },
        },
        {
          name: 'phoneRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make phone field required',
            condition: (data, siblingData) => siblingData?.showPhone === true,
          },
        },
        {
          name: 'showCompany',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show company field' },
        },
        {
          name: 'companyRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make company field required',
            condition: (data, siblingData) => siblingData?.showCompany === true,
          },
        },
        {
          name: 'showSubject',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show subject field' },
        },
        {
          name: 'subjectRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make subject field required',
            condition: (data, siblingData) => siblingData?.showSubject === true,
          },
        },
        {
          name: 'showMessage',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show message field' },
        },
        {
          name: 'messageRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Make message field required',
            condition: (data, siblingData) => siblingData?.showMessage === true,
          },
        },
      ],
      admin: {
        description: 'Configure which form fields to display and whether they are required',
      },
    },
  ],
}
```

**Design Rationale**: This configuration follows the established pattern of other blocks with a `published` toggle, heading, and description. The `formFields` group provides granular control over which fields appear and their required status, giving content editors flexibility to create different types of contact forms (simple inquiry, detailed contact, etc.).

### 2. Contact Info Block (Payload CMS Schema)

**Location**: `src/collections/Pages.tsx` (add to blocks array)

**Block Configuration**:

```typescript
{
  slug: 'contactInfo',
  fields: [
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: '✅ Published | ⬜ Unpublished (hidden from visitors)',
        position: 'sidebar',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      defaultValue: 'Contact Information',
      admin: {
        description: 'Section heading',
      },
    },
    {
      name: 'contactDetails',
      type: 'group',
      fields: [
        {
          name: 'showPhone',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Display phone number' },
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          admin: {
            description: 'Phone number (e.g., "(555) 123-4567")',
            condition: (data, siblingData) => siblingData?.showPhone === true,
          },
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Display email address' },
        },
        {
          name: 'email',
          type: 'text',
          required: false,
          admin: {
            description: 'Email address',
            condition: (data, siblingData) => siblingData?.showEmail === true,
          },
        },
        {
          name: 'showAddress',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Display physical address' },
        },
        {
          name: 'address',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Physical address (use line breaks for formatting)',
            condition: (data, siblingData) => siblingData?.showAddress === true,
          },
        },
        {
          name: 'showHours',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Display business hours' },
        },
        {
          name: 'hours',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Business hours (use line breaks for formatting)',
            condition: (data, siblingData) => siblingData?.showHours === true,
          },
        },
      ],
      admin: {
        description: 'Configure contact details to display',
      },
    },
    {
      name: 'showMap',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Display map below contact information',
      },
    },
    {
      name: 'mapUrl',
      type: 'text',
      required: false,
      admin: {
        description: 'Google Maps embed URL',
        condition: (data, siblingData) => siblingData?.showMap === true,
      },
    },
    {
      name: 'mapHeight',
      type: 'number',
      required: false,
      defaultValue: 300,
      min: 200,
      max: 600,
      admin: {
        description: 'Map height in pixels (200-600)',
        condition: (data, siblingData) => siblingData?.showMap === true,
      },
    },
  ],
}
```

**Design Rationale**: The Contact Info Block provides flexible display options for contact details with show/hide toggles for each section. The optional map integration reuses the existing map embed pattern from `MapBlock.tsx`. This allows editors to create simple contact info displays or comprehensive contact sections with location maps.

### 3. ContactFormBlock Component

**Location**: `src/components/blocks/ContactFormBlock.tsx`

**Component Interface**:

```typescript
export interface ContactFormBlockProps {
  block: {
    blockType: 'contactForm'
    published?: boolean
    heading?: string | null
    description?: string | null
    submitButtonText?: string | null
    successMessage?: string | null
    formFields?: {
      showName?: boolean
      nameRequired?: boolean
      showEmail?: boolean
      emailRequired?: boolean
      showPhone?: boolean
      phoneRequired?: boolean
      showCompany?: boolean
      companyRequired?: boolean
      showSubject?: boolean
      subjectRequired?: boolean
      showMessage?: boolean
      messageRequired?: boolean
    } | null
    id?: string | null
    blockName?: string | null
  }
}
```

**Key Features**:

- Client-side form validation (required fields, email format)
- Loading state during submission
- Success/error message display
- Responsive layout using Tailwind CSS
- Accessibility features (proper labels, ARIA attributes)
- Uses shadcn/ui components (Input, Label, Button)

**Design Rationale**: The component follows the pattern of `CallToActionBlock.tsx` with proper TypeScript interfaces, default values, and responsive design. Client-side validation provides immediate feedback before API submission. The component uses React hooks for state management (form data, loading, success/error states).

### 4. ContactInfoBlock Component

**Location**: `src/components/blocks/ContactInfoBlock.tsx`

**Component Interface**:

```typescript
export interface ContactInfoBlockProps {
  block: {
    blockType: 'contactInfo'
    published?: boolean
    heading?: string | null
    contactDetails?: {
      showPhone?: boolean
      phone?: string | null
      showEmail?: boolean
      email?: string | null
      showAddress?: boolean
      address?: string | null
      showHours?: boolean
      hours?: string | null
    } | null
    showMap?: boolean
    mapUrl?: string | null
    mapHeight?: number | null
    id?: string | null
    blockName?: string | null
  }
}
```

**Key Features**:

- Clickable phone links (`tel:` protocol)
- Clickable email links (`mailto:` protocol)
- Formatted address display with line breaks
- Optional map embed (reuses MapBlock pattern)
- Icon-based visual design (using lucide-react icons)
- Responsive grid layout

**Design Rationale**: The component provides a clean, accessible display of contact information with proper semantic HTML. Phone and email links enable one-click communication on mobile devices. The optional map integration allows for comprehensive contact pages without requiring a separate map block.

### 5. Contact Submissions Collection

**Location**: `src/collections/ContactSubmissions.ts` (new file)

**Collection Schema**:

```typescript
import { CollectionConfig } from 'payload'

const ContactSubmissions: CollectionConfig = {
  slug: 'contactSubmissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'status'],
  },
  access: {
    read: () => true, // Admins only (default)
    create: () => true, // API can create
    update: () => true, // Admins only
    delete: () => true, // Admins only
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      admin: {
        description: 'Submitter name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      admin: {
        description: 'Submitter email',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      admin: {
        description: 'Submitter phone number',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: false,
      admin: {
        description: 'Company name',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: false,
      admin: {
        description: 'Message subject',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Message content',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      required: false,
      admin: {
        description: 'Submitter IP address',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Submission status',
      },
    },
  ],
  timestamps: true,
}

export default ContactSubmissions
```

**Design Rationale**: The collection stores all form submissions with flexible field support (not all fields are required since forms can be configured differently). The `status` field allows administrators to track which submissions have been reviewed. Timestamps are automatically managed by Payload CMS. The collection follows the same pattern as other collections in the codebase.

### 6. Form Submission API Handler

**Location**: `src/app/api/contact/route.ts` (extend existing)

**API Extension**:
The existing `/api/contact` route will be extended to:

1. Accept additional fields (phone, company, subject)
2. Store submissions in the `contactSubmissions` collection
3. Extract and store the visitor's IP address
4. Return appropriate success/error responses

**Request Body**:

```typescript
{
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  franchiseId?: string // Existing field for franchise-specific forms
}
```

**Response**:

```typescript
// Success
{ ok: true, submissionId: string }

// Error
{ error: string }
```

**Design Rationale**: Extending the existing contact API maintains consistency with the current architecture. The API stores submissions in Payload CMS for easy management while maintaining the existing webhook/email routing logic for franchise-specific inquiries. IP address capture provides basic security and analytics capabilities.

## Data Models

### Contact Form Submission

```typescript
interface ContactSubmission {
  id: string
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  ipAddress?: string
  status: 'new' | 'read' | 'archived'
  createdAt: string
  updatedAt: string
}
```

### Contact Form Block Data

```typescript
interface ContactFormBlock {
  blockType: 'contactForm'
  published: boolean
  heading?: string
  description?: string
  submitButtonText?: string
  successMessage?: string
  formFields?: {
    showName?: boolean
    nameRequired?: boolean
    showEmail?: boolean
    emailRequired?: boolean
    showPhone?: boolean
    phoneRequired?: boolean
    showCompany?: boolean
    companyRequired?: boolean
    showSubject?: boolean
    subjectRequired?: boolean
    showMessage?: boolean
    messageRequired?: boolean
  }
}
```

### Contact Info Block Data

```typescript
interface ContactInfoBlock {
  blockType: 'contactInfo'
  published: boolean
  heading?: string
  contactDetails?: {
    showPhone?: boolean
    phone?: string
    showEmail?: boolean
    email?: string
    showAddress?: boolean
    address?: string
    showHours?: boolean
    hours?: string
  }
  showMap?: boolean
  mapUrl?: string
  mapHeight?: number
}
```

## Error Handling

### Client-Side Validation

**ContactFormBlock Component**:

- Required field validation before submission
- Email format validation using regex pattern
- Display inline error messages for invalid fields
- Disable submit button during validation errors

**Error States**:

```typescript
{
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
}
```

### Server-Side Error Handling

**API Route** (`/api/contact`):

- Validate request body structure
- Handle database connection errors
- Handle Payload CMS operation errors
- Return appropriate HTTP status codes:
  - 200: Success
  - 400: Invalid request body
  - 500: Server error
  - 502: Webhook failure (existing)

**Error Response Format**:

```typescript
{
  error: string // User-friendly error message
}
```

### User Feedback

**Success State**:

- Display success message from block configuration
- Clear form fields
- Show success indicator (green checkmark icon)

**Error State**:

- Display generic error message: "Something went wrong. Please try again."
- Keep form data intact
- Show error indicator (red alert icon)
- Log detailed error to console for debugging

**Design Rationale**: Client-side validation provides immediate feedback and reduces unnecessary API calls. Server-side validation ensures data integrity. User-friendly error messages avoid exposing technical details while console logging aids debugging.

## Testing Strategy

### Unit Testing

**Components**:

- Test ContactFormBlock renders with different field configurations
- Test ContactInfoBlock renders with different contact detail combinations
- Test form validation logic (required fields, email format)
- Test conditional field rendering based on configuration

**API Route**:

- Test successful submission creates database record
- Test validation rejects invalid data
- Test error handling for database failures
- Test IP address extraction

### Integration Testing

**Form Submission Flow**:

- Test complete submission flow from form to database
- Test success message display after submission
- Test error message display on failure
- Test form reset after successful submission

**Block Rendering**:

- Test blocks render correctly on pages
- Test published/unpublished toggle functionality
- Test responsive layout on different screen sizes

### Manual Testing Checklist

- [ ] Contact Form Block appears in block selector
- [ ] Contact Info Block appears in block selector
- [ ] Form submits successfully with valid data
- [ ] Form shows validation errors for invalid data
- [ ] Success message displays after submission
- [ ] Submissions appear in admin panel
- [ ] Contact info displays correctly with all fields
- [ ] Phone and email links work correctly
- [ ] Map displays when enabled
- [ ] Blocks respect published toggle
- [ ] Responsive design works on mobile/tablet/desktop

**Design Rationale**: Testing focuses on core functionality and user experience. Unit tests ensure individual components work correctly. Integration tests verify the complete user flow. Manual testing validates the end-to-end experience in the actual CMS and frontend environment.

## Design Decisions and Rationales

### 1. Flexible Form Field Configuration

**Decision**: Allow editors to show/hide individual form fields and configure their required status.

**Rationale**: Different pages may need different types of contact forms (simple inquiry vs. detailed contact). This flexibility eliminates the need for multiple form block types and gives editors control over the user experience.

### 2. Separate Contact Info Block

**Decision**: Create a separate block for displaying contact information rather than combining it with the form.

**Rationale**: Separation of concerns allows editors to use contact info independently (e.g., in a footer or sidebar) and provides more layout flexibility. Editors can combine both blocks on a contact page or use them separately.

### 3. Store Submissions in Payload CMS

**Decision**: Store form submissions in a Payload CMS collection rather than only sending emails/webhooks.

**Rationale**: Storing submissions provides a permanent record, allows for status tracking (new/read/archived), and ensures no inquiries are lost due to email delivery issues. Administrators can review submissions directly in the CMS.

### 4. Extend Existing Contact API

**Decision**: Extend the existing `/api/contact` route rather than creating a new endpoint.

**Rationale**: Maintains consistency with the existing architecture and reuses the established webhook/email routing logic. The existing route already handles franchise-specific routing, which may be useful for future enhancements.

### 5. Optional Map Integration in Contact Info Block

**Decision**: Include optional map embed in the Contact Info Block rather than requiring a separate Map Block.

**Rationale**: Contact pages commonly show location information alongside contact details. The optional integration provides convenience while maintaining flexibility (editors can still use a separate Map Block if preferred).

### 6. Client-Side Validation

**Decision**: Implement validation on the client side before API submission.

**Rationale**: Provides immediate feedback to users, reduces unnecessary API calls, and improves user experience. Server-side validation still occurs for security, but client-side validation catches most errors early.

### 7. Status Field for Submissions

**Decision**: Include a status field (new/read/archived) in the submissions collection.

**Rationale**: Allows administrators to track which submissions have been reviewed and organize their workflow. This is a common requirement for managing inquiries and prevents duplicate responses.

### 8. Figtree Font and Tailwind CSS

**Decision**: Use the existing Figtree font and Tailwind CSS styling system.

**Rationale**: Maintains visual consistency with other blocks in the system. The design follows the established patterns from `CallToActionBlock`, `MapBlock`, and other existing blocks.

### 9. Shadcn/ui Components

**Decision**: Use existing shadcn/ui components (Input, Label, Button) for the form.

**Rationale**: Ensures consistency with the existing UI component library, reduces development time, and maintains accessibility standards already implemented in these components.

### 10. IP Address Capture

**Decision**: Capture and store the visitor's IP address with each submission.

**Rationale**: Provides basic security (spam detection, abuse prevention) and analytics capabilities. The IP address is stored but not displayed to visitors, maintaining privacy while enabling administrative oversight
