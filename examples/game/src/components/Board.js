import React from 'react';
import { computed, observable, action, transaction, reaction } from "mobx";
import { observer } from "mobx-react";
import * as d3 from "d3-interpolate";
import _ from 'lodash';

import * as actions from '../common/Actions';
import {boardWidth, boardHeight} from '../common/Constants';
import {makeCellId, vec, makeMap, rgb} from '../common/Tools';
import {towers} from '../state/towers';
import {state} from '../state/State';
import {cellStyle, styles} from './Styles';
import {cellWidth, cellHeight, leftWidth} from './Constants';
import {makeCellAttrib, Cell} from './Cell';
import {NumberDisplay} from './NumberDisplay';
import {ManaMeter, manaMeterWidth} from './ManaMeter';
import {Tower} from './Tower';
import HGroup from './HGroup';

const makeCellStyle = (state, styles) => {
  const influence = state.influence;
  return influence > 0 ? 
    styles.influencedCellStyle :
    styles.cellStyle
};

let baseCellStyles = computed(() => makeMap((col, row, cellIndex) => 
  makeCellStyle(state.board[cellIndex], styles)
));

let hoveringCellStyles = observable(makeMap((col, row, cellIndex) => 
  null
));

let cellStyles = computed(() => makeMap((col, row, cellIndex) => 
  hoveringCellStyles[cellIndex] !== null ? hoveringCellStyles[cellIndex] : baseCellStyles.get()[cellIndex]
));

let previousHoveredCellId = -1;

let animations = {};
let animationsToRemove = [];

const animateArrayItemFromTo = (key, array, id, duration, fromVal, toVal) => {
  let interpolator;
  if((typeof fromVal === "function") || (typeof toVal === "function")) {
    let fromValFunc = typeof fromVal === "function" ? fromVal : () => fromVal;
    let toValFunc = typeof toVal === "function" ? toVal : () => toVal;
    interpolator = dt => d3.interpolate(fromValFunc(), toValFunc())(dt);
  } else {
    interpolator = d3.interpolate(fromVal, toVal);
  }
  let dtSum = 0;
  animations[key] = (dt) => {
    dtSum = Math.min(dtSum + dt, duration);
    let interpolatedVal = interpolator(dtSum/duration);
    array[id] = Object.assign({}, array[id], interpolatedVal);
    if(dtSum >= duration) {
      animationsToRemove.push(key);
    }
  }
};

const setAnimation = (key, animation) => {
  animations[key] = (dt) => {
    if(!animation.animate(dt)) {
      if(animation.next !== null) {
        setAnimation(key, animation.next);
      } else {
        animationsToRemove.push(key);
      }
    }
  };
};

const animateArrayItem = (key, array, id, previous=null) => {
  let animation = {
    animate : () => false,
    next : null
  };

  if(previous === null) {
    setAnimation(key, animation);
  } else {
    previous.next = animation;
  }

  return {
    fromTo : (duration, fromVal, toVal) => {
      let interpolator;
      if((typeof fromVal === "function") || (typeof toVal === "function")) {
        let fromValFunc = typeof fromVal === "function" ? fromVal : () => fromVal;
        let toValFunc = typeof toVal === "function" ? toVal : () => toVal;
        interpolator = dt => d3.interpolate(fromValFunc(), toValFunc())(dt);
      } else {
        interpolator = d3.interpolate(fromVal, toVal);
      }
      let dtSum = 0;
      animation.animate = (dt) => {
        dtSum = Math.min(dtSum + dt, duration);
        let interpolatedVal = interpolator(dtSum/duration);
        if(interpolatedVal === null) {
          array[id] = null;
        } else {
          array[id] = Object.assign({}, array[id], interpolatedVal);
        }
        return (dtSum < duration);
      }
      return animateArrayItem(key, array, id, animation);
    }
  };
};

let hoveredCellReaction = reaction(
  () => actions.hoveredCellId.get(),
  hoveredCellId => {
    if(previousHoveredCellId != -1) {
      const key = previousHoveredCellId.toString();
      let index = previousHoveredCellId;
      let duration = 2;
      animateArrayItem(
        key,
        hoveringCellStyles,
        previousHoveredCellId
      ).fromTo(
        duration,
        styles.hoveredCellStyle,
        () => baseCellStyles.get()[index]
      ).fromTo(
        0.1,
        () => baseCellStyles.get()[index],
        null
      );
    }
    if(hoveredCellId != -1) {
      const key = hoveredCellId.toString();
      let duration = 1;
      animateArrayItem(
        key,
        hoveringCellStyles,
        hoveredCellId
      ).fromTo(
        duration,
        cellStyles.get()[hoveredCellId],
        styles.hoveredCellStyle
      );
    }
    previousHoveredCellId = hoveredCellId;
  }
);


const makeBoardSvg = (cellStyle) => (
  _(makeMap((col, row, cellIndex) => 
    <Cell
      key={cellIndex}
      state={state.board[makeCellId(col, row)]}
      styles={styles}
      style={cellStyles.get()[makeCellId(col, row)]}
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

const render = (dt, dtBeforeUpdate) => {
  transaction(() => {
    styles.tower.strokeWidth = strokeWidth;
    styles.manaSourceStyle = Object.assign({}, styles.manaSourceStyle, {
      strokeWidth
    });
    _.each(animations, (animation) => {animation(dtBeforeUpdate);});
    _.each(animationsToRemove, (key) => {delete animations[key];});
    animationsToRemove.length = 0;
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
  let dtBeforeUpdate = dt;
  let updated = false;
  while(dt > step) {
    dt = dt - step;
    update(step);
    updated = true;
  }
  // Maybe we would want to only render when updated ?
  if(true) {
    render(dt, dtBeforeUpdate);
  }
  last = now;
  requestAnimationFrame(frame); // request the next frame
}

requestAnimationFrame(frame); // start the first frame
