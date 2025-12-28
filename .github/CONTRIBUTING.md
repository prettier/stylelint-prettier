# Contributing

Thanks for contributing!

## Installation

```sh
git clone https://github.com/prettier/stylelint-prettier.git
cd stylelint-prettier
pnpm install
```

## Running the tests and linters

Run tests:

```sh
pnpm run test
```

Run linters:

```sh
pnpm run lint
```

This is a [Stylelint](https://stylelint.io/) plugin. Documentation for the APIs that it uses can be found on Stylelint's [Writing Plugins](https://stylelint.io/developer-guide/plugins/) page.

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
- Run the following (replacing patch with minor or major if you want a different range):

  ```sh
  pnpm version patch
  pnpm publish
  git push --follow-tags
  ```

  Running `pnpm version major|minor|patch` shall:
  - Bump the version in package.json (depending on semver range you wanted)
  - Create a new commit containing that version bump in package.json
  - Create a tag for that commit

  Running `pnpm publish` shall:
  - Publish to the npm repository

  Running `git push --follow-tags` shall:
  - Push the commit and tag to GitHub
