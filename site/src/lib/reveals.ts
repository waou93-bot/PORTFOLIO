let observer: IntersectionObserver | null = null;

/**
 * Reveals au scroll : ajoute .is-visible quand l'élément entre dans le viewport.
 * Idempotent — réutilisable après chaque navigation (astro:page-load).
 * Respecte prefers-reduced-motion via CSS (.reveal toujours visible).
 */
export function initReveals(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)');
  if (els.length === 0) return;

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
  }

  for (const el of els) observer.observe(el);
}
