var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');

var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var _ = require('lodash');
var express = require('express');


/**
 * Connect to MongoDB.
 */
var mongoose = require('mongoose');



module.exports = (app, dirname, cb) => {
  mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
  mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  });


  /**
   * Express configuration.
   */
  app.set('port', process.env.PORT || 8000);


  app.set('views', path.join(dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(compress());
  app.use(sass({
    src: path.join(dirname, 'src'),
    dest: path.join(dirname, 'dist'),
    debug: true,
    sourceMap: true,
    outputStyle: 'expanded'
  }));
  app.use(logger('dev'));
  // app.use(favicon(path.join(dirname, 'public', 'favicon.png')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB || process.env.MONGOLAB_URI,
      autoReconnect: true
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
  }));
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });
  app.use(function(req, res, next) {
    if (/api/i.test(req.path)) req.session.returnTo = req.path;
    next();
  });


  app.use(express.static(path.resolve(dirname, '../dist'), { maxAge: 31557600000 }));


  if (cb) cb(app);
}