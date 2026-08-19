# Authored schema v5

This document is the normative input contract. The runtime accepts v5 only. It does not accept v4 as an alias and does not silently migrate input.

## Minimal project

```js
{
  schemaVersion: 5,
  motions: [],
  freeTracks: [],
}
```

## Complete example

```js
const project = {
  schemaVersion: 5,
  projectId: "landing",
  perspective: 1200,
  templates: [],
  motions: [
    {
      id: "hero",
      trigger: { type: "time", duration: 1000 },
      stagger: 0.08,
      tracks: [
        {
          id: "title",
          duration: 1,
          keyframes: {
            opacity: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 1 },
              ],
            },
          },
          observes: [{ source: "~/cursor", role: "input", target: "pointer" }],
        },
      ],
    },
  ],
  freeTracks: [
    {
      id: "cursor",
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    },
  ],
};
```

This example previously authored `trigger: { type: "time", autoplay: false }` with no `duration`, which the runtime rejects twice over. A normative document whose own example does not load is worse than no example, so the trigger rules below are stated in full.

## Top-level fields

- **`schemaVersion`**: required number `5`.
- **`projectId`**: optional non-empty informational string.
- **`perspective`**: optional finite number greater than zero, interpreted as CSS pixels by a renderer adapter. Core validates and preserves it but does not animate or publish it.
- **`templates`**: optional reusable keyframe bundles.
- **`motions`**: required array, possibly empty.
- **`freeTracks`**: optional array, defaulting to empty. These tracks have no trigger and no automatic schedule.

## Motion fields

A motion has a unique `id`, a `trigger`, and a `tracks` array. Motion owns the schedule and playback of its tracks. A motion track id is local in authored input but becomes `motionId/trackId` at load.

## Trigger

The trigger type is `scroll`, `time`, or `manual`, and the type is enforced rather than decorative. A declared type selects a real driver or the load fails. No type falls back to manual, and no trigger field is accepted and then ignored. See ADR-033.

- `{ type: "manual" }` takes no other fields. Progress arrives through `signal(motionId, { type, progress })`, and the Motion also advances on the project clock.
- `{ type: "time", duration }` requires `duration` as a finite number greater than zero, in the same units as the clock delta. The driver emits elapsed time over `duration` and stops emitting once the loop it was given has finished. `autoplay` may be absent or `true`; playback always starts.
- `{ type: "time", duration, repeat, yoyo }` loops. Both loop fields are optional. `repeat` counts the passes after the initial one, so a finite loop runs `repeat + 1` cycles and `repeat: 0` is a single pass; `-1` is infinite and is the only spelling for it, so the field stays serializable. `yoyo` reverses every odd cycle and requires a `repeat` that repeats. Ping-pong is `{ repeat: -1, yoyo: true }` rather than a third field. A cycle is half-open at its start and closed at its end, so a tick landing exactly on a boundary emits that cycle's end state rather than skipping it. One tick produces one emission, at the position the clock reached; a tick that crossed several cycles does not replay them. See ADR-040.
- `{ type: "scroll", source }` is push-driven and registers no clock consumer, so a clock tick never moves it. `source` is a serializable string key resolved against an application-owned registry injected at load. Core never receives a selector, an element, or an animation-engine object.

A driver-backed Motion rejects `signal()` with `Motion has a configured trigger driver and does not accept external signals.` Only `manual` accepts one. `seek(nodeId, progress)` is unaffected, because it is leaf-level scrubbing rather than Motion-level control; on a driver-backed Motion the next driver emission overwrites a seeked value. See ADR-021.

Every trigger rejection is severity `error`:

- `trigger-shape` for a non-object trigger, or a `type` outside `scroll`, `time`, and `manual`.
- `trigger-time-duration` for a `time` trigger whose `duration` is absent, non-numeric, non-finite, or not greater than zero.
- `trigger-time-autoplay-unsupported` for `autoplay` present and not `true`. `false` is not representable, because explicit paused behavior does not exist yet.
- `trigger-time-repeat-shape` for a `repeat` that is not an integer of `-1` or above.
- `trigger-time-yoyo-shape` for a `yoyo` that is not a boolean.
- `trigger-time-yoyo-requires-repeat` for a `yoyo` whose `repeat` is absent or `0`, at either boolean value. Neither `true` nor `false` does anything without a repeat, and a field accepted and then ignored is what ADR-033 forbids.
- `trigger-scroll-source` for a `source` present but not a non-empty string.
- `trigger-driver-unavailable` at `load()` or `addMotion` when a declared `scroll` trigger resolves no registered source. A missing `source` key is not a validation error: whether a key is required is the injected factory's business, and an unresolvable one fails at construction naming the motion id and the key.

The same rules apply to a Motion created at runtime through `addMotion`, and nothing is committed until the Motion can be built. See ADR-028 and ADR-032.

## Track fields

A track has a unique local `id`, optional `duration` and keyframes, and optional `observes` edges. Plugins are resolved from authored keyframe keys. The legacy `use` field is not part of schema v5 and is rejected at load with `plugin-contribution-unsupported-entry`; there is no empty plugin-preparation entry point. Track ids may not contain `/`; motion ids may not contain `/` or equal `~`. These restrictions preserve the qualified namespace.

## Keyframes

A keyframe entry is either a property or a plugin-named group of properties. Both forms are legal in the same track, and the flat form is unchanged:

```text
keyframes: {
  opacity: { stops: [ ... ] },              // flat: resolved against every plugin
  fk:      { boneLength: { stops: [...] } }, // grouped: resolved against the plugin named fk
}
```

A group name addresses a registered plugin by name, and each leaf must be a key that plugin itself claims. A group naming no registered plugin, or a leaf the named plugin does not claim, is `plugin-unknown-key` reported at the authored path. Grouping is scoping, not renaming: the group is flattened to its unprefixed leaves before compilation, so `fk: { boneLength }` compiles, interpolates, composes, and renders exactly as flat `boneLength` does. Nesting is one level deep; a group holds properties and a property holds stops.

Two restrictions make the two forms one namespace rather than two:

- A keyframe name may not contain `:`, in a flat key, a group name, or a leaf name. The colon marks a plugin's private internal keys, which are never published. Violations are `keyframes-reserved-separator`.
- One compiled key may be authored once. A leaf that collides with another group's leaf, or with a flat key, is `keyframes-duplicate-key` rather than a silent overwrite.

3D content is detected by leaf name, so `z`, `rotationX`, `rotationY`, and non-zero path-point `z` still raise `perspective-usage` when authored inside a group. See ADR-041.

## Free tracks

A free track is authored under `freeTracks`, not `tracks`. It is project-owned and participates in the same graph as motion tracks, but no Motion schedules its progress. A host or adopting owner drives it externally. Its runtime id is `~/trackId`.

Use free tracks for shared roots such as cursor, scroll, or rig state, and for project-defined tracks that will be adopted by a runtime owner later. A free track is not a different graph type and is not gated by a capability flag.

## Perspective

`perspective` describes the stage’s 3D projection in CSS pixels. Without it, `z`, `rotationX`, `rotationY`, or non-zero path-point `z` values can render with flat or misleading depth. Missing perspective alongside 3D content is a warning. Invalid present perspective is an error. The renderer owns applying it to a stage container; core does not import CSS or DOM APIs.

## Observation edges

Edges are declared on the observing track:

```js
{ source: "motionA/arm", role: "input", target: "parentWorld" }
```

`source` may be local, qualified motion, or free-track. `role` is `input` or `output`; it defaults to `output`. Input requires a non-empty `target` and contributes under that property. Output forbids `target` and merges the source contribution over the observer’s composed patch. Edge identity includes source, role, and target, so one source may provide both roles.

The graph rejects unknown, duplicate, self-referential, and cyclic edges before mount.

## Diagnostics

```ts
interface Diagnostic {
  ruleId: string;
  path: string;
  message: string;
  severity: "error" | "warning";
  ids?: string[];
}
```

Errors reject the candidate project before it can replace the active project. Warnings load and remain readable. No flag promotes warnings to errors.

## Rejected input

Wrong schema version, malformed or duplicate ids, reserved namespace characters, invalid trigger, invalid perspective, malformed edges, unknown sources, duplicate edges, self-reference, cycles, and legacy `use` entries are errors. A keyframe name containing `:` and one compiled key authored under two spellings are errors too. The per-type trigger rules are listed under Trigger above. Missing perspective for detected 3D content and unused free tracks are warnings.
