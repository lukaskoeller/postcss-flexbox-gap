const DISPLAY_FLEX_VALUES = ['flex', 'inline-flex'];
const CUSTOM_GAP_PROPERTY = '--pfg-gap';

// Help: https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md
// Guidelines: https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (/* opts = {} */) => {
  // Work with options here

  return {
    postcssPlugin: 'postcss-flexbox-gap',
    /*
    Root (root, postcss) {
      // Transform CSS AST here
    }
    */

    /*
    Declaration (decl, postcss) {
      // The faster way to find Declaration node
    }
    */

    Declaration: {
      gap: (decl) => {
        decl.remove();
        decl.after(`${CUSTOM_GAP_PROPERTY}: ${decl.value}`);
      },
      display: (decl) => {
        const isFlexContainer = DISPLAY_FLEX_VALUES.includes(decl.value);

        if (isFlexContainer) {
          const rule = decl.parent;
          rule.after(`${rule.selector} > * + * { margin-left: var(${CUSTOM_GAP_PROPERTY}); }`)
        }
      }
    }

    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}

module.exports.postcss = true
