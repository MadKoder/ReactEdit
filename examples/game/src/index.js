import React from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";
import _ from 'lodash';

import './style/main.css';

const nbCellH = 16;
const nbCellV = nbCellH;
const cellWidth = 20;
const cellHeight = cellWidth;
const boardWidth = nbCellH * cellWidth;
const boardHeight = nbCellV * cellHeight;

const cellStyle = observable({
  stroke: '#608D08',
  fill : '#BA0B0B'
});

const hoveredCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#018D8D"
}));

const mainStyle = {
  backgroundColor: '#808080'
};

let hoveredCellId = observable(-1);

const makeCellId = (x, y) => x + (y * nbCellH)

const makeCellAttrib = (x, y, style) => ({
  id : makeCellId(x, y),
  x,
  y,
  style : makeCellId(x, y) == hoveredCellId.get() ? hoveredCellStyle : cellStyle
});

const handleMouseOver = e => {
  if(e.type == "mouseover") {  
    const strId = e.target.id;
    let splittedString = _.split(strId, "-");
    hoveredCellId.set(parseInt(splittedString[1]));
  } else {
    hoveredCellId.set(-1);
  }
  return true;
};

const Cell = observer(({cellAttrib}) => 
  <rect id={"cell-" + cellAttrib.id.toString()} className="cell" style={cellAttrib.style} 
    x={cellAttrib.x * cellWidth} y={cellAttrib.y * cellHeight} width={cellWidth} height={cellHeight}
    onMouseOver={handleMouseOver} onMouseOut={handleMouseOver} cellX={cellAttrib.x} cellY={cellAttrib.y}
  />
);

const Board = observer(({cellStyle}) => 
  <svg width={boardWidth} height={boardHeight} viewBox={"0 0 " + boardWidth.toString() + " " + boardHeight.toString()}>
    {
      _.range(nbCellH * nbCellV).map(cellIndex => {
        const y = Math.floor(cellIndex / nbCellH);
        const x = cellIndex % nbCellH;
        return (
          <Cell key={cellIndex} cellAttrib={makeCellAttrib(x, y, cellStyle)}/>
        )
      })
    }
  </svg>
);

render(
  <Board style={mainStyle} cellStyle={cellStyle}>
  </Board>,
  document.getElementById('root')
);
