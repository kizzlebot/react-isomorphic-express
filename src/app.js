import babelPolyfill from "babel-polyfill";
import koa from "koa";
import koaProxy from "koa-proxy";
import koaStatic from "koa-static";
import React from "react";
import ReactDOM from "react-dom/server";
import * as ReactRouter from "react-router";
import Transmit from "react-transmit";

import githubApi from "apis/github";
import routesContainer from "containers/routes";
import favicon from "favicon.ico";




try {
	const app      = koa();
	const hostname = process.env.HOSTNAME || "localhost";
	const port     = process.env.PORT || 8000;
	let   routes   = routesContainer;

	app.use(koaStatic("static"));

	app.use(koaProxy({
		host: githubApi.url,
		match: /^\/api\/github\//i,
		map: (path) => path.replace(/^\/api\/github\//i, "/")
	}));

	app.use(function *(next) {
		yield ((callback) => {
			const webserver = __PRODUCTION__ ? "" : `//${this.hostname}:8080`;
			const location  = this.path;

			ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
				if (redirectLocation) {
					this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
					return;
				}

				if (error || !renderProps) {
					callback(error);
					return;
				}

				const styles = {};


				const StyleProvider = React.createClass({
					childContextTypes:{
						styles:    React.PropTypes.array,
						insertCss: React.PropTypes.func
					},
					getChildContext () {
						return { styles, insertCss (style) { styles[style] = style._getCss(); } };
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

					this.type = "text/html";
					this.body = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);
					// console.log(this.body);
					callback(null);
				}).catch(e => {
					callback(e);
				});
			});
		});
	});

	app.listen(port, () => {
		console.info("==> ✅  Server is listening");
		console.info("==> 🌎  Go to http://%s:%s", hostname, port);
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
}
catch (error) {
	console.error(error.stack || error);
	throw error;
}






// var express = require('express');
// var errorHandler = require('errorhandler');
// var dotenv = require('dotenv');
// var logger = require('morgan');
// var path = require('path');



// dotenv.load({ path: '.env.example' });



// var passportConf = require('../configs/passport');





// var app = express();
// let   routes   = routesContainer;

// var middlewareConfig = require('../configs/middleware');
// middlewareConfig(app, __dirname, () => {

// 	app.use('*', function(req, res, next){

// 		const webserver = __PRODUCTION__ ? "" : `//${req.headers.host}:${app.get('port')}`;
// 		const location  = req.originalUrl;

// 		ReactRouter.match({routes, location}, (error, redirectLocation, renderProps) => {
// 			if (redirectLocation) {
// 				res.redirect(redirectLocation.pathname + redirectLocation.search, "/");
// 				return;
// 			}

// 			if (error || !renderProps) {
// 				callback(error);
// 				return;
// 			}

// 			const styles = {};

// 			const StyleProvider = React.createClass({
// 				childContextTypes:{
// 					styles:    React.PropTypes.array,
// 					insertCss: React.PropTypes.func
// 				},

// 				getChildContext () {
// 					return {
// 						styles,
// 						insertCss (style) { styles[style] = style._getCss(); }
// 					};
// 				},

// 				render () {
// 					return <ReactRouter.RouterContext {...this.props} />;
// 				}
// 			});


// 			Transmit.renderToString(StyleProvider, renderProps).then(({reactString, reactData}) => {
// 				let cssModules = "";

// 				Object.keys(styles).forEach((style) => { cssModules += styles[style]; });

// 				let template = (
// 					`<!doctype html>
// 					<html lang="en-us">
// 						<head>
// 							<meta charset="utf-8" />
// 							<title>react-isomorphic-starterkit</title>
// 							<link rel="shortcut icon" href="${favicon}" />
// 							<style>${cssModules}</style>
// 						</head>
// 						<body>
// 							<div id="react-root">${reactString}</div>
// 						</body>
// 					</html>`
// 				);


// 				var content = Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]);


// 				res.setHeader('Content-Type', 'text/html')
// 				res.end(content);
// 			}).catch(e => {
// 				next(e);
// 			});
// 		});
// 	})

//   app.use(errorHandler());
// 	app.listen(app.get('port'), () => {
// 		console.info("==> ✅  Server is listening");
// 		console.info("==> 🌎  Go to http://localhost:%s", app.get('port'));
// 	});

// });
