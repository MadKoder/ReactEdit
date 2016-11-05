import React from 'react';
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

import {onMouseOver, onMouseOut, onMouseClick} from '../common/Actions';
import {boardWidth, boardHeight} from '../common/Constants';
import {towers, baseTower, makeBoard, influenceMap} from '../state/Board';
import {state} from '../state/State';
import {cellStyle} from './Styles';
import {cellWidth, cellHeight, leftWidth} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {NumberDisplay} from './NumberDisplay';
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

const rightWidth = 200;
const boardSvgWidth = boardWidth * cellWidth;
const boardSvgHeight = boardHeight * cellHeight;
const svgWidth = boardSvgWidth + leftWidth + rightWidth;
const svgHeight = boardSvgHeight;

export let mousePos = observable({
  x : 0,
  y : 0
});

const boardPos = {
  x : manaMeterWidth + 50,
  y : 0
};

const handleMouse = action(e => {
  // Clip at width/height - 1
  const x = _.clamp(e.pageX - boardPos.x, 0, boardSvgWidth - 1); 
  const y = _.clamp(e.pageY - boardPos.y, 0, boardSvgHeight - 1);
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  mousePos.x = x;
  mousePos.y = y;
  const eventType = e.type;
  if(eventType == "mouseout") {
    onMouseOut(col, row);
  } else if((eventType == "mouseover") || (eventType == "mousemove")) {
    onMouseOver(col, row);
  } else {
    onMouseClick(col, row);
  }
});


export const Board = observer(({cellStyle, mousePos}) => 
  <div>
  <svg xmlns="http://www.w3.org/2000/svg"  y={0} width={svgWidth} height={svgHeight} viewBox={"0 0 " + svgWidth.toString() + " " + svgHeight.toString()}>
    <ManaMeter mana={state.mana} x={20} y={0}/>
    <svg 
      x={boardPos.x} 
      width={svgWidth}
      height={svgHeight}
      onMouseMove={handleMouse}
      onMouseOver={handleMouse}
      onMouseOut={handleMouse}
      onMouseDown={handleMouse}
    >
      {makeBoardSvg(cellStyle)}
    </svg>
    <NumberDisplay x={boardWidth * cellWidth + leftWidth} number={mousePos.x}/>
    <NumberDisplay x={boardWidth * cellWidth + leftWidth} y={20} number={mousePos.y}/>
  </svg>
  </div>
);
