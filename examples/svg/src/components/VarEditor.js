import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { evalExpressionString } from '../ast/ast.js';

export default class VarEditor extends Component {

  constructor(props, context) {
    super(props, context);
    this.expressionFocused = false;
    this.valueFocused = false;
    this.computedExpressionElement = null;
  }

  handleExpressionChange(e) {
    if(e.charCode == 13) {
      const {name} = this.props;
      let expressionString = e.target.value;
      let val = evalExpressionString(expressionString);
      if(val !== null) {
        this.props.setVarComputedExpression(name, expressionString);
        this.props.setVarValue(name, val);
      }
      // We don't want enter key to be handled
      e.preventDefault();
      return false;
    }
  }

  handleExpressionFocus(e) {
    this.expressionFocused = true;
  }

  handleExpressionBlur(e) {
    this.expressionFocused = false;
  }

  render() {
    const {value, name, expression} = this.props;
    this.computedExpressionElement = (
      <textarea cols="30" rows="1" defaultValue={expression} onKeyPress={::this.handleExpressionChange} onFocus={::this.handleExpressionFocus} onBlur={::this.handleExpressionBlur}/>)
    return (
    <div className="hGroup">
      <textarea cols="10" rows="1" value={name} disabled/>
      <textarea cols="30" rows="1" value={value} disabled />
      {this.computedExpressionElement}
    </div>);
  }
}
