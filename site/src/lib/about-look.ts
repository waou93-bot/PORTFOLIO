const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// The left side feels compressed in use. Give it a little more travel without
// changing the right half that already reads well.
const mapPointerToTimeline = (value: number) => {
  const ratio = clamp01(value);
  if (ratio >= 0.5) return ratio;
  return 0.5 * Math.pow(ratio * 2, 1.18);
};

export function initAboutLookVideo(): void {
  document.querySelectorAll<HTMLElement>('[data-about-look]').forEach(figure => {
    if (figure.dataset.initialized === 'true') return;
    figure.dataset.initialized = 'true';

    const stage = figure.querySelector<HTMLElement>('[data-about-look-stage]');
    const video = figure.querySelector<HTMLVideoElement>('[data-about-look-video]');
    if (!stage || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ready = false;
    let targetRatio = 0.5;
    let displayRatio = 0.5;
    let raf = 0;
    let previousTick = 0;

    const setReady = () => {
      ready = true;
      figure.dataset.ready = 'true';
      video.pause();
    };

    const seek = (now: number) => {
      raf = 0;
      const elapsed = previousTick ? Math.min(64, now - previousTick) : 16;
      previousTick = now;
      const follow = 1 - Math.exp(-elapsed / 150);
      displayRatio += (targetRatio - displayRatio) * follow;

      if (ready && !reducedMotion.matches && Number.isFinite(video.duration) && video.duration > 0 && !video.seeking) {
        const edge = Math.min(0.04, video.duration / 10);
        const time = edge + displayRatio * Math.max(0, video.duration - edge * 2);
        if (Math.abs(video.currentTime - time) >= 0.025) video.currentTime = time;
      }

      if (Math.abs(targetRatio - displayRatio) > 0.002 || video.seeking) {
        raf = window.requestAnimationFrame(seek);
      } else {
        previousTick = 0;
      }
    };

    const scheduleSeek = (ratio: number) => {
      targetRatio = clamp01(ratio);
      if (!raf) raf = window.requestAnimationFrame(seek);
    };

    const load = () => {
      if (video.dataset.loaded === 'true') return;
      video.dataset.loaded = 'true';
      video.preload = 'auto';
      video.load();
    };

    const onWindowPointerMove = (event: PointerEvent) => {
      if (!figure.dataset.ready) load();
      const pointerRatio = event.clientX / Math.max(1, window.innerWidth);
      scheduleSeek(1 - mapPointerToTimeline(pointerRatio));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 0.2 : 0.08;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        scheduleSeek(displayRatio + (event.key === 'ArrowLeft' ? step : -step));
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        scheduleSeek(event.key === 'End' ? 1 : 0);
      }
    };

    video.addEventListener('loadeddata', setReady, { once: true });
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(0.04, Math.max(0, video.duration / 10));
    }, { once: true });
    video.addEventListener('seeked', () => {
      if (Math.abs(targetRatio - displayRatio) > 0.002 && !raf) {
        raf = window.requestAnimationFrame(seek);
      }
    });
    video.addEventListener('play', () => video.pause());
    stage.addEventListener('focus', load);
    stage.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) load();
    }, { rootMargin: '240px 0px', threshold: 0.1 });
    observer.observe(figure);

    document.addEventListener('astro:before-swap', () => {
      observer.disconnect();
      stage.removeEventListener('focus', load);
      stage.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointermove', onWindowPointerMove);
      if (raf) window.cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(source => source.remove());
      video.load();
    }, { once: true });
  });
}
