import React from 'react';
import { observer } from "mobx-react";

import {cellWidth, cellHeight} from './Constants';

const rgb = (r, g, b) =>
  '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1);
  // "#" + r.toString(16) + g.toString(16) + b.toString(16);

const makeStyle = (state, styles) => {
  let towerStyle = styles.tower;
  let baseTowerStyle = styles.baseTower;
  let influenceDist = state.influenceDist;
  let r = influenceDist * 10;
  let g = influenceDist * 50;
  let b = influenceDist * 50;
  return state.base ? 
    baseTowerStyle : 
    Object.assign({}, towerStyle, {
      fill : rgb(r, g, b)
    });
};

export const Tower = observer(({state, styles}) => 
  <circle 
    id="baseTower"
    style={makeStyle(state, styles)} 
    cx={(state.col * cellWidth) + (cellWidth / 2)}
    cy={(state.row * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
  />
);
