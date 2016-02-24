import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as TextActions from '../actions/TextActions';
import * as AstActions from '../actions/AstActions';

class CounterApp extends Component {
  render() {
    const { ast, text, dispatch } = this.props;
    return (
      <Counter text={text} ast={ast}
               {...bindActionCreators(TextActions, dispatch)}
               {...bindActionCreators(AstActions, dispatch)}
      />
    );
  }
}

function select(state) {
  return {
    text:state.text,
    ast:state.ast
  };
}

export default connect(select)(CounterApp);
