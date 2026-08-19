# Migration from authored schema v4 to v5

v5 is a breaking authored-contract release. The migration is intentionally explicit and runs before `loadProject`. motion5 does not accept v4, does not silently rename fields, and does not maintain a v4 mode.

## Why v5 exists

The old dialect used `tracks` at both the project and motion level. A reader had to infer whether `project.tracks` meant free tracks while `motion.tracks` meant scheduled tracks. v5 calls the project-level field `freeTracks`, reserves qualified ids, and makes the contract machine-detectable.

## Mechanical changes

### Version

```diff
- schemaVersion: 4
+ schemaVersion: 5
```

### Project-level tracks

```diff
- { schemaVersion: 4, tracks: [cursor] }
+ { schemaVersion: 5, freeTracks: [cursor] }
```

Do not rename `motion.tracks`.

### Free references

```diff
- { source: "cursor", role: "input", target: "pointer" }
+ { source: "~/cursor", role: "input", target: "pointer" }
```

Use qualified `motionId/trackId` for cross-motion references and `~/trackId` for free tracks. Local references inside one motion may remain local until normalization.

### Perspective

Add a finite positive number when the project contains 3D keyframes or path depth:

```js
{ schemaVersion: 5, perspective: 1200, motions: [...] }
```

Missing perspective is a warning. Zero, negative, non-finite, or non-numeric present values are errors.

### Triggers

A declared trigger type used to be decorative: every type resolved to a manual port, so a v4 document with a `scroll` or `time` trigger loaded and then moved only when something called `signal()`. It is now enforced, and five previously tolerated shapes are rejected. See ADR-033 and the Trigger section of [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md).

- A `time` trigger requires a finite `duration` greater than zero. Without it the load throws `trigger-time-duration at motions[i].trigger.duration: Time trigger duration must be a finite number greater than zero.`
- `repeat` and `yoyo` are rejected at any value, including `0`, with `trigger-time-repeat-unsupported`. Drop them. Loop semantics are undesigned, and a field that validates has to be honored.
- `autoplay` may be absent or `true`. `false` is rejected with `trigger-time-autoplay-unsupported`, because explicit paused behavior does not exist yet.
- A declared `scroll` source with no registered resolver rejects both `load()` and `addMotion` with `trigger-driver-unavailable`, naming the motion id and the source key. Register an application-owned progress source for every scroll Motion you author, or author the Motion as `manual`.
- `signal()` on a driver-backed Motion now throws `Motion has a configured trigger driver and does not accept external signals.` A v4 consumer that drove a `scroll` or `time` Motion by hand must either move that Motion to `manual` or feed it through its driver. `seek(nodeId, progress)` still works on any node, but the next driver emission overwrites it.

### Progress range on the trigger input path

See ADR-037. Progress that reaches a `Motion` through a `TriggerPort` is validated once, in `Motion`, and is no longer clamped there.

- An out-of-range emission throws `RangeError: Progress must be between 0 and 1.` and a non-finite one throws `TypeError: Motion progress must be finite.`, both at the emit site. A v4-era custom driver that leaned on the old silent clamp to push `1.2` or `-0.1` must clamp in its own adapter, which is where the measurement is understood.
- A `ScrollSource` still has its overshoot clamped for it, because a scroll position is a measured quantity, but pushing `NaN` or `Infinity` now throws `TypeError: ScrollSource progress must be a finite number.` instead of being forwarded.
- `handle.signal()` is unchanged: same two error types, same two messages. `seek` is also unchanged and still clamps.

## Explicit migration function

The migration must be a pure transformation and must not mutate its input:

```js
export function migrateV4ToV5(project) {
  if (!project || project.schemaVersion !== 4) return project;
  const { tracks: freeTracks = [], ...rest } = project;
  return { ...rest, schemaVersion: 5, freeTracks };
}
```

This helper is safe only when the v4 producer’s top-level `tracks` is known to mean free tracks. Before applying it, validate that the source is an object, `tracks` is an array or absent, ids are unique, no id contains `/`, no motion is named `~`, and any free references are qualified. If both `tracks` and `freeTracks` exist, fail rather than choose one.

The helper does not touch triggers, and it cannot: dropping `repeat` or inventing a `duration` would be a semantic decision made behind the author's back. Trigger migration is a review step, not a transformation.

## Semantic review checklist

- Does every top-level track really have no Motion owner?
- Are any bare references ambiguous after multiple motions are added?
- Are free tracks expected to survive unmounting an unrelated motion?
- Does 3D content need `perspective`?
- Are any ids using `/` or the reserved motion id `~`?
- Are any cycles introduced by qualifying references?
- Does every `time` trigger carry a `duration`, and has every `repeat`, `yoyo`, and `autoplay: false` been removed?
- Does every `scroll` trigger have a registered source, and does any consumer still call `signal()` on it?
- Does any custom driver or `ScrollSource` push progress outside `[0, 1]`, or a value that can be `NaN`, and rely on it being clamped for them?
- Does the migrated document serialize deterministically?

## Compatibility policy

Store migrated documents as v5. Do not keep a runtime alias or pass both fields. A migration tool may report warnings and errors, but the runtime receives only the validated v5 shape.

## Migration acceptance tests

A fresh test suite must prove: version bump; top-level rename only; qualified free references; no input mutation; idempotence on v5; rejection of both old and new top-level fields; and deterministic diagnostics for invalid migration assumptions.
