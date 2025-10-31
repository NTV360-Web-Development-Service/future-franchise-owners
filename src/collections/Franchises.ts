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
import { lexicalEditor, LinkFeature, HTMLConverterFeature } from '@payloadcms/richtext-lexical'

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
      name: 'shortDescription',
      type: 'textarea',
      required: false,
      admin: {
        description:
          'Brief summary (recommended 200 characters or less) - Used for cards, previews, and SEO meta descriptions',
        placeholder: 'A concise overview of this franchise opportunity...',
      },
      validate: (value) => {
        if (value && value.length > 200) {
          return `Warning: ${value.length} characters. Recommended to keep under 200 characters for optimal display.`
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // Enable internal links to other pages and franchises
          LinkFeature({
            enabledCollections: ['pages', 'franchises'],
            fields: ({ defaultFields }) => {
              return [
                ...defaultFields,
                {
                  name: 'rel',
                  label: 'Rel Attribute',
                  type: 'select',
                  hasMany: true,
                  options: ['noopener', 'noreferrer', 'nofollow'],
                  admin: {
                    description:
                      'The rel attribute defines the relationship between your page and the linked page',
                  },
                },
                {
                  name: 'linkColor',
                  label: 'Link Color',
                  type: 'text',
                  admin: {
                    description: 'Custom color for this link (e.g., #004AAD, blue, rgb(0,74,173))',
                    placeholder: '#004AAD',
                  },
                },
              ]
            },
          }),
          // Enable HTML converter to allow pasting formatted HTML
          HTMLConverterFeature({}),
        ],
      }),
      admin: {
        description:
          'Full detailed description with support for links to pages and franchises. Paste HTML for advanced formatting.',
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
      required: false,
      hasMany: true,
      admin: {
        description: 'Industries/categories for this franchise (can select multiple)',
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
