import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import './style/main.css';
import * as SvgActions from './actions/SvgActions';
import Bacon from 'baconjs';

const store = configureStore();

/*Bacon.interval(2000, 10).onValue((val) => {
    let state = store.getState();
    store.dispatch(SvgActions.move(store.getState().svg.pos + val));
});
*/
render(
  <Root store={store} />,
  document.getElementById('root')
);
