/* global it, describe */
'use strict';
var postcss = require('postcss');
var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

var plugin = require('../');

var test = function(input, output, opts, done) {
  postcss([plugin(opts)]).process(input).then(function(result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function(error) {
    done(error);
  });
};

describe('postcss-inline-image', function() {

  it('should bundle images as data URIs', function(done) {
    test('.foo { background: green url(test/assets/onepx.gif); }',
      '.foo { background: green url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==); }', {}, done);
  });

  it('should bundle images as data URIs', function(done) {
    test('.foo { background-image: url(test/assets/onepx.gif); }',
      '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==); }', {}, done);
  });

  it('should bundle fonts as data URIs', function(done) {
    var base64Font = fs.readFileSync(path.join(__dirname, 'fixtures', 'font.base64'));
    test('@font-face { font-family: "MyWebFont"; src: url(test/assets/AguafinaScript-Regular.woff); }',
      '@font-face { font-family: "MyWebFont"; src: url(' + base64Font + '); }', {}, done);
  });

  it('should bundle files from the given base path', function(done) {
    test('.foo { background-image: url(onepx.gif); }',
      '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==); }',
      { basePath: path.join(__dirname, 'assets')}, done);
  });

  it('should bundle only files matching the filter', function(done) {
    test('@font-face { font-family: "MyWebFont"; src: url(test/assets/AguafinaScript-Regular.woff); }' +
        '.foo { background-image: url(test/assets/onepx.gif); }',
        '@font-face { font-family: "MyWebFont"; src: url(test/assets/AguafinaScript-Regular.woff); }' +
        '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==); }', {filter: /\.gif$/}, done);
  });

});
