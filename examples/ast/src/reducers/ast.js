import { SET_AST } from '../constants/ActionTypes';

export default function text(state = {}, action) {
  switch (action.type) {
  case SET_AST:
    return action.ast;
  default:
    return state;
  }
}

