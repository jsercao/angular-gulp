/*
 * angular 1.X、gulp: The front-end automation
 * @Author: jsercao 
 * @Version:1.0.1
 * @Date: 2016-12-21 15:41:34 
 * @Last Modified by: jsercao
 * @Last Modified time: 2017-08-24 14:15:34
 */

const pkg = require('./package.json'),
    browserSync = require('browser-sync').create(),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    mainBowerFiles = require('main-bower-files'),
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    del = require('del'),
    runSequence = require('run-sequence'),
    replace = require('gulp-replace'),
    templateCache = require('gulp-angular-templatecache'),
    zip = require('gulp-zip'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    minifyCss = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin');



const alert = (msg) => {
    msg = typeof msg !== 'string' ? String(msg) : msg;
    process.stdout.write(msg + '\n')
};

const clc = (colorId, text) => `\x1b[${colorId}m${text}\x1b[0m`;


gulp.paths = {
    dist: 'dist',
    release: 'release'
};

const paths = gulp.paths;


/***************************************
 * 启动服务并且监控 html、js、scss变化
 ***************************************/
gulp.task('serve', ['sass'], () => {

    browserSync.init({
        server: "./"
    });

    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('./index.html').on('change', browserSync.reload);
    gulp.watch('css/**/*.css').on('change', browserSync.reload);
    gulp.watch('views/**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});


/***************************************
 * sass 编译
 ***************************************/
gulp.task('sass', () => {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});


gulp.task('sass:watch', () => {
    gulp.watch('./scss/**/*.scss');
});


/***************************************
 * 清空编译文件夹
 ***************************************/

gulp.task('clean:dist', () => {
    return del(paths.dist);
});


/***************************************
 * 拷贝文件
 ***************************************/
gulp.task('copy:bower', () => {
    return gulp.src(mainBowerFiles(['**/*.js', '!**/*.min.js']))
        // .pipe(gulp.dest(paths.dist + '/js/libs'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dist + '/js/libs'));
});

// 拷贝style样式
gulp.task('copy:css', () => {
    return gulp.src('./css/**/*')
        // .pipe(autoprefix({
        //     browsers: ['last 4 versions'],
        //     cascade: true, //美化
        //     remove: true //去掉不必要前缀
        // }))
        .pipe(minifyCss({
            debug: true
        }, function (details) {
            console.log(details.name + ': ' + 'originalSize < ' + details.stats.originalSize + ' >,minifiedSize < ' + details.stats.minifiedSize + ' >');
        }))
        .pipe(gulp.dest(paths.dist + '/css'));
});

// 拷贝图片文件
gulp.task('copy:img', () => {
    return gulp.src('./img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 5, //取值范围：0-7（优化等级）
            progressive: true, // 无损压缩jpg图片
            interlaced: true, //隔行扫描gif进行渲染
            multipass: true, //多次优化svg直到完全优化
            svgoPlugins: [{
                removeViewBox: false
            }], //不是否移除svg的viewbox属性
            use: [pngquant()] //深度压缩png图片
        })))
        .pipe(gulp.dest(paths.dist + '/img'));
});

// 拷贝字体文件
gulp.task('copy:fonts', () => {
    return gulp.src('./fonts/**/*')
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

// 拷贝一些公用service、directives、controllers、routers
gulp.task('copy:js', () => {
    return gulp.src('./js/**/*')
        .pipe(stripDebug()) //去除debug信息
        .pipe(uglify({
            mangle: true, //是否修改变量名
            compress: true, //是否完全压缩
            preserveComments: 'license' //注释保留方式
        }))
        .pipe(gulp.dest(paths.dist + '/js'));
});

// 如果不使用懒加载时，可以使用concat合并为一个文件
gulp.task('js:Concat', () => {
    return gulp.src('./js/**/*')
        .pipe(stripDebug()) //去除debug信息
        .pipe(uglify({
            mangle: true, //是否修改变量名
            compress: true, //是否完全压缩
            preserveComments: 'license' //注释保留方式
        }))
        .pipe(concat('all.js')) //合并后的文件名
        .pipe(gulp.dest(paths.dist + '/js'));
});

// 拷贝视图模板
gulp.task('copy:views', () => {
    return gulp.src('./views/**/*')
        .pipe(gulp.dest(paths.dist + '/views'));
});

// 拷贝控制器
gulp.task('copy:controllers', () => {
    return gulp.src('./views/**/*.js')
        .pipe(stripDebug()) //去除debug信息
        .pipe(uglify({
            mangle: true, //是否修改变量名
            compress: true, //是否完全压缩
            preserveComments: 'license' //注释保留方式
        }))
        .pipe(gulp.dest(paths.dist + '/views'));
});

// 拷贝index.html
gulp.task('copy:html', () => {
    return gulp.src('index.html')
        .pipe(gulp.dest(paths.dist + '/'));
});

/***************************************
 * 替换bower文件
 ***************************************/
gulp.task('replace:bower', () => {
    return gulp.src([
            './dist/**/*.html',
            './dist/**/*.js',
        ], {
            base: './'
        })
        .pipe(replace(/bower_components+.+(\/[a-z0-9][^/]*\.[a-z0-9]+(\'|\"))/ig, 'js/libs$1'))
        .pipe(gulp.dest('./'));
});


/***************************************
 * 合并模板文件
 ***************************************/
gulp.task('contact:templates', () => {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true //压缩HTML
    };
    return gulp
        .src('./views/**/*.html')
        .pipe(htmlmin(options))
        .pipe(templateCache({
            module: 'app',
            root: 'views',
            filename: 'app.templates.js'
        }))
        .pipe(gulp.dest(paths.dist + '/js/'));
});


/***************************************
 * 替换index.html模板js
 ***************************************/
gulp.task('replace:templates', () => {
    const replaceApp = [
        '<!-- app.templates.js -->',
        '<script src="app/app.templates.js"></script>'
    ];
    return gulp.src('./dist/index.html')
        .pipe(replace('<!-- app.templates.js -->', '<script src="js/app.templates.js"></script>'))
        .pipe(gulp.dest(paths.dist + '/'));
});


/***************************************
 * 压缩index.html
 ***************************************/
gulp.task('Htmlmin', () => {
    const options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        // collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        //  removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src('./dist/index.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(paths.dist + '/'));
});



/***************************************
 * 打包编译完成的项目
 * 项目名YYYYMMDDHHMM.zip
 ***************************************/

const checkTime = (i) => {
    return i < 10 ? '0' + i : i;
};

const getTime = () => {
    const d = new Date();
    return d.getFullYear() + checkTime(d.getMonth() + 1) + checkTime(d.getDate()) + checkTime(d.getHours()) + checkTime(d.getMinutes());
};


gulp.task('zip', () => {
    return gulp.src('./dist/**/*.*')
        .pipe(zip(pkg.name + '-' + getTime() + '.zip'))
        .pipe(gulp.dest(paths.release));
});



/***************************************
 * 编译项目
 ***************************************/

gulp.task('build', function (callback) {
    runSequence(
        'clean:dist',
        'copy:bower',
        'copy:css',
        'copy:img',
        'copy:fonts',
        'copy:js',
        'copy:controllers',
        'copy:html',
        'replace:bower',
        'contact:templates',
        'replace:templates',
        'Htmlmin', callback);
});

gulp.task('default', ['serve']);