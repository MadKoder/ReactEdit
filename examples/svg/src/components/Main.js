import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Main extends Component {
  static propTypes = {
    svg: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }
  
  handleChange(e) {
  }

  inc(e) {
    this.props.increment();
  }

  dec(e) {
    this.props.decrement();
  }

  render() {
    return (
      <div className="vGroup">
        <hGroup>
          <button onClick={::this.inc}>
          +
          </button>
          <button onClick={::this.dec}>
          -
          </button>
        </hGroup>
        <svg width="120" height="120"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg">
          <rect x={this.props.svg.pos} y="10" width="100" height="100"/>
        </svg>
      </div>
    );
  }
}
