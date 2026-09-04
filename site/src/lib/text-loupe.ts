/** Local text magnification, decorative and transparent to pointer/keyboard input. */
export function initTextLoupe(root: HTMLElement) {
  const allowed = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const lens = document.createElement('div');
  lens.setAttribute('aria-hidden', 'true');
  lens.dataset.textLoupe = '';
  lens.inert = true;
  lens.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:100;display:none;overflow:hidden;';
  document.body.append(lens);
  let source: HTMLElement | null = null;
  let replica: HTMLElement | null = null;
  let previousMask = '';
  let frame = 0;
  let x = 0;
  let y = 0;
  const clear = () => {
    if (source) source.style.maskImage = previousMask;
    source = replica = null;
    lens.replaceChildren();
    lens.style.display = 'none';
  };
  const copyText = (original: HTMLElement): HTMLElement => {
    const copy = original.cloneNode(false) as HTMLElement;
    const style = getComputedStyle(original);
    for (const property of style) copy.style.setProperty(property, style.getPropertyValue(property));
    for (const attribute of [...copy.attributes]) {
      if (attribute.name !== 'style') copy.removeAttribute(attribute.name);
    }
    copy.style.pointerEvents = 'none';
    copy.style.animation = 'none';
    copy.style.transition = 'none';
    copy.style.background = 'transparent';
    copy.style.boxShadow = 'none';
    copy.style.borderColor = 'transparent';
    for (const child of original.childNodes) {
      if (child instanceof HTMLElement) copy.append(copyText(child));
      else if (child.nodeType === Node.TEXT_NODE) copy.append(child.cloneNode());
    }
    return copy;
  };
  const render = () => {
    frame = 0;
    if (!source || !replica) return;
    const box = source.getBoundingClientRect();
    const localX = x - box.left;
    const localY = y - box.top;
    source.style.maskImage = `radial-gradient(circle 70px at ${localX}px ${localY}px, transparent 75%, black 100%)`;
    lens.style.maskImage = `radial-gradient(circle 70px at ${x}px ${y}px, black 75%, transparent 100%)`;
    Object.assign(replica.style, {
      position: 'absolute', left: `${box.left}px`, top: `${box.top}px`,
      width: `${box.width}px`, height: `${box.height}px`, margin: '0',
      boxSizing: 'border-box', transformOrigin: `${localX}px ${localY}px`,
      transform: 'scale(1.18)', maskImage: 'none',
    });
    lens.style.display = 'block';
  };
  const move = (event: PointerEvent) => {
    if (!allowed.matches || event.pointerType !== 'mouse' || root.dataset.state !== 'portrait') {
      clear(); return;
    }
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !root.contains(target) || target.closest('button, .btn, [role="button"]')) {
      clear(); return;
    }
    const candidate = target.closest<HTMLElement>('p, h1, h2, h3, a, label');
    if (!candidate?.textContent?.trim() || candidate.closest('[aria-hidden="true"], .sr-only') || candidate.querySelector('img, video')) {
      clear(); return;
    }
    if (candidate !== source) {
      clear();
      source = candidate;
      previousMask = source.style.maskImage;
      replica = copyText(source);
      lens.append(replica);
    }
    x = event.clientX; y = event.clientY;
    if (!frame) frame = requestAnimationFrame(render);
  };
  const observer = new MutationObserver(() => {
    if (root.dataset.state !== 'portrait') clear();
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-state'] });
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerdown', clear);
  document.addEventListener('scroll', clear, { passive: true, capture: true });
  document.documentElement.addEventListener('pointerleave', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('resize', clear);
  allowed.addEventListener('change', clear);
  return () => {
    cancelAnimationFrame(frame); clear(); lens.remove(); observer.disconnect();
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerdown', clear);
    document.removeEventListener('scroll', clear, true);
    document.documentElement.removeEventListener('pointerleave', clear);
    window.removeEventListener('blur', clear);
    window.removeEventListener('resize', clear);
    allowed.removeEventListener('change', clear);
  };
}
