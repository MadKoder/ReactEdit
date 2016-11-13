import React from 'react';
import { observable} from 'mobx';
import { observer } from "mobx-react";
import _ from 'lodash';

import {hoveredCellId} from '../common/Actions';
import {influenceMap} from '../state/Board';
import {cellWidth, cellHeight} from './Constants';

export const Cell = observer(({state, styles, style}) =>
  <g id={"cell-" + state.id.toString()} className="cell" >
    <rect 
      style={style}
      x={state.col * cellWidth}
      y={state.row * cellHeight}
      width={cellWidth}
      height={cellHeight}
    />
    {
      state.manaSource !== null ?
      <rect 
        style={Object.assign({}, styles.manaSourceStyle)}
        x={state.col * cellWidth + 2}
        y={state.row * cellHeight + 2}
        width={cellWidth - 4}
        height={cellHeight - 4}
      /> :
      null
    }
  </g>
);
