import { computed, observable } from "mobx";
import _ from 'lodash';

import {boardWidth, boardHeight} from '../common/Constants';

export let towers = observable([]);

export let baseTower = observable({
  col : 8,
  row : 15,
  influenceDist : 3,
  base : true
});

export const makeBoard = f =>
  _.range(boardWidth * boardHeight).map(cellIndex => {
    const row = Math.floor(cellIndex / boardWidth);
    const col = cellIndex % boardWidth;
    return f(col, row, cellIndex);
  });

export let towersBoard = observable(makeBoard((col, row) => null));

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
