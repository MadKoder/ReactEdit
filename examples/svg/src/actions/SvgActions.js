import { MOVE } from '../constants/ActionTypes';

export function move(x) {
  return {
    type: MOVE,
    x
  };
}