import type { CollectionConfig } from 'payload'
import { v7 as uuidv7 } from 'uuid'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => uuidv7(),
      admin: {
        hidden: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
