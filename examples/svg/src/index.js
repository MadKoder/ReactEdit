import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import './style/main.css';
import * as SvgActions from './actions/SvgActions';
import Bacon from 'baconjs';

const store = configureStore();

render(
  <Root store={store} />,
  document.getElementById('root')
);
