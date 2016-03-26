var pkg = require('../package.json');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var multer = require('multer');
var express = require('express');

var passportConfig = require('./passport');





module.exports = (app, dir, cb) => {
  app.set('port', process.env.PORT || 8000);
  app.set('views', path.join("./", 'containers'));
  app.set('view engine', 'jade');
  app.use(compress());
  app.use(sass({
    src: path.join(dir, 'public'),
    dest: path.join(dir, 'public'),
    sourceMap: true
  }));
  app.use(logger('dev'));
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
  app.use((req, res, next) => (req.path === '/api/upload') ? next() : lusca.csrf()(req, res, next));
  app.use(lusca.xframe('SAMEORIGIN'));
  app.use(lusca.xssProtection(true));
  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.appName = pkg.name;
    next();
  });
  app.use((req, res, next) => {
    if (/api/i.test(req.path)) req.session.returnTo = req.path;
    next();
  });

  app.use(express.static(path.join(dir, 'static'), { maxAge: 31557600000 }));
  if (cb) cb(app);
}
