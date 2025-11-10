import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "franchises" DROP CONSTRAINT "franchises_industry_id_industries_id_fk";
  
  DROP INDEX "franchises_industry_idx";
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_navbar" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_call_to_action" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_blog_highlights" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_map" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_team_section" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_form_builder" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_contact_info" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "franchises" ADD COLUMN "short_description" varchar;
  ALTER TABLE "franchises_rels" ADD COLUMN "industries_id" uuid;
  ALTER TABLE "industries" ADD COLUMN "color" varchar;
  ALTER TABLE "industries" ADD COLUMN "text_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "franchises_rels" ADD CONSTRAINT "franchises_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "franchises_rels_industries_id_idx" ON "franchises_rels" USING btree ("industries_id");
  ALTER TABLE "franchises" DROP COLUMN "industry_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "franchises_rels" DROP CONSTRAINT "franchises_rels_industries_fk";
  
  DROP INDEX "franchises_rels_industries_id_idx";
  ALTER TABLE "franchises" ADD COLUMN "industry_id" uuid NOT NULL;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "franchises_industry_idx" ON "franchises" USING btree ("industry_id");
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_navbar" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_call_to_action" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_blog_highlights" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_map" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_team_section" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_form_builder" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_contact_info" DROP COLUMN "anchor_id";
  ALTER TABLE "franchises" DROP COLUMN "short_description";
  ALTER TABLE "franchises_rels" DROP COLUMN "industries_id";
  ALTER TABLE "industries" DROP COLUMN "color";
  ALTER TABLE "industries" DROP COLUMN "text_color";`)
}
