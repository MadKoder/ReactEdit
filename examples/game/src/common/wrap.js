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
  
  // funcsMaker : wrapper => list<(...) => void>, i.e. 
  wrapper.setWrapper = function(funcsMaker) {

    // for each object, make a list of mutator functions
    // Array that, for each objects, gives the array of functions
    // e.g. if 3 objects and funcMakers returns 2 functions :
    // [
    //   [func0ForObj0, func1ForObj0],
    //   [func0ForObj1, func1ForObj1],
    //   [func0ForObj2, func1ForObj2]
    // ]
    let objectToFuncArray = objects.map(obj => funcsMaker(obj));
    // Array that, for each function category, give the array of functions
    // e.g. 
    // [
    //   [func0ForObj0, func0ForObj1, func0ForObj2],
    //   [func1ForObj0, func1ForObj1, func1ForObj2]
    // ]
    let funcToObjectArray = _.zip(...objectToFuncArray);
    // This array contains, for each source function, a function that call 
    // source function on each wrapped object
    // e.g. 
    // [
    //   [(params) => {func0ForObj0(params); func0ForObj1(params); func0ForObj2(params)}],
    //   [(params) => {func1ForObj0(params); func1ForObj1(params); func1ForObj2(params)}]
    // ]
    return funcToObjectArray.map(
      funcs => {
        // Wrapped functions call all the function corresponding to their indices
        return (...params) => {
          _.each(funcs, func => {
            func(...params);
          });
        }
      }
    );
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