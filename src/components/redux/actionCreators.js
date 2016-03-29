import {LOG_IN, LOG_OUT, SIGN_UP, GET_PROFILE} from './actionTypes';


/**
 * Action Creators
 */
function log_in(){
  return {
    type: LOG_IN
  }
}

function log_out(){
  return {
    type: LOG_OUT
  }
}

function sign_up(){
  return {
    type: SIGN_UP
  }
}

function get_profile(){
  return {
    type: GET_PROFILE
  }
}




export {log_in, log_out, sign_up, get_profile}
