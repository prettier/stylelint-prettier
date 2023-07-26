# Contributing

Thanks for contributing!

## Installation

```sh
git clone https://github.com/prettier/stylelint-prettier.git
cd stylelint-prettier
yarn install
```

## Running the tests

```sh
yarn run test
```

This is a [Stylelint](https://stylelint.io/) plugin. Documentation for the APIs that it uses can be found on Stylelint's [Writing Plugins](https://stylelint.io/developer-guide/plugins/) page.

Linting is ran as part of `yarn run test`. The build will fail if there are any linting errors. You can run `yarn run lint --fix` to fix some linting errors (including formatting to match prettier's expectations). To run the tests without linting run `yarn run jest`.

This plugin is used to lint itself. The style is checked when `npm test` is run, and the build will fail if there are any linting errors. You can use `npm run lint -- --fix` to fix some linting errors. To run the tests without running the linter, you can use `node_modules/.bin/mocha`.

### End to end tests

e2e test fixtures are in `test/fixtures`.

Running the e2e tests while trying to debug a problem can be annoying. To check
stylelint's output of a single fixture, run stylelint from within the fixtures
directory:

```sh
cd test/fixtures
../../node_modules/.bin/stylelint 'check*'
```

## Publishing

- Ensure you are on the `main` branch locally.
- Update `CHANGELOG.md` and commit.
- Run the following:

  ```sh
  yarn publish
  git push --follow-tags
  ```

  Running `yarn publish` shall:

  - Bump the version in package.json (asking you for the new version number)
  - Create a new commit containing that version bump in package.json
  - Create a tag for that commit
  - Publish to the npm repository

  Running `git push --follow-tags` shall:

  - Push the commit and tag to GitHub
