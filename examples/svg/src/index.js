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

function updateComputedExpression(expression, name)
{
  let ast = null;
  try {
    ast = esprima.parse(expression).body[0];
  } catch(e) {
    // Expression cannot be parsed, don't do anything
    return;
  }
  estraverse.replace(ast, {
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
  let expressionString = escodegen.generate(ast);
  
  // Test the expression, it may be invalid
  try {
    (window.execScript || window.eval)(expressionString);
  } catch(e) {
    return;
  }

  // The string last character is ";", we don't want it
  expressionString = expressionString.substring(0, expressionString.length - 1);
  let evalStr = "window.updateFunctions['rotation'] = () => {\n" +
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
});

// Store subscriber to update computed expressions
let currentExpressions = {};
store.subscribe(() => {
  let previousExpressions = currentExpressions;
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
      return value["expression"] !== undefined;
    })
    .mapValues((value, name) => {
      return value.expression;
    })
    .value();

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
  // Make a list of pairs[name, expression], and partitions them depending if they are new or changed, 
  let newOrChangedAndRemovedExpressions = _(currentExpressions)
    .toPairs()
    .partition(value => {
      let name = value[0];
      return name in previousExpressions;
    })
    .value();
  let newOrChangedExpressions = _.filter
});

///////////////////////////////////
///////////////////////////////////
render(
  <Root store={store} />,
  document.getElementById('root')
);
