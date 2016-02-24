import { SET_TEXT } from '../constants/ActionTypes';

export default function text(state = "coucou", action) {
  switch (action.type) {
  case SET_TEXT:
    return action.text;
  default:
    return state;
  }
}

