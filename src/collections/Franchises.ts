import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'
// Lightweight slugify helper to avoid extra deps
const toSlug = (input: string): string =>
  (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Franchises: CollectionConfig = {
  slug: 'franchises',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'businessName',
    description: 'Manage dynamic franchise listings and their metadata.',
    // Ensure the admin list does not show the legacy `slug` column
    defaultColumns: ['businessName', 'category', 'status', 'updatedAt'],
  },
  // No slug auto-generation; prefer ID-only URLs
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => uuidv7(),
      admin: { hidden: true },
    },
    {
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
        description: 'Optional legacy URL identifier (hidden; ID is primary)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Publish lifecycle status',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured (editorial highlight)',
        position: 'sidebar',
      },
    },
    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as sponsored (paid promotion)',
        position: 'sidebar',
      },
    },
    {
      name: 'isTopPick',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as a top pick to highlight across the site',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed description using the rich text editor',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Fitness', value: 'Fitness' },
        { label: 'Food and Beverage', value: 'Food and Beverage' },
        { label: 'Health and Wellness', value: 'Health and Wellness' },
        { label: 'Home Services', value: 'Home Services' },
        { label: 'Senior Care', value: 'Senior Care' },
        { label: 'Sports', value: 'Sports' },
      ],
      admin: {
        description: 'Primary business category',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Classification tags (e.g., Low Cost, Home Based)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'investment',
      type: 'group',
      admin: {
        description: 'Initial investment range',
      },
      fields: [
        { name: 'min', type: 'number' },
        { name: 'max', type: 'number' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Franchise logo or primary image',
      },
    },
  ],
}

export default Franchises