// One small shared media blob survives the Astro route swap; released on document unload.
let prepared:Promise<boolean>|undefined;
let mediaUrl='';
export const preparedGalaxyUrl=()=>mediaUrl;
export function prepareGalaxy() {
  if(prepared)return prepared;
  prepared=(async()=>{
    const poster=new Image();poster.src='/media/transition/universe-v3-poster.jpg';
    const probe=document.createElement('video');probe.muted=true;probe.playsInline=true;probe.preload='auto';
    const source='/media/transition/universe-v3-fast.mp4';
    const response=await fetch(source,{cache:'force-cache'});
    if(!response.ok)return false;
    const blob=await response.blob();mediaUrl=URL.createObjectURL(blob);
    const decoded=new Promise<boolean>(resolve=>{
      const finish=(ok:boolean)=>{clearTimeout(timeout);probe.onloadeddata=null;probe.onerror=null;probe.removeAttribute('src');probe.load();resolve(ok)};
      const timeout=window.setTimeout(()=>finish(false),4500);
      probe.onloadeddata=()=>finish(true);probe.onerror=()=>finish(false);probe.src=mediaUrl;probe.load();
    });
    const [ready]=await Promise.all([decoded,poster.decode().catch(()=>undefined)]);
    return ready;
  })().catch(()=>false);
  return prepared;
}
