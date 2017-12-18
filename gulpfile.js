var gulp   = require('gulp');
var eslint = require('gulp-eslint');

var sources = ['./*.js'];

gulp.task('lint', function(){
  return gulp.src(sources)
    .pipe(eslint('eslint.json'))
    .pipe(eslint.format());
});

function printError(){
    console.log(arguments); // eslint-disable-line no-console
}

gulp.task('default', ['lint'], function(){
    gulp.watch(sources, ['lint']).on('error', printError);
});

