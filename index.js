const DISPLAY_FLEX_VALUES = ['flex', 'inline-flex'];
// row-gap is not mentioned here since this plugin only supports single line usage of flexbox.
const GAP_VALUES = ['gap', 'column-gap', 'grid-gap', 'grid-column-gap'];
const [GAP, COLUMN_GAP, GRID_GAP, GRID_COLUMN_GAP] = GAP_VALUES;
const CUSTOM_GAP_PROPERTY = '--pfg-gap';

/**
 * Adds a new custom gap declaration using the gap value
 * and removes the gap declaration.
 * @param {*} decl 
 */
const modifyGapProp = (decl) => {
  decl.after(`${CUSTOM_GAP_PROPERTY}: ${decl.value}`);
  decl.remove();
};

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
      // ...Object.fromEntries(GAP_VALUES.map((value) => [value, modifyGapProp])),
      [GAP]: modifyGapProp,
      [COLUMN_GAP]: modifyGapProp,
      [GRID_GAP]: modifyGapProp,
      [GRID_COLUMN_GAP]: modifyGapProp,
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
