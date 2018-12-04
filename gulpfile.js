var gulp = require('gulp');
var eslint = require('gulp-eslint');

// TODO ADD FILES 
var FILES = [
  'map-builder.js',
  'player.js'
];

gulp.task('eslint', function () {
  return gulp.src(FILES)
    .pipe(eslint())
    .pipe(eslint.format());
});
