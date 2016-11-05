import React from 'react';
import { observer } from "mobx-react";

import { manaMeterStyle, filledManaMeterStyle, textBoundingRectStyle, textStyle, innerSvgStyle } from './Styles';
import { NumberDisplay } from './NumberDisplay';

const manaMeterHeight = 100;
export const manaMeterWidth = 50;
const maxMana = 100;

export const ManaMeter = observer(({mana, ...props}) => {
  const filledHeight = manaMeterHeight * (mana / maxMana);
  return (
    <svg {...props}>
      <rect 
        width={manaMeterWidth} height={manaMeterHeight} style={manaMeterStyle}
      />
      <rect 
        y={manaMeterHeight - filledHeight} width={manaMeterWidth} height={filledHeight} style={filledManaMeterStyle}
      />
      <NumberDisplay number={mana} y={manaMeterHeight + 20} width={manaMeterWidth} />
    </svg>
  );
});
