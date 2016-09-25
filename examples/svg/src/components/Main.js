import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Bacon from 'baconjs';

export default class Main extends Component {
  static propTypes = {
    svg: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.moveBus = new Bacon.Bus();
    let moveTimer = Bacon.interval(1000, 2);
    let mergedMove = moveTimer.merge(this.moveBus);
    mergedMove.onValue((val) => {
      this.props.move(this.props.svg.pos + val);
    });
  }
  
  handleChange(e) {
  }

  inc(e) {
    this.moveBus.push(1);
    // this.props.increment();
  }

  dec(e) {
    this.moveBus.push(-1);
    // this.props.decrement();
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
        <svg width="1200" height="120"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg">
          <rect x={this.props.svg.pos} y="10" width="100" height="100"/>
        </svg>
      </div>
    );
  }
}
