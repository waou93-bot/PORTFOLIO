/**
 * Validation du contenu des projets avant publication.
 * Règles (source de vérité : docs/00-content-gaps.md, ADR-003) :
 *  - Un projet `published` exige des droits confirmés (confirmed ou not-required).
 *  - Toute asset média référencée doit exister dans public/.
 *  - `alt` est obligatoire sur chaque asset (accessibilité).
 *  - Une métrique publiée (`results`) exige une source.
 *  - Les slugs sont uniques et en kebab-case.
 * La conformité structurelle au schéma Zod est déjà garantie par le build Astro.
 * Usage : pnpm validate
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';

const PROJECTS_DIR = resolve('src/content/projects');
const PUBLIC_DIR = resolve('public');

interface Problem {
  file: string;
  level: 'error' | 'warning';
  message: string;
}

const problems: Problem[] = [];

function fail(file: string, message: string) {
  problems.push({ file, level: 'error', message });
}

function warn(file: string, message: string) {
  problems.push({ file, level: 'warning', message });
}

function fileExistsFromPublic(src: string): boolean {
  if (!src.startsWith('/')) return false;
  return existsSync(join(PUBLIC_DIR, src.slice(1)));
}

type Asset = { src?: unknown; alt?: unknown };

function checkAssets(file: string, value: Asset | Asset[] | undefined, label: string) {
  if (value === undefined) return;
  const assets = Array.isArray(value) ? value : [value];

  for (const asset of assets) {
    const { src, alt } = asset;
    if (typeof src !== 'string' || !src) {
      fail(file, `${label} : src manquant.`);
      continue;
    }
    if (!fileExistsFromPublic(src)) {
      fail(file, `${label} : asset introuvable dans public/ — ${src}`);
    }
    if (typeof alt !== 'string' || alt.length === 0) {
      fail(file, `${label} : alt manquant (accessibilité) — ${src}`);
    }
  }
}

const KIND_NEEDS_DISCLAIMER = ['concept', 'redesign', 'experimental'];

function validateFile(fileName: string) {
  const raw = readFileSync(join(PROJECTS_DIR, fileName), 'utf8');
  const { data } = matter(raw);
  const file = `src/content/projects/${fileName}`;
  const d = data as Record<string, any>;

  const slug = d.slug;
  if (typeof slug !== 'string' || !slug) {
    fail(file, 'slug manquant.');
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      fail(file, `slug invalide (kebab-case) : ${slug}`);
    if (!fileName.endsWith(`${slug}.md`))
      warn(file, `le nom de fichier ne correspond pas au slug (${slug}).`);
  }

  if (d.publicationStatus === 'published') {
    if (d.rightsStatus === 'pending' || d.rightsStatus === 'restricted') {
      fail(
        file,
        `publié mais droits ${d.rightsStatus} — un projet publié exige des droits confirmés.`,
      );
    }
    if (!d.capturedAt) {
      warn(file, 'publié sans date de capture/documentation (capturedAt).');
    }
    if (KIND_NEEDS_DISCLAIMER.includes(d.kind) && !d.independentConceptDisclaimer) {
      warn(file, `${d.kind} publié sans disclaimer « étude indépendante ».`);
    }
  }

  checkAssets(file, d.cover, 'cover');
  if (d.previewVideo) checkAssets(file, d.previewVideo, 'previewVideo');
  checkAssets(file, d.gallery, 'gallery');
  checkAssets(file, d.mobileGallery, 'mobileGallery');

  for (const r of (d.results ?? []) as { source?: string }[]) {
    if (typeof r === 'object' && r && !r.source) fail(file, 'métrique publiée sans source.');
  }
}

async function main() {
  const files = readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('Aucun fichier projet trouvé.');
    return;
  }
  for (const f of files) validateFile(f);

  const slugs = files
    .map((f) => {
      const raw = readFileSync(join(PROJECTS_DIR, f), 'utf8');
      return matter(raw).data.slug as unknown;
    })
    .filter((s): s is string => typeof s === 'string');
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  for (const d of [...new Set(dupes)]) {
    fail('src/content/projects', `slug dupliqué : ${d}`);
  }

  const errors = problems.filter((p) => p.level === 'error');
  const warnings = problems.filter((p) => p.level === 'warning');

  for (const p of problems) {
    console.log(`[${p.level.toUpperCase()}] ${p.file}: ${p.message}`);
  }
  console.log(`\n${errors.length} erreur(s), ${warnings.length} avertissement(s).`);

  if (errors.length > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
