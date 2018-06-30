const path = require('path');
const rule = require('..');

// Reading from default .prettierrc
testRule(rule, {
  ruleName: rule.ruleName,
  config: true,
  codeFilename: filename('default'),

  accept: [
    {
      description: 'Prettier Valid - Default .prettierrc',
      code: '.x {\n    color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert - Default .prettierrc',
      code: '.x {\ncolor: red;\n}\n',
      message: 'Insert "····" (prettier/prettier)',
      line: 2,
      column: 1,
    },
    {
      description: 'Prettier Replace - Default .prettierrc',
      code: '.x { color:red; }\n',
      message:
        'Replace "·color:red;·" with "⏎····color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
    },
    {
      description: 'Prettier Delete - Default .prettierrc',
      code: '.x {\n    color: red;;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 16,
    },
  ],
});

// Reading options from config instead of .prettierrc
testRule(rule, {
  ruleName: rule.ruleName,
  config: [true, {tabWidth: 8}],
  codeFilename: filename('default'),

  accept: [
    {
      description: 'Prettier Valid - Inline Options Override',
      code: '.x {\n        color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert  - Inline Options Override',
      code: '.x {\ncolor: red;\n}\n',
      message: 'Insert "········" (prettier/prettier)',
      line: 2,
      column: 1,
    },
    {
      description: 'Prettier Replace - Inline Options Override',
      code: '.x { color:red; }\n',
      message:
        'Replace "·color:red;·" with "⏎········color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
    },
    {
      description: 'Prettier Delete - Inline Options Override',
      code: '.x {\n        color: red;;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 20,
    },
  ],
});

/**
 * Builds a dummy file path to trick prettier into resolving a specific .prettierrc file.
 * @param {string} name - Prettierrc fixture basename.
 * @returns {string} A filename relative to the .prettierrc config.
 */
function filename(name) {
  return path.resolve(__dirname, `./prettierrc/${name}/dummy.scss`);
}
