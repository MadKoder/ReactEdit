import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import * as SvgActions from '../actions/SvgActions';
import * as VarsActions from '../actions/VarsActions';
import Bacon from 'baconjs';
import esprima from 'esprima';
import estraverse from 'estraverse';
import escodegen from 'escodegen';

class SvgApp extends Component {

  constructor(props, context) {
    super(props, context);
    let svgActionCreators = bindActionCreators(SvgActions, props.dispatch);
    let varsActionCreators = bindActionCreators(VarsActions, props.dispatch);
    this.varsActionCreators = varsActionCreators;

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
    let rotationAst = esprima.parse(this.props.vars.rotation.computed).body[0];
    estraverse.replace(rotationAst, {
        enter: function (node, parent) {
          if (node.type === 'Identifier') {
            // We don't want the new node to be traversed
            this.skip();
            // Replace node identifier (e.g. "x") by
            // "window.svgApp.props.vars.x.value"
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
                        "name": "svgApp"
                      }
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "props"
                    }
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
    // The string last character is ";", we don't want it
    computedString = computedString.substring(0, computedString.length - 1);
    window.svgApp = this;
    let evalStr = "function updateRotation() {\n" +
      "window.svgApp.varsActionCreators.setVarValue('rotation', " + computedString + ");};";
      // "window.svgApp.varsActionCreators.setVarValue('rotation', window.svgApp.props.vars.tick.value * 2);};";
    (window.execScript || window.eval)(evalStr);
    let rotateTimer = Bacon.interval(50, 1);
    rotateTimer.onValue((val) => {
      svgActionCreators.rotate(this.props.svg.rotation + val);
      let tick = this.props.vars.tick.value;
      // varsActionCreators.setVarValue("rotation", tick * 2);
      updateRotation();
      varsActionCreators.setVarValue("tick", tick + val);
    });
  }

  render() {
    const { svg, vars, dispatch } = this.props;
    return (
      <Main svg={svg} vars={vars} 
        {...bindActionCreators(SvgActions, dispatch)}
        {...bindActionCreators(VarsActions, dispatch)}
      />
    );
  }
}

function select(state) {
  return {
    svg : state.svg,
    vars : state.vars
  };
}

var connected = connect(select)(SvgApp); 
export default connected;
