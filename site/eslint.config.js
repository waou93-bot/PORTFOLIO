// ESLint 10 flat config — Astro + TypeScript
import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      '.vercel/**',
    ],
  },
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Désactivée : faux positifs pour les classes togglées dynamiquement via JS
      // (data-state, classes actives injectées par les scripts client).
      'astro/no-unused-css-selector': 'off',
      'astro/no-deprecated-astro-fetchcontent': 'error',
      'jsx-a11y/no-static-element-interactions': 'off',
      // `for` sur <label> est valide en HTML ; la règle ne le reconnaît pas sur les .astro
      'jsx-a11y/label-has-associated-control': 'off',
    },
  },
];
