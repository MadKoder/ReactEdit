import React from 'react';
import { render } from 'react-dom';

import '../style/main.css';
import {cellStyle} from './Styles';
import {Board} from './Board';


const mainRender = () => {
  render(
    <Board cellStyle={cellStyle}>
    </Board>,
    document.getElementById('root')
  );
}

export default mainRender;