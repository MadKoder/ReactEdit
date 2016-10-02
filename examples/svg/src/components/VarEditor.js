import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class VarEditor extends Component {

  constructor(props, context) {
    super(props, context);
    this.focused = false;
    this.computedExpressionElement = null;
  }

  handleChange(e) {
    const {name} = this.props;
    this.props.setVarComputedExpression(name, e.target.value);
  }

  handleFocus(e) {
    this.focused = true;
  }

  render() {
    const {value, name, expression} = this.props;
    if(expression !== undefined && !this.focused) {
      this.computedExpressionElement = (
        <textarea cols="30" rows="1" defaultValue={expression} onChange={::this.handleChange} onFocus={::this.handleFocus}/>
      )
    }
    return (
    <div className="hGroup">
      <textarea cols="10" rows="1" value={name} disabled/>
      <textarea cols="30" rows="1" value={value} disabled/>
      {this.computedExpressionElement}
    </div>);
  }
}
