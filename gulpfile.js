const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function images() {
	return src('app/img/src/*.*')
		.pipe(dest('app/img'))
}
function scripts() {
	return src('app/js/main.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}
function styles() {
  return src('app/scss/style.sass')
		.pipe(autoprefixer({overrideBrowserlist: ['last 10 version']}))
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('style.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function watching() {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
	watch(['app/scss/style.sass'], styles)
	watch(['app/js/main.js'], scripts)
	watch(['app/img/src'], images)
	watch(['app/*.html']).on('change', browserSync.reload)
}
function cleanDist() {
	return src('dist')
		.pipe(clean())
}
function building() {
	return src([
		'app/css/style.min.css',
		'app/js/main.min.js',
		'app/img/*.*',
		'app/**/*.html',
	], {base : 'app'})
		.pipe(dest('dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watching = watching;
exports.building = building;

exports.build = series(cleanDist, building);


exports.default = parallel(styles, scripts, images, watching);