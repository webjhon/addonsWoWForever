export const PLAYER_FACTIONS=['Alliance','Horde'];
export function requireFaction(faction='Alliance'){
 if(!PLAYER_FACTIONS.includes(faction))throw Error('Faction must be Alliance or Horde');return faction;
}
// Legacy Neutral/Alliance-accessible records do not imply Horde eligibility.
export function accessFlags(record){
 if(!['Alliance','Horde','Neutral'].includes(record.faction))return {alliance:false,horde:false};
 return {alliance:record.faction==='Alliance'&&record.alliance_access!==false||record.faction==='Neutral'&&record.alliance_access===true,
  horde:record.faction==='Horde'&&record.horde_access!==false||record.faction==='Neutral'&&record.horde_access===true};
}
export function factionScope(faction='Alliance',alias=''){
 requireFaction(faction);if(!/^[a-z]*$/.test(alias))throw Error('Invalid SQL alias');const p=alias?alias+'.':'';
 return p+(faction==='Alliance'?'alliance_access':'horde_access')+"=1 AND "+p+"faction IN ('"+faction+"','Neutral')";
}
export function sharedAccess(a,b){const x=accessFlags(a),y=accessFlags(b);return x.alliance&&y.alliance||x.horde&&y.horde;}
