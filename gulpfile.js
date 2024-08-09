const gulp = require('gulp');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const terser = require('gulp-terser');
const htmlmin = require('gulp-htmlmin');

// Task to process CSS files
gulp.task('css', function () {
	return gulp
		.src('src/css/*.css')
		.pipe(concat('style.css'))
		.pipe(cssnano()) // Minify the CSS
		.pipe(gulp.dest('public/css'));
});

// Task to process JS files
gulp.task('js', function () {
	return gulp
		.src('src/js/*.js')
		.pipe(concat('app.js'))
		.pipe(terser()) // Minify the JS
		.pipe(gulp.dest('public/js'));
});

// Task to process HTML files
gulp.task('html', function () {
	return gulp
		.src('src/index.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('public'));
});

// Build task that runs all tasks in series
gulp.task('build', gulp.series('html', 'css', 'js'));
