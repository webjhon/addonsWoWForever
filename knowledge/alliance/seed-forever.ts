import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../../src/core.ts';
import { upsertEntity } from '../../src/db.ts';

/** Import grounded editorial entities. Never auto-infer in-game IDs or coordinates. */
export function seedForever(db) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge/alliance/forever-official-seed.json'), 'utf8'));
  let count = 0;
  for (const record of data.entities) {
    if (record.faction === 'Horde' || !record.alliance_access) continue;
    upsertEntity(db, record);
    count++;
  }
  return {seedVersion: data.version, entitiesProcessed: count};
}
