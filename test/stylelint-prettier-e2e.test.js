import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

import stylelint from 'stylelint';

import baseConfig from './fixtures/stylelint.config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const stylelintCwd = `${__dirname}/fixtures`;

/**
 * Tests that report errors in multiple files may change the order of the files
 * across multiple runs.
 * To avoid flaky tests, assert the reporting of errors in one file only per
 * test case. Asserting no errors are reported across multiple files is ok.
 */
describe('E2E Tests', () => {
  test('CSS files', () => {
    const result = runStylelint('*.css');

    const expectedResult = `
::error file=check.invalid.css,line=2,col=25,endLine=2,endColumn=28,title=Stylelint problem::Replace ""x"" with "'x'" (prettier/prettier)
`.trim();

    assert.strictEqual(result.output, '');
    assert.strictEqual(result.error, expectedResult);
    assert.strictEqual(result.status, 2);
  });

  test('SCSS files', () => {
    const result = runStylelint('*.scss');

    const expectedResult = `
::error file=check.invalid.scss,line=2,col=25,endLine=2,endColumn=28,title=Stylelint problem::Replace ""x"" with "'x'" (prettier/prettier)
::error file=check.invalid.scss,line=8,col=14,endLine=8,endColumn=15,title=Stylelint problem::Insert "," (prettier/prettier)
`.trim();

    assert.strictEqual(result.output, '');
    assert.strictEqual(result.error, expectedResult);
    assert.strictEqual(result.status, 2);
  });

  test('LESS files', () => {
    const result = runStylelint('*.less');

    const expectedResult = `
::error file=check.invalid.less,line=2,col=25,endLine=2,endColumn=28,title=Stylelint problem::Replace ""x"" with "'x'" (prettier/prettier)
::error file=check.invalid.less,line=8,col=12,endLine=8,endColumn=13,title=Stylelint problem::Insert ";" (prettier/prettier)
::error file=check.invalid.less,line=12,col=1,endLine=12,endColumn=2,title=Stylelint problem::Insert "··" (prettier/prettier)
`.trim();

    assert.strictEqual(result.output, '');
    assert.strictEqual(result.error, expectedResult);
    assert.strictEqual(result.status, 2);
  });

  /**
   * Don't act upon html-like files, as prettier already handles them as whole
   * files
   */
  test('HTML/Markdown/Vue/Svelte/Astro files', () => {
    const result = runStylelint('*.{html,md,vue,svelte,astro}');

    const expectedResult = ``;

    assert.strictEqual(result.output, '');
    assert.strictEqual(result.error, expectedResult);
    assert.strictEqual(result.status, 0);
  });

  /**
   * Don't act upon CSS-in-JS files, as prettier already handles them as whole
   * files
   */
  test('CSS-in-JS files', () => {
    const result = runStylelint('*.{js,jsx,tsx}');

    const expectedResult = ``;

    assert.strictEqual(result.output, '');
    assert.strictEqual(result.error, expectedResult);
    assert.strictEqual(result.status, 0);
  });

  /** @see https://github.com/prettier/stylelint-prettier/issues/354 */
  test('the --fix option works correctly with other rules', async () => {
    const inputCode = `.a {\n  color: #ffffff;\n  font-size: 16px\n}\n`;
    const fixConfig = structuredClone(baseConfig);
    fixConfig.rules['color-hex-length'] = 'short';

    const {code: outputCode} = await stylelint.lint({
      code: inputCode,
      configBasedir: stylelintCwd,
      fix: true,
      config: fixConfig,
    });

    assert.strictEqual(
      outputCode,
      '.a {\n  color: #fff;\n  font-size: 16px;\n}\n'
    );
  });
});

function runStylelint(pattern) {
  const stylelintCmd = resolve(`${__dirname}/../node_modules/.bin/stylelint`);

  // Use json formatter as it is less likely to change across releases
  const result = spawnSync(stylelintCmd, ['--formatter=json', pattern], {
    cwd: stylelintCwd,
  });

  const jsonErrors = JSON.parse(result.stderr.toString().trim());

  const errorLines = [];

  for (const error of jsonErrors) {
    for (const warning of error.warnings) {
      errorLines.push(
        `::error file=${relative(stylelintCwd, error.source)}` +
          `,line=${warning.line}` +
          `,col=${warning.column}` +
          `,endLine=${warning.endLine}` +
          `,endColumn=${warning.endColumn}` +
          `,title=Stylelint problem` +
          `::${warning.text}`
      );
    }
  }

  return {
    status: result.status,
    output: result.stdout.toString().trim(),
    error: errorLines.join('\n'),
  };
}
