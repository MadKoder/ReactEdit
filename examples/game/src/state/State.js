import { observable } from "mobx";
import _ from 'lodash';

import {board} from "./Board";
import * as manaSources from "./manaSources";
import * as towers from "./towers";

const baseManaIncrement = 10;

const makeManaIncrement = () => (
  baseManaIncrement +
  _(towers.towers)
  .filter(tower => _.some(manaSources.manaSources, manaSource => (
    tower.col === manaSource.col &&
    tower.row === manaSource.row
  )))
  .map(tower => 5)
  .sum()
);

export let state = observable({
  mana : 60,
  maxMana : 200,
  get towers() {return towers.towers;},
  get manaIncrement() {return makeManaIncrement();},
  get manaSources() {return manaSources.manaSources;},
  get manaSourcesMap() {return manaSources.manaSourcesMap;},
  get board() {return board;}
});