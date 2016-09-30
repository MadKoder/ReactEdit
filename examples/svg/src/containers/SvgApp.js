import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import * as SvgActions from '../actions/SvgActions';
import * as VarsActions from '../actions/VarsActions';
import Bacon from 'baconjs';

class SvgApp extends Component {

  constructor(props, context) {
    super(props, context);
    let svgActionCreators = bindActionCreators(SvgActions, props.dispatch);
    let varsActionCreators = bindActionCreators(VarsActions, props.dispatch);
    varsActionCreators.setVar("rotation", 0);
    varsActionCreators.setVar("tick", 0);
    let rotateTimer = Bacon.interval(50, 1);
    rotateTimer.onValue((val) => {
      svgActionCreators.rotate(this.props.svg.rotation + val);
      let tick = this.props.vars.tick != undefined ? this.props.vars.tick.value : 0;
      varsActionCreators.setVar("rotation", tick * 2);
      varsActionCreators.setVar("tick", tick + val);
    });
  }

  render() {
    const { svg, vars, dispatch } = this.props;
    return (
      <Main svg={svg} vars={vars} 
        {...bindActionCreators(SvgActions, dispatch)}
        {...bindActionCreators(VarsActions, dispatch)}
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
