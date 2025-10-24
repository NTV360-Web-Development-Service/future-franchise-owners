/**
 * Database Migrations Index
 *
 * This file exports all database migrations in chronological order.
 * Migrations are executed sequentially by Payload CMS to manage
 * database schema changes across different environments.
 *
 * @module migrations
 */

import * as migration_20251016_013136 from './20251016_013136'
import * as migration_20251020_060257_add_text_color_to_tags from './20251020_060257_add_text_color_to_tags'
import * as migration_20251024_071255_change_about_teaser_description_to_richtext from './20251024_071255_change_about_teaser_description_to_richtext'

/**
 * Array of all database migrations
 *
 * Each migration contains:
 * - up: Function to apply the migration
 * - down: Function to rollback the migration
 * - name: Unique identifier for the migration
 *
 * Migrations are executed in the order they appear in this array.
 *
 * @constant {Array<{up: Function, down: Function, name: string}>}
 */
export const migrations = [
  {
    up: migration_20251016_013136.up,
    down: migration_20251016_013136.down,
    name: '20251016_013136',
  },
  {
    up: migration_20251020_060257_add_text_color_to_tags.up,
    down: migration_20251020_060257_add_text_color_to_tags.down,
    name: '20251020_060257_add_text_color_to_tags',
  },
  {
    up: migration_20251024_071255_change_about_teaser_description_to_richtext.up,
    down: migration_20251024_071255_change_about_teaser_description_to_richtext.down,
    name: '20251024_071255_change_about_teaser_description_to_richtext',
  },
]
