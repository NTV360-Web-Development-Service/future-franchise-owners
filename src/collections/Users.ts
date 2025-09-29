import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => uuidv7(),
      admin: {
        hidden: true,
      },
    },
  ],
}
