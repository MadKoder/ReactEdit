import React from 'react';
import { action } from 'mobx';
import { observer } from "mobx-react";

import {onMouseOver, onMouseOut, onMouseClick} from '../common/Actions';
import {towerStyle} from './Styles';
import {cellWidth, cellHeight} from './Constants';

const makeHandleMouse = (state) =>
  action(e => {
    if(e.type == "mouseover") {
      onMouseOver(state.col, state.row);
    } else if(e.type == "mouseout") {
      onMouseOut(state.col, state.row);
    } else {
      onMouseClick(state.col, state.row);
    }
    return true;
  });

export const Tower = observer(({state}) => 
  <circle 
    id="baseTower"
    style={towerStyle} 
    cx={(state.col * cellWidth) + (cellWidth / 2)}
    cy={(state.row * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
    onMouseOver={makeHandleMouse(state)}
    onMouseOut={makeHandleMouse(state)}
    onClick={makeHandleMouse(state)}
  />
);
