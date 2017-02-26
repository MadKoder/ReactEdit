import * as d3 from "d3-interpolate";
import * as d3_ease from "d3-ease";
import {transaction, observable} from "mobx";
import _ from 'lodash';

Object.assign(d3, d3_ease);

import wrap from './wrap';
import {TransitionChain} from './animations';

export let animations = {};
let animationsToRemove = [];

const setElementTransitionChain = (key, transitionChain) => {
  animations[key] = {
    forward : function(dt) {
      if(transitionChain.forward(dt) > 0) {
        animationsToRemove.push(key);
      }
    }
  };
};

const addTransition = (key, wrapper) => {
  let transitionChain = new TransitionChain(wrapper);
  setElementTransitionChain(key, transitionChain);
  return transitionChain;
};

export const addArrayItemTransition = (key, array, id) => {
  const wrapper = wrap(array, id);
  return addTransition(key, wrapper);
};

function update(dt) {}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

let currentTime = observable(timestamp() / 1000);

const render = (remainingDt, dt) => {
  transaction(() => {
    _.each(animations, animation => {animation.forward(dt);});
    _.each(animationsToRemove, (key) => {delete animations[key];});
    animationsToRemove.length = 0;
    currentTime.set(timestamp() / 1000);
  });
};

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
