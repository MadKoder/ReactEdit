import React from 'react';
import { observer } from "mobx-react";

import {towerStyle} from './Styles';
import {cellWidth, cellHeight} from './Constants';

export const Tower = observer(({state}) => 
  <circle 
    id="baseTower"
    style={towerStyle} 
    cx={(state.col * cellWidth) + (cellWidth / 2)}
    cy={(state.row * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
  />
);
