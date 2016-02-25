import React, { Component, PropTypes } from 'react';
import TreeNode from './TreeNode';
import _ from 'lodash';
import esprima from 'esprima';
import estraverse from 'estraverse';

function between(x, min, max) {
  return (x >= min) && (x < max);
}

function traverse(ast, cursorPosition) {
  let innerCallExpression = null;
  let innerCallExpressionParent = null;
  console.log(ast);
  estraverse.traverse(ast, {
      enter: function (node, parent) {
        const range = node.range;
        /*if(cursorPosition > range[1]) {
          return estraverse.VisitorOption.Break;
        }*/
        if (node.type === 'CallExpression') {
          if(between(cursorPosition, range[0], range[1]))
          {
            console.log("found 2");
            innerCallExpression = node;
            innerCallExpressionParent = parent;
            console.log("fullce: " + _.toString(innerCallExpression));
            console.log("ce: " + _.toString(innerCallExpression.callee.name));
          }
        }
      },
      leave: function (node, parent) {
      }
  });

  return {
    innerCallExpression,
    innerCallExpressionParent
  }
}

function parseText(text, previousTree, cursorPosition) {
  let evaluatedExpression = "undefined";
  let parsedExpression = "undefined";
  let tree = {};
  try {
    let evaluatedText = 
      "(function(){let __ret = undefined;" +
      "try {__ret = " + text + ";}catch(e){}" +
      "return __ret;})();";
    evaluatedExpression = eval(evaluatedText);
  }
  catch(e) {}
  let innerCallExpression = null;
  let innerCallExpressionParent = null;
  try {
    if(!_.isEmpty(previousTree)) {
      console.log("not empty");

      let traverseResult = traverse(previousTree, cursorPosition);
      innerCallExpression = traverseResult.innerCallExpression;
      console.log("innerCallExpression: " + _.toString(innerCallExpression));
      innerCallExpressionParent = traverseResult.innerCallExpressionParent;
    }

    let jsonExpression = esprima.parse(text, {range: true});
    parsedExpression = JSON.stringify(
      jsonExpression.body[0].expression,
      null,
      4
    );
    tree = jsonExpression.body[0].expression;
  } catch(e) {}

  let fakeInnerCallExpression = {
      "range": [
          0,
          4
      ],
      "type": "CallExpression",
      "callee": {
          "range": [
              0,
              1
          ],
          "type": "Identifier",
          "name": "f"
      },
      "arguments": [
          {
              "range": [
                  2,
                  3
              ],
              "type": "Literal",
              "value": 3,
              "raw": "3"
          }
      ]
    };
  // innerCallExpression = fakeInnerCallExpression;
  return {
    evaluatedExpression,
    parsedExpression,
    tree,
    innerCallExpression
  };
}

export default class Counter extends Component {
  static propTypes = {
    setText: PropTypes.func.isRequired,
    ast: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.cursorPosition = 0;
    this.innerCallExpression = null;
  }
  
  handleChange(e) {
    const { ast } = this.props;


    const {evaluatedExpression, parsedExpression, tree, innerCallExpression} = parseText(e.target.value, ast, e.target.selectionStart);

    this.props.setAst(tree);
    this.props.setText(e.target.value);

    this.cursorPosition = e.target.selectionStart;
    this.innerCallExpression = innerCallExpression;
  }

  render() {
    const { text, ast } = this.props;
  
    // let {evaluatedExpression, parsedExpression, tree} = parseText(text);
    const parsedExpression = JSON.stringify(
      ast,
      null,
      4
    );

    return (
      <div className="vGroup">
        <input 
             type='text'
             autoFocus='true'
             onChange={::this.handleChange}
        />
        <div className="hGroup">
          <textarea cols="50" rows="30" value={parsedExpression} disabled/>
          <TreeNode node={ast} path="" role="root"/>
        </div>
        <div> {this.cursorPosition} </div>
        <div> {this.innerCallExpression !== null ? this.innerCallExpression.callee.name : "none"} </div>
        {/*<div> {evaluatedExpression} </div>*/}
      </div>
    );
  }
}
