import { observable } from 'mobx';

export const cellStyle = observable({
  stroke: '#BA0B0B',
  fill : 'Wheat'
});

export const hoveredCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#018D8D"
}));

export const influencedCellStyle = observable(Object.assign({}, cellStyle, {
  fill : "#970808"
}));

export const textStyle={
  fill : "white"
};

export const innerSvgStyle = {
  overflow : "hidden",
  fill : "black",
  background : "black"
};

export const textBoundingRectStyle = {
  stroke : "black",
  fill : "none"
};

export const towerStyle = observable({
  stroke: 'mediumspringgreen',
  fill : 'black'
});

export const manaMeterStyle = observable({
  stroke: 'black',
  strokeWidth: 0,
  fill : '#3E0000'
});

export const filledManaMeterStyle = observable(Object.assign({}, manaMeterStyle, {
  // stroke: '#BA0B0B',
  fill : "#92DB01"
}));