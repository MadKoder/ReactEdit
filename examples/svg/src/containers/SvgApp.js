import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import * as SvgActions from '../actions/SvgActions';
import * as VarsActions from '../actions/VarsActions';
import * as JsonTreeActions from '../actions/JsonTree';

class SvgApp extends Component {

  render() {
    const { svg, vars, dispatch } = this.props;
    return (
      <Main svg={svg} vars={vars} dispatch={dispatch}
        {...bindActionCreators(SvgActions, dispatch)}
        {...bindActionCreators(VarsActions, dispatch)}
        {...bindActionCreators(JsonTreeActions, dispatch)}
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
