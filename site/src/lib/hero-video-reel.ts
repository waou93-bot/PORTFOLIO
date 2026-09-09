type HeroPair = {
  root: HTMLElement;
  videos: HTMLVideoElement[];
};

/** Keep the outgoing frame until the next mirrored pair has decoded a frame. */
export function initHeroVideoReel(root: HTMLElement) {
  const reel = root.querySelector<HTMLElement>('[data-hero-reel]');
  const pairs: HeroPair[] = [...root.querySelectorAll<HTMLElement>('[data-hero-pair]')]
    .map((pairRoot) => ({
      root: pairRoot,
      videos: [...pairRoot.querySelectorAll<HTMLVideoElement>('[data-mind-hero-video]')],
    }))
    .filter((pair) => pair.videos.length === 2);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  let epoch = 0;
  let timer = 0;
  let pending = false;
  let visible = true;
  let disposed = false;
  let retryAt = 0;
  let finishSplice: (() => void) | undefined;
  const enabled = () => !disposed && !document.hidden && visible &&
    !motion.matches && root.dataset.state === 'portrait';
  const cutAt = (video: HTMLVideoElement, pair: HeroPair) => {
    const ratio = Number(pair.root.dataset.cutRatio);
    const visibleRatio = Number.isFinite(ratio) ? ratio : 0.18;
    return Number.isFinite(video.duration)
      ? Math.max(0.1, Math.min(video.duration * visibleRatio, video.duration - 0.5))
      : Infinity;
  };
  const activePair = () => pairs[active]!;
  const pausePair = (pair: HeroPair) => pair.videos.forEach((video) => video.pause());
  const playPair = (pair: HeroPair) =>
    pair.videos.forEach((video) => void video.play().catch(() => undefined));
  const resetPair = (pair: HeroPair) =>
    pair.videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

  for (const video of pairs.flatMap((pair) => pair.videos)) {
    video.muted = video.defaultMuted = true;
    video.loop = false;
    video.defaultPlaybackRate = video.playbackRate = 0.8;
  }
  const firstPair = pairs[0];
  const first = firstPair?.videos[0];
  if (!reel || !firstPair || !first) return { play() {}, pause() {}, dispose() {} };
  firstPair.root.dataset.active = '';
  // Browsers can defer an autoplay video after a hard refresh when it is only
  // declared with `preload="auto"`. Start the first mirrored pair explicitly
  // so the reel never gets stuck on the portrait fallback after reloading.
  firstPair.videos.forEach((video) => {
    video.preload = 'auto';
    video.load();
  });

  const prepareNext = () => {
    const next = pairs[(active + 1) % pairs.length]!;
    if (!motion.matches) {
      next.videos.forEach((video) => {
        if (video.preload !== 'auto') {
          video.preload = 'auto';
          video.load();
        }
      });
    }
  };

  const decodedFrame = (video: HTMLVideoElement) => new Promise<boolean>((resolve) => {
    let callback = 0;
    let settled = false;
    let poll = 0;
    const done = (ready: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(poll);
      if (callback && typeof video.cancelVideoFrameCallback === 'function')
        video.cancelVideoFrameCallback(callback);
      resolve(ready);
    };
    const timeout = window.setTimeout(() => done(false), 4000);
    if (typeof video.requestVideoFrameCallback === 'function') {
      callback = video.requestVideoFrameCallback(() => done(true));
    } else {
      const check = () => {
        if (video.readyState >= 2 && !video.paused && video.currentTime > 0) done(true);
        else poll = requestAnimationFrame(check);
      };
      poll = requestAnimationFrame(check);
    }
    void video.play().catch(() => done(false));
  });

  const splice = async () => {
    if (pending || !enabled() || performance.now() < retryAt) return;
    pending = true;
    const run = ++epoch;
    const outgoing = activePair();
    const nextIndex = (active + 1) % pairs.length;
    const incoming = pairs[nextIndex]!;
    prepareNext();
    resetPair(incoming);
    const ready = (await Promise.all(incoming.videos.map(decodedFrame))).every(Boolean);
    if (run !== epoch || !enabled()) {
      pending = false;
      return;
    }
    if (!ready) {
      pausePair(incoming);
      pending = false;
      retryAt = performance.now() + 2000;
      return;
    }
    incoming.root.dataset.incoming = '';
    reel.dataset.glitch = '';
    root.dataset.heroClip = String(nextIndex + 1);
    finishSplice = () => {
      delete outgoing.root.dataset.active;
      incoming.root.dataset.active = '';
      delete incoming.root.dataset.incoming;
      delete reel.dataset.glitch;
      pausePair(outgoing);
      resetPair(outgoing);
      active = nextIndex;
      pending = false;
      finishSplice = undefined;
      if (enabled()) prepareNext();
    };
    timer = window.setTimeout(() => finishSplice?.(), 220);
  };

  const tick = () => {
    if (!enabled()) return;
    const current = activePair().videos[0]!;
    if (current.currentTime >= cutAt(current, activePair()) || current.ended) {
      pausePair(activePair());
      void splice();
    }
    frame = requestAnimationFrame(tick);
  };
  const pause = () => {
    ++epoch;
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    finishSplice?.();
    pending = false;
    pairs.forEach(pausePair);
  };
  const play = () => {
    if (!enabled()) return;
    const current = activePair().videos[0]!;
    if (current.currentTime < cutAt(current, activePair())) playPair(activePair());
    prepareNext();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  };
  const ready = () => {
    root.dataset.heroVideoReady = 'true';
    root.dataset.heroClip ??= '1';
  };
  const sync = () => enabled() ? play() : pause();
  first.addEventListener('loadeddata', ready);
  if (first.readyState >= 2) ready();
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    visible = entry.isIntersecting;
    sync();
  }, { threshold: 0.05 });
  observer.observe(root);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  return {
    play, pause,
    dispose() {
      disposed = true;
      pause();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
      first.removeEventListener('loadeddata', ready);
    },
  };
}
