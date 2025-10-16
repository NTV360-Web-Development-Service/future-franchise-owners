import type { CollectionConfig } from 'payload'

const sanitizeFilename = (filename: string): string => {
  const trimmed = filename.trim()
  const lastDot = trimmed.lastIndexOf('.')
  const base = lastDot > -1 ? trimmed.slice(0, lastDot) : trimmed
  const ext = lastDot > -1 ? trimmed.slice(lastDot + 1) : ''

  const safeBase =
    base
      .normalize('NFKD')
      .replace(/[\s]+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'file'

  const safeExt = ext
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()

  const timestamp = Date.now()
  return safeExt ? `${safeBase}-${timestamp}.${safeExt}` : `${safeBase}-${timestamp}`
}

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
  hooks: {
    beforeChange: [
      async ({ req, data, context }) => {
        const file = req?.file
        if (!file) {
          // If this is an external URL upload handled in a previous hook, check context
          const ctxFilename = context?.sanitizedFilename
          if (ctxFilename && typeof ctxFilename === 'string') {
            data.filename = ctxFilename
          }
          return data
        }

        const uploadFile = file as typeof file & {
          filename?: string
          originalname?: string
          name?: string
        }

        const originalName =
          uploadFile.originalname || uploadFile.filename || uploadFile.name || 'upload'
        const sanitized = sanitizeFilename(originalName)

        uploadFile.originalname = sanitized
        uploadFile.filename = sanitized
        uploadFile.name = sanitized
        data.filename = sanitized
        if (context) {
          context.sanitizedFilename = sanitized
        }

        return data
      },
    ],
    beforeValidate: [
      ({ data = {}, originalDoc }) => {
        if (data.url && !data.filename) {
          // Generate a deterministic filename based on the URL when pasting external links
          try {
            const url = new URL(data.url)
            const pathname = url.pathname
            const basename = pathname.split('/').filter(Boolean).pop() || 'remote-asset'
            const sanitized = sanitizeFilename(basename)
            data.filename = sanitized
          } catch {
            data.filename = sanitizeFilename('remote-asset')
          }
        }

        if (originalDoc?.filename && !data.filename) {
          data.filename = originalDoc.filename
        }

        return data
      },
    ],
  },
}
/**
 * Media collection
 *
 * Uploads and stores files (images, documents). Optionally integrates with S3
 * when environment variables are provided. Primary `id` is a UUID string.
 */
