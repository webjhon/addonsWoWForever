import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {ROOT} from '../src/core.ts';

test('Shipped AURANPC ZIP matches tested blueprint, original branding, installation layout and SHA256',()=>{
 const filename='AURANPC-2.1.1-candidate.zip';
 const bytes=fs.readFileSync(path.join(ROOT,'releases',filename));
 const hash=crypto.createHash('sha256').update(bytes).digest('hex');
 assert.equal(fs.readFileSync(path.join(ROOT,'releases/AURANPC-2.1.1-candidate.sha256'),'utf8').trim(),hash+'  '+filename);
 const entries=new Map<string,Buffer>();let offset=0;
 while(bytes.readUInt32LE(offset)===0x04034b50){
  const size=bytes.readUInt32LE(offset+18),n=bytes.readUInt16LE(offset+26),extra=bytes.readUInt16LE(offset+28);
  const name=bytes.subarray(offset+30,offset+30+n).toString();
  assert.ok(name.startsWith('AURANPC/')&&!name.includes('..'));assert.ok(!entries.has(name));
  const start=offset+30+n+extra,data=bytes.subarray(start,start+size);
 const raw=bytes.readUInt16LE(offset+8)===8?zlib.inflateRawSync(data):data;let crc=0xffffffff;for(const b of raw){crc^=b;for(let j=0;j<8;j++)crc=crc&1?0xedb88320^(crc>>>1):crc>>>1;}assert.equal((crc^0xffffffff)>>>0,bytes.readUInt32LE(offset+14));
  entries.set(name,bytes.readUInt16LE(offset+8)===8?zlib.inflateRawSync(data):data);offset=start+size;
 }
 assert.equal(bytes.readUInt32LE(offset),0x02014b50);
 const b=JSON.parse(fs.readFileSync(path.join(ROOT,'research/AURANPC/AURANPC.blueprint.json'),'utf8'));
 for(const f of b.files){
  const expected=f.filename.endsWith('.toc')?f.content.replace('\nData.lua','\nTonhoBranding.lua\nData.lua'):f.content;
  assert.equal(entries.get('AURANPC/'+f.filename)?.toString('utf8'),expected,'Stale package: '+f.filename);
 }
 const toc=entries.get('AURANPC/AURANPC.toc')!.toString();
 assert.match(toc,/^Items\.lua$/m);assert.ok(toc.indexOf('Items.lua')<toc.indexOf('Core.lua'));
 assert.match(toc,/## Author: Tonho Contrabando/);assert.ok(toc.indexOf('TonhoBranding.lua')<toc.indexOf('\nData.lua'));
 assert.deepEqual(entries.get('AURANPC/assets/TonhoHunter.tga'),fs.readFileSync(path.join(ROOT,'design-system/branding/TonhoHunter.tga')));
 const meta=JSON.parse(entries.get('AURANPC/FACTORY-VALIDATION.json')!.toString());
 assert.equal(meta.clientVerified,false);assert.equal(meta.productQuality.acceptanceTests,'PASSED');
 const icon=entries.get('AURANPC/assets/Icon.tga');assert.equal(icon.readUInt16LE(12),512);assert.equal(icon.readUInt16LE(14),512);assert.equal(icon[16],32);
 assert.ok(entries.has('AURANPC/Engine.lua')&&entries.has('AURANPC/Visuals.lua'));
 for(const f of b.files)assert.equal(fs.readFileSync(path.join(ROOT,'addon-src/AURANPC',f.filename),'utf8').replaceAll('\r\n','\n'),f.content,'Blueprint stale: '+f.filename);
});
