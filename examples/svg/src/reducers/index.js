import { combineReducers } from 'redux';
import svg from './svg';
import vars from './vars';

const rootReducer = combineReducers({
  svg,
  vars
});

export default rootReducer;
