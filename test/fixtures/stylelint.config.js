module.exports = {
  plugins: [`../..`],
  extends: ['stylelint-config-prettier'],
  rules: {
    'prettier/prettier': [true, {singleQuote: true, trailingComma: 'all'}],
  },
  "overrides": [
    {
      "files": ["**/*.scss"],
      "customSyntax": "postcss-scss",
    },
    {
      "files": ["**/*.{js,jsx,tsx}"],
      "customSyntax": "@stylelint/postcss-css-in-js",
    },
    {
      "files": ["**/*.{html,svelte,vue}"],
      "customSyntax": "postcss-html",
    },
    {
      "files": ["**/*.md"],
      "customSyntax": "postcss-markdown",
    },
  ]
};
