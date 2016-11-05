import { observable } from 'mobx';

import {boardWidth} from './Constants';

export const makeCellId = (x, y) => x + (y * boardWidth);

let currentTowerId = 0;

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
