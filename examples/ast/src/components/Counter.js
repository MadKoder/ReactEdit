import React, { Component, PropTypes } from 'react';
import TreeNode from './TreeNode';
import _ from 'lodash';
import esprima from 'esprima';
import estraverse from 'estraverse';

function between(x, min, max) {
  return (x >= min) && (x < max);
}

// Retourne le nom de la fonction la plus interne dans laquelle est le curseur, ainsi que son parent
// Ex: f(g([curseur]) -> g, f
function traverse(ast, cursorPosition) {
  let innerCallExpression = null;
  let innerCallExpressionParent = null;
  console.log(ast);
  estraverse.traverse(ast, {
      enter: function (node, parent) {
        const range = node.range;
        if (node.type === 'CallExpression') {
          if(between(cursorPosition, range[0], range[1]))
          {
            innerCallExpression = node;
            innerCallExpressionParent = parent;
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
    let jsonExpression = esprima.parse(text, {range: true});
    parsedExpression = JSON.stringify(
      jsonExpression.body[0].expression,
      null,
      4
    );
    tree = jsonExpression.body[0].expression;
  } catch(e) {}

  if(!_.isEmpty(tree)) {
    ({innerCallExpression, innerCallExpressionParent} = traverse(tree, cursorPosition));
  }

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
    this.evaluatedExpression = null;
  }
  
  handleChange(e) {
    const { ast } = this.props;


    const {evaluatedExpression, parsedExpression, tree, innerCallExpression} = parseText(e.target.value, ast, e.target.selectionStart);

    this.props.setAst(tree);
    this.props.setText(e.target.value);

    this.cursorPosition = e.target.selectionStart;
    this.innerCallExpression = innerCallExpression;
    this.evaluatedExpression = evaluatedExpression;
  }

  render() {
    const { text, ast } = this.props;
  
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
        <div> Cursor position : {this.cursorPosition} </div>
        <div> Inner call expression : {this.innerCallExpression !== null ? this.innerCallExpression.callee.name : "none"} </div>
        <div> Evaluated expression : {this.evaluatedExpression} </div>
      </div>
    );
  }
}
