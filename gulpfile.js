const gulp = require('gulp');
const typescript = require('gulp-typescript');
const babel = require('gulp-babel');
const rename = require('gulp-rename');

gulp.task('build', ['lib', 'dist']);

gulp.task('lib', function() {
    return gulp.src('./src/*.ts')
        .pipe( typescript() )
        .pipe( gulp.dest('./lib') );
});

gulp.task('dist', function() {
    return gulp.src('./src/jur.ts')
        .pipe(typescript({
            module: 'None'
        }))
        .pipe(babel({
            presets: ['env'],
			comments: false,
			compact: true,
			minified: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe( gulp.dest('./dist') );
});