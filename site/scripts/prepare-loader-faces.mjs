import fs from 'node:fs/promises';
import sharp from 'sharp';
const output='public/media/identity/loader-faces';
await fs.mkdir(output,{recursive:true});
let bytes=0;
for(let i=1;i<=30;i++) {
 const name=`frame-${String(i).padStart(2,'0')}.webp`;
 await sharp(`public/media/identity/sequence-expression-v1/${name}`).resize({width:640}).webp({quality:76}).toFile(`${output}/${name}`);
 bytes+=(await fs.stat(`${output}/${name}`)).size;
}
console.log(`30 frames: ${bytes} bytes. Original frames preserved; framing is applied in CSS.`);
