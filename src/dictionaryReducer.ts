import {Reducer, Reducer1, Reducer2, Reducer3, Reducer4} from './common';

export type Dict<S> = {[key: string]: S};
export type Falsy = false | null | undefined;

/**
 * Create reducer that manages key-value dictionary state with values of same
 * shape. Child reducer is called on every action for each dictionary value,
 * and dictionary key is supplied to the child reducer as third argument.
 *
 * Any extra arguments for resulting reducer are passed to the child reducer
 * following dictionary key.
 *
 * @param childReducer Reducer for dictionary values. Receives dictionary key as
 *  third argument.
 * @param [addKey] Function that will be called on every action to determine
 *  whether that action should result in adding a new key to the dictionary, in
 *  which case it should return the key.
 * @param [removeKey] Function that will be called on every action to determine
 *  whether that action should result in removing a key from the dictionary, in
 *  which case it should return the key.
 * @param initialState Initial state for resulting reducer.
 * @returns Dictionary reducer.
 *
 * @template S Child reducer state type.
 */
export default function dictionaryReducer<S, A>(
  childReducer: Reducer1<S, A, string>,
  addKey?: (action: A) => string | Falsy,
  removeKey?: (action: A) => string | Falsy,
  initialState?: Dict<S>,
): Reducer<Dict<S>, A> & {
  childReducer: Reducer1<S, A, string>;
};
export default function dictionaryReducer<S, A, T1>(
  childReducer: Reducer2<S, A, string, T1>,
  addKey?: (action: A) => string | Falsy,
  removeKey?: (action: A) => string | Falsy,
  initialState?: Dict<S>,
): Reducer1<Dict<S>, A, T1> & {
  childReducer: Reducer2<S, A, string, T1>;
};

export default function dictionaryReducer<S, A, T1, T2>(
  childReducer: Reducer3<S, A, string, T1, T2>,
  addKey?: (action: A) => string | Falsy,
  removeKey?: (action: A) => string | Falsy,
  initialState?: Dict<S>,
): Reducer2<Dict<S>, A, T1, T2> & {
  childReducer: Reducer3<S, A, string, T1, T2>;
};

export default function dictionaryReducer<S, A, T1, T2, T3>(
  childReducer: Reducer4<S, A, string, T1, T2, T3>,
  addKey?: (action: A) => string | Falsy,
  removeKey?: (action: A) => string | Falsy,
  initialState?: Dict<S>,
): Reducer3<Dict<S>, A, T1, T2, T3> & {
  childReducer: Reducer4<S, A, string, T1, T2, T3>;
};

export default function dictionaryReducer<S, A>(
  childReducer: (
    state: S | undefined,
    action: A,
    key: string,
    ...args: any[],
  ) => S,
  addKey?: (action: A) => string | Falsy,
  removeKey?: (action: A) => string | Falsy,
  initialState: Dict<S> = {},
) {
  return Object.assign(
    (state: Dict<S> = initialState, action: A, ...args: any[]): Dict<S> => {
      let hasChanged: boolean = false;
      const nextState: Dict<S> = {};

      const keyToAdd = addKey && addKey(action);

      if (keyToAdd) {
        hasChanged = true;
        nextState[keyToAdd] = childReducer(
          undefined,
          action,
          keyToAdd,
          ...args,
        );

        if (nextState[keyToAdd] === undefined)
          throw new Error(`Reducer '${keyToAdd}' returned undefined`);
      }

      const keyToRemove = removeKey && removeKey(action);

      if (keyToRemove) hasChanged = true;

      for (let key in state) {
        if (
          !Object.prototype.hasOwnProperty.call(state, key) ||
          key === keyToRemove
        )
          continue;

        const itemState = state[key];
        const nextItemState = childReducer(itemState, action, key, ...args);

        if (nextItemState === undefined)
          throw new Error(`Reducer '${key}' returned undefined`);

        nextState[key] = nextItemState;
        hasChanged = hasChanged || nextItemState !== itemState;
      }

      return hasChanged ? nextState : state;
    },
    {childReducer},
  );
}
