'use strict';

module.exports = {
  plugins: ['node'],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  env: {node: true},
  root: true,
  rules: {
    'node/no-unpublished-require': ['error', {allowModules: ['stylelint']}],
    'node/no-missing-require': ['error', {allowModules: ['styled-components']}],
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
