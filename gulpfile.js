var gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglifyjs'),
	cssnano       = require('gulp-cssnano'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	imagemin      = require('gulp-imagemin'),
	del           = require('del');


gulp.task('mytask', function() {
	console.log('Привет , я таск!');
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('compress', function() {
  gulp.src('app/img/*')
  .pipe(imagemin({ // Сжимаем их с наилучшими настройками
         interlaced: true,
         progressive: true,
         svgoPlugins: [{removeViewBox: false}]
        }))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('sass', function(){
	return gulp.src('app/sass/*.sass')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function(){
	browserSync({
		server: {baseDir: 'app'},
		notify:false
	});
});

gulp.task('scripts', function(){
	return gulp.src(['app/libs/jquery/dist/jquery.min.js',
					'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
});

 gulp.task('css-libs',['sass'], function(){
 	return gulp.src('app/css/libs.css')
 		.pipe(cssnano())
 		.pipe(rename({suffix: ".min"}))
 		.pipe(gulp.dest('app/css'));
  });

gulp.task('build', ['clean', 'css-libs', 'scripts', 'compress'], function(){
	var buildCss = gulp.src(['app/css/main.css', 'app/css/libs.min.css'])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('watch',['browserSync', 'css-libs', 'scripts'], function(){
	gulp.watch('app/sass/main.sass', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});
