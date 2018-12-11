/*
 * This is the gulpfile - used for ESLINT style checking.
 *
 * Author: Rahul Kooverjee for his CIS 197 Final Project Fall 2018
 *
 */

// Imports
var gulp = require('gulp');
var eslint = require('gulp-eslint');

// List of files to stylecheck on
var FILES = [
  'server.js',
  'gulpfile.js',
  'middlewares/*.js',
  'models/*.js',
  'routes/*.js',
  'static/scripts/*.js'
];

// Run eslint when 'gulp eslint' is entered
gulp.task('eslint', function () {
  return gulp.src(FILES)
    .pipe(eslint())
    .pipe(eslint.format());
});
