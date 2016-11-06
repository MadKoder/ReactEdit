import { observable } from "mobx";

export let state = observable({
  mana : 60,
  manaIncrement : 10
});