# Implementation Plan: Contact Blocks

- [x] 1. Create Contact Submissions collection
  - Create `src/collections/ContactSubmissions.ts` with schema for storing form submissions
  - Include fields: name, email, phone, company, subject, message, ipAddress, status
  - Add timestamps and admin configuration
  - Configure access controls for admin-only management
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. Register Contact Submissions collection in Payload config
  - Import ContactSubmissions collection in `src/payload.config.ts`
  - Add to collections array
  - Verify collection appears in admin panel
  - _Requirements: 5.3_

- [x] 3. Add Contact Form Block definition to Pages collection
  - Add `contactForm` block to the blocks array in `src/collections/Pages.tsx`
  - Configure published toggle, heading, description, submitButtonText, successMessage fields
  - Implement formFields group with show/required toggles for name, email, phone, company, subject, message
  - Add conditional logic for required field toggles
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2_

- [x] 4. Add Contact Info Block definition to Pages collection
  - Add `contactInfo` block to the blocks array in `src/collections/Pages.tsx`
  - Configure published toggle, heading fields
  - Implement contactDetails group with show/hide toggles for phone, email, address, hours
  - Add optional map integration fields (showMap, mapUrl, mapHeight)
  - Add conditional logic for contact detail fields
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2_

- [x] 5. Create ContactFormBlock component

- [x] 5.1 Create component file and basic structure
  - Create `src/components/blocks/ContactFormBlock.tsx`
  - Define TypeScript interface for ContactFormBlockProps
  - Implement component skeleton with props destructuring and default values
  - _Requirements: 1.1, 6.3, 6.5_

- [x] 5.2 Implement form state management and validation
  - Add React state hooks for form data, loading, success, and error states
  - Implement client-side validation for required fields
  - Add email format validation using regex
  - Create validation error state management
  - _Requirements: 2.2, 2.3_

- [x] 5.3 Build form UI with conditional field rendering
  - Render heading and description
  - Conditionally render form fields based on formFields configuration
  - Use shadcn/ui Input, Label components for form fields
  - Implement textarea for message field
  - Add submit button with loading state
  - Apply Tailwind CSS styling and Figtree font
  - _Requirements: 2.1, 6.3, 6.5_

- [x] 5.4 Implement form submission handler
  - Create handleSubmit function with validation
  - Make POST request to `/api/contact` endpoint
  - Handle loading state during submission
  - Process success response and display success message
  - Handle error response and display error message
  - Clear form on successful submission
  - _Requirements: 2.4, 2.5, 2.6_

- [x] 5.5 Add accessibility features
  - Add proper ARIA labels and attributes
  - Ensure keyboard navigation works correctly
  - Add focus management for error states
  - Include screen reader announcements for success/error messages
  - _Requirements: 2.1_

- [x] 6. Create ContactInfoBlock component

- [x] 6.1 Create component file and basic structure
  - Create `src/components/blocks/ContactInfoBlock.tsx`
  - Define TypeScript interface for ContactInfoBlockProps
  - Implement component skeleton with props destructuring and default values
  - _Requirements: 3.1, 6.4, 6.5_

- [x] 6.2 Implement contact details rendering
  - Render heading
  - Conditionally render phone number with tel: link
  - Conditionally render email with mailto: link
  - Conditionally render formatted address with line breaks
  - Conditionally render business hours with line breaks
  - Add lucide-react icons for visual enhancement
  - Apply Tailwind CSS styling and Figtree font
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.4_

- [x] 6.3 Add optional map integration
  - Conditionally render map iframe when showMap is enabled
  - Reuse map embed pattern from MapBlock
  - Apply configurable map height
  - Add proper iframe attributes for accessibility
  - _Requirements: 3.4_

- [x] 7. Extend contact API route for form submissions
  - Modify `src/app/api/contact/route.ts` to accept additional fields (phone, company, subject)
  - Extract visitor IP address from request headers
  - Create submission record in contactSubmissions collection using Payload API
  - Return submission ID in success response
  - Maintain existing webhook/email routing logic
  - Add error handling for database operations
  - _Requirements: 5.1, 5.2_

- [x] 8. Register block components in the rendering system
  - Import ContactFormBlock and ContactInfoBlock in `src/components/blocks/index.ts`
  - Export components for use in page rendering
  - Add block type mappings if needed in page rendering logic
  - _Requirements: 2.1, 4.1_

- [x] 9. Update Payload types
  - Run `pnpm payload generate:types` to regenerate TypeScript types
  - Verify new block types and collection types are generated correctly
  - Fix any type errors in components
  - _Requirements: All_

## Testing Tasks (Ready for Manual Testing)

- [ ] 10. Verify blocks appear in CMS admin panel
  - Start development server
  - Log into Payload CMS admin panel
  - Create or edit a page
  - Verify "Form Builder" block appears in block selector
  - Verify "Contact Info" block appears in block selector
  - Verify all configuration fields are present and functional
  - _Requirements: 1.1, 3.1_

- [ ] 11. Test Form Builder Block functionality
  - Add Form Builder Block to a test page
  - Configure form with different field combinations
  - Test form submission with valid data
  - Verify submission appears in Contact Submissions collection
  - Test validation errors for required fields
  - Test email format validation
  - Test success message display
  - Test error handling for API failures
  - Test half-width and third-width field layouts
  - Test select dropdown fields
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 12. Test Contact Info Block functionality
  - Add Contact Info Block to a test page
  - Configure with different contact detail combinations
  - Verify phone link works (tel: protocol)
  - Verify email link works (mailto: protocol)
  - Test address formatting with line breaks
  - Test business hours display
  - Test optional map integration
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 13. Test responsive design and accessibility
  - Test both blocks on mobile, tablet, and desktop viewports
  - Verify form is usable on touch devices
  - Test keyboard navigation through form fields
  - Verify screen reader compatibility
  - Test with browser accessibility tools
  - _Requirements: 2.1, 4.1_

---

## ✅ Implementation Complete

All development tasks (1-9) are complete. The Form Builder and Contact Info blocks are ready for testing and deployment.
