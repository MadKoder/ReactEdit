import {observable, computed} from "mobx";

import {boardWidth, boardHeight} from '../common/Constants';
import {makeMapFromList} from '../common/Tools';

const makeManaSource = (col, row) => ({
  col,
  row
});

export let manaSources = observable([
  makeManaSource(10, 11),
  makeManaSource(15, 8),
  makeManaSource(2, 14),
]);

export let manaSourcesMap = computed(() => makeMapFromList(manaSources));

export default manaSources;