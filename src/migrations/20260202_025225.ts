import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_card_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_resources_grid_resources_button_action" AS ENUM('link', 'popup');
  CREATE TYPE "public"."enum_pages_blocks_resources_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_resources_grid_button_style" AS ENUM('primary', 'secondary', 'outline');
  CREATE TABLE "pages_blocks_image_card_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"button_text" varchar,
  	"button_link" varchar
  );
  
  CREATE TABLE "pages_blocks_resources_grid_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid,
  	"image_link" varchar,
  	"image_link_open_in_new_tab" boolean DEFAULT true,
  	"title" varchar,
  	"content" varchar,
  	"button_text" varchar,
  	"button_action" "enum_pages_blocks_resources_grid_resources_button_action" DEFAULT 'link',
  	"button_url" varchar,
  	"button_open_in_new_tab" boolean DEFAULT true,
  	"popup_heading" varchar DEFAULT 'Where Shall We Send Your Free PDF?',
  	"popup_submit_text" varchar DEFAULT 'Send Me The PDF',
  	"popup_success_message" varchar DEFAULT 'Thank you! Check your email for the download link.',
  	"popup_download_url" varchar
  );
  
  CREATE TABLE "pages_blocks_resources_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"published" boolean DEFAULT true,
  	"anchor_id" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"columns" "enum_pages_blocks_resources_grid_columns" DEFAULT '3',
  	"background_color" varchar DEFAULT '#ffffff',
  	"card_background_color" varchar DEFAULT '#ffffff',
  	"text_color" varchar DEFAULT '#1f2937',
  	"button_style" "enum_pages_blocks_resources_grid_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_add_to_cart" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_add_to_cart" CASCADE;
  ALTER TABLE "pages_blocks_image_card" DROP CONSTRAINT "pages_blocks_image_card_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_image_card_image_idx";
  ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "show_side_card" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "side_card_eyebrow" varchar;
  ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "side_card_heading" varchar;
  ALTER TABLE "pages_blocks_about_teaser" ADD COLUMN "side_card_description" varchar;
  ALTER TABLE "pages_blocks_call_to_action" ADD COLUMN "background_blur" numeric DEFAULT 0;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "initial_cards_to_show" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "cards_per_load" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "show_more_button_text" varchar DEFAULT 'Show More';
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "columns" "enum_pages_blocks_image_card_columns" DEFAULT '3';
  ALTER TABLE "franchises" ADD COLUMN "cc_main_contact" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "footer_background_image_id" uuid;
  ALTER TABLE "site_settings" ADD COLUMN "footer_background_blur" numeric DEFAULT 0;
  ALTER TABLE "site_settings" ADD COLUMN "footer_overlay_color" varchar DEFAULT '#000000';
  ALTER TABLE "site_settings" ADD COLUMN "footer_overlay_opacity" numeric DEFAULT 0.6;
  ALTER TABLE "pages_blocks_image_card_cards" ADD CONSTRAINT "pages_blocks_image_card_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_card_cards" ADD CONSTRAINT "pages_blocks_image_card_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_card"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_grid_resources" ADD CONSTRAINT "pages_blocks_resources_grid_resources_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_grid_resources" ADD CONSTRAINT "pages_blocks_resources_grid_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_resources_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_grid" ADD CONSTRAINT "pages_blocks_resources_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_card_cards_order_idx" ON "pages_blocks_image_card_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_card_cards_parent_id_idx" ON "pages_blocks_image_card_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_card_cards_image_idx" ON "pages_blocks_image_card_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_resources_grid_resources_order_idx" ON "pages_blocks_resources_grid_resources" USING btree ("_order");
  CREATE INDEX "pages_blocks_resources_grid_resources_parent_id_idx" ON "pages_blocks_resources_grid_resources" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_resources_grid_resources_image_idx" ON "pages_blocks_resources_grid_resources" USING btree ("image_id");
  CREATE INDEX "pages_blocks_resources_grid_order_idx" ON "pages_blocks_resources_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_resources_grid_parent_id_idx" ON "pages_blocks_resources_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_resources_grid_path_idx" ON "pages_blocks_resources_grid" USING btree ("_path");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_background_image_id_media_id_fk" FOREIGN KEY ("footer_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_footer_footer_background_image_idx" ON "site_settings" USING btree ("footer_background_image_id");
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "button_text";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "button_link";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_list_type";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_button_variant";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_button_size";
  DROP TYPE "public"."enum_pages_blocks_add_to_cart_alignment";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_add_to_cart_list_type" AS ENUM('wishlist', 'cart');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_button_variant" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_button_size" AS ENUM('sm', 'default', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_add_to_cart_alignment" AS ENUM('left', 'center', 'right');
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
  
  ALTER TABLE "pages_blocks_image_card_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_resources_grid_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_resources_grid" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_image_card_cards" CASCADE;
  DROP TABLE "pages_blocks_resources_grid_resources" CASCADE;
  DROP TABLE "pages_blocks_resources_grid" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_footer_background_image_id_media_id_fk";
  
  DROP INDEX "site_settings_footer_footer_background_image_idx";
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "image_id" uuid NOT NULL;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "button_text" varchar;
  ALTER TABLE "pages_blocks_image_card" ADD COLUMN "button_link" varchar;
  ALTER TABLE "pages_blocks_add_to_cart" ADD CONSTRAINT "pages_blocks_add_to_cart_franchise_id_franchises_id_fk" FOREIGN KEY ("franchise_id") REFERENCES "public"."franchises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_add_to_cart" ADD CONSTRAINT "pages_blocks_add_to_cart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_add_to_cart_order_idx" ON "pages_blocks_add_to_cart" USING btree ("_order");
  CREATE INDEX "pages_blocks_add_to_cart_parent_id_idx" ON "pages_blocks_add_to_cart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_add_to_cart_path_idx" ON "pages_blocks_add_to_cart" USING btree ("_path");
  CREATE INDEX "pages_blocks_add_to_cart_franchise_idx" ON "pages_blocks_add_to_cart" USING btree ("franchise_id");
  ALTER TABLE "pages_blocks_image_card" ADD CONSTRAINT "pages_blocks_image_card_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_card_image_idx" ON "pages_blocks_image_card" USING btree ("image_id");
  ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "show_side_card";
  ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "side_card_eyebrow";
  ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "side_card_heading";
  ALTER TABLE "pages_blocks_about_teaser" DROP COLUMN "side_card_description";
  ALTER TABLE "pages_blocks_call_to_action" DROP COLUMN "background_blur";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "initial_cards_to_show";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "cards_per_load";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "show_more_button_text";
  ALTER TABLE "pages_blocks_image_card" DROP COLUMN "columns";
  ALTER TABLE "franchises" DROP COLUMN "cc_main_contact";
  ALTER TABLE "site_settings" DROP COLUMN "footer_background_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "footer_background_blur";
  ALTER TABLE "site_settings" DROP COLUMN "footer_overlay_color";
  ALTER TABLE "site_settings" DROP COLUMN "footer_overlay_opacity";
  DROP TYPE "public"."enum_pages_blocks_image_card_columns";
  DROP TYPE "public"."enum_pages_blocks_resources_grid_resources_button_action";
  DROP TYPE "public"."enum_pages_blocks_resources_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_resources_grid_button_style";`)
}
