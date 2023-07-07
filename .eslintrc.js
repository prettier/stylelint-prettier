'use strict';

module.exports = {
  plugins: ['node'],
  extends: ['plugin:node/recommended', 'plugin:prettier/recommended'],
  env: {node: true, jest: true},
  parserOptions: {ecmaVersion: '2020'},
  root: true,
  rules: {
    'node/no-unpublished-require': ['error', {allowModules: ['stylelint']}],
    'node/no-missing-require': ['error', {allowModules: ['styled-components']}],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {ignores: ['dynamicImport']},
    ],
  },
};
