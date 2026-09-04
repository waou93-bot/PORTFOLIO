# Anti-patterns — liste noire du design web portfolio (2026)

À ne PAS faire, avec justification. Toute exception doit être justifiée par écrit.

## Visuels

- **Bento grid systématique** — cliché Awwwards 2025 (utilisé dans ~42 % des SOTD), percevable comme template.
- **Glassmorphism générique** — effet usé, faible contraste.
- **Marquee / texte défilant permanent** — signal « template créatif » instantané.
- **Curseur custom décoratif** — contre-performant, sans fonction = anti-accessibilité.
- **Preloader artificiel / écran « click to enter »** — frustrant ; toléré par les jurys, pas par les utilisateurs.
- **Grain excessif / bruit visuel** — dégrade la lisibilité et la netteté des médias.
- **Effet 3D sans fonction** — coût, jank, INP, pas de bénéfice narratif.

## Motion

- **Scroll hijacking** — casse clavier, espace, accessibilité, SEO, retour.
- **Animations continues sans contrôle** — scroll choppy, concentration détournée.
- **Parallax excessifs** — cause n°1 des « scroll choppy » sur les sites primés.
- **Empiler plusieurs bibliothèques d'animation** (GSAP + Motion + Lenis) — 95+ Ko gzip, INP mort.
- **Lenis sans sections pinned/scrub** — aucun bénéfice, casse les ancres par défaut, ignore reduced-motion.

## Navigation / contenu

- **Navigation cachée** (menus uniquement sur hover ou icônes mystères).
- **Textes minuscules** (< 16 px de base).
- **Scroll horizontal imposé sur mobile**.
- **Jargon vide** : « immersive », « pushing boundaries » sans preuve.
- **Dark mode mécanique** (« pour faire technique ») mal contrasté.

## Conversion

- **Fausse urgence / faux compteur / faux avis / faux client** — illégal et destructeur de confiance.
- **Dark patterns** de formulaire.
- **Formulaire inutilement long.**

## Contenu

- **Métriques inventées** (conversion, trafic, résultats) sans source.
- **Témoignages inventés**, récompenses inventées, relations client fausses.
- **Présenter un concept comme un client réel.**
- **Médias flous ou agrandis artificiellement** en prétendant qu'ils sont HD.

## Technique

- **Vidéo comme ressource LCP**, autoplay audio, préchargement de toutes les previews.
- **Hydrater toute la page pour une micro-interaction.**
- **JavaScript pour du hover réalisable en CSS.**
- **Dépendre du hover / d'un pointeur précis / du WebGL pour accéder au contenu.**
