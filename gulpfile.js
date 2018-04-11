/**
 * @描述: gulpfile
 * @作者: chenjiujiu
 * @创建日期: 2018/3/19
 */

/*==工具引入==*/
var gulp = require('gulp'); //gulp
var browserSync = require('browser-sync').create(); //浏览器刷新
var reload= browserSync.reload;
var scss = require('gulp-scss');	//scss编译
var runSequence = require('run-sequence'); //异步执行代码
/*==文件路径定义==*/
var config = {
	//开发文件
	html:	'./dev/**/*.html',	//html
	css:	'./dev/css/**/*.css',	//css
	scssall:	'./dev/scss/**/*.scss',	//scssall
	scss:	['./dev/scss/**/*.scss', '!./dev/scss/**/_*.scss'],
	scssc:	'./dev/css'
};
/*==编译scss到src/css==*/
gulp.task('scssc',function(){
	return gulp.src(config.scss)	//查找
		.pipe(scss())	//编译
		.pipe(gulp.dest(config.scssc))	//输出
		.pipe(reload({stream:true}))	//重新加载
});

/*==同步刷新==*/
gulp.task('serve',function(){
	browserSync.init({	//启动browserSync服务
		server:{
			baseDir:'./dev',	//启动服务的目录
			index:'index.html'	//启动文件名
		},
		open:'external'//启动时自动打开的网址，external表示可外部打开url
	});
	//监听文件变化，执行相应任务
	gulp.watch(config.scssall,['scssc']);
	gulp.watch([config.html]).on('change', reload);
});

/*==默认调用开发模式==*/
gulp.task('default', ['scssc','serve']);





