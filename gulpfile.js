var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var pump = require('pump');
var babel = require('gulp-babel');

gulp.task('js', function(){
  return gulp.src(['index.js', 'src/**/*.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public'))
});

gulp.task('watch', function() {
    gulp.watch('index.js', ['js']);
    gulp.watch('src/**/*.js', ['js']);
})

gulp.task('default', [ 'js', 'watch']);
