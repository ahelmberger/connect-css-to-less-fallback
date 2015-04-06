'use strict';

var path = require('path');
var middleware = require('./middleware.js');
var testDirectory = path.resolve(__dirname, '../test');

describe('connect-css-to-less-fallback', function () {
  var req;
  var res;
  var next;

  beforeEach(function () {
    req = {};
    res = { setHeader: jasmine.createSpy('setHeader'), end: jasmine.createSpy('end') };
    next = jasmine.createSpy('next');
  });

  describe('when called with a non-existing css file', function () {
    var sut = middleware({ root: testDirectory });
    beforeEach(function (done) {
      req.url = '/non-existing.css';
      sut(req, res, next).then(done, done);
    });
    it('should not call next', function () {
      expect(next).not.toHaveBeenCalled();
    });
    it('should set the content type to text/css', function () {
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/css');
    });
    it('should send the transpiled less file', function () {
      expect(res.end).toHaveBeenCalledWith(jasmine.stringMatching(/^\s*body\s*{\s*color:\s*black;?\s*}\s*$/));
    });
  });

  describe('when called with an existing css file', function () {
    var sut = middleware({ root: testDirectory });
    beforeEach(function () {
      req.url = '/existing.css';
      sut(req, res, next);
    });
    it('should call next immediately', function () {
      expect(next).toHaveBeenCalled();
    });
  });

  describe('when the source map option is set', function () {
    var sut = middleware({ root: testDirectory, sourceMap: true });
    beforeEach(function (done) {
      req.url = '/non-existing.css';
      sut(req, res, next).then(done, done);
    });
    it('should embed a source map', function () {
      expect(res.end).toHaveBeenCalledWith(jasmine.stringMatching(/sourceMappingURL=data:application\/json;base64/));
    });
  });

  describe('when an error during transpilation occurs', function () {
    var sut = middleware({ root: testDirectory });
    beforeEach(function (done) {
      req.url = '/failing.css';
      sut(req, res, next).then(done, done);
    });
    it('should send an error message', function () {
      expect(res.end).toHaveBeenCalledWith(jasmine.stringMatching(/Error: Unrecognised input/));
    });
  });

});
