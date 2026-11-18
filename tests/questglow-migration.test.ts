import test from 'node:test';import fs from 'node:fs';import {run} from './auranpc/harness.ts';
test('QuestGlow migrates the available legacy profile once and keeps canonical preferences',()=>run(`
 local legacy=TonhoQuestGlowDB;AURA.settings.scale=1.4;AURA.settings.sound=true
 AURANPCDB=legacy;TonhoQuestGlowDB=nil;fire('PLAYER_LOGIN');assert(TonhoQuestGlowDB==legacy and AURA.settings.scale==1.4 and AURA.settings.sound)
 AURANPCDB={characters={}};fire('PLAYER_LOGIN');assert(TonhoQuestGlowDB==legacy and AURA.settings.scale==1.4)
`,{addon:'TonhoQuestGlow'}));
