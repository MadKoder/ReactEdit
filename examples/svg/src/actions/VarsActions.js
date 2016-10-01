import { SET_VAR_VALUE } from '../constants/ActionTypes';

export function setVarValue(name, value) {
  return {
    type: SET_VAR_VALUE,
    name,
    value
  };
}