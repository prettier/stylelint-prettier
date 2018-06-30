const stylelint = require('stylelint');
const {showInvisibles, generateDifferences} = require('eslint-plugin-prettier');

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
  (expectaction, options, context) => {
    return (root, result) => {
      const validOptions = stylelint.utils.validateOptions(result, ruleName, {
        actual: expectaction,
      });
      if (!validOptions) {
        return;
      }

      if (!prettier) {
        // Prettier is expensive to load, so only load it if needed.
        prettier = require('prettier');
      }

      const filepath = root.source.input.file;
      const source = root.source.input.css;

      const prettierRcOptions =
        prettier.resolveConfig && prettier.resolveConfig.sync
          ? prettier.resolveConfig.sync(filepath, {
              editorconfig: true,
            })
          : null;

      const prettierOptions = Object.assign({}, prettierRcOptions, options, {
        filepath,
      });
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

      differences.forEach((difference) => {
        switch (difference.operation) {
          case 'insert':
            report(messages.insert(difference.insertText), difference.offset);
            break;
          case 'delete':
            report(messages.delete(difference.deleteText), difference.offset);
            break;
          case 'replace':
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

module.exports.ruleName = ruleName;
module.exports.messages = messages;
