# stylelint-prettier [![Build Status](https://www.travis-ci.org/prettier/stylelint-prettier.svg?branch=master)](https://www.travis-ci.org/prettier/stylelint-prettier)

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

## Recommended Configuration

This plugin works best if you disable all other Stylelint rules relating to code formatting, and only enable rules that detect patterns in the AST. (If another active Stylelint rule disagrees with `prettier` about how code should be formatted, it will be impossible to avoid lint errors.) You can use [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) to disable all formatting-related Stylelint rules.

If your desired formatting does not match the `prettier` output, you should use a different tool such as [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) instead.

To integrate this plugin with `stylelint-config-prettier`, you can use the `"recommended"` configuration:

1.  In addition to the above installation instructions, install `stylelint-config-prettier`:

    ```sh
    npm install --save-dev stylelint-config-prettier
    ```

2.  Then replace the plugins and rules declarations in your `.stylelintrc` that you added in the prior section with:

    ```json
    {
      "extends": ["stylelint-prettier/recommended"]
    }
    ```

This does three things:

1.  Enables the `stylelint-plugin-prettier` plugin.
2.  Enables the `prettier/prettier` rule.
3.  Extends the `stylelint-config-prettier` configuration.

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

See [CONTRIBUTING.md](https://github.com/prettier/stylelint-prettier/blob/master/.github/CONTRIBUTING.md)

## Inspiration

The layout for this codebase and base configuration of prettier was taken from <https://github.com/prettier/eslint-plugin-prettier>
