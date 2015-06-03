var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://heroku_app37481396:3ie4j13vj4tud2q6uo96kgjmlj@ds043012.mongolab.com:43012/heroku_app37481396';
var port = process.env.PORT || 5000
var server = require('http').createServer(app);

var routes = require('./routes/index');
var users = require('./routes/users');
var presentations = require('./routes/presentations');

var io = require('socket.io').listen(server);



MongoClient.connect(url, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to the db");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  req.db = MongoClient;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/presentations', presentations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(port);

io.on('connection', function(socket) {
    console.log('A new user connected!');
    socket.on('live update', function(msg){
      io.emit('live update', msg);
    });
});


console.log("Express server listening on port 5000");


module.exports = app;
