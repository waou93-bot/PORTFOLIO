# 14 - Comparatif plateforme et stack - Portfolio immersif Nicolas Jez

## Statut

- Version : 0.1
- Date : 2026-08-04
- Statut : analyse et recommandation a arbitrer ; aucune stack choisie
- Production : tranche verticale codée dans `site/`, en correction et recette ; publication non autorisée

## Question de contenu : faut-il tout publier tout de suite ?

Oui, le site peut commencer avec seulement une partie des oeuvres. La condition est que la selection publiee soit volontaire, complete et defendable comme une carte de visite.

La regle correcte n'est pas « toutes les oeuvres existantes doivent etre en ligne des le premier jour ». Elle est : « toutes les oeuvres que la version publique promet de montrer doivent etre presentes, finies, accessibles et fonctionnelles ».

### Strategie recommandee par phases

| Statut interne | Visible publiquement | Condition                                                                                    |
| -------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| `SHOW_NOW`     | Oui                  | Etude de cas complete, medias propres, droits confirmes, lien teste et niveau gold atteint.  |
| `HOLD`         | Non                  | Projet interessant mais contenu, assets, droits ou presentation encore incomplets.           |
| `LATER`        | Non                  | Projet prevu pour une phase suivante, ajoute ensuite dans le meme modele de contenu.         |
| `REJECTED`     | Non                  | Projet qui ne sert pas le positionnement, ou dont les droits/qualite ne sont pas suffisants. |

La home ne doit jamais afficher de cartes vides, de « coming soon », de compteurs qui revelent un manque ou de rubrique visiblement incomplete. Une premiere version peut etre une selection curate de trois a cinq projets forts, distincts et totalement documentes, avec une presentation claire de Nicolas, un contact et un acces CV. En dessous de trois projets, le site risque de ressembler davantage a une etude de concept qu'a un portfolio professionnel complet ; ce seuil reste une recommandation de lancement, pas une regle artistique absolue.

### Ce qui doit etre verrouille avant code

Le nombre final de projets de la phase 1 peut rester ouvert, mais le modele de contenu doit etre stable. Chaque projet doit pouvoir contenir au minimum : titre, categorie, annee, role de Nicolas, resume, contexte, demarche, medias, resultat ou intention, liens, droits, texte alternatif, statut de publication et metadonnees SEO.

Avec ce modele, ajouter une oeuvre plus tard est une addition de contenu. Ce ne doit pas devenir une refonte de navigation, de design ou de l'animation d'accueil.

## Criteres de comparaison

Les options sont jugees sur :

1. fidelite a la direction 2,5D validee ;
2. qualite percue sur desktop et mobile ;
3. performance et fallback ;
4. accessibilite, SEO et acces direct aux oeuvres ;
5. capacite a ajouter des projets sans refonte ;
6. controle des medias, du code et des versions ;
7. maintenance realiste pour Nicolas et les agents ;
8. reversibilite si la premiere implementation n'est pas satisfaisante.

## Option A — Webflow + code custom / GSAP / eventuel Rive

### Ce que l'option fait bien

- Excellent environnement de direction visuelle et d'edition pour iterer rapidement sur les pages.
- CMS adapte aux collections de projets, avec un modele qui permet d'ajouter des items sans recreer chaque page.
- Hebergement gere, SSL et publication integree ; moins de charge d'infrastructure.
- Bon choix si le site doit etre modifie regulierement par une personne non technique.
- Coherence naturelle avec le benchmark Lando Norris, dont l'usage de Webflow est documente publiquement.

### Ce qui nous expose

- La sequence 2,5D et ses fallbacks demanderont tout de meme du code custom et une QA navigateur/mobile precise.
- La frontiere entre le Designer, les scripts externes et le runtime immersif peut rendre les etats difficiles a maintenir.
- Dependances a l'editeur, au CMS, aux plans et au mode d'hebergement ; export et migration moins confortables qu'un projet versionne de bout en bout.
- Le CMS est pratique pour les ajouts de contenu, mais les etudes de cas deviennent vite liees au modele et aux contraintes de la plateforme.
- Le risque n'est pas de ne pas pouvoir produire l'effet ; c'est de perdre du controle au moment de la finition, de la performance et des fallbacks.

### Verdict pour ce projet

Bonne option si la priorite absolue devient l'edition visuelle autonome. Option acceptable, mais pas mon premier choix pour un portfolio dont l'animation centrale doit rester une piece technique sur mesure et reversible.

## Option B — Astro + contenu versionne + ilot immersif isole

### Ce que l'option fait bien

- Le site principal peut etre rendu en HTML statique rapide, avec JavaScript charge uniquement dans les zones interactives. C'est exactement le profil de notre projet : contenu editorial robuste autour d'un hero immersif limite. Astro documente cette architecture d'îlots et son interet pour reduire le JavaScript global. [Documentation Astro sur les îlots](https://docs.astro.build/en/concepts/islands/)
- Les Content Collections permettent de structurer les projets, de valider les champs et de beneficier du typage ; elles peuvent rester locales ou evoluer vers une source distante. [Documentation Astro sur les Content Collections](https://docs.astro.build/en/guides/content-collections/)
- Controle complet des medias, du HTML, du SEO, des fallbacks, des routes et des versions Git.
- Ajout d'un projet plus tard sans toucher au moteur de transition si le schema de contenu est bien defini.
- La partie immersive peut rester un composant isole : CSS/WAAPI en base, GSAP uniquement si les timelines ou le controle du mouvement le justifient.
- Deploiement statique possible sur plusieurs fournisseurs, dont Vercel, Netlify ou Cloudflare ; Astro documente les modes statique et on-demand. [Documentation Astro sur le deploiement](https://docs.astro.build/en/guides/deploy/)

### Ce qui nous expose

- Plus de responsabilite d'implementation : pas d'editeur visuel complet pour remplacer la revue du code et des medias.
- La qualite depend de la discipline de l'architecture, du traitement des images, des tests et de la QA ; Astro ne fabrique pas automatiquement un site premium.
- Le CMS visuel n'est pas necessaire au debut, mais il faudra en ajouter un plus tard si Nicolas veut editer sans passer par le projet.
- Une mauvaise implementation pourrait tout de meme envoyer trop de JavaScript ; l'architecture par îlots doit etre respectee, pas seulement declaree.

### Verdict pour ce projet

Meilleur equilibre entre niveau premium, controle, performance, accessibilite, ajout futur des oeuvres et reversibilite. C'est la proposition que je recommande.

## Option C — React/Next.js + Three.js / React Three Fiber

### Ce que l'option fait bien

- Ecosysteme large pour construire une application interactive riche.
- Grande liberte pour un monde interieur complexe, des scenes persistantes, des interactions nombreuses et une logique d'etat avancee.
- Peut porter un produit 3D complet si le portfolio devient une experience navigable en profondeur.

### Ce qui nous expose

- Plus de runtime, d'etat et de decisions d'architecture que necessaire pour une transition 2,5D de quelques secondes.
- Risque plus eleve de faire du moteur le sujet principal, au detriment des œuvres et de la lisibilite.
- Performance mobile, accessibilite, reduced-motion, chargement et fallback deviennent des problemes de premier ordre.
- Une scene Three.js peut etre tres belle en desktop et mediocre sur mobile si le budget et les modes de qualite ne sont pas concus des le debut.
- Maintenance plus exigeante et transfert moins simple si le projet est repris par une autre personne.

### Verdict pour ce projet

A garder comme option de secours si la vision evolue vers un monde 3D interactif complet. Pour la direction actuellement validee, ce serait une sur-architecture et un risque disproportionne.

## Option D — Webflow CMS + frontend Astro ou application custom

### Ce que l'option fait bien

- Combine edition CMS visuelle et liberte d'un frontend code.
- Peut separer le contenu des projets et l'experience immersive.

### Ce qui nous expose

- Deux chaines de publication, deux sources de bugs et une dependance API/CMS supplementaire.
- Synchronisation, preview, droits, images et cache a tester avant de gagner quoi que ce soit.
- Complexite inutile tant que la frequence d'edition et le besoin d'un CMS non technique ne sont pas prouves.

### Verdict pour ce projet

Bonne architecture de phase 2 si le portfolio doit etre edite souvent par plusieurs personnes. Pas la meilleure base de depart pour proteger la qualite et la simplicite.

## Comparatif synthetique

| Option                 | Premium sur mesure                           | Mobile / performance                            | Ajout futur des oeuvres        | Controle / reversibilite | Risque projet        | Verdict    |
| ---------------------- | -------------------------------------------- | ----------------------------------------------- | ------------------------------ | ------------------------ | -------------------- | ---------- |
| Webflow + custom       | Fort, mais depend du code autour du Designer | Bon si discipline, moins predictible sur custom | Tres bon via CMS               | Moyen                    | Moyen                | Possible   |
| Astro + ilot immersif  | Tres fort                                    | Meilleur potentiel                              | Tres bon via schema de contenu | Fort                     | Moyen, controlable   | Recommande |
| Next/React + Three     | Tres fort                                    | Plus difficile a garantir                       | Bon, mais plus lourd           | Fort                     | Eleve                | Reserve    |
| Webflow CMS + frontend | Tres fort                                    | Variable selon integration                      | Excellent                      | Moyen                    | Eleve par complexite | Phase 2    |

## Recommandation pour le niveau gold vise

Je recommande :

**Astro en sortie principalement statique + Content Collections ou contenu versionne + un seul ilot immersif 2,5D pour l'entree + CSS/WAAPI en base + GSAP seulement si les essais prouvent qu'il apporte une precision utile.**

Rive n'est pas necessaire pour la sequence actuelle. Son runtime web est base sur WebAssembly et peut demander une gestion de chargement, de CSP et d'hebergement du fichier WASM ; ce serait une dependance de plus sans benefice clair pour notre portail photo/parallaxe. [Documentation Rive sur le runtime web](https://rive.app/docs/runtimes/web/faq)

Three.js/WebGL ne doit pas etre introduit dans la V1 par reflexe. Il ne deviendrait justifie que si les essais montrent que la composition 2,5D ne peut pas atteindre le niveau valide avec des couches image et des transformations controlees.

GSAP est compatible avec un usage commercial selon sa licence standard actuelle, et son coeur fournit timelines, easing, keyframes et outils de controle responsive ; il reste donc une option raisonnable pour la precision du mouvement, sans imposer toute une application 3D. [Licence standard GSAP](https://gsap.com/community/standard-license/) et [documentation GSAP](https://gsap.com/docs/v3/)

L'hébergement applicatif prévu est un déploiement statique Git sur Vercel ; le domaine canonique souhaité est `https://www.wadek.fr`, commandé chez OVH et encore en cours d'activation. Aucun rattachement DNS ou Vercel n'est exécuté ici. [Déploiement Astro sur Vercel](https://docs.astro.build/en/guides/deploy/vercel/)

## Recommandation de lancement par phases

### Phase 1 — carte de visite publiable

- portrait et narration « Inside My Mind » ;
- trois a cinq projets totalement finis, choisis pour leur complementarite ;
- pages projet accessibles directement ;
- profil, CV, contact et liens professionnels ;
- aucun emplacement vide ni promesse de contenu non disponible ;
- fallback statique et reduced-motion finis.

### Phase 2 — extension curatoriale

- ajout des projets `LATER` dans le meme schema ;
- enrichissement des medias et des etudes de cas ;
- eventuel CMS si l'edition frequente le justifie ;
- aucune refonte de la transition d'accueil necessaire.

## Decision proposee a valider

1. Autoriser une V1 publique avec une selection curate d'oeuvres, a condition que chaque oeuvre publiee soit complete et que le site ne donne pas l'impression d'etre incomplet.
2. Retenir Astro + contenu structure + ilot 2,5D isole comme architecture cible de comparaison technique.
3. Garder Webflow comme alternative si l'edition visuelle non technique devient prioritaire.
4. Ecarter pour la V1 l'application Three.js/WebGL totale et Rive, sauf preuve de besoin lors d'un essai technique autorise.

Cette page reste une recommandation. Elle devient une decision seulement apres validation explicite de Nicolas et verification de la faisabilite sur les medias reels et la liste des oeuvres.
