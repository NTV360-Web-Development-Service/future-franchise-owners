/**
 * @fileoverview Agents Collection Configuration
 *
 * Defines the Payload CMS collection for franchise consultants and agents.
 * This collection manages agent profiles, contact information, specialties,
 * and integration with external systems like GoHighLevel.
 *
 * @module Collections/Agents
 * @version 1.0.0
 */

import type { CollectionConfig } from 'payload'
import { lexicalEditor, LinkFeature, HTMLConverterFeature } from '@payloadcms/richtext-lexical'
import { auditFields } from './fields/auditFields'
import { afterChangeHook, afterDeleteHook } from '../hooks/auditLogger'

/**
 * Agents Collection Configuration
 *
 * Payload CMS collection for managing franchise consultants and agents.
 * Agents can be assigned to specific franchises to handle inquiries and
 * provide specialized consultation services.
 *
 * Features:
 * - Public read access for frontend display
 * - Rich text bio with Lexical editor
 * - Specialty categorization matching franchise categories
 * - Active/inactive status management
 * - GoHighLevel webhook integration
 * - Photo upload capability
 * - Contact information management
 *
 * @type {CollectionConfig}
 */
const Agents: CollectionConfig = {
  slug: 'agents',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    description: 'Manage franchise consultants and agents',
    defaultColumns: ['name', 'email', 'phone', 'isActive', 'updatedAt'],
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'title', type: 'text' },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // Enable internal links to pages and franchises
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
              ]
            },
          }),
          // Enable HTML converter to allow pasting formatted HTML
          HTMLConverterFeature({}),
        ],
      }),
      admin: {
        description:
          'Agent biography with support for links to pages and franchises. Paste HTML for advanced formatting.',
      },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'specialties',
      type: 'array',
      admin: { description: 'Franchise categories or specialties' },
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Fitness', value: 'Fitness' },
            { label: 'Food and Beverage', value: 'Food and Beverage' },
            { label: 'Health and Wellness', value: 'Health and Wellness' },
            { label: 'Home Services', value: 'Home Services' },
            { label: 'Senior Care', value: 'Senior Care' },
            { label: 'Sports', value: 'Sports' },
          ],
        },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    {
      name: 'ghlWebhook',
      type: 'text',
      admin: { description: 'GoHighLevel webhook URL (optional)' },
    },
    // Audit fields
    ...auditFields,
  ],
}

export default Agents
/**
 * Agents collection
 *
 * Represents franchise consultants who can be assigned to franchises.
 * Includes contact info, bio (Lexical rich text), specialties, and active status.
 * Primary `id` is a UUID string.
 */
