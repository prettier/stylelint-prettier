'use strict';

module.exports = {
  plugins: ['n'],
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:prettier/recommended',
  ],
  env: {node: true},
  root: true,
  rules: {
    'n/no-unpublished-require': ['error', {allowModules: ['stylelint']}],
    'n/no-missing-require': ['error', {allowModules: ['styled-components']}],
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
      globals: {
        testRule: true,
      },
    },
  ],
};
