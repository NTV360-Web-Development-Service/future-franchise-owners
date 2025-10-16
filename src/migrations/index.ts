import * as migration_20251016_013136 from './20251016_013136';
import * as migration_20251016_022916 from './20251016_022916';

export const migrations = [
  {
    up: migration_20251016_013136.up,
    down: migration_20251016_013136.down,
    name: '20251016_013136',
  },
  {
    up: migration_20251016_022916.up,
    down: migration_20251016_022916.down,
    name: '20251016_022916'
  },
];
