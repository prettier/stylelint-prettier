import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve, sep, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
});

function runStylelint(pattern) {
  const stylelintCmd = resolve(`${__dirname}/../node_modules/.bin/stylelint`);
  const cwd = `${__dirname}/fixtures`;

  // Use github formatter as it is less likely to change across releases
  const result = spawnSync(stylelintCmd, ['--formatter=github', pattern], {
    cwd,
  });

  return {
    status: result.status,
    output: result.stdout.toString().trim(),
    error: result.stderr
      .toString()
      .trim()
      .replaceAll(`file=${cwd}${sep}`, 'file='),
  };
}
