const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: '/test.css' })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

describe('CSS Flexbox Gap Polyfill', () => {
  it('should fallback when gap and display: flex are defined in a single selector', async () => {
    run(
      '.some { color: red; } .single { --gap: 24px; display: flex; gap: var(--gap); }',
      '.some { color: red; } .single { --gap: 24px; display: flex;--pfg-gap: var(--gap); } .single > * + * { margin-left: var(--pfg-gap); }',
      { }
    )
  });
  it('should fallback when gap and display: flex are defined in multiple selectors', () => {
    run(
      '.some { color: red; } .first { --gap: 24px; gap: var(--gap); } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px;--pfg-gap: var(--gap); } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); }',
      { }
    )
  });
});
