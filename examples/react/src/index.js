import React from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from "mobx-react";

let editedText = observable("toto");

const handleKeyDown = e => {
  editedText.set(e.target.value);
};

const LineEdit = () => 
  <textarea cols="40" rows="1" onKeyUp={handleKeyDown} autofocus/>;

const Root = observer(({text, children}) => 
  <div>
    <LineEdit/>
    Test {text.get()}
    {children}
  </div>
  );

const reRender = () => {
  render(
    <Root text={editedText}>
      <div>
        tata
      </div>
    </Root>,
    document.getElementById('root')
  );
};
reRender();