var gulp = require('gulp');

var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var templateCache = require('gulp-angular-templatecache');

var del = require('del');

var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');

var deploy = require("gulp-gh-pages");

var paths = {
    scripts: ['app/scripts/**/*.js', 'vendor/**/*.js'],
    images: 'app/img/**/*',
    styles: ['app/styles/**/*.css', 'vendor/**/*.css']
};

gulp.task('ngtemplate', function() {
    gulp.src('app/templates/**/*.html')
        .pipe(templateCache({
            module: 'ionicApp',
            root: 'templates'
        }))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('movestatic', function() {
    gulp.src([
        'app/fonts/**/*'
    ]).pipe(gulp.dest('dist/fonts'));

    gulp.src('app/logo.png').pipe(gulp.dest('dist'));
});

gulp.task('usemin', ['ngtemplate'], function() {
    gulp.src('app/index.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({
                empty: true
            })],
            js: [ngAnnotate(), uglify()]
        }))
        .pipe(gulp.dest('dist/'));
});
// sourcemaps.init(),sourcemaps.write()

gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['dist'], cb);
});

gulp.task('images', function() {
    return gulp.src(paths.images)
    .pipe(imagemin({
        optimizationLevel: 5
    }))
    .pipe(gulp.dest('dist/img'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('build', ['clean', 'usemin', 'images', 'movestatic']);

gulp.task('deploy', ['build'], function() {
    gulp.src("./dist/**/*")
        .pipe(deploy());
});

gulp.task('default', ['build']);