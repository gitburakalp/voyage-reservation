const gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create(),
  size = require('gulp-size'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  browserslist = require('browserslist'),
  postcss = require('gulp-postcss');

var roots = {
    src: './src/',
    source: '../sources/',
  },
  sassOptions = {
    outputStyle: 'compressed',
  };

var functionsBrowserSync = function (done) {
  browserSync.init({
    server: {
      baseDir: roots.src,
    },
    online: true,
  });

  done();
};

var functionsSass = function () {
  return gulp
    .src(roots.src + 'scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass(sassOptions))
    .pipe(
      size({
        gzip: true,
        showFiles: true,
      }),
    )
    .pipe(postcss([autoprefixer({ grid: 'autoplace' })]))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(sourcemaps.write(roots.source))
    .pipe(gulp.dest(roots.src + 'css'))
    .pipe(browserSync.stream());
};

var functionsHtml = function () {
  return gulp.src(roots.src + '**/*.html').pipe(browserSync.stream());
};

var functionsWatch = function () {
  gulp.watch(roots.src + 'scss/**/*.scss', gulp.series('sass'));
  gulp.watch(roots.src + 'js/*.js', gulp.series('html'));
  gulp.watch(roots.src + '**/*.html', gulp.series('html'));
};

gulp.task('browser-sync', functionsBrowserSync);
gulp.task('html', functionsHtml);
gulp.task('sass', functionsSass);
gulp.task('watch', functionsWatch);
gulp.task('default', gulp.series('browser-sync', 'html', 'sass', 'watch'));
