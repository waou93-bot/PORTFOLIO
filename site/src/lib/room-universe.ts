export function initRoom() {
  document.querySelectorAll<HTMLElement>('[data-room]').forEach(root => {
    if(root.dataset.initialized)return;
    root.dataset.initialized='true';
    const abort=new AbortController(),{signal}=abort;
    const points=[...root.querySelectorAll<HTMLElement>('[data-room-point]')];
    const pause=root.querySelector<HTMLButtonElement>('[data-room-pause]')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let stopped=false,visible=false,disposed=false,opened:HTMLElement|null=null;
    let schedule=0,finish=0,closeTimer=0,last='',firstEffect=true;
    const clearEffect=()=>{clearTimeout(schedule);clearTimeout(finish);delete root.dataset.anomaly;delete root.dataset.arrived;};
    const allowed=()=>!disposed&&!stopped&&!reduced.matches&&visible&&!document.hidden&&!opened;
    const queue=()=>{
      clearTimeout(schedule);
      if(!allowed())return;
      schedule=window.setTimeout(()=>{
        if(!allowed())return;
        const choices=['band','reflection','light'].filter(kind=>kind!==last);
        last=firstEffect?'band':choices[Math.floor(Math.random()*choices.length)]!;
        firstEffect=false;
        root.dataset.anomaly=last;
        finish=window.setTimeout(()=>{delete root.dataset.anomaly;queue();},last==='light'?1800:last==='reflection'?800:600);
      },firstEffect?2200:9000+Math.random()*8000);
    };
    const close=()=>{
      clearTimeout(closeTimer);
      points.forEach(point=>{point.dataset.open='false';point.querySelector('button')!.setAttribute('aria-expanded','false');point.querySelector<HTMLElement>('.room-reveal')!.hidden=true;});
      opened=null;queue();
    };
    const open=(point:HTMLElement)=>{
      clearTimeout(closeTimer);
      if(opened===point)return;
      close();opened=point;clearEffect();
      point.dataset.open='true';point.querySelector('button')!.setAttribute('aria-expanded','true');point.querySelector<HTMLElement>('.room-reveal')!.hidden=false;
    };
    points.forEach(point=>{
      point.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')open(point);},{signal});
      point.addEventListener('pointerleave',()=>{if(!point.contains(document.activeElement))closeTimer=window.setTimeout(close,220);},{signal});
      point.addEventListener('focusin',()=>open(point),{signal});
      point.addEventListener('focusout',e=>{if(!point.contains(e.relatedTarget as Node))close();},{signal});
      point.querySelector('button')!.addEventListener('click',()=>open(point),{signal});
    });
    root.addEventListener('keydown',e=>{if(e.key==='Escape'){const trigger=opened?.querySelector('button');trigger?.focus();close();}},{signal});
    root.addEventListener('pointerdown',e=>{if(!(e.target as Element).closest('[data-room-point]'))close();},{signal});
    const sync=()=>{clearEffect();queue();pause.disabled=reduced.matches;pause.textContent=reduced.matches?'Mouvement réduit actif':stopped?'Réactiver les effets':'Mettre les effets en pause';pause.setAttribute('aria-pressed',String(stopped||reduced.matches));};
    pause.addEventListener('click',()=>{stopped=!stopped;sync();},{signal});
    reduced.addEventListener('change',sync,{signal});
    document.addEventListener('visibilitychange',sync,{signal});
    const observer=new IntersectionObserver(([entry])=>{visible=!!entry?.isIntersecting;sync();},{threshold:.15});observer.observe(root.querySelector('.room-scene')!);
    const image=root.querySelector<HTMLImageElement>('.room-base')!;
    void image.decode().then(()=>{if(!disposed&&!opened&&!stopped&&!reduced.matches){root.dataset.arrived='true';finish=window.setTimeout(()=>delete root.dataset.arrived,900);}}).catch(()=>{});
    document.addEventListener('astro:before-swap',()=>{disposed=true;clearEffect();clearTimeout(closeTimer);observer.disconnect();abort.abort();},{once:true});
  });
}
