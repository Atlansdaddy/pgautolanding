// Flat ESLint config (ESLint 9), shared across the monorepo (Command 9).
// eslint-config-prettier disables stylistic rules that Prettier owns.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/.astro/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Node scripts (build tools, configs) get Node globals.
    files: ['**/*.{mjs,cjs,js}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
);
