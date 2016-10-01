import { SET_VAR_VALUE, SET_VAR_COMPUTED_EXPRESSION } from '../constants/ActionTypes';

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