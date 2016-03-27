import { createStore } from 'redux';
var $ = require('jquery');



const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';
const SIGN_UP = 'SIGN_UP';
const GET_PROFILE = 'GET_PROFILE';





/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */

function auth(state = {}, action) {
  switch (action.type) {
  case LOG_IN:
    return {...state, logged_in:true}
  case LOG_OUT:
    return {...state, logged_in:false}
  case SIGN_UP:
  	return state
  case GET_PROFILE:
  	return state;
  default:
    return state
  }
}






// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.

export const userStore = createStore(auth);




/**
 * Action Creators
 */
function log_in(){
	return {
		type: LOG_IN
	}
}
function signup(){
	return {
		type: SIGN_UP
	}
}








export function submitLogin(form){
	return $.ajax({
		url:'/login',
		data:{
			email:form.email.value,
			password:form.password.value,
			_csrf:form._csrf.value
		},
		method:'POST'
	})
	.then((xData, status, xhr) => {
		console.log(xhr.getAllResponseHeaders());
		userStore.dispatch(log_in());
		return Promise.resolve(xData, status, xhr);
	});
}
export function submitSignup(form){
	return $.ajax({
		url:'/signup',
		data:{
			email:form.email.value,
			password:form.password.value,
			confirmPassword:form.confirmPassword.value,
			_csrf:form._csrf.value
		},
		method:'POST'
	})
	.then((xData, status, xhr) => {
		console.log(xhr.getAllResponseHeaders());
		userStore.dispatch(log_in());
		return Promise.resolve(xData, status, xhr);
	});
}




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
