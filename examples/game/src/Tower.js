import React from 'react';
import { observable } from 'mobx';
import { observer } from "mobx-react";

import {towerStyle } from './Styles';
import {nbCellH, cellWidth, cellHeight} from './Constants';
import {handleMouseOver} from './Events'

export const towerAttribs = observable({
  x : nbCellH / 2,
  y : 15,
  style : towerStyle
});

export const Tower = observer(({attribs}) => 
  <circle 
    id="baseTower"
    style={attribs.style} 
    cx={(attribs.x * cellWidth) - (cellWidth / 2)}
    cy={(attribs.y * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
    onMouseOver={handleMouseOver} onMouseOut={handleMouseOver}
  />
);
