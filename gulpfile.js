'use strict';

var	gulp				= require('gulp'),
	connect				= require('gulp-connect'),
	historyApiFallback	= require('connect-history-api-fallback'),
	stylus				= require('gulp-stylus'),
	nib					= require('nib'),

	useref				= require('gulp-useref'),
	gulpif				= require('gulp-if'),
	uglify				= require('gulp-uglify'),
	minifyCss			= require('gulp-minify-css');

var PORT_DEV	= 7000,
	PORT_PROD	= PORT_DEV + 1,
	ASSETS_DIR	= './assets';

// Create a server in port 8080
gulp.task('server', function() {
	connect.server({
		port: PORT_DEV,
		hostname: '0.0.0.0',
		livereload: true,
		middleware: function(connect, opt) {
			return [ historyApiFallback ];
		}
	});
});

/*
 * Assets processing and livereload enabling
 * [css] : compile stylus files into css
 * [html]: reload page
*/

// Process CSS files and reload the web browser
gulp.task('css', function() {
	gulp.src( ASSETS_DIR + '/css/main.styl')
		.pipe(stylus({
			use: nib()
		}))
		.pipe(gulp.dest( ASSETS_DIR + '/css/'))
		.pipe(connect.reload());
});
// Reload the web browser when a HTML file changes
gulp.task('html', function() {
	gulp.src( 'index.html' )
		.pipe(connect.reload());
});

// Watch file changes
gulp.task('watch', function() {
	gulp.watch([ASSETS_DIR + '/css/*.styl'], ['css']);
	gulp.watch(['index.html'], ['html']);
});


/*
 * Build tasks for production
*/

gulp.task('copy-static', function() {
	gulp.src('index.html')
		.pipe(useref())
		.pipe(gulp.dest('./dist'));
	
	gulp.src( ASSETS_DIR + '/imgs/**')
		.pipe(gulp.dest('./dist/imgs'));
});

gulp.task('compress-assets', function() {
	gulp.src('index.html')
		.pipe(useref.assets())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('./dist'));
});

gulp.task('serve-dist', function() {
	connect.server({
		root: './dist',
		port: PORT_PROD,
		middleware: function(connect, opt) {
			return [ historyApiFallback ];
		}
	});
});

gulp.task('build', ['css', 'compress-assets', 'copy-static']);

gulp.task('default', ['server', 'css', 'watch']);