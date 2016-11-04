import React from 'react';
import { observer } from "mobx-react";

import { manaMeterStyle, filledManaMeterStyle, textBoundingRectStyle, textStyle, innerSvgStyle } from './Styles';

const textBaseLine = 15;
const textBoundingSvgHeight = textBaseLine + 2;
const textBoundingRectHeight = textBoundingSvgHeight;
const manaMeterHeight = 100;
export const manaMeterWidth = 50;
const maxMana = 100;

export const ManaMeter = observer(({mana}) => {
  const filledHeight = manaMeterHeight * (mana / maxMana);
  return (
    <svg x={20} y={manaMeterHeight + 20}>
      <rect 
        width={manaMeterWidth} height={manaMeterHeight} style={manaMeterStyle}
      />
      <rect 
        y={manaMeterHeight - filledHeight} width={manaMeterWidth} height={filledHeight} style={filledManaMeterStyle}
      />
      <svg y={manaMeterHeight + 20} width={manaMeterWidth} height={textBoundingSvgHeight} style={innerSvgStyle}>
        <text 
          fontFamily="Consolas"
          fontSize="20" style={textStyle} x="1" y={textBaseLine}>
          {mana}
        </text>
        <rect style={textBoundingRectStyle} width={manaMeterWidth} height={textBoundingRectHeight}/>
      </svg>
    </svg>
  );
});
