import { add, update, remove, desimplify, simplify } from 'simplifr'
import { ADD_OBJECT, ADD_ARRAY, UPDATE, REMOVE_OBJECT, REMOVE_ARRAY, TOGGLE } from '../actions/JsonTree'
import { SET_ROOT_SVG } from '../constants/ActionTypes';

let initialState = [
  {
    type : "rect",
    pos : 10,
    rotation : 0
  }
];

initialState = simplify(initialState);
// initialState.type = "object";
// initialState.childs = ["root.root"];
// initialState.expanded = true;

export default function svg(state = initialState, action) {
  const { path, value, key } = action

  switch (action.type) {
    case SET_ROOT_SVG:
      return Object.assign({}, state, {
        root : action.svg
      });

    case ADD_OBJECT:
        if (key === '') return state
        return add(Object.assign({}, state), path, { [key]: getValue(value) })

    case ADD_ARRAY:
      return add(Object.assign({}, state), path, getValue(value))

    case UPDATE:
      return Object.assign({}, state, {
        [path]: !isNaN(+value) && isFinite(value) ? +value : value
      })

    case REMOVE_OBJECT:
      return remove(Object.assign({}, state), path)

    case REMOVE_ARRAY:
      const expanded = state[path].expanded
      let array = desimplify(state, path)
      array.splice(key, 1)
      let newState = update(Object.assign({}, state), path, array)
      newState[path].expanded = expanded
      return newState

    case TOGGLE:
      return Object.assign({}, state, {
        [path]: Object.assign({}, state[path], {
          expanded: value === undefined ? !state[path].expanded : value
        })
      })

    default:
      return state;
  }
}


function getValue(value){
  let _ = value
  if (!isNaN(+value) && isFinite(value)) {
    _ = +value
  }
  /* try to parse string to json */
  else {
    try {
      _ = JSON.parse(value)
    } catch (e){}
  }
  return _
}