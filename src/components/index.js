// require("bootstrap-webpack!./style/css/themes/default/_variables.less");
require("font-awesome-webpack");
require("bootstrap-webpack");



require('./style/css/main.scss');

import React from 'react'
import { render } from 'react-dom'
import { browserHistory, IndexRoute, Router, Route, Link } from 'react-router'



import Header from './partials/header';
import Footer from './partials/footer';



import Home from './routes/home';
import GithubAPI from './routes/apis/github';
import LinkedIn from './routes/apis/linkedin';
import Contact from './routes/contact';
import APIs from './routes/apis';
import Login from './routes/login';
import SignUp from './routes/signup';






var App = React.createClass({
  render(){
    return (
      <div>
        <Header ref={'header'} />
        <div className={'container'}>
         {React.cloneElement(this.props.children, {
           key: this.props.location.pathname
         })}
        </div>
        <Footer/>
      </div>
    );
  }
});








render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>

      <Route path='api' component={APIs}>
        <Route path='github' component={GithubAPI}/>
        <Route path='linkedin' component={LinkedIn}/>
      </Route>


      <Route path="contact" component={Contact} />
      <Route path="login" component={Login} />
      <Route path="signup" component={SignUp} />
    </Route>
  </Router>
), document.getElementById('root'))