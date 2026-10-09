/**
 * Configuration centrale du site.
 * Le nom / positionnement / coordonnées se modifient ICI uniquement.
 */
export const site = {
  name: 'Nicolas Jez',
  studioName: 'NJ Studio',
  tagline: 'Design · Contenu · Web',
  title: 'Nicolas Jez — Conception de sites web',
  positioning: 'Des sites clairs, du premier écran au contenu.',
  subPositioning:
    'Direction visuelle, parcours de navigation, rédaction et développement web.',
  description:
    'Nicolas Jez conçoit des sites web en reliant direction visuelle, navigation et contenu. Découvrez ses projets en ligne et sa méthode de refonte.',
  ctaLabel: 'Proposer une collaboration',
  url: import.meta.env.SITE_URL ?? 'https://www.wadek.fr',
  locale: 'fr_FR',
  lang: 'fr',
  email: 'nicolas.jez75@gmail.com', // Confirmé par Nicolas le 2026-09-05.
  location: 'France',
  availability: 'Disponible pour collaborations et missions.',
  social: {
    github: '',
    linkedin: '',
    instagram: '',
    dribbble: '',
  },
  nav: [
    { label: 'Accueil', href: '/' },
    { label: 'Projets', href: '/work' },
    { label: 'Journal', href: '/journal' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  // Feature flags — P2 par défaut off. Le contenu essentiel fonctionne sans eux.
  features: {
    smoothScroll: false,
    advancedRouteTransitions: false,
    webgl: false,
    autoVideo: false,
    lab: false,
    analytics: false,
    showDrafts: false,
  },
} as const;

export const profile = {
  firstName: 'Nicolas',
  lastName: 'Jez',
  role: 'Concepteur d’expériences web — direction artistique',
  shortBio:
    'Je conçois des expériences web où la direction artistique, le contenu et le développement avancent ensemble. Mon travail relie identité, interfaces, motion et outils numériques pour rendre une idée claire, singulière et utilisable.',
  services: [
    'Direction artistique web',
    'UX / UI design',
    'Landing pages immersives',
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
