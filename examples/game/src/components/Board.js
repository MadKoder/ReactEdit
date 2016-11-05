import React from 'react';
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

import {onMouseOver, onMouseOut, onMouseClick} from '../common/Actions';
import {boardWidth, boardHeight} from '../common/Constants';
import {towers, baseTower, makeBoard, influenceMap} from '../state/Board';
import {state} from '../state/State';
import {cellStyle, styles} from './Styles';
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
    <Tower key="baseTower" state={baseTower} styles={styles}/>
  )
  .concat(
    towers.map(tower =>
      <Tower key={"tower-" + tower.id.toString()} state={tower} styles={styles}/>
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
  let br = e.currentTarget.getBoundingClientRect();
  const x = _.clamp(e.pageX - br.left, 0, boardSvgWidth - 1); 
  const y = _.clamp(e.pageY - br.top, 0, boardSvgHeight - 1);
  // const x = _.clamp(e.pageX - boardPos.x, 0, boardSvgWidth - 1); 
  // const y = _.clamp(e.pageY - boardPos.y, 0, boardSvgHeight - 1);
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

let iconNames = ["arrow"]
let icons = _.zipObject(
  iconNames,
  iconNames.map(name =>
    require('../svg/' + name + '.svg')
  )
);

const boardRight = boardWidth * cellWidth + leftWidth;

export const Board = observer(({cellStyle, mousePos}) => 
  <div>
  {/*<img src={logo} />*/}
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
    <NumberDisplay x={boardRight} number={mousePos.x}/>
    <NumberDisplay x={boardRight} y={20} number={mousePos.y}/>
    <image x={boardRight} y="200" width="60" height="60" href={icons.arrow}/>
  </svg>
  </div>
);

let towerStrokeWidthIncrement = .2;

setInterval(
  () => {
    let strokeWidth = styles.tower.strokeWidth + towerStrokeWidthIncrement;
    if(strokeWidth > 4) {
      towerStrokeWidthIncrement = -.2;
    } else if(strokeWidth < 1) {
      towerStrokeWidthIncrement = .2;
    }
    styles.tower.strokeWidth = strokeWidth;    
  },
  50
);