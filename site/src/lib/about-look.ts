const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function initAboutLookVideo(): void {
  document.querySelectorAll<HTMLElement>('[data-about-look]').forEach(figure => {
    if (figure.dataset.initialized === 'true') return;
    figure.dataset.initialized = 'true';

    const stage = figure.querySelector<HTMLElement>('[data-about-look-stage]');
    const video = figure.querySelector<HTMLVideoElement>('[data-about-look-video]');
    if (!stage || !video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ready = false;
    let pendingRatio = 0.5;
    let raf = 0;

    const setReady = () => {
      ready = true;
      figure.dataset.ready = 'true';
      video.pause();
    };

    const seek = () => {
      raf = 0;
      if (!ready || reducedMotion.matches || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const edge = Math.min(0.04, video.duration / 10);
      const target = edge + pendingRatio * Math.max(0, video.duration - edge * 2);
      if (Math.abs(video.currentTime - target) < 0.025) return;
      video.currentTime = target;
    };

    const scheduleSeek = (ratio: number) => {
      pendingRatio = clamp01(ratio);
      if (!raf) raf = window.requestAnimationFrame(seek);
    };

    const load = () => {
      if (video.dataset.loaded === 'true') return;
      video.dataset.loaded = 'true';
      video.preload = 'auto';
      video.load();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width) return;
      scheduleSeek((event.clientX - rect.left) / rect.width);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 0.2 : 0.08;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        scheduleSeek(pendingRatio + (event.key === 'ArrowRight' ? step : -step));
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        scheduleSeek(event.key === 'End' ? 1 : 0);
      }
    };

    video.addEventListener('loadeddata', setReady, { once: true });
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(0.04, Math.max(0, video.duration / 10));
    }, { once: true });
    video.addEventListener('play', () => video.pause());
    stage.addEventListener('pointerenter', load);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('focus', load);
    stage.addEventListener('keydown', onKeyDown);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) load();
    }, { rootMargin: '240px 0px', threshold: 0.1 });
    observer.observe(figure);

    document.addEventListener('astro:before-swap', () => {
      observer.disconnect();
      stage.removeEventListener('pointerenter', load);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('focus', load);
      stage.removeEventListener('keydown', onKeyDown);
      if (raf) window.cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(source => source.remove());
      video.load();
    }, { once: true });
  });
}
