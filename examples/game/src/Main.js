import React from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";
import _ from 'lodash';

import './style/main.css';

const nbCellH = 16;
const nbCellV = nbCellH;
const cellWidth = 25;
const cellHeight = cellWidth;
const leftWidth = 100;
const boardWidth = nbCellH * cellWidth + leftWidth;
const boardHeight = nbCellV * cellHeight;

const cellStyle = observable({
  stroke: '#BA0B0B',
  fill : '#970808'
});

const hoveredCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#018D8D"
}));

let hoveredCellId = observable(-1);

const makeCellId = (x, y) => x + (y * nbCellH)

const makeCellAttrib = (x, y, style) => ({
  id : makeCellId(x, y),
  x,
  y,
  style : makeCellId(x, y) == hoveredCellId.get() ? hoveredCellStyle : cellStyle
});

const handleMouseOver = e => {
  const strId = e.target.id;
  if(strId == "baseTower") {
    return true;
  }
  if(e.type == "mouseover") {
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

const manaMeterStyle = observable({
  stroke: 'black',
  strokeWidth: 0,
  fill : '#3E0000'
});

const filledManaMeterStyle = observable(Object.assign({}, manaMeterStyle, {
  // stroke: '#BA0B0B',
  fill : "#92DB01"
}));


const manaMeterHeight = 100;
const manaMeterWidth = 50;
const maxMana = 100;

const textStyle={
  fill : "white"
};

const innerSvgStyle = {
  overflow : "hidden",
  fill : "black",
  background : "black"
}

const textBoundingRectStyle = {
  stroke : "black",
  fill : "none"
}

const textBaseLine = 15;
const textBoundingSvgHeight = textBaseLine + 2;
const textBoundingRectHeight = textBoundingSvgHeight;

const ManaMeter = observer(({mana}) => {
  const filledHeight=manaMeterHeight * (mana / maxMana);
  return (
    <svg x={20} y={manaMeterHeight + 20}>
      <rect 
        width={manaMeterWidth} height={manaMeterHeight} style={manaMeterStyle}
      />
      <rect 
        y={manaMeterHeight - filledHeight} width={manaMeterWidth} height={filledHeight} style={filledManaMeterStyle}
      />
      <svg y={manaMeterHeight + 20} width={manaMeterWidth} height={textBoundingSvgHeight} style={innerSvgStyle}>
        <text 
          fontFamily="Consolas"
          fontSize="20" style={textStyle} x="1" y={textBaseLine}>
          {mana}
        </text>
        <rect style={textBoundingRectStyle} width={manaMeterWidth} height={textBoundingRectHeight}/>
      </svg>
    </svg>
  );
});

const towerStyle = observable({
  stroke: 'mediumspringgreen',
  fill : 'black'
});

const towerAttribs = observable({
  x : nbCellH / 2,
  y : 15,
  style : towerStyle
});

const Tower = observer(({attribs}) => 
  <circle 
    id="baseTower"
    style={attribs.style} 
    cx={(attribs.x * cellWidth) - (cellWidth / 2)}
    cy={(attribs.y * cellHeight) + (cellHeight / 2)}
    r={cellWidth / 3}
    onMouseOver={handleMouseOver} onMouseOut={handleMouseOver}
  />
);

const makeBoardSvg = (cellStyle) => (
  _(_.range(nbCellH * nbCellV).map(cellIndex => {
    const y = Math.floor(cellIndex / nbCellH);
    const x = cellIndex % nbCellH;
    return (
      <Cell key={cellIndex} cellAttrib={makeCellAttrib(x, y, cellStyle)}/>
    )
  }))
  .concat(
    <Tower key="baseTower" attribs={towerAttribs}/>
  )
  .value()
);

const Board = observer(({cellStyle}) => 
  <div>
  <svg xmlns="http://www.w3.org/2000/svg"  y={0} width={boardWidth} height={boardHeight} viewBox={"0 0 " + boardWidth.toString() + " " + boardHeight.toString()}>
    <ManaMeter mana={20} />
    <svg x={manaMeterWidth + 50}>
      {makeBoardSvg(cellStyle)}
    </svg>
  </svg>
  </div>
);

const mainRender = () => {
  render(
    <Board cellStyle={cellStyle}>
    </Board>,
    document.getElementById('root')
  );
}

export default mainRender;