import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import * as SvgActions from '../actions/SvgActions';

class SvgApp extends Component {
  render() {
    const { svg, dispatch } = this.props;
    return (
      <Main svg={svg}  
        {...bindActionCreators(SvgActions, dispatch)}
      />
    );
  }
}

function select(state) {
  return {
    svg : state.svg
  };
}

var connected = connect(select)(SvgApp); 
export default connected;
