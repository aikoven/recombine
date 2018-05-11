export type Reducer<S, A> = (state: S | undefined, action: A) => S;
export type Reducer1<S, A, T1> = (
  state: S | undefined,
  action: A,
  arg1: T1,
) => S;
export type Reducer2<S, A, T1, T2> = (
  state: S | undefined,
  action: A,
  arg1: T1,
  arg2: T2,
) => S;
export type Reducer3<S, A, T1, T2, T3> = (
  state: S | undefined,
  action: A,
  arg1: T1,
  arg2: T2,
  arg3: T3,
) => S;

export type Reducer4<S, A, T1, T2, T3, T4> = (
  state: S | undefined,
  action: A,
  arg1: T1,
  arg2: T2,
  arg3: T3,
  arg4: T4,
) => S;
