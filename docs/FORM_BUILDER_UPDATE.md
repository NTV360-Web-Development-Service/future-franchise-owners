# Form Builder Block - Redesign Update

## Overview

Redesigned the contact form block into a flexible **Form Builder Block** that allows content editors to create custom forms with any fields they need, with better visual layout options.

## Key Improvements

### 1. Dynamic Field Configuration

Instead of fixed checkboxes for predefined fields, editors can now:

- **Add any number of fields** (up to 20)
- **Choose field types**: Text, Email, Phone, Number, Text Area, Select Dropdown
- **Customize labels and placeholders** for each field
- **Set field names** for data collection
- **Mark fields as required or optional**
- **Drag to reorder** fields

### 2. Better Layout Options

Each field can now have a width setting:

- **Full Width** - Takes up the entire row
- **Half Width** - Two fields side-by-side on desktop
- **One Third** - Three fields side-by-side on desktop

This creates much more professional-looking forms with better use of space.

### 3. Select Dropdown Support

Added support for dropdown fields with custom options:

- Define multiple options with labels and values
- Perfect for "How did you hear about us?" or "Service Interest" fields

## Block Configuration

### In CMS Admin Panel

When adding a "Form Builder" block, editors can configure:

1. **Basic Settings:**
   - Heading (e.g., "Get in Touch")
   - Description (optional intro text)
   - Submit Button Text
   - Success Message

2. **Form Fields (Array):**
   Each field has:
   - **Field Type**: Text, Email, Phone, Number, Text Area, or Select
   - **Label**: Display name (e.g., "Full Name")
   - **Name**: Data field name (e.g., "fullName")
   - **Placeholder**: Optional hint text
   - **Required**: Toggle for required validation
   - **Width**: Full, Half, or One Third
   - **Options**: For select dropdowns only

## Example Form Configurations

### Simple Contact Form

```
1. Full Name (text, full width, required)
2. Email (email, full width, required)
3. Message (textarea, full width, required)
```

### Professional Inquiry Form

```
1. First Name (text, half width, required)
2. Last Name (text, half width, required)
3. Email (email, half width, required)
4. Phone (tel, half width, optional)
5. Company (text, full width, optional)
6. How did you hear about us? (select, full width, required)
   - Google Search
   - Social Media
   - Referral
   - Other
7. Message (textarea, full width, required)
```

### Detailed Application Form

```
1. First Name (text, third width, required)
2. Middle Name (text, third width, optional)
3. Last Name (text, third width, required)
4. Email (email, half width, required)
5. Phone (tel, half width, required)
6. Street Address (text, full width, required)
7. City (text, third width, required)
8. State (text, third width, required)
9. ZIP Code (text, third width, required)
10. Investment Budget (select, full width, required)
    - Under $50k
    - $50k - $100k
    - $100k - $250k
    - Over $250k
11. Additional Information (textarea, full width, optional)
```

## Visual Improvements

### Before (Old ContactFormBlock)

- All fields were full width
- Fixed field set (name, email, phone, company, subject, message)
- Generic appearance
- Lots of vertical scrolling

### After (New FormBuilderBlock)

- Fields can be side-by-side (half or third width)
- Completely customizable field set
- Form has a subtle background (gray-50) with shadow
- Better visual hierarchy
- More compact and professional

### Layout Example

```
┌─────────────────────────────────────────────┐
│              Get in Touch                    │
│     We'd love to hear from you!             │
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐        │
│  │ First Name * │  │ Last Name *  │        │
│  └──────────────┘  └──────────────┘        │
│  ┌─────────────────────────────────┐       │
│  │ Email Address *                 │       │
│  └─────────────────────────────────┘       │
│  ┌─────────────────────────────────┐       │
│  │ Message *                       │       │
│  │                                 │       │
│  │                                 │       │
│  └─────────────────────────────────┘       │
│  ┌─────────────────────────────────┐       │
│  │      Send Message               │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

## Technical Changes

### Files Modified

- `src/collections/Pages.tsx` - Changed `contactForm` to `formBuilder` with new schema
- `src/components/blocks/FormBuilderBlock.tsx` - New component (replaced ContactFormBlock)
- `src/components/blocks/index.ts` - Updated exports
- `src/app/(frontend)/[slug]/page.tsx` - Updated block rendering
- `src/app/(frontend)/page.tsx` - Updated block rendering

### Files Deleted

- `src/components/blocks/ContactFormBlock.tsx` - Replaced by FormBuilderBlock

### Key Features

- **Responsive Grid Layout**: Uses flexbox with negative margins for proper spacing
- **Width Classes**: `w-full md:w-1/2` and `w-full md:w-1/3` for responsive behavior
- **Form Background**: Gray-50 background with padding and shadow for visual separation
- **Native Select**: Uses styled native select element for better compatibility
- **Validation**: Email validation, required field checking, real-time error clearing
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly

## Migration Notes

### For Existing Pages

If you have pages using the old `contactForm` block:

1. They will need to be updated to use the new `formBuilder` block
2. You'll need to recreate the fields using the new array-based configuration
3. The new system is more flexible and will allow better layouts

### Benefits of Migration

- More professional appearance
- Better use of horizontal space
- Ability to add custom fields
- Support for dropdown selections
- Easier to create different forms for different purposes

## Testing Checklist

- [ ] Create a simple 3-field form (name, email, message)
- [ ] Test half-width fields side-by-side
- [ ] Test third-width fields (3 across)
- [ ] Test select dropdown with options
- [ ] Test form validation (required fields)
- [ ] Test email validation
- [ ] Test form submission
- [ ] Test responsive behavior on mobile
- [ ] Test with different field combinations
- [ ] Verify form data is captured correctly

## Next Steps

1. Start dev server: `pnpm dev`
2. Go to admin panel and create a test page
3. Add a "Form Builder" block
4. Configure fields with different widths
5. Test the form on the frontend
6. Verify submissions are stored in Contact Submissions collection
