# Changelog

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
