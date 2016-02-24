import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import * as TextActions from '../actions/TextActions';

class CounterApp extends Component {
  render() {
    const { counter, text, dispatch } = this.props;
    return (
      <Counter counter={counter} text={text}
               {...bindActionCreators(CounterActions, dispatch)}
               {...bindActionCreators(TextActions, dispatch)} />
    );
  }
}

function select(state) {
  return {
    counter: state.counter,
    text:state.text
  };
}

export default connect(select)(CounterApp);
