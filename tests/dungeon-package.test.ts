import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {ROOT} from '../src/core.ts';

test('Shipped 3.1 ZIP matches tested blueprint, original branding, installation layout and SHA256',()=>{
 const filename='AllianceDungeonTrail-3.1.0-candidate.zip';
 const bytes=fs.readFileSync(path.join(ROOT,'releases',filename));
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 assert.equal(fs.readFileSync(path.join(ROOT,'releases/AllianceDungeonTrail-3.1.0-candidate.sha256'),'utf8').trim(),hash+'  '+filename);
 const entries=new Map<string,Buffer>();let offset=0;
 while(bytes.readUInt32LE(offset)===0x04034b50){
  const size=bytes.readUInt32LE(offset+18),n=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
  const name=bytes.subarray(offset+30,offset+30+n).toString();
  assert.ok(name.startsWith('AllianceDungeonTrail/')&&!name.includes('..'));assert.ok(!entries.has(name));
  const start=offset+30+n+extra,data=bytes.subarray(start,start+size);
  entries.set(name,bytes.readUInt16LE(offset+8)===8?zlib.inflateRawSync(data):data);offset=start+size;
 }
 assert.equal(bytes.readUInt32LE(offset),0x02014b50);
 const b=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AllianceDungeonTrail/AllianceDungeonTrail.blueprint.json'),'utf8'));
 for(const f of b.files){
  const expected=f.filename.endsWith('.toc')?f.content.replace('\nData.lua','\nTonhoBranding.lua\nData.lua'):f.content;
  assert.equal(entries.get('AllianceDungeonTrail/'+f.filename)?.toString('utf8'),expected,'Stale package: '+f.filename);
 }
 const toc=entries.get('AllianceDungeonTrail/AllianceDungeonTrail.toc')!.toString();
 assert.match(toc,/## Author: Tonho Contrabando/);assert.ok(toc.indexOf('TonhoBranding.lua')<toc.indexOf('\nData.lua'));
 assert.deepEqual(entries.get('AllianceDungeonTrail/assets/TonhoHunter.tga'),fs.readFileSync(path.join(ROOT,'design-system/branding/TonhoHunter.tga')));
 const meta=JSON.parse(entries.get('AllianceDungeonTrail/FACTORY-VALIDATION.json')!.toString());
 assert.equal(meta.clientVerified,false);assert.equal(meta.productQuality.acceptanceTests,'PASSED');
 assert.ok(entries.has('AllianceDungeonTrail/assets/Arrow.tga'));
 assert.ok(entries.has('AllianceDungeonTrail/Adapters.lua')&&entries.has('AllianceDungeonTrail/Navigation.lua'));
});
