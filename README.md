# Recombine [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Utilities for combining Redux reducers

## Installation

```
npm install --save @aikoven/recombine
```

## API

### `combineReducers(reducers: ReducerMapObjectWithExtraArgs): ReducerWithExtraArgs`

Same as original `combineReducers` from Redux but returned reducer accepts extra
arguments and passes them to each child reducer.

**Example**

Construct reducer that manages state where one branch depends on another:

```js
import {combineReducers} from "@aikoven/recombine";

// for regular reducers `combineReducers` behaves exactly the same as original
const firstBranchReducer = combineReducers({
  something(state = ..., action) {/*...*/},
  somethingElse(state = ..., action) {/*...*/},
});

// created reducer forwards any extra args to child reducers
const secondBranchReducer = combineReducers({
  someKey(state = ..., action, firstBranch) {/*...*/},
  anotherKey(state = ..., action, firstBranch) {/*...*/},
});

const reducer = (state = {}, action) => {
  // compute first branch and pass results to the second branch
  const {firstBranch, secondBranch} = state;

  const nextFirstBranch = firstBranchReducer(firstBranch, action);
  const nextSecondBranch = secondBranchReducer(secondBranch, action, nextFirstBranch);

  if (nextFirstBranch !== firstBranch || nextSecondBranch !== secondBranch)
    return {firstBranch: nextFirstBranch, secondBranch: nextSecondBranch};

  return state;
};
```

### `dictionaryReducer(childReducer: Reducer, addKey?: Function, removeKey?: Function, initialState?: Object): Reducer`

Create reducer that manages key-value dictionary state with values of same
shape. Child reducer is called on every action for each dictionary value, and
dictionary key is supplied to the child reducer as third argument.

Any extra arguments for resulting reducer are passed to the child reducer
following dictionary key.

**Parameters**

* `childReducer`:   Reducer for dictionary values. Receives dictionary key as
                    third argument.
* `addKey?`:        Function that will be called on every action to determine
                    whether that action should result in adding a new key to the
                    dictionary, in which case it should return the key.
* `removeKey?`:     Function that will be called on every action to determine
                    whether that action should result in removing a key from the
                    dictionary, in which case it should return the key.
* `initialState = {}`: Initial state for resulting reducer.

## Roadmap

* More documentation covering rationale and use cases.
* More tests

[npm-image]: https://badge.fury.io/js/%40aikoven%2Frecombine.svg
[npm-url]: https://badge.fury.io/js/%40aikoven%2Frecombine
[travis-image]: https://travis-ci.org/aikoven/recombine.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/recombine