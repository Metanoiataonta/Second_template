var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    svgSprite = require('gulp-svg-sprite'),
    plumber = require('gulp-plumber'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');

gulp.task('sass', function() {
    return gulp.src('css/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(browserSync.reload({ stream: true }))
        .pipe(gulp.dest('dist'))
});

// gulp.task('svg', function() {
//     return gulp.src('img/*.svg')
//         .pipe(plumber())
//         .pipe(svgSprite({
//             mode: {
//                 symbol: {
//                     sprite: "sprite.svg",
//                     render: {
//                         scss: {
//                             dest: "sass/_sprite.scss",
//                             template: "../../css/template.scss"
//                         }
//                     }
//                 }
//             }
//         }))
//         .on('error', function(error) {
//             /* Do some awesome error handling ... */
//         })
//         .pipe(gulp.dest('dist'));
// });
assetsDir = "./";
gulp.task('svgSpriteBuild', function() {
    return gulp.src(assetsDir + 'img/*.svg')
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest: '../sass/_sprite.scss',
                            template: assetsDir + "js/template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(assetsDir + 'dist/'));
});
gulp.task('watch', function() {
    gulp.watch('css/**/*.scss', gulp.parallel('sass'));
    gulp.watch('index.html', gulp.parallel('html'));
});
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        notify: false,
        startPath: "index.html"
    });
});

gulp.task('clean', async function() {
    return del.sync('dist')
});

gulp.task('prebuild', async function() {
    var buildCss = gulp.src(['dist/style.css'])
        .pipe(gulp.dest('dist'))
});


gulp.task('default', gulp.parallel('svgSpriteBuild', 'sass', 'html', 'browser-sync', 'watch'));

gulp.task('build', gulp.parallel('prebuild', 'clean', 'sass'));