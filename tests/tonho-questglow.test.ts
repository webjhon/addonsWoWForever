import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';import {run} from './auranpc/harness.ts';
// Node runs each test file in its own process. Re-execute every approved NPC/item
// behavior against the renamed product, in addition to preserving legacy tests.
process.env.FOREVER_ADDON_UNDER_TEST='TonhoQuestGlow';
await import('./auranpc.test.ts');await import('./auranpc-items.test.ts');
const {parse}=createRequire(import.meta.url)('luaparse');
test('QuestGlow runtime compiles as Lua5.1',()=>{for(const f of fs.readdirSync('addon-src/TonhoQuestGlow').filter(f=>f.endsWith('.lua')))assert.doesNotThrow(()=>parse(fs.readFileSync('addon-src/TonhoQuestGlow/'+f,'utf8'),{luaVersion:'5.1'}));});
test('QuestGlow open/close and aliases preserve all configuration controls',()=>run(`
 assert(SLASH_TonhoQuestGlow1=='/tqg' and SLASH_TonhoQuestGlow2=='/questglow' and SLASH_TonhoQuestGlow3=='/auranpc')
 SlashCmdList.TonhoQuestGlow('open');assert(AURA.window:IsShown());SlashCmdList.TonhoQuestGlow('close');assert(not AURA.window:IsShown())
 SlashCmdList.TonhoQuestGlow('abrir');assert(AURA.window:IsShown());SlashCmdList.TonhoQuestGlow('fechar');assert(not AURA.window:IsShown())
 assert(AURA.toggles.enabled and AURA.toggles.pulse and AURA.toggles.sound and AURA.toggles.banner and AURA.toggles.plates and AURA.toggles.lootItems and AURA.toggles.bagItems and AURA.toggles.itemPulse)
 local profile=TonhoQuestGlowDB;fire('PLAYER_LOGIN');assert(TonhoQuestGlowDB==profile)
`));
