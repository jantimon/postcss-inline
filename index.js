'use strict';
var postcss = require('postcss');
var mime = require('mime');
var fs = require('fs');
var path = require('path');

function inline(cssValue, filter, basePath, deleteAsset) {

  return cssValue.replace(/url\((.*?)\)/, function(match, url) {
    var filePath = path.join(basePath, url.trim());
    // Check if filter matches
    if (filter && !filter.test(filePath)) {
      return match;
    }
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return match;
    }
    // Replace with base64 image
    var file = fs.readFileSync(filePath);
    var mimeType = mime.lookup(filePath);
    var inlineUrl = 'url(data:' + mimeType + ';base64,' + new Buffer(file).toString('base64') + ')';
    // Remove asset
    if (deleteAsset) {
      fs.unlinkSync(filePath);
    }
    return inlineUrl;
  });
}

module.exports = postcss.plugin('postcss-inline', function(opts) {
  opts = opts || {};
  if (!opts.basePath) {
    opts.basePath = process.cwd();
  }
  return function(css) {
    css.eachDecl('background', function(decl) {
      decl.value = inline(decl.value, opts.filter, opts.basePath, opts.deleteAsset);
    });
    css.eachDecl('background-image', function(decl) {
      decl.value = inline(decl.value, opts.filter, opts.basePath, opts.deleteAsset);
    });
    css.eachDecl('src', function(decl) {
      decl.value = inline(decl.value, opts.filter, opts.basePath, opts.deleteAsset);
    });
  };
});

