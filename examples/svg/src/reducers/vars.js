import { SET_VAR } from '../constants/ActionTypes';

let initialState = {}

export default function vars(state = initialState, action) {
  switch (action.type) {
  case SET_VAR:
    let varObj = {
      value : action.value
    };
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  default:
    return state;
  }
}
