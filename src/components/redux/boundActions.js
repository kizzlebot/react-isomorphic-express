// import { connect } from 'redux'
import {userStore} from './userStore';
import {log_in, sign_up} from './actionCreators';


var $ = require('jquery');





/* eslint-disable */
// if (__CLIENT__ == undefined){
//   csrf = (window) ? window.getCsrf() : "";
// }
/* eslint-enable */








/**
 * Create bound action creator that automatically dispatches:
 */


const submitLogin = (form) => {
	return $.ajax({
		url:'/login',
		data:{
			email:form.email.value,
			password:form.password.value,
			_csrf:csrf
		},
		method:'POST'
	})
	.then((xData, status, xhr) => {
		userStore.dispatch(log_in());
		return Promise.resolve(xData, status, xhr);
	});
}


const submitSignup = (form) => {
	return $.ajax({
		url:'/signup',
		data:{
			email:form.email.value,
			password:form.password.value,
			confirmPassword:form.confirmPassword.value,
			_csrf:csrf
		},
		method:'POST'
	})
	.then((xData, status, xhr) => {
		console.log(xhr.getAllResponseHeaders());
		userStore.dispatch(sign_up());
		return Promise.resolve(xData, status, xhr);
	});
}








export {submitSignup, submitLogin} ;


// You can subscribe to the updates manually, or use bindings to your view layer.
// store.subscribe(() =>
//   console.log(store.getState())
// )




// // The only way to mutate the internal state is to dispatch an action.
// // The actions can be serialized, logged or stored and later replayed.
// store.dispatch({ type: 'INCREMENT' })
// // 1
// store.dispatch({ type: 'INCREMENT' })
// // 2
// store.dispatch({ type: 'DECREMENT' })
