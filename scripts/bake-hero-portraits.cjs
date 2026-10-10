// Precompose existing alpha portraits; source files remain unchanged.
const sharp = require('../site/node_modules/sharp');
const path = require('node:path');
const media = path.resolve(__dirname, '../site/public/media/identity');
const source = path.join(media, 'nicolas-jez-hero-bomber-v1-alpha.webp');
(async () => {
  const main = await sharp(source).modulate({ saturation: .88, brightness: .95 }).toBuffer();
  for (const [name, tint, offset] of [
    ['cyan', {r:0,g:210,b:255}, -24], ['red', {r:255,g:48,b:96}, 24],
  ]) {
    const tinted = await sharp(source).tint(tint).modulate({ brightness: .82 })
      .linear([1,1,1,.3],[0,0,0,0]).raw().toBuffer({resolveWithObject:true});
    const accent = await sharp(tinted.data,{raw:tinted.info}).extract({
      left: offset < 0 ? -offset : 0, top:0, width:1000, height:1536,
    }).png().toBuffer();
    const composed = await sharp({create:{width:1024,height:1536,channels:4,background:'#00000000'}})
      .composite([{input:accent,left:offset<0?0:offset,top:0},{input:main,left:0,top:0}])
      .png().toBuffer();
    for (const width of [384,768,1024]) await sharp(composed).resize({width})
      .webp({quality:90}).toFile(path.join(media,`nicolas-jez-static-${name}-${width}.webp`));
  }
})();
