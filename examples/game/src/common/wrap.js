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
  wrapper.makeMutator = function(mutator) {
    return (...params) => {
      mutator(wrapper, ...params);
    }
  }
  wrapper.setWrapper = function(func) {
    return func(this);
  }
  return wrapper;
}

export function wrapObjects(objects) {
  let wrapper = (val=undefined) => {
    if(val === undefined) {
      return objects.map(obj => obj.x);
    } else {
      _.each(objects, (obj, index) => {
        Object.assign(obj, val[index]);
      });
      return this;
    }
  };
  Object.defineProperty(wrapper, 'x', {
    get: function() {
      return objects.map(obj => obj.x);
    },
    set: function(val) {
      _.each(objects, (obj, index) => {
        Object.assign(obj, val[index]);
      });
      return this;
    },
  });
  wrapper.objects = objects;
  wrapper.setWrapper = function(funcsMakers, wrappedMutatorMaker) {
    // funcMakers : wrapper => list<(...) => {}>, i.e. 
    // for each object, 
    // Array that, for each objects, gives the array of functions
    let objectToFuncArray = objects.map(obj => funcsMakers(obj));
    // Array that, for each function category, give the array of functions
    let funcToObjectArray = _.zip(...objectToFuncArray);
    return wrappedMutatorMaker(
      funcToObjectArray.map(
        funcs => {
          // Wrapped functions call all the function corresponding to their indices
          return (...params) => {
            _.each(funcs, func => {
              func(...params);
            });
          }
        }
      )
    );
    // return (...params) => {
    //   _.each(objects, (obj, index) => {
    //     Object.assign(obj, val[index]);        
    //   })
    // }
  }
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