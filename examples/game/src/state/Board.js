import { computed, observable } from "mobx";
import _ from 'lodash';

import {boardWidth, boardHeight} from '../common/Constants';

let currentId = 1;
export let towers = observable([
  {
    id : 0,
    col : 12,
    row : 5,
    influenceDist : 1
  }
]);

export let baseTower = observable({
  col : 8,
  row : 15,
  influenceDist : 3
});

export const makeTower = (col, row) => ({
  id : currentId++,
  col,
  row,
  influenceDist : 1
})

export const makeBoard = f =>
  _.range(boardWidth * boardHeight).map(cellIndex => {
    const row = Math.floor(cellIndex / boardWidth);
    const col = cellIndex % boardWidth;
    return f(col, row, cellIndex);
  });

const influenceLevelOnCell = (cellCol, cellRow, tower) =>
  (
    Math.abs(cellRow - tower.row) <= tower.influenceDist &&
    Math.abs(cellCol - tower.col) <= tower.influenceDist
  ) ? 1 : 0;

export let influenceMap = computed(() =>
  makeBoard((col, row) => (
    _.max(
      [influenceLevelOnCell(col, row, baseTower)]
      .concat(
        towers.map(tower =>
          influenceLevelOnCell(col, row, tower)
        )
      )
    )
  ))
);
