import { computed, observable } from "mobx";
import _ from 'lodash';

import {boardWidth, boardHeight} from '../common/Constants';
import {makeCellId, makeMap, makeMapFromList} from '../common/Tools';
import * as manaSources from "./manaSources";
import * as towers from "./towers";

const influenceLevelOnCell = (cellCol, cellRow, tower) =>
  (
    Math.abs(cellRow - tower.row) <= tower.influenceDist &&
    Math.abs(cellCol - tower.col) <= tower.influenceDist
  ) ? 1 : 0;

export let influenceMap = computed(() =>
  makeMap((col, row) => (
    _.max(
      towers.towers.map(tower =>
        influenceLevelOnCell(col, row, tower)
      )
    )
  ))
);

export let board = computed(() => makeMap((col, row) => ({
  col,
  row,
  id : makeCellId(col, row),
  get influence() {return influenceMap.get()[makeCellId(col,row)];},
  get manaSource() {return manaSources.manaSourcesMap.get()[makeCellId(col,row)];}
})));