import React, { Component, PropTypes } from 'react';
import TreeNode from './TreeNode';
import _ from 'lodash';
import esprima from 'esprima';

function parseText(text) {
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
  try {
    let jsonExpression = esprima.parse(text, {range: true});
    parsedExpression = JSON.stringify(
      jsonExpression.body[0].expression,
      null,
      4
    );
    tree = jsonExpression.body[0].expression;
  } catch(e) {}

  return {
    evaluatedExpression,
    parsedExpression,
    tree
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
  }
  
  handleChange(e) {
    this.props.setText(e.target.value);
    const {evaluatedExpression, parsedExpression, tree} = parseText(e.target.value);
    this.props.setAst(tree);
    this.cursorPosition = e.target.selectionStart;
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
          <textarea cols="50" rows="20" value={parsedExpression} disabled/>
          <TreeNode node={ast} path="" role="root"/>
        </div>
        <div> {this.cursorPosition} </div>
        {/*<div> {evaluatedExpression} </div>*/}
      </div>
    );
  }
}
