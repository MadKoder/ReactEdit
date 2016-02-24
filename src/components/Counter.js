import React, { Component, PropTypes } from 'react';
import TreeNode from './TreeNode';
import _ from 'lodash';
import esprima from 'esprima';

export default class Counter extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    setText: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  };

  handleChange(e) {
    this.props.setText(e.target.value);
  }

  render() {
    const { increment, incrementIfOdd, decrement, counter, text } = this.props;
    /*let protectedExpression = `
      let __result = "undefined";
      try {
        __result = ${text};
      } catch(e) {}
      return __result;`*/
    let evaluatedExpression = "undefined";
    let parsedExpression = "undefined";
    let tree = {};
    try {
      let evaluatedText = 
        "(function(){let __ret = undefined;" +
        "try {__ret = " + text + ";}catch(e){}" +
        "return __ret;})();";
      evaluatedExpression = eval(evaluatedText);
    }
    catch(e) {}
    try {
      let jsonExpression = esprima.parse(text);
      parsedExpression = JSON.stringify(
        jsonExpression.body[0].expression,
        null,
        4
      );
      tree = jsonExpression.body[0].expression;
    } catch(e) {}
    /*{
      "type": "BinaryExpression",
      "operator": "+",
      "left": {
          "type": "Literal",
          "value": 1,
          "raw": "1"
      },
      "right": {
          "type": "Literal",
          "value": 2,
          "raw": "2"
      }
    };*/

    return (
      <div className="vGroup">
        <p>
          Clicked: {counter} times
          {' '}
          <button onClick={increment}>+</button>
          {' '}
          <button onClick={decrement}>-</button>
          {' '}
          <button onClick={incrementIfOdd}>Increment if odd</button>
        </p>
        <input 
             type='text'
             autoFocus='true'
             onChange={::this.handleChange}
        />
        <div className="hGroup">
          <textarea cols="50" rows="20" value={parsedExpression} disabled/>
          <TreeNode node={tree} path="" role="root"/>
        </div>
        <div> {evaluatedExpression} </div>
        <ul>       
          {/*_.range(counter).map(i => (
            <li key={i}>
              <div> {i} </div>
            </li>
          ))*/}
        </ul>
      </div>
    );
  }
}
