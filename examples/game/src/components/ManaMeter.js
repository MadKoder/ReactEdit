import React from 'react';
import { observer } from "mobx-react";

import { manaMeterStyle, filledManaMeterStyle, textBoundingRectStyle, textStyle, innerSvgStyle } from './Styles';
import { NumberDisplay } from './NumberDisplay';

const manaMeterHeight = 100;
export const manaMeterWidth = 50;

export const ManaMeter = observer(({state, ...props}) => {
  const mana = state.mana;
  const filledHeight = manaMeterHeight * (mana / state.maxMana);
  return (
    <svg {...props}>
      <rect 
        width={manaMeterWidth} height={manaMeterHeight} style={manaMeterStyle}
      />
      <rect 
        y={manaMeterHeight - filledHeight} width={manaMeterWidth} height={filledHeight} style={filledManaMeterStyle}
      />
      <NumberDisplay number={state.mana} y={manaMeterHeight + 20} width={manaMeterWidth} />
      <NumberDisplay number={"+" + state.manaIncrement} y={manaMeterHeight + 40} width={manaMeterWidth} />
    </svg>
  );
});
