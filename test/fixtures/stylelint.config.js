export default {
  plugins: ['../..'],
  rules: {
    'prettier/prettier': [
      true,
      {
        singleQuote: true,
        trailingComma: 'all',
        plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro'],
      }
    ],
  },
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.{js,jsx,tsx}'],
      customSyntax: 'postcss-styled-syntax',
    },
    {
      files: ['**/*.{html,svelte,vue,astro}'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.md'],
      customSyntax: 'postcss-markdown',
    },
  ]
};
