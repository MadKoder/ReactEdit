import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import VarsEditor from '../components/VarsEditor';
import * as VarsActions from '../actions/VarsActions';

export default class Main extends Component {
  static propTypes = {
    svg: PropTypes.object.isRequired,
    vars: PropTypes.object.isRequired
  };

  inc(e) {
    this.props.move(this.props.svg.pos + 1);
  }

  dec(e) {
    this.props.move(this.props.svg.pos - 1);
  }

  render() {
    const { dispatch } = this.props;
    const rotation = this.props.vars.rotation.value;
    return (
      <div className="vGroup">
        <div className="hGroup">
          <button onClick={::this.inc}>
          +
          </button>
          <button onClick={::this.dec}>
          -
          </button>
        </div>
        <svg width="1200" height="120"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg">
          <rect className="draggable" x={this.props.svg.pos} y="0" width="100" height="100" transform={"rotate(" + rotation + ", " + (this.props.svg.pos + 50).toString() + ", 50)"}/>
        </svg>
        <VarsEditor vars={this.props.vars} dispatch={dispatch} {...bindActionCreators(VarsActions, dispatch)}/>
      </div>
    );
  }
}
