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
      trigger: { type: "time", autoplay: false },
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

## Top-level fields

- **`schemaVersion`**: required number `5`.
- **`projectId`**: optional non-empty informational string.
- **`perspective`**: optional finite number greater than zero, interpreted as CSS pixels by a renderer adapter. Core validates and preserves it but does not animate or publish it.
- **`templates`**: optional reusable keyframe bundles.
- **`motions`**: required array, possibly empty.
- **`freeTracks`**: optional array, defaulting to empty. These tracks have no trigger and no automatic schedule.

## Motion fields

A motion has a unique `id`, a `trigger`, and a `tracks` array. The trigger type is `scroll`, `time`, or `manual`. Motion owns the schedule and playback of its tracks. A motion track id is local in authored input but becomes `motionId/trackId` at load.

## Track fields

A track has a unique local `id`, optional `duration` and keyframes, and optional `observes` edges. Plugins are resolved from authored keyframe keys. The legacy `use` field is not part of schema v5 and is rejected at load with `plugin-contribution-unsupported-entry`; there is no empty plugin-preparation entry point. Track ids may not contain `/`; motion ids may not contain `/` or equal `~`. These restrictions preserve the qualified namespace.

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

Wrong schema version, malformed or duplicate ids, reserved namespace characters, invalid trigger, invalid perspective, malformed edges, unknown sources, duplicate edges, self-reference, cycles, and legacy `use` entries are errors. Missing perspective for detected 3D content and unused free tracks are warnings.
