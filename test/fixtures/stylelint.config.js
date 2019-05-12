module.exports = {
  plugins: [`../..`],
  extends: ['stylelint-config-prettier'],
  rules: {
    'prettier/prettier': [true, {singleQuote: true, trailingComma: 'all'}],
  },
};
