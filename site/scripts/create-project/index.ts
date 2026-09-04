/**
 * Scaffold d'un nouveau projet (fichier markdown + dossier média + couverture).
 * Usage :
 *   pnpm project:new --slug mon-projet --title "Titre du projet"
 * Sans arguments : invite interactive.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

const PROJECTS_DIR = resolve('src/content/projects');
const MEDIA_DIR = resolve('public/media/projects');

function parseArgs(argv: string[]) {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a) continue;
    if (a.startsWith('--')) out[a.slice(2)] = argv[i + 1] ?? '';
  }
  return out;
}

function ask(rl: ReturnType<typeof createInterface>, q: string): Promise<string> {
  return new Promise((r) => rl.question(q, r));
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function template(slug: string, title: string, year: string): string {
  return [
    '---',
    `slug: ${slug}`,
    `title: ${title}`,
    'kind: concept',
    'brandUsage: fictional',
    'publicationStatus: draft',
    'rightsStatus: not-required',
    `year: '${year}'`,
    'sector: TODO_CONTENT',
    'summary: "TODO_CONTENT \u2014 r\u00e9sum\u00e9 d\u2019une phrase."',
    'role:',
    '  - TODO_CONTENT',
    'services:',
    '  - TODO_CONTENT',
    'featured: false',
    'cover:',
    `  src: /media/projects/${slug}/cover.svg`,
    '  alt: TODO_CONTENT \u2014 description accessible de la couverture.',
    'theme:',
    '  name: TODO_CONTENT',
    '  accent: oklch(0.55 0.18 30)',
    '  accentContrast: oklch(0.98 0.01 85)',
    '  dark: false',
    'independentConceptDisclaimer: \u00c9tude ind\u00e9pendante \u2014 non command\u00e9e, non affili\u00e9e, non approuv\u00e9e par la marque \u00e9voqu\u00e9e.',
    'results: []',
    'gallery: []',
    'mobileGallery: []',
    '---',
    '',
    '## Contexte',
    '',
    'TODO_CONTENT',
    '',
    '## Probl\u00e8me / opportunit\u00e9',
    '',
    'TODO_CONTENT',
    '',
    '## Intention',
    '',
    'TODO_CONTENT',
    '',
    '## Direction artistique',
    '',
    'TODO_CONTENT',
    '',
    '## Architecture UX',
    '',
    'TODO_CONTENT',
    '',
    '## Interactions et motion',
    '',
    'TODO_CONTENT',
    '',
    '## Desktop / Mobile',
    '',
    'TODO_CONTENT',
    '',
    '## D\u00e9cisions techniques',
    '',
    'TODO_CONTENT',
    '',
    '## R\u00e9sultat',
    '',
    'TODO_CONTENT \u2014 aucune m\u00e9trique publi\u00e9e sans source v\u00e9rifi\u00e9e.',
    '',
    '## Cr\u00e9dits',
    '',
    'TODO_CONTENT \u2014 cr\u00e9dits \u00e0 compl\u00e9ter (photos, vid\u00e9os, tiers).',
    '',
    '## Statut des droits',
    '',
    '**\u00c9tude ind\u00e9pendante** \u2014 pas d\u2019autorisation requise. Contenu \u00e0 documenter et v\u00e9rifier avant publication.',
    '',
  ].join('\n');
}

function coverSvg(title: string, slug: string): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">',
    '<rect width="1600" height="1000" fill="#f4efe4"/>',
    `<text x="80" y="900" font-family="Georgia, serif" font-size="72" fill="#1d1a14">${title}</text>`,
    `<text x="80" y="160" font-family="monospace" font-size="28" fill="#c14b32" letter-spacing="4">PROJET \u2014 ${slug.toUpperCase()}</text>`,
    '</svg>',
    '',
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  let slug = args.slug ?? '';
  if (!slug) slug = (await ask(rl, 'Slug (kebab-case) : ')).trim();
  if (!SLUG_RE.test(slug)) {
    console.error(`Slug invalide (attendu : kebab-case) : "${slug}"`);
    process.exitCode = 1;
    rl.close();
    return;
  }

  let title = args.title ?? '';
  if (!title) title = (await ask(rl, 'Titre : ')).trim();
  if (!title) {
    title = slug.replace(/-/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const year = args.year ?? String(new Date().getFullYear());
  rl.close();

  const file = resolve(PROJECTS_DIR, `${slug}.md`);
  if (existsSync(file)) {
    console.error(`Le projet existe déjà : ${file}`);
    process.exitCode = 1;
    return;
  }

  const mediaDir = resolve(MEDIA_DIR, slug);
  mkdirSync(mediaDir, { recursive: true });

  writeFileSync(file, template(slug, title, year), 'utf8');
  writeFileSync(resolve(mediaDir, 'cover.svg'), coverSvg(title, slug), 'utf8');

  console.log(`Projet créé : ${file}`);
  console.log(`Couverture : ${mediaDir}/cover.svg`);
  console.log(
    'Renseignez le contenu (TODO_CONTENT), puis passez le projet en `published` seulement quand les droits sont confirmés.',
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
