import { observable, action } from 'mobx';

import {influenceMap} from '../state/Board';
import * as towers from '../state/towers';
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
  let tower = towers.towersBoard.get()[cellId]
  if(tower == null) {
    const manaCost = 9;
    if(
      (influenceMap.get()[cellId] > 0) &&
      (state.mana >= manaCost)
    ) {
      towers.towers.push(makeTower(col, row));
      state.mana -= manaCost;
    }
  } else {
    const influenceDist = tower.influenceDist;
    const manaCost = (influenceDist + 1) * (influenceDist + 1);
    if(state.mana >= manaCost)
    {
      tower.influenceDist += 1;
      state.mana -= manaCost; 
    }
  }
});

export const nextTurn = action(() => {
  let mana = state.mana + state.manaIncrement;
  state.mana = Math.min(mana, state.maxMana);
});

onMouseClick(10, 12);