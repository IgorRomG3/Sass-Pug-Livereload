var gulp = require('gulp'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  spritesmith = require('gulp.spritesmith'),
  pug = require('gulp-pug'),
  data = require('gulp-data'),
  fs = require('fs'),
  notify = require("gulp-notify"),
  plumber = require('gulp-plumber');
//	cleanCSS = require('gulp-clean-css'),

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
    .pipe(plumber({
        errorHandler: notify.onError(function(err) {
            return {
                title: 'SASS',
                message: err.message
            };
        })
    }))
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'))
    .pipe(connect.reload());
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('src/img/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('src/img/sprite/'));
});

gulp.task('pug', function() {
  return gulp.src('src/templates/*.pug')
       .pipe(plumber({
           errorHandler: notify.onError(function(err) {
               return {
                   title: 'Pug',
                   message: err.message
               };
           })
       }))
      .pipe(data(function(file) {
            return JSON.parse(fs.readFileSync('src/templates/data/data.json'));
        }))
      .pipe(pug({
        "pretty":true /* for desable html minify*/
      }))
      .pipe(gulp.dest('dist/'))
      .pipe(connect.reload());
});

gulp.task('move', function () {
	gulp.src('src/img/**/*.*')
	.pipe(gulp.dest('dist/img/'))
	.pipe(connect.reload());

});

gulp.task('movejs', function () {
	gulp.src('src/js/*.js')
	.pipe(gulp.dest('dist/js/'))
	.pipe(connect.reload());

});

//gulp.task('minify-css', function() {
//  return gulp.src('dist/css/*.css')
//    .pipe(cleanCSS({compatibility: 'ie8'}))
//    .pipe(gulp.dest('dist/css/*.css'));
//});

gulp.task('default', function () {
  gulp.start('connect','sass','pug','move','movejs'),
	gulp.watch(['src/sass/**/*.sass'], ['sass']),
	gulp.watch(['src/*.html'], ['pug']),
  gulp.watch(['src/templates/**/*.pug'], ['pug']),
  gulp.watch(['src/templates/data/*.json'], ['pug']),
	gulp.watch(['src/img/**/*.*'], ['move']),
  gulp.watch(['src/js/**/*.js'], ['movejs']);
});
