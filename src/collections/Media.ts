import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
/**
 * Media collection
 *
 * Uploads and stores files (images, documents). Optionally integrates with S3
 * when environment variables are provided. Primary `id` is a UUID string.
 */
