var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
const mongoose = require('mongoose');
const mongoosePatchUpdate = require('mongoose-patch-update');
var passport = require('passport');
var cors = require('cors');
var config = require('./config/database');
var conn = require('./config/connection');

//var func = require('./app/api/helpers/functions');

//mongoose.connect(config.database, {useCreateIndex: true, useNewUrlParser: true});
mongoose.plugin(mongoosePatchUpdate);

var apiv1 = require('./routes/api');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser(config.secret));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(session({secret: config.secret, resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//database connection
app.use(function (req, res, next) {
    conn.connection(req, res).then(connect => {
        next();
    });
});

app.use('/api', apiv1);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
