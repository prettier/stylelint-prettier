module.exports = {
  plugins: ['../..'],
  rules: {
    'prettier/prettier': [
      true,
      {
        singleQuote: true,
        trailingComma: 'all',
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
      files: ['**/*.{html,svelte,vue}'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['**/*.md'],
      customSyntax: 'postcss-markdown',
    },
  ]
};
