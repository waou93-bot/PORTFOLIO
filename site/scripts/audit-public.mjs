import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const origin='https://www.wadek.fr';
const output=process.argv[2]??'../SEO/AUDITS/post-deploy-evidence.json';
const report={checkedAt:new Date().toISOString(),origin,pages:[],redirects:[],resources:[],errors:[]};
const get=async(url)=>{
 for(let attempt=0;attempt<3;attempt++)try{const res=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});return {status:res.status,location:res.headers.get('location'),type:res.headers.get('content-type'),robotsHeader:res.headers.get('x-robots-tag'),body:await res.text()};}catch(error){if(attempt===2)return {status:0,location:null,type:null,robotsHeader:null,body:'',error:String(error.cause??error)};}
};
const attr=(html,name)=>html.match(new RegExp(`<meta[^>]*(?:name|property)="${name}"[^>]*content="([^"]*)"`))?.[1];
const sitemap=await get(origin+'/sitemap-0.xml');
report.sitemap={status:sitemap.status,urls:[...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])};
report.robots=await get(origin+'/robots.txt');
if(report.sitemap.urls.length!==12)report.errors.push('Expected twelve public sitemap pages');
if(report.robots.status!==200||!/Allow: \//.test(report.robots.body)||/Disallow: \//.test(report.robots.body))report.errors.push('Production robots unexpected');
for(const url of report.sitemap.urls){
 const r=await get(url);const canonical=r.body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
 const jsonLd=[];for(const m of r.body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){try{jsonLd.push(JSON.parse(m[1]));}catch{report.errors.push('Invalid JSON-LD '+url);}}
 const p={url,status:r.status,title:r.body.match(/<title>([^<]+)<\/title>/)?.[1],description:attr(r.body,'description'),canonical,robots:attr(r.body,'robots'),ogImage:attr(r.body,'og:image'),h1:(r.body.match(/<h1\b/g)||[]).length,jsonLd,sha256:crypto.createHash('sha256').update(r.body).digest('hex')};
 report.pages.push(p);if(r.status!==200||canonical!==url||p.h1!==1||!p.title||!p.description||p.robots?.includes('noindex')||r.robotsHeader?.includes('noindex'))report.errors.push('Public page invalid '+url);
}
for(const field of ['title','description'])if(new Set(report.pages.map(p=>p[field])).size!==report.pages.length)report.errors.push('Duplicate '+field);
for(const suffix of ['/autres-projets','/univers-montagnes-v2','/univers-galaxie-v2','/work/heritage-2','/work/maison-sillon','/work/vantel']){const r=await get(origin+suffix);report.redirects.push({url:origin+suffix,status:r.status,location:r.location});if(![301,308].includes(r.status)||!r.location?.includes('/work'))report.errors.push('Legacy redirect '+suffix);}
const atelier=await get(origin+'/univers-v2/'); report.atelier={status:atelier.status,pixelArt:atelier.body.includes('atelier-pixel-rgb-1680.webp'),projects:(atelier.body.match(/data-room-point/g)||[]).length};if(atelier.status!==200||!report.atelier.pixelArt||report.atelier.projects!==5)report.errors.push('Restored atelier invalid');
for(const url of ['http://www.wadek.fr/','https://wadek.fr/']){const r=await get(url);report.redirects.push({url,status:r.status,location:r.location});}
report.notFound=await get(origin+'/verification-page-inexistante-20261009/');if(report.notFound.status!==404)report.errors.push('Missing HTTP 404');
report.notFound={status:report.notFound.status,useful:report.notFound.body.includes("Retour à l'accueil"),noindex:report.notFound.body.includes('noindex')};
for(const url of [...new Set([origin+'/favicon.svg',origin+'/sitemap-index.xml',...report.pages.map(p=>p.ogImage).filter(Boolean)])]){const r=await get(url);report.resources.push({url,status:r.status,type:r.type});if(r.status!==200)report.errors.push('Resource '+url);}
await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checkedAt:report.checkedAt,pages:report.pages.length,redirects:report.redirects,notFound:report.notFound,errors:report.errors},null,2));
process.exitCode=report.errors.length?1:0;
