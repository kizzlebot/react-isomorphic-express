import babelPolyfill from "babel-polyfill";
import * as ReactRouter from "react-router";



var pkg = require('../package.json');
var dotenv = require('dotenv');
var express = require('express');
var mongoose = require('mongoose')
var hostname = process.env.HOSTNAME || "localhost" ;
var port     = process.env.PORT || 8000;

var errorHandler = require('errorhandler');
var React =  require("react");
var ReactDOM = require("react-dom/server");
var Transmit = require("react-transmit");

var githubApi = require("apis/github");
var routes = require("components/routes");
var favicon = require("favicon.ico");

var passportConfig = require('../configs/passport');








/* Load environment variables from .env file, where API keys and passwords are configured. */
dotenv.load();


/* API keys and Passport configuration. */

/* Create Express server. */
var app = express();

/* Connect to MongoDB. */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});










var middlewareConfig = require('../configs/middleware.js');
var proxy = require('express-http-proxy');


middlewareConfig(app, __dirname, () => {
	app.use('/api/github', proxy(githubApi.url, {
	  forwardPath: (req, res) => require('url').parse(req.url).path
	}));


  /**
   * Controllers (route handlers).
   */

	app.get('/', function(req, res, next){
			var webserver = __PRODUCTION__ ? "" : `//${hostname}:8080`;
			var location  = req.originalUrl;

			ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
				if (redirectLocation) return res.redirect(redirectLocation.pathname + redirectLocation.search, "/");
				if (error || !renderProps) return next(error);


				Transmit.renderToString(ReactRouter.RouterContext, renderProps).then(	({reactString, reactData}) => {
					var template = (
						`<!doctype html>
						 <html lang="en-us">
							<head>
								<meta charset="utf-8" />
								<title>react-isomorphic-starterkit</title>
								<link rel="shortcut icon" href="${favicon}" />
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

			module.hot.accept("containers/routes", () => {
				routes = require("containers/routes");
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
