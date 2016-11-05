import React from 'react';
import { observer } from "mobx-react";

import {towerStyle, baseTowerStyle} from './Styles';
import {cellWidth, cellHeight} from './Constants';

const rgb = (r, g, b) =>
  "#" + r.toString(16) + g.toString(16) + b.toString(16);

const makeStyle = state => {
  let influenceDist = state.influenceDist;
  let r = influenceDist * 20;
  let g = influenceDist * 40;
  let b = influenceDist * 50;
  return state.base ? 
    baseTowerStyle : 
    Object.assign({}, towerStyle, {
      fill : rgb(r, g, b)
    });
};

export const Tower = observer(({state}) => 
  <circle 
    id="baseTower"
    style={makeStyle(state)} 
    cx={(state.col * cellWidth) + (cellWidth / 2)}
    cy={(state.row * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
  />
);
