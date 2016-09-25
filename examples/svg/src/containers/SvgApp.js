import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import * as SvgActions from '../actions/SvgActions';
import Bacon from 'baconjs';

class SvgApp extends Component {

  constructor(props, context) {
    super(props, context);    
    let rotateTimer = Bacon.interval(50, 2);
    rotateTimer.onValue((val) => {
      this.props.dispatch(SvgActions.rotate(this.props.svg.rotation + val));
    });
  }

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
