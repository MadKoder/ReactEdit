import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import Bacon from 'baconjs';
import esprima from 'esprima';
import estraverse from 'estraverse';
import escodegen from 'escodegen';

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

function updateComputedExpression(state)
{
  let rotationAst = null;
  try {
    rotationAst = esprima.parse(state.vars.rotation.computed).body[0];
  } catch(e) {
    // Expression cannot be parsed, don't do anything
    return;
  }
  estraverse.replace(rotationAst, {
      enter: function (node, parent) {
        if (node.type === 'Identifier') {
          // We don't want the new node to be traversed
          this.skip();
          // Replace node identifier (e.g. "x") by
          // "window.store.getState().vars.x.value"
          return {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "MemberExpression",
                      "computed": false,
                      "object": {
                        "type": "Identifier",
                        "name": "window"
                      },
                      "property": {
                        "type": "Identifier",
                        "name": "store"
                      }
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "getState"
                    }
                  },
                  "arguments": []
                },
                "property": {
                  "type": "Identifier",
                  "name": "vars"
                }
              },
              "property": {
                "type": "Identifier",
                "name": node.name
              }
            },
            "property": {
              "type": "Identifier",
              "name": "value"
            }
          }
        }
      },
      leave: function (node, parent) {
      }
  });
  let computedString = escodegen.generate(rotationAst);
  
  // Test the expression, it may be invalid
  try {
    (window.execScript || window.eval)(computedString);
  } catch(e) {
    return;
  }

  // The string last character is ";", we don't want it
  computedString = computedString.substring(0, computedString.length - 1);
  let evalStr = "window.updateFunctions['rotation'] = () => {\n" +
    "window.varsActionCreators.setVarValue('rotation', " + computedString + ");};";
    // "window.varsActionCreators.setVarValue('rotation', window.store.getState().vars.tick.value * 2);};";
  (window.execScript || window.eval)(evalStr);
}

updateComputedExpression(state);
let rotateTimer = Bacon.interval(50, 1);
rotateTimer.onValue((val) => {
  let state = store.getState();
  let tick = state.vars.tick.value;
  _.forOwn(updateFunctions, function(func, name) {
    func();
  });
  varsActionCreators.setVarValue("tick", tick + val);
});

let currentValue = null;
store.subscribe(() => {
  let previousValue = currentValue;
  currentValue = store.getState().vars.rotation.computed;

  if (previousValue !== currentValue) {
    updateComputedExpression(store.getState());
  }
});

///////////////////////////////////
///////////////////////////////////
render(
  <Root store={store} />,
  document.getElementById('root')
);
