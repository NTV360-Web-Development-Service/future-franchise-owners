import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_team_section_layout_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_form_builder_form_fields_field_type" AS ENUM('text', 'email', 'tel', 'number', 'textarea', 'select');
  CREATE TYPE "public"."enum_pages_blocks_form_builder_form_fields_width" AS ENUM('full', 'half', 'third');
  CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('new', 'read', 'archived');
  CREATE TABLE "pages_blocks_team_section_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" uuid,
  	"name" varchar NOT NULL,
  	"title" varchar,
  	"location" varchar,
  	"biography" jsonb
  );
  
  CREATE TABLE "pages_blocks_team_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar DEFAULT 'Meet Our Team',
  	"subheading" varchar,
  	"layout_mode" "enum_pages_blocks_team_section_layout_mode" DEFAULT 'grid' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_builder_form_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_form_builder_form_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_type" "enum_pages_blocks_form_builder_form_fields_field_type" DEFAULT 'text' NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false,
  	"width" "enum_pages_blocks_form_builder_form_fields_width" DEFAULT 'full' NOT NULL
  );
  
  CREATE TABLE "pages_blocks_form_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar DEFAULT 'Get in Touch',
  	"description" varchar,
  	"submit_button_text" varchar DEFAULT 'Send Message',
  	"success_message" varchar DEFAULT 'Thank you! We''ll get back to you soon.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_info" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar DEFAULT 'Contact Information',
  	"contact_details_show_phone" boolean DEFAULT true,
  	"contact_details_phone" varchar,
  	"contact_details_show_email" boolean DEFAULT true,
  	"contact_details_email" varchar,
  	"contact_details_show_address" boolean DEFAULT true,
  	"contact_details_address" varchar,
  	"contact_details_show_hours" boolean DEFAULT false,
  	"contact_details_hours" varchar,
  	"show_map" boolean DEFAULT false,
  	"map_url" varchar,
  	"map_height" numeric DEFAULT 300,
  	"block_name" varchar
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"company" varchar,
  	"subject" varchar,
  	"message" varchar,
  	"ip_address" varchar,
  	"status" "enum_contact_submissions_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "pages" ADD COLUMN "seo_og_image_id" uuid;
  ALTER TABLE "pages" ADD COLUMN "seo_no_index" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "contact_submissions_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_title" varchar DEFAULT 'Future Franchise Owners - Find Your Perfect Franchise';
  ALTER TABLE "site_settings" ADD COLUMN "seo_default_description" varchar DEFAULT 'Discover your next franchise opportunity with expert guidance. Browse top franchises across industries and connect with seasoned consultants.';
  ALTER TABLE "site_settings" ADD COLUMN "seo_keywords" varchar DEFAULT 'franchise opportunities, buy a franchise, franchise business, franchise consultant, franchise investment, best franchises';
  ALTER TABLE "site_settings" ADD COLUMN "seo_og_image_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "seo_twitter_handle" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_facebook_app_id" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_google_site_verification" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_bing_site_verification" varchar;
  ALTER TABLE "pages_blocks_team_section_team_members" ADD CONSTRAINT "pages_blocks_team_section_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_section_team_members" ADD CONSTRAINT "pages_blocks_team_section_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_section" ADD CONSTRAINT "pages_blocks_team_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_builder_form_fields_options" ADD CONSTRAINT "pages_blocks_form_builder_form_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_builder_form_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_builder_form_fields" ADD CONSTRAINT "pages_blocks_form_builder_form_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_builder" ADD CONSTRAINT "pages_blocks_form_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_info" ADD CONSTRAINT "pages_blocks_contact_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_section_team_members_order_idx" ON "pages_blocks_team_section_team_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_section_team_members_parent_id_idx" ON "pages_blocks_team_section_team_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_section_team_members_photo_idx" ON "pages_blocks_team_section_team_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_section_order_idx" ON "pages_blocks_team_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_section_parent_id_idx" ON "pages_blocks_team_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_section_path_idx" ON "pages_blocks_team_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_builder_form_fields_options_order_idx" ON "pages_blocks_form_builder_form_fields_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_builder_form_fields_options_parent_id_idx" ON "pages_blocks_form_builder_form_fields_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_builder_form_fields_order_idx" ON "pages_blocks_form_builder_form_fields" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_builder_form_fields_parent_id_idx" ON "pages_blocks_form_builder_form_fields" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_builder_order_idx" ON "pages_blocks_form_builder" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_builder_parent_id_idx" ON "pages_blocks_form_builder" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_builder_path_idx" ON "pages_blocks_form_builder" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_info_order_idx" ON "pages_blocks_contact_info" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_info_parent_id_idx" ON "pages_blocks_contact_info" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_info_path_idx" ON "pages_blocks_contact_info" USING btree ("_path");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "site_settings_seo_seo_og_image_idx" ON "site_settings" USING btree ("seo_og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_section_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_section" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_builder_form_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_builder_form_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form_builder" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_info" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_team_section_team_members" CASCADE;
  DROP TABLE "pages_blocks_team_section" CASCADE;
  DROP TABLE "pages_blocks_form_builder_form_fields_options" CASCADE;
  DROP TABLE "pages_blocks_form_builder_form_fields" CASCADE;
  DROP TABLE "pages_blocks_form_builder" CASCADE;
  DROP TABLE "pages_blocks_contact_info" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_seo_og_image_id_media_id_fk";
  
  DROP INDEX "pages_seo_seo_og_image_idx";
  DROP INDEX "payload_locked_documents_rels_contact_submissions_id_idx";
  DROP INDEX "site_settings_seo_seo_og_image_idx";
  ALTER TABLE "pages" DROP COLUMN "seo_meta_title";
  ALTER TABLE "pages" DROP COLUMN "seo_meta_description";
  ALTER TABLE "pages" DROP COLUMN "seo_keywords";
  ALTER TABLE "pages" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "pages" DROP COLUMN "seo_no_index";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "contact_submissions_id";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_title";
  ALTER TABLE "site_settings" DROP COLUMN "seo_default_description";
  ALTER TABLE "site_settings" DROP COLUMN "seo_keywords";
  ALTER TABLE "site_settings" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "seo_twitter_handle";
  ALTER TABLE "site_settings" DROP COLUMN "seo_facebook_app_id";
  ALTER TABLE "site_settings" DROP COLUMN "seo_google_site_verification";
  ALTER TABLE "site_settings" DROP COLUMN "seo_bing_site_verification";
  DROP TYPE "public"."enum_pages_blocks_team_section_layout_mode";
  DROP TYPE "public"."enum_pages_blocks_form_builder_form_fields_field_type";
  DROP TYPE "public"."enum_pages_blocks_form_builder_form_fields_width";
  DROP TYPE "public"."enum_contact_submissions_status";`)
}
