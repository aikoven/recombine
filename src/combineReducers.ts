import {Reducer, Reducer1, Reducer2, Reducer3} from './common';

/**
 * Same as original `combineReducers` from Redux but returned reducer accepts
 * extra arguments and passes them to each child reducer.
 *
 * @template R Resulting reducer state type.
 */
export default function combineReducers<S, A>(
  reducers: {[P in keyof S]: Reducer<S[P], A>},
): Reducer<S, A> & {
  childReducers: {[P in keyof S]: Reducer<S[P], A>};
};

export default function combineReducers<S, A, T1>(
  reducers: {[P in keyof S]: Reducer1<S[P], A, T1>},
): Reducer1<S, A, T1> & {
  childReducers: {[P in keyof S]: Reducer1<S[P], A, T1>};
};

export default function combineReducers<S, A, T1, T2>(
  reducers: {[P in keyof S]: Reducer2<S[P], A, T1, T2>},
): Reducer2<S, A, T1, T2> & {
  childReducers: {[P in keyof S]: Reducer2<S[P], A, T1, T2>};
};

export default function combineReducers<S, A, T1, T2, T3>(
  reducers: {[P in keyof S]: Reducer3<S[P], A, T1, T2, T3>},
): Reducer3<S, A, T1, T2, T3> & {
  childReducers: {[P in keyof S]: Reducer3<S[P], A, T1, T2, T3>};
};

export default function combineReducers<S, A>(reducers: {
  [key: string]: (state: S | undefined, action: A, ...args: any[]) => S;
}): (
  state: {[key: string]: S | undefined} | undefined,
  action: A,
    ...args: any[]
) => {[key: string]: S | undefined} {
  const reducerKeys = Object.keys(reducers);
  type State = {[key: string]: S | undefined};

  return Object.assign(
    (state: State | undefined = {}, action: A, ...args: any[]): State => {
      let hasChanged = false;
      const nextState: State = {};

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
