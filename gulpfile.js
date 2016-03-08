var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');

gulp.task('sass_main', function() {
    gulp.src('./src/css/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});

gulp.task('sass_tile', function() {
    gulp.src('./src/css/tile.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});

gulp.task('jsx', () => {
		var bundler = browserify('./src/jsx/App.jsx', {
				debug: true,
				paths: ['./src/jsx'],
				cache: {},
				packageCache: {},
				fullPaths: true
		}).transform(babelify, {
				presets: ["es2015", "react"],
				ignore: /(bower_components)|(node_modules)/
		});

		function rebundle() {
				gutil.log('jsx starting.');
				bundler
						.bundle()
						.on('error', err => { gutil.log(err.message); })
						.pipe(source('bundle.js'))
						.pipe(gulp.dest('./dist'))
						.pipe(livereload())
						.on('end', () => { gutil.log('jsx completed.'); });
		}

		bundler = watchify(bundler);
		rebundle();
		bundler.on('update', rebundle);
});

gulp.task('static', () => {
		gulp.src(['./src/index.html', './src/*.*'])
				.pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
		watch(['./src/index.html', './src/*.*'], () => { gulp.start('static'); });
});

gulp.task('default', ['watch', 'jsx', 'static', 'sass_main', 'sass_tile']);
