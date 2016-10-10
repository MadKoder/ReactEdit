import { SET_VAR_VALUE, SET_VAR_COMPUTED_EXPRESSION, ADD_VAR } from '../constants/ActionTypes';

let initialState = {
  tick : {
    expression : 0,
    value : 0,
    computed : false
  },
  a : {
    expression : 2,
    value : 2,
    computed : false
  },
  rotation : {
    expression : "tick * a",
    value : 0,
    computed : true
  }
};


export default function vars(state = initialState, action) {
  switch (action.type) {
  /////////////////////////////////////////
  case SET_VAR_VALUE: {
    let varObj = state[action.name];
    varObj = Object.assign({}, varObj, {
      value : action.value
    });
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  }
  /////////////////////////////////////////
  case SET_VAR_COMPUTED_EXPRESSION: {
    let varObj = state[action.name];
    varObj = Object.assign({}, varObj, {
      expression : action.expression
    });
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  }
  /////////////////////////////////////////
  case ADD_VAR: {
    let varObj = {
      value : action.value,
      expression : action.expression,
      computed : action.computed
    };
    let newState = Object.assign({}, state);
    newState[action.name] = varObj;
    return newState;
  }
  /////////////////////////////////////////
  default:
    return state;
  }
}
