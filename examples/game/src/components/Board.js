import React from 'react';
import { computed } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

import {cellStyle} from './Styles';
import {nbCellH, nbCellV, boardWidth, boardHeight} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {ManaMeter, manaMeterWidth} from './ManaMeter';
import {towerAttribs, Tower} from './Tower';

const makeBoard = f =>
  _.range(nbCellH * nbCellV).map(cellIndex => {
    const row = Math.floor(cellIndex / nbCellH);
    const col = cellIndex % nbCellH;
    return f(col, row, cellIndex);
  });

let influenceMap = computed(() =>
  makeBoard((col, row) => (
    (
      Math.abs(row - towerAttribs.row) <= towerAttribs.influenceDist &&
      Math.abs(col - towerAttribs.col) <= towerAttribs.influenceDist
    ) ? 1 : 0
  ))
);

const makeBoardSvg = (cellStyle) => (
  _(makeBoard((col, row, cellIndex) => 
    <Cell key={cellIndex} cellAttrib={makeCellAttrib(col, row, cellStyle, influenceMap.get()[cellIndex])}/>
  ))
  .concat(
    <Tower key="baseTower" attribs={towerAttribs}/>
  )
  .value()
);

export const Board = observer(({cellStyle}) => 
  <div>
  <svg xmlns="http://www.w3.org/2000/svg"  y={0} width={boardWidth} height={boardHeight} viewBox={"0 0 " + boardWidth.toString() + " " + boardHeight.toString()}>
    <ManaMeter mana={20} />
    <svg x={manaMeterWidth + 50}>
      {makeBoardSvg(cellStyle)}
    </svg>
  </svg>
  </div>
);
