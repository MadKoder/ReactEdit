import { combineReducers } from 'redux';
import counter from './counter';
import text from './text';
import ast from './ast';

const rootReducer = combineReducers({
  counter,
  ast,
  text
});

export default rootReducer;
