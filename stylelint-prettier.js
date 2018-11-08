const stylelint = require('stylelint');
const {
  showInvisibles,
  generateDifferences,
} = require('prettier-linter-helpers');

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

module.exports = stylelint.createPlugin(
  ruleName,
  (expectation, stylelintPrettierOptions, context) => {
    return (root, result) => {
      const validOptions = stylelint.utils.validateOptions(result, ruleName, {
        actual: expectation,
      });
      if (!validOptions) {
        return;
      }

      if (!prettier) {
        // Prettier is expensive to load, so only load it if needed.
        prettier = require('prettier');
      }

      // Default to '<input>' if a filepath was not provided.
      // This mimics eslint's behaviour
      const filepath = root.source.input.file || '<input>';
      const source = root.source.input.css;

      const prettierRcOptions =
        prettier.resolveConfig && prettier.resolveConfig.sync
          ? prettier.resolveConfig.sync(filepath, {editorconfig: true})
          : null;

      //prettier.getFileInfo was added in v1.13
      const prettierFileInfo =
        prettier.getFileInfo && prettier.getFileInfo.sync
          ? prettier.getFileInfo.sync(filepath, {ignorePath: '.prettierignore'})
          : {ignored: false, inferredParser: null};

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

      const prettierOptions = Object.assign(
        {},
        initialOptions,
        prettierRcOptions,
        omitStylelintSpecificOptions(stylelintPrettierOptions),
        {filepath}
      );
      const prettierSource = prettier.format(source, prettierOptions);

      // Everything is the same. Nothing to do here;
      if (source === prettierSource) {
        return;
      }

      // Otherwise let's generate some differences

      const differences = generateDifferences(source, prettierSource);

      const report = (message, index) => {
        return stylelint.utils.report({
          ruleName,
          result,
          message,
          node: root,
          index,
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
        }, root.source.input.css);

        const newRoot = root.source.syntax.parse(
          rawData,
          root.source.input.opts
        );

        // For reasons I don't really undersand, when the original input does
        // not have a trailing newline, newRoot generates a trailing newline but
        // it does not get included in the output.
        // Cleaning the root raws (to remove any existing whitespace), then
        // adding the final new line into the root raws seems to fix this
        root.removeAll();
        root.cleanRaws();
        root.append(newRoot);

        // Use the EOL whitespace from the rawData, as it could be \n or \r\n
        const trailingWhitespace = rawData.match(/[\s\uFEFF\xA0]+$/)[0];
        if (trailingWhitespace.length) {
          root.raws.after = trailingWhitespace[0];
        }
        return;
      }

      // Report in the the order the differences appear in the content
      differences.forEach((difference) => {
        switch (difference.operation) {
          case INSERT:
            report(messages.insert(difference.insertText), difference.offset);
            break;
          case DELETE:
            report(messages.delete(difference.deleteText), difference.offset);
            break;
          case REPLACE:
            report(
              messages.replace(difference.deleteText, difference.insertText),
              difference.offset
            );
            break;
        }
      });
    };
  }
);

function omitStylelintSpecificOptions(options) {
  const prettierOptions = Object.assign({}, options);
  delete prettierOptions.severity;
  return prettierOptions;
}

module.exports.ruleName = ruleName;
module.exports.messages = messages;
