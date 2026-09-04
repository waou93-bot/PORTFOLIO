/**
 * Configuration centrale du site.
 * Le nom / positionnement / coordonnées se modifient ICI uniquement.
 */
export const site = {
  name: 'Nicolas Jez',
  studioName: 'NJ Studio',
  tagline: 'Selected Works',
  title: 'Nicolas Jez — Selected Works',
  positioning: 'Je conçois des expériences web qui ne ressemblent pas à des templates.',
  subPositioning:
    'Direction artistique, UX/UI, landing pages immersives, développement front-end et motion design.',
  description:
    'Portfolio de Nicolas Jez — direction artistique, UX/UI, landing pages immersives et développement front-end. Des expériences web qui ne ressemblent pas à des templates.',
  url: import.meta.env.SITE_URL ?? 'http://localhost:4321',
  locale: 'fr_FR',
  lang: 'fr',
  email: 'nicolas.jez75@gmail.com', // Confirmé par Nicolas le 2026-09-05.
  location: 'France', // TODO_CONTENT: ville à préciser
  availability: 'Disponible pour collaborations et missions.', // TODO_CONTENT: à confirmer
  social: {
    github: '', // TODO_CONTENT
    linkedin: '', // TODO_CONTENT
    instagram: '', // TODO_CONTENT
    dribbble: '', // TODO_CONTENT
  },
  nav: [
    { label: 'Accueil', href: '/' },
    { label: 'Projets', href: '/work' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  // Feature flags — P2 par défaut off. Le contenu essentiel fonctionne sans eux.
  features: {
    smoothScroll: false,
    advancedRouteTransitions: false,
    webgl: true,
    autoVideo: false,
    lab: false,
    analytics: false,
    showDrafts: import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true',
  },
} as const;

export const profile = {
  firstName: 'Nicolas',
  lastName: 'Jez',
  role: 'Concepteur d’expériences web — direction artistique & développement front-end',
  shortBio: `TODO_CONTENT — biographie à rédiger avec le propriétaire.`, // rempli en Phase 6
  services: [
    'Direction artistique web',
    'UX / UI design',
    'Landing pages immersives',
    'Développement front-end',
    'Motion design',
    'Création assistée par IA',
    'Accompagnement à l’intégration de l’IA dans les métiers',
    'Conception et développement de SaaS et d’outils internes',
  ],
} as const;

/**
 * Photographie de performance de CE site — publiée dans /about comme preuve
 * de craft. Remplie en Phase 7 uniquement avec des mesures réelles (Lighthouse CI).
 * Tant que vide : le bloc n'est pas affiché (aucune affirmation non mesurée).
 */
export const perfSnapshot: {
  measuredAt: string;
  lighthouseMobile: number;
  lcp: string;
  cls: string;
  jsGzipKb: number;
} = {
  measuredAt: '',
  lighthouseMobile: 0,
  lcp: '',
  cls: '',
  jsGzipKb: 0,
} as const;
