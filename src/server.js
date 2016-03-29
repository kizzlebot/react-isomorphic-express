import babelPolyfill from "babel-polyfill";
import * as ReactRouter from "react-router";

/**
 * Modules
 */
var dotenv = require('dotenv');
var express = require('express');
var mongoose = require('mongoose')

var errorHandler = require('errorhandler');
var React =  require("react");
var ReactDOM = require("react-dom/server");
var Transmit = require("react-transmit");



var favicon = require("favicon.ico");
var passport = require('passport');
var reactRouter = require('react-router');
var proxy = require('express-http-proxy');



/**
 * Source filess
 */
var routes = require("components/routes");
var pkg = require('../package.json');
var passportConfig = require('../configs/passport');
var githubApi = require("apis/github");
var middlewareConfig = require('../configs/middleware.js');




const style = require('!raw!sass!./components/style/main.scss');


/**
 * Environment Variables
 */
var hostname = process.env.HOSTNAME || "localhost";
var port     = process.env.PORT || 8000;
var webpack_port     = process.env.WEBPACK_PORT || 8080;



/* Load environment variables from .env file, where API keys and passwords are configured. */
dotenv.load();



/* Create Express server. */
var app = express();

/* Connect to MongoDB. */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.info('MongoDB Connection Error. Please make sure that MongoDB is running.');

  // SIGTERM with error
  process.exit(1);
});













middlewareConfig(app, __dirname, () => {
	app.set('env', (__PRODUCTION__) ? 'production' : 'development');



	app.use('/api/github', proxy(githubApi.url, {
	  forwardPath: (req, res) => require('url').parse(req.url).path
	}));









	app.post('/login', (req, res, next) => {
	  req.assert('email', 'Email is not valid').isEmail();
	  req.assert('password', 'Password cannot be blank').notEmpty();

	  var errors = req.validationErrors();
	  if (errors) return res.json({msg:errors});



	  // Authenticate
	  passport.authenticate('local', (err, user, info) => {
	    if (err) return next(err);

	    // If user not found
	    if (!user) return res.json({msg:info.message});

	    req.logIn(user, (errr) => {
	      if (errr) return next(err);
	      res.sendStatus(200);
	    });
	  })(req, res, next);


	});






  /*
   * Controllers (route handlers).
   */
	app.use(function(req, res, next){
		var webserver = __PRODUCTION__ ? "" : `//${hostname}:${webpack_port}`;
		var location  = req.path;



		ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
			if (redirectLocation) {
				console.error('redirectLocation hit');

				return res.redirect(redirectLocation.pathname + redirectLocation.search);
			}


			if (error || !renderProps) {
				console.error(`if (error || !renderProps)`);
				return next(error);
			}


			Transmit.renderToString(ReactRouter.RouterContext, renderProps).then(	({reactString, reactData}) => {

				var template = (
					`<!doctype html>
					 <html lang="en-us">
						<head>
							<meta charset="utf-8" />
							<title>react-isomorphic-starterkit</title>
							<link rel="shortcut icon" href="${favicon}" />
							<style>${style}</style>
						</head>
						<body>
							<div id="react-root">${reactString}</div>
						</body>
					 </html>`
				);



				var body = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);

				// Set content-type to HTML and send the prerendered HTML back
				res.set('Content-Type', 'text/html');
				res.end(body);
			})
			.catch(e => {
				next(e);
			});
		});
	});




	/**
	 * OAuth authentication routes. (Sign in)
	 */
	app.get('/auth/instagram', passport.authenticate('instagram'));
	app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});


	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});


	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});


	app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
	app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});


	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});


	app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
	  res.redirect(req.session.returnTo || '/');
	});















	/**
	 * Error Handler.
	 */
	app.use(errorHandler());

	/**
	 * Start Express server.
	 */
	app.listen(app.get('port'), function() {
	  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
	});



	if (__DEV__) {
		if (module.hot) {
			console.log("[HMR] Waiting for server-side updates");

			module.hot.accept("components/routes", () => {
				routes = require("components/routes");
			});

			module.hot.addStatusHandler((status) => {
				if (status === "abort") {
					setTimeout(() => process.exit(0), 0);
				}
			});
		}
	}
});




module.exports = app;
