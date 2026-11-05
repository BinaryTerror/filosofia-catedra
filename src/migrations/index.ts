import * as migration_20261104_201533_initial from './20261104_201533_initial';

export const migrations = [
  {
    up: migration_20261104_201533_initial.up,
    down: migration_20261104_201533_initial.down,
    name: '20261104_201533_initial'
  },
];
