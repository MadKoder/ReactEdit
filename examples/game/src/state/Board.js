import { computed, observable } from "mobx";
import _ from 'lodash';

import {boardWidth, boardHeight} from '../common/Constants';
import {makeCellId} from '../common/Tools';

export const makeBoard = f =>
  _.range(boardWidth * boardHeight).map(cellIndex => {
    const row = Math.floor(cellIndex / boardWidth);
    const col = cellIndex % boardWidth;
    return f(col, row, cellIndex);
  });

export let towers = observable([]);

export let towersBoard = computed(() => {
  let board = _.range(boardWidth * boardHeight).map(() => null);
  _.forEach(towers, tower => {
    board[makeCellId(tower.col, tower.row)] = tower;
  });
  return board;
});

export let baseTower = observable({
  col : 8,
  row : 15,
  influenceDist : 3,
  base : true
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
