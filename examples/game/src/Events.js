import { observable } from 'mobx';

export let hoveredCellId = observable(-1);

export const handleMouseOver = e => {
  const strId = e.target.id;
  if(strId == "baseTower") {
    return true;
  }
  if(e.type == "mouseover") {
    let splittedString = _.split(strId, "-");
    hoveredCellId.set(parseInt(splittedString[1]));
  } else {
    hoveredCellId.set(-1);
  }
  return true;
};
