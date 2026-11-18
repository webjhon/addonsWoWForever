import fs from 'node:fs';import {sha} from '../src/core.ts';import {generateMarketingIcon} from '../src/art.ts';
const dir='products/TonhoQuestGlow';
fs.copyFileSync('releases/TonhoQuestGlow-1.0.0.zip',dir+'/downloads/TonhoQuestGlow-1.0.0.zip');fs.writeFileSync(dir+'/downloads/TonhoQuestGlow-1.0.0.sha256',sha(fs.readFileSync(dir+'/downloads/TonhoQuestGlow-1.0.0.zip'))+'  TonhoQuestGlow-1.0.0.zip\n');
generateMarketingIcon('TonhoQuestGlow',dir+'/curseforge/icon-400.png',400);
// Preserve the reviewed bilingual portal changelog when restaging the same release.
if(!fs.existsSync(dir+'/curseforge/CHANGELOG.md'))fs.copyFileSync('addon-src/TonhoQuestGlow/CHANGELOG.md',dir+'/curseforge/CHANGELOG.md');
console.log('Prepared installer and 400px original pixel icon.');
