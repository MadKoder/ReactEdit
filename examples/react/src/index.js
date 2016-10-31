import React from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";

import './style/main.css';

let initialText = "toto";
let editedText = observable(initialText);

const leftKeyCode = 37;
const rightKeyCode = 39;
const upKeyCode = 38;
const downKeyCode = 40;
const spaceKeyCode = 32;

const documentKeyDownHandle = e => {
  var keyCode = e.keyCode != 0 ? e.keyCode : e.which;  
  if(keyCode == upKeyCode) {
    rotationIncrement += 0.01;
    e.preventDefault();
  } else if(keyCode == downKeyCode) {
    rotationIncrement -= 0.01;
    e.preventDefault();
  }
};

document.addEventListener("keydown", documentKeyDownHandle, false);

const handleKey = e => {
  const id = e.target.id;
  if(id == "text") {
    editedText.set(e.target.value);
  } else {
    const parsed = parseFloat(e.target.value);
    svgAttr.rotationSpeed = isNaN(parsed) ? 1. : parsed;
  }
  return true;
};

const LineEdit = ({initialText, ...props}) =>
  <textarea cols="20" rows="1" defaultValue={initialText} autofocus {...props}/>;

const Root = observer(({text, children}) => 
  <div className="vGroup" onKeyUp={handleKey}>
    <LineEdit id="text" initialText={initialText}/>
    {"Test  : " + text.get()}
    <div className="hGroup">
      Rotation speed : 
      <LineEdit id="rotationSpeed" initialText={svgAttr.rotationSpeed}/>
    </div>
    {children}
  </div>
);

const outerPathStyle = observable({
  fill : "none",
  stroke : "#ff0000",
  strokeWidth : .05
});

let svgAttr = observable({
  outerPathStyle,
  innerPathStyle : Object.assign({}, outerPathStyle, {
    stroke : "#00ffaa",
    strokeWidth : .02
  }),
  rotation : 0,
  rotationSpeed : 2
});

let pos = 0;
let buildRotate = rotation => "rotate(" + rotation + ", " + (pos).toString() + ", 0)";
let pathDrawing = "  M 0 0  C 0.043 0 0.082 -0.035 0.088 -0.088  C 0.095 -0.145 0.064 -0.209 0 -0.25  C -0.07 -0.295 -0.169 -0.304 -0.265 -0.265  C -0.371 -0.222 -0.459 -0.127 -0.5 0  C -0.544 0.139 -0.526 0.3 -0.442 0.442  C -0.351 0.595 -0.192 0.709 0 0.75  C 0.206 0.794 0.431 0.749 0.619 0.619  C 0.819 0.48 0.959 0.258 1 0  C 1.043 -0.273 0.972 -0.561 0.795 -0.795  C 0.61 -1.043 0.324 -1.209 0 -1.25  C -0.339 -1.293 -0.691 -1.195 -0.972 -0.972  C -1.266 -0.739 -1.459 -0.390 -1.5 0  C -1.543 0.406 -1.419 0.821 -1.149 1.149  C -0.869 1.49 -0.456 1.709 0 1.75  C 0.472 1.793 0.95 1.642 1.326 1.326  C 1.713 0.999 1.958 0.522 2 0  C 2.043 -0.538 1.866 -1.08 1.503 -1.503  C 1.129 -1.937 0.589 -2.208 0 -2.25  C -0.605 -2.293 -1.21 -2.09 -1.679 -1.679  C -2.161 -1.259 -2.458 -0.655 -2.5 0  C -2.543 0.671 -2.313 1.34 -1.856 1.856  C -1.388 2.384 -0.721 2.708 0 2.75  C 0.737 2.793 1.47 2.537 2.033 2.033  C 2.608 1.518 2.958 0.788 3 0"

const Svg = observer(({svgAttr}) => 
  <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="650px" height="600px" viewBox="-3 -2.75 6.5 6">
    <path style={svgAttr.outerPathStyle} d={pathDrawing} transform={buildRotate(svgAttr.rotation * svgAttr.rotationSpeed)}/>
    <path style={svgAttr.innerPathStyle} d={pathDrawing} transform={buildRotate(svgAttr.rotation * svgAttr.rotationSpeed)}/>
  </svg>
);

let growing = true;
let rotationIncrement = 1;

setInterval(
  () => {
    svgAttr.rotation = svgAttr.rotation + rotationIncrement;
    let width = svgAttr.outerPathStyle.strokeWidth + (growing ? .001 : -0.002);
    if(width > 0.2) {
      growing = false;
    } else if(width < 0.05) {
      growing = true;
    }
    svgAttr.outerPathStyle = Object.assign({}, svgAttr.outerPathStyle, {
      strokeWidth : width
    });
  },
  20
);

const reRender = () => {
  render(
    <Root text={editedText}>
      <Svg svgAttr={svgAttr}/>
    </Root>,
    document.getElementById('root')
  );
};
reRender();