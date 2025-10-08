import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
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
