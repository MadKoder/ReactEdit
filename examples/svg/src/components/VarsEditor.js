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
  }

  handleNewVar(e) {
    // If enter has been pressed
    if(e.charCode == 13) {
      let newVarStr = e.target.value;
      // A store var string is of the form "name=value"
      let splittedString = _.split(newVarStr, "=");
      if(splittedString.length == 2) {
        // Evaluate the expression
        let expressionString = splittedString[1];
        let val = evalExpressionString(expressionString);
        if(val !== null) {
          let name = splittedString[0];
          this.props.addVar(name, val);
          // Reinitialise the input area
          e.target.value = "";
        }
      } else {
        // A computed string is of the form "name expression", with on or more whitespace between name and expression
        splittedString = _.split(newVarStr, " ");
        if(splittedString.length >= 2) {
          let name = splittedString[0];
          let expression = _.tail(splittedString).join(" ");
          this.props.addVar(name, null, expression);
          // Reinitialise the input area
          e.target.value = "";
        }
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
        expression : value.expression
      };
      let childNode = <VarEditor key={key} dispatch={dispatch} {...bindActionCreators(VarsActions, dispatch)} {...varObject}/>;
      childNodes.push(childNode);
    });

    return (
      <div className="vGroup">
        {childNodes}
        <textarea cols="40" rows="1" onKeyPress={::this.handleNewVar} autofocus/>
      </div>
    );
  }
}
