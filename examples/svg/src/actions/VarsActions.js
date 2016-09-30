import { SET_VAR } from '../constants/ActionTypes';

export function setVar(name, value) {
  return {
    type: SET_VAR,
    name,
    value
  };
}