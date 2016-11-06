import { computed, observable } from "mobx";
import _ from 'lodash';

import {makeMapFromList} from '../common/Tools';

export let towers = observable([
  {
    id : 0,
    col : 8,
    row : 15,
    influenceDist : 3,
    base : true
  }
]);

export let towersBoard = computed(() => makeMapFromList(towers));

export default towers;