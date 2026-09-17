import type { MotionDefinition, TrackDefinition } from "../contract/v5";
import { unreachable } from "../domain/exhaustive";
import { buildOwed, type ValueState } from "./value-state";
declare const EB: unique symbol, SB: unique symbol;
type B = { readonly [EB]: true };
type C = { readonly [SB]: true };
type E<K extends string, V = {}> = { readonly kind: K } & V & B;
type S<K extends string, V = {}> = { readonly kind: K } & V & C;
export type Effect =
  | E<"create-motion", { definition: MotionDefinition }>
  | E<"destroy-motion", { motionId: string }>
  | E<"compile-track", { nodeId: string; track: TrackDefinition }>
  | E<"dispose-track", { nodeId: string }>
  | E<"stage-track", { nodeId: string; track: TrackDefinition }>
  | E<"rollback-stage", { nodeId: string }>
  | E<
      "retarget-motion-track",
      { motionId: string; nodeId: string; duration?: number; previousDuration?: number }
    >;
export type Settlement =
  | S<"commit-staged", { nodeId: string }>
  | S<"dispose-track", { nodeId: string }>
  | S<"evict-node", { nodeId: string }>
  | S<"mount-node", { nodeId: string }>
  | S<"add-motion-track", { motionId: string; nodeId: string; duration?: number }>
  | S<"remove-motion-track", { motionId: string; nodeId: string }>
  | S<"destroy-motion", { motionId: string }>
  | S<"publish", { seeds: readonly string[] }>;
export type CommitDocument = {
  readonly tracks: ReadonlyMap<
    string,
    { readonly track: TrackDefinition; readonly motionId?: string; readonly valueState: ValueState }
  >;
  readonly motions: ReadonlyMap<string, { readonly definition: MotionDefinition }>;
};
export type CommitPlan = {
  readonly effects: readonly Effect[];
  readonly settle: readonly Settlement[];
  readonly touched: readonly string[];
};
type O = {
  readonly needsBuild: ReadonlySet<string>;
  readonly readers: ReadonlyMap<string, readonly string[]>;
};
const e = (x: object) => Object.freeze(x) as Effect;
const s = (x: object) => Object.freeze(x) as Settlement;
export function planCommit(b: CommitDocument, a: CommitDocument, o: O): CommitPlan {
  const effects: Effect[] = [],
    settle: Settlement[] = [],
    touched: string[] = [];
  for (const [id, x] of a.motions)
    if (!b.motions.has(id)) effects.push(e({ kind: "create-motion", definition: x.definition }));
  for (const [id, x] of b.tracks) {
    if (a.tracks.has(id)) continue;
    settle.push(s({ kind: "evict-node", nodeId: id }), s({ kind: "dispose-track", nodeId: id }));
    if (x.motionId !== undefined)
      settle.push(s({ kind: "remove-motion-track", motionId: x.motionId, nodeId: id }));
    touched.push(...(o.readers.get(id) ?? []));
  }
  for (const id of b.motions.keys())
    if (!a.motions.has(id)) settle.push(s({ kind: "destroy-motion", motionId: id }));
  for (const [id, x] of a.tracks) {
    const old = b.tracks.get(id);
    if (old === undefined) {
      effects.push(e({ kind: "compile-track", track: x.track, nodeId: id }));
      if (x.motionId !== undefined)
        settle.push(
          s({
            kind: "add-motion-track",
            motionId: x.motionId,
            nodeId: id,
            duration: x.track.duration,
          }),
        );
      settle.push(s({ kind: "mount-node", nodeId: id }));
      touched.push(id);
      continue;
    }
    if (old.track === x.track) continue;
    if (o.needsBuild.has(id) || buildOwed(old.valueState))
      effects.push(e({ kind: "stage-track", track: x.track, nodeId: id }));
    if (x.motionId !== undefined)
      effects.push(
        e({
          kind: "retarget-motion-track",
          motionId: x.motionId,
          nodeId: id,
          duration: x.track.duration,
          previousDuration: old.track.duration,
        }),
      );
    settle.push(s({ kind: "commit-staged", nodeId: id }));
    touched.push(id);
  }
  settle.push(s({ kind: "publish", seeds: touched }));
  return { effects, settle, touched };
}
export function invert(x: Effect): Effect | undefined {
  switch (x.kind) {
    case "create-motion":
      return e({ kind: "destroy-motion", motionId: x.definition.id });
    case "compile-track":
      return e({ kind: "dispose-track", nodeId: x.nodeId });
    case "stage-track":
      return e({ kind: "rollback-stage", nodeId: x.nodeId });
    case "retarget-motion-track":
      return e({
        kind: "retarget-motion-track",
        motionId: x.motionId,
        nodeId: x.nodeId,
        duration: x.previousDuration,
        previousDuration: x.duration,
      });
    case "destroy-motion":
    case "dispose-track":
    case "rollback-stage":
      return undefined;
    default:
      return unreachable(x);
  }
}
