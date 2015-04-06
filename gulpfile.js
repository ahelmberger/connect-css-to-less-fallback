'use strict';

var gulp         = require('gulp');
var runSequence  = require('run-sequence');
var $            = require('gulp-load-plugins')();
var SpecReporter = require('jasmine-spec-reporter');
var exitOnError  = true;

gulp.task('lint', function () {
  return gulp.src('lib/*.js')
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(exitOnError, $.eslint.failAfterError()));
});

gulp.task('test', function () {
  return gulp.src('lib/*.specs.js')
    .pipe($.jasmine({ reporter: new SpecReporter() }));
});

gulp.task('lint-and-test', function (done) {
  runSequence('lint', 'test', done);
});

gulp.task('watch', function () {
  exitOnError = false;
  gulp.watch('lib/*.js', ['lint-and-test'])
});

gulp.task('default', ['watch']);
