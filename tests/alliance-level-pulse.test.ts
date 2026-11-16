import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
const b=JSON.parse(fs.readFileSync(path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json'),'utf8'));
const code=b.files.find(f=>f.filename.endsWith('.lua')).content;
test('reactive leveling recommendations vary by player XP',()=>{
  assert.match(code,/UnitLevel\("player"\)/);
  assert.match(code,/UnitXP\("player"\)/);
  assert.match(code,/pct\s*>=\s*85/);
  assert.match(code,/pct\s*>=\s*40/);
  assert.match(code,/nextAction/);
  assert.match(code,/PLAYER_XP_UPDATE/);
});
test('brand credits appear before player UI is opened',()=>{
  assert.match(code,/ns\.TonhoBranding:RegisterWindow\(frame\)/);
  assert.match(b.files[0].content,/## Author: Tonho Contrabando/);
});
