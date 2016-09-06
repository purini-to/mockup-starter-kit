var gulp = require('gulp');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var extender = require('gulp-html-extend');
var watch = require('gulp-watch');
var htmlhint = require("gulp-htmlhint");
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var browserSync = require('browser-sync');
var filter = require('gulp-filter');

var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');

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
    .pipe(htmlhint())
    .pipe(htmlhint.reporter('htmlhint-stylish'))
    .pipe(htmlhint.failReporter({ supress: true }))
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
    watch(['./src/assets/**/*'], (e) => {
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
  const filterJs = filter(['**/*.js'], { restore: true });
  const filterCss = filter(['**/*.css'], { restore: true });

  return gulp.src(
    ['src/assets/**/*'],
    { base: 'src' }
  ).pipe(plumber({
    errorHandler: notify.onError('<%= error.message %>')
  }))
    .pipe(filterJs)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(filterJs.restore)
    .pipe(filterCss)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csscomb())
    .pipe(csslint('csslintrc.json'))
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'))
    .pipe(filterCss.restore)
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('default', ['build', 'copy', 'browser-sync', 'watch']);