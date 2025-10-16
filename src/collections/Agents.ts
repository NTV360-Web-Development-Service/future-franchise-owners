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
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'bio', type: 'richText' },
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
    { name: 'ghlWebhook', type: 'text', admin: { description: 'GoHighLevel webhook URL (optional)' } },
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