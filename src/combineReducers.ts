import {Reducer, Action} from "redux";


/**
 * Same as original `combineReducers` from Redux but returned reducer accepts
 * extra arguments and passes them to each child reducer.
 *
 * @template R Resulting reducer state type.
 */
export default function combineReducers<S>(reducers: {
  [P in keyof S]: Reducer<S[P]>;
}): Reducer<S> & {
  childReducers: {
    [P in keyof S]: Reducer<S[P]>;
  };
};

export default function combineReducers<S, A1>(reducers: {
  [P in keyof S]: (state: S[P], action: Action, arg1: A1) => S[P];
}): ((state: S, action: Action, arg1: A1) => S) & {
  childReducers: {
    [P in keyof S]: (state: S[P], action: Action, arg1: A1) => S[P];
  };
};

export default function combineReducers<S, A1, A2>(reducers: {
  [P in keyof S]: (state: S[P], action: Action, arg1: A1, arg2: A2) => S[P];
}): ((state: S, action: Action, arg1: A1, arg2: A2) => S) & {
  childReducers: {
    [P in keyof S]: (state: S[P], action: Action, arg1: A1, arg2: A2) => S[P];
  };
};

export default function combineReducers<S, A1, A2, A3>(reducers: {
  [P in keyof S]: (state: S[P], action: Action,
                   arg1: A1, arg2: A2, arg3: A3) => S[P];
}): ((state: S, action: Action, arg1: A1, arg2: A2, arg3: A3) => S) & {
  childReducers: {
    [P in keyof S]: (state: S[P], action: Action,
                     arg1: A1, arg2: A2, arg3: A3) => S[P];
  };
};

export default function combineReducers<S, A1, A2, A3, A4>(reducers: {
  [P in keyof S]: (state: S[P], action: Action,
                   arg1: A1, arg2: A2, arg3: A3, arg4: A4,
                   ...rest: any[]) => S[P];
}): ((state: S, action: Action,
      arg1: A1, arg2: A2, arg3: A3, arg4: A4,
      ...rest: any[]) => S) & {
  childReducers: {
    [P in keyof S]: (state: S[P], action: Action,
                     arg1: A1, arg2: A2, arg3: A3, arg4: A4,
                     ...rest: any[]) => S[P];
  };
};

export default function combineReducers(reducers: {
  [key: string]: <S>(state: S, action: Action, ...args: any[]) => S;
}): <S>(state: S, action: Action, ...args: any[]) => S {
  const reducerKeys = Object.keys(reducers);
  type S = {[key: string]: any};

  return Object.assign(
    (state: S = {}, action: Action, ...args: any[]): S => {
      let hasChanged = false;
      const nextState: S = {};

      for (let key of reducerKeys) {
        const prevKeyState = state[key];
        const nextKeyState = reducers[key](prevKeyState, action, ...args);
        if (nextKeyState === undefined)
          throw new Error(`Reducer '${key}' returned undefined`);

        nextState[key] = nextKeyState;
        hasChanged = hasChanged || nextKeyState !== prevKeyState;
      }

      return hasChanged ? nextState : state;
    },
    {childReducers: reducers},
  );
}
