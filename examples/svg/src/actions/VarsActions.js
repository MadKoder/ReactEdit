import { SET_VAR_VALUE, SET_VAR_COMPUTED_EXPRESSION, ADD_VAR } from '../constants/ActionTypes';

export function setVarValue(name, value) {
  return {
    type: SET_VAR_VALUE,
    name,
    value
  };
}

export function setVarComputedExpression(name, expression) {
  return {
    type: SET_VAR_COMPUTED_EXPRESSION,
    name,
    expression
  };
}

export function addVar(name, value, expression, computed=false) {
  return {
    type: ADD_VAR,
    name,
    value,
    expression,
    computed
  };
}