# Authored schema, version 5

The authored contract is now `schemaVersion: 5`. motion5 deliberately uses a new authored version because `freeTracks` is an intentional breaking rename from the reference dialect's top-level `tracks` field. See [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md) and [DECISIONS.md](./DECISIONS.md) ADR-011.

## Project

```js
const project = {
  schemaVersion: 5,
  projectId: "landing",
  perspective: 1200,
  templates: [],
  motions: [
    {
      id: "hero",
      trigger: { type: "time", autoplay: false },
      tracks: [
        {
          id: "hero-opacity",
          duration: 1,
          keyframes: { opacity: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1 }] } },
        },
      ],
    },
  ],
  freeTracks: [
    {
      id: "cursor",
      duration: 1,
      keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } },
    },
  ],
};
```

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `schemaVersion` | number | yes | Must be exactly `5`. |
| `projectId` | string | no | Informational. Appears in diagnostics. |
| `perspective` | number | no | CSS perspective in pixels for the stage. Renderer-layer data. |
| `templates` | Template[] | no | Reusable keyframe bundles referenced by `track.use`. |
| `motions` | Motion[] | yes | Triggered, scheduled units of playback. |
| `freeTracks` | Track[] | no | Tracks that belong to no motion. Qualified as `~/trackId`. |

## Rules

- `schemaVersion` must be the number `5`.
- A motion has `id`, `trigger`, and `tracks`. The key is `id`, never `motionId`.
- Trigger `type` is one of `scroll`, `time`, `manual`.
- Track ids are unique within their motion. Motion ids are unique within the project. Free track ids are unique within `freeTracks`.
- No id may contain `/`; no motion may be named `~`.
- Keyframe stops use normalized progress in the closed interval zero to one.

## `perspective`

An optional positive number in CSS pixels describing the depth of the project's 3D projection. The runtime never reads it, animates it, or includes it in patches. The renderer applies it once to the stage container, typically as `perspective: 1200px`.

If a track animates `z`, `rotationX`, or `rotationY`, or has a path point with non-zero `z`, and `perspective` is absent, loading emits a warning. If present, it must be finite and greater than zero; otherwise loading emits an error.

## `freeTracks`

Tracks authored outside any motion. They have no trigger, timeline offset, or automatic playback. Their playhead is driven externally by a host, manual clock, or adopting owner.

Free tracks exist for shared upstream nodes such as a cursor, scroll value, or rig root that several motions observe, and for swap-in tracks adopted when the scene needs them. They are ordinary graph nodes, not a second node type and not a capability-gated feature.

At load, free tracks are qualified as `~/trackId`, exactly like motion tracks use `motionId/trackId`. An observation edge may reference one with `source: "~/cursor"`. Ordering, cycle rejection, blocking, publication, and teardown are identical to any other node.

## Observation edges

Authored dependencies are JSON-safe and declared on the observing track:

```js
observes: [{ source: "~/cursor", role: "input", target: "pointer" }];
```

- `role` is `input` or `output`, defaulting to `output`.
- An `input` edge wraps the source patch under `target` before local composition.
- An `output` edge merges the source patch over the observing track's patch after local composition.
- `target` is required for `input` and forbidden for `output`.
- Edge identity is source, role, and target.
- `source` may be local, qualified `motionId/trackId`, or free `~/trackId`.

## Diagnostics

Every diagnostic carries `ruleId`, authored `path`, `message`, `ids`, and `severity` of `error` or `warning`. Errors reject before mounting. Warnings load and remain readable after load.

Errors include invalid schema version, duplicate or malformed ids, invalid perspective, unknown triggers or sources, invalid observation edges, and cycles. Warnings include 3D properties without perspective and an unused free track.

## Stability

Schema v5 is the first motion5 authored contract. Runtime API changes do not force a schema change, and schema changes require a migration document. v4 projects remain supported only through the explicit migration in [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md); no silent alias is accepted.
