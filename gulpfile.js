var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var extender = require('gulp-html-extend');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('build', () => {
  return gulp.src(['./src/pages/**/*.html'])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(extender({
      annotations: false,
      verbose: false,
      root: './src'
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({
      stream: true
    }));;
});

gulp.task('watch', () => {
  return [
    watch(['./src/**/*.html'], (e) => {
      return gulp.start(['build']);
    }),
    watch(['./src/assets/**/*'], () => {
      return gulp.start(['copy']);
    }),
  ];
});

gulp.task('browser-sync', () => {
  return browserSync.init(null, {
    server: './dist',
    reloadDelay: 1000
  });
});

gulp.task('copy', function () {
  return gulp.src(
    ['src/assets/**/*'],
    { base: 'src' }
  ).pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  })).pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));;
});

gulp.task('default', ['build', 'copy', 'browser-sync', 'watch']);