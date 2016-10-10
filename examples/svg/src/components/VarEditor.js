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

  handleValueChange(e) {
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

  handleValueFocus(e) {
    this.valueFocused = true;
  }

  handleValueBlur(e) {
    this.valueFocused = false;
  }

  render() {
    const {value, name, expression, computed} = this.props;
    // if(expression === undefined) {
    //   this.computedExpressionElement = null;
    // } else if(!this.expressionFocused) {
    //   this.computedExpressionElement = (
    //     <textarea cols="30" rows="1" defaultValue={expression} onKeyPress={::this.handleExpressionChange} onFocus={::this.handleExpressionFocus}/>
    //   )
    // }
    this.computedExpressionElement = (
      <textarea cols="30" rows="1" defaultValue={expression} onKeyPress={::this.handleExpressionChange} onFocus={::this.handleExpressionFocus} onBlur={::this.handleExpressionBlur}/>)
    return (
    <div className="hGroup">
      <textarea cols="10" rows="1" value={name} disabled/>
      <textarea cols="30" rows="1" defaultValue={value} value={this.valueFocused ? undefined : value} onChange={::this.handleValueChange}  onKeyPress={::this.handleValueChange} 
        disabled onFocus={::this.handleValueFocus} onBlur={::this.handleValueBlur}/>
      {this.computedExpressionElement}
    </div>);
  }
}
