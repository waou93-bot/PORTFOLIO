export function initRoom() {
  document.querySelectorAll<HTMLElement>('[data-room]').forEach(root => {
    if(root.dataset.initialized)return;
    root.dataset.initialized='true';
    const abort=new AbortController(),{signal}=abort;
    const points=[...root.querySelectorAll<HTMLElement>('[data-room-point]')];
    const pause=root.querySelector<HTMLButtonElement>('[data-room-pause]')!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let stopped=false,visible=false,disposed=false,opened:HTMLElement|null=null;
    let promotion:Animation|null=null;
    let ignoreNextFocus=false;
    let schedule=0,finish=0,closeTimer=0,last='',firstEffect=true;
    const setProjectMood=(point:HTMLElement|null)=>{
      if(point)root.dataset.projectMood=point.dataset.project??'';
      else delete root.dataset.projectMood;
    };
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
    const close=(restoreFocus=false)=>{
      clearTimeout(closeTimer);
      const trigger=restoreFocus?opened?.querySelector<HTMLButtonElement>('.room-trigger'):null;
      promotion?.cancel();
      promotion=null;
      points.forEach(point=>{point.dataset.open='false';delete point.dataset.promoted;point.querySelector('button')!.setAttribute('aria-expanded','false');point.querySelector<HTMLElement>('.room-reveal')!.hidden=true;});
      opened=null;setProjectMood(null);queue();
      if(trigger){ignoreNextFocus=true;trigger.focus();}
    };
    const promote=(point:HTMLElement)=>{
      const reveal=point.querySelector<HTMLElement>('.room-reveal');
      if(!reveal||point.dataset.promoted==='true')return;
      const from=reveal.getBoundingClientRect();
      point.dataset.promoted='true';
      const to=reveal.getBoundingClientRect();
      if(reduced.matches)return;
      const dx=from.left+from.width/2-(to.left+to.width/2);
      const dy=from.top+from.height/2-(to.top+to.height/2);
      reveal.animate(
        [
          {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${Math.max(0.18,from.width/to.width)})`},
          {transform:'translate(-50%, -50%) scale(1)'},
        ],
        {duration:420,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'},
      );
      promotion=reveal.getAnimations()[0] ?? null;
      if(promotion){
        const active=promotion;
        void active.finished.then(()=>{if(promotion===active){active.cancel();promotion=null;}}).catch(()=>{});
      }
    };
    const open=(point:HTMLElement)=>{
      if(opened?.dataset.promoted==='true')return;
      clearTimeout(closeTimer);
      if(opened===point)return;
      close();opened=point;clearEffect();
      setProjectMood(point);
      point.dataset.open='true';point.querySelector('button')!.setAttribute('aria-expanded','true');point.querySelector<HTMLElement>('.room-reveal')!.hidden=false;
    };
    points.forEach(point=>{
      point.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')open(point);},{signal});
      point.addEventListener('pointerleave',()=>{if(point.dataset.promoted!=='true'&&!point.contains(document.activeElement))closeTimer=window.setTimeout(close,220);},{signal});
      point.addEventListener('focusin',()=>{if(ignoreNextFocus){ignoreNextFocus=false;return;}open(point);},{signal});
      point.addEventListener('focusout',e=>{if(point.dataset.promoted!=='true'&&!point.contains(e.relatedTarget as Node))close();},{signal});
      point.querySelector<HTMLElement>('.room-card')?.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')promote(point);},{signal});
      point.querySelector<HTMLButtonElement>('.room-close')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();close(true);},{signal});
      point.querySelector('button')!.addEventListener('click',()=>{
        if(opened!==point)open(point);
        promote(point);
      },{signal});
    });
    root.addEventListener('keydown',e=>{if(e.key==='Escape'){const trigger=opened?.querySelector('button');trigger?.focus();close();}},{signal});
    root.addEventListener('pointerdown',e=>{
      const target=e.target as Element;
      const promoted=root.querySelector('[data-promoted="true"]');
      if(promoted){
        if(!target.closest('[data-promoted="true"]'))close();
        return;
      }
      if(!target.closest('[data-room-point]'))close();
    },{signal});
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
