import { createStore } from 'redux';
import {LOG_IN, LOG_OUT, SIGN_UP, GET_PROFILE} from './actionTypes';




/**
 *---------------------------------------------------
 * Store
 *---------------------------------------------------
 * - Holds application state;
 * - Allows access to state via getState();
 * - Allows state to be updated via dispatch(action);
 * - Registers listeners via subscribe(listener);
 * - Handles unregistering of listeners via the function returned by subscribe(listener).
 */







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

function auth(state = {csrf:null}, action) {
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
export default createStore(auth);






