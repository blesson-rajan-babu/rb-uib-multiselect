var gulp = require('gulp')
var pump = require('pump')
var eslint = require('gulp-eslint')
var header = require('gulp-header')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var watch = require('gulp-watch')

gulp.task('lint', function () {
  return gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
})

gulp.task('build', function () {

  var pkg = require('./package.json')
  var banner = [
    '/*!',
    ' * <%= pkg.name %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n')

  pump([
    gulp.src('src/*.js'),
    header(banner, { pkg: pkg }),
    gulp.dest('dist')
  ])

  pump([
    gulp.src('src/*.js'),
    uglify(),
    header(banner, { pkg: pkg }),
    rename({ suffix: '.min' }),
    gulp.dest('dist')
  ])
})

gulp.task('watch', function () {
  return watch('src/*.js')
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['lint', 'build'])
