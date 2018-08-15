var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Users = require('./models/users');
const url = "mongodb+srv://optimus:optimus@tutor-cluster-0yihn.mongodb.net/test?retryWrites=true";

mongoose.connect(url);
const connection = mongoose.connection;

connection.on('connected', () => {
  console.log("Connected to test db!!");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

function auth(req, res, next) {
  console.log(req.headers);

  var authHeader = req.headers.authorization;

  if (!authHeader) {
    var err = new Error("You are Not Authenticated!");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return net(err);
  }

  var authUserPass = authHeader.toString().split(' ')[1]  //gets string containing username&password.
  var auth = Buffer.from(authUserPass, 'base64').toString().split(':');    //splits authUserPass into array containing username&password.
  var username = auth[0];
  var password = auth[1];

  if (username === 'admin' && password === 'admin') {
    next();
  } else {
    var err = new Error("You are Not Authenticated!");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return net(err);
  }
}

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
