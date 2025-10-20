import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_franchise_grid_display_mode" AS ENUM('automatic', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_industries_icon" AS ENUM('Briefcase', 'Dumbbell', 'Coffee', 'UtensilsCrossed', 'Home', 'Wrench', 'Heart', 'Stethoscope', 'Users', 'Activity', 'Sparkles', 'HardHat', 'BookOpen', 'Baby', 'PawPrint', 'Car', 'Sparkle', 'DollarSign', 'Store', 'Package', 'Palette', 'Smartphone', 'Building2', 'Plane', 'Music');
  CREATE TYPE "public"."enum_tags_type" AS ENUM('feature', 'investment', 'model', 'location', 'other');
  CREATE TYPE "public"."enum_site_settings_footer_social_links_platform" AS ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest', 'reddit', 'discord', 'slack', 'github', 'gitlab', 'twitch', 'whatsapp', 'telegram', 'mail', 'globe');
  CREATE TYPE "public"."enum_site_settings_navbar_visibility" AS ENUM('all', 'include', 'exclude');
  CREATE TYPE "public"."enum_site_settings_footer_visibility" AS ENUM('all', 'include', 'exclude');
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"franchises_id" uuid
  );
  
  CREATE TABLE "franchises_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" uuid
  );
  
  CREATE TABLE "industries" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"icon" "enum_industries_icon" DEFAULT 'Briefcase',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_tags_type" DEFAULT 'feature',
  	"description" varchar,
  	"color" varchar,
  	"text_color" varchar DEFAULT '#ffffff',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  ALTER TABLE "franchises_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "franchises_tags" CASCADE;
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "background_color" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "background_color" SET DEFAULT '#2563eb';
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "text_color" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "text_color" SET DEFAULT '#ffffff';
  ALTER TABLE "site_settings_footer_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_site_settings_footer_social_links_platform" USING "platform"::"public"."enum_site_settings_footer_social_links_platform";
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "display_mode" "enum_pages_blocks_franchise_grid_display_mode" DEFAULT 'automatic' NOT NULL;
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "industry_id" uuid;
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "font_size" numeric DEFAULT 14;
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "font_weight" "enum_pages_blocks_ribbon_font_weight" DEFAULT '400';
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "is_moving" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "speed" numeric DEFAULT 30;
  ALTER TABLE "pages_blocks_ribbon" ADD COLUMN "text_align" "enum_pages_blocks_ribbon_text_align" DEFAULT 'center';
  ALTER TABLE "pages_blocks_blog_highlights" ADD COLUMN "view_all_link" varchar DEFAULT 'https://quantumbc.substack.com';
  ALTER TABLE "pages_blocks_blog_highlights" ADD COLUMN "show_view_all_button" boolean DEFAULT true;
  ALTER TABLE "franchises" ADD COLUMN "industry_id" uuid NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "industries_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "navbar_visibility" "enum_site_settings_navbar_visibility" DEFAULT 'all';
  ALTER TABLE "site_settings" ADD COLUMN "footer_visibility" "enum_site_settings_footer_visibility" DEFAULT 'all';
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_franchises_fk" FOREIGN KEY ("franchises_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "franchises_rels" ADD CONSTRAINT "franchises_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "franchises_rels" ADD CONSTRAINT "franchises_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_franchises_id_idx" ON "pages_rels" USING btree ("franchises_id");
  CREATE INDEX "franchises_rels_order_idx" ON "franchises_rels" USING btree ("order");
  CREATE INDEX "franchises_rels_parent_idx" ON "franchises_rels" USING btree ("parent_id");
  CREATE INDEX "franchises_rels_path_idx" ON "franchises_rels" USING btree ("path");
  CREATE INDEX "franchises_rels_tags_id_idx" ON "franchises_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "industries_name_idx" ON "industries" USING btree ("name");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries" USING btree ("slug");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_pages_id_idx" ON "site_settings_rels" USING btree ("pages_id");
  ALTER TABLE "pages_blocks_franchise_grid" ADD CONSTRAINT "pages_blocks_franchise_grid_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_franchise_grid_industry_idx" ON "pages_blocks_franchise_grid" USING btree ("industry_id");
  CREATE INDEX "franchises_industry_idx" ON "franchises" USING btree ("industry_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "category";
  ALTER TABLE "franchises" DROP COLUMN "category";
  ALTER TABLE "site_settings_footer_social_links" DROP COLUMN "icon";
  DROP TYPE "public"."enum_pages_blocks_franchise_grid_category";
  DROP TYPE "public"."enum_pages_blocks_ribbon_background_color";
  DROP TYPE "public"."enum_pages_blocks_ribbon_text_color";
  DROP TYPE "public"."enum_franchises_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_franchise_grid_category" AS ENUM('all', 'Fitness', 'Food and Beverage', 'Health and Wellness', 'Home Services', 'Senior Care', 'Sports');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_background_color" AS ENUM('blue', 'red', 'green', 'yellow', 'purple', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_text_color" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum_franchises_category" AS ENUM('Fitness', 'Food and Beverage', 'Health and Wellness', 'Home Services', 'Senior Care', 'Sports');
  CREATE TABLE "franchises_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "franchises_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "industries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "franchises_rels" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  ALTER TABLE "pages_blocks_franchise_grid" DROP CONSTRAINT "pages_blocks_franchise_grid_industry_id_industries_id_fk";
  
  ALTER TABLE "franchises" DROP CONSTRAINT "franchises_industry_id_industries_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_industries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "pages_blocks_franchise_grid_industry_idx";
  DROP INDEX "franchises_industry_idx";
  DROP INDEX "payload_locked_documents_rels_industries_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "background_color" SET DEFAULT 'blue'::"public"."enum_pages_blocks_ribbon_background_color";
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "background_color" SET DATA TYPE "public"."enum_pages_blocks_ribbon_background_color" USING "background_color"::"public"."enum_pages_blocks_ribbon_background_color";
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "text_color" SET DEFAULT 'white'::"public"."enum_pages_blocks_ribbon_text_color";
  ALTER TABLE "pages_blocks_ribbon" ALTER COLUMN "text_color" SET DATA TYPE "public"."enum_pages_blocks_ribbon_text_color" USING "text_color"::"public"."enum_pages_blocks_ribbon_text_color";
  ALTER TABLE "site_settings_footer_social_links" ALTER COLUMN "platform" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "category" "enum_pages_blocks_franchise_grid_category";
  ALTER TABLE "franchises" ADD COLUMN "category" "enum_franchises_category" NOT NULL;
  ALTER TABLE "site_settings_footer_social_links" ADD COLUMN "icon" varchar;
  ALTER TABLE "franchises_tags" ADD CONSTRAINT "franchises_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "franchises_tags_order_idx" ON "franchises_tags" USING btree ("_order");
  CREATE INDEX "franchises_tags_parent_id_idx" ON "franchises_tags" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "display_mode";
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "industry_id";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "font_size";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "font_weight";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "is_moving";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "speed";
  ALTER TABLE "pages_blocks_ribbon" DROP COLUMN "text_align";
  ALTER TABLE "pages_blocks_blog_highlights" DROP COLUMN "view_all_link";
  ALTER TABLE "pages_blocks_blog_highlights" DROP COLUMN "show_view_all_button";
  ALTER TABLE "franchises" DROP COLUMN "industry_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "industries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";
  ALTER TABLE "site_settings" DROP COLUMN "navbar_visibility";
  ALTER TABLE "site_settings" DROP COLUMN "footer_visibility";
  DROP TYPE "public"."enum_pages_blocks_franchise_grid_display_mode";
  DROP TYPE "public"."enum_pages_blocks_ribbon_font_weight";
  DROP TYPE "public"."enum_pages_blocks_ribbon_text_align";
  DROP TYPE "public"."enum_industries_icon";
  DROP TYPE "public"."enum_tags_type";
  DROP TYPE "public"."enum_site_settings_footer_social_links_platform";
  DROP TYPE "public"."enum_site_settings_navbar_visibility";
  DROP TYPE "public"."enum_site_settings_footer_visibility";`)
}
