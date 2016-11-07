import React from 'react';
import { computed, observable, action, transaction } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

import * as actions from '../common/Actions';
import {boardWidth, boardHeight} from '../common/Constants';
import {makeCellId, vec, makeMap} from '../common/Tools';
import {towers} from '../state/towers';
import {state} from '../state/State';
import {cellStyle, styles} from './Styles';
import {cellWidth, cellHeight, leftWidth} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {NumberDisplay} from './NumberDisplay';
import {ManaMeter, manaMeterWidth} from './ManaMeter';
import {Tower} from './Tower';
import HGroup from './HGroup';

const makeBoardSvg = (cellStyle) => (
  _(makeMap((col, row, cellIndex) => 
    <Cell
      key={cellIndex}
      state={state.board.get()[makeCellId(col, row)]}
      styles={styles}
    />
  ))
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
  let br = e.currentTarget.getBoundingClientRect();
  const x = _.clamp(e.clientX - br.left, 0, boardSvgWidth - 1); 
  const y = _.clamp(e.clientY - br.top, 0, boardSvgHeight - 1);
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  mousePos.x = x;
  mousePos.y = y;
  const eventType = e.type;
  if(eventType == "mouseout") {
    actions.onMouseOut(col, row);
  } else if((eventType == "mouseover") || (eventType == "mousemove")) {
    actions.onMouseOver(col, row);
  } else {
    actions.onMouseClick(col, row);
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
    <svg xmlns="http://www.w3.org/2000/svg"  y={0} width={svgWidth} height={svgHeight} viewBox={"0 0 " + svgWidth.toString() + " " + svgHeight.toString()}>
      <ManaMeter state={state} x={20} y={0}/>
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
      <HGroup pos={vec(boardRight, 0)} elementHeight={20}>
        <NumberDisplay number={mousePos.x}/>
        <NumberDisplay number={mousePos.y}/>
      </HGroup>
      <image x={boardRight} y="200" width="60" height="60" href={icons.arrow} onClick={e => {actions.nextTurn()}}/>
    </svg>
  </div>
);

let towerStrokeWidthIncrement = 10.;

let strokeWidth = styles.tower.strokeWidth
function update(dt) {
  strokeWidth = strokeWidth + towerStrokeWidthIncrement * dt;
  if((strokeWidth > 4) || (strokeWidth < 1)) {
    towerStrokeWidthIncrement = -towerStrokeWidthIncrement;
  }
}

const render = (dt) => {
  transaction(() => {
    styles.tower.strokeWidth = strokeWidth;
    styles.manaSourceStyle = Object.assign({}, styles.manaSourceStyle, {
      strokeWidth
    });
  });
};

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

// Game loop from http://codeincomplete.com/posts/javascript-game-foundations-the-game-loop/
// This game loop implements fixed steps for updates, which is cool
// And render rest of the time ...
let
  now,
  dt = 0,
  last = timestamp(),
  step = 1/60;

function frame() {
  now   = timestamp();
  // dt = dt + Math.min(1, (now - last) / 1000);
  dt = dt + Math.min(1, (now - last) / 1000);
  let updated = false;
  while(dt > step) {
    dt = dt - step;
    update(step);
    updated = true;
  }
  // Maybe we would want to only render when update ?
  if(updated) {
    render(dt);
  }
  last = now;
  requestAnimationFrame(frame); // request the next frame
}

requestAnimationFrame(frame); // start the first frame
