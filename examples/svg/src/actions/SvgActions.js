import { INCREMENT, DECREMENT, MOVE } from '../constants/ActionTypes';

export function increment() {
  return {
    type: INCREMENT
  };
}

export function decrement() {
  return {
    type: DECREMENT
  };
}

export function move(x) {
  return {
    type: MOVE,
    x
  };
}
