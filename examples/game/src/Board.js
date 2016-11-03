import React from 'react';
import { observer } from "mobx-react";
import _ from 'lodash';

import {cellStyle} from './Styles';
import {nbCellH, nbCellV, boardWidth, boardHeight} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {ManaMeter, manaMeterWidth} from './ManaMeter';
import {towerAttribs, Tower} from './Tower';

const makeBoardSvg = (cellStyle) => (
  _(_.range(nbCellH * nbCellV).map(cellIndex => {
    const y = Math.floor(cellIndex / nbCellH);
    const x = cellIndex % nbCellH;
    return (
      <Cell key={cellIndex} cellAttrib={makeCellAttrib(x, y, cellStyle)}/>
    )
  }))
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
