import * as migration_20251016_013136 from './20251016_013136';
import * as migration_20251020_060257_add_text_color_to_tags from './20251020_060257_add_text_color_to_tags';

export const migrations = [
  {
    up: migration_20251016_013136.up,
    down: migration_20251016_013136.down,
    name: '20251016_013136',
  },
  {
    up: migration_20251020_060257_add_text_color_to_tags.up,
    down: migration_20251020_060257_add_text_color_to_tags.down,
    name: '20251020_060257_add_text_color_to_tags'
  },
];
