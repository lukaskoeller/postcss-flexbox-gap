# postcss-flexbox-gap

[PostCSS] plugin for single line flexbox gap.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  --gap: 24px;
  display: flex;
  gap: var(--gap);
}
```

```css
.foo {
  --gap: 24px;
  display: flex;
  gap: var(--gap);
  --pfg-gap: var(--gap);
}

.foo > * + * {
  margin-left: var(--pfg-gap);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-flexbox-gap
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-flexbox-gap'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
