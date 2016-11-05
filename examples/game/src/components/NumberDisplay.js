import React from 'react';
import { observer } from "mobx-react";

import { textBoundingRectStyle, textStyle, innerSvgStyle } from './Styles';

const textBaseLine = 15;
const textBoundingSvgHeight = textBaseLine + 2;
const textBoundingRectHeight = textBoundingSvgHeight;

export const NumberDisplay = observer(({number, width, ...props}) => (
  <svg style={innerSvgStyle} width={width} height={textBoundingSvgHeight} {...props}>
    <text 
      fontFamily="Consolas"
      fontSize="20" style={textStyle} x="1" y={textBaseLine}>
      {number}
    </text>
    <rect style={textBoundingRectStyle} width={width} height={textBoundingRectHeight}/>
  </svg>
));
