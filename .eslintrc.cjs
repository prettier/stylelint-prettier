'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:n/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['test/*.test.js'],
      rules: {
        // Adjust tighten version to allow using `test` apis
        'n/no-unsupported-features/node-builtins': [
          'error',
          {version: '^20.13'},
        ],
      },
    },
  ],
};
