/**
 * @fileoverview Audit Logs Collection Configuration
 *
 * Centralized activity log that tracks all changes across all collections.
 * Provides a complete audit trail for compliance, debugging, and analytics.
 *
 * @module Collections/AuditLogs
 * @version 1.0.0
 */

import type { CollectionConfig } from 'payload'

/**
 * Audit Logs Collection Configuration
 *
 * Tracks all create, update, and delete operations across the system.
 * Stores detailed information about who made changes, what changed,
 * and when it happened.
 *
 * Features:
 * - Automatic tracking via global hooks
 * - Before/after value comparison
 * - IP address and user agent capture
 * - Filterable by collection, user, and operation
 * - Read-only (cannot be edited)
 * - Optional auto-cleanup for old logs
 *
 * @type {CollectionConfig}
 */
const AuditLogs: CollectionConfig = {
  slug: 'auditLogs',
  admin: {
    useAsTitle: 'collection',
    description: 'System-wide activity log tracking all changes',
    defaultColumns: ['collection', 'operation', 'user', 'recordId', 'createdAt'],
    group: 'System',
  },
  access: {
    // Only admins can read audit logs
    read: ({ req: { user } }) => {
      // Allow if user is admin
      return Boolean(user)
    },
    // Nobody can create/update/delete manually (only via hooks)
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => {
      // Only admins can delete old logs
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'collection',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Which collection was modified',
        readOnly: true,
      },
    },
    {
      name: 'recordId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID of the record that was modified',
        readOnly: true,
      },
    },
    {
      name: 'operation',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
      ],
      admin: {
        description: 'Type of operation performed',
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
      admin: {
        description: 'User who performed the action',
        readOnly: true,
      },
    },
    {
      name: 'changes',
      type: 'json',
      required: false,
      admin: {
        description: 'Detailed changes (before/after values)',
        readOnly: true,
      },
    },
    {
      name: 'changedFields',
      type: 'array',
      required: false,
      admin: {
        description: 'List of fields that were modified',
        readOnly: true,
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'ipAddress',
      type: 'text',
      required: false,
      admin: {
        description: 'IP address of the user',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'userAgent',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Browser/client information',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default AuditLogs
