import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),dir=path.join(root,'addon-src/TonhoQuestGlow');
const b=JSON.parse(fs.readFileSync(path.join(root,'research/TonhoQuestGlow/base-contract.json')));
b.files=fs.readdirSync(dir).filter(f=>/\.(lua|toc|md)$/.test(f)).sort().map(filename=>({filename,content:fs.readFileSync(path.join(dir,filename),'utf8').replaceAll('\r\n','\n')}));
fs.writeFileSync(path.join(root,'research/TonhoQuestGlow/TonhoQuestGlow.blueprint.json'),JSON.stringify(b,null,2)+'\n');console.log('Prepared Tonho QuestGlow public distribution.');
