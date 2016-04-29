'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass');

var PATHS = {
    sass: {
        src: 'sass',
        dest: 'css'
    }
}

// Compile scss to public/css.
gulp.task('sass', function () {
    return gulp.src(PATHS.sass.src + '/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(PATHS.sass.dest));
});

// Listen/Watch for changes for on the fly compiling.
gulp.task('sass:watch', function () {
    return gulp.watch(PATHS.sass.src + '/**/*.scss', ['sass']);
});

gulp.task("build", ['sass']);
gulp.task("default", ['sass:watch']); // Compile on the fly by default.
