import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'addon-src/AllianceDungeonTrail');
const official='https://news.blizzard.com/en-us/article/24301455/explore-the-new-dungeons-of-world-of-warcraft-forever';
const wh='https://www.wowhead.com/forever/guide/dungeons/every-dungeon-quest-location';
const method=s=>'https://www.method.gg/wow-forever/dungeons/'+s;
const quest=id=>'https://www.wowhead.com/forever/quest='+id;
const catalog=[];
function d(key,name,level,high,zone,access,source=wh,evidence='COMMUNITY_UNVERIFIED • referência 1.60.1; conferir no cliente'){
 const item={key,name,level,high,zone,access,source,evidence,quests:[]};catalog.push(item);return item;
}
function q(d,name,pickup,guide,id=null,source=d.source,extra={}){
 d.quests.push({key:d.key+'-'+(d.quests.length+1),name,pickup,guide,...(id?{id}:{}),source,evidence:'COMMUNITY_UNVERIFIED • cliente pendente',faction:'AllianceAccessible',...extra});
}
let a=d('thanes','Hall of Thanes',13,18,'Ironforge','Prepare o grupo em Ironforge e procure o acesso subterrâneo.',official,'OFFICIAL_DOCUMENTATION • faixa publicada; build atual não confirmada');
q(a,'Important Heirlooms','Thom Filch • Old Ironforge.','Recupere as relíquias indicadas no diário; confira o inventário antes de voltar a Thom.',96403,quest(96403));
q(a,'The Treaty of Understanding','Objeto no cofre de Reliquary of Kings.','Procure o tratado no cofre; confira a missão iniciada pelo objeto.',98423,quest(98423));
a=d('lordaeron','Ruins of Lordaeron',15,20,'Tirisfal Glades','A Alliance precisa atravessar território hostil para alcançar as ruínas.',official,'OFFICIAL_DOCUMENTATION • faixa publicada; build atual não confirmada');
q(a,'Abominable Creatures','Captain Truman • entrada da dungeon; confira elegibilidade.','Derrote The Baron, recolha a cabeça e retorne a Truman. Não confunda saque com crédito de abate.',95250,quest(95250));
a=d('deadmines','The Deadmines',17,26,'Westfall','Entre pelas minas de Moonbrook. Parte das quests está nas cavernas antes do portal.',method('the-deadmines'));
q(a,'Collecting Memories','Wilder Thistlenettle • Dwarven District, Stormwind.','Explore a seção não instanciada das minas. Confira os itens exigidos no diário.');
q(a,'Oh Brother...','Wilder Thistlenettle • Dwarven District, Stormwind.','Resolva o objetivo na caverna anterior ao portal; não deixe para a run interna.');
q(a,'Underground Assault','Shoni the Shilent • Dwarven District, Stormwind.','Objetivo dentro da dungeon. Use o nome do alvo mostrado no diário como referência; confira o saque.');
q(a,'Red Silk Bandanas','Scout Riell • Sentinel Hill. Requer a cadeia Defias.','Confira as bandanas no diário ao longo da run. Saque os inimigos e revise a quantidade antes de sair.');
q(a,'The Defias Brotherhood','Gryan Stoutmantle • Sentinel Hill. Termine a cadeia anterior.','Use Edwin VanCleef como marco final da expedição. Confira o objetivo e o item antes de voltar a Gryan.');
q(a,'Destruction in Deadmines','Alba Fairmoon • cadeia iniciada em Testing the Wells.','Só entre com a etapa correta no diário; siga os objetivos dessa etapa e confira todos antes da saída.');
q(a,'The Unsent Letter','Saque de Edwin VanCleef.','Inspecione o saque do último boss. A carta inicia uma continuação que pode levar às quests de Stockade.');
q(a,'The Test of Righteousness','Jordan Stilwell • Ironforge. Cadeia Tome of Valor; paladino.','Quest de classe com objetivos em várias dungeons. Confira apenas a parte local e preserve os demais itens.',null,a.source,{class:'PALADIN'});
a=d('wailing','Wailing Caverns',17,25,'The Barrens','Planeje a viagem a Ratchet e consulte os NPCs da caverna antes de atravessar o portal.',method('wailing-caverns'));
q(a,'Smart Drinks','Mebok Mizzyrix • Ratchet. Faça Raptor Horns antes.','Observe o contador do diário ao saquear; não suponha que uma run fornece todos os itens.');
q(a,'Trouble at the Docks','Crane Operator Bigglefuzz • Ratchet.','Compare o alvo do diário com os inimigos da caverna. Confira o saque antes de prosseguir.');
q(a,'Deviate Eradication','Ebru • caverna da entrada.','Cheque cada tipo de criatura no diário; um tipo pendente pode exigir revisitar uma ramificação.');
q(a,'Deviate Hides','Nalpak • caverna da entrada.','Saque as criaturas e acompanhe as peles. Combine com o grupo uma revisão antes de encerrar.');
q(a,'The Glowing Shard','Item de Mutanus the Devourer.','Confira o saque ao final do evento. Sputtervalve em Ratchet é a referência para a continuação.');
a=d('shadowfang','Shadowfang Keep',21,28,'Silverpine Forest','Viagem em território hostil. Sem guia geral de quests Alliance validado; importe suas quests de classe.');
a=d('blackfathom','Blackfathom Deeps',24,32,'Ashenvale','Acesso na costa de Zoram Strand. Organize as quests de Darnassus, Auberdine e Ironforge antes da viagem.',method('blackfathom-deeps'));
q(a,'Knowledge in the Deeps','Gerrig Bonegrip • Forlorn Cave, Ironforge.','Procure o objeto descrito no diário; confira inventário antes de voltar a Ironforge.');
q(a,'Researching the Corruption','Gershala Nightwhisper • Auberdine.','Confira o contador de pesquisa enquanto explora e saqueia a dungeon.');
q(a,'Twilight Falls','Argent Guard Manados • Craftsman’s Terrace, Darnassus.','Use os cultistas Twilight como referência e confira os itens indicados no diário.');
q(a,'In Search of Thaelrid','Dawnwatcher Shaedlass • Darnassus.','Procure Argent Guard Thaelrid perto da região de Ghamoo-ra; confirme a continuação com ele.');
q(a,'Blackfathom Villainy','Argent Guard Thaelrid • dentro da dungeon; etapa anterior necessária.','Leia a missão recebida de Thaelrid antes de avançar. Confira alvo, saque e destino de entrega no diário.');
a=d('stockade','The Stockade',24,32,'Stormwind','Acesso na cidade. Faça uma rota de coleta em Stormwind, Lakeshire, Darkshire e Dun Modr.',method('the-stockade'));
q(a,'Quell the Uprising','Warden Thelwater • fora da prisão.','Confira os tipos de prisioneiros no diário antes de deixar os corredores.');
q(a,'The Color of Blood','Nikova Raskol • Old Town, Stormwind.','Saque os prisioneiros e confira a coleta do diário antes da saída.');
q(a,'Crime and Punishment','Councilman Millstipe • Darkshire.','Procure Targorr the Dread nas celas do primeiro corredor; confira o item exigido.');
q(a,'What Comes Around...','Guard Berton • Lakeshire.','Dextren Ward fica ao fim do corredor esquerdo; confira o saque solicitado.');
q(a,'The Fury Runs Deep','Motley Garmason • Dun Modr. Requer The Dark Iron War.','Kam Deepfury é a referência no corredor direito; confira o objetivo no diário.');
q(a,'The Stockade Riots','Warden Thelwater • continuação de The Unsent Letter.','Procure Bazil Thredd e confira a conclusão da etapa antes de voltar ao carcereiro.');
a=d('excavation','Excavation Site: Wetlands',26,31,'Wetlands','Faixa 26–31 é conservadora: há referências antigas de 24–29. Confirme o grupo e os requisitos no cliente.',official,'UNVERIFIED • divergência de faixas: anúncio 24–29 / referências posteriores 26–31');
q(a,'Songblade Search','Dorin Songblade • Lakeshire, Redridge. Disponibilidade relatada como divergente.','Procure Daewyn na escavação. A localização exata da entrega deve ser conferida no diário.',95772,quest(95772));
a=d('gnomeregan','Gnomeregan',30,38,'Dun Morogh','Não confunda os objetivos das cavernas externas com os da instância. O acesso secundário pode exigir chave.',method('gnomeregan'));
q(a,"Save Techbot's Brain!",'Tinkmaster Overspark • Tinkertown, Ironforge.','Techbot está fora da seção instanciada; revise essa quest antes de atravessar o portal.');
q(a,'Essential Artificials','Klockmort Spannerspan • Tinkertown, Ironforge.','Use os objetos descritos no diário como referência nas salas; revise a coleta antes de sair.');
q(a,'Data Rescue','Master Mechanic Castpipe • Tinkertown, Ironforge.','Confira as etapas de dados do diário antes de avançar entre as seções da cidade.');
q(a,'The Grand Betrayal','High Tinker Mekkatorque • Tinkertown, Ironforge.','Mekgineer Thermaplugg é o marco final; confira o crédito da quest antes de encerrar.');
q(a,'Gnogaine','Ozzie Togglevolt • Kharanos.','A primeira parte é externa. Volte a Ozzie para pegar The Only Cure is More Green Glow antes da run interna.');
a=d('dalaran','City of Dalaran',28,33,'Alterac Mountains','Alliance: comece o acesso com An Alarming Request, Emissary Jacques em Southshore. Confirme as etapas no cliente.',official,'OFFICIAL_DOCUMENTATION • acesso e faixa publicados; cliente pendente');
q(a,'Power Overwhelming','High Sorcerer Andromath • Stormwind.','Derrote Arcanic Enigma, a referência de elemental de mana do diário, e volte a Andromath.',92489,quest(92489));
a=d('kraul','Razorfen Kraul',28,34,'The Barrens','Prepare a viagem pelo sul dos Barrens; obtenha as quests externas antes de ir ao portal.',method('razorfen-kraul'));
q(a,'The Crone of the Kraul','Falfindel Waywarder • Feralas; requer Lonebrow’s Journal.','Charlga Razorflank é a referência de boss para esta cadeia. Confira o item do diário.');
q(a,'Mortality Wanes','Heralath Fallowbrook • dentro da instância.','Procure o NPC interno e leia o objetivo antes de abandonar a área do boss final.');
q(a,'Blueleaf Tubers','Mebok Mizzyrix • Ratchet. Recolha também os itens da quest próximos dele.','Use manualmente os itens conforme o diário. Confira a coleta de tubérculos antes de sair.');
q(a,'Willix the Importer','Willix • dentro da dungeon.','Combine o início da escolta com o grupo; permaneça com o NPC e confirme o crédito ao terminar.');
a=d('scarlet','Scarlet Monastery',32,45,'Tirisfal Glades','Confirme qual ala o grupo fará. Biblioteca, Arsenal e Catedral têm objetivos distintos; confirme as chaves.');
q(a,'Mythology of the Titans','Librarian Mae Paledust • Ironforge.','Procure o livro na ala Biblioteca e confira a coleta antes de retornar a Mae.',1050,quest(1050));
q(a,'In the Name of the Light','Raleigh the Devout • Southshore; cadeia Brother Anton.','Confira Loksey na Biblioteca, Herod no Arsenal e Mograine/Whitemane na Catedral. Uma única ala não conclui a quest.',1053,quest(1053));
a=d('downs','Razorfen Downs',37,44,'The Barrens','Confira as quests antes da longa viagem. Objetivos de escolta devem ser combinados com todo o grupo.');
q(a,'Bring the Light','Archbishop Benedictus • Cathedral, Stormwind.','Amnennar the Coldbringer é a referência final; confira o crédito e retorne à Cathedral.',3636,quest(3636));
a=d('drowned','The Drowned City',35,40,'Stranglethorn Vale','A entrada é submersa, na costa a oeste de Grom’gol. Confirme a disponibilidade no cliente.',official,'OFFICIAL_DOCUMENTATION • anúncio; disponibilidade atual UNVERIFIED');
q(a,'Magics of the Drowned City','Loremaster Dibbs • Southshore; confirme pré-quests.','Confira os objetos mágicos pedidos no diário enquanto explora a cidade; não deixe coletas para depois da saída.',95788,quest(95788));
q(a,'Shady Saltseers','Krazek • Booty Bay.','Procure os Saltseers descritos no diário e confira o crédito de cada objetivo.',95789,quest(95789));
a=d('uldaman','Uldaman',40,47,'Badlands','Confira objetivos da escavação exterior antes de atravessar o portal.');
q(a,'The Lost Dwarves','Prospector Stormpike • Hall of Explorers, Ironforge.','Encontre os anões perdidos na escavação e confira a continuação no diário.',2398,quest(2398));
q(a,'The Platinum Discs','Discs of Norgannon • sala após Archaedas.','Depois de Archaedas, interaja manualmente com os discos e leia todas as etapas oferecidas.',2278,quest(2278));
a=d('kroldok',"Krol'dok Stronghold",40,45,'Riverglades','Procure as cadeias de Farholde Keep antes da viagem. Disponibilidade atual deve ser confirmada.',official,'OFFICIAL_DOCUMENTATION • anúncio; disponibilidade atual UNVERIFIED');
q(a,'Eye of Mugg','Commander Brant • Farholde Keep; confirme pré-quests.','Derrote o líder e recupere Eye of Mugg; confira o saque antes de voltar ao comandante.',94982,quest(94982));
q(a,'Tome of Twilight','Ashe Amberhall • Farholde Keep; confirme a cadeia anterior.','Nar’gurk é a referência. Derrote-o, recolha o tomo e confira o diário.',94984,quest(94984));
a=d('zulfarrak',"Zul'Farrak",44,50,'Tanaris','Prepare as quests em Gadgetzan. Combine previamente eventuais itens necessários para invocações.');
q(a,'Divino-matic Rod','Chief Engineer Bilgewhizzle • Gadgetzan.','Confira o objetivo associado à área da pirâmide e o item no saque; revise antes de sair.',2768,quest(2768));
q(a,"Gahz'rilla",'Wizzle Brassbolts • Shimmering Flats.','Confirme se o grupo possui os requisitos para invocar Gahz’rilla; confira o objetivo e o saque ao concluir.',2770,quest(2770));
a=d('maraudon','Maraudon',44,50,'Desolace','Combine qual entrada e quais alas serão percorridas; atalhos podem pular objetivos.');
q(a,'Corruption of Earth and Seed','Keeper Marandis • Nijel’s Point.','Princess Theradras é o marco do objetivo. Confira o crédito antes de abandonar a área final.',7065,quest(7065));
q(a,'Legends of Maraudon','Cavindra • área externa da ala laranja.','Confira as partes pedidas no diário e combine ambas as alas com o grupo antes de usar atalhos.',7044,quest(7044));
a=d('temple',"Temple of Atal'Hakkar",49,54,'Swamp of Sorrows','Revise as cadeias externas e quests de classe. Não entre sem definir as áreas que o grupo pretende completar.');
q(a,"Jammal'an the Prophet",'Atal’ai Exile • Hinterlands.','Jammal’an é a referência de boss; confira a cabeça pedida no diário antes da volta.',1446,quest(1446));
q(a,'The Essence of Eranikus','Item de Shade of Eranikus.','Confira o saque e a interação indicada no diário; a gema deve ser tratada como etapa de quest.',3373,quest(3373));
a=d('alcaz','Alcaz Prison',48,53,'Dustwallow Marsh','Ilha de Alcaz. Sem quests Alliance verificadas nesta edição: use Diário para checklist e notas próprias.',official,'OFFICIAL_DOCUMENTATION • anúncio; disponibilidade e quests UNVERIFIED');
a=d('depths','Blackrock Depths',52,60,'Blackrock Mountain','Defina o trecho da run: prisão, áreas intermediárias e percurso final são expedições diferentes.');
q(a,'Incendius!','Jalinda Sprig • Morgan’s Vigil. Requer Overmaster Pyron.','Lord Incendius é a referência; confira o objetivo e retorne a Jalinda.',4263,quest(4263));
q(a,'Marshal Windsor','Marshal Maxwell • Morgan’s Vigil; cadeia Dragonkin Menace.','Procure Windsor na prisão. Esta etapa não equivale automaticamente à escolta Jail Break!.',4241,quest(4241));
a=d('diremaul','Dire Maul',54,60,'Feralas','Defina a ala: Leste, Oeste ou Norte. As quests e o objetivo da run mudam entre elas.');
q(a,"Lethtendris's Web",'Latronicus Moonspear • Feathermoon Stronghold.','Ala Leste, Warpwood Quarter: procure Lethtendris e confira a teia no saque.',7488,quest(7488));
q(a,'Free Knot!','Knot Thimblejack • ala Norte.','Obtenha Gordok Shackle Key e liberte Knot manualmente. Combine antes com o grupo se estiver fazendo Tribute.',5525,quest(5525));
a=d('lower-spire','Lower Blackrock Spire',56,60,'Blackrock Mountain','Somente a parte inferior, para leveling. Este guia não inclui raids nem jornadas de attunement.');
q(a,'Put Her Down','Helendis Riverhorn • Morgan’s Vigil.','Mother Smolderweb é o alvo de referência. Confira o crédito no diário antes de sair.',4701,quest(4701));
a=d('stratholme','Stratholme',56,60,'Eastern Plaguelands','Combine o lado da run antes da entrada. Confira chaves e quests em Light’s Hope Chapel.');
q(a,'The Archivist','Duke Nicholas Zverenhoff • Light’s Hope Chapel.','Lado Scarlet: procure Archivist Galford e confira também o objeto exigido pelo diário.',5251,quest(5251));
q(a,'Houses of the Holy','Leonid Barthalomew • Light’s Hope Chapel.','Explore as casas indicadas e confira a coleta de água no diário antes de fechar o percurso.',5243,quest(5243));
a=d('scholomance','Scholomance',56,60,'Western Plaguelands','Confira acesso em Caer Darrow; obtenha quests em Chillwind Camp e Light’s Hope Chapel antes de partir.');
q(a,'Barov Family Fortune','Weldon Barov • Chillwind Camp.','Revise cada escritura no diário: são objetivos separados em diferentes salas.',5343,quest(5343));
q(a,'Plagued Hatchlings','Betina Bigglezink • Light’s Hope Chapel.','Procure a área de filhotes e acompanhe o contador do diário.',5529,quest(5529));
q(a,'Doctor Theolen Krastinov, the Butcher','Eva Sarkhoff • Caer Darrow.','Krastinov e os restos mencionados no diário são referências distintas; confira todos os objetivos.',5382,quest(5382));
a=d('blackmaw','Blackmaw Hold',55,60,'Azshara','Confira o acesso e a disponibilidade no cliente. Sem quests curadas; importe suas missões do diário.',official,'OFFICIAL_DOCUMENTATION • anúncio; disponibilidade e quests UNVERIFIED');
a=d('shapers',"Shaper's Terrace",58,60,'Un’Goro Crater','Colinas ao norte de Un’Goro. Confira cristais e consoles no diário; sem catálogo de quests validado nesta edição.',official,'OFFICIAL_DOCUMENTATION • anúncio; disponibilidade e quests UNVERIFIED');
// Stable order makes equal-level alternatives visible without inventing an optimal route.
catalog.sort((a,b)=>a.level-b.level);
function lua(v){
 if(v===null)return 'nil'; if(typeof v==='string')return JSON.stringify(v);
 if(typeof v==='number'||typeof v==='boolean')return String(v);
 if(Array.isArray(v))return '{'+v.map(lua).join(',\n')+'}';
 return '{'+Object.entries(v).map(([k,x])=>'['+lua(k)+']='+lua(x)).join(',')+'}';
}
fs.writeFileSync(path.join(out,'Data.lua'),'local _, A = ...\nA.catalog = '+lua(catalog)+'\n');
fs.writeFileSync(path.join(root,'research/AllianceDungeonTrail/catalog.json'),JSON.stringify(catalog,null,2)+'\n');
const toc=`## Interface: 16001
## Title: Alliance Dungeon Trail
## Notes: Alliance 1-60 dungeon planner, quest checklist and measured run estimates.
## Author: Alliance Addon Factory
## Version: 1.0.0
## X-Flavor: Forever
## IconTexture: Interface\\AddOns\\AllianceDungeonTrail\\assets\\Icon.tga
## SavedVariables: AllianceDungeonTrailDB
Data.lua
Core.lua
UI.lua
`;
fs.writeFileSync(path.join(out,'AllianceDungeonTrail.toc'),toc);
const api=['CreateFrame','UnitFactionGroup','UnitLevel','UnitXP','UnitXPMax','UnitGUID','UnitClass','GetBuildInfo','InCombatLockdown','issecretvalue','issecrettable','C_QuestLog.GetNumQuestLogEntries','C_QuestLog.GetInfo','C_QuestLog.GetQuestObjectives','C_QuestLog.IsComplete','C_QuestLog.IsQuestFlaggedCompleted','date'];
const source='https://github.com/Thunderz96/forever-addon-kit/blob/8dc297689059dd204bf8663a05aaa36d6a628b76/data/forever_api.json • captured 1.60.1 build 69893 / interface 16001; presence only, current signatures and restrictions UNVERIFIED';
const files=fs.readdirSync(out).filter(f=>/\.(lua|toc|md)$/.test(f)).map(filename=>({filename,content:fs.readFileSync(path.join(out,filename),'utf8')}));
const blueprint={addonName:'AllianceDungeonTrail',game:'WoW Forever',faction:'Alliance',purpose:'leveling',minLevel:1,maxLevel:60,interfaceVersion:16001,version:'1.0.0',eventsRegistered:['PLAYER_LOGIN','PLAYER_ENTERING_WORLD','PLAYER_XP_UPDATE','PLAYER_LEVEL_UP','QUEST_LOG_UPDATE','QUEST_TURNED_IN','PLAYER_REGEN_ENABLED'],apiNamespacesUsed:api,apiEvidence:api.map(symbol=>({symbol,status:'UNVERIFIED',source})),files};
blueprint.apiEvidence.push(...blueprint.eventsRegistered.map(symbol=>({symbol,status:'UNVERIFIED',source:'Event names/signatures not established by the function-presence snapshot; manual 70938 client observation required. research/AllianceDungeonTrail/RESEARCH.md'})));
fs.writeFileSync(path.join(root,'research/AllianceDungeonTrail/AllianceDungeonTrail.blueprint.json'),JSON.stringify(blueprint,null,2)+'\n');
console.log(`Prepared ${catalog.length} dungeons, ${catalog.reduce((n,d)=>n+d.quests.length,0)} curated quests; blueprint regenerated from original sources.`);
