// Budgets de performance et de poids — source de vérité pour Lighthouse CI.
// Seuils officiels CWV 2026 : LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 (p75).
module.exports = {
  performance: {
    budgets: [
      {
        resourceType: 'script',
        budget: 50, // Ko gzip — JS total initial (objectif ≈ 6 Ko gzip)
      },
      {
        resourceType: 'document',
        budget: 80, // Ko gzip — HTML
      },
      {
        resourceType: 'font',
        budget: 200, // Ko — toutes fontes (2 familles variable/statique, subset FR)
      },
      {
        resourceType: 'image',
        budget: 1500, // Ko gzip — total images d'une page
      },
      {
        resourceType: 'total',
        budget: 2200, // Ko gzip — budget global par page
      },
    ],
  },
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost:4173/'],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        interactive: ['error', { maxNumericValue: 3500 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
