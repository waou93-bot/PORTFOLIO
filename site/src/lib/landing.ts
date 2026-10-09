import { navigate } from 'astro:transitions/client';
import { initHeroVideoReel } from './hero-video-reel';
import { initTextLoupe } from './text-loupe';
import { prepareRoom } from './room-preload';

/** The original landing, without preparing the unused legacy 3D sequence. */
export function initInsideMindHero() {
  document.querySelectorAll<HTMLElement>('[data-inside-mind]').forEach(root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const portrait = root.querySelector<HTMLImageElement>('.mind-portrait')!;
    const loader = root.querySelector<HTMLElement>('[data-mind-loader]')!;
    const actions = root.querySelector<HTMLElement>('[data-mind-actions]') ?? root.querySelector<HTMLElement>('.mind-actions')!;
    const enter = root.querySelector<HTMLButtonElement>('[data-mind-enter]')!;
    const slot = document.querySelector<HTMLElement>('[data-mind-lower-slot]');
    const launcher = root.querySelector<HTMLButtonElement>('[data-mind-footer-launcher]')!;
    const character = root.querySelector<HTMLElement>('.mind-footer-launcher-character')!;
    const status = root.querySelector<HTMLElement>('[data-mind-status]')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const reel = initHeroVideoReel(root);
    const disposeLoupe = initTextLoupe(root);
    const timers: number[] = [];
    let finished = false;
    let disposed = false;
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => { if (!disposed) fn(); }, ms));
    const lower = () => {
      if (!slot || root.dataset.ctaLowered) return;
      root.dataset.ctaLowered = 'true';
      root.dataset.ctaEscaped = 'true';
      actions.classList.add('is-lowered');
      slot.append(actions);
      status.textContent = 'Le bouton s’est déplacé. Descendez pour le retrouver.';
    };
    const entry = () => {
      if (!finished) return;
      lower();
      root.dataset.launcherEntry = 'falling';
      launcher.disabled = true;
      launcher.dataset.launcherPose = '3';
      later(() => launcher.dataset.launcherPose = '5',65);
      later(() => launcher.dataset.launcherPose = '0',430);
      later(() => { delete root.dataset.launcherEntry; launcher.disabled = false; },reduced.matches?0:1200);
      window.removeEventListener('scroll',entry);
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      root.querySelector<HTMLElement>('[data-mind-loader-value]')!.textContent = '100';
      loader.hidden = true;
      root.dataset.state = 'portrait';
      root.dataset.launcherEntry = 'waiting';
      status.textContent = 'Portrait chargé. L’introduction immersive est disponible.';
      reel.play();
    };
    root.querySelector('[data-mind-loader-skip]')!.addEventListener('click',finish);
    if (portrait.complete) void portrait.decode().catch(() => undefined).then(finish);
    else { portrait.addEventListener('load',finish,{once:true}); portrait.addEventListener('error',finish,{once:true}); }
    later(finish,3500);
    window.addEventListener('scroll',entry,{passive:true});
    enter.addEventListener('pointerenter',() => { void prepareRoom(); if(matchMedia('(hover: hover)').matches) lower(); });
    enter.addEventListener('click',() => {
      if(matchMedia('(hover: none), (pointer: coarse)').matches && !root.dataset.ctaLowered) { lower(); return; }
      reel.pause(); void navigate('/univers-v2/');
    });
    launcher.addEventListener('click',() => {
      if (root.dataset.footerLaunch) return;
      launcher.disabled = true;
      root.dataset.footerLaunch = 'falling';
      status.textContent = 'Nicolas tombe vers les coordonnées.';
      const exit = window.innerHeight+120;
      const frames = [[0,3,1,14,-4],[100,4,3,42,-12],[240,5,6,76,-8],[380,6,3,Math.max(320,exit-420),6],[540,7,3,Math.max(320,exit-420),6],[720,8,-2,Math.max(460,exit-220),14],[1040,8,-5,exit,24]];
      for(const [ms,pose,x,y,rotation] of frames)later(() => {
        launcher.dataset.launcherPose=String(pose);
        character.style.transform=`translate(${x}px,${y}px) rotate(${rotation}deg)`;
      },reduced.matches?0:ms!);
      later(() => {
        root.dataset.footerLaunch='done';
        character.style.opacity='0';
        window.dispatchEvent(new CustomEvent('nicolas:fall-to-footer'));
        document.querySelector('.site-footer')?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'end'});
      },reduced.matches?0:1380);
    });
    document.addEventListener('astro:before-swap',() => {
      disposed=true; timers.forEach(clearTimeout); window.removeEventListener('scroll',entry); reel.dispose(); disposeLoupe();
    },{once:true});
  });
}
