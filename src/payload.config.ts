import { s3Storage } from '@payloadcms/storage-s3'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

/**
 * Payload configuration for Future Franchise Owners.
 *
 * - PostgreSQL via Vercel adapter with UUID primary keys
 * - Rich text editor: Lexical
 * - Types generated to `src/payload-types.ts`
 * - Optional S3 storage enabled via Supabase-compatible env vars
 */

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Franchises from './collections/Franchises'
import Agents from './collections/Agents'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Franchises, Agents],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /** Database adapter: Vercel Postgres with UUID primary IDs */
  db: vercelPostgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Only add S3 storage if all required environment variables are present
    ...(process.env.SUPABASE_STORAGE_BUCKET && 
        process.env.SUPABASE_S3_ACCESS_KEY_ID && 
        process.env.SUPABASE_S3_SECRET_ACCESS_KEY && 
        process.env.SUPABASE_S3_REGION && 
        process.env.SUPABASE_S3_ENDPOINT ? [
      s3Storage({
        collections: {
          media: {
            prefix: 'media',
          },
        },
        bucket: process.env.SUPABASE_STORAGE_BUCKET,
        config: {
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
          },
          region: process.env.SUPABASE_S3_REGION,
          endpoint: process.env.SUPABASE_S3_ENDPOINT,
        },
      })
    ] : []),
  ],
})
