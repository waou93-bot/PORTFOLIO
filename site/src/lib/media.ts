import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Vérifie l'existence d'un asset dans le dossier public/.
 * src doit commencer par "/" (chemin public).
 */
export function mediaExists(src: string): boolean {
  if (!src.startsWith('/')) return false;
  const filePath = join(process.cwd(), 'public', src.slice(1));
  return existsSync(filePath);
}
