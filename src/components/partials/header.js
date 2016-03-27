import React from 'react';
import {Link, IndexLink} from 'react-router';
import {submitSignup, userStore} from '../redux/userStore';

var Header = React.createClass({
  getInitialState(){
    return userStore.getState();
  },
  componentDidMount(){
    userStore.subscribe((data) => {
      this.setState({...userStore.getState()})
    });
  },
  render() {
    var navRight = (!this.state.logged_in) ? (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/login" activeClassName={'active'}>Login</Link></li>
        <li><Link to="/signup" activeClassName={'active'}>Create Account</Link></li>
      </ul>
    ) : (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    );

    return (
      <div className="navbar navbar-inverse">
        <div className="container">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
            </button><IndexLink to="/" activeClassName={'active'} className="navbar-brand"><i className="fa fa-rocket" />DevMusic</IndexLink>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><IndexLink to={'/'} activeClassName={'active'}>Home</IndexLink></li>
              {/*<li><Link to="/api">API Examples</Link></li>*/}
              <li><Link to="/contact" activeClassName={'active'}>Contact</Link></li>
            </ul>
            {navRight}
          </div>
        </div>
      </div>
    );
  }
});



export default Header;