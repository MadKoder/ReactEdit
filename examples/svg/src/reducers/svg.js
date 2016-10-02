import { MOVE } from '../constants/ActionTypes';

let initialState = {
    pos : 0,
    rotation : 0
};

export default function svg(state = initialState, action) {
  switch (action.type) {
  case MOVE:
    return Object.assign({}, state, {
        pos : action.x
    });
  default:
    return state;
  }
}
