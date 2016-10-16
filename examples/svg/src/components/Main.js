import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import JsonTree from '../components/JsonTree';
import VarsEditor from '../components/VarsEditor';
import * as VarsActions from '../actions/VarsActions';

const Rectangle = (props) => (
  <rect {...props}>{props.children}</rect>
);

export default class Main extends Component {
  static propTypes = {
    svg: PropTypes.object.isRequired,
    vars: PropTypes.object.isRequired
  };

  inc(e) {
    // this.props.move(this.props.svg.root.pos + 1);
  }

  dec(e) {
    // this.props.move(this.props.svg.pos - 1);
  }

  render() {
    const { dispatch } = this.props;
    const rotation = this.props.vars.rotation.value;
    const pos = 0;
    const tree = this.props.svg;
    const path = "root";
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
        <svg width="1200" height="200" viewBox="0 0 1200 200">
          <Rectangle x={pos} y="0" width="100" height="100" transform={"rotate(" + rotation + ", " + (pos + 50).toString() + ", 50)"}/>
        </svg>
        <VarsEditor vars={this.props.vars} dispatch={dispatch} {...bindActionCreators(VarsActions, dispatch)}/>
        <JsonTree path={path} data={tree[path]} k={path.split(".").pop()} tree={tree} initExpandedLevel={2} {...this.props}/>
      </div>
    );
  }
}
