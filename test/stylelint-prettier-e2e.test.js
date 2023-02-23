const {spawnSync} = require('child_process');
const {resolve} = require('path');
const stripAnsi = require('strip-ansi');

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
check.invalid.css
 2:25  ✖  Replace ""x"" with "'x'"  prettier/prettier

1 problem (1 error, 0 warnings)
`.trim();

    expect(result.output).toEqual(expectedResult);
    expect(result.error).toEqual('');
    expect(result.status).toEqual(2);
  });

  test('SCSS files', () => {
    const result = runStylelint('*.scss');

    const expectedResult = `
check.invalid.scss
 2:25  ✖  Replace ""x"" with "'x'"  prettier/prettier
 8:14  ✖  Insert ","                prettier/prettier

2 problems (2 errors, 0 warnings)
`.trim();

    expect(result.output).toEqual(expectedResult);
    expect(result.error).toEqual('');
    expect(result.status).toEqual(2);
  });

  /**
   * Don't act upon html-like files, as prettier already handles them as whole
   * files
   */
  test('HTML/Markdown/Vue/Svelte files', () => {
    const result = runStylelint('*.{html,md,vue,svelte}');

    const expectedResult = ``;

    expect(result.output).toEqual(expectedResult);
    expect(result.error).toEqual('');
    expect(result.status).toEqual(0);
  });

  /**
   * Don't act upon CSS-in-JS files, as prettier already handles them as whole
   * files
   */
  test('CSS-in-JS files', () => {
    const result = runStylelint('*.{js,jsx,tsx}');

    const expectedResult = ``;

    expect(result.output).toEqual(expectedResult);
    expect(result.error).toEqual('');
    expect(result.status).toEqual(0);
  });
});

function runStylelint(pattern) {
  const stylelintCmd = resolve(`${__dirname}/../node_modules/.bin/stylelint`);

  const result = spawnSync(stylelintCmd, [pattern], {
    cwd: `${__dirname}/fixtures`,
  });

  return {
    status: result.status,
    output: stripAnsi(result.stdout.toString().trim()),
    error: stripAnsi(result.stderr.toString().trim()),
  };
}
