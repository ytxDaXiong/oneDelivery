var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var config = require('./config/config');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var login = require('./routes/login');
var regist = require('./routes/regist');
var Users = require('./routes/users');
var receivedGoods = require('./routes/receivedGoods');
var forgetPassword = require('./routes/forgetPassword');
var search = require('./routes/search');
var detailInfo = require('./routes/detail_info');
var expressSearch = require('./routes/expressSearch');
var countEcharts = require('./routes/countEcharts');
var Maps = require('./routes/map');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use this middleware to reset cookie expiration time
// when user hit page every time
// app.use(function(req, res, next){
//     req.session._garbage = Date();
//     req.session.touch();
//     next();
// });

var sessionStore = new MySQLStore(config.db);
app.use(session({
	secret: '12345',
  name: 'ytx',
	cookie:{maxAge:30 * 60 * 1000},//有效时间10分钟
	resave:false,
	// rolling:true,
	saveUninitialized: true,
  store: sessionStore
}));

app.use('/', index);
// app.use('/login', login);
app.use('/users', Users);
app.use('/regist', regist);
app.use('/received', receivedGoods);
app.use('/forgetPassword', forgetPassword);
app.use('/search', search);
app.use('/detailInfo',detailInfo);
app.use('/expressSearch',expressSearch);
app.use('/countEcharts',countEcharts);
app.use('/Maps',Maps);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// app.get('/',function(req, res, next){
// 	if (!req.session.user || ) {
// 		console.log("session过期");
// 		res.render('login');
// 		return;
// 	}
// });


app.listen(3000);
console.log("the app run at port 3000");
console.log("welcome");
module.exports = app;
