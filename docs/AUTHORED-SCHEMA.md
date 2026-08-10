# Authored schema, version 4

The authored contract is stable and versioned independently of the runtime. motion5 is a new runtime for the same input format. See [DECISIONS.md](./DECISIONS.md) ADR-002.

## Project

```js
const project = {
  schemaVersion: 4,
  motions: [
    {
      id: "hero",
      trigger: { type: "time", autoplay: false },
      tracks: [
        {
          id: "hero-opacity",
          duration: 1,
          keyframes: {
            opacity: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 1 },
              ],
            },
          },
        },
      ],
    },
  ],
};
```

## Rules

- `schemaVersion` must be the number `4`.
- A motion has `id`, `trigger`, and `tracks`. The key is `id`, never `motionId`. The trigger is declared directly, never wrapped in a driver object.
- Trigger `type` is one of `scroll`, `time`, `manual`.
- Track ids are unique within their motion. Motion ids are unique within the project.
- Keyframe stops are ordered by `p`, which is a normalized progress in the closed interval zero to one.

## Observation edges

Authored dependencies are JSON-safe and declared on the observing track.

```js
observes: [{ source: "shoulder", role: "input", target: "parentWorld" }];
```

- `role` is `input` or `output`, defaulting to `output`.
- An `input` edge wraps the source patch under the named `target` key before local composition.
- An `output` edge merges the source patch over the observing track's patch after local composition.
- `target` is required for `input` and forbidden for `output`.
- Edge identity is the triple of source, role, and target. One source may therefore supply both an input and an output edge to the same observer.
- `source` may be a local track id, a qualified `motionId/trackId` reference, or an adopted `~/trackId` reference.

## Rejected at load

Each produces a diagnostic with a rule id, an authored path, and the ids involved. None of them mount.

- Missing or non-numeric `schemaVersion`, or any value other than 4.
- Duplicate motion ids, or duplicate track ids within one motion.
- Missing, empty, or non-string ids.
- Unknown trigger types.
- An observation that is not an object.
- An unknown `source`.
- A self-referential edge.
- An invalid `role`.
- An `input` edge without `target`, or an `output` edge with `target`.
- A duplicate edge, by the source, role, target triple.
- Any cycle in the resulting graph.

## Stability

Authored fields are added only in a minor release and only as optional. Removing or repurposing a field requires a schema version bump and a documented migration. Runtime API changes never force a schema change, and schema changes never silently change the meaning of an existing project.
