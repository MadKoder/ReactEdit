import React from 'react';
import { action } from 'mobx';
import { observer } from "mobx-react";

import {hoveredCellId} from '../common/Actions';
import {makeCellId} from '../common/Tools';
import {cellStyle, hoveredCellStyle, influencedCellStyle} from './Styles';
import {cellWidth, cellHeight} from './Constants';

export const makeCellAttrib = (col, row, style, influence) => ({
  id : makeCellId(col, row),
  col,
  row,
  influence,
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

export const Cell = observer(({state}) => 
  <rect id={"cell-" + state.id.toString()} className="cell" style={state.style} 
    x={state.col * cellWidth} y={state.row * cellHeight} width={cellWidth} height={cellHeight}
  />
);
