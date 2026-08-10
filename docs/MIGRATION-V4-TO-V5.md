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

## Semantic review checklist

- Does every top-level track really have no Motion owner?
- Are any bare references ambiguous after multiple motions are added?
- Are free tracks expected to survive unmounting an unrelated motion?
- Does 3D content need `perspective`?
- Are any ids using `/` or the reserved motion id `~`?
- Are any cycles introduced by qualifying references?
- Does the migrated document serialize deterministically?

## Compatibility policy

Store migrated documents as v5. Do not keep a runtime alias or pass both fields. A migration tool may report warnings and errors, but the runtime receives only the validated v5 shape.

## Migration acceptance tests

A fresh test suite must prove: version bump; top-level rename only; qualified free references; no input mutation; idempotence on v5; rejection of both old and new top-level fields; and deterministic diagnostics for invalid migration assumptions.
