import React from 'react';
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import _ from 'lodash';

export const HGroup = observer(({children, ...props}) => 
  <g transform={"translate(" + props.pos.x.toString() + " " + props.pos.y.toString() + ")"} {...props}>
    {children.map((element, index) =>
      <g key={"child-" + index.toString()} transform={"translate(0 " + (props.elementHeight * index) + ")"}>
        {element}
      </g>
    )}
  </g>
);

export default HGroup;