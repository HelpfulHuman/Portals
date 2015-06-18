var gulp   = require('gulp')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename');

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
  gulp.watch('./portals.js', ['compile']);
});

/**
 * DEFAULT
 */
gulp.task('default', ['watch']);
