import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import '../style/treeview.css';


export default class TreeNode extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: true
    };
  }

  render() {
    const {node, role, path} = this.props;
    let childNodes = [];
    var classObj;
    let id = path + "_" + role;

    _.forOwn(node, function(value, key) {
      if(key !== "type") {
        let childNode = (_.isNumber(value) || _.isString(value)) ?
          (<li key={key}> {key} : {value} </li>) :
          (<li key={key}> 
              <TreeNode node={value} role={key} path={id}/>
          </li>);

        childNodes.push(childNode);
      }
    });

    return (
      <div>
        <input type="checkbox" className="treeGroup" id={id} defaultChecked/>
        <i className="closedGroup">+</i>
        <i className="openGroup">-</i>
        <label htmlFor={id} className="groupLabel">{role} : {node.type}</label>
        <ul>
          {childNodes}            
        </ul>
      </div>
    );
  }
};

{/*      <div>
        <h5 onClick={::this.toggle} className={classnames(classObj)}>
          {role} : {node.type}
        </h5>
        <ul style={style}>
          {childNodes}
        </ul>
      </div>
*/}