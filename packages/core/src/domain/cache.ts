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
