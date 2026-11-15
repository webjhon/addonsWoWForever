import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import {ensureDir} from './core.ts';
const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(bytes){let c=0xffffffff;for(const byte of bytes)c=crcTable[(c^byte)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function fileEntries(dir,prefix=''){
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(ent=>{
  const full=path.join(dir,ent.name);if(ent.isSymbolicLink())throw Error('Symlinks not allowed in zip');
  const rel=prefix+ent.name;
  return ent.isDirectory()?fileEntries(full,rel+'/'):ent.isFile()?[{name:rel,bytes:fs.readFileSync(full)}]:[];
 });
}
export function createZip(source,out,rootName=path.basename(source)){
 const entries=fileEntries(source).map(e=>({...e,name:rootName+'/'+e.name}));
 const chunks=[],centrals=[];let offset=0;
 for(const e of entries){
  const name=Buffer.from(e.name,'utf8');const data=zlib.deflateRawSync(e.bytes);const crc=crc32(e.bytes);
  const loc=Buffer.alloc(30);loc.writeUInt32LE(0x04034b50,0);loc.writeUInt16LE(20,4);loc.writeUInt16LE(0x0800,6);loc.writeUInt16LE(8,8);loc.writeUInt32LE(crc,14);loc.writeUInt32LE(data.length,18);loc.writeUInt32LE(e.bytes.length,22);loc.writeUInt16LE(name.length,26);
  chunks.push(loc,name,data);
  const cen=Buffer.alloc(46);cen.writeUInt32LE(0x02014b50,0);cen.writeUInt16LE(20,4);cen.writeUInt16LE(20,6);cen.writeUInt16LE(0x0800,8);cen.writeUInt16LE(8,10);cen.writeUInt32LE(crc,16);cen.writeUInt32LE(data.length,20);cen.writeUInt32LE(e.bytes.length,24);cen.writeUInt16LE(name.length,28);cen.writeUInt32LE(offset,42);
  centrals.push(cen,name);offset+=loc.length+name.length+data.length;
 }
 const center=Buffer.concat(centrals);const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(center.length,12);end.writeUInt32LE(offset,16);
 ensureDir(path.dirname(out));fs.writeFileSync(out,Buffer.concat([...chunks,center,end]));return {out,files:entries.length,bytes:fs.statSync(out).size};
}
