import React from 'react';
import { action } from 'mobx';
import { observer } from "mobx-react";

import {towers, makeTower} from '../state/Board';
import {onMouseOver, onMouseOut, onMouseClick, hoveredCellId} from '../common/Actions';
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

const makeHandleMouse = (state) =>
  action(e => {
    if(e.type == "mouseover") {
      onMouseOver(state.col, state.row);
    } else if(e.type == "mouseout") {
      onMouseOut(state.col, state.row);
    } else {
      onMouseClick(state.col, state.row);
    }
    return true;
  });

export const Cell = observer(({state}) => 
  <rect id={"cell-" + state.id.toString()} className="cell" style={state.style} 
    x={state.col * cellWidth} y={state.row * cellHeight} width={cellWidth} height={cellHeight}
    onMouseOver={makeHandleMouse(state)}
    onMouseOut={makeHandleMouse(state)}
    onMouseDown={makeHandleMouse(state)}
  />
);
