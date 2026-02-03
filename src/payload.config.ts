import { s3Storage } from '@payloadcms/storage-s3'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { PayloadPluginMcp } from 'payload-plugin-mcp'
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
import Industries from './collections/Industries'
import Tags from './collections/Tags'
import Agents from './collections/Agents'
import ContactSubmissions from './collections/ContactSubmissions'
import AuditLogs from './collections/AuditLogs'
import SiteSettings from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Internal admin emails - only these can see system collections like Users and MCP Tokens
const internalAdminEmails = ['admin@payload.com', 'admin2@payload.com', 'admin@ntv.com']
const isInternalAdmin = (email: string | undefined) => {
  if (!email) return false
  return (
    internalAdminEmails.includes(email) ||
    email.endsWith('@payload.com') ||
    email.endsWith('@ntv.com')
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      /** Add a quick-access link in the admin nav to Import Franchises */
      afterNavLinks: ['@/app/(payload)/components/AdminImportLink.tsx'],
    },
  },
  // Hide MCP tokens collection from non-internal admins after init
  onInit: async (payload) => {
    const mcpTokensCollection = payload.collections['mcp-tokens']
    if (mcpTokensCollection) {
      // Override admin.hidden to hide from non-internal admins
      const originalHidden = mcpTokensCollection.config.admin?.hidden
      mcpTokensCollection.config.admin = {
        ...mcpTokensCollection.config.admin,
        hidden: ({ user }) => {
          // First check original hidden logic
          if (typeof originalHidden === 'function') {
            const result = originalHidden({ user })
            if (result) return true
          } else if (originalHidden) {
            return true
          }
          // Then check if user is internal admin
          return !isInternalAdmin(user?.email)
        },
      }
      // Override access controls
      mcpTokensCollection.config.access = {
        ...mcpTokensCollection.config.access,
        read: ({ req: { user } }) => isInternalAdmin(user?.email),
        create: ({ req: { user } }) => isInternalAdmin(user?.email),
        update: ({ req: { user } }) => isInternalAdmin(user?.email),
        delete: ({ req: { user } }) => isInternalAdmin(user?.email),
      }
    }
  },
  collections: [
    Users,
    Media,
    Pages,
    Franchises,
    Industries,
    Tags,
    Agents,
    ContactSubmissions,
    AuditLogs,
  ],
  globals: [SiteSettings],
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
    // MCP Plugin for AI agent integration (only in development)
    ...(process.env.MCP_API_KEY
      ? [
          PayloadPluginMcp({
            apiKey: process.env.MCP_API_KEY,
            collections: 'all',
            defaultOperations: {
              list: true,
              get: true,
              create: false,
              update: false,
              delete: false,
            },
          }),
        ]
      : []),
    // Only add S3 storage if all required environment variables are present
    ...(process.env.SUPABASE_STORAGE_BUCKET &&
    process.env.SUPABASE_S3_ACCESS_KEY_ID &&
    process.env.SUPABASE_S3_SECRET_ACCESS_KEY &&
    process.env.SUPABASE_S3_REGION &&
    process.env.SUPABASE_S3_ENDPOINT
      ? [
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
          }),
        ]
      : []),
  ],
})
