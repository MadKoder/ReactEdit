import React from 'react';
import { observer } from "mobx-react";

import {cellStyle, hoveredCellStyle} from './Styles';
import {nbCellH, nbCellV, cellWidth, cellHeight} from './Constants';
import {hoveredCellId, handleMouseOver} from './Events'

const makeCellId = (x, y) => x + (y * nbCellH);

export const makeCellAttrib = (x, y, style) => ({
  id : makeCellId(x, y),
  x,
  y,
  style : makeCellId(x, y) == hoveredCellId.get() ? hoveredCellStyle : cellStyle
});

export const Cell = observer(({cellAttrib}) => 
  <rect id={"cell-" + cellAttrib.id.toString()} className="cell" style={cellAttrib.style} 
    x={cellAttrib.x * cellWidth} y={cellAttrib.y * cellHeight} width={cellWidth} height={cellHeight}
    onMouseOver={handleMouseOver} onMouseOut={handleMouseOver} cellX={cellAttrib.x} cellY={cellAttrib.y}
  />
);
