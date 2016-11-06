import React from 'react';
import { action } from 'mobx';
import { observer } from "mobx-react";

import {hoveredCellId} from '../common/Actions';
import {influenceMap} from '../state/Board';
import {cellWidth, cellHeight} from './Constants';

const makeStyle = (state, styles) => {
  const influence = influenceMap.get()[state.id];
  return state.id == hoveredCellId.get() ?
    styles.hoveredCellStyle : 
    (
      influence > 0 ? 
      styles.influencedCellStyle :
      styles.cellStyle
    )
};

export const Cell = observer(({state, styles}) => 
  <rect 
    id={"cell-" + state.id.toString()}
    className="cell" 
    style={makeStyle(state, styles)}
    x={state.col * cellWidth}
    y={state.row * cellHeight}
    width={cellWidth}
    height={cellHeight}
  />
);
