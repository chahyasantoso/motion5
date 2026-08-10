# Authored schema, version 4

The authored contract is stable and versioned independently of the runtime. motion5 is a new runtime for the same input format. See [DECISIONS.md](./DECISIONS.md) ADR-002 and ADR-010.

## Project

```js
const project = {
  schemaVersion: 4,
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
  freeTracks: [
    {
      id: "cursor",
      duration: 1,
      keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } },
    },
  ],
};
```

| Field           | Type       | Required | Meaning                                                                       |
| --------------- | ---------- | -------- | ----------------------------------------------------------------------------- |
| `schemaVersion` | number     | yes      | Must be exactly `4`.                                                           |
| `projectId`     | string     | no       | Informational. Appears in diagnostics. Nothing reads it at runtime.            |
| `perspective`   | number     | no       | CSS perspective in pixels for the stage. Renderer-layer data. See below.       |
| `templates`     | Template[] | no       | Reusable keyframe bundles referenced by `track.use`.                           |
| `motions`       | Motion[]   | yes      | Triggered, scheduled units of playback. May be empty.                          |
| `freeTracks`    | Track[]    | no       | Tracks that belong to no motion. Qualified as `~/trackId`. See below.          |

## Rules

- `schemaVersion` must be the number `4`.
- A motion has `id`, `trigger`, and `tracks`. The key is `id`, never `motionId`. The trigger is declared directly, never wrapped in a driver object.
- Trigger `type` is one of `scroll`, `time`, `manual`.
- Track ids are unique within their motion. Motion ids are unique within the project. Free track ids are unique within `freeTracks`.
- No id may contain `/`. That character is reserved as the qualified-id separator.
- No motion may be named `~`. That name is reserved as the free-track namespace.
- Keyframe stops are ordered by `p`, which is a normalized progress in the closed interval zero to one.

## `perspective`

An optional positive number, in CSS pixels, describing the depth of the 3D projection for the scene as a whole.

**The runtime never reads it.** It is not a keyframe, not animatable, and it contributes to no patch. It is authored scene metadata that the renderer applies once to the stage container, typically as `perspective: 1200px` on the element that contains everything the project animates. It lives in the project so a 3D scene travels as one artifact instead of requiring a second configuration channel next to it.

It matters because 3D transforms are meaningless without a perspective ancestor. A track animating `rotationY` from 0 to 60 inside a container with no perspective renders as a flat horizontal squash: the animation is technically correct and visually wrong. That failure is silent, which is exactly why the validator is opinionated about it.

**Validation.** If any track in the project animates `z`, `rotationX`, or `rotationY`, or uses a `path` containing a point with a non-zero `z`, and `perspective` is absent, the loader emits a **warning**. The project still loads. The warning names the motion and the offending track, because the fix is a one-line project edit and the alternative is debugging a squashed element.

If `perspective` is present, it must be a finite number greater than zero. Zero, negative, and non-numeric values are **errors**, not warnings: CSS rejects them outright, so the authored intent cannot be honored.

## `freeTracks`

Tracks authored outside any motion. They exist because not every animated value belongs to a timeline.

A track inside a motion is scheduled: the motion builds a timeline, adds the track at an offset, and playback drives its playhead. A free track has no motion, therefore no trigger, no offset, and nothing that advances it. Its playhead is driven from outside, by a host calling `progress()`, by a manual clock, or by an adopting owner.

Two things need this:

1. **Shared upstream nodes.** A cursor position, a scroll value, or a rig root that several motions observe. Authoring it inside one motion makes every other motion depend on that motion's lifetime, which is wrong: unmounting an unrelated hero animation should not blank the cursor every rig reads from.
2. **Swap-in tracks.** Tracks defined up front and adopted at runtime when the scene needs them, such as a transition track handed to whichever element is currently moving. They must exist in the project before an owner exists.

### Namespace

Free tracks are qualified as `~/trackId` at load, exactly like a motion track is qualified as `motionId/trackId`. From the graph layer down there is one kind of node and one id format. Free tracks are not a second node type, they are not a capability, and no flag gates them. See [DECISIONS.md](./DECISIONS.md) ADR-003.

### Referencing them

An observation edge may name a free track by its qualified id:

```js
observes: [{ source: "~/cursor", role: "input", target: "pointer" }];
```

A free track may itself observe other tracks, including tracks inside motions. Ordering, cycle rejection, blocking, and publication are identical to any other node.

### Why not just call it `tracks`

The reference project used a bare top-level `tracks` array, so `project.tracks` and `motion.tracks` meant different things one nesting level apart, and every reader had to hold that distinction. `freeTracks` says what it is. This is a deliberate divergence from the reference dialect and is recorded as ADR-010.

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
- `source` may be a local track id, a qualified `motionId/trackId` reference, or a free `~/trackId` reference.

## Diagnostics

Every diagnostic carries a `ruleId`, an authored `path`, a `message`, the `ids` involved, and a `severity` of `error` or `warning`.

- **error** rejects. Nothing mounts, and an already-loaded project is not replaced.
- **warning** loads. It reports authoring that is legal but almost certainly not what was meant.

Warnings are collected on the project and are readable after load. They are never thrown, never silently swallowed, and never promoted to errors by a flag.

### Errors

- Missing or non-numeric `schemaVersion`, or any value other than 4.
- Duplicate motion ids, duplicate track ids within one motion, or duplicate free track ids.
- Missing, empty, or non-string ids.
- Any id containing `/`, or a motion named `~`.
- Unknown trigger types.
- `perspective` present but not a finite number greater than zero.
- An observation that is not an object.
- An unknown `source`.
- A self-referential edge.
- An invalid `role`.
- An `input` edge without `target`, or an `output` edge with `target`.
- A duplicate edge, by the source, role, target triple.
- Any cycle in the resulting graph.

### Warnings

- 3D properties animated with no top-level `perspective`.
- A free track that nothing observes and nothing adopts. It will never be driven and never publish.

## Stability

Authored fields are added only in a minor release and only as optional. Removing or repurposing a field requires a schema version bump and a documented migration. Runtime API changes never force a schema change, and schema changes never silently change the meaning of an existing project.
