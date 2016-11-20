import React from 'react';
import { computed, observable, action, transaction, reaction } from "mobx";
import { observer } from "mobx-react";
import * as d3 from "d3-interpolate";
import * as d3_ease from "d3-ease";
import _ from 'lodash';

Object.assign(d3, d3_ease);

import * as actions from '../common/Actions';
import {wrap, wrapObjects} from '../common/wrap';
import {transition, merge, makeYoyoAnimationFromTransition, TransitionChain} from '../common/animations';
import {animations, addArrayItemTransition} from '../common/gameLoop';
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

function makeTransitionChain(transitions) {
  return {
    transitions,
    then : function (duration, toVal) {
      let newTransitions = transitions.slice(0);
      newTransitions.push({
        duration,
        toVal
      });
      return makeTransitionChain(newTransitions);
    },
    target : function(wrapper) {
      let unwrappedTC = this;
      let tc = new TransitionChain(wrapper);
      let totalDuration = _.sum(this.transitions.map(transition => transition.duration));
      let wrappedFunctions = wrapper.setWrapper(
        wrapper => {
          // Make a TransitionChain for the wrapper
          // and set all its transitions using this.transitions params
          let tc = new TransitionChain(wrapper);
          for(let transition of unwrappedTC.transitions) {
            tc.to(transition.duration, transition.toVal)
          }
          // The functions that must be transformed are the forward and goto of this 
          // TransitionChain
          return [
            t => {tc.forward(t);},
            t => {tc.goto(t);}
          ]
        }
      );
      return {
        forward : function(t) {
          wrappedFunctions[0](t);
        },
        goto : function(t) {
          wrappedFunctions[1](t);
        },
        duration : totalDuration
      };
    }
  }
}

function trans(duration, toVal)  {
  return makeTransitionChain([{
    duration,
    toVal
  }]);
}

let t = trans(
  0.5,
  {
    strokeWidth : 4
  }
)
.then(
  0.5,
  {
    stroke: 'lightgray'
  }
);

let manaSourceTransitionChain = t.target(wrap(styles.manaSourceStyle));
let towerTransitionChain = t.target(wrap(styles.tower));
animations["manaSourceStyle"] = makeYoyoAnimationFromTransition(manaSourceTransitionChain);
animations["towerStyle"] = makeYoyoAnimationFromTransition(towerTransitionChain);

// let manaSourceAndTowerTransitionChains = t.target(wrapObjects([
//   wrap(styles.tower),
//   wrap(styles.manaSourceStyle)
// ]));
// animations["manaSourceAndTowerStyles"] = makeYoyoAnimationFromTransition(manaSourceAndTowerTransitionChains);

let previousHoveredCellId = -1;
// let manaSourceTransitionChain = transition(styles.manaSourceStyle);
// let towerTransitionChain = transition(styles.tower);
// merge([manaSourceTransitionChain, towerTransitionChain])
// .to(
//   0.5,
//   {
//     strokeWidth : 4
//   }
// )
// .to(
//   0.5,
//   {
//     stroke: 'lightgray'
//   }
// );

let hoveredCellReaction = reaction(
  () => actions.hoveredCellId.get(),
  hoveredCellId => {
    if(previousHoveredCellId != -1) {
      const key = previousHoveredCellId.toString();
      let index = previousHoveredCellId;
      let duration = 1;
      addArrayItemTransition(
        key,
        hoveringCellStyles,
        previousHoveredCellId
      ).to(
        duration,
        () => baseCellStyles.get()[index]
      ).to(
        0.1,
        null
      );
    }
    if(hoveredCellId != -1) {
      const key = hoveredCellId.toString();
      let duration = 0.3;
      addArrayItemTransition(
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