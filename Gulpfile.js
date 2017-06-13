'use strict';
const { gulpSassError } = require('gulp-sass-error');
var
    gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    pixrem       = require('gulp-pixrem'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    browserSync  = require('browser-sync'),
    del          = require('del'),
    reload       = browserSync.reload,
    throwError = true;

var PATHS = {
    sass: {
        src: 'sass',
        dest: 'css'
    }
}

gulp.task('browser-sync', function() {
    browserSync.init(['_site/**/*'], {
        server: {
            baseDir: './_site'
        }
    });
});

// Compile scss to public/css.
gulp.task('sass', function () {
    return gulp.src(PATHS.sass.src + '/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', gulpSassError(throwError)))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(pixrem())
        .pipe(gulp.dest(PATHS.sass.dest));
});

// Listen/Watch for changes for on the fly compiling.
gulp.task('watch', function () {
    gulp.watch(PATHS.sass.src + '/**/*.scss', ['sass']);
});

gulp.task("build", ['sass']);
gulp.task("default", ['watch']); // Compile on the fly by default.
