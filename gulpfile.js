var gulp   = require('gulp')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename')
  , jshint = require('gulp-jshint')
  , jscs   = require('gulp-jscs')
  , mocha  = require('gulp-mocha')
  , stylish = require('jshint-stylish');

/**
 * LINT
 * Ensures that the library code obeys hinting and
 * style guide rules.
 */
gulp.task('lint', function () {
  return gulp.src(['./portals.js', './test/**/*.js'])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/**
 * TEST
 * Run tests on file change.
 */
gulp.task('test', function () {
  return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({
      timeout: 5000
    }));
});

/**
 * BUILD
 * Minifies the portals.js file.
 */
gulp.task('build', function () {
  return gulp.src('./portals.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./'));
});

/**
 * WATCH
 * Watches for file changes.
 */
gulp.task('watch', ['build'], function () {
  gulp.watch(['./portals.js', './test/**/*.js'], ['lint']);
  gulp.watch('./portals.js', ['compile']);
});

/**
 * CI
 * Run steps for Travis CI to test and approve.
 */
gulp.task('ci', ['test']);

/**
 * DEFAULT
 */
gulp.task('default', ['watch']);
