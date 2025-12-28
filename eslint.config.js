import {defineConfig} from 'eslint/config';
import js from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    plugins: {js, n: eslintPluginN},
    extends: ['js/recommended', 'n/flat/recommended-module'],
  },
  eslintPluginPrettierRecommended,
  {
    files: ['test/*.test.js'],
    rules: {
      // Bump version to allow using `test` apis that were still marked as
      // experimental in node 18
      'n/no-unsupported-features/node-builtins': ['error', {version: '^20.13'}],
    },
  },
  {
    ignores: [
      // Ignore everything in the fixtures dir except the stylelint config
      'test/fixtures',
      '!test/fixtures/stylelint.config.js',
    ],
  },
]);
