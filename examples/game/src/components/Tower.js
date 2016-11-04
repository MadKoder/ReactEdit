import React from 'react';
import { observable, action } from 'mobx';
import { observer } from "mobx-react";

import {towerStyle} from './Styles';
import {hoveredCellId} from './Events';
import {nbCellH, cellWidth, cellHeight} from './Constants';
import {makeCellId} from './Tools';

export let towerAttribs = observable({
  col : nbCellH / 2,
  row : 15,
  style : towerStyle,
  influenceDist : 3
});

const makeHandleMouse = (col, row) =>
  action(e => {
    if(e.type == "mouseover") {
      hoveredCellId.set(makeCellId(col, row));
    } else {
      hoveredCellId.set(-1);
    }
    return true;
  });

export const Tower = observer(({attribs}) => 
  <circle 
    id="baseTower"
    style={attribs.style} 
    cx={(attribs.col * cellWidth) + (cellWidth / 2)}
    cy={(attribs.row * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
    onMouseOver={makeHandleMouse(attribs.col, attribs.row)}
    onMouseOut={makeHandleMouse(attribs.col, attribs.row)}
  />
);
