/** The mirror and scene transitions are already encoded in the video asset. */
export function initHeroVideoReel(root: HTMLElement) {
  const video = root.querySelector<HTMLVideoElement>('[data-hero-single-video]');
  if (!video) return { play() {}, pause() {}, dispose() {} };

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  let visible = true;
  let disposed = false;
  let playAttempt = 0;
  const enabled = () => !disposed && visible && !document.hidden &&
    !motion.matches && root.dataset.state === 'portrait';
  const ready = () => {
    if (!disposed && video.readyState >= 2) root.dataset.heroVideoReady = 'true';
  };
  const pause = () => {
    ++playAttempt;
    video.pause();
  };
  const play = () => {
    if (!enabled()) return;
    const attempt = ++playAttempt;
    void video.play().then(() => {
      if (attempt === playAttempt && !enabled()) video.pause();
    }).catch(() => {
      // Keep the poster/portrait when autoplay is unavailable.
    });
  };
  const sync = () => enabled() ? play() : pause();
  video.muted = video.defaultMuted = true;
  video.loop = true;
  video.defaultPlaybackRate = video.playbackRate = 1;
  video.addEventListener('loadeddata', ready, { signal: abort.signal });
  video.addEventListener('playing', ready, { signal: abort.signal });
  video.addEventListener('error', () => {
    delete root.dataset.heroVideoReady;
    pause();
  }, { signal: abort.signal });
  if (video.readyState >= 2) ready();

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    visible = entry.isIntersecting;
    sync();
  }, { threshold: 0.05 });
  observer.observe(root);
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  motion.addEventListener('change', sync, { signal: abort.signal });

  return {
    play, pause,
    dispose() {
      disposed = true;
      pause();
      observer.disconnect();
      abort.abort();
      video.removeAttribute('src');
      video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
      video.load();
    },
  };
}
