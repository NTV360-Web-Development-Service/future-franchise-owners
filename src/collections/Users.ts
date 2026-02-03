import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

// Internal admin emails - only these can see/manage the Users collection
const internalAdminEmails = ['admin@payload.com', 'admin2@payload.com', 'admin@ntv.com']

const isInternalAdmin = (email: string | undefined) => {
  if (!email) return false
  return (
    internalAdminEmails.includes(email) ||
    email.endsWith('@payload.com') ||
    email.endsWith('@ntv.com')
  )
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    // Hide the Users collection from the sidebar for non-internal admins
    hidden: ({ user }) => !isInternalAdmin(user?.email),
  },
  auth: true,
  access: {
    // Internal admins can see all users, others can only see themselves (for account page)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isInternalAdmin(user.email)) return true
      // Allow users to read their own record (needed for /admin/account)
      return {
        id: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => isInternalAdmin(user?.email),
    // Internal admins can update anyone, others can only update themselves
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isInternalAdmin(user.email)) return true
      // Allow users to update their own record
      return {
        id: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => isInternalAdmin(user?.email),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Ensure UUIDv7 is used for primary `id` on user creation
        if (operation === 'create' && !data?.id) {
          data.id = uuidv7()
        }
        return data
      },
    ],
  },
}
/**
 * Users collection
 *
 * Auth-enabled collection for administrative users of the CMS.
 * Primary `id` is a UUID string (via adapter). Email and password are required.
 */
