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

/**
 * The services one evaluator generation receives.
 *
 * `cache` is the generic provider core guarantees. Any further service is declared by the plugin
 * package that consumes it through `declare module "@motion5/core/plugin-api"` (interface
 * augmentation), exactly as `CapabilityMap` is, so a missing declaration is a type error rather
 * than an `unknown` lookup. See ADR-142 and the cache contract §4.
 */
export interface EvaluatorServices {
  readonly cache: CacheProvider;
}
