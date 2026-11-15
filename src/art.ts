import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {ensureDir} from './core.ts';
import path from 'node:path';
function crcTable(){return Array.from({length:256},(_,i)=>{let c=i;for(let b=0;b<8;b++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});}
const TABLE=crcTable();
function crc(bytes){let c=0xffffffff;for(const b of bytes)c=TABLE[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function pngChunk(type,data){const name=Buffer.from(type);const block=Buffer.alloc(8+data.length+4);block.writeUInt32BE(data.length,0);name.copy(block,4);data.copy(block,8);block.writeUInt32BE(crc(Buffer.concat([name,data])),8+data.length);return block;}
function drawArt(name,size){
 const seed=crypto.createHash('sha256').update(name).digest();
 const accent=[76+seed[0]%75,128+seed[1]%75,175+seed[2]%70];
 const pixels=Buffer.alloc(size*size*4);
 const polygon=[[-.02,-.77],[.12,-.2],[.77,-.02],[.2,.12],[.02,.77],[-.12,.2],[-.77,.02],[-.2,-.12]];
 function inside(x,y){let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const a=polygon[i],b=polygon[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes; }
  return yes;
 }
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=(x+.5-size/2)/(size/2),v=(y+.5-size/2)/(size/2),r=Math.hypot(u,v);
  const grid=(x%(size/16)<1)||(y%(size/16)<1);
  let rgb=[12+Math.round(12*(1-r)),21+Math.round(12*(1-r)),33+Math.round(11*(1-r))];
  if(grid)rgb=rgb.map(c=>c+5);
  if(Math.abs(r-.79)<.045)rgb=[45,110,153];
  if(Math.abs(r-.69)<.013)rgb=[216,182,105];
  const p=inside(u,v);
  if(p)rgb=[accent[0],accent[1],accent[2]];
  if(p&&Math.abs(u)<.14&&Math.abs(v)<.14)rgb=[216,182,105];
  if(r<.095)rgb=[19,38,55];
  if(Math.abs(r-.095)<.018)rgb=[232,231,204];
  const idx=(y*size+x)*4; pixels[idx]=Math.max(0,Math.min(255,rgb[0]));pixels[idx+1]=Math.max(0,Math.min(255,rgb[1]));pixels[idx+2]=Math.max(0,Math.min(255,rgb[2]));pixels[idx+3]=255;
 }
 return pixels;
}
function writeTga(file,pixels,size){
 const header=Buffer.alloc(18);header[2]=2;header.writeUInt16LE(size,12);header.writeUInt16LE(size,14);header[16]=32;header[17]=0x28;const body=Buffer.alloc(size*size*4);
 for(let i=0;i<size*size;i++){body[i*4]=pixels[i*4+2];body[i*4+1]=pixels[i*4+1];body[i*4+2]=pixels[i*4];body[i*4+3]=255;}
 fs.writeFileSync(file,Buffer.concat([header,body]));
}
function writePng(file,pixels,size){
 const rows=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++){rows[y*(size*4+1)]=0;pixels.copy(rows,y*(size*4+1)+1,y*size*4,(y+1)*size*4);}
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
 const data=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),pngChunk('IHDR',ihdr),pngChunk('IDAT',zlib.deflateSync(rows,{level:9})),pngChunk('IEND',Buffer.alloc(0))]);fs.writeFileSync(file,data);
}
export function generateAddonArt(name,assetDir,marketingDir){
 ensureDir(assetDir);ensureDir(marketingDir);const size=512;const pixels=drawArt(name,size);
 const tga=path.join(assetDir,'Icon.tga'),png=path.join(marketingDir,name+'-icon.png');
 writeTga(tga,pixels,size);writePng(png,pixels,size);return {tga,png};
}
