const fs = require('fs');
const path = require('path');
const { series, parallel, src, dest, watch } = require('gulp');
const plugins		= require('gulp-load-plugins')();
const browsersync	= require('browser-sync').create();
const webpack		= require('webpack');
const webpackStream	= require('webpack-stream');
const webpackConfig	= require('./webpack.config.js');

/**
 * Configuration
 */

const watchPaths = {
	scss: 'css/**/*.scss',
	html: '**.html',
	js: ['./js/**/*.js', '!./js/**/*.min.js','!./js/**/*.min.js.map'],
};

const srcFiles = {
	scss: 'css/scss/style.scss',
	js: 'js/index.js'
};

function loadBrowserSyncConfig() {
	try {
		return JSON.parse(fs.readFileSync('bs_config.json'));
	} catch (e) {
		return false;
	}
}

/**
 * Build Tasks
 */
/**
 * Build Tasks
 */
function buildSCSSwithInput(srcFile, destPath = 'css') {
	const basename = path.basename(srcFile, '.scss');

	return src(srcFile)
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				plugins.notify.onError({
					title: 'SCSS Build Error',
					message: err.message
				})(err);
			}
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass())
		.on('error', plugins.sass.logError)
		.pipe(plugins.autoprefixer())
		.pipe(plugins.cleanCss({
			keepSpecialComments: 0
		}))
		.pipe(plugins.rename(`${basename}.min.css`))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(dest(destPath))
		.pipe(browsersync.stream())
		.on('error', plugins.notify.onError({
			message: '<%= error.message %>',
			title: 'SCSS Error'
		}));
}

function buildSCSS() {
	return buildSCSSwithInput(srcFiles.scss);
}

function buildJS() {
	return src(srcFiles.js)
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				plugins.notify.onError({
					title: 'JS Build Error',
					message: err.message
				})(err);
			}
		}))
		.pipe(plugins.notify({
			message: 'Starting JS build',
			title: 'JS Build'
		}))
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(dest('js'));
}

/**
 * Watch Tasks
 */
function watchSourceSCSS(cb) {
	watch(watchPaths.scss, buildSCSS);
	cb();
}

function watchSourceJS(cb) {
	watch(watchPaths.js, buildJS);
	cb();
}

/**
 * BrowserSync
 */
function startBrowserSync() {
	const bsConfig = loadBrowserSyncConfig();

	if (!bsConfig) {
		cb(new Error('Unable to load "bs_config.json" -- please make sure this file is present.'));
		return;
	}

	browsersync.init(bsConfig.browserSync);

	watch([watchPaths.scss, watchPaths.html].concat(watchPaths.js), (cb) => {
		browsersync.reload();
		cb();
	});

}

/**
 * Exports
 */
exports.build_scss = buildSCSS;
exports.build_js = buildJS;
exports.build = parallel(buildSCSS, buildJS);

exports.watch_scss = series(parallel(buildSCSS, watchSourceSCSS));
exports.watch_js = series(buildJS, watchSourceJS);
exports.watch = series(parallel(buildSCSS, buildJS), watchSourceSCSS, watchSourceJS);

exports.browsersync = startBrowserSync;

exports.default = series(parallel(buildSCSS, buildJS), watchSourceSCSS, watchSourceJS, startBrowserSync);