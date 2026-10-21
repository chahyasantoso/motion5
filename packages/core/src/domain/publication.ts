import type { ImmutableRecord } from "./values";

/**
 * The one enforcement point for internal keys.
 *
 * It is here, and not in a renderer, because `adapters/dom.ts` is not the only renderer:
 * `packages/react` hands consumers the whole patch. A denylist applied per renderer has to be
 * reimplemented by each of them, and a regression test written against one would pass while the
 * other leaked. Filtering before the snapshot is frozen gives the publisher, `handle.get`,
 * `subscribeNode`, and every adapter the same surface.
 *
 * `internalKeys` stays for unprefixed derived keys, which no rule can recognize. It is the
 * declaration of last resort rather than the mechanism. A namespaced key must survive the plugin
 * chain so plugins can read each other's, and is dropped only here.
 *
 * Both the operation runner and the plan-less Track path publish through this call, so a seed and a
 * derived key are filtered by one implementation rather than two that have to agree.
 */
export function publishableValues(
  values: ImmutableRecord,
  internalKeys: readonly string[],
): ImmutableRecord {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key.includes(":") || internalKeys.includes(key)) continue;
    result[key] = value;
  }
  return result as ImmutableRecord;
}
