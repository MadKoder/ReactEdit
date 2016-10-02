import { SET_VAR_VALUE, SET_VAR_COMPUTED_EXPRESSION } from '../constants/ActionTypes';

let initialState = {
  a : {
    value : 0
  },
  b : {
    value : 0
  },
  c : {
    value : 0
  },
  tick : {
    value : 0
  },
  rotation : {
    value : 0,
    expression : "tick * 0.5"
  }
};


export default function vars(state = initialState, action) {
  switch (action.type) {
  case SET_VAR_VALUE: {
    let varObj = state[action.name];
    varObj = Object.assign({}, varObj, {
      value : action.value
    });
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  }
  case SET_VAR_COMPUTED_EXPRESSION: {
    let varObj = state[action.name];
    varObj = Object.assign({}, varObj, {
      expression : action.expression
    });
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  }
  default:
    return state;
  }
}
