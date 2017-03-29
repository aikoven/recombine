import {Action, Reducer} from "redux";

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
export default function dictionaryReducer<S>(
  childReducer: (state: S, action: Action, key: string) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState?: Dict<S>,
): Reducer<Dict<S>>;
export default function dictionaryReducer<S, A1>(
  childReducer: (state: S, action: Action, key: string, arg1: A1) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState?: Dict<S>,
): (state: Dict<S>, action: Action, arg1: A1) => Dict<S>;
export default function dictionaryReducer<S, A1, A2>(
  childReducer: (state: S, action: Action, key: string,
                 arg1: A1, arg2: A2) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState?: Dict<S>,
): (state: Dict<S>, action: Action, arg1: A1, arg2: A2) => Dict<S>;
export default function dictionaryReducer<S, A1, A2, A3>(
  childReducer: (state: S, action: Action, key: string,
                 arg1: A1, arg2: A2, arg3: A3) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState?: Dict<S>,
): (state: Dict<S>, action: Action, arg1: A1, arg2: A2, arg3: A3) => Dict<S>;
export default function dictionaryReducer<S, A1, A2, A3, A4>(
  childReducer: (state: S, action: Action, key: string,
                 arg1: A1, arg2: A2, arg3: A3, arg4: A4, ...rest: any[]) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState?: Dict<S>,
): (state: Dict<S>, action: Action,
    arg1: A1, arg2: A2, arg3: A3, arg4: A4, ...rest: any[]) => Dict<S>;
export default function dictionaryReducer<S>(
  childReducer: (state: S, action: Action, key: string, ...args: any[]) => S,
  addKey?: (action: Action) => string | Falsy,
  removeKey?: (action: Action) => string | Falsy,
  initialState: Dict<S> = {},
) {
  return (state: Dict<S> = initialState, action: Action,
          ...args: any[]): Dict<S> => {
    let hasChanged: boolean = false;
    const nextState: Dict<S> = {};

    const keyToAdd = addKey && addKey(action);

    if (keyToAdd) {
      hasChanged = true;
      nextState[keyToAdd] = childReducer(undefined!, action, keyToAdd, ...args);

      if (nextState[keyToAdd] === undefined)
        throw new Error(`Reducer '${keyToAdd}' returned undefined`);
    }

    const keyToRemove = removeKey && removeKey(action);

    if (keyToRemove)
      hasChanged = true;

    for (let key in state) {
      if (!Object.prototype.hasOwnProperty.call(state, key) ||
          key === keyToRemove)
        continue;

      const itemState = state[key];
      const nextItemState = childReducer(itemState, action, key, ...args);

      if (nextItemState === undefined)
        throw new Error(`Reducer '${key}' returned undefined`);

      nextState[key] = nextItemState;
      hasChanged = hasChanged || nextItemState !== itemState;
    }

    return hasChanged ? nextState : state;
  };
}
