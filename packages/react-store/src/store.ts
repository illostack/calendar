"use client";

import * as React from "react";

export interface Store<TState> {
  readonly state: TState;
  readonly prevState: TState;
  readonly subscriptions: Map<
    string,
    { selector: (state: TState) => unknown; callback: () => void }
  >;
  update: (updater: (prevState: TState) => TState) => void;
  subscribe: <TSelected>(
    selector: (state: TState) => TSelected | TState
  ) => (listener: () => void) => () => void;
  getSnapshot: <TSelected>(
    selector: (state: TState) => TSelected | TState
  ) => () => TSelected | TState;
  emitChange: () => void;
  effect: <TSelected>(
    selector: (state: TState) => TSelected | TState,
    effect: (state: TState, prevState: TState) => (() => void) | void
  ) => () => void;
}

const shallowEqual = <T>(objA: T, objB: T): boolean => {
  if (Object.is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime();
  }

  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [key, value] of objA) {
      if (!objB.has(key) || !Object.is(value, objB.get(key))) return false;
    }
    return true;
  }

  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const value of objA) {
      if (!objB.has(value)) return false;
    }
    return true;
  }

  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (
      !Object.prototype.hasOwnProperty.call(objB, key) ||
      !Object.is(
        (objA as Record<string, unknown>)[key],
        (objB as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }
  return true;
};

const createStore = <TState>(initialState: TState): Store<TState> => {
  let state = initialState;
  let prevState = initialState;
  const subscriptions = new Map<
    string,
    { selector: (state: TState) => unknown; callback: () => void }
  >();
  let idCounter = 0;

  const update = (updater: (prevState: TState) => TState) => {
    prevState = state;
    state = updater(state);
    emitChange();
  };

  const subscribe = <TSelected>(
    selector: (state: TState) => TSelected | TState
  ) => {
    return (callback: () => void) => {
      const callbackId = (idCounter++).toString();
      subscriptions.set(callbackId, {
        selector,
        callback
      });

      return () => {
        subscriptions.delete(callbackId);
      };
    };
  };

  const getSnapshot = <TSelected = TState>(
    selector: (state: TState) => TSelected | TState
  ) => {
    let lastSnapshot = selector(state);
    return () => {
      const newSnapshot = selector(state);
      if (shallowEqual(lastSnapshot, newSnapshot)) {
        return lastSnapshot;
      }
      lastSnapshot = newSnapshot;
      return newSnapshot;
    };
  };

  const emitChange = () => {
    for (const [, { selector, callback }] of subscriptions.entries()) {
      if (!shallowEqual(selector(prevState), selector(state))) {
        callback();
      }
    }
  };

  const effect = <TSelected>(
    selector: (state: TState) => TSelected | TState,
    effectCallback: (state: TState, prevState: TState) => (() => void) | void
  ) => {
    let cleanUp = effectCallback(state, prevState);

    const unsubscribe = subscribe(selector)(() => {
      cleanUp?.();
      cleanUp = effectCallback(state, prevState);
    });

    return () => {
      cleanUp?.();
      unsubscribe();
    };
  };

  return {
    get state() {
      return state;
    },
    get prevState() {
      return prevState;
    },
    get subscriptions() {
      return subscriptions;
    },
    update,
    subscribe,
    getSnapshot,
    emitChange,
    effect
  };
};

const useStore = <TState, TSelected = TState>(
  store: Store<TState>,
  selector: (state: TState) => TSelected = (s) => s as unknown as TSelected
) => {
  const getSnapshotFn = React.useMemo(
    () => store.getSnapshot(selector),
    [store, selector]
  );
  const subscribeFn = React.useCallback(
    (listener: () => void) => store.subscribe(selector)(listener),
    [store, selector]
  );

  const value = React.useSyncExternalStore(
    subscribeFn,
    getSnapshotFn,
    getSnapshotFn
  );

  return value as TSelected;
};

const useStoreEffect = <TState, TSelected = TState>(
  store: Store<TState>,
  selector: (state: TState) => TSelected = (s) => s as unknown as TSelected,
  effect: (state: TState, prevState: TState) => (() => void) | void
) => {
  React.useEffect(() => {
    const unsubscribe = store.effect(selector, effect);
    return unsubscribe;
  }, [store, selector, effect]);
};

export { createStore, useStore, useStoreEffect };
