import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless:true });
const source=process.argv[2]||'galaxy-source-v2.mp4';
const stem=process.argv[3]||'galaxy';
try {
  const page = await browser.newPage({viewport:{width:1280,height:720}});
  await page.goto('http://127.0.0.1:4175/univers-v2', {waitUntil:'domcontentloaded'});
  await page.setContent(`<style>body{margin:0}video{width:1280px;height:720px;display:block}</style><video muted playsinline src="/media/transition/${source}"></video>`);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  console.log(await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight})));
  await page.locator('video').screenshot({path:`public/media/transition/${stem}-poster-v2.jpg`,type:'jpeg',quality:82});
  const bytes = await page.evaluate(async()=>{
    const video=document.querySelector('video');
    const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;
    const context=canvas.getContext('2d');
    const stream=canvas.captureStream(24);
    const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:1400000});
    const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    const finished=new Promise(resolve=>{recorder.onstop=async()=>resolve([...new Uint8Array(await new Blob(chunks).arrayBuffer())])});
    let frame;
    const draw=()=>{context.drawImage(video,0,0,1280,720);frame=requestAnimationFrame(draw)};
    video.currentTime=0;context.drawImage(video,0,0,1280,720);recorder.start();draw();
    video.onended=()=>{cancelAnimationFrame(frame);recorder.stop();stream.getTracks().forEach(t=>t.stop())};
    await video.play();return finished;
  });
  await writeFile(`public/media/transition/${stem}-web-v2.webm`,Buffer.from(bytes));
  console.log(`Optimized video: ${bytes.length} bytes`);
} finally { await browser.close(); }
