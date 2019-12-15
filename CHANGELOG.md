# Changelog

## 1.1.2 (2019-12-14)

- Account for user defined parser overrides when working out what files to skip (#39)
- Add an extra check to quickly skip formatting CSS-in-JS object literals (#39)
- Bump dev dependencies (#39)

## 1.1.1 (2019-05-30)

- Fix incorrect trailing whitespace on Windows (#24)

## 1.1.0 (2019-05-12)

- Do not trigger prettier for js, ts, vue, html and markdown files. In stylelint >=9.9.0 these files sometimes worked and sometimes threw errors. In stylelint >=9.10.0 they would either error or have incorrect indentation. Prettifying a subset of the file (i.e. just contents of `<style>` tags) using stylelint feels like unneeded work if you're about to run prettier over the whole file anyway (#22)

## 1.0.7 (2019-05-07)

- Add stylelint >9.2.1 as a peerDependency to help Yarn PNP support

## 1.0.6 (2019-01-05)

- Report unparsable code as linting issues instead of crashing (#14)

## 1.0.5 (2018-11-16)

- Specifying an explict syntax with `--syntax` will no longer crash when autofixing (#11)

## 1.0.4 (2018-11-11)

- Do not pass stylelint built-in options `severity` and `messsage` to prettier (#10)

## 1.0.3 (2018-10-01)

- Use the CSS parser when no filename is specified
- Use prettier-linter-helpers instead of depending on eslint-plugin-prettier (#7)

## 1.0.2 (2018-09-28)

- Update documentation and package.json to reflect the new repo location as part of the prettier GitHub organization (#5)

## 1.0.1 (2018-09-05)

- Allow using overrides in `.prettierrc` to lint non-standard file extensions (#3)

## 1.0.0 (2018-09-05)

The code for v1.0.0 is identical to v0.2.2. It has been used in production for a
little while and I consider it stable.

- Minor readme tweaks

## 0.2.2 (2018-07-29)

- Better formatting of `\r` in reporting
- Bump minimum required eslint-plugin-prettier version to 2.6.2
- Ignore files that are specified in a .prettierignore file

## 0.2.1 (2018-07-03)

- Ensure non-css languages (e.g. scss) would be parsed correctly when autofixing
- Bump minimum required stylelint version to 9.2.1
- Ensure trailing whitespace is always output when autofixing, even if the input file lacked trailing whitespace

## 0.2.0 (2018-07-02)

- Add support for autofixing issues using `stylelint --fix`

## 0.1.0 (2018-07-02)

- Initial functionality
- Exposes a stylelint plugin that runs prettier
- It reads config from .prettierrc by default but you can also pass config options into the rule
