import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { evalExpressionString } from '../ast/ast.js';
import VarEditor from '../components/VarEditor';
import * as VarsActions from '../actions/VarsActions';

export default class VarsEditor extends Component {
  static propTypes = {
    vars: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.newVarHistory = [];
    this.newVarHistoryIndex = 1;
  }

  handleNewVar(e) {
    // If enter has been pressed
    if(e.keyCode == 13) {
      let newVarStr = e.target.value;
      let splittedString = _.split(newVarStr, "=");
      // A store var string is of the form "name=value"
      if(splittedString.length == 2) {
        // Evaluate the expression
        let expressionString = _.trim(splittedString[1]);
        let val = evalExpressionString(expressionString);
        if(val !== null) {
          let name = _.trim(splittedString[0]);
          this.props.addVar(name, val, expressionString, false);
          // Reinitialise the input area
          e.target.value = "";
          this.newVarHistory.push(newVarStr);          
          this.newVarHistoryIndex = this.newVarHistory.length;
        }
      } else {
        // A computed string is of the form "name expression", with on or more whitespace between name and expression
        splittedString = _.split(newVarStr, " ");
        if(splittedString.length >= 2) {
          let name = splittedString[0];
          let expression = _.tail(splittedString).join(" ");
          this.props.addVar(name, null, expression, true);
          // Reinitialise the input area
          e.target.value = "";
          this.newVarHistory.push(newVarStr);
          this.newVarHistoryIndex = this.newVarHistory.length;
        }
      }
      // We don't want enter key to be handled
      e.preventDefault();
      return false;
    } else if(e.keyCode == 38) { // Up arrow key
      if(this.newVarHistoryIndex > 0) {
        this.newVarHistoryIndex -= 1;
      }
       e.target.value = this.newVarHistory[this.newVarHistoryIndex];
      // We don't want enter key to be handled
      e.preventDefault();
      return false;
    } else if(e.keyCode == 40) { // Down arrow key
      if(this.newVarHistoryIndex < this.newVarHistory.length) {
        this.newVarHistoryIndex += 1;
      }
      if(this.newVarHistoryIndex < this.newVarHistory.length) {
        e.target.value = this.newVarHistory[this.newVarHistoryIndex];
      } else {
        e.target.value = "";
      }
      // We don't want enter key to be handled
      e.preventDefault();
      return false;
    }
  }

  render() {
    const {vars, dispatch} = this.props;
    let childNodes = [];
    _.forOwn(vars, function(value, key) {
      let varObject = {
        name : key,
        value : value.value,
        expression : value.expression,
        computed : value.computed
      };
      let childNode = <VarEditor key={key} dispatch={dispatch} {...bindActionCreators(VarsActions, dispatch)} {...varObject}/>;
      childNodes.push(childNode);
    });

    return (
      <div className="vGroup">
        {childNodes}
        <textarea cols="40" rows="1" onKeyDown={::this.handleNewVar} autofocus/>
      </div>
    );
  }
}
