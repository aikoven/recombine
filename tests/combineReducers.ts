import * as test from "tape";
import {Action} from "redux";
import combineReducers from "../src/combineReducers";


test('combineReducers', assert => {
  const reducers = {
    one(state: string = '', action: Action,
        arg1: string, arg2: number): string {
      if (action.type === 'MyType') {
        return `one-${arg1}-${arg2}`;
      }

      return state;
    },
    two(state: number = 0, action: Action,
        arg1: string, arg2: number): number {
      if (action.type === 'MyType') {
        return state + arg2;
      }

      return state;
    },
  };

  const reducer = combineReducers(reducers);

  assert.deepEqual(reducer.childReducers, reducers);

  let state = reducer(undefined!, {type: 'init'}, 'foo', 1);

  assert.deepEqual(state, {one: '', two: 0});

  state = reducer(state, {type: 'MyType'}, 'bar', 42);

  assert.deepEqual(state, {one: 'one-bar-42', two: 42});

  assert.end();
});
