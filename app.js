var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
global.appRoot = path.resolve(__dirname);

var app = express();

console.log(app.get('env'));

if (app.get('env') === 'development') {
	MONGO_URI = 'localhost:27017/worldcup';
}
else if(app.get('env') === 'production'){
	MONGO_URI = 'mongodb://root:asd123@ds259250.mlab.com:59250/worldcup';
}

require('./config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// console.log(new Date().toLocaleString());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
	secret: 'my_app_secret',
	cookie: { maxAge: 86400000 * 10 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var monk = require('monk');
var db = monk(MONGO_URI);

db.then(() => {
	console.log('MongoDB connected correctly to server')
});

var match = require('./controllers/web/match');
var index = require('./controllers/web/index');

app.use('/match', match);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
