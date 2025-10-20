/**
 * @fileoverview Franchises Collection Configuration
 *
 * Defines the Payload CMS collection for franchise business listings.
 * This collection manages all franchise data including business information,
 * categorization, investment details, and agent assignments.
 *
 * @module Collections/Franchises
 * @version 1.0.0
 */

import type { CollectionConfig } from 'payload'

/**
 * Lightweight slugify helper to convert strings to URL-friendly slugs
 *
 * Transforms input strings into lowercase, hyphenated slugs suitable for URLs.
 * Removes special characters and trims leading/trailing hyphens.
 *
 * @param {string} input - The string to convert to a slug
 * @returns {string} URL-friendly slug string
 *
 * @example
 * toSlug('My Business Name!') // returns 'my-business-name'
 * toSlug('  Special-Characters@#$  ') // returns 'special-characters'
 */
const toSlug = (input: string): string =>
  (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Franchises Collection Configuration
 *
 * Payload CMS collection for managing franchise business listings.
 * Includes comprehensive business data, categorization, investment information,
 * and agent assignment capabilities.
 *
 * Features:
 * - Public read access for frontend display
 * - Rich text descriptions with Lexical editor
 * - Investment range tracking
 * - Agent assignment system
 * - Feature flags (featured, sponsored, top pick)
 * - Category-based organization
 * - Tag-based classification
 *
 * @type {CollectionConfig}
 */
export const Franchises: CollectionConfig = {
  slug: 'franchises',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'businessName',
    description: 'Manage dynamic franchise listings and their metadata.',
    // Show important flags in the list view
    defaultColumns: [
      'businessName',
      'status',
      'isFeatured',
      'isSponsored',
      'isTopPick',
      'updatedAt',
    ],
  },
  // No slug auto-generation; prefer ID-only URLs
  fields: [
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
        description: '⭐ Mark as featured (editorial highlight) - Shows "Featured" badge on card',
        position: 'sidebar',
      },
    },
    {
      name: 'isSponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '💰 Mark as sponsored (paid promotion) - Shows "Sponsored" badge on card',
        position: 'sidebar',
      },
    },
    {
      name: 'isTopPick',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '⭐ Mark as a top pick - Shows "⭐ Top Pick" badge on card',
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
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      required: true,
      hasMany: false,
      admin: {
        description: 'Primary industry/category for this franchise',
        allowCreate: true,
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      required: false,
      hasMany: true,
      admin: {
        description: 'Feature tags (e.g., Low Cost, Home Based, Financing Available)',
        allowCreate: true,
      },
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
    {
      name: 'assignedAgent',
      type: 'relationship',
      relationTo: 'agents' as any,
      admin: {
        description:
          'Assign a specific agent to this franchise (optional). If not assigned, inquiries go to main contact.',
        position: 'sidebar',
      },
    },
    {
      name: 'useMainContact',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Force use main contact even if agent is assigned (overrides agent assignment)',
        position: 'sidebar',
      },
    },
  ],
}

export default Franchises
/**
 * Franchises collection
 *
 * Core business entities listed on the site. Includes category, status,
 * investment ranges, tags, assigned agent, and feature flags.
 * Primary `id` is a UUID string used for routing and linking.
 */
