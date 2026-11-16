import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,readJSON,safeWithin} from '../src/core.ts';
import {validateBlueprint,scanLua,validateToc} from '../src/guards.ts';
import {buildAddon} from '../tools/build-addon.ts';
const fixture=path.join(ROOT,'evals/fixtures/alliance-level-pulse.blueprint.json');
test('demo blueprint is structurally valid',()=>assert.equal(validateBlueprint(readJSON(fixture)).ok,true));
test('Horde scope is rejected',()=>{const b=readJSON(fixture);b.faction='Horde';assert.equal(validateBlueprint(b).ok,false);});
test('wrong client interface is rejected',()=>{const b=readJSON(fixture);b.interfaceVersion=120000;assert.equal(validateBlueprint(b).ok,false);});
test('protected action and deprecated API are rejected',()=>{assert.equal(scanLua('UseAction(1)').ok,false);assert.equal(scanLua('GetSpellInfo(123)').ok,false);assert.equal(scanLua('-- UseAction(1)\nprint("UseAction(1)")').ok,true);});
test('TOC icon required',()=>{const b=readJSON(fixture);const toc=b.files[0].content.replace(/^## IconTexture:.*\n/m,'');assert.equal(validateToc(toc,b.addonName,16001).ok,false);});
test('unsafe paths rejected',()=>{assert.throws(()=>safeWithin(ROOT,'../../outside'));const b=readJSON(fixture);b.files.push({filename:'../escape.lua',content:'print(1)'});assert.equal(validateBlueprint(b).ok,false);});
test('actual ZIP candidate exists with original icon',()=>{const result=buildAddon(fixture);assert.equal(result.status,'STATIC_PASSED');assert.ok(fs.existsSync(result.out));assert.ok(fs.existsSync(path.join(result.destination,'assets/Icon.tga')));assert.equal(fs.readFileSync(result.out).subarray(0,2).toString(),'PK');});


test('all released addons require live telemetry and proactive action',()=>{
 const b=readJSON(fixture);delete b.interactivity;
 assert.match(validateBlueprint(b).errors.join(' | '),/interactivity contract/);
 const c=readJSON(fixture);c.interactivity.liveSignals=['level'];
 assert.equal(validateBlueprint(c).ok,false);
 const d=readJSON(fixture);d.interactivity.manualAsFallbackOnly=false;
 assert.equal(validateBlueprint(d).ok,false);
});

test('all released addons have Tonho Contrabando metadata and first-open branding',()=>{
 const b=readJSON(fixture);b.files[0].content=b.files[0].content.replace('Tonho Contrabando','Unknown');
 assert.equal(validateBlueprint(b).ok,false);
 const c=readJSON(fixture);c.files[1].content=c.files[1].content.replace('ns.TonhoBranding:RegisterWindow(frame)','');
 assert.equal(validateBlueprint(c).ok,false);
 const result=buildAddon(fixture);
 const toc=fs.readFileSync(path.join(result.addon,'AllianceLevelPulse.toc'),'utf8');
 assert.match(toc,/## Author: Tonho Contrabando/);
 assert.match(toc,/^TonhoBranding\.lua$/m);
 assert.ok(toc.indexOf('TonhoBranding.lua')<toc.indexOf('AllianceLevelPulse.lua'));
 assert.ok(fs.existsSync(path.join(result.addon,'assets','TonhoHunter.tga')));
 assert.ok(fs.existsSync(path.join(result.addon,'TonhoBranding.lua')));
});
