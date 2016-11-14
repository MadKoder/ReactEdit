import * as d3 from "d3-interpolate";
import * as d3_ease from "d3-ease";
import _ from 'lodash';

Object.assign(d3, d3_ease);

import * as actions from './Actions';
import wrap from './wrap';

class Transition {
  constructor(wrapper, duration, interpolator) {
    this.wrapper = wrapper;
    this.duration = duration;
    this.interpolator = interpolator;
    this.currentT = 0;
  }

  goto(t) {
    this.currentT = t;
    if(t < this.duration) {
      this.wrapper(this.interpolator(t / this.duration));
      return -1;
    } else {
      this.wrapper(this.interpolator(1));
      return t - this.duration;
    }
  }

  forward(dt) {
    return this.goto(this.currentT + dt);
  }
};

export function makeYoyoAnimationFromTransition(transition) {
  let t = 0;
  let duration = transition.duration;
  return {
    forward : function(dt) {
      t = (t + dt) % (duration  * 2);
      const yoyoT = t > duration ?
        (duration * 2) - t :
        t;

      transition.goto(yoyoT);
    }
  };
};

const makeYoyoAnimation = (setter, duration, interpolator) => {
  return makeYoyoAnimationFromTransition(new Transition(setter, duration, interpolator));
};

// If fromVal or toVal is a function, the interpolator calls them each time it is called
const makeInterpolator = (fromVal, toVal) => {
  const ease = d3.easeLinear;
  // const ease = t => t;
  if((typeof fromVal === "function") || (typeof toVal === "function")) {
    let fromValFunc = typeof fromVal === "function" ? fromVal : () => fromVal;
    let toValFunc = typeof toVal === "function" ? toVal : () => toVal;
    return t => d3.interpolate(fromValFunc(), toValFunc())(ease(t));
  } else {
    const interpolator = d3.interpolate(fromVal, toVal);
    return t => interpolator(ease(t));
    // return d3.interpolate(fromVal, toVal);
  }    
};

export class TransitionChain {
  constructor(wrapper) {
    this.transitions = [];
    this.current = 0;
    this.wrapper = wrapper;
    this.duration = 0;
    this.currentT = 0;
  }

  fromTo(duration, fromVal, toVal) {
    this.addTransition(duration, fromVal, toVal);
    return this;
  }

  to(duration, toVal) {
    const wrapper = this.wrapper;
    let fromVal;
    // If it's not the first transition in the chain, the from value is 
    // the merging of the initial value (wrapper()) and all the last interpolated values
    // of current chain of transitions
    if(this.transitions.length > 0) {
      fromVal = Object.assign.apply(
        Object,
        [
          {},
          wrapper()
        ].concat(this.transitions.map(
          transition => transition.interpolator(1)
        ))
      );
    } else {
      fromVal = wrapper();
    }
    this.addTransition(duration, fromVal, toVal);
    return this;
  }

  addTransition(duration, fromVal, toVal) {
    const interpolator = makeInterpolator(fromVal, toVal);
    const transition = new Transition(this.wrapper, duration, interpolator);
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

export function transition(obj) {
  const wrapper = wrap(obj);
  return new TransitionChain(wrapper);
}

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

export const merge = chains => new MergedTransitionChain(chains);

