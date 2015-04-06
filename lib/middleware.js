'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var less = require('less');
var cssesc = require('cssesc');

module.exports = function (options) {
  options = options || {};
  var root = path.resolve(options.root || '.');
  var plugins = options.plugins || [];
  var sourceMap = options.sourceMap;
  return function (req, res, next) {
    var requestedPath = url.parse(req.url).pathname;
    if (requestedPath.match(/\.css$/)) {
      var cssFile = path.resolve(path.join(root, requestedPath));
      var lessFile = path.resolve(path.join(root, switchExtension(requestedPath, '.less')));
      if (!fs.existsSync(cssFile) && fs.existsSync(lessFile)) {
        var content = fs.readFileSync(lessFile, 'utf-8');
        var lessOptions = {
          filename: lessFile,
          plugins: plugins
        };
        if (sourceMap) {
          lessOptions.sourceMap = {
            sourceMapFileInline: true,
            sourceMapBasepath: path.dirname(lessFile)
          };
        }
        return less.render(content, lessOptions)
          .then(function (output) {
            return (typeof output.css === 'string') ? output.css : output;
          })
          .catch(function (error) {
            return createCssErrorMessage(error);
          })
          .then(function (css) {
            res.setHeader('Content-Type', 'text/css');
            res.end(css);
          });
      }
    }
    next();
  };
};

function switchExtension(filePath, newExtension) {
  var oldExtension = path.extname(filePath);
  return filePath.substr(0, filePath.length - oldExtension.length) + newExtension;
}

function createCssErrorMessage(error) {
  var rules = {
    'display': 'block',
    'z-index': '1000',
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'right': '0',
    'font-size': '.9em',
    'padding': '1.5em 1em 1.5em 4.5em',
    'color': 'white',
    'background': 'linear-gradient(#DF4F5E, #CE3741)',
    'border': '1px solid #C64F4B',
    'box-shadow': 'inset 0 1px 0 #EB8A93, 0 0 .3em rgba(0, 0, 0, .5)',
    'white-space': 'pre',
    'font-family': 'monospace',
    'text-shadow': '0 1px #A82734',
    'content': '"' + cssesc('' + error, { quotes: 'double' }) + '"'
  };
  var combinedRules = Object.keys(rules).map(function (key) {
    return key + ':' + rules[key];
  });
  return 'html::before{' + combinedRules.join(';') + '}';
}
