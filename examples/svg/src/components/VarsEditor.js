import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import VarEditor from '../components/VarEditor';
import * as VarsActions from '../actions/VarsActions';

export default class VarsEditor extends Component {
  static propTypes = {
    vars: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
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
      </div>
    );
  }
}
