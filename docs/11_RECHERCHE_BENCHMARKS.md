# 11 - Recherche benchmarks - Portfolio immersif Nicolas Jez

## Date et perimetre

Recherche effectuee le 2026-08-03 sur `landonorris.com`, des sources publiques de son agence et des depots GitHub accessibles. La recherche sert a definir une barre de qualite et des options d'architecture ; elle ne remplace pas la validation artistique du projet.

## Benchmark principal : Lando Norris

Le site actuel de Lando Norris expose une identite personnelle complete : accueil, navigation On Track / Off Track, calendrier, partenariats, archives de casques, boutique, reseaux sociaux et contact business. Le contenu ne s'arrete donc pas a un hero anime : il construit une marque exploitable sur plusieurs types de contenus.

Le site est identifie comme Webflow par plusieurs sources publiques. L'agence OFF+BRAND a publie une liste technique comprenant Webflow, GSAP, Rive et WebGL. Ce choix explique le niveau d'interaction possible, mais il depend aussi d'une identite, d'assets et d'un volume de production largement superieurs a ceux d'un simple portfolio.

Sources :

- https://landonorris.com/
- https://www.a1.gallery/website/lando-norris
- https://builtwith.com/landonorris.com
- https://www.linkedin.com/posts/itsoffbrand_earlier-this-year-we-had-the-absolute-pleasure-activity-7385991587983687680-DVzb

### Principes a retenir

- L'interaction doit prolonger une identite deja forte ; elle ne peut pas compenser un manque d'oeuvres.
- Le niveau premium se mesure sur l'ensemble du site : contenu, navigation, mobile, detail, coherence et finition.
- Une experience spectaculaire doit offrir un acces clair aux contenus secondaires et professionnels.
- Le mobile doit avoir un comportement concu, pas seulement une version reduite du desktop.
- Les assets et la direction visuelle sont aussi importants que la stack.

### Elements a ne pas copier

- Palette, iconographie, typographie ou composition propre a Lando Norris.
- Volume de contenu lie a une carriere sportive et a une marque commerciale.
- Dependance a une sequence de chargement ou a un effet spectaculaire si son role n'est pas justifie pour Nicolas.

## GitHub : ce que montrent les depots publics

### `erlandv/case`

https://github.com/erlandv/case

Reference utile pour la partie portfolio : theme Astro centre sur les etudes de cas, les contraintes, les decisions, les resultats et les ADR. C'est une bonne source pour la profondeur editoriale et la credibilite professionnelle. Ce n'est pas une reference suffisante pour l'univers immersif ou le niveau visuel de Lando Norris.

### `Ali-Sanati/Portfolio`

https://github.com/Ali-Sanati/Portfolio

Reference technique de demonstration : React, Vite, Three.js/React Three Fiber, Drei, Tailwind, Framer Motion et EmailJS. Elle montre la composition d'un portfolio 3D, mais son README la presente comme un portfolio 3D generique et elle ne constitue pas une preuve de niveau gold pour une carte de visite carriere.

### `rr3s1/JSM_3D_ThreeJS_Portfolio`

https://github.com/rr3s1/JSM_3D_ThreeJS_Portfolio

Reference de patterns 3D et de showcase projet, explicitement basee sur un tutoriel. A utiliser pour comprendre des briques, jamais comme direction artistique ou architecture finale.

### `pulkitxm/claude-directory`

https://github.com/pulkitxm/claude-directory

Repertoire utile pour observer de nombreux prototypes d'interface, shaders et scenes 3D. Sa nature de galerie d'experimentations generees implique qu'il ne doit pas etre utilise comme preuve de qualite de production ou comme source de verite.

## Sites creatifs comparables

### ITom

https://itomdev.com/

Reference de creative developer plus proche du projet : storytelling, animations, React/Next.js/GSAP, et Three.js/WebGL uniquement quand le projet le justifie. Son site documente aussi un projet photographique premium avec optimisation d'images, CMS, virtualisation DOM et objectif de 60 fps. Le point transferable est la discipline : les effets sont subordonnes au recit et a la performance.

### Bruno Simon

https://bruno-simon.com/

Reference de monde 3D total : conduite libre, controles clavier/tactile/gamepad, audio, reglage de qualite, respawn, carte, mode mobile et explication technique publique. C'est une excellente reference d'ingenierie et de transparence, mais une mauvaise base pour un portfolio professionnel si l'exploration libre devient obligatoire pour acceder aux oeuvres.

## Options a comparer

| Option | Force | Risque | Statut |
|---|---|---|---|
| Webflow + code custom / GSAP / Rive / WebGL | Proche du benchmark d'interaction ; vitesse de direction visuelle | Dependance plateforme, cout, controle du code et des donnees | A etudier |
| Astro + contenu versionne + ilot immersif isole | SEO, performance, controle, etudes de cas robustes et reversibles | Integration immersive plus exigeante ; besoin d'une architecture dediee | A etudier |
| Application JavaScript dediee + WebGL | Liberte maximale pour le monde interieur | Risque eleve sur performance, accessibilite, maintenance et acces aux oeuvres | A etudier |

## Conclusion provisoire

Le benchmark ne justifie pas de choisir Webflow, Three.js ou WebGL avant la direction artistique. La decision doit etre prise apres storyboard et inventaire des oeuvres, selon cinq criteres bloquants : niveau premium observable, completude du contenu, mobile, performance/accessibilite et maintenabilite.

La proposition de travail la plus prudente est d'evaluer d'abord une architecture editoriale solide avec une immersion isolee et reversible, mais cette proposition reste ouverte jusqu'a validation technique.
