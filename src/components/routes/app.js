import React from 'react';
import { render } from 'react-dom';

import githubApi from "apis/github";
import favicon from "favicon.ico";

import Header from './partials/header';
import Footer from './partials/footer';
import Transmit from "react-transmit";


const stylesheet = require("!raw!sass!../style/main.scss");








export default React.createClass({
	getInitialState() {
		return {csrf:null};
	},
	componentWillMount(){
		if (__CLIENT__){
			// var $ = require('jquery');
			// var csrf = $('#csrf').attr('value');
			// console.log(csrf);
			// this.setState(...this.props, {csrf:csrf});
		}
	},
  render(){
  	var {children, ...rest} = this.props;

  	console.log(Object.keys(this.props));
    return (
      <div>
        <Header ref={'header'} />
        <div className={'container'}>
         {React.cloneElement(children, {
           key: this.props.location.pathname,
           ...rest
         })}
        </div>
        <Footer/>
      </div>
    );
  }
});

