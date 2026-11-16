import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT,readJSON} from '../src/core.ts';
import {learnedSkillContext} from '../src/learned-skills.ts';
import {messagesFor} from '../src/llm.ts';
const ids=r=>r.selected.map(s=>s.id);
test('Generic leveling task receives verification planning without irrelevant NPC skill',()=>{
 const r=learnedSkillContext('Aviso de experiência ao subir de nível');
 assert.deepEqual(ids(r),['verify-wow-client']);assert.equal(r.clientVerified,false);
});
test('Navigation and configurable panels route to UI recovery guidance',()=>{
 for(const prompt of ['Quero uma seta de navegação','Configuration interface and tracker','Painel de profissões'])assert.deepEqual(ids(learnedSkillContext(prompt)),['verify-wow-client','build-wow-ui']);
});
test('Blueprint APIs select NPC learning even with an ambiguous product name',()=>{
 const r=learnedSkillContext('Pulsar',{addonName:'Pulsar',apiNamespacesUsed:['C_NamePlate.GetNamePlateForUnit']});
 assert.deepEqual(ids(r),['verify-wow-client','build-wow-ui','highlight-quest-npcs']);assert.equal(r.clientVerified,false);
});
test('Missing historical evidence stops selection rather than silently claiming knowledge',()=>{
 const data=readJSON(path.join(ROOT,'knowledge/lessons/live-client.json'));data.skills[0].evidence=['research/missing-session.md'];
 assert.throws(()=>learnedSkillContext('NPC',null,{registry:data}),/ENOENT|Missing evidence/);
});
test('Registry cannot load outside files or silently promote historical verification',()=>{
 const data=readJSON(path.join(ROOT,'knowledge/lessons/live-client.json'));data.skills[0].path='../outside.md';assert.throws(()=>learnedSkillContext('',null,{registry:data}),/traversal|Escaping/);
 data.skills[0].path='.agents/skills/verify-wow-client/SKILL.md';data.status='CLIENT_VERIFIED';assert.throws(()=>learnedSkillContext('',null,{registry:data}),/Invalid learned skills registry/);
});
test('Configured generation receives selected local skills separately from untrusted references',()=>{
 const messages=messagesFor('Destaque de NPC','UNTRUSTED_REFERENCE_SENTINEL');
 assert.ok(messages[0].content.includes(learnedSkillContext('Destaque de NPC').instructions));
 assert.ok(!messages[0].content.includes('UNTRUSTED_REFERENCE_SENTINEL'));assert.ok(messages[1].content.includes('UNTRUSTED_REFERENCE_SENTINEL'));
});
test('Actual indexing makes partial client lessons retrievable without granting API support',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'forever-lessons-'));
 try{
 const code="const {indexDocuments}=await import('./rag/indexer.ts');const {openDb,capability}=await import('./src/db.ts');await indexDocuments({dirs:['knowledge/seed-docs']});const db=openDb();const rows=db.prepare(\"SELECT evidence,content FROM docs WHERE source_id='forever-live-client-lessons-2026-11-16'\").all();console.log(JSON.stringify({rows,cap:capability(db,'C_QuestLog.UnitIsRelatedToActiveQuest','70938')}));db.close();";
 const r=spawnSync(process.execPath,['--experimental-strip-types','--input-type=module','-e',code],{cwd:ROOT,env:{...process.env,FACTORY_DATA_DIR:dir},encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);const data=JSON.parse(r.stdout);assert.ok(data.rows.length>0);assert.ok(data.rows.every(r=>r.evidence==='PARTIAL_CLIENT_TESTED'));assert.ok(data.rows.some(r=>r.content.includes('UnitGUID')));assert.equal(data.cap.status,'UNVERIFIED');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('Windows CRLF checkout keeps skill discovery working',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'forever-skills-crlf-'));
 try{
 fs.mkdirSync(path.join(root,'.agents/skills/sample'),{recursive:true});
 fs.writeFileSync(path.join(root,'.agents/skills/sample/SKILL.md'),'---\r\nname: sample\r\ndescription: Validate a client interaction.\r\n---\r\nUse observed evidence.\r\n');
 fs.writeFileSync(path.join(root,'evidence.md'),'Observed partial session.');
 const registry={schemaVersion:1,status:'PARTIAL_CLIENT_TESTED',skills:[{id:'sample',path:'.agents/skills/sample/SKILL.md',applies:'always',evidence:['evidence.md']}]};
 assert.deepEqual(ids(learnedSkillContext('',null,{root,registry})),['sample']);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
