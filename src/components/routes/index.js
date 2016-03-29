// require("bootstrap-webpack!./style/css/themes/default/_variables.less");

if (__CLIENT__) {
	require("font-awesome-webpack");
	// require("bootstrap-webpack");
	// require('./style/css/main.scss');
	// require('./style/css/docs.scss');
}



import React from 'react'
import { render } from 'react-dom'
import { browserHistory, IndexRoute, Router, Route, Link } from 'react-router'



import Header from './partials/header';
import Footer from './partials/footer';



import Home from './home';
import GithubAPI from './apis/github';
import Stargazers from './apis/stargazers'
import LinkedIn from './apis/linkedin';
import Contact from './contact';
import APIs from './apis';
import Login from './login';
import SignUp from './signup';



import {PageHeader} from 'react-bootstrap';
import App from './app.js';

import {userStore} from '../redux/userStore';




// function requireAuth(nextState, replace) {
// 	replace({
// 		pathname: '/',
// 		state: { nextPathname: nextState.location.pathname }
// 	})
// }


module.exports = (history) => {
	if (history){
		return (
			<Router history={history}>
				<Route path="/" component={App} store={userStore}>
					<IndexRoute component={Home}/>

					<Route path='api' component={APIs}>
						<Route path='github' component={GithubAPI}/>
						<Route path='linkedin' component={LinkedIn}/>
						<Route path='stargazers' component={Stargazers}/>
					</Route>


					<Route path="contact" component={Contact} />
					<Route path="login" component={Login} />
					<Route path="signup" component={SignUp} />
				</Route>
			</Router>
		)
	}
	else {
		return (
			<Router>
				<Route path="/" component={App} store={userStore}>
					<IndexRoute component={Home}/>

					<Route path='api' component={APIs}>
						<Route path='github' component={GithubAPI}/>
						<Route path='linkedin' component={LinkedIn}/>
						<Route path='stargazers' component={Stargazers}/>
					</Route>


					<Route path="contact" component={Contact} />
					<Route path="login" component={Login} />
					<Route path="signup" component={SignUp} />
				</Route>
			</Router>
		)
	}
};
