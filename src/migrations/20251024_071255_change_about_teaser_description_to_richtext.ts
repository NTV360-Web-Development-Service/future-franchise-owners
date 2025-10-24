import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Migration: Change about_teaser description field from varchar to richtext (jsonb)
 *
 * This migration converts the description field in the pages_blocks_about_teaser table
 * from a simple varchar field to a Lexical richtext field (jsonb format).
 *
 * Steps:
 * 1. Add temporary jsonb column
 * 2. Convert existing varchar data to Lexical JSON format
 * 3. Replace old column with new one
 * 4. Add show_tabs column to franchise_grid block
 * 5. Add unique index on pages.slug
 *
 * @param {MigrateUpArgs} args - Migration arguments containing db connection
 * @returns {Promise<void>}
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Step 1: Add a temporary column for the new jsonb data
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "description_new" jsonb;
  `)

  // Step 2: Fetch all rows and convert varchar to jsonb using Node.js
  const result = await db.execute(sql`
    SELECT id, description FROM "pages_blocks_about_teaser" WHERE description IS NOT NULL AND description != '';
  `)

  // Step 3: Convert each row's description to Lexical JSON format
  const rows = result.rows as Array<{ id: string; description: string }>
  for (const row of rows) {
    const textContent = row.description || ''
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

    await db.execute(sql`
      UPDATE "pages_blocks_about_teaser" 
      SET description_new = ${JSON.stringify(lexicalJson)}::jsonb
      WHERE id = ${row.id};
    `)
  }

  // Step 4: Drop the old column and rename the new one
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "description";
    ALTER TABLE "pages_blocks_about_teaser" RENAME COLUMN "description_new" TO "description";
  `)

  // Step 5: Add other schema changes
  await db.execute(sql`
    ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "show_tabs" boolean DEFAULT true;
    CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  `)
}

/**
 * Rollback migration: Revert description field back to varchar
 *
 * This rollback converts the description field back to varchar and removes
 * the additional schema changes made in the up migration.
 *
 * @param {MigrateDownArgs} args - Migration arguments containing db connection
 * @returns {Promise<void>}
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "pages_slug_idx";
    ALTER TABLE "pages_blocks_about_teaser" ALTER COLUMN "description" SET DATA TYPE varchar;
    ALTER TABLE "pages_blocks_about_teaser" ALTER COLUMN "description" SET DEFAULT 'We combine decades of franchise ownership, coaching, and operations experience to help entrepreneurs make confident, informed decisions.';
    ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN IF EXISTS "show_tabs";
  `)
}
