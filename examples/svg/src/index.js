import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import Bacon from 'baconjs';
import esprima from 'esprima';
import estraverse from 'estraverse';
import escodegen from 'escodegen';

import { adaptExpressionToStore } from './ast/ast.js';
import configureStore from './store/configureStore';
import Root from './containers/Root';
import './style/main.css';
import * as SvgActions from './actions/SvgActions';
import * as VarsActions from './actions/VarsActions';

const store = configureStore();

let svgActionCreators = bindActionCreators(SvgActions, store.dispatch);
let varsActionCreators = bindActionCreators(VarsActions, store.dispatch);

window.store = store;
window.svgActionCreators = svgActionCreators;
window.varsActionCreators = varsActionCreators;

let state = store.getState();
// Parsed ast is 
// {
// "type": "Program",
// "body": [
//       {
//           "type": "ExpressionStatement",
//           "expression": {
//               "type": "Identifier",
//               "name": "x"
//           }
//       }
//   ]
// }
// We extract the expression in the body

let updateFunctions = {
};
window.updateFunctions = updateFunctions;

function updateComputedExpression(expression, name)
{
  let expressionString = adaptExpressionToStore(expression);
  if(expressionString === null) {
    return;
  }

  // Test the expression, it may be invalid in the context
  try {
    (window.execScript || window.eval)(expressionString);
  } catch(e) {
    return;
  }
    // The string last character is ";", we don't want it
  expressionString = expressionString.substring(0, expressionString.length - 1);
  let evalStr = "window.updateFunctions['" + name + "'] = () => {\n" +
    "window.varsActionCreators.setVarValue('" + name + "', " + expressionString + ");};";
    // "window.varsActionCreators.setVarValue('rotation', window.store.getState().vars.tick.value * 2);};";
  (window.execScript || window.eval)(evalStr);
}

updateComputedExpression(state.vars.rotation.expression, "rotation");
let rotateTimer = Bacon.interval(50, 1);
rotateTimer.onValue((val) => {
  let state = store.getState();
  let tick = state.vars.tick.value;
  _.forOwn(updateFunctions, function(func, name) {
    func();
  });
  varsActionCreators.setVarValue("tick", tick + val);
  if(tick == 20) {
    // varsActionCreators.addVar("newVar", 20);
    // varsActionCreators.addVar("newComputedVar", null, "tick * 10");
  }
});

// Store subscriber to update computed expressions
let currentExpressions = {};
store.subscribe(() => {
  let previousExpressions = currentExpressions;
  // From computed vars, make a dict from name to expression
  // Filter only var that are computed, and map only the expressions of these vars, i.e.
  // {
  //   computed : {
  //     value : ...
  //     expression : "a * b"
  //   }
  // } => 
  // {
  //   computed : "a * b"
  // }
  let vars = store.getState().vars;
  currentExpressions = _(vars)
    .pickBy((value, name) => {
      return value["computed"];
    })
    .mapValues((value, name) => {
      return value.expression;
    })
    .value();

  // Update new or changed expressions
  _.forOwn(currentExpressions, (expression, name) => {
    let previousExpression = previousExpressions[name];
    // If expression is new or has changed, update it
    if(
      (previousExpression === undefined) ||
      (previousExpression !== expression)
    ) {
      updateComputedExpression(expression, name);
    }
  });
  // Remove update functions for removed expressions
  _.forOwn(previousExpressions, (expression, name) => {
    let currentExpression = vars[name];
    if(
      (currentExpression === undefined) ||
      (!currentExpression.computed)) {
      delete window.updateFunctions[name];
    }
  });
});

///////////////////////////////////
///////////////////////////////////
render(
  <Root store={store} />,
  document.getElementById('root')
);
