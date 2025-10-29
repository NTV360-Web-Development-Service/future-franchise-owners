# Database Migration - Contact Form to Form Builder

## What Happened

The contact form block was redesigned from a fixed-field form (`contactForm`) to a flexible form builder (`formBuilder`). This required a database schema change.

## Migration Performed

**Date:** October 29, 2024  
**Command:** `pnpm payload migrate:fresh`

This command:

1. Dropped the old database tables
2. Recreated all tables with the new schema
3. Applied all migrations including the new `formBuilder` block structure

## Changes

### Old Structure (contactForm)

- Fixed fields with show/hide toggles
- Table: `pages_blocks_contact_form`
- Limited to predefined fields (name, email, phone, company, subject, message)

### New Structure (formBuilder)

- Dynamic field array
- Table: `pages_blocks_form_builder`
- Supports any custom fields with configurable types and widths
- Nested table: `pages_blocks_form_builder_form_fields`
- Nested table: `pages_blocks_form_builder_form_fields_options` (for select dropdowns)

## Impact

⚠️ **Data Loss:** Any existing pages with the old `contactForm` block were removed during the migration.

## Next Steps

1. Recreate any contact pages using the new Form Builder block
2. Configure custom fields as needed
3. Test form submissions

## Benefits of New System

- ✅ Completely flexible field configuration
- ✅ Side-by-side field layouts (half/third width)
- ✅ Support for select dropdowns
- ✅ Better visual design
- ✅ Drag-to-reorder fields
- ✅ Custom field names for data collection

## Rollback

If you need to rollback, you would need to:

1. Revert the code changes in `src/collections/Pages.tsx`
2. Restore the old `ContactFormBlock.tsx` component
3. Run `pnpm payload migrate:fresh` again

However, this is not recommended as the new system is more flexible and powerful.
