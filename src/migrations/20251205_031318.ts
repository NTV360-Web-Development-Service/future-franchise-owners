import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_add_to_cart_list_type" AS ENUM('wishlist', 'cart');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_button_variant" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_button_size" AS ENUM('sm', 'default', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_content_image_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_video_video_type" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum_audit_logs_operation" AS ENUM('create', 'update', 'delete');
  CREATE TYPE "public"."enum_site_settings_ticker_font_weight" AS ENUM('300', '400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_site_settings_ticker_text_align" AS ENUM('left', 'center', 'right');
  CREATE TABLE "pages_blocks_add_to_cart" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"franchise_id" uuid NOT NULL,
  	"list_type" "enum_pages_blocks_add_to_cart_list_type" DEFAULT 'wishlist',
  	"button_text" varchar,
  	"button_variant" "enum_pages_blocks_add_to_cart_button_variant" DEFAULT 'default',
  	"button_size" "enum_pages_blocks_add_to_cart_button_size" DEFAULT 'default',
  	"alignment" "enum_pages_blocks_add_to_cart_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"content" varchar,
  	"image_id" uuid,
  	"image_position" "enum_pages_blocks_content_image_image_position" DEFAULT 'right',
  	"button_text" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_grid_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar,
  	"background_color" varchar DEFAULT '#1e3a5f',
  	"text_color" varchar DEFAULT '#ffffff'
  );
  
  CREATE TABLE "pages_blocks_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"video_type" "enum_pages_blocks_video_video_type" DEFAULT 'link' NOT NULL,
  	"video_url" varchar,
  	"video_file_id" uuid,
  	"button_text" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"image_id" uuid NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "audit_logs_changed_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"collection" varchar NOT NULL,
  	"record_id" varchar NOT NULL,
  	"operation" "enum_audit_logs_operation" NOT NULL,
  	"user_id" uuid,
  	"changes" jsonb,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_map" ALTER COLUMN "description" SET DATA TYPE jsonb;
  ALTER TABLE "pages_blocks_map" ALTER COLUMN "description" DROP DEFAULT;
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "show_all_button" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "show_all_button_text" varchar DEFAULT 'See All';
  ALTER TABLE "pages_blocks_franchise_grid" ADD COLUMN "show_all_button_link" varchar;
  ALTER TABLE "pages" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "pages" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "franchises" ADD COLUMN "investment_badge_color" varchar;
  ALTER TABLE "franchises" ADD COLUMN "investment_badge_text_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "franchises" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "franchises" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "industries" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "industries" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "tags" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "tags" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "agents" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "agents" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "contact_submissions" ADD COLUMN "created_by_id" uuid;
  ALTER TABLE "contact_submissions" ADD COLUMN "updated_by_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_logs_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_text" varchar DEFAULT 'Special Offer: Contact us today!';
  ALTER TABLE "site_settings" ADD COLUMN "ticker_background_color" varchar DEFAULT '#2563eb';
  ALTER TABLE "site_settings" ADD COLUMN "ticker_text_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "site_settings" ADD COLUMN "ticker_font_size" numeric DEFAULT 14;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_font_weight" "enum_site_settings_ticker_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "ticker_is_moving" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_speed" numeric DEFAULT 30;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_text_align" "enum_site_settings_ticker_text_align" DEFAULT 'center';
  ALTER TABLE "site_settings" ADD COLUMN "ticker_link_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_link_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_dismissible" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "enable_cart" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "show_wishlist_button" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "show_cart_button" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_add_to_cart" ADD CONSTRAINT "pages_blocks_add_to_cart_franchise_id_franchises_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_add_to_cart" ADD CONSTRAINT "pages_blocks_add_to_cart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_image" ADD CONSTRAINT "pages_blocks_content_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_image" ADD CONSTRAINT "pages_blocks_content_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_cards_cards" ADD CONSTRAINT "pages_blocks_grid_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_grid_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_cards" ADD CONSTRAINT "pages_blocks_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_card" ADD CONSTRAINT "pages_blocks_image_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_card" ADD CONSTRAINT "pages_blocks_image_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs_changed_fields" ADD CONSTRAINT "audit_logs_changed_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_add_to_cart_order_idx" ON "pages_blocks_add_to_cart" USING btree ("_order");
  CREATE INDEX "pages_blocks_add_to_cart_parent_id_idx" ON "pages_blocks_add_to_cart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_add_to_cart_path_idx" ON "pages_blocks_add_to_cart" USING btree ("_path");
  CREATE INDEX "pages_blocks_add_to_cart_franchise_idx" ON "pages_blocks_add_to_cart" USING btree ("franchise_id");
  CREATE INDEX "pages_blocks_content_image_order_idx" ON "pages_blocks_content_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_image_parent_id_idx" ON "pages_blocks_content_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_image_path_idx" ON "pages_blocks_content_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_image_image_idx" ON "pages_blocks_content_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_grid_cards_cards_order_idx" ON "pages_blocks_grid_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_cards_cards_parent_id_idx" ON "pages_blocks_grid_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_cards_order_idx" ON "pages_blocks_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_cards_parent_id_idx" ON "pages_blocks_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_cards_path_idx" ON "pages_blocks_grid_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_video_file_idx" ON "pages_blocks_video" USING btree ("video_file_id");
  CREATE INDEX "pages_blocks_image_card_order_idx" ON "pages_blocks_image_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_card_parent_id_idx" ON "pages_blocks_image_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_card_path_idx" ON "pages_blocks_image_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_card_image_idx" ON "pages_blocks_image_card" USING btree ("image_id");
  CREATE INDEX "audit_logs_changed_fields_order_idx" ON "audit_logs_changed_fields" USING btree ("_order");
  CREATE INDEX "audit_logs_changed_fields_parent_id_idx" ON "audit_logs_changed_fields" USING btree ("_parent_id");
  CREATE INDEX "audit_logs_collection_idx" ON "audit_logs" USING btree ("collection");
  CREATE INDEX "audit_logs_record_id_idx" ON "audit_logs" USING btree ("record_id");
  CREATE INDEX "audit_logs_operation_idx" ON "audit_logs" USING btree ("operation");
  CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "franchises" ADD CONSTRAINT "franchises_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industries" ADD CONSTRAINT "industries_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tags" ADD CONSTRAINT "tags_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agents" ADD CONSTRAINT "agents_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_created_by_idx" ON "pages" USING btree ("created_by_id");
  CREATE INDEX "pages_updated_by_idx" ON "pages" USING btree ("updated_by_id");
  CREATE INDEX "franchises_created_by_idx" ON "franchises" USING btree ("created_by_id");
  CREATE INDEX "franchises_updated_by_idx" ON "franchises" USING btree ("updated_by_id");
  CREATE INDEX "industries_created_by_idx" ON "industries" USING btree ("created_by_id");
  CREATE INDEX "industries_updated_by_idx" ON "industries" USING btree ("updated_by_id");
  CREATE INDEX "tags_created_by_idx" ON "tags" USING btree ("created_by_id");
  CREATE INDEX "tags_updated_by_idx" ON "tags" USING btree ("updated_by_id");
  CREATE INDEX "agents_created_by_idx" ON "agents" USING btree ("created_by_id");
  CREATE INDEX "agents_updated_by_idx" ON "agents" USING btree ("updated_by_id");
  CREATE INDEX "contact_submissions_created_by_idx" ON "contact_submissions" USING btree ("created_by_id");
  CREATE INDEX "contact_submissions_updated_by_idx" ON "contact_submissions" USING btree ("updated_by_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_add_to_cart" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_content_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_grid_cards_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_grid_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_card" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_logs_changed_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_logs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_add_to_cart" CASCADE;
  DROP TABLE "pages_blocks_content_image" CASCADE;
  DROP TABLE "pages_blocks_grid_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_image_card" CASCADE;
  DROP TABLE "audit_logs_changed_fields" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_created_by_id_users_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_updated_by_id_users_id_fk";
  
  ALTER TABLE "franchises" DROP CONSTRAINT "franchises_created_by_id_users_id_fk";
  
  ALTER TABLE "franchises" DROP CONSTRAINT "franchises_updated_by_id_users_id_fk";
  
  ALTER TABLE "industries" DROP CONSTRAINT "industries_created_by_id_users_id_fk";
  
  ALTER TABLE "industries" DROP CONSTRAINT "industries_updated_by_id_users_id_fk";
  
  ALTER TABLE "tags" DROP CONSTRAINT "tags_created_by_id_users_id_fk";
  
  ALTER TABLE "tags" DROP CONSTRAINT "tags_updated_by_id_users_id_fk";
  
  ALTER TABLE "agents" DROP CONSTRAINT "agents_created_by_id_users_id_fk";
  
  ALTER TABLE "agents" DROP CONSTRAINT "agents_updated_by_id_users_id_fk";
  
  ALTER TABLE "contact_submissions" DROP CONSTRAINT "contact_submissions_created_by_id_users_id_fk";
  
  ALTER TABLE "contact_submissions" DROP CONSTRAINT "contact_submissions_updated_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audit_logs_fk";
  
  DROP INDEX "pages_created_by_idx";
  DROP INDEX "pages_updated_by_idx";
  DROP INDEX "franchises_created_by_idx";
  DROP INDEX "franchises_updated_by_idx";
  DROP INDEX "industries_created_by_idx";
  DROP INDEX "industries_updated_by_idx";
  DROP INDEX "tags_created_by_idx";
  DROP INDEX "tags_updated_by_idx";
  DROP INDEX "agents_created_by_idx";
  DROP INDEX "agents_updated_by_idx";
  DROP INDEX "contact_submissions_created_by_idx";
  DROP INDEX "contact_submissions_updated_by_idx";
  DROP INDEX "payload_locked_documents_rels_audit_logs_id_idx";
  ALTER TABLE "pages_blocks_map" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "pages_blocks_map" ALTER COLUMN "description" SET DEFAULT 'Explore our network of franchise locations and discover opportunities in your area.';
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "show_all_button";
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "show_all_button_text";
  ALTER TABLE "pages_blocks_franchise_grid" DROP COLUMN "show_all_button_link";
  ALTER TABLE "pages" DROP COLUMN "created_by_id";
  ALTER TABLE "pages" DROP COLUMN "updated_by_id";
  ALTER TABLE "franchises" DROP COLUMN "investment_badge_color";
  ALTER TABLE "franchises" DROP COLUMN "investment_badge_text_color";
  ALTER TABLE "franchises" DROP COLUMN "created_by_id";
  ALTER TABLE "franchises" DROP COLUMN "updated_by_id";
  ALTER TABLE "industries" DROP COLUMN "created_by_id";
  ALTER TABLE "industries" DROP COLUMN "updated_by_id";
  ALTER TABLE "tags" DROP COLUMN "created_by_id";
  ALTER TABLE "tags" DROP COLUMN "updated_by_id";
  ALTER TABLE "agents" DROP COLUMN "created_by_id";
  ALTER TABLE "agents" DROP COLUMN "updated_by_id";
  ALTER TABLE "contact_submissions" DROP COLUMN "created_by_id";
  ALTER TABLE "contact_submissions" DROP COLUMN "updated_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_logs_id";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_text";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_background_color";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_text_color";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_font_size";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_font_weight";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_is_moving";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_speed";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_text_align";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_link_url";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_link_open_in_new_tab";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_dismissible";
  ALTER TABLE "site_settings" DROP COLUMN "enable_cart";
  ALTER TABLE "site_settings" DROP COLUMN "show_wishlist_button";
  ALTER TABLE "site_settings" DROP COLUMN "show_cart_button";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_list_type";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_button_variant";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_button_size";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_alignment";
  DROP TYPE "public"."enum_pages_blocks_content_image_image_position";
  DROP TYPE "public"."enum_pages_blocks_video_video_type";
  DROP TYPE "public"."enum_audit_logs_operation";
  DROP TYPE "public"."enum_site_settings_ticker_font_weight";
  DROP TYPE "public"."enum_site_settings_ticker_text_align";`)
}
