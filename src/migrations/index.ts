import * as migration_20251016_013136 from './20251016_013136';
import * as migration_20251020_060257_add_text_color_to_tags from './20251020_060257_add_text_color_to_tags';
import * as migration_20251024_071255_change_about_teaser_description_to_richtext from './20251024_071255_change_about_teaser_description_to_richtext';
import * as migration_20251029_022654 from './20251029_022654';

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
  {
    up: migration_20251029_022654.up,
    down: migration_20251029_022654.down,
    name: '20251029_022654'
  },
];
