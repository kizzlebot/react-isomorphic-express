import React from 'react';
import {Link, IndexLink} from 'react-router';
import {Navbar, NavItem, MenuItem, NavDropdown, Nav} from 'react-bootstrap';


import * as actions from '../../redux/actionCreators';
import userStore from '../../redux/userStore';

import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';





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

  	// Decide which to show. (login and signup or logout)
    var navRight = (!this.state.logged_in) ? (
    	<Nav pullRight>
	    	<LinkContainer to={{pathname:'/login'}}><NavItem eventKey={4}>Login</NavItem></LinkContainer>
	      <LinkContainer to={{pathname:'/signup'}}><NavItem eventKey={5} href="#">Create Account</NavItem></LinkContainer>
    	</Nav>
    ) : (
    	<Nav pullRight>
      	<LinkContainer to={{pathname:'/logout'}}><NavItem eventKey={6} href="#">Logout</NavItem></LinkContainer>
      </Nav>
    );

    return (
		  <Navbar inverse>
		    <Navbar.Header>
		      <Navbar.Brand>
		        <a href="#">React-Bootstrap</a>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Nav>
		        <LinkContainer to={{pathname:'/'}}>
		        	<NavItem eventKey={1}>Home</NavItem>
	        	</LinkContainer>
		      	<LinkContainer to={{pathname:'/contact'}}>
		      		<NavItem eventKey={2} href="#">Contact</NavItem>
	      		</LinkContainer>

		        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
		          <MenuItem eventKey={3.1}>Action</MenuItem>
		          <MenuItem eventKey={3.2}>Another action</MenuItem>
		          <MenuItem eventKey={3.3}>Something else here</MenuItem>
		          <MenuItem divider />
		          <MenuItem eventKey={3.3}>Separated link</MenuItem>
		        </NavDropdown>
		      </Nav>

		      {navRight}

		    </Navbar.Collapse>
		  </Navbar>
    );
  }
});



export default Header;

// <div className="navbar navbar-inverse">
//         <div className="container">
//           <div className="navbar-header">
//             <button type="button" data-toggle="collapse" data-target=".navbar-collapse" className="navbar-toggle">
//             <span className="sr-only">Toggle navigation</span>
//             <span className="icon-bar" />
//             <span className="icon-bar" />
//             <span className="icon-bar" />
//             </button><IndexLink to="/" activeClassName={'active'} className="navbar-brand"><i className="fa fa-rocket" />{__PKG__}</IndexLink>
//           </div>
//           <div className="collapse navbar-collapse">
//             <ul className="nav navbar-nav">
//               <li><IndexLink to={'/'} activeClassName={'active'}>Home</IndexLink></li>
//               {/*<li><Link to="/api">API Examples</Link></li>*/}
//               <li><Link to="/contact" activeClassName={'active'}>Contact</Link></li>
//             </ul>
//             {navRight}
//           </div>
//         </div>
//       </div>
