// Help: https://github.com/postcss/postcss/blob/main/docs/writing-a-plugin.md
// Guidelines: https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md
// PostCSS API: https://postcss.org/api/
// AST Explorer: https://astexplorer.net/

const DISPLAY_FLEX_VALUES = ['flex', 'inline-flex'];
// row-gap is not mentioned here since this plugin only supports single line usage of flexbox.
const GAP_COLUMN_VALUES = ['column-gap', 'grid-column-gap'];
const GAP_VALUES = ['gap', 'grid-gap', ...GAP_COLUMN_VALUES];
const [GAP, COLUMN_GAP, GRID_GAP, GRID_COLUMN_GAP] = GAP_VALUES;
const CUSTOM_GAP_PROPERTY = '--pfg-gap';

const hasDisplayGrid = (nodes) => (
  !!nodes.some((node) => node.prop === 'display' && node.value === 'grid')
);

const hasGapZero = (nodes) => (
  !!nodes.some((node) => GAP_VALUES.includes(node.prop) && node.value === '0')
);

const hasFlexWrap = (nodes) => (
  !!nodes.some((node) => node.prop === 'flex-flow' && node.value.includes('wrap'))
);

const hasFbgProp = (nodes) => (
  !!nodes.some((node) => node.prop === CUSTOM_GAP_PROPERTY)
);

/**
 * Adds a new custom gap declaration using the gap value
 * and removes the gap declaration.
 * @param {*} decl 
 */
const modifyGapProp = (decl) => {
  const parentNodes = decl.parent.nodes;
  if (
    hasDisplayGrid(parentNodes)
    || hasGapZero(parentNodes)
    || hasFlexWrap(parentNodes)
    || hasFbgProp(parentNodes)
  ) return;
  decl.after(`${CUSTOM_GAP_PROPERTY}: ${decl.value}`);
  // decl.remove();
};

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
        if (!isFlexContainer) return;
        const rule = decl.parent;
        
        // Add owl selector to direct children
        rule.after(`${rule.selector} > * + * { margin-left: var(${CUSTOM_GAP_PROPERTY}, 0); }`)

        // Make sure gap is not used in conjunction with display: flex
        // to avoid double gap through `gap` and `margin-left`.
        // Added to the end of the root to avoid style overwrites.
        decl.root().append(`${rule.selector} { ${
          GAP_COLUMN_VALUES.map((value) => (`${value}: 0;`)).join(' ')
        } }`)
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
