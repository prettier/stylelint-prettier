# Changelog

## 4.1.0 (2023-11-24)

- Added end indexes for violations - the squiggly line in vscode will now cover more than one character. (#341)
- Do not trigger prettier for .astro files. (#340)

## 4.0.2 (2023-07-27)

Fix case where an error is thrown when no prettier configuration file is found (#311)

## 4.0.1 (2023-07-26)

Fix `prettier-plugin-svelte` support by ensuring `.svelte` files are ignored. The regression of them not being ignored only affected v4.0.0. (#309)

## 4.0.0 (2023-07-07)

Add support for Prettier v3.

In order to make Prettier v3 work, we've had to drop support for Prettier `v2.x` and Stylelint less that `v15.8.0`. Maintaining temporary support for Prettier v2 and v3 at the same time isn't worth the complication that results thanks to prettier's migration to es modules. When you update to prettier v3, ensure that you update `stylelint-prettier` at the same time.

- Minimum supported `prettier` version is now `v3.0.0`.
- Minimum supported `stylelint` version is now `v15.8.0`.

## 3.0.0 (2023-02-22)

Remove `stylelint-config-prettier` from the recommended config. [Stylelint v15 deprecated the rules that `stylelint-config-prettier` disabled](https://stylelint.io/migration-guide/to-15/#deprecated-stylistic-rules), thus if you do not use those deprecated rules then you do not need `stylelint-config-prettier`. If you are still using these deprecated rules then you should install and configure `stylelint-config-prettier` separately.

Increase the mimimum required node version. No code changes have been required and v2.0.0 works with stylelint v15, however continuing to test with the unsupported node 12 is a burden that is not worth carrying.

- Minimum node requirement is now "^14.17.0 || >=16.0.0" (drop support for v12.x)
- If you extended from the `stylelint-prettier/recommended` in v2 then you must add an explict extend from `stylelint-config-prettier` to retain the same behaviour.

## 2.0.0 (2021-11-05)

Increase the minimum required versions of `stylelint`, `prettier` and `node`. No code changes have been required and v1.2.0 works with stylelint v14, however continuing to test old these old unsupported versions is getting more difficult thanks to internal API changes. (#198)

- Minimum stylelint version is now v14 (drop support for v9.5 through v13.x)
- Minimum prettier version is now v2 (drop support for v1.x)
- Minimum node requirements is now ^12.22.0 || ^14.17.0 || >=16.0.0 (drop support for v8.x and v10.x)

## 1.2.0 (2021-02-27)

- Do not trigger prettier for .svelte and .component.html (angular) files. This avoids errors. Prettifying a subset of the file (i.e. just contents of `<style>` tags) using stylelint feels like unneeded work if you're about to run prettier over the whole file anyway (#160)

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
