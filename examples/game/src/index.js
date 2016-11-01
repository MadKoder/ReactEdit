import React from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";
import _ from 'lodash';

import './style/main.css';

const cellStyle = {
  backgroundColor: '#EB0202',
  display: 'inline-block',
  width : "20px",
  height : "20px"
};

const mainStyle = {
  backgroundColor: 'black'
};

const Cell = observer(() => 
  <td>
    <a href="" style={cellStyle}></a>
  </td>
);

const Row = observer(() => 
  <tr className="hGroup">
    {
      _.range(16).map(cellIndex =>
        <Cell key={cellIndex}/>
      )
    }
  </tr>
);

const Board = observer(() => 
  <table>
    <tbody>
      {
        _.range(16).map(rowIndex =>
          <Row key={rowIndex}/>
        )
      }
    </tbody>
  </table>
);

render(
  <Board style={mainStyle}>
  </Board>,
  document.getElementById('root')
);
