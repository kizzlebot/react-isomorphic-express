import babelPolyfill from "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom/server";
import * as ReactRouter from "react-router";
import Transmit from "react-transmit";

import githubApi from "apis/github";
import routesContainer from "containers/routes";
import favicon from "favicon.ico";






var express = require('express');
var errorHandler = require('errorhandler');
var dotenv = require('dotenv');
var logger = require('morgan');
var path = require('path');
var proxy = require('express-http-proxy');



dotenv.load({ path: '.env.example' });



var passportConf = require('../configs/passport');
const port     = process.env.PORT || 8000;





var app = express();
const hostname = process.env.HOSTNAME || "localhost";
let   routes   = routesContainer;

var middlewareConfig = require('../configs/middleware');
middlewareConfig(app, __dirname, () => {


	app.use('/api/github', proxy(githubApi.url, {
	  forwardPath: (req, res) => require('url').parse(req.url).path
	}));



	app.use('*', function(req, res, next){

		const webserver = __PRODUCTION__ ? "" : `//${hostname}:8080`;
		const location  = req.originalUrl;

		ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
			if (redirectLocation) {
				res.redirect(redirectLocation.pathname + redirectLocation.search, "/");
				return;
			}

			if (error || !renderProps) {
				next(error);
				return;
			}

			const styles = {};

			const StyleProvider = React.createClass({
				childContextTypes:{
					styles:    React.PropTypes.object,
					insertCss: React.PropTypes.func
				},

				getChildContext () {
					return {
						styles,
						insertCss (style) { styles[style] = style._getCss(); }
					};
				},

				render () {
					return <ReactRouter.RouterContext {...this.props} />;
				}
			});


			Transmit.renderToString(StyleProvider, renderProps).then(({reactString, reactData}) => {
				let cssModules = "";

				Object.keys(styles).forEach((style) => { cssModules += styles[style]; });

				let template = (
					`<!doctype html>
					<html lang="en-us">
						<head>
							<meta charset="utf-8" />
							<title>react-isomorphic-starterkit</title>
							<link rel="shortcut icon" href="${favicon}" />
							<style>${cssModules}</style>
						</head>
						<body>
							<div id="react-root">${reactString}</div>
						</body>
					</html>`
				);


				var content = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);


				res.setHeader('Content-Type', 'text/html')
				res.end(content);
			}).catch(e => {
				next(e);
			});
		});
	})

  app.use(errorHandler());




	app.listen(app.get('port'), () => {
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to http://localhost:%s", app.get('port'));
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





