import React from 'react';
import { observer } from "mobx-react";

import {cellStyle, hoveredCellStyle, influencedCellStyle} from './Styles';
import {cellWidth, cellHeight} from './Constants';
import {hoveredCellId, handleMouseOver} from './Events';
import {makeCellId} from './Tools';

export const makeCellAttrib = (col, row, style, influence) => ({
  id : makeCellId(col, row),
  col,
  row,
  style : (
    makeCellId(col, row) == hoveredCellId.get() ?
    hoveredCellStyle : 
    (
      influence > 0 ? 
      influencedCellStyle :
      cellStyle
    )
  )
});

export const Cell = observer(({cellAttrib}) => 
  <rect id={"cell-" + cellAttrib.id.toString()} className="cell" style={cellAttrib.style} 
    x={cellAttrib.col * cellWidth} y={cellAttrib.row * cellHeight} width={cellWidth} height={cellHeight}
    onMouseOver={handleMouseOver} onMouseOut={handleMouseOver} cellX={cellAttrib.x} cellY={cellAttrib.y}
  />
);
