const sources = Array.from(
  { length: 30 },
  (_, index) => `/media/identity/sequence-expression-v1/frame-${String(index + 1).padStart(2, '0')}.webp`,
);

export function initUniverseInterlude() {
  document.querySelectorAll<HTMLElement>('[data-interlude]').forEach((root) => {
    if (root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';
    const frame = root.querySelector<HTMLImageElement>('[data-interlude-frame]');
    const glitchLayers = [...root.querySelectorAll<HTMLImageElement>('[data-interlude-glitch]')];
    if (!frame) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let timer = 0;
    let exitTimer = 0;
    let closed = false;

    const close = () => {
      if (closed) return;
      closed = true;
      window.clearInterval(timer);
      window.clearTimeout(exitTimer);
      root.dataset.interludeExit = 'true';
      window.setTimeout(() => root.remove(), reduced ? 0 : 280);
    };

    if (!reduced) {
      timer = window.setInterval(() => {
        index = (index + 1) % sources.length;
        frame.src = sources[index]!;
        glitchLayers.forEach((layer) => (layer.src = sources[index]!));
      }, 72);
      exitTimer = window.setTimeout(close, 720);
    } else {
      close();
    }
    document.addEventListener('astro:before-swap', () => {
      window.clearInterval(timer);
      window.clearTimeout(exitTimer);
    }, { once: true });
  });
}
