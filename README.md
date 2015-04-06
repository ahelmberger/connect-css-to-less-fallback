# connect-css-to-less-fallback

Connect middleware providing a fallback for missing CSS files to corresponding LESS files

__PLEASE NOTE: You should use this only during development. For production LESS should be precompiled.__

## How it works

This middleware checks for each request:

1. Determines if requested file is a CSS file.
2. If yes, looks for the requested CSS file.
3. If not found, looks for a LESS file with the same name.
4. If found, compiles the LESS file and delivers it, ending the request.

In all other cases, it just calls `next()` and finishes processing.

## Usage

Use [NPM](http://npmjs.org) to install `connect-css-to-less-fallback`:

    npm install connect-css-to-less-fallback --save

Then load it in your app:

    var express = require('express');
    var cssToLessFallback = require('connect-css-to-less-fallback');
    var app = express();

    // just use it with the default options
    app.use(cssToLessFallback());

## What options are available?

You can provide an options object to the `cssToLessFallback` function:

    app.use(cssToLessFallback({
      // the website root folder (default: '.')
      root: './public',
      // any less plugin you want to use (default: [])
      plugins: [autoPrefix],
      // if set to true true, it embeds sourcemaps (default: false)
      sourceMap: true
    }));

## Changelog

__0.0.1__ Initial version

---
Licensed under the MIT license
