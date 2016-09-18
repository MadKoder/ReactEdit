import { SET_TEXT } from '../constants/ActionTypes';

export function setText(text) {
  return {
    type: SET_TEXT,
    text
  };
}
