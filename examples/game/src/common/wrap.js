export function wrapObj(obj) {
  let wrapper = (val=undefined) => {
    if(val === undefined) {
      return obj
    } else {
      Object.assign(obj, val);
      return this;
    }
  };
  Object.defineProperty(wrapper, 'x', {
    get: function() {
        return obj;
    },
    set: function(val) {
        Object.assign(obj, val);
        return this;
    },
  });
  return wrapper;
}

export function wrapArrayItem(array, id) {
  let wrapper = (val=undefined) => {
    if(val === undefined) {
      return array[id];
    } else {
      if(val === null) {
        array[id] = null;
      } else {
        array[id] = Object.assign({}, array[id], val);
      }
      return this;
    }
  };
  Object.defineProperty(wrapper, 'x', {
    get: function() {
        return array[id];
    },
    set: function(val) {
      if(val === null) {
        array[id] = null;
      } else {
        array[id] = Object.assign({}, array[id], val);
      }
    }
  });
  return wrapper;
}


export function wrap(arrayOrObj, index=undefined) {
  if(index === undefined) {
    return wrapObj(arrayOrObj);
  } else {
    return wrapArrayItem(arrayOrObj, index);
  }
}

export default wrap;