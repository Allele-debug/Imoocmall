var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs =require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);//将后缀改成html
app.set('view engine','html');
// app.set('view engine', 'jade');设置engine引擎的值为jade

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 登陆拦截器，必须放在静态资源声明之后、路由导航之前
// 用express进行登陆拦截
// 用户操作均进行function，判断是否登陆，否则设置白名单，其他进行拦截
app.use(function(req,res,next){
	if(req.cookies.userId){
		next();
	}else{
		// console.log("req.path:"+req.path,"req.org:"+req.originalUrl);
		// req.path 获取请求的pathname(控制台location.pathname),无视参数影响
		// req.originalUrl 获取完整的url，包含了参数 分页参数
		if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path=='/goods'){
			next();
		}else{
			res.json({
				status:'10001',
				msg:'当前未登录',
				result:''
			})
		}
	}
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
