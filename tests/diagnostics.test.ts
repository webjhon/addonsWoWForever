import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT} from '../src/core.ts';
import {parseProbe,importProbe} from '../src/diagnostics.ts';
import {openDb} from '../src/db.ts';
test('import SavedVariables fixture without eval',()=>{
 const file=path.join(ROOT,'evals/fixtures/probe-example.lua');const data=parseProbe(fs.readFileSync(file,'utf8'));
 assert.equal(data.interface,16001);assert.equal(data.build,'SYNTHETIC_BUILD');assert.equal(data.events.length,2);
 const db=openDb(':memory:');const result=importProbe(file,{db});assert.equal(result.status,'IMPORTED_UNVERIFIED');db.close();
});
test('malformed diagnostics are rejected',()=>assert.throws(()=>parseProbe('os.execute("whoami")')));
