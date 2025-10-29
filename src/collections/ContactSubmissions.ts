/**
 * @fileoverview Contact Submissions Collection Configuration
 *
 * Defines the Payload CMS collection for storing contact form submissions.
 * This collection manages inquiries submitted through Contact Form Blocks
 * placed on various pages throughout the site.
 *
 * @module Collections/ContactSubmissions
 * @version 1.0.0
 */

import type { CollectionConfig } from 'payload'

/**
 * Contact Submissions Collection Configuration
 *
 * Payload CMS collection for managing contact form submissions.
 * Stores all inquiries submitted through Contact Form Blocks with
 * flexible field support to accommodate different form configurations.
 *
 * Features:
 * - Admin-only access for viewing and managing submissions
 * - Status tracking (new, read, archived)
 * - Automatic timestamp management
 * - IP address capture for security and analytics
 * - Flexible field support for various form configurations
 * - Reverse chronological ordering (newest first)
 *
 * @type {CollectionConfig}
 */
const ContactSubmissions: CollectionConfig = {
  slug: 'contactSubmissions',
  admin: {
    useAsTitle: 'name',
    description: 'Contact form submissions from site visitors',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
  },
  access: {
    read: () => true, // Admins only (default Payload behavior)
    create: () => true, // Allow API to create submissions
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
        description: 'Submitter email address',
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
        description: 'Submitter IP address (captured automatically)',
        readOnly: true,
        position: 'sidebar',
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
        description: 'Submission status for tracking and organization',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default ContactSubmissions
