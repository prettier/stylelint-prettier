const path = require('path');
const {ruleName} = require('..');
const stylelint = require('stylelint');

// Reading from default .prettierrc
testRule({
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
    },
    {
      description: 'Prettier Replace - Default .prettierrc',
      code: '.x { color:red; }\n',
      fixed: '.x {\n  color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎··color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
    },
    {
      description: 'Prettier Delete - Default .prettierrc',
      code: '.x {\n  color: red;;\n}\n',
      fixed: '.x {\n  color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 14,
    },
  ],
});

// Reading from custom .prettierrc
testRule({
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
    },
    {
      description: 'Prettier Replace - Custom .prettierrc',
      code: '.x { color:red; }\n',
      fixed: '.x {\n    color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎····color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
    },
    {
      description: 'Prettier Delete - Custom .prettierrc',
      code: '.x {\n    color: red;;\n}\n',
      fixed: '.x {\n    color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 16,
    },
  ],
});

// Merging options from config into .prettierrc
testRule({
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
    },
    {
      description: 'Prettier Replace - Inline Options Override',
      code: '.x { color:red; }\n',
      fixed: '.x {\n        color: red;\n}\n',
      message:
        'Replace "·color:red;·" with "⏎········color:·red;⏎" (prettier/prettier)',
      line: 1,
      column: 5,
    },
    {
      description: 'Prettier Delete - Inline Options Override',
      code: '.x {\n        color: red;;\n}\n',
      fixed: '.x {\n        color: red;\n}\n',
      message: 'Delete ";" (prettier/prettier)',
      line: 2,
      column: 20,
    },
  ],
});

// Use the css parser if no filename was specified
testRule({
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
    },
  ],
});

// Use the parser specified in overrides in .prettierrc
testRule({
  ruleName,
  config: true,
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
    },
  ],
});

// Ignoring files in .prettierignore
testRule({
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
    },
    // This should pass but the output goes a bit weird
    // {
    //   description: 'Prettier Invalid Raws - no trailing windows newline',
    //   code: '/* start */\r\n.x {\r\n  color: red; /* middle */\r\n}',
    //   fixed: '/* start */\r\n.x {\r\n  color: red; /* middle */\r\n}\r\n',
    //   message: 'Insert "␍⏎" (prettier/prettier)',
    //   line: 4,
    //   column: 2,
    // },
    {
      description: 'Prettier Invalid Raws - comment and no newline',
      code: '/* start */\n.x {\n  color: red; /* middle */\n}\n/* end */',
      fixed: '/* start */\n.x {\n  color: red; /* middle */\n}\n/* end */\n',
      message: 'Insert "⏎" (prettier/prettier)',
      line: 5,
      column: 10,
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
        },
        {
          message:
            'Replace ".first:after{color:·red;content:·"beep";" with "⏎.first:after·{⏎··color:·red;⏎··content:·\'beep\';⏎" (prettier/prettier)',
          line: 5,
          column: 14,
        },
        {
          message: 'Insert "··" (prettier/prettier)',
          line: 8,
          column: 1,
        },
        {
          message:
            'Replace "content:·"beep"" with "··content:·\'beep\'" (prettier/prettier)',
          line: 9,
          column: 1,
        },
        {
          message:
            'Replace ".final:after{color:·blue;content:·"shift";}" with "⏎.final:after·{⏎··color:·blue;⏎··content:·\'shift\';" (prettier/prettier)',
          line: 12,
          column: 14,
        },
        {
          message: 'Insert "}" (prettier/prettier)',
          line: 13,
          column: 1,
        },
        {
          message: 'Insert "··" (prettier/prettier)',
          line: 16,
          column: 1,
        },
        {
          message:
            'Replace ".ham{display:inline" with "⏎.ham·{⏎··display:·inline;⏎" (prettier/prettier)',
          line: 17,
          column: 2,
        },
        {
          message:
            'Replace "····display:·block;;;;;;;;" with "··display:·block;" (prettier/prettier)',
          line: 20,
          column: 1,
        },
        {
          message: 'Delete "⏎" (prettier/prettier)',
          line: 21,
          column: 2,
        },
        {
          message:
            'Replace ".final:after{color:·blue;content:·"shift";" with "⏎.final:after·{⏎··color:·blue;⏎··content:·\'shift\';⏎" (prettier/prettier)',
          line: 24,
          column: 14,
        },
      ],
    },
  ],
});

// Scss Stress test
stressTestScssInput = `$size: rem(10px);;;
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
        },
        {
          message: 'Insert "," (prettier/prettier)',
          line: 33,
          column: 22,
        },
        {
          message:
            'Replace "transform:·scale(0.85)" with "⏎····transform:·scale(0.85);⏎··" (prettier/prettier)',
          line: 43,
          column: 53,
        },
      ],
    },
  ],
});

// Test trailing commas in near-empty scss files
testRule({
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
    },
  ],
});

// Passing a syntax works
testRule({
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
    },
  ],
});

// EOL Tests
testRule({
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
      message: `Insert \"⏎\" (prettier/prettier)`,
      line: 6,
      column: 2,
    },
    {
      description: 'Prettier EOL Invalid - Windows',
      code: `body {\r\n  font-size: 12px;\r\n}\r\np {\r\n  color: 'black';\r\n}`,
      fixed: `body {\r\n  font-size: 12px;\r\n}\r\np {\r\n  color: 'black';\r\n}\r\n`,
      message: `Insert \"␍⏎\" (prettier/prettier)`,
      line: 6,
      column: 2,
    },
  ],
});

describe('stylelint configurations', () => {
  const oldWarn = console.warn;
  beforeEach(() => {
    console.warn = jest.fn(console.warn);
  });

  afterEach(() => {
    console.warn = oldWarn;
  });

  it("doesn't raise prettier warnings on `message`", () => {
    const linted = stylelint.lint({
      code: ``,
      config: {
        plugins: ['./'],
        rules: {
          'prettier/prettier': [true, {message: 'welp'}],
        },
      },
    });

    return linted.then(() => {
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringMatching(/ignored unknown option.+message/i)
      );
    });
  });

  it("doesn't raise prettier warnings on `severity`", () => {
    const linted = stylelint.lint({
      code: ``,
      config: {
        plugins: ['./'],
        rules: {
          'prettier/prettier': [true, {severity: 'warning'}],
        },
      },
    });

    return linted.then(() => {
      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringMatching(/ignored unknown option.+severity/i)
      );
    });
  });
});

/**
 * Builds a dummy file path to trick prettier into resolving a specific .prettierrc file.
 */
function filename(dir, file = 'dummy.css') {
  return path.resolve(__dirname, `./prettierrc/${dir}/${file}`);
}
