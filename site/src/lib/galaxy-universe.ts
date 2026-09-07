import { preparedGalaxyUrl } from './galaxy-preload';
export function initGalaxy() {
  document.querySelectorAll<HTMLElement>('[data-galaxy]').forEach(root => {
    if(root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const abort = new AbortController(), {signal} = abort;
    const videos = [...root.querySelectorAll<HTMLVideoElement>('video')];
    const pause = root.querySelector<HTMLButtonElement>('[data-galaxy-pause]')!;
    const status = root.querySelector<HTMLElement>('[data-galaxy-status]')!;
    const stars = [...root.querySelectorAll<HTMLElement>('[data-star]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let stopped = reduced.matches, visible = true, disposed = false, active = 0, blending = false, raf = 0, timer = 0, preloadTimer = 0;
    // The second decoder must not compete with the first frame on navigation.
    videos[0]!.addEventListener('playing',()=>{
      root.dataset.videoReady='true';
      preloadTimer=window.setTimeout(()=>{
        if(disposed)return;
        videos[1]!.src=videos[0]!.currentSrc;videos[1]!.preload='auto';videos[1]!.load();
      },1200);
    },{once:true,signal});
    const canPlay = () => !stopped && visible && !document.hidden && !disposed;
    const play = (v:HTMLVideoElement) => { void v.play().catch(() => { if(!disposed && canPlay()) { stopped=true;videos.forEach(layer=>layer.pause());pause.textContent='Reprendre le paysage';pause.setAttribute('aria-pressed','true');status.textContent='Touchez « Reprendre le paysage » pour lancer la galaxie.'; } }); };
    const tick = () => {
      raf = 0;
      if(!canPlay()) return;
      const current = videos[active]!, next = videos[1-active]!;
      const fade = 1.2;
      if(Number.isFinite(current.duration) && current.currentTime >= current.duration-fade && next.readyState>=2) {
        if(!blending) { blending=true;next.currentTime=0;next.style.zIndex='2';current.style.zIndex='1';play(next); }
        const amount = Math.min(1,Math.max(0,(current.currentTime-(current.duration-fade))/fade));
        next.style.opacity=String(amount);
        if(current.ended || amount>=.995) {
          current.pause();current.style.opacity='0';current.style.zIndex='0';
          next.style.opacity='1';active=1-active;blending=false;
          root.dataset.loops=String(Number(root.dataset.loops||0)+1);
        }
      }
      raf=requestAnimationFrame(tick);
    };
    const sync = () => {
      pause.setAttribute('aria-pressed',String(stopped));
      pause.textContent=stopped?'Reprendre le paysage':'Pause du paysage';
      if(!canPlay()) { videos.forEach(v=>v.pause());cancelAnimationFrame(raf);raf=0;return; }
      play(videos[active]!);if(blending) play(videos[1-active]!);if(!raf) raf=requestAnimationFrame(tick);
    };
    videos.forEach(v=>{v.playbackRate=1;v.addEventListener('loadeddata',()=>{if(reduced.matches){v.currentTime=.05;}else sync();},{signal});});
    pause.addEventListener('click',()=>{stopped=!stopped;sync();},{signal});
    document.addEventListener('visibilitychange',sync,{signal});
    reduced.addEventListener('change',()=>{stopped=reduced.matches;sync();},{signal});
    const observer=new IntersectionObserver(([entry])=>{visible=!!entry?.isIntersecting;sync();},{threshold:.05});observer.observe(root);
    const close = () => stars.forEach(star=>{star.dataset.open='false';star.querySelector('button')!.setAttribute('aria-expanded','false');star.querySelector<HTMLElement>('.star-reveal')!.hidden=true;});
    const open = (star:HTMLElement) => {clearTimeout(timer);if(star.dataset.open==='true')return;close();star.dataset.open='true';star.querySelector('button')!.setAttribute('aria-expanded','true');star.querySelector<HTMLElement>('.star-reveal')!.hidden=false;};
    stars.forEach(star=>{
      star.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')open(star);},{signal});
      star.addEventListener('pointerleave',()=>{if(!star.contains(document.activeElement))timer=window.setTimeout(close,200);},{signal});
      star.querySelector('button')!.addEventListener('click',()=>{open(star);},{signal});
      star.addEventListener('focusin',()=>open(star),{signal});
      star.addEventListener('focusout',event=>{if(!star.contains(event.relatedTarget as Node))close();},{signal});
    });
    root.addEventListener('keydown',event=>{if(event.key==='Escape'){clearTimeout(timer);close();}},{signal});
    root.addEventListener('pointerdown',event=>{if(!(event.target as Element).closest('[data-star]'))close();},{signal});
    if(matchMedia('(pointer:coarse)').matches)status.textContent='Touchez une étoile pour découvrir son projet.';
    videos[0]!.src=preparedGalaxyUrl()||'/media/transition/universe-v3-fast.mp4';
    videos[0]!.load();
    sync();
    document.addEventListener('astro:before-swap',()=>{disposed=true;abort.abort();observer.disconnect();cancelAnimationFrame(raf);clearTimeout(timer);clearTimeout(preloadTimer);videos.forEach(v=>{v.pause();v.removeAttribute('src');v.querySelectorAll('source').forEach(source=>source.remove());v.load();});},{once:true});
  });
}
