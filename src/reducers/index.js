import { combineReducers } from 'redux';
import counter from './counter';
import text from './text';

const rootReducer = combineReducers({
  counter,
  text
});

export default rootReducer;
