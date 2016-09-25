import { INCREMENT, DECREMENT, MOVE, ROTATE } from '../constants/ActionTypes';

let initialState = {
    pos : 0,
    rotation : 0
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
  case MOVE:
    return Object.assign({}, state, {
        pos : action.x
    });
  case ROTATE:
    return Object.assign({}, state, {
        rotation : action.x
    });
  default:
    return state;
  }
}
