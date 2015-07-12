'use strict'

var gulp = require('gulp')
var gutil = require('gulp-util')
var del = require('del')
var minifyCss = require('gulp-minify-css')
var concatCss = require('gulp-concat-css')
var sass = require('gulp-sass')
var inject = require('gulp-inject')
var mainBowerFiles = require('main-bower-files')
var args = require('yargs').argv
var autoprefixer = require('gulp-autoprefixer')
var runSequence = require('run-sequence')
var path = require('path')

var envType = process.env.NODE_ENV || args.NODE_ENV || args.env || 'development'
var isDev = envType === 'development'

gulp.task('clean', function (done) {
  del(['build'], done)
})

gulp.task('styles-lib', function () {
  return gulp.src(mainBowerFiles({ filter: '**/*.css' }))
    .pipe(isDev ? gutil.noop() : concatCss('lib.css', { rebaseUrls: false }))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(autoprefixer())
    .pipe(gulp.dest('build/styles/lib'))
})

gulp.task('styles-app', function () {
  return gulp.src(['src/styles/**/*.scss'])
    .pipe(sass())
    .pipe(isDev ? gutil.noop() : concatCss('app.css', { rebaseUrls: false }))
    .pipe(isDev ? gutil.noop() : minifyCss())
    .pipe(autoprefixer())
    .pipe(gulp.dest('build/styles/app'))
})

gulp.task('inject', ['styles-lib', 'styles-app'], function () {
  var cwd = path.resolve(__dirname, './build')
  var stylesLib = gulp.src(['styles/lib/**/*.css'], { cwd: cwd })
  var stylesApp = gulp.src(['styles/app/**/*.css'], { cwd: cwd })

  return gulp.src(['src/index.html'], {base: 'src'})
    .pipe(inject(stylesLib, {name: 'lib'}))
    .pipe(inject(stylesApp, {name: 'app'}))
    .pipe(gulp.dest('build'))
})

gulp.task('build', function (done) {
  runSequence('clean', 'inject', done)
})
gulp.task('default', ['build'])
