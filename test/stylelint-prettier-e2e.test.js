const {spawnSync} = require('child_process');
const {resolve} = require('path');
const stripAnsi = require('strip-ansi');

describe('E2E Tests', () => {
  test('CSS/SCSS files', () => {
    const result = runStylelint('*.{css,scss}');

    const expectedResult = `
check.invalid.css
 2:25  ✖  Replace ""x"" with "'x'"   prettier/prettier

check.invalid.scss
 2:25  ✖  Replace ""x"" with "'x'"   prettier/prettier
 8:14  ✖  Insert ","                 prettier/prettier
`.trim();

    expect(result.output).toEqual(expectedResult);
    expect(result.status).toEqual(2);
  });

  test('HTML/Markdown/Vue files', () => {
    const result = runStylelint('*.{html,md,vue}');

    const expectedResult = ``;

    expect(result.output).toEqual(expectedResult);
    expect(result.status).toEqual(0);
  });

  /**
   * Don't act upon CSS-in-JS files
   */
  test('CSS-in-JS files', () => {
    const result = runStylelint('*.{js,jsx,tsx}');

    const expectedResult = ``;

    expect(result.output).toEqual(expectedResult);
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
  };
}
