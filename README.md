# PostCSS Inline [![Build Status][ci-img]][ci]

[PostCSS] plugin that puts images and fonts as data URIs into your CSS. (based on PostCSS Image Inline)

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/jantimon/postcss-inline.svg
[ci]:      https://travis-ci.org/jantimon/postcss-inline

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.woff') format('woff');
}
.foo {
    background-inline: url(one_pixel_transparent.gif);
}
```

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('data:application/x-font-woff;base64,AACH5BAEAAAAALA...==') format('woff');
}
.foo {
    background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==);
}
```

## Usage

```js
postcss([ require('postcss-inline') ])
```

```js
// Inline only woff files:
postcss([ require('postcss-inline'){filter: /.woff$/} ])
```

```js
// Specify the base path for the assets
postcss([ require('postcss-inline'){basePath: '/some/path'} ])
```

See [PostCSS] docs for examples for your environment.
