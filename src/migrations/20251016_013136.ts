import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * Initial database schema migration
 *
 * Creates all initial tables, types, indexes, and foreign key constraints
 * for the Payload CMS application including:
 * - User authentication and sessions
 * - Media management
 * - Page blocks (hero, navbar, ribbon, franchise grid, etc.)
 * - Franchises and agents
 * - Site settings
 *
 * @param {MigrateUpArgs} args - Migration arguments containing db connection
 * @returns {Promise<void>}
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_franchise_grid_category" AS ENUM('all', 'Fitness', 'Food and Beverage', 'Health and Wellness', 'Home Services', 'Senior Care', 'Sports');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_background_color" AS ENUM('blue', 'red', 'green', 'yellow', 'purple', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_ribbon_text_color" AS ENUM('white', 'black');
  CREATE TYPE "public"."enum_pages_blocks_hero_cta_buttons_style" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_about_teaser_ctas_style" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_ctas_style" AS ENUM('primary', 'secondary', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_alignment" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_blocks_call_to_action_background_style" AS ENUM('color', 'gradient', 'image');
  CREATE TYPE "public"."enum_franchises_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_franchises_category" AS ENUM('Fitness', 'Food and Beverage', 'Health and Wellness', 'Home Services', 'Senior Care', 'Sports');
  CREATE TYPE "public"."enum_agents_specialties_category" AS ENUM('Fitness', 'Food and Beverage', 'Health and Wellness', 'Home Services', 'Senior Care', 'Sports');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "pages_blocks_franchise_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar,
  	"show_filters" boolean DEFAULT true,
  	"only_featured" boolean DEFAULT false,
  	"only_sponsored" boolean DEFAULT false,
  	"only_top_pick" boolean DEFAULT false,
  	"category" "enum_pages_blocks_franchise_grid_category",
  	"limit" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_ribbon" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"text" varchar NOT NULL,
  	"background_color" "enum_pages_blocks_ribbon_background_color" DEFAULT 'blue' NOT NULL,
  	"text_color" "enum_pages_blocks_ribbon_text_color" DEFAULT 'white' NOT NULL,
  	"link_url" varchar NOT NULL,
  	"link_open_in_new_tab" boolean DEFAULT false,
  	"dismissible" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_navbar_navigation_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_navbar" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"logo_image_id" uuid,
  	"logo_text" varchar,
  	"cta_button_label" varchar DEFAULT 'Apply Now' NOT NULL,
  	"cta_button_url" varchar NOT NULL,
  	"cta_button_open_in_new_tab" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_pages_blocks_hero_cta_buttons_style" DEFAULT 'primary' NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar NOT NULL,
  	"subheading" jsonb NOT NULL,
  	"image_id" uuid,
  	"show_overlay" boolean DEFAULT true,
  	"background_blur" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_teaser_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_about_teaser_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_pages_blocks_about_teaser_ctas_style" DEFAULT 'primary',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_about_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"eyebrow" varchar DEFAULT 'About Future Franchise Owners',
  	"heading" varchar DEFAULT 'Seasoned franchise experts guiding your journey',
  	"description" varchar DEFAULT 'We combine decades of franchise ownership, coaching, and operations experience to help entrepreneurs make confident, informed decisions.',
  	"image_id" uuid,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_call_to_action_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"style" "enum_pages_blocks_call_to_action_ctas_style" DEFAULT 'primary',
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"eyebrow" varchar,
  	"heading" varchar DEFAULT 'Ready to explore your franchise future?',
  	"description" varchar,
  	"alignment" "enum_pages_blocks_call_to_action_alignment" DEFAULT 'center',
  	"background_style" "enum_pages_blocks_call_to_action_background_style" DEFAULT 'gradient',
  	"background_color" varchar DEFAULT '#004AAD',
  	"background_gradient" varchar DEFAULT 'linear-gradient(135deg, #004AAD 0%, #001C40 50%, #000814 100%)',
  	"background_image_id" uuid,
  	"overlay_color" varchar DEFAULT '#000000',
  	"overlay_opacity" numeric DEFAULT 0.45,
  	"small_print" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar DEFAULT 'Latest Blog Posts',
  	"subheading" varchar DEFAULT 'Stay updated with the latest franchise insights and business tips',
  	"feed_url" varchar DEFAULT 'https://quantumbc.substack.com/feed',
  	"limit" numeric DEFAULT 6,
  	"show_author" boolean DEFAULT true,
  	"show_date" boolean DEFAULT true,
  	"show_read_time" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"heading" varchar DEFAULT 'Find Franchise Opportunities Near You',
  	"description" varchar DEFAULT 'Explore our network of franchise locations and discover opportunities in your area.',
  	"map_url" varchar DEFAULT 'https://www.google.com/maps/d/u/0/embed?mid=1WvsN2zVD73ijJA6Kmyrv72IN36qRZxo&ehbc=2E312F',
  	"height" numeric DEFAULT 450,
  	"show_view_button" boolean DEFAULT true,
  	"button_text" varchar DEFAULT 'View Full Directory',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "franchises_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "franchises" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"business_name" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_franchises_status" DEFAULT 'draft',
  	"is_featured" boolean DEFAULT false,
  	"is_sponsored" boolean DEFAULT false,
  	"is_top_pick" boolean DEFAULT false,
  	"description" jsonb,
  	"category" "enum_franchises_category" NOT NULL,
  	"investment_min" numeric,
  	"investment_max" numeric,
  	"logo_id" uuid,
  	"assigned_agent_id" uuid,
  	"use_main_contact" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agents_specialties" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_agents_specialties_category"
  );
  
  CREATE TABLE "agents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"title" varchar,
  	"bio" jsonb,
  	"photo_id" uuid,
  	"is_active" boolean DEFAULT true,
  	"ghl_webhook" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"pages_id" uuid,
  	"franchises_id" uuid,
  	"agents_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_navbar_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar,
  	"url" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "site_settings_footer_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings_footer_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_bottom_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"navbar_published" boolean DEFAULT true,
  	"navbar_logo_id" uuid,
  	"navbar_logo_text" varchar DEFAULT 'Future Franchise Owners',
  	"navbar_cta_button_enabled" boolean DEFAULT true,
  	"navbar_cta_button_label" varchar DEFAULT 'Get Started',
  	"navbar_cta_button_url" varchar DEFAULT '/contact',
  	"footer_published" boolean DEFAULT true,
  	"footer_company_name" varchar DEFAULT 'Future Franchise Owners',
  	"footer_tagline" varchar DEFAULT 'Your partner in franchise success',
  	"footer_copyright_text" varchar,
  	"footer_show_social_links" boolean DEFAULT true,
  	"footer_background_color" varchar DEFAULT '#0F172A',
  	"footer_text_color" varchar DEFAULT '#F1F5F9',
  	"site_name" varchar DEFAULT 'Future Franchise Owners',
  	"site_description" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_franchise_grid" ADD CONSTRAINT "pages_blocks_franchise_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ribbon" ADD CONSTRAINT "pages_blocks_ribbon_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_navbar_navigation_links" ADD CONSTRAINT "pages_blocks_navbar_navigation_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_navbar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_navbar" ADD CONSTRAINT "pages_blocks_navbar_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_navbar" ADD CONSTRAINT "pages_blocks_navbar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_cta_buttons" ADD CONSTRAINT "pages_blocks_hero_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_tags" ADD CONSTRAINT "pages_blocks_hero_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser_highlights" ADD CONSTRAINT "pages_blocks_about_teaser_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser_ctas" ADD CONSTRAINT "pages_blocks_about_teaser_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser" ADD CONSTRAINT "pages_blocks_about_teaser_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_teaser" ADD CONSTRAINT "pages_blocks_about_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action_ctas" ADD CONSTRAINT "pages_blocks_call_to_action_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_call_to_action"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog_highlights" ADD CONSTRAINT "pages_blocks_blog_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "franchises_tags" ADD CONSTRAINT "franchises_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_assigned_agent_id_agents_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."agents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents_specialties" ADD CONSTRAINT "agents_specialties_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_franchises_fk" FOREIGN KEY ("franchises_id") REFERENCES "public"."franchises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agents_fk" FOREIGN KEY ("agents_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navbar_links" ADD CONSTRAINT "site_settings_navbar_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_social_links" ADD CONSTRAINT "site_settings_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_footer_columns_links" ADD CONSTRAINT "site_settings_footer_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_footer_columns" ADD CONSTRAINT "site_settings_footer_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_bottom_links" ADD CONSTRAINT "site_settings_footer_bottom_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_navbar_logo_id_media_id_fk" FOREIGN KEY ("navbar_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "pages_blocks_franchise_grid_order_idx" ON "pages_blocks_franchise_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_franchise_grid_parent_id_idx" ON "pages_blocks_franchise_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_franchise_grid_path_idx" ON "pages_blocks_franchise_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_ribbon_order_idx" ON "pages_blocks_ribbon" USING btree ("_order");
  CREATE INDEX "pages_blocks_ribbon_parent_id_idx" ON "pages_blocks_ribbon" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ribbon_path_idx" ON "pages_blocks_ribbon" USING btree ("_path");
  CREATE INDEX "pages_blocks_navbar_navigation_links_order_idx" ON "pages_blocks_navbar_navigation_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_navbar_navigation_links_parent_id_idx" ON "pages_blocks_navbar_navigation_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_navbar_order_idx" ON "pages_blocks_navbar" USING btree ("_order");
  CREATE INDEX "pages_blocks_navbar_parent_id_idx" ON "pages_blocks_navbar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_navbar_path_idx" ON "pages_blocks_navbar" USING btree ("_path");
  CREATE INDEX "pages_blocks_navbar_logo_logo_image_idx" ON "pages_blocks_navbar" USING btree ("logo_image_id");
  CREATE INDEX "pages_blocks_hero_cta_buttons_order_idx" ON "pages_blocks_hero_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_cta_buttons_parent_id_idx" ON "pages_blocks_hero_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_tags_order_idx" ON "pages_blocks_hero_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_tags_parent_id_idx" ON "pages_blocks_hero_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_teaser_highlights_order_idx" ON "pages_blocks_about_teaser_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_teaser_highlights_parent_id_idx" ON "pages_blocks_about_teaser_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_teaser_ctas_order_idx" ON "pages_blocks_about_teaser_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_teaser_ctas_parent_id_idx" ON "pages_blocks_about_teaser_ctas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_teaser_order_idx" ON "pages_blocks_about_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_teaser_parent_id_idx" ON "pages_blocks_about_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_teaser_path_idx" ON "pages_blocks_about_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_teaser_image_idx" ON "pages_blocks_about_teaser" USING btree ("image_id");
  CREATE INDEX "pages_blocks_call_to_action_ctas_order_idx" ON "pages_blocks_call_to_action_ctas" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_ctas_parent_id_idx" ON "pages_blocks_call_to_action_ctas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_background_image_idx" ON "pages_blocks_call_to_action" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_blog_highlights_order_idx" ON "pages_blocks_blog_highlights" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_highlights_parent_id_idx" ON "pages_blocks_blog_highlights" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_highlights_path_idx" ON "pages_blocks_blog_highlights" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "franchises_tags_order_idx" ON "franchises_tags" USING btree ("_order");
  CREATE INDEX "franchises_tags_parent_id_idx" ON "franchises_tags" USING btree ("_parent_id");
  CREATE INDEX "franchises_logo_idx" ON "franchises" USING btree ("logo_id");
  CREATE INDEX "franchises_assigned_agent_idx" ON "franchises" USING btree ("assigned_agent_id");
  CREATE INDEX "franchises_updated_at_idx" ON "franchises" USING btree ("updated_at");
  CREATE INDEX "franchises_created_at_idx" ON "franchises" USING btree ("created_at");
  CREATE INDEX "agents_specialties_order_idx" ON "agents_specialties" USING btree ("_order");
  CREATE INDEX "agents_specialties_parent_id_idx" ON "agents_specialties" USING btree ("_parent_id");
  CREATE INDEX "agents_photo_idx" ON "agents" USING btree ("photo_id");
  CREATE INDEX "agents_updated_at_idx" ON "agents" USING btree ("updated_at");
  CREATE INDEX "agents_created_at_idx" ON "agents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_franchises_id_idx" ON "payload_locked_documents_rels" USING btree ("franchises_id");
  CREATE INDEX "payload_locked_documents_rels_agents_id_idx" ON "payload_locked_documents_rels" USING btree ("agents_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_navbar_links_order_idx" ON "site_settings_navbar_links" USING btree ("_order");
  CREATE INDEX "site_settings_navbar_links_parent_id_idx" ON "site_settings_navbar_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_social_links_order_idx" ON "site_settings_footer_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_social_links_parent_id_idx" ON "site_settings_footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_footer_columns_links_order_idx" ON "site_settings_footer_footer_columns_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_footer_columns_links_parent_id_idx" ON "site_settings_footer_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_footer_columns_order_idx" ON "site_settings_footer_footer_columns" USING btree ("_order");
  CREATE INDEX "site_settings_footer_footer_columns_parent_id_idx" ON "site_settings_footer_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_bottom_links_order_idx" ON "site_settings_footer_bottom_links" USING btree ("_order");
  CREATE INDEX "site_settings_footer_bottom_links_parent_id_idx" ON "site_settings_footer_bottom_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navbar_navbar_logo_idx" ON "site_settings" USING btree ("navbar_logo_id");`)
}

/**
 * Rollback initial database schema migration
 *
 * Drops all tables and types created in the up migration.
 *
 * @param {MigrateDownArgs} args - Migration arguments containing db connection
 * @returns {Promise<void>}
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_franchise_grid" CASCADE;
  DROP TABLE "pages_blocks_ribbon" CASCADE;
  DROP TABLE "pages_blocks_navbar_navigation_links" CASCADE;
  DROP TABLE "pages_blocks_navbar" CASCADE;
  DROP TABLE "pages_blocks_hero_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero_tags" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_about_teaser_highlights" CASCADE;
  DROP TABLE "pages_blocks_about_teaser_ctas" CASCADE;
  DROP TABLE "pages_blocks_about_teaser" CASCADE;
  DROP TABLE "pages_blocks_call_to_action_ctas" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages_blocks_blog_highlights" CASCADE;
  DROP TABLE "pages_blocks_map" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "franchises_tags" CASCADE;
  DROP TABLE "franchises" CASCADE;
  DROP TABLE "agents_specialties" CASCADE;
  DROP TABLE "agents" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_navbar_links" CASCADE;
  DROP TABLE "site_settings_footer_social_links" CASCADE;
  DROP TABLE "site_settings_footer_footer_columns_links" CASCADE;
  DROP TABLE "site_settings_footer_footer_columns" CASCADE;
  DROP TABLE "site_settings_footer_bottom_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_franchise_grid_category";
  DROP TYPE "public"."enum_pages_blocks_ribbon_background_color";
  DROP TYPE "public"."enum_pages_blocks_ribbon_text_color";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_about_teaser_ctas_style";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_ctas_style";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_alignment";
  DROP TYPE "public"."enum_pages_blocks_call_to_action_background_style";
  DROP TYPE "public"."enum_franchises_status";
  DROP TYPE "public"."enum_franchises_category";
  DROP TYPE "public"."enum_agents_specialties_category";`)
}
