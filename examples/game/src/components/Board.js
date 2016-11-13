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

// If fromVal or toVal is a function, the interpolator calls them each time it is called
const makeInterpolator = (fromVal, toVal) => {
  if((typeof fromVal === "function") || (typeof toVal === "function")) {
    let fromValFunc = typeof fromVal === "function" ? fromVal : () => fromVal;
    let toValFunc = typeof toVal === "function" ? toVal : () => toVal;
    return dt => d3.interpolate(fromValFunc(), toValFunc())(dt);
  } else {
    return d3.interpolate(fromVal, toVal);
  }    
};

class Transition {
  constructor(setter, duration, interpolator) {
    this.setter = setter;
    this.duration = duration;
    this.interpolator = interpolator;
    this.currentT = 0;
  }

  goto(t) {
    this.currentT = t;
    if(t < this.duration) {
      this.setter(this.interpolator(t / this.duration));
      return -1;
    } else {
      this.setter(this.interpolator(1));
      return t - this.duration;
    }
  }

  forward(dt) {
    return this.goto(this.currentT + dt);
  }
};

const makeTransition = (setter, duration, interpolator) => {
  let t = 0;
  // Returns false when finished, i.e. t >= duration
  return dt => {
    t = Math.min(t + dt, duration);

    setter(interpolator(t / duration));

    return (t < duration);
  };
};


const makeDeltaTransitionFunction = (setter, duration, interpolator) => {
  let t = 0;
  // Returns false when finished, i.e. t >= duration
  return dt => {
    t = Math.min(t + dt, duration);

    setter(interpolator(t / duration));

    return (t < duration);
  };
};

const makeYoyoAnimationFromTransition = (transition) => {
  let t = 0;
  let duration = transition.duration;
  return dt => {
    t = (t + dt) % (duration  * 2);
    const yoyoT = t > duration ?
      (duration * 2) - t :
      t;

    transition.goto(yoyoT);
  };
};

const makeYoyoAnimation = (setter, duration, interpolator) => {
  return makeYoyoAnimationFromTransition(new Transition(setter, duration, interpolator));
};

class TransitionChain {
  constructor(getter, setter) {
    this.transitions = [];
    this.current = 0;
    this.getter = getter;
    this.setter = setter;
    this.duration = 0;
    this.currentT = 0;
  }

  fromTo(duration, fromVal, toVal) {
    this.addTransition(duration, fromVal, toVal);
    return this;
  }

  to(duration, toVal) {
    // This function will memoize initial value first time it is called, i.e. at the start
    // of the transition using it
    let fromValMemoized = false;
    let memoizedFromVal = null;
    const getter = this.getter;
    let fromVal;
    // If it's not the first transition in the chain, the from value is 
    // the merging of the initial value (getter()) and all the last interpolated values
    // of current chain of transitions
    if(this.transitions.length > 0) {
      fromVal = Object.assign.apply(
        Object,
        [
          {},
          getter()
        ].concat(this.transitions.map(
          transition => transition.interpolator(1)
        ))
      );
    } else {
      fromVal = getter();
    }
    this.addTransition(duration, fromVal, toVal);
    return this;
  }

  addTransition(duration, fromVal, toVal) {
    const interpolator = makeInterpolator(fromVal, toVal);
    const transition = new Transition(this.setter, duration, interpolator);
    this.duration += transition.duration;
    this.transitions.push(transition);
  };

  goto(t) {
    // TODO, a bit complex, mainly because of the management of chaining "to" transitions
    // OK, brute force version, really not optimized
    let relativeT = t;
    let currentTransitionIndex = 0;
    while(currentTransitionIndex <= this.transitions.length && relativeT >= 0) {
      const currentTransition = this.transitions[currentTransitionIndex];
      if(relativeT <= currentTransition.duration) {
        currentTransition.goto(relativeT);
        relativeT = -1;
      } else {
        currentTransition.goto(currentTransition.duration);
        relativeT -= currentTransition.duration;
        currentTransitionIndex++;
      }
    }
  }

  forward(dt) {
    while(
      (dt > 0) && 
      (this.current < this.transitions.length)
    ) {
      const transition = this.transitions[this.current];
      dt = transition.forward(dt);
      if(dt >= 0) {
        this.current++;
      }
    }
    return dt;
  }
}

function makeTransitionChain(getter, setter) {
  return new TransitionChain(getter, setter);
}

function transition(obj) {
  return makeTransitionChain(  
    () => obj,
    (newObj) => {Object.assign(obj, newObj);}
  );
}

let manaSourceTransitionChain = transition(styles.manaSourceStyle);
let towerTransitionChain = transition(styles.tower);

class MergedTransitionChain {
  constructor(chains) {
    this.chains = chains;
  }

  fromTo(duration, fromVal, toVal) {
    for(let chain of this.chains) {
      chain.fromTo(duration, fromVal, toVal);
    }
    return this;
  }

  to(duration, toVal) {
    for(let chain of this.chains) {
      chain.to(duration, toVal);
    }
    return this;
  }
}

const merge = chains => new MergedTransitionChain(chains);

merge([manaSourceTransitionChain, towerTransitionChain])
.to(
  0.5,
  {
    strokeWidth : 4
  }
)
.to(
  0.5,
  {
    stroke: 'lightgray'
  }
);

animations["manaSourceStyle"] = makeYoyoAnimationFromTransition(manaSourceTransitionChain);
animations["towerStyle"] = makeYoyoAnimationFromTransition(towerTransitionChain);

const setElementTransitionChain = (key, transitionChain) => {
  animations[key] = (dt) => {
    if(transitionChain.forward(dt) > 0) {
      animationsToRemove.push(key);
    }
  };
};

const addTransition = (key, getter, setter, previous=null) => {
  let transitionChain = new TransitionChain(getter, setter);
  setElementTransitionChain(key, transitionChain);
  return transitionChain;
};

const addArrayItemTransition = (key, array, id, previous=null) => {
  const getter = () => array[id];
  const setter = val => {
    if(val === null) {
      array[id] = null;
    } else {
      array[id] = Object.assign({}, array[id], val);
    }
  };
  return addTransition(key, getter, setter);
};

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

function update(dt) {
  // strokeWidth = strokeWidth + towerStrokeWidthIncrement * dt;
  // if((strokeWidth > 4) || (strokeWidth < 1)) {
  //   towerStrokeWidthIncrement = -towerStrokeWidthIncrement;
  // }
}

const render = (remainingDt, dt) => {
  transaction(() => {
    _.each(animations, animation => {animation(dt);});
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
  let spentDt = 0;
  while(dt > step) {
    spentDt += step;
    dt = dt - step;
    update(step);
    updated = true;
  }
  // Maybe we would want to only render when updated ?
  if(true) {
    render(dt, spentDt);
  }
  last = now;
  requestAnimationFrame(frame); // request the next frame
}

requestAnimationFrame(frame); // start the first frame
