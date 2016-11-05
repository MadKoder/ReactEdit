import { observable, action } from 'mobx';

import {towers, influenceMap, towersBoard} from '../state/Board';
import {state} from '../state/State';
import {makeCellId, makeTower} from './Tools';

export let hoveredCellId = observable(-1);

export const onMouseOver = action((col, row) => {
  hoveredCellId.set(makeCellId(col, row));
});

export const onMouseOut = action((col, row) => {
  hoveredCellId.set(-1);
});

export const onMouseClick = action((col, row) => {
  const cellId = makeCellId(col, row);
  if(
    (influenceMap.get()[cellId] > 0) &&
    (towersBoard[cellId] == null) &&
    (state.mana > 1)
  ) {
    let tower = makeTower(col, row);
    towers.push(tower);
    towersBoard[cellId] = tower;
    state.mana -= 2;
  }
});

onMouseClick(10, 12);