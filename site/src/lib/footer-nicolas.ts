import { gsap } from 'gsap';

// The footer performance is intentionally finite: the character arrives once,
// then keeps the final pointing pose so the contact action stays legible.
let performanceFinished = false;

type Pose = {
  src: string;
  width: number;
  height: number;
  crop: [number, number, number, number];
  anchor: [number, number];
  scale: number;
};

const atlas = '/media/footer/nicolas-footer-rise-v5-alpha.png';
const atlasWidth = 2400;
const atlasHeight = 736;
const cellWidth = atlasWidth / 8;
const ledgeAnchors = [505, 505, 510, 518, 610, 610, 610, 610];
const poses: Pose[] = ledgeAnchors.map((ledgeY, index) => ({
  src: atlas,
  width: atlasWidth,
  height: atlasHeight,
  crop: [index * cellWidth, 0, cellWidth, atlasHeight] as [number, number, number, number],
  anchor: [(index + 0.5) * cellWidth, ledgeY] as [number, number],
  scale: 0.34,
}));

const landingEvent = 'nicolas:fall-to-footer';

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
    let inViewport = false;
    let unlocked = false;
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
        width: `${pose.width * pose.scale}px`,
        height: `${pose.height * pose.scale}px`,
        left: `${115 - pose.anchor[0] * pose.scale}px`,
        top: `${246 - pose.anchor[1] * pose.scale}px`,
        clipPath: `inset(${y / pose.height * 100}% ${(pose.width - x - w) / pose.width * 100}% ${(pose.height - y - h) / pose.height * 100}% ${x / pose.width * 100}%)`,
      });
      layer.append(image);
      actor.append(layer);
      return layer;
    });

    const show = (index: number) => {
      layers.forEach((layer, layerIndex) => {
        layer.style.opacity = layerIndex === index ? '1' : '0';
      });
      root.dataset.pose = String(index + 1);
    };

    const settle = () => {
      timeline?.kill();
      gsap.set(layers, { clearProps: 'transform' });
      gsap.set(actor, { x: 0, y: 0, rotation: 0, scale: 1 });
      show(7);
      root.dataset.state = 'settled';
      performanceFinished = true;
    };

    const runSequence = () => {
      if (!ready || disposed) return;
      timeline?.kill();

      if (staticMode.matches) {
        settle();
        return;
      }

      root.dataset.state = 'climbing';
      gsap.set(actor, { x: 0, y: 3, rotation: 0, scale: 1 });

      // Each beat is a real plate change. The small stepped translations add
      // weight without turning the stop-motion into a smooth tween.
      const frames = [
        { pose: 0, y: 5, rotation: -0.04, hold: 0.13 },
        { pose: 1, y: 2, rotation: 0.05, hold: 0.1 },
        { pose: 2, y: 1, rotation: -0.03, hold: 0.1 },
        { pose: 3, y: 0, rotation: 0.04, hold: 0.12 },
        { pose: 4, y: 2, rotation: -0.05, hold: 0.13 },
        { pose: 5, y: 1, rotation: 0.03, hold: 0.13 },
        { pose: 6, y: 0, rotation: -0.02, hold: 0.18 },
        { pose: 7, y: 0, rotation: 0, hold: 0.36 },
      ];

      timeline = gsap.timeline({
        onComplete: () => {
          show(7);
          gsap.set(actor, { x: 0, y: 0, rotation: 0, scale: 1 });
          root.dataset.state = 'settled';
          performanceFinished = true;
        },
      });

      frames.forEach((frame, index) => {
        timeline!.call(() => show(frame.pose), [], index === 0 ? 0 : '>');
        timeline!.to(actor, {
          y: frame.y,
          rotation: frame.rotation,
          duration: index === 0 ? 0.18 : 0.16,
          ease: 'steps(2)',
        }, index === 0 ? 0 : '>');
        timeline!.to({}, { duration: frame.hold });
      });
    };

    const start = () => {
      if (!unlocked || !ready || !visible || disposed || document.hidden || root.dataset.state !== 'waiting') return;
      if (performanceFinished || staticMode.matches) {
        settle();
        return;
      }
      runSequence();
    };

    const isAtDocumentBottom = () =>
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 16;

    const syncVisibility = () => {
      visible = inViewport && isAtDocumentBottom();
      if (timeline && ['climbing', 'arriving'].includes(root.dataset.state ?? '')) {
        if (visible && !document.hidden) timeline.resume();
        else timeline.pause();
      }
      start();
    };

    const load = async () => {
      if (loading) return;
      loading = true;
      try {
        await Promise.all(layers.map(async (layer, index) => {
          const image = layer.querySelector('img');
          if (!image) return;
          image.src = poses[index]!.src;
          await image.decode();
        }));
        if (disposed) return;
        ready = true;
        start();
      } catch {
        root.dataset.state = 'unavailable';
        // The live email remains usable even if a decorative image fails.
      }
    };

    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        void load();
        preload.disconnect();
      }
    }, { rootMargin: '700px' });
    preload.observe(root);

    const visibility = new IntersectionObserver(([entry]) => {
      inViewport = Boolean(entry?.isIntersecting);
      syncVisibility();
    }, { threshold: [0.6, 0.85, 1] });
    visibility.observe(root);

    const onScroll = () => syncVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onVisibility = () => {
      if (document.hidden) timeline?.pause();
      else syncVisibility();
    };
    const onMotion = () => {
      if (unlocked && ready && staticMode.matches) settle();
    };

    const onLanding = () => {
      if (disposed) return;
      // The footer character is a consequence of the hero click, never an
      // independent animation discovered by scrolling.
      unlocked = true;
      start();
    };

    window.addEventListener(landingEvent, onLanding);
    document.addEventListener('visibilitychange', onVisibility);
    staticMode.addEventListener('change', onMotion);
    document.addEventListener('astro:before-swap', () => {
      disposed = true;
      timeline?.kill();
      preload.disconnect();
      visibility.disconnect();
      window.removeEventListener(landingEvent, onLanding);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      staticMode.removeEventListener('change', onMotion);
    }, { once: true });
  });
}
