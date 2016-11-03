import { observable, action } from 'mobx';

export let hoveredCellId = observable(-1);

export const handleMouseOver = action(e => {
  if(e.type == "mouseover") {
    const strId = e.target.id;
    let splittedString = _.split(strId, "-");
    hoveredCellId.set(parseInt(splittedString[1]));
  } else {
    hoveredCellId.set(-1);
  }
  return true;
});
