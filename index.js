'use strict';
var postcss = require('postcss');
var mime = require('mime');
var fs = require('fs');
var path = require('path');

function inline(cssValue, filter, basePath) {
  var parsedCssValue = cssValue.match(/url\((.*?)\)/);
  // Check if the value contains url(...)
  if (!parsedCssValue || parsedCssValue.length !== 2) {
    return cssValue;
  }
  var url = path.join(basePath, parsedCssValue[1].trim());
  // Check if filter matches
  if (filter && !filter.test(url)) {
    return cssValue;
  }
  // Check if file exists
  if (!fs.existsSync(url)) {
    return cssValue;
  }
  // Replace with base64 image
  var file = fs.readFileSync(url);
  var mimeType = mime.lookup(url);
  return 'url(data:' + mimeType + ';base64,' + new Buffer(file).toString('base64') + ')';
}

module.exports = postcss.plugin('postcss-inline', function(opts) {
  opts = opts || {};
  if (!opts.basePath) {
    opts.basePath = process.cwd();
  }
  return function(css) {
    css.eachDecl('background-image', function(decl) {
      decl.value = inline(decl.value, opts.filter, opts.basePath);
    });
    css.eachDecl('src', function(decl) {
      decl.value = inline(decl.value, opts.filter, opts.basePath);
    });
  };
});

