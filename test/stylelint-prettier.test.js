import {describe, it, beforeEach, afterEach, mock} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import stylelint from 'stylelint';
import {testRule} from 'stylelint-test-rule-node';
import plugin from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plugins = [plugin];
const {ruleName} = plugin;

// Reading from default .prettierrc
testRule({
  plugins,
  ruleName,
  config: true,
  codeFilename: filename('default'),
  fix: true,

  accept: [
    {
      description: 'Prettier Valid - Default .prettierrc',
      code: '.x {\n  color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert - Default .prettierrc',
      code: '.x {\ncolor: red;\n}\n',
      fixed: '.x {\n  color: red;\n}\n',
      message: 'Insert "··" (prettier/prettier)',
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 2,
    },
    {
      description: 'Prettier Replace - Default .prettierrc',
      code: '.x { color:red; }\n',
      fixed: '.x {\n  color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎··color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 17,
    },
    {
      description: 'Prettier Delete - Default .prettierrc',
      code: '.x {\n  color: red;;\n}\n',
      fixed: '.x {\n  color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 14,
      endLine: 2,
      endColumn: 15,
    },
  ],
});

// Reading from custom .prettierrc
testRule({
  plugins,
  ruleName,
  config: true,
  codeFilename: filename('custom'),
  fix: true,

  accept: [
    {
      description: 'Prettier Valid - Custom .prettierrc',
      code: '.x {\n    color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert - Custom .prettierrc',
      code: '.x {\ncolor: red;\n}\n',
      fixed: '.x {\n    color: red;\n}\n',
      message: 'Insert "····" (prettier/prettier)',
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 2,
    },
    {
      description: 'Prettier Replace - Custom .prettierrc',
      code: '.x { color:red; }\n',
      fixed: '.x {\n    color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎····color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 17,
    },
    {
      description: 'Prettier Delete - Custom .prettierrc',
      code: '.x {\n    color: red;;\n}\n',
      fixed: '.x {\n    color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 16,
      endline: 2,
      endColumn: 17,
    },
  ],
});

// Merging options from config into .prettierrc
testRule({
  plugins,
  ruleName,
  config: [true, {tabWidth: 8}],
  codeFilename: filename('default'),
  fix: true,

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
      fixed: '.x {\n        color: red;\n}\n',
      message: 'Insert "········" (prettier/prettier)',
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 2,
    },
    {
      description: 'Prettier Replace - Inline Options Override',
      code: '.x { color:red; }\n',
      fixed: '.x {\n        color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎········color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 17,
    },
    {
      description: 'Prettier Delete - Inline Options Override',
      code: '.x {\n        color: red;;\n}\n',
      fixed: '.x {\n        color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 21,
    },
  ],
});

// Use the css parser if no filename was specified
testRule({
  plugins,
  ruleName,
  config: true,
  fix: true,

  accept: [
    {
      description: 'Prettier Valid',
      code: '.x {\n  color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert',
      code: '.x {\ncolor: red;\n}\n',
      fixed: '.x {\n  color: red;\n}\n',
      message: 'Insert "··" (prettier/prettier)',
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 2,
    },
  ],
});

// Use the parser specified in overrides in .prettierrc
testRule({
  plugins,
  ruleName,
  config: true,
  customSyntax: 'postcss',
  codeFilename: filename('default', 'dummy.wxss'),
  accept: [
    {
      description: 'Prettier Valid - Default .prettierrc',
      code: '.x {\n  color: red;\n}\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Insert - Default .prettierrc',
      code: '.x {\ncolor: red;\n}\n',
      fixed: '.x {\n  color: red;\n}\n',
      message: 'Insert "··" (prettier/prettier)',
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 2,
    },
  ],
});

// Ignoring files in .prettierignore
testRule({
  plugins,
  ruleName,
  config: true,
  codeFilename: filename('default', 'ignore-me.css'),
  accept: [
    {
      description: 'Prettier Valid - Ignored file',
      code: '.x {color: red;}',
    },
  ],
});

// Testing Comments
testRule({
  plugins,
  ruleName,
  config: [true, {endOfLine: 'auto'}],
  codeFilename: filename('default'),
  fix: true,

  accept: [
    {
      description: 'Prettier Valid Raws - trailing newline',
      code: '/* start */\n.x {\n  color: red; /* middle */\n}\n',
    },
    {
      description: 'Prettier Valid Raws - windows trailing newline',
      code: '/* start */\r\n.x {\r\n  color: red; /* middle */\r\n}\r\n',
    },
    {
      description: 'Prettier Valid Raws - comment and newline',
      code: '/* start */\n.x {\n  color: red; /* middle */\n}\n/* end */\n',
    },
  ],
  reject: [
    {
      description: 'Prettier Invalid Raws - no trailing newline',
      code: '/* start */\n.x {\n  color: red; /* middle */\n}',
      fixed: '/* start */\n.x {\n  color: red; /* middle */\n}\n',
      message: 'Insert "⏎" (prettier/prettier)',
      line: 4,
      column: 2,
      endLine: 4,
      endColumn: 3,
    },
    // This should pass but the output goes a bit weird
    // {
    //   description: 'Prettier Invalid Raws - no trailing windows newline',
    //   code: '/* start */\r\n.x {\r\n  color: red; /* middle */\r\n}',
    //   fixed: '/* start */\r\n.x {\r\n  color: red; /* middle */\r\n}\r\n',
    //   message: 'Insert "␍⏎" (prettier/prettier)',
    //   line: 4,
    //   column: 2,
    //   endLine: 4,
    //   endColumn: 3
    // },
    {
      description: 'Prettier Invalid Raws - comment and no newline',
      code: '/* start */\n.x {\n  color: red; /* middle */\n}\n/* end */',
      fixed: '/* start */\n.x {\n  color: red; /* middle */\n}\n/* end */\n',
      message: 'Insert "⏎" (prettier/prettier)',
      line: 5,
      column: 10,
      endLine: 5,
      endColumn: 11,
    },
  ],
});

// Css Stress Test
const stressTestCssInput = `.foo {
  display: block;;;;;;;;
}

.first:after,.first:after{color: red;content: "beep";}

.second:after#second {
color: red;
content: "beep";
}

.final:after,.final:after{color: blue;content: "shift";}


.baz {
display: block;
}.ham{display:inline}

.quz {
    display: block;;;;;;;;
}


.final:after,.final:after{color: blue;content: "shift";}
`;

const stressTestCssExpected = `.foo {
  display: block;
}

.first:after,
.first:after {
  color: red;
  content: 'beep';
}

.second:after#second {
  color: red;
  content: 'beep';
}

.final:after,
.final:after {
  color: blue;
  content: 'shift';
}

.baz {
  display: block;
}
.ham {
  display: inline;
}

.quz {
  display: block;
}

.final:after,
.final:after {
  color: blue;
  content: 'shift';
}
`;

testRule({
  plugins,
  ruleName,
  config: true,
  codeFilename: filename('default'),
  fix: true,

  accept: [
    {
      description: 'Prettier Insert/Replace/Delete - Stress Test',
      code: stressTestCssExpected,
    },
  ],
  reject: [
    {
      description: 'Prettier Insert/Replace/Delete - Stress Test',
      code: stressTestCssInput,
      fixed: stressTestCssExpected,
      warnings: [
        {
          message: `Delete ";;;;;;;" (prettier/prettier)`,
          line: 2,
          column: 18,
          endLine: 2,
          endColumn: 25,
        },
        {
          message:
            'Replace ".first:after{color:·red;content:·"beep";" with "⏎.first:after·{⏎··color:·red;⏎··content:·\'beep\';⏎" (prettier/prettier)',
          line: 5,
          column: 14,
          endLine: 5,
          endColumn: 54,
        },
        {
          message: 'Insert "··" (prettier/prettier)',
          line: 8,
          column: 1,
          endLine: 8,
          endColumn: 2,
        },
        {
          message:
            'Replace "content:·"beep"" with "··content:·\'beep\'" (prettier/prettier)',
          line: 9,
          column: 1,
          endLine: 9,
          endColumn: 16,
        },
        {
          message:
            'Replace ".final:after{color:·blue;content:·"shift";}" with "⏎.final:after·{⏎··color:·blue;⏎··content:·\'shift\';" (prettier/prettier)',
          line: 12,
          column: 14,
          endLine: 12,
          endColumn: 57,
        },
        {
          message: 'Insert "}" (prettier/prettier)',
          line: 13,
          column: 1,
          endLine: 13,
          endColumn: 2,
        },
        {
          message: 'Insert "··" (prettier/prettier)',
          line: 16,
          column: 1,
          endLine: 16,
          endColumn: 2,
        },
        {
          message:
            'Replace ".ham{display:inline" with "⏎.ham·{⏎··display:·inline;⏎" (prettier/prettier)',
          line: 17,
          column: 2,
          endLine: 17,
          endColumn: 21,
        },
        {
          message:
            'Replace "····display:·block;;;;;;;;" with "··display:·block;" (prettier/prettier)',
          line: 20,
          column: 1,
          endLine: 20,
          endColumn: 27,
        },
        {
          message: 'Delete "⏎" (prettier/prettier)',
          line: 21,
          column: 2,
          endLine: 22,
          endColumn: 1,
        },
        {
          message:
            'Replace ".final:after{color:·blue;content:·"shift";" with "⏎.final:after·{⏎··color:·blue;⏎··content:·\'shift\';⏎" (prettier/prettier)',
          line: 24,
          column: 14,
          endLine: 24,
          endColumn: 56,
        },
      ],
    },
  ],
});

// Scss Stress test
const stressTestScssInput = `$size: rem(10px);;;
$base-position: rem(-4px);

.Indicator {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: color('teal');
    right: $base-position;
    top: $base-position;
    width: $size;
    height: $size;
    border-radius: 100%;
  }
}

.pulseIndicator::before {
  z-index: 1;
  animation: bounce 5s ease infinite;
}

.pulseIndicator::after {
  right: $base-position;
  top: $base-position;
  animation: pulse 5s ease infinite;
}

$pip-animation: (
  start-scaling-small: 65%,
  finish-scaling-small: 75%,
  finish-scaling-big: 82.5%,
  finish-scaling: 85%
);

@keyframes bounce {
  from,
  #{map-get($pip-animation, start-scaling-small)},
  #{map-get($pip-animation, finish-scaling)} {
    transform: scale(1);
  }

  #{map-get($pip-animation, finish-scaling-small)} {transform: scale(0.85)}

  #{map-get($pip-animation, finish-scaling-big)} {
    transform: scale(1.05);
  }
}

@keyframes pulse {
  from,
  #{map-get($pip-animation, finish-scaling-small)} {
    transform: scale(0.85);
    opacity: 1;
  }

  to {
    transform: scale(2.5);
    opacity: 0;
  }
}
`;

const stressTestScssExpected = `$size: rem(10px);
$base-position: rem(-4px);

.Indicator {
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: color('teal');
    right: $base-position;
    top: $base-position;
    width: $size;
    height: $size;
    border-radius: 100%;
  }
}

.pulseIndicator::before {
  z-index: 1;
  animation: bounce 5s ease infinite;
}

.pulseIndicator::after {
  right: $base-position;
  top: $base-position;
  animation: pulse 5s ease infinite;
}

$pip-animation: (
  start-scaling-small: 65%,
  finish-scaling-small: 75%,
  finish-scaling-big: 82.5%,
  finish-scaling: 85%,
);

@keyframes bounce {
  from,
  #{map-get($pip-animation, start-scaling-small)},
  #{map-get($pip-animation, finish-scaling)} {
    transform: scale(1);
  }

  #{map-get($pip-animation, finish-scaling-small)} {
    transform: scale(0.85);
  }

  #{map-get($pip-animation, finish-scaling-big)} {
    transform: scale(1.05);
  }
}

@keyframes pulse {
  from,
  #{map-get($pip-animation, finish-scaling-small)} {
    transform: scale(0.85);
    opacity: 1;
  }

  to {
    transform: scale(2.5);
    opacity: 0;
  }
}
`;

testRule({
  plugins,
  ruleName,
  config: true,
  codeFilename: filename('default', 'dummy.scss'),
  customSyntax: 'postcss-scss',
  fix: true,

  accept: [
    {
      description: 'Prettier Insert/Replace/Delete - Scss Stress Test',
      code: stressTestScssExpected,
    },
  ],
  reject: [
    {
      description: 'Prettier Insert/Replace/Delete - Scss Stress Test',
      code: stressTestScssInput,
      fixed: stressTestScssExpected,
      warnings: [
        {
          message: `Delete ";;" (prettier/prettier)`,
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 20,
        },
        {
          message: 'Insert "," (prettier/prettier)',
          line: 33,
          column: 22,
          endLine: 33,
          endColumn: 23,
        },
        {
          message:
            'Replace "transform:·scale(0.85)" with "⏎····transform:·scale(0.85);⏎··" (prettier/prettier)',
          line: 43,
          column: 53,
          endLine: 43,
          endColumn: 75,
        },
      ],
    },
  ],
});

// Test trailing commas in near-empty scss files
testRule({
  plugins,
  ruleName,
  config: [true, {trailingComma: 'all'}],
  codeFilename: filename('default', 'dummy.scss'),
  customSyntax: 'postcss-scss',
  fix: true,

  accept: [
    {
      description: 'Prettier Scss Valid - Formatting Trailing Commas',
      code: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30,\n);\n`,
    },
  ],
  reject: [
    {
      description: 'Prettier Scss Invalid - Formatting Trailing Commas',
      code: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30\n);\n`,
      fixed: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30,\n);\n`,
      message: `Insert "," (prettier/prettier)`,
      line: 4,
      column: 14,
      endLine: 4,
      endColumn: 15,
    },
  ],
});

// Passing a syntax works
testRule({
  plugins,
  ruleName,
  config: [true, {parser: 'scss', trailingComma: 'all'}],
  customSyntax: 'postcss-scss',
  fix: true,
  accept: [
    {
      description: 'Prettier Scss Valid - Setting Explicit Parser',
      code: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30,\n);\n`,
    },
  ],
  reject: [
    {
      description: 'Prettier Scss Invalid - Setting Explicit Parser',
      code: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30\n);\n`,
      fixed: `$map: (\n  'alpha': 10,\n  'beta': 20,\n  'gamma': 30,\n);\n`,
      message: `Insert "," (prettier/prettier)`,
      line: 4,
      column: 14,
      endLine: 4,
      endColumn: 15,
    },
  ],
});

// EOL Tests
testRule({
  plugins,
  ruleName,
  config: [true, {endOfLine: 'auto'}],
  fix: true,
  accept: [
    {
      description: 'Prettier EOL Valid - UNIX',
      code: `body {\n  font-size: 12px;\n}\np {\n  color: 'black';\n}\n`,
    },
    {
      description: 'Prettier EOL Valid - Windows',
      code: `body {\r\n  font-size: 12px;\r\n}\r\np {\r\n  color: 'black';\r\n}\r\n`,
    },
  ],
  reject: [
    {
      description: 'Prettier EOL Invalid - UNIX',
      code: `body {\n  font-size: 12px;\n}\np {\n  color: 'black';\n}`,
      fixed: `body {\n  font-size: 12px;\n}\np {\n  color: 'black';\n}\n`,
      message: `Insert "⏎" (prettier/prettier)`,
      line: 6,
      column: 2,
      endLine: 6,
      endColumn: 3,
    },
    {
      description: 'Prettier EOL Invalid - Windows',
      code: `body {\r\n  font-size: 12px;\r\n}\r\np {\r\n  color: 'black';\r\n}`,
      fixed: `body {\r\n  font-size: 12px;\r\n}\r\np {\r\n  color: 'black';\r\n}\r\n`,
      message: `Insert "␍⏎" (prettier/prettier)`,
      line: 6,
      column: 2,
      endLine: 6,
      endColumn: 3,
    },
  ],
});

describe('stylelint configurations', () => {
  const oldWarn = console.warn;
  beforeEach(() => {
    console.warn = mock.fn(console.warn);
  });

  afterEach(() => {
    console.warn = oldWarn;
  });

  it("doesn't raise prettier warnings on `message`", async () => {
    await stylelint.lint({
      code: ``,
      config: {
        plugins: ['./'],
        rules: {
          'prettier/prettier': [true, {message: 'welp'}],
        },
      },
    });

    assert.strictEqual(console.warn.mock.calls.length, 0);
  });

  it("doesn't raise prettier warnings on `severity`", async () => {
    await stylelint.lint({
      code: ``,
      config: {
        plugins: ['./'],
        rules: {
          'prettier/prettier': [true, {severity: 'warning'}],
        },
      },
    });

    assert.strictEqual(console.warn.mock.calls.length, 0);
  });
});

/**
 * Builds a dummy file path to trick prettier into resolving a specific .prettierrc file.
 */
function filename(dir, file = 'dummy.css') {
  return path.resolve(__dirname, `./prettierrc/${dir}/${file}`);
}
