import { observable, action } from 'mobx';

import {towers, makeTower, influenceMap} from '../state/Board';
import {makeCellId} from './Tools';

export let hoveredCellId = observable(-1);

export const onMouseOver = action((col, row) => {
  hoveredCellId.set(makeCellId(col, row));
});

export const onMouseOut = action((col, row) => {
  hoveredCellId.set(-1);
});

export const onMouseClick = action((col, row) => {
  if(influenceMap.get()[makeCellId(col, row)] > 0) {
    towers.push(makeTower(col, row))
  }
});