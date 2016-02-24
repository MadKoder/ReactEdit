import { SET_AST } from '../constants/ActionTypes';

export function setAst(ast) {
  return {
    type: SET_AST,
    ast
  };
}
