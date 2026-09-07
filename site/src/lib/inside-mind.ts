import { gsap } from 'gsap';
import { navigate } from 'astro:transitions/client';
import * as THREE from 'three';
import { initFlipProjects } from './flip-projects';
import { initTextLoupe } from './text-loupe';
import { prepareRoom } from './room-preload';

type MindElements = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  flight: HTMLVideoElement;
  clouds: HTMLVideoElement;
  cloudsAlt: HTMLVideoElement;
  portrait: HTMLImageElement;
  echo: HTMLImageElement;
  copy: HTMLElement;
  actions: HTMLElement;
  world: HTMLElement;
  worldTitle: HTMLElement;
  enter: HTMLButtonElement;
  footerLauncher: HTMLButtonElement;
  footerLauncherCharacter: HTMLElement;
  skipPlaying: HTMLButtonElement;
  reset: HTMLButtonElement;
  status: HTMLElement;
  loader: HTMLElement;
  loaderBar: HTMLElement;
  loaderValue: HTMLElement;
  loaderSkip: HTMLButtonElement;
};

const HERO_SEQUENCE = Array.from(
  { length: 30 },
  (_, index) =>
    `/media/identity/sequence-expression-v1/frame-${String(index + 1).padStart(2, '0')}.webp`,
);

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const getSequencePace = (index: number) => {
  const lastIndex = HERO_SEQUENCE.length - 1;
  const progress = lastIndex === 0 ? 0 : index / lastIndex;
  const distanceFromMiddle = Math.abs(progress * 2 - 1);

  // Ease into both reversals without holding or duplicating either endpoint.
  return Math.round(100 + 35 * distanceFromMiddle ** 2);
};

const selectElements = (root: HTMLElement): MindElements | null => {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-mind-canvas]');
  const flight = root.querySelector<HTMLVideoElement>('[data-mind-flight]');
  const clouds = root.querySelector<HTMLVideoElement>('[data-mind-clouds]');
  const cloudsAlt = root.querySelector<HTMLVideoElement>('[data-mind-clouds-alt]');
  const portrait = root.querySelector<HTMLImageElement>('.mind-portrait');
  const echo = root.querySelector<HTMLImageElement>('.mind-portrait-echo');
  const copy = root.querySelector<HTMLElement>('[data-mind-copy]');
  const actions = root.querySelector<HTMLElement>('[data-mind-actions]');
  const world = root.querySelector<HTMLElement>('[data-mind-world]');
  const worldTitle = root.querySelector<HTMLElement>('[data-mind-world-title]');
  const enter = root.querySelector<HTMLButtonElement>('[data-mind-enter]');
  const footerLauncher = root.querySelector<HTMLButtonElement>('[data-mind-footer-launcher]');
  const footerLauncherCharacter = root.querySelector<HTMLElement>('.mind-footer-launcher-character');
  const skipPlaying = root.querySelector<HTMLButtonElement>('[data-mind-skip-playing]');
  const reset = root.querySelector<HTMLButtonElement>('[data-mind-reset]');
  const status = root.querySelector<HTMLElement>('[data-mind-status]');
  const loader = root.querySelector<HTMLElement>('[data-mind-loader]');
  const loaderBar = root.querySelector<HTMLElement>('[data-mind-loader-bar]');
  const loaderValue = root.querySelector<HTMLElement>('[data-mind-loader-value]');
  const loaderSkip = root.querySelector<HTMLButtonElement>('[data-mind-loader-skip]');

  if (
    !canvas ||
    !flight ||
    !clouds ||
    !cloudsAlt ||
    !portrait ||
    !echo ||
    !copy ||
    !actions ||
    !world ||
    !worldTitle ||
    !enter ||
    !footerLauncher ||
    !footerLauncherCharacter ||
    !skipPlaying ||
    !reset ||
    !status ||
    !loader ||
    !loaderBar ||
    !loaderValue ||
    !loaderSkip
  ) {
    return null;
  }

  return {
    root,
    canvas,
    flight,
    clouds,
    cloudsAlt,
    portrait,
    echo,
    copy,
    actions,
    world,
    worldTitle,
    enter,
    footerLauncher,
    footerLauncherCharacter,
    skipPlaying,
    reset,
    status,
    loader,
    loaderBar,
    loaderValue,
    loaderSkip,
  };
};

const createPortal = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uResolution;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= uResolution.x / max(uResolution.y, 1.0);
        float radius = length(uv);
        float angle = atan(uv.y, uv.x);
        float tunnel = sin(radius * 54.0 - uTime * 1.5 + angle * 2.0) * 0.5 + 0.5;
        float ring = smoothstep(0.035, 0.0, abs(radius - mix(0.08, 0.42, uProgress)));
        float rays = pow(max(0.0, sin(angle * 9.0 + uTime * 0.22)), 22.0) * smoothstep(0.48, 0.05, radius);
        float grain = hash(floor(vUv * uResolution * 0.32) + floor(uTime * 4.0));

        vec3 deep = vec3(0.008, 0.025, 0.09);
        vec3 electric = vec3(0.04, 0.28, 0.72);
        vec3 copper = vec3(0.95, 0.27, 0.06);
        vec3 color = mix(deep, electric, smoothstep(0.62, 0.02, radius) * (0.35 + tunnel * 0.22));
        color += copper * ring * (1.0 - uProgress * 0.62);
        color += electric * rays * (0.15 + uProgress * 0.5);
        color += (grain - 0.5) * 0.035;

        float alpha = smoothstep(0.78, 0.02, radius) * mix(0.4, 1.0, uProgress);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    uniforms.uResolution.value.set(clientWidth, clientHeight);
  };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let frame = 0;
  let running = false;
  let previousTime = performance.now();
  const render = () => {
    if (!running) return;
    const now = performance.now();
    uniforms.uTime.value += Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };

  return {
    uniforms,
    start() {
      if (running) return;
      running = true;
      previousTime = performance.now();
      render();
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    renderOnce() {
      renderer.render(scene, camera);
    },
    dispose() {
      observer.disconnect();
      cancelAnimationFrame(frame);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
};

export const initInsideMindHero = () => {
  document.querySelectorAll<HTMLElement>('[data-inside-mind]').forEach((root) => {
    if (root.dataset.initialized === 'true') return;
    const elements = selectElements(root);
    if (!elements) return;
    root.dataset.initialized = 'true';
    const disposeFlipProjects = initFlipProjects(root);
    const disposeTextLoupe = initTextLoupe(root);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webglAvailable = (() => {
      try {
        const probe = document.createElement('canvas');
        return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
      } catch {
        return false;
      }
    })();

    const portal = webglAvailable && !reduceMotion ? createPortal(elements.canvas) : null;
    portal?.renderOnce();

    let sequenceRun = 0;
    const portraitHalves = [...root.querySelectorAll<HTMLImageElement>('[data-portrait-half]')];
    let halfTimeline: gsap.core.Timeline | null = null;
    let burstTimer = 0;
    const clearHalves = () => {
      halfTimeline?.kill();halfTimeline=null;
      gsap.set(portraitHalves,{opacity:0,x:0,y:0});
      delete root.dataset.division;delete root.dataset.nextFrame;
    };
    let sequencePlaying = false;
    let launcherIdleTimer = 0;
    let launcherIdleIndex = 0;
    const launcherIdleBeats = [
      // Keep the invitation legible: the character remains suspended overhead.
      { pose: 0, beat: 0, duration: 1200 },
      { pose: 1, beat: 1, duration: 760 },
      { pose: 0, beat: 0, duration: 1200 },
      { pose: 2, beat: 2, duration: 760 },
    ];
    const stopLauncherIdle = () => {
      window.clearTimeout(launcherIdleTimer);
      launcherIdleTimer = 0;
    };
    const playLauncherIdle = () => {
      stopLauncherIdle();
      if (reduceMotion || root.dataset.state !== 'portrait' || root.dataset.footerLaunch) return;
      const beat = launcherIdleBeats[launcherIdleIndex % launcherIdleBeats.length]!;
      elements.footerLauncher.dataset.launcherPose = String(beat.pose);
      elements.footerLauncher.dataset.launcherBeat = String(beat.beat);
      launcherIdleIndex += 1;
      launcherIdleTimer = window.setTimeout(playLauncherIdle, beat.duration);
    };
    let footerLaunchTimeline: gsap.core.Timeline | null = null;
    const mouseMotion = window.matchMedia('(hover: hover) and (pointer: fine)');
    let lastMouseMovement = -Infinity;
    let sequenceSpeed = 1;
    let speedUpdatedAt = performance.now();
    const gazeTo = {
      x: gsap.quickTo(root, '--gaze-x', { duration: 0.38, ease: 'power3.out' }),
      y: gsap.quickTo(root, '--gaze-y', { duration: 0.38, ease: 'power3.out' }),
    };
    root.style.setProperty('--gaze-x', '0px');
    root.style.setProperty('--gaze-y', '0px');
    const resetGaze = () => {
      gazeTo.x(0);
      gazeTo.y(0);
    };
    const trackGaze = (event: PointerEvent) => {
      if (
        reduceMotion ||
        !mouseMotion.matches ||
        event.pointerType !== 'mouse' ||
        (root.dataset.state !== 'portrait' && root.dataset.state !== 'playing')
      ) return;
      const bounds = elements.portrait.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
      gazeTo.x(x * 3.5);
      gazeTo.y(y * 2.5);
    };
    const trackPortraitMovement = (event: PointerEvent) => {
      if (reduceMotion || !mouseMotion.matches || event.pointerType !== 'mouse' ||
        root.dataset.state !== 'portrait' || (!event.movementX && !event.movementY)) return;
      lastMouseMovement = performance.now();
    };
    const leavePortrait = () => {
      lastMouseMovement = -Infinity;
      resetGaze();
    };
    const getResponsivePace = (index: number) => {
      const now = performance.now();
      const target = mouseMotion.matches && now - lastMouseMovement < 1000 ? 0.6 : 1;
      const elapsed = now - speedUpdatedAt;
      // Ease velocity, not frame position: preserve the continuous ping-pong.
      const responseTime = target < sequenceSpeed ? 300 : 450;
      sequenceSpeed += (target - sequenceSpeed) * (1 - Math.exp(-elapsed / responseTime));
      speedUpdatedAt = now;
      return getSequencePace(index) / sequenceSpeed;
    };
    root.addEventListener('pointermove', trackGaze, { passive: true });
    root.addEventListener('pointermove', trackPortraitMovement, { passive: true });
    root.addEventListener('pointerleave', leavePortrait);
    let idleReplay = 0;
    let nextGlitchAt = 0;
    let glitchEndsAt = 0;
    let lastGlitch = '';
    const glitchTypes = ['bands', 'tear', 'slice', 'chroma', 'diagonal', 'horizontal'];
    const clearGlitch = () => {
      clearHalves();
      delete root.dataset.split;
      delete root.dataset.glitch;
    };

    const updateGlitch = () => {
      if (reduceMotion || !sequencePlaying || document.hidden) {
        clearGlitch();
        nextGlitchAt = performance.now() + 2200;
        return;
      }
      const now = performance.now();
      if (root.dataset.glitch && now >= glitchEndsAt) clearGlitch();
      if (now < nextGlitchAt) return;
      const choices = glitchTypes.filter(type => type !== lastGlitch);
      lastGlitch = choices[Math.floor(Math.random() * choices.length)] ?? 'tear';
      const duration = 220 + Math.round(Math.random() * 160);
      root.style.setProperty('--glitch-duration', `${duration}ms`);
      root.style.setProperty('--glitch-shift', `${4 + Math.round(Math.random() * 4)}px`);
      root.style.setProperty('--glitch-band-top', `${18 + Math.round(Math.random() * 40)}%`);
      root.dataset.split = Math.random() < 0.5 ? 'left' : 'right';
      root.dataset.glitch = lastGlitch;
      if(lastGlitch==='diagonal'||lastGlitch==='horizontal'){
        delete root.dataset.split;
        root.dataset.division=lastGlitch;
        const diagonal=lastGlitch==='diagonal';
        const clips=diagonal?['polygon(0 0,72% 0,28% 100%,0 100%)','polygon(72% 0,100% 0,100% 100%,28% 100%)']:['inset(0 0 50% 0)','inset(50% 0 0 0)'];
        portraitHalves.forEach((half,i)=>half.style.clipPath=clips[i]!);
        halfTimeline=gsap.timeline().to(portraitHalves,{opacity:.85,x:(i:number)=>diagonal?(i===0?-9:9):0,duration:duration/2000,ease:'sine.inOut'})
          .to(portraitHalves,{opacity:0,x:0,duration:duration/2000,ease:'sine.inOut'});
      }
      glitchEndsAt = now + duration;
      // Independent from the portrait ping-pong: leave irregular quiet intervals.
      nextGlitchAt = glitchEndsAt + 6500 + Math.random() * 8500;
    };

    const setSequenceFrame = (index: number) => {
      const source = HERO_SEQUENCE[index] ?? '/media/identity/sequence-expression-v1/frame-01.webp';
      updateGlitch();
      const splitSide = root.dataset.split;
      // Keep the swap tactile but almost invisible: soften only the sharp edge
      // of the source change, then let the portrait resolve immediately.
      elements.portrait.style.filter = 'blur(0.45px) saturate(1.04) contrast(1.02)';
      elements.portrait.src = source;
      elements.echo.src = splitSide
        ? (HERO_SEQUENCE[Math.min(index + 1, HERO_SEQUENCE.length - 1)] ?? source)
        : source;
      root.dataset.frame = String(index + 1);
      if(root.dataset.division)portraitHalves.forEach((half,i)=>{half.src=HERO_SEQUENCE[(index+i+2)%HERO_SEQUENCE.length]!;});
      window.setTimeout(() => {
        elements.portrait.style.removeProperty('filter');
      }, 70);
    };

    const cancelSequence = (frame = 0) => {
      clearHalves();
      sequenceRun += 1;
      sequencePlaying = false;
      lastMouseMovement = -Infinity;
      sequenceSpeed = 1;
      window.clearTimeout(idleReplay);
      delete root.dataset.sequence;
      resetGaze();
      setSequenceFrame(frame);
    };

    const scheduleReplay = (delay = 80) => {
      window.clearTimeout(idleReplay);
      if (reduceMotion || root.dataset.state !== 'portrait') return;
      idleReplay = window.setTimeout(() => void playSequence(), delay);
    };

    const playSequence = async () => {
      if (reduceMotion || sequencePlaying || root.dataset.state !== 'portrait') return;
      sequencePlaying = true;
      resetGaze();
      speedUpdatedAt = performance.now();
      nextGlitchAt = performance.now() + 5000 + Math.random() * 5000;
      const run = ++sequenceRun;
      root.dataset.sequence = 'playing';

      let index = Math.max(0,Number(root.dataset.frame||1)-1);
      let direction = 1;
      while (run === sequenceRun && root.dataset.state === 'portrait') {
        if(document.hidden){await wait(300);continue;}
        setSequenceFrame(index);
        await wait(getResponsivePace(index));
        if(index===HERO_SEQUENCE.length-1)direction=-1;
        if(index===0)direction=1;
        index+=direction;
      }
    };

    const preloadSequence = (onProgress?: (loaded: number) => void) => {
      let loaded = 0;
      const images = HERO_SEQUENCE.map(
        (source) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            const done = () => {
              loaded += 1;
              onProgress?.(loaded);
              resolve();
            };
            image.addEventListener('load', done, { once: true });
            image.addEventListener('error', done, { once: true });
            image.src = source;
          }),
      );
      return Promise.all(images);
    };

    const setLoaderProgress = (value: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(value)));
      elements.loaderValue.textContent = String(clamped);
      gsap.to(elements.loaderBar, {
        scaleX: clamped / 100,
        duration: reduceMotion ? 0 : 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    let loaderComplete = false;
    const finishLoader = () => {
      if (loaderComplete) return;
      loaderComplete = true;
      setLoaderProgress(100);
      elements.loader.dataset.exit = 'ink';
      gsap.to(elements.loader, {
        autoAlpha: 0,
        duration: reduceMotion ? 0.01 : 0.72,
        delay: reduceMotion ? 0 : 0.2,
        ease: 'power2.inOut',
        onComplete: () => {
          elements.loader.hidden = true;
          root.dataset.state = 'portrait';
          playLauncherIdle();
          elements.status.textContent = 'Portrait chargé. L’introduction immersive est disponible.';
          void playSequence();
        },
      });
    };

    elements.loaderSkip.addEventListener('click', finishLoader);
    setLoaderProgress(18);
    const startedAt = performance.now();
    const portraitReady = elements.portrait.complete
      ? elements.portrait.decode().catch(() => undefined)
      : new Promise<void>((resolve) => {
          elements.portrait.addEventListener('load', () => resolve(), { once: true });
          elements.portrait.addEventListener('error', () => resolve(), { once: true });
        });

    Promise.all([
      portraitReady,
      preloadSequence((loaded) => setLoaderProgress(18 + (loaded / HERO_SEQUENCE.length) * 72)),
    ]).then(() => {
      setLoaderProgress(92);
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      window.setTimeout(finishLoader, remaining);
    });
    window.setTimeout(finishLoader, 6500);

    gsap.set(elements.world, { autoAlpha: 0, scale: 1.04 });
    gsap.set(elements.flight, {
      autoAlpha: 0,
      scale: 1.04,
      xPercent: -1.5,
      yPercent: 1.5,
      rotateZ: -0.35,
      filter: 'blur(12px) saturate(1.06) contrast(1.02) brightness(0.72)',
    });
    const cloudLayers: [HTMLVideoElement, HTMLVideoElement] = [elements.clouds, elements.cloudsAlt];
    const cloudLoopStart = 8.45;
    const cloudLoopEnd = 12.5;
    const cloudPlaybackRate = 0.22;
    const cloudCrossfadeDuration = 2.8;
    const cloudOpacity = 0.48;
    let activeCloudIndex: 0 | 1 = 0;
    let cloudSwapTimer: number | undefined;

    gsap.set(cloudLayers, {
      autoAlpha: 0,
      scale: 1.36,
      xPercent: 1.5,
      yPercent: -3,
      rotateZ: 0.45,
      filter: 'saturate(1.08) contrast(1.02) brightness(0.94)',
    });

    const stopCloudLoop = () => {
      if (cloudSwapTimer !== undefined) window.clearTimeout(cloudSwapTimer);
      cloudSwapTimer = undefined;
      gsap.killTweensOf(cloudLayers);
      cloudLayers.forEach((layer) => layer.pause());
    };

    const scheduleCloudSwap = () => {
      const segmentDuration = (cloudLoopEnd - cloudLoopStart) / cloudPlaybackRate;
      const delay = Math.max(1, segmentDuration - cloudCrossfadeDuration);
      cloudSwapTimer = window.setTimeout(() => {
        const outgoing = cloudLayers[activeCloudIndex];
        const nextCloudIndex: 0 | 1 = activeCloudIndex === 0 ? 1 : 0;
        const incoming = cloudLayers[nextCloudIndex];

        incoming.currentTime = cloudLoopStart;
        incoming.playbackRate = cloudPlaybackRate;
        gsap.set(incoming, { autoAlpha: 0 });
        void incoming.play().catch(() => undefined);
        gsap.to(incoming, {
          autoAlpha: cloudOpacity,
          duration: cloudCrossfadeDuration,
          ease: 'sine.inOut',
        });
        gsap.to(outgoing, {
          autoAlpha: 0,
          duration: cloudCrossfadeDuration,
          ease: 'sine.inOut',
          onComplete: () => outgoing.pause(),
        });

        activeCloudIndex = nextCloudIndex;
        scheduleCloudSwap();
      }, delay * 1000);
    };

    const startCloudLoop = () => {
      stopCloudLoop();
      activeCloudIndex = 0;
      const activeCloud = cloudLayers[activeCloudIndex];
      activeCloud.currentTime = cloudLoopStart;
      activeCloud.playbackRate = cloudPlaybackRate;
      gsap.set(cloudLayers, { autoAlpha: 0 });
      void activeCloud.play().catch(() => undefined);
      gsap.to(activeCloud, { autoAlpha: cloudOpacity, duration: 1.1, ease: 'power2.out' });
      scheduleCloudSwap();
    };

    const revealWorld = (focus = true) => {
      root.dataset.state = 'revealed';
      elements.flight.pause();
      if (!reduceMotion) startCloudLoop();
      elements.world.setAttribute('aria-hidden', 'false');
      elements.skipPlaying.hidden = true;
      gsap.set(elements.skipPlaying, { display: 'none', autoAlpha: 0 });
      elements.status.textContent =
        'Le monde intérieur est ouvert. Les quatre projets sont accessibles.';
      if (focus) elements.worldTitle.focus({ preventScroll: true });
    };

    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
    timeline
      .call(() => { delete root.dataset.rupture; }, [], 1.05)
      .to([elements.copy, elements.actions], { autoAlpha: 0, y: -18, duration: 0.55 }, 0.65)
      .set(elements.skipPlaying, { display: 'block' }, 0.12)
      .to(
        elements.echo,
        {
          autoAlpha: 0,
          duration: 0.9,
        },
        0.84,
      )
      .to(
        elements.flight,
        {
          autoAlpha: 1,
          scale: 1.08,
          filter: 'blur(0px) saturate(1.12) contrast(1.04) brightness(0.88)',
          duration: 1.7,
          ease: 'power2.inOut',
        },
        0.78,
      )
      .to(
        elements.flight,
        {
          scale: 1.36,
          xPercent: 1.5,
          yPercent: -3,
          rotateZ: 0.45,
          filter: 'saturate(1.2) contrast(1.08) brightness(1)',
          duration: 3.8,
          ease: 'sine.inOut',
        },
        2.35,
      )
      .to(elements.portrait, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.72)
      .to(elements.world, { autoAlpha: 1, scale: 1, duration: 1.25, ease: 'power2.out' }, 5.25)
      .to(
        elements.flight,
        {
          autoAlpha: 0.42,
          filter: 'saturate(1.08) contrast(1.02) brightness(0.94)',
          duration: 1.1,
        },
        5.45,
      )
      .add(() => revealWorld(), 6.45);

    let universeHandoff = 0;
    const openUniverseV2 = () => {
      void navigate('/univers-v2').then(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
    };
    const play = () => {
      if (root.dataset.state === 'playing' || root.dataset.state === 'revealed') return;
      stopLauncherIdle();
      root.dataset.state = 'playing';
      const interruptedFrame = Math.max(0, Number(root.dataset.nextFrame ?? root.dataset.frame ?? 1) - 1);
      sequenceRun+=1;halfTimeline?.kill();
      // Resolve both halves into their destination before the short rapid sequence.
      if(root.dataset.nextFrame)gsap.to(portraitHalves,{opacity:1,x:0,y:0,duration:.18,ease:'sine.out'});
      const universeReady=prepareRoom();
      elements.status.textContent =
        'Introduction en cours. Le passage vers les projets peut être ignoré.';
      elements.skipPlaying.hidden = false;
      gsap.set(elements.skipPlaying, { display: 'block', autoAlpha: 1 });
      universeHandoff=window.setTimeout(()=>{
        cancelSequence(interruptedFrame);
        let burstFrame=0;
        burstTimer=window.setInterval(()=>{
          const index=(interruptedFrame+burstFrame)%HERO_SEQUENCE.length;
          elements.portrait.src=HERO_SEQUENCE[index]!;elements.echo.src=HERO_SEQUENCE[index]!;
          root.dataset.frame=String(index+1);burstFrame++;
        },85);
        universeHandoff=window.setTimeout(async()=>{
          await Promise.race([universeReady,wait(1800)]);
          if(root.dataset.state!=='playing'||!root.isConnected)return;
          window.clearInterval(burstTimer);
          elements.echo.src=HERO_SEQUENCE[(interruptedFrame+9)%HERO_SEQUENCE.length]!;
          root.dataset.rupture='true';
          universeHandoff=window.setTimeout(openUniverseV2,1000);
        },680);
      },180);
    };

    const skip = () => {
      stopLauncherIdle();
      window.clearTimeout(universeHandoff);
      window.clearInterval(burstTimer);clearHalves();
      root.dataset.state='revealed';
      openUniverseV2();
      return;
    };

    const reset = () => {
      stopLauncherIdle();
      launcherIdleIndex = 0;
      footerLaunchTimeline?.kill();
      footerLaunchTimeline = null;
      delete root.dataset.footerLaunch;
      elements.footerLauncher.disabled = false;
      delete root.dataset.rupture;
      cancelSequence(0);
      timeline.pause(0);
      elements.flight.pause();
      elements.flight.currentTime = 0;
      stopCloudLoop();
      cloudLayers.forEach((layer) => {
        layer.currentTime = 0;
      });
      portal?.stop();
      if (portal) {
        portal.uniforms.uProgress.value = 0;
        portal.renderOnce();
      }
      gsap.set(elements.copy, { clearProps: 'all' });
      gsap.set(elements.actions, { clearProps: 'all' });
      gsap.set(elements.footerLauncher, { clearProps: 'all' });
      gsap.set(elements.footerLauncherCharacter, { clearProps: 'all' });
      gsap.set(elements.portrait, { clearProps: 'all' });
      gsap.set(elements.echo, { clearProps: 'all' });
      gsap.set(elements.flight, {
        autoAlpha: 0,
        scale: 1.04,
        xPercent: -1.5,
        yPercent: 1.5,
        rotateZ: -0.35,
        filter: 'blur(12px) saturate(1.06) contrast(1.02) brightness(0.72)',
      });
      gsap.set(cloudLayers, {
        autoAlpha: 0,
        scale: 1.36,
        xPercent: 1.5,
        yPercent: -3,
        rotateZ: 0.45,
        filter: 'saturate(1.08) contrast(1.02) brightness(0.94)',
      });
      gsap.set(elements.canvas, { autoAlpha: 0 });
      gsap.set(elements.world, { autoAlpha: 0, scale: 1.04 });
      elements.world.setAttribute('aria-hidden', 'true');
      elements.skipPlaying.hidden = true;
      root.dataset.state = 'portrait';
      playLauncherIdle();
      elements.status.textContent = 'Retour au portrait.';
      elements.enter.focus({ preventScroll: true });
      scheduleReplay(80);
    };

    const launchFooter = () => {
      if (root.dataset.state !== 'portrait' || root.dataset.footerLaunch === 'falling') return;

      stopLauncherIdle();
      elements.footerLauncher.disabled = true;
      root.dataset.footerLaunch = 'falling';
      elements.status.textContent = 'Nicolas tombe vers les coordonnées.';
      elements.footerLauncher.dataset.launcherPose = '3';
      elements.footerLauncher.dataset.launcherBeat = '0';
      gsap.set(elements.footerLauncherCharacter, { x: 0, y: 0, rotation: 0, autoAlpha: 1 });

      const goToFooter = () => {
        root.dataset.footerLaunch = 'done';
        window.dispatchEvent(new CustomEvent('nicolas:fall-to-footer'));
      };

      if (reduceMotion) {
        goToFooter();
        return;
      }

      footerLaunchTimeline = gsap.timeline({ onComplete: goToFooter });
      footerLaunchTimeline
        // Release, reach, then drop almost vertically with small comic beats.
        .to(elements.footerLauncherCharacter, { x: 1, y: 14, rotation: -4, duration: 0.12, ease: 'steps(1)' }, 0)
        .call(() => {
          elements.footerLauncher.dataset.launcherPose = '4';
        }, [], 0.1)
        .to(elements.footerLauncherCharacter, { x: 3, y: 42, rotation: -12, duration: 0.14, ease: 'steps(1)' }, 0.1)
        .call(() => {
          elements.footerLauncher.dataset.launcherPose = '5';
        }, [], 0.24)
        .to(elements.footerLauncherCharacter, { x: 6, y: 76, rotation: -8, duration: 0.14, ease: 'steps(1)' }, 0.24)
        .call(() => {
          elements.footerLauncher.dataset.launcherPose = '6';
        }, [], 0.38)
        .to(elements.footerLauncherCharacter, { x: 3, y: 116, rotation: 6, duration: 0.16, ease: 'steps(1)' }, 0.38)
        .call(() => {
          elements.footerLauncher.dataset.launcherPose = '7';
        }, [], 0.54)
        .to(elements.footerLauncherCharacter, { x: -2, y: 162, rotation: 14, duration: 0.18, ease: 'steps(1)' }, 0.54)
        .call(() => {
          elements.footerLauncher.dataset.launcherPose = '8';
        }, [], 0.72)
        .to(elements.footerLauncherCharacter, { x: -5, y: 212, rotation: 24, autoAlpha: 0, duration: 0.28, ease: 'steps(2)' }, 0.72);
    };

    elements.enter.addEventListener('click', reduceMotion ? skip : play);
    elements.enter.addEventListener('pointermove', (event) => {
      const bounds = elements.enter.getBoundingClientRect();
      elements.enter.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
      elements.enter.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
    });
    elements.enter.addEventListener('pointerenter', () => scheduleReplay(0));
    elements.enter.addEventListener('focus', () => scheduleReplay(0));
    elements.footerLauncher.addEventListener('click', launchFooter);
    elements.skipPlaying.addEventListener('click', skip);
    elements.reset.addEventListener('click', reset);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && root.dataset.state === 'revealed') {
          portal?.start();
          startCloudLoop();
        }
        if (!entry.isIntersecting) {
          portal?.stop();
          elements.flight.pause();
          stopCloudLoop();
        }
      },
      { threshold: 0.05 },
    );
    visibility.observe(root);

    document.addEventListener(
      'astro:before-swap',
      () => {
        window.clearTimeout(universeHandoff);
        window.clearInterval(burstTimer);
        stopLauncherIdle();
        footerLaunchTimeline?.kill();
        visibility.disconnect();
        root.removeEventListener('pointermove', trackGaze);
        root.removeEventListener('pointermove', trackPortraitMovement);
        root.removeEventListener('pointerleave', leavePortrait);
        elements.footerLauncher.removeEventListener('click', launchFooter);
        delete root.dataset.rupture;
        disposeFlipProjects();
        disposeTextLoupe();
        cancelSequence(0);
        stopCloudLoop();
        portal?.dispose();
      },
      { once: true },
    );
  });
};
