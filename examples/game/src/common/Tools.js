import { observable } from 'mobx';

import {boardWidth, boardHeight} from './Constants';

export const makeCellId = (x, y) => x + (y * boardWidth);

let currentTowerId = 1;

export const makeTower = (col, row, influenceDist=1, base=false) => {
  const id = currentTowerId;
  currentTowerId = id + 1;
  return observable({
    id,
    col,
    row,
    influenceDist,
    base
  });
};

export const vec = (x, y) => ({
  x,
  y
});

export const makeMap = f =>
  _.range(boardWidth * boardHeight).map(cellIndex => {
    const row = Math.floor(cellIndex / boardWidth);
    const col = cellIndex % boardWidth;
    return f(col, row, cellIndex);
  });

// Makes a map of board dimension from a list of elements
// Each element must have row and col attributes
// Each item in the output map is filled with null if no elements
export const makeMapFromList = (list) => {
  let board = _.range(boardWidth * boardHeight).map(() => null);
  _.forEach(list, element => {
    board[makeCellId(element.col, element.row)] = element;
  });
  return board;
};

export const rgb = (r, g, b) =>
  '#' + (0x1000000 + (r * 0x10000) + (g * 0x100) + b).toString(16).slice(1);