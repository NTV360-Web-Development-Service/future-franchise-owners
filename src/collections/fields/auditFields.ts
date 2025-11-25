import type { Field } from 'payload'

/**
 * Audit Fields
 *
 * Reusable fields for tracking who created/updated records and when.
 * These fields are optional to maintain backward compatibility with existing data.
 *
 * Usage:
 * ```ts
 * import { auditFields } from './fields/auditFields'
 *
 * const MyCollection: CollectionConfig = {
 *   // ... other config
 *   fields: [
 *     // ... your fields
 *     ...auditFields,
 *   ],
 * }
 * ```
 */
export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    required: false,
    admin: {
      position: 'sidebar',
      description: 'User who created this record',
      readOnly: true,
      // Hide the relationship UI controls
      allowCreate: false,
      allowEdit: false,
    },
    access: {
      // Read-only: can read but cannot update
      read: () => true,
      create: () => false,
      update: () => false,
    },
    hooks: {
      beforeChange: [
        ({ req, operation, value }) => {
          // Only set on create, not on update
          if (operation === 'create' && req.user && !value) {
            return req.user.id
          }
          return value
        },
      ],
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    required: false,
    admin: {
      position: 'sidebar',
      description: 'User who last updated this record',
      readOnly: true,
      // Hide the relationship UI controls
      allowCreate: false,
      allowEdit: false,
    },
    access: {
      // Read-only: can read but cannot update
      read: () => true,
      create: () => false,
      update: () => false,
    },
    hooks: {
      beforeChange: [
        ({ req, value }) => {
          // Always update to current user on any change
          if (req.user) {
            return req.user.id
          }
          return value
        },
      ],
    },
  },
]
