// Landmark coordinates calibrated at the source video's end, midpoint and beginning.
// They follow the decoded frame, not the scroll target, so seek latency cannot detach them.
const anchors = [
  [[.326,.262],[.341,.259],[.352,.26]],
  [[.451,.279],[.455,.277],[.461,.276]],
  [[.292,.296],[.325,.287],[.345,.282]],
  [[.329,.635],[.373,.535],[.393,.482]],
];
export function initMountainJourney() {
  document.querySelectorAll<HTMLElement>('[data-mountain-journey]').forEach(root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const video = root.querySelector<HTMLVideoElement>('video')!;
    const pins = [...root.querySelectorAll<HTMLElement>('[data-summit]')];
    const status = root.querySelector<HTMLElement>('[data-journey-status]')!;
    const meter = root.querySelector<HTMLElement>('[data-journey-meter]')!;
    const counter = root.querySelector<HTMLElement>('[data-journey-progress]')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const abort = new AbortController();
    let url = '', disposed = false, frame = 0, target = 0;
    const paintPins = () => {
      const progress = Number.isFinite(video.duration) ? 1 - video.currentTime / video.duration : 0;
      const segment = progress < .5 ? 0 : 1;
      const blend = Math.min(1, Math.max(0, progress * 2 - segment));
      pins.forEach((pin, i) => {
        const a = anchors[i]![segment]!, b = anchors[i]![segment + 1]!;
        pin.style.left = `${(a[0]! + (b[0]! - a[0]!) * blend) * 100}%`;
        pin.style.top = `${(a[1]! + (b[1]! - a[1]!) * blend) * 100}%`;
        const arrival = [0,.22,.46,.7][i]!;
        const visible = reduced || progress >= arrival;
        pin.dataset.visible = String(visible);
        pin.inert = !visible;
        // Perspective is calibrated as a first artistic pass, not a 3D camera solve.
        pin.style.setProperty('--depth', String(reduced ? 1 : 1 - Math.max(0, progress - arrival) * .38));
        const css = getComputedStyle(pin);
        const dx = parseFloat(css.getPropertyValue('--dx')) || 0;
        const dy = parseFloat(css.getPropertyValue('--dy')) || -22;
        pin.style.setProperty('--stem', `${Math.hypot(dx,dy)}px`);
        pin.style.setProperty('--angle', `${Math.atan2(dy,dx)}rad`);
      });
    };
    const seek = () => {
      if (disposed || !Number.isFinite(video.duration) || video.seeking) return;
      const time = Math.max(.04, (video.duration - .04) * (1 - target));
      if (Math.abs(video.currentTime - time) > .025) video.currentTime = time;
    };
    const read = () => {
      frame = 0;
      const travel = root.offsetHeight - window.innerHeight;
      target = reduced ? 0 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, travel)));
      meter.style.transform = `scaleX(${target})`;
      counter.textContent = `${String(Math.round(target * 100)).padStart(2,'0')} / 100`;
      seek();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };
    video.addEventListener('loadedmetadata', read, { signal: abort.signal });
    video.addEventListener('seeked', () => { paintPins(); seek(); }, { signal: abort.signal });
    window.addEventListener('scroll', schedule, { passive:true, signal:abort.signal });
    window.addEventListener('resize', schedule, { signal:abort.signal });
    paintPins();
    fetch('/media/transition/drone-journey-source-v1.mp4', { signal:abort.signal })
      .then(response => { if (!response.ok) throw new Error('video'); return response.blob(); })
      .then(blob => {
        if (disposed) return;
        url = URL.createObjectURL(blob); video.src = url; video.load();
        status.textContent = reduced ? 'Paysage fixe · les quatre projets restent accessibles.' : 'Défilez pour reculer dans le paysage ↓';
      }).catch(() => { if (!disposed) status.textContent = 'Paysage indisponible · retrouvez les projets ci-dessous.'; });
    document.addEventListener('astro:before-swap', () => {
      disposed = true; abort.abort(); cancelAnimationFrame(frame); video.pause();
      video.removeAttribute('src'); video.load(); if (url) URL.revokeObjectURL(url);
    }, { once:true });
  });
}
