import { observable, computed } from 'mobx';

export let cellStyle = observable({
  stroke: '#BA0B0B',
  fill : '#4169E1' // Royal blue
});

export let hoveredCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#018D8D"
}));

export let influencedCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#970808"
}));

export let textStyle={
  fill : "white"
};

export let innerSvgStyle = {
  overflow : "hidden",
  fill : "black",
  background : "black"
};

export let textBoundingRectStyle = {
  stroke : "black",
  fill : "none"
};

export let tower = observable({
  strokeWidth : 1,
  stroke: 'mediumspringgreen',
  fill : 'black'
});

export let baseTower = computed(() => Object.assign({}, tower, {
  fill : "DarkSlateBlue"
}));

export let manaMeterStyle = observable({
  stroke: 'black',
  strokeWidth: 0,
  fill : '#3E0000'
});

export let filledManaMeterStyle = observable(Object.assign({}, manaMeterStyle, {
  // stroke: '#BA0B0B',
  fill : "#92DB01"
}));

export let manaSourceStyle = observable({
  stroke: 'Gold',
  fill : 'none',
  strokeWidth : 1
});

export let styles = observable({
  tower,
  baseTower,
  cellStyle,
  influencedCellStyle,
  hoveredCellStyle,
  manaSourceStyle
});

export default styles;