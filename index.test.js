const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: '/test.css' })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

describe('CSS Flexbox Gap Polyfill', () => {
  it('should fallback when gap and display: flex are defined in a single selector', async () => {
    await run(
      '.some { color: red; } .single { --gap: 24px; display: flex; gap: var(--gap); }',
      '.some { color: red; } .single { --gap: 24px; display: flex; gap: var(--gap);--pfg-gap: var(--gap); } .single > * + * { margin-left: var(--pfg-gap); } .single { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should fallback when gap and display: flex are defined in multiple selectors', async () => {
    await run(
      '.some { color: red; } .first { --gap: 24px; gap: var(--gap); } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px; gap: var(--gap);--pfg-gap: var(--gap); } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); } .second { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should fallback when gap-column is used', async () => {
    await run(
      '.some { color: red; } .first { --gap: 24px; column-gap: var(--gap); } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px; column-gap: var(--gap);--pfg-gap: var(--gap); } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); } .second { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should fallback when grid-gap is used', async () => {
    await run(
      '.some { color: red; } .first { --gap: 24px; grid-gap: var(--gap); } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px; grid-gap: var(--gap);--pfg-gap: var(--gap); } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); } .second { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should fallback when grid-column-gap is used', async () => {
    await run(
      '.some { color: red; } .first { --gap: 24px; grid-column-gap: var(--gap); } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px; grid-column-gap: var(--gap);--pfg-gap: var(--gap); } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); } .second { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should omit gap when used in conjuction with display: grid', async () => {
    await run(
      '.some { color: red; } .first { --gap: 24px; grid-gap: var(--gap); display: grid; } .second { display: flex; }',
      '.some { color: red; } .first { --gap: 24px; grid-gap: var(--gap); display: grid; } .second { display: flex; } .second > * + * { margin-left: var(--pfg-gap); } .second { gap: 0; column-gap: 0; grid-gap: 0; grid-column-gap: 0; }',
      { }
    )
  });
  it('should not conflict with gap and display: grid in multiple nodes', async () => {
    await run(
      '.some { color: red; } .first { gap: 12px; } .second { display: grid; }',
      '.some { color: red; } .first { gap: 12px;--pfg-gap: 12px; } .second { display: grid; }',
      { }
    )
  });
});
