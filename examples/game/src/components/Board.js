import React from 'react';
import { computed } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

import {boardWidth, boardHeight} from '../common/Constants';
import {towers, baseTower, makeBoard, influenceMap} from '../state/Board';
import {cellStyle} from './Styles';
import {cellWidth, cellHeight, leftWidth} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {ManaMeter, manaMeterWidth} from './ManaMeter';
import {Tower} from './Tower';

const makeBoardSvg = (cellStyle) => (
  _(makeBoard((col, row, cellIndex) => 
    <Cell key={cellIndex} state={makeCellAttrib(col, row, cellStyle, influenceMap.get()[cellIndex])}/>
  ))
  .concat(
    <Tower key="baseTower" state={baseTower}/>
  )
  .concat(
    towers.map(tower =>
      <Tower key={"tower-" + tower.id.toString()} state={tower}/>
    )
  )
  .value()
);

const svgWidth = boardWidth * cellWidth + leftWidth;
const svgHeight = boardHeight * cellHeight;

export const Board = observer(({cellStyle}) => 
  <div>
  <svg xmlns="http://www.w3.org/2000/svg"  y={0} width={svgWidth} height={svgHeight} viewBox={"0 0 " + svgWidth.toString() + " " + svgHeight.toString()}>
    <ManaMeter mana={20} />
    <svg x={manaMeterWidth + 50}>
      {makeBoardSvg(cellStyle)}
    </svg>
  </svg>
  </div>
);
