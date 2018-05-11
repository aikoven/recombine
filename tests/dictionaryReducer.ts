import * as test from "tape";
import {Action} from "redux";
import dictionaryReducer from "../src/dictionaryReducer";

test('dictionaryReducer', assert => {
  type State = Array<{type: string, key: string, arg: string}>;

  const childReducer = (state: State = [], action: Action,
                        key: string, arg: string): State => {
    const {type} = action;

    return [...state, {type, key, arg}];
  };

  const reducer = dictionaryReducer(
    childReducer,
    action => action.type === 'adding' && (action as any).key,
    action => action.type === 'removing' && (action as any).key,
    {
      one: [],
    },
  );

  assert.equal(reducer.childReducer, childReducer);

  let state = reducer(undefined, {type: 'init'}, 'foo');

  assert.deepEqual(state, {one: [{type: 'init', key: 'one', arg: 'foo'}]});

  state = reducer(state, {type: 'adding', key: 'two'} as Action, 'bar');

  assert.deepEqual(state, {
    one: [
      {type: 'init', key: 'one', arg: 'foo'},
      {type: 'adding', key: 'one', arg: 'bar'},
    ],
    two: [
      {type: 'adding', key: 'two', arg: 'bar'},
    ],
  });

  state = reducer(state, {type: 'removing', key: 'one'} as Action, 'baz');

  assert.deepEqual(state, {
    two: [
      {type: 'adding', key: 'two', arg: 'bar'},
      {type: 'removing', key: 'two', arg: 'baz'},
    ],
  });

  assert.end();
});
