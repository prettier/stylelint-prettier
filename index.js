import stylelint from 'stylelint';
import {showInvisibles, generateDifferences} from 'prettier-linter-helpers';

const prettierPromise = import('prettier');

const {INSERT, DELETE, REPLACE} = generateDifferences;

let prettier;

const ruleName = 'prettier/prettier';
const messages = stylelint.utils.ruleMessages(ruleName, {
  insert: (code) => `Insert "${showInvisibles(code)}"`,
  delete: (code) => `Delete "${showInvisibles(code)}"`,
  replace: (deleteCode, insertCode) =>
    `Replace "${showInvisibles(deleteCode)}" with "${showInvisibles(
      insertCode
    )}"`,
});

/** @type {stylelint.Rule} */
const ruleFunction = (expectation, options, context) => {
  return async (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
    });
    if (!validOptions) {
      return;
    }

    // Stylelint can handle css-in-js, in which it formats object literals.
    // We don't want to run these extracts of JS through prettier
    if (root.source.lang === 'object-literal') {
      return;
    }

    const stylelintPrettierOptions = omitStylelintSpecificOptions(options);

    if (!prettier) {
      // Prettier is expensive to load, so only load it if needed.
      prettier = await prettierPromise;
    }

    // Default to '<input>' if a filepath was not provided.
    // This mimics eslint's behaviour
    const filepath = root.source.input.file || '<input>';

    const prettierRcOptions = await prettier.resolveConfig(filepath, {
      editorconfig: true,
    });

    const prettierFileInfo = await prettier.getFileInfo(filepath, {
      resolveConfig: true,
      plugins:
        prettierRcOptions?.plugins ?? stylelintPrettierOptions?.plugins ?? [],
      ignorePath: '.prettierignore',
    });

    // Skip if file is ignored using a .prettierignore file
    if (prettierFileInfo.ignored) {
      return;
    }

    const initialOptions = {};

    // If no filepath was provided then assume the CSS parser
    // This is added to the options first, so that
    // prettierRcOptions and stylelintPrettierOptions can still override
    // the parser.
    if (filepath == '<input>') {
      initialOptions.parser = 'css';
    }

    // Stylelint supports languages that may contain multiple types of style
    // languages, thus we can't rely on guessing the parser based off the
    // filename.

    // In all of the following cases stylelint extracts a part of a file to
    // be formatted and there exists a prettier parser for the whole file.
    // If you're interested in prettier you'll want a fully formatted file so
    // you're about to run prettier over the whole file anyway.
    // Therefore running prettier over just the style section is wasteful, so
    // skip it.

    const parserBlockList = [
      'babel',
      'flow',
      'typescript',
      'vue',
      'markdown',
      'html',
      'angular', // .component.html files
      'svelte',
      'astro',
    ];
    if (parserBlockList.indexOf(prettierFileInfo.inferredParser) !== -1) {
      return;
    }

    const prettierOptions = Object.assign(
      {},
      initialOptions,
      prettierRcOptions,
      stylelintPrettierOptions,
      {filepath}
    );

    let prettierSource;

    const source = root.toString(result.opts.syntax);
    try {
      prettierSource = await prettier.format(source, prettierOptions);
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw err;
      }

      let message = 'Parsing error: ' + err.message;

      // Prettier's message contains a codeframe style preview of the
      // invalid code and the line/column at which the error occurred.
      // ESLint shows those pieces of information elsewhere already so
      // remove them from the message
      if (err.codeFrame) {
        message = message.replace(`\n${err.codeFrame}`, '');
      }
      if (err.loc) {
        message = message.replace(/ \(\d+:\d+\)$/, '');
      }

      const startIndex = getIndexFromLoc(source, err.loc.start);

      stylelint.utils.report({
        ruleName,
        result,
        message,
        node: root,
        index: startIndex,
        endIndex: err.loc.end
          ? getIndexFromLoc(source, err.loc.end)
          : startIndex + 1,
      });

      return;
    }

    // Everything is the same. Nothing to do here;
    if (source === prettierSource) {
      return;
    }

    // Otherwise let's generate some differences

    const differences = generateDifferences(source, prettierSource);

    const report = (message, index, endIndex) => {
      return stylelint.utils.report({
        ruleName,
        result,
        message,
        node: root,
        index,
        endIndex,
      });
    };

    if (context.fix) {
      // Fixes must be processed in reverse order, as an early delete shall
      // change the modification offsets for anything after it
      const rawData = differences.reverse().reduce((rawData, difference) => {
        let insertText = '';
        let deleteText = '';
        switch (difference.operation) {
          case INSERT:
            insertText = difference.insertText;
            break;
          case DELETE:
            deleteText = difference.deleteText;
            break;
          case REPLACE:
            insertText = difference.insertText;
            deleteText = difference.deleteText;
            break;
        }

        return (
          rawData.substring(0, difference.offset) +
          insertText +
          rawData.substring(difference.offset + deleteText.length)
        );
      }, source);

      // If root.source.syntax exists then it means stylelint had to use
      // postcss-syntax to guess the postcss parser that it should use based
      // upon the input filename.
      // In that case we want to use the parser that postcss-syntax picked.
      // Otherwise use the syntax parser that was provided in the options
      const syntax = root.source.syntax || result.opts.syntax;
      const newRoot = syntax.parse(rawData);

      // For reasons I don't really understand, when the original input does
      // not have a trailing newline, newRoot generates a trailing newline but
      // it does not get included in the output.
      // Cleaning the root raws (to remove any existing whitespace), then
      // adding the final new line into the root raws seems to fix this
      root.removeAll();
      root.cleanRaws();
      root.append(newRoot);

      // Use the EOL whitespace from the rawData, as it could be \n or \r\n
      const trailingWhitespace = rawData.match(/[\s\uFEFF\xA0]+$/);
      if (trailingWhitespace) {
        root.raws.after = trailingWhitespace[0];
      }
      return;
    }

    // Report in the order the differences appear in the content
    differences.forEach((difference) => {
      const {offset, deleteText = ''} = difference;
      switch (difference.operation) {
        case INSERT:
          report(
            messages.insert(difference.insertText),
            offset,
            offset + deleteText.length
          );
          break;
        case DELETE:
          report(
            messages.delete(difference.deleteText),
            difference.offset,
            offset + deleteText.length
          );
          break;
        case REPLACE:
          report(
            messages.replace(difference.deleteText, difference.insertText),
            difference.offset,
            offset + deleteText.length
          );
          break;
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default stylelint.createPlugin(ruleName, ruleFunction);

function omitStylelintSpecificOptions(options) {
  const prettierOptions = Object.assign({}, options);
  delete prettierOptions.message;
  delete prettierOptions.severity;
  return prettierOptions;
}

function getIndexFromLoc(source, {line, column}) {
  function nthIndex(str, searchValue, n) {
    let i = -1;
    while (n-- && i++ < str.length) {
      i = str.indexOf(searchValue, i);
      if (i < 0) {
        break;
      }
    }
    return i;
  }

  if (line === 1) {
    return column - 1;
  }

  return nthIndex(source, '\n', line - 1) + column;
}
