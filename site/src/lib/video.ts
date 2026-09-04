/**
 * Previews vidéo (ADR-002 / motion-spec) :
 * - poster statique d'abord, préload="none"
 * - desktop précis : chargement après ~300 ms de hover, lecture, pause à la sortie
 * - mobile : lecture sur tap explicite
 * - une seule vidéo active à la fois
 * - pause hors viewport (IntersectionObserver)
 * - désactivé si save-data ou prefers-reduced-motion
 */

const canHover =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const saveData =
  typeof navigator !== 'undefined' &&
  'connection' in navigator &&
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

const ACTIVE = 'video-preview--active';

export function initVideoPreviews(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-video-preview]');
  if (videos.length === 0) return;
  if (reducedMotion || saveData) return; // poster uniquement

  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (!e.isIntersecting && !v.paused) {
            v.pause();
            v.classList.remove(ACTIVE);
          }
        }
      },
      { rootMargin: '10% 0px', threshold: 0.1 },
    );
  }

  let loadTimer = 0;

  function startLoading(v: HTMLVideoElement): void {
    if (v.dataset.loaded === 'true') return;
    v.dataset.loaded = 'true';
    v.load();
  }

  function play(v: HTMLVideoElement): void {
    if (!v.dataset.loaded) startLoading(v);
    const p = v.play();
    p?.catch(() => undefined);
  }

  function stop(v: HTMLVideoElement): void {
    window.clearTimeout(loadTimer);
    v.pause();
    v.classList.remove(ACTIVE);
  }

  function enter(v: HTMLVideoElement): void {
    if (!canHover) return;
    window.clearTimeout(loadTimer);
    loadTimer = window.setTimeout(() => {
      if (v.dataset.hovered === 'true') {
        v.classList.add(ACTIVE);
        play(v);
      }
    }, 300);
  }

  function leave(v: HTMLVideoElement): void {
    v.dataset.hovered = 'false';
    window.clearTimeout(loadTimer);
    stop(v);
  }

  for (const v of videos) {
    // Lecture sur tap (mobile / sans hover précis)
    v.addEventListener('click', () => {
      if (v.paused) {
        v.classList.add(ACTIVE);
        play(v);
      } else {
        stop(v);
      }
    });
    v.addEventListener('pointerenter', () => {
      v.dataset.hovered = 'true';
      enter(v);
    });
    v.addEventListener('pointerleave', () => {
      leave(v);
    });
    // Arrêt de l'audio implicite (preview = muted) et désactivation au scroll
    v.addEventListener('pause', () => v.classList.remove(ACTIVE));
    v.addEventListener('play', () => {
      // Une seule vidéo active : suspendre les autres
      for (const other of videos) {
        if (other !== v && !other.paused) other.pause();
      }
    });
    io?.observe(v);
  }
}
