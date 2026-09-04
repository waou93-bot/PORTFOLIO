import { gsap } from 'gsap';

// Kept only for this document's lifetime, including Astro route swaps, not reloads.
let performanceFinished = false;
type Pose = {
  src: string; width: number; height: number;
  crop: [number, number, number, number];
  anchor: [number, number]; scale: number;
};
const atlas = '/media/footer/nicolas-poses-v2.png';
const poses: Pose[] = [
  { src: atlas, width: 1774, height: 887, crop: [80, 285, 290, 50], anchor: [229, 311], scale: 0.42 },
  { src: atlas, width: 1774, height: 887, crop: [530, 215, 280, 120], anchor: [663, 311], scale: 0.42 },
  { src: atlas, width: 1774, height: 887, crop: [950, 140, 320, 195], anchor: [1105, 311], scale: 0.42 },
  { src: atlas, width: 1774, height: 887, crop: [1380, 60, 310, 275], anchor: [1525, 311], scale: 0.42 },
  { src: atlas, width: 1774, height: 887, crop: [55, 430, 300, 310], anchor: [228, 715], scale: 0.42 },
  { src: atlas, width: 1774, height: 887, crop: [540, 420, 255, 320], anchor: [663, 715], scale: 0.42 },
  { src: '/media/footer/nicolas-rising-v2.png', width: 1254, height: 1254,
    crop: [380, 65, 475, 1090], anchor: [622, 1125], scale: 0.2 },
  { src: atlas, width: 1774, height: 887, crop: [1390, 355, 335, 500], anchor: [1516, 840], scale: 0.42 },
];

export function initFooterNicolas() {
  document.querySelectorAll<HTMLElement>('[data-footer-nicolas]').forEach(root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const actor = root.querySelector<HTMLElement>('[data-footer-actor]');
    if (!actor) return;
    const staticMode = matchMedia('(prefers-reduced-motion: reduce), (hover: none)');
    let disposed = false;
    let ready = false;
    let loading = false;
    let visible = false;
    let timeline: gsap.core.Timeline | undefined;
    const layers = poses.map((pose, index) => {
      const layer = document.createElement('div');
      layer.className = 'footer-nicolas-pose';
      layer.dataset.pose = String(index + 1);
      const image = new Image();
      image.alt = '';
      image.decoding = 'async';
      const [x, y, w, h] = pose.crop;
      Object.assign(image.style, {
        width: `${pose.width * pose.scale}px`, height: `${pose.height * pose.scale}px`,
        left: `${115 - pose.anchor[0] * pose.scale}px`,
        top: `${246 - pose.anchor[1] * pose.scale}px`,
        clipPath: `inset(${y / pose.height * 100}% ${(pose.width - x - w) / pose.width * 100}% ${(pose.height - y - h) / pose.height * 100}% ${x / pose.width * 100}%)`,
      });
      layer.append(image); actor.append(layer);
      return layer;
    });
    const show = (index: number) => {
      layers.forEach((layer, i) => { layer.style.opacity = i === index ? '1' : '0'; });
      root.dataset.pose = String(index + 1);
    };
    const settle = () => {
      timeline?.kill();
      gsap.set(layers, { clearProps: 'transform' });
      show(7);
      root.dataset.state = 'settled';
      performanceFinished = true;
    };
    const start = () => {
      if (!ready || !visible || disposed || document.hidden || root.dataset.state !== 'waiting') return;
      if (performanceFinished || staticMode.matches) { settle(); return; }
      root.dataset.state = 'climbing';
      timeline = gsap.timeline({ onComplete: settle });
      // Clear readable silhouettes, small stepped movements, no elastic/comic bounce.
      const beats = [0, 0.2, 0.5, 0.72, 0.95, 1.19, 1.43, 1.7];
      beats.forEach((at, index) => {
        timeline!.call(() => show(index), [], at);
        timeline!.fromTo(layers[index]!, { y: index < 4 ? 5 : 2 },
          { y: 0, duration: 0.18, ease: 'steps(3)', immediateRender: false }, at);
      });
      timeline.to({}, { duration: 0.65 });
    };
    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        await Promise.all(layers.map(async (layer, i) => {
          const image = layer.querySelector('img')!;
          image.src = poses[i]!.src;
          await image.decode();
        }));
        if (disposed) return;
        ready = true; start();
      } catch {
        root.dataset.state = 'unavailable';
        // The live email remains usable even if a decorative image fails.
      }
    };
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { void load(); preload.disconnect(); }
    }, { rootMargin: '600px' });
    preload.observe(root);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (timeline && root.dataset.state === 'climbing') {
        if (visible && !document.hidden) timeline.resume(); else timeline.pause();
      }
      start();
    }, { threshold: 0.6 });
    visibility.observe(root);
    const onVisibility = () => {
      if (document.hidden) timeline?.pause();
      else if (visible) { timeline?.resume(); start(); }
    };
    const onMotion = () => { if (ready && staticMode.matches) settle(); };
    document.addEventListener('visibilitychange', onVisibility);
    staticMode.addEventListener('change', onMotion);
    document.addEventListener('astro:before-swap', () => {
      disposed = true; timeline?.kill(); preload.disconnect(); visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      staticMode.removeEventListener('change', onMotion);
    }, { once: true });
  });
}
