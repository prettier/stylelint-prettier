# stylelint-prettier [![Build Status](https://github.com/prettier/stylelint-prettier/workflows/CI/badge.svg?branch=main)](https://github.com/prettier/stylelint-prettier/actions?query=workflow%3ACI+branch%3Amain)

Runs [Prettier](https://github.com/prettier/prettier) as a [Stylelint](https://stylelint.io/) rule and reports differences as individual Stylelint issues.

## Sample

Given the input file `style.css`:

<!-- prettier-ignore -->
```css
.insert {
  display: block
}

.alter:after {color: red; content: 'example'}

.delete {
  display: block;;
}

```

Running `./node_modules/.bin/stylelint style.css` shall output:

```
style.css
 2:17  ✖  Insert ";"                                          prettier/prettier
 5:15  ✖  Replace "color:·red;·content:·'example'" with       prettier/prettier
          "⏎··color:·red;⏎··content:·"example";⏎"
 8:17  ✖  Delete ";"                                          prettier/prettier
```

## Installation

```sh
npm install --save-dev stylelint-prettier prettier
```

**_`stylelint-prettier` does not install Prettier or Stylelint for you._** _You must install these yourself._

Then, in your `.stylelintrc`:

```json
{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  }
}
```

Alternatively you can extend from the `stylelint-prettier/recommended` config,
which does the same thing:

```json
{
  "extends": ["stylelint-prettier/recommended"]
}
```

## Disabling rules that may conflict with Prettier

As of Stylelint v15, [Stylelint deprecated all stylistic rules that conflict
with prettier](https://stylelint.io/migration-guide/to-15/#deprecated-stylistic-rules), and [removed these rules](https://stylelint.io/migration-guide/to-16/#removed-deprecated-stylistic-rules) in Stylelint v16.
If you are using Stylelint v15 or above and are not using any of these deprecated rules then you do not need to do anything extra; this section does not apply to you.

If you are using Stylelint's stylistic rules, then many of them shall conflict with Prettier. This plugin works best if you disable all other Stylelint rules relating to stylistic opinions. If another active Stylelint rule disagrees with `prettier` about how code should be formatted, it will be impossible to avoid lint errors. You should use [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) to disable all stylistic Stylelint rules.

To integrate this plugin with `stylelint-config-prettier`:

1. In addition to the above installation instructions, install `stylelint-config-prettier`:

   ```sh
   npm install --save-dev stylelint-config-prettier
   ```

2. Then add `stylelint-config-prettier` to the list of extended configs in your `.stylelintrc` that you added in the prior section. `stylelint-config-prettier` should go last in the array so that it will override other configs:

   ```json
   {
     "extends": [
       "stylelint-prettier/recommended",
       "stylelint-config-prettier"
     ]
   }
   ```

You can then set Prettier's own options inside a `.prettierrc` file.

## Options

_stylelint-prettier will honor your `.prettierrc` file by default_. You only
need this section if you wish to override those settings.

> Note: While it is possible to pass options to Prettier via your Stylelint configuration file, it is not recommended because editor extensions such as `prettier-atom` and `prettier-vscode` **will** read [`.prettierrc`](https://prettier.io/docs/en/configuration.html), but **won't** read settings from Stylelint, which can lead to an inconsistent experience.

Objects are passed directly to Prettier as [options](https://prettier.io/docs/en/options.html). Example:

```json
{
  "rules": {
    "prettier/prettier": [true, {"singleQuote": true, "tabWidth": 4}]
  }
}
```

NB: This option will merge and override any config set with `.prettierrc` files (for Prettier < 1.7.0, config files are ignored)

---

## Contributing

See [CONTRIBUTING.md](https://github.com/prettier/stylelint-prettier/blob/main/.github/CONTRIBUTING.md)

## Inspiration

The layout for this codebase and base configuration of prettier was taken from <https://github.com/prettier/eslint-plugin-prettier>
