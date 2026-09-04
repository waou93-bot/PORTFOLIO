import { describe, it, expect } from 'vitest';
import { mediaExists } from '../../src/lib/media';

describe('mediaExists', () => {
  it('retourne true pour un asset public existant', () => {
    expect(mediaExists('/media/projects/down-trigger/cover.svg')).toBe(true);
  });

  it('retourne false pour un asset inexistant', () => {
    expect(mediaExists('/media/projects/never-existed/cover.svg')).toBe(false);
  });

  it('retourne false pour un chemin sans slash initial', () => {
    expect(mediaExists('media/cover.svg')).toBe(false);
  });
});
