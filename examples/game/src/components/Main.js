import React from 'react';
import { render } from 'react-dom';

import '../style/main.css';
import {cellStyle} from './Styles';
import {Board, mousePos} from './Board';


const mainRender = () => {
  render(
    <Board cellStyle={cellStyle} mousePos={mousePos}>
    </Board>,
    document.getElementById('root')
  );
}

export default mainRender;