var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jade         = require('gulp-jade');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};



/**
 * Build the Jekyll Site and will
  notify thr browserSync that is
 done.
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});



/**
 * Rebuild Jekyll & do page reload
 This happens if you rebulit the site
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */


gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
Turns all your scss to css
 */


gulp.task('sass', function () {
    return gulp.src('assets/css/main.scss')/* converts scss to css */
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css')) /*stick version to site and locally to css as jeckyl is slower than gulp for speed*/
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'))
});

/* begin jade task */
gulp.task('jade',function(){
  return gulp.src('_jadefiles/*.jade')/* return jade files */
  .pipe(jade())/* send them to html files */
  .pipe(gulp.dest('_includes'));/* put them in desanations of includes*/
});
/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('assets/css/**', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*'], ['jekyll-rebuild']);
    gulp.watch(['_jadefiles/*.jade'], ['jade']);
});


/**/

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
