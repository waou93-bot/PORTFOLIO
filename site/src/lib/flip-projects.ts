import { gsap } from 'gsap';

type Project = { title: string; meta: string; href: string; src: string };

/** Two hinged leaves; stable links also remain below the moving display. */
export function initFlipProjects(root: HTMLElement) {
  const board = root.querySelector<HTMLElement>('[data-flip-projects]');
  const pause = root.querySelector<HTMLButtonElement>('[data-flip-pause]');
  if (!board || !pause) return () => {};
  const projects: Project[] = JSON.parse(board.dataset.projects ?? '[]');
  const cards = Array.from(board.querySelectorAll<HTMLAnchorElement>('.mind-project'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stopped = false;
  let disposed = false;
  let hovering = false;
  let visible = false;
  let timer: ReturnType<typeof setTimeout>;
  let active: gsap.core.Timeline | undefined;
  let ready = false;

  // Decode ahead of the first turn; never reveal an unloaded cover.
  void Promise.all(projects.map(project => new Promise<void>(resolve => {
    const img = new Image();
    img.src = project.src;
    void img.decode().then(() => resolve(), () => resolve());
  }))).then(() => { ready = true; });

  const blocked = () => disposed || !ready || stopped || hovering || !visible ||
    document.hidden || motion.matches || root.dataset.state !== 'revealed' ||
    board.contains(document.activeElement);

  const flip = (card: HTMLAnchorElement, index: number) => new Promise<void>(resolve => {
    const project = projects[index];
    const face = card.querySelector<HTMLElement>('.mind-project-face');
    if (!project || !face) { resolve(); return; }
    const next = face.cloneNode(true) as HTMLElement;
    next.querySelector('img')!.src = project.src;
    next.querySelector('img')!.style.objectPosition = index === 0 ? 'center 72%' : 'center';
    next.querySelector('.mind-project-name')!.textContent = project.title;
    next.querySelector('.mind-project-meta')!.textContent = project.meta;
    next.querySelector('.mind-project-index')!.textContent = `0${index + 1}`;
    const leaf = (content: HTMLElement, name: string) => {
      const el = document.createElement('span');
      el.className = `flip-leaf ${name}`;
      el.setAttribute('aria-hidden', 'true');
      el.append(content.cloneNode(true));
      card.append(el);
      return el;
    };
    const oldBottom = leaf(face, 'flip-bottom');
    const oldTop = leaf(face, 'flip-top');
    const newBottom = leaf(next, 'flip-bottom flip-incoming');
    face.replaceWith(next);
    card.dataset.flipping = 'true';
    gsap.set(newBottom, { rotationX: 90 });
    active = gsap.timeline({ onComplete: () => {
      oldBottom.remove(); oldTop.remove(); newBottom.remove();
      card.href = project.href;
      card.setAttribute('aria-label', `Découvrir ${project.title}`);
      card.dataset.projectIndex = String(index);
      delete card.dataset.flipping;
      active = undefined;
      resolve();
    }});
    active.to(oldTop, { rotationX: -90, duration: 0.34, ease: 'power2.in' })
      .to(newBottom, { rotationX: 0, duration: 0.46, ease: 'power2.out' });
  });

  const settle = () => { active?.progress(1); };
  const schedule = () => {
    if (disposed) return;
    timer = setTimeout(async () => {
      if (!blocked() && cards.length > 1) {
        const a = Math.floor(Math.random() * cards.length);
        const b = (a + 1 + Math.floor(Math.random() * (cards.length - 1))) % cards.length;
        const first = cards[a]!;
        const second = cards[b]!;
        const firstIndex = Number(first.dataset.projectIndex);
        const secondIndex = Number(second.dataset.projectIndex);
        await flip(first, secondIndex);
        // Finish the exchange without a second moving panel if the visitor interacts.
        if (!disposed) {
          const other = flip(second, firstIndex);
          if (blocked()) settle();
          await other;
        }
      }
      schedule();
    }, 4800 + Math.random() * 3400);
  };
  const enter = () => { hovering = true; settle(); };
  const leave = () => { hovering = false; };
  const focus = () => settle();
  const toggle = () => {
    stopped = !stopped;
    pause.setAttribute('aria-pressed', String(stopped));
    pause.textContent = stopped ? 'Relancer les palettes' : 'Mettre les palettes en pause';
    if (stopped) settle();
  };
  const hide = () => { if (document.hidden) settle(); };
  board.addEventListener('pointerenter', enter);
  board.addEventListener('pointerleave', leave);
  board.addEventListener('pointerdown', enter);
  board.addEventListener('focusin', focus);
  pause.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', hide);
  motion.addEventListener('change', focus);
  const observer = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    if (!visible) settle();
  }, { threshold: 0.2 });
  observer.observe(board);
  schedule();
  return () => {
    disposed = true;
    clearTimeout(timer);
    settle();
    observer.disconnect();
    board.removeEventListener('pointerenter', enter);
    board.removeEventListener('pointerleave', leave);
    board.removeEventListener('pointerdown', enter);
    board.removeEventListener('focusin', focus);
    pause.removeEventListener('click', toggle);
    document.removeEventListener('visibilitychange', hide);
    motion.removeEventListener('change', focus);
  };
}
