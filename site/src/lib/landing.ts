import { initHeroVideoReel } from './hero-video-reel';
import { initTextLoupe } from './text-loupe';
import { prepareRoom } from './room-preload';
import { loaderFaces, showLoaderFace } from './loader-faces';

/** The original landing, without preparing the unused legacy 3D sequence. */
export function initInsideMindHero() {
  document.querySelectorAll<HTMLElement>('[data-inside-mind]').forEach(root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const portrait = root.querySelector<HTMLImageElement>('.mind-portrait')!;
    const loader = root.querySelector<HTMLElement>('[data-mind-loader]')!;
    const actions = root.querySelector<HTMLElement>('[data-mind-actions]') ?? root.querySelector<HTMLElement>('.mind-actions')!;
    const enter = root.querySelector<HTMLButtonElement>('[data-mind-enter]')!;
    const launcher = root.querySelector<HTMLButtonElement>('[data-mind-footer-launcher]')!;
    const status = root.querySelector<HTMLElement>('[data-mind-status]')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const reel = initHeroVideoReel(root);
    const disposeLoupe = initTextLoupe(root);
    const timers: number[] = [];
    let finished = false;
    let disposed = false;
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => { if (!disposed) fn(); }, ms));
    let escapeX = 0;
    let escapeY = 0;
    let targetX = 0, targetY = 0, pointerFrame = 0, lastPointerTime = 0;
    let flightFrame = 0;
    let flight: HTMLElement | null = null;
    let centerX = 0, centerY = 0, actionWidth = 0;
    const measureActions = () => {
      const bounds = actions.getBoundingClientRect();
      centerX = bounds.left + bounds.width / 2 - escapeX;
      centerY = bounds.top + bounds.height / 2 - escapeY;
      actionWidth = bounds.width;
    };
    actions.style.transition = 'none';
    const moveActions = (now: number) => {
      const delta = Math.min(32, now - (lastPointerTime || now - 16));
      lastPointerTime = now;
      const blend = 1 - Math.exp(-delta / 115);
      escapeX += (targetX - escapeX) * blend;
      escapeY += (targetY - escapeY) * blend;
      actions.style.transform = `translate3d(${escapeX}px, ${escapeY}px, 0)`;
      if (Math.abs(targetX - escapeX) + Math.abs(targetY - escapeY) > .05) {
        pointerFrame = requestAnimationFrame(moveActions);
      } else {
        pointerFrame = lastPointerTime = 0;
      }
    };
    const requestActionMove = () => {
      if (!pointerFrame) pointerFrame = requestAnimationFrame(moveActions);
    };
    const resetEscape = () => {
      targetX = targetY = 0;
      if (reduced.matches) {
        cancelAnimationFrame(pointerFrame);
        pointerFrame = lastPointerTime = escapeX = escapeY = 0;
        actions.style.transform = 'none';
      } else requestActionMove();
    };
    const evade = (event: PointerEvent) => {
      if (!finished || reduced.matches || event.pointerType !== 'mouse' || enter.matches(':focus-visible')) return;
      const dx = centerX - event.clientX;
      const dy = centerY - event.clientY;
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - distance / 180);
      // Stay near the original position, inside the viewport and clickable.
      targetX = Math.max(16 - (centerX - actionWidth / 2), Math.min(window.innerWidth - 16 - (centerX + actionWidth / 2), (dx / Math.max(64, distance)) * 32 * strength));
      targetY = (dy / Math.max(64, distance)) * 18 * strength;
      requestActionMove();
    };
    window.addEventListener('pointermove', evade, { passive: true });
    enter.addEventListener('focus', resetEscape);
    window.addEventListener('resize', measureActions, { passive: true });
    window.addEventListener('scroll', measureActions, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetEscape);
    window.addEventListener('blur', resetEscape);
    reduced.addEventListener('change', resetEscape);
    const entry = () => {
      if (!finished) return;
      launchFooter();
      window.removeEventListener('scroll',entry);
    };
    const finish = () => {
      if (finished || disposed) return;
      finished = true;
      root.querySelector<HTMLElement>('[data-mind-loader-value]')!.textContent = '100';
      root.dataset.state = 'portrait';
      root.dataset.launcherEntry = 'ready';
      status.textContent = 'Portrait chargé. L’introduction immersive est disponible.';
      reel.play();
      measureActions();
      if (reduced.matches) loader.hidden = true;
      else {
        loader.style.pointerEvents = 'none';
        loader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
        later(() => { loader.hidden = true; }, 300);
      }
    };
    root.querySelector('[data-mind-loader-skip]')!.addEventListener('click',finish);
    const portraitReady = portrait.complete
      ? portrait.decode().catch(() => undefined)
      : new Promise<void>(resolve => { portrait.addEventListener('load',()=>resolve(),{once:true}); portrait.addEventListener('error',()=>resolve(),{once:true}); });
    const faceImage = root.querySelector<HTMLImageElement>('[data-loader-face]')!;
    const value = root.querySelector<HTMLElement>('[data-mind-loader-value]')!;
    const bar = root.querySelector<HTMLElement>('[data-mind-loader-bar]')!;
    let decoded = 0;
    const faces = reduced.matches ? loaderFaces.slice(0,1) : loaderFaces;
    const ready = faces.map(face => {
      const image = new Image(); image.src = face.src;
      return image.decode().then(() => true, () => false).then(ok => {
        decoded++;
        if (!finished) { value.textContent=String(Math.round(decoded/faces.length*95)); bar.style.transform=`scaleX(${decoded/faces.length})`; }
        return ok;
      });
    });
    const playFaces = async () => {
      for(let index=0;index<faces.length;index++) {
        const ok=await ready[index];
        if (disposed || finished) return;
        if(ok && !reduced.matches) showLoaderFace(faceImage,index);
        if(!reduced.matches) await new Promise<void>(resolve => later(resolve,80));
      }
      await portraitReady;
      finish();
    };
    void playFaces();
    later(finish,6500);
    window.addEventListener('scroll',entry,{passive:true});
    enter.addEventListener('pointerenter',() => { void prepareRoom(); });
    enter.addEventListener('click',() => {
      reel.pause(); window.location.assign('/univers-v2/');
    });
    const launchFooter = () => {
      if (root.dataset.footerLaunch) return;
      delete root.dataset.launcherEntry;
      launcher.disabled = true;
      root.dataset.footerLaunch = 'falling';
      status.textContent = 'Nicolas tombe vers les coordonnées.';
      const complete = () => {
        root.dataset.footerLaunch='done';
        window.dispatchEvent(new CustomEvent('nicolas:fall-to-footer'));
        flight?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
        later(() => { flight?.remove(); flight = null; }, 160);
      };
      if (reduced.matches) { complete(); return; }
      const bounds = launcher.getBoundingClientRect();
      const initialScale = bounds.width / launcher.offsetWidth;
      const stage = document.querySelector<HTMLElement>('.footer-nicolas-stage');
      const destination = stage?.getBoundingClientRect();
      const initialScroll = window.scrollY;
      const finalScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const destinationTop = (destination?.bottom ?? window.innerHeight + initialScroll) + initialScroll - 250;
      const destinationLeft = (destination?.left ?? bounds.left) + (destination?.width ?? bounds.width) / 2 - 65;
      flight = launcher.cloneNode(true) as HTMLElement;
      flight.removeAttribute('data-mind-footer-launcher');
      flight.setAttribute('aria-hidden', 'true');
      flight.inert = true;
      Object.assign(flight.style, { position: 'fixed', top: '0', left: '0', width: `${launcher.offsetWidth}px`, height: `${launcher.offsetHeight}px`, opacity: '1', visibility: 'visible', pointerEvents: 'none', zIndex: '90', transition: 'none', willChange: 'transform', transformOrigin: '0 0' });
      const flyingCharacter = flight.querySelector<HTMLElement>('.mind-footer-launcher-character')!;
      flyingCharacter.style.transition = 'none';
      flyingCharacter.style.animation = 'none';
      launcher.style.opacity = '0';
      document.body.append(flight);
      const poses = [3, 4, 5, 6, 7, 8];
      const started = performance.now();
      let followScroll = true;
      const interruptScroll = () => { followScroll = false; };
      window.addEventListener('wheel', interruptScroll, { once: true, passive: true });
      window.addEventListener('touchstart', interruptScroll, { once: true, passive: true });
      const descend = (now: number) => {
        if (disposed || !flight) return;
        const progress = Math.min(1, (now - started) / 3400);
        const travel = progress * progress * (3 - 2 * progress);
        if (followScroll) window.scrollTo({ top: initialScroll + (finalScroll - initialScroll) * travel, behavior: 'instant' });
        const documentY = bounds.top + initialScroll + (destinationTop - bounds.top - initialScroll) * travel;
        const x = bounds.left + (destinationLeft - bounds.left) * travel;
        flight.style.transform = `translate3d(${x}px, ${documentY - window.scrollY}px, 0) scale(${initialScale + (1 - initialScale) * travel})`;
        flight.dataset.launcherPose = String(poses[Math.min(poses.length - 1, Math.floor(progress * poses.length))]);
        flyingCharacter.style.transform = `rotate(${Math.sin(progress * Math.PI) * 7}deg)`;
        if (progress < 1) flightFrame = requestAnimationFrame(descend);
        else {
          flightFrame = 0;
          window.removeEventListener('wheel', interruptScroll);
          window.removeEventListener('touchstart', interruptScroll);
          complete();
        }
      };
      flightFrame = requestAnimationFrame(descend);
    };
    launcher.addEventListener('click',launchFooter);
    document.addEventListener('astro:before-swap',() => {
      disposed=true; timers.forEach(clearTimeout); window.removeEventListener('scroll',entry); window.removeEventListener('pointermove',evade); reel.dispose(); disposeLoupe();
      cancelAnimationFrame(pointerFrame); cancelAnimationFrame(flightFrame); flight?.remove();
      window.removeEventListener('resize',measureActions); window.removeEventListener('scroll',measureActions);
      document.documentElement.removeEventListener('pointerleave',resetEscape); window.removeEventListener('blur',resetEscape); reduced.removeEventListener('change',resetEscape);
    },{once:true});
  });
}
