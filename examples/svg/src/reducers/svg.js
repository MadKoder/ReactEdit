import { INCREMENT, DECREMENT } from '../constants/ActionTypes';

let initialState = {
    pos : 0
};

export default function svg(state = initialState, action) {
  switch (action.type) {
  case INCREMENT:
    return Object.assign({}, state, {
        pos : state.pos + 1
    });
  case DECREMENT:
    return Object.assign({}, state, {
        pos : state.pos - 1
    });
  default:
    return state;
  }
}
