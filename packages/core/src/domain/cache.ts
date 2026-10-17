import type { LocalEvaluation } from "./execution-plan";

export type CacheLookup<V> =
  | { readonly kind: "miss" }
  | { readonly kind: "hit"; readonly value: V };

export interface CacheSpec<K> {
  readonly equals: (left: K, right: K) => boolean;
  readonly maxSlots: number;
}

export interface CacheWrite<K, V> {
  readonly slot: string;
  readonly key: K;
  readonly value: V;
}

export interface CacheSnapshot<K, V> {
  lookup(slot: string, key: K): CacheLookup<V>;
  remember(writes: readonly CacheWrite<K, V>[]): CacheSnapshot<K, V>;
}

export interface CacheProvider {
  create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V>;
}

export interface EvaluatorServices {
  readonly cache: CacheProvider;
  readonly [service: string]: unknown;
}

export interface StatefulEvaluatorSpec<P, S> {
  readonly initialState?: S | (() => S) | undefined;
  prepare(
    local: LocalEvaluation,
    committedState: S,
  ): { readonly prepared: P; readonly proposedState: S };
  collect?(prepared: P): Record<string, unknown>;
  fold?(
    prepared: P,
    priorFold: Readonly<Record<string, unknown>>,
  ): { readonly delta: Record<string, unknown>; readonly proposedState: S };
  dispose?(): void;
}

export function defineStatefulEvaluator<P, S>(
  spec: StatefulEvaluatorSpec<P, S>,
): {
  prepare(local: unknown, committedState: S): { readonly prepared: P; readonly proposedState: S };
  collect?(prepared: P): Record<string, unknown>;
  fold?(
    prepared: P,
    priorFold: Record<string, unknown>,
  ): { readonly delta: Record<string, unknown>; readonly proposedState: S };
  dispose?(): void;
} {
  if (typeof spec?.prepare !== "function") {
    throw new TypeError("StatefulEvaluatorSpec prepare must be a function.");
  }
  if (spec.collect !== undefined && typeof spec.collect !== "function") {
    throw new TypeError("StatefulEvaluatorSpec collect must be a function when declared.");
  }
  if (spec.fold !== undefined && typeof spec.fold !== "function") {
    throw new TypeError("StatefulEvaluatorSpec fold must be a function when declared.");
  }
  if (spec.dispose !== undefined && typeof spec.dispose !== "function") {
    throw new TypeError("StatefulEvaluatorSpec dispose must be a function when declared.");
  }

  const resolveCommittedState = (committedState: S): S => {
    if (committedState !== undefined) {
      return committedState;
    }
    if (spec.initialState !== undefined) {
      return typeof spec.initialState === "function"
        ? (spec.initialState as () => S)()
        : spec.initialState;
    }
    return committedState;
  };

  return Object.freeze({
    prepare(local: unknown, committedState: S) {
      const state = resolveCommittedState(committedState);
      return spec.prepare(local as LocalEvaluation, state);
    },
    ...(spec.collect
      ? {
          collect(prepared: P) {
            return spec.collect!(prepared);
          },
        }
      : {}),
    ...(spec.fold
      ? {
          fold(prepared: P, priorFold: Record<string, unknown>) {
            return spec.fold!(prepared, priorFold);
          },
        }
      : {}),
    ...(spec.dispose ? { dispose: spec.dispose } : {}),
  });
}
