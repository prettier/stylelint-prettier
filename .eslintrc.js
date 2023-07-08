'use strict';

module.exports = {
  plugins: ['n'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:prettier/recommended',
  ],
  env: {node: true},
  parserOptions: {ecmaVersion: '2020'},
  root: true,
  rules: {
    'n/no-unpublished-require': ['error', {allowModules: ['stylelint']}],
    'n/no-missing-require': ['error', {allowModules: ['styled-components']}],
    'n/no-unsupported-features/es-syntax': [
      'error',
      {ignores: ['dynamicImport']},
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {jest: true},
      globals: {testRule: true},
    },
  ],
};
