// Direct database fix script - bypasses Supabase pooler issues
import 'dotenv/config'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL)

async function fixSchema() {
  try {
    console.log('Starting schema fix...')

    // Step 1: Add temporary column
    console.log('Step 1: Adding temporary column...')
    await sql`ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN IF NOT EXISTS "description_new" jsonb`

    // Step 2: Fetch all rows
    console.log('Step 2: Fetching existing data...')
    const rows = await sql`SELECT id, description FROM "pages_blocks_about_teaser"`
    console.log(`Found ${rows.length} rows total`)

    // Step 3: Convert each row
    console.log('Step 3: Converting data to Lexical JSON format...')
    for (const row of rows) {
      // Skip if description is null, empty, or already JSON
      if (!row.description || row.description === '' || typeof row.description === 'object') {
        console.log(`  Skipping row ${row.id} (already converted or empty)`)
        continue
      }

      const textContent = String(row.description)
      const lexicalJson = {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  format: 0,
                  text: textContent,
                  mode: 'normal',
                  style: '',
                  detail: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              textFormat: 0,
            },
          ],
          direction: 'ltr',
        },
      }

      await sql`UPDATE "pages_blocks_about_teaser" SET description_new = ${JSON.stringify(lexicalJson)}::jsonb WHERE id = ${row.id}`
      console.log(`  Converted row ${row.id}`)
    }

    // Step 4: Drop old column and rename new one
    console.log('Step 4: Swapping columns...')
    await sql`ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN IF EXISTS "description"`
    await sql`ALTER TABLE "pages_blocks_about_teaser" RENAME COLUMN "description_new" TO "description"`

    // Step 5: Other schema changes
    console.log('Step 5: Applying other schema changes...')
    await sql`ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN IF NOT EXISTS "show_tabs" boolean DEFAULT true`
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug")`

    console.log('✅ Schema fix completed successfully!')
  } catch (error) {
    console.error('❌ Error fixing schema:', error)
    process.exit(1)
  }
}

fixSchema()
