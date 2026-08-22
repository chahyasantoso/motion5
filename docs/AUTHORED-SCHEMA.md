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
- **`perspective`**: optional finite number greater than zero. Core preserves it but does not animate or publish it.
- **`templates`**: optional reusable keyframe bundles.
- **`motions`**: required array, possibly empty.
- **`freeTracks`**: optional array, defaulting to empty. Free tracks have no trigger or automatic schedule.

## Motion fields

A motion has a unique `id`, a `trigger`, and a `tracks` array. Motion owns schedule and playback. A motion track id is local in authored input and becomes `motionId/trackId` at load.

## Trigger

The trigger type is `scroll`, `time`, or `manual`, and the type is enforced. No type falls back to manual and no trigger field is accepted and then ignored. See ADR-033.

- `{ type: "manual" }` accepts progress through `signal(motionId, { type, progress })` and also advances on the project clock.
- `{ type: "time", duration }` requires a finite positive duration. `repeat` counts passes after the initial cycle, `-1` is infinite, and `yoyo` reverses odd cycles when a repeating `repeat` is present. See ADR-040.
- `{ type: "scroll", source }` is push-driven. `source` is a serializable key resolved by an injected application-owned registry.

Trigger errors include `trigger-shape`, `trigger-time-duration`, `trigger-time-autoplay-unsupported`, `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, `trigger-time-yoyo-requires-repeat`, `trigger-scroll-source`, and `trigger-driver-unavailable`.

## Track fields

A track has a unique local `id`, optional `duration`, optional keyframes, and optional generic `observes` output edges. Plugins are resolved from authored keyframe keys. The legacy `use` field is rejected with `plugin-contribution-unsupported-entry`. Track ids may not contain `/`; motion ids may not contain `/` or equal `~`.

## Keyframes

A keyframe entry is either a property or a plugin-named group. A group has exactly two members, both reserved by name: `values` holds the properties the named plugin claims, and `requires` holds the graph bindings that plugin owns. Grouping scopes ownership; it does not rename leaves:

```text
keyframes: {
  opacity: { stops: [ ... ] },
  transform: {
    values: {
      x: { stops: [ ... ] },
      y: { stops: [ ... ] },
      rotation: { stops: [ ... ] },
    },
  },
  fk: {
    values: {
      length: { stops: [ ... ] },
      rotation: { stops: [ ... ] },
    },
    requires: { base: "walk/pelvis" },
  },
}
```

A group name addresses a registered plugin and every leaf of its `values` section must be a key that plugin claims. The section is flattened to unprefixed leaves before interpolation and composition, and it is the only compiled value domain. Nesting is one level deep inside `values`.

Because both section names are reserved, a group is recognised by the sections it names rather than by the shape of its leaves. That is what lets the registry-free contract layer tell a section from a property, report a typo'd section as `keyframes-unknown-section`, and refuse the pre-v5-final leaf form as `keyframes-missing-values-section` instead of as a property with no stops array. There is one authored group shape and no compatibility form. See ADR-049.

Two shapes are deliberately legal and worth knowing. A group may author `requires` with no `values`, which is how a plugin joins composition to receive an upstream value without animating anything itself. And a leaf named `values` inside the section is an ordinary property, because the reservation is on section position rather than on the string everywhere.

More than one plugin may claim the same key. `transformPlugin` claims `x`, `y`, and `rotation`, while `fkPlugin` claims `length` and `rotation`. With both registered, flat `rotation` is `plugin-ambiguous-key`; author a bone under `fk` and a root under `transform`.

### Plugin-owned requirements

A plugin may declare requirement slots in its definition:

```ts
const fkPlugin = {
  name: "fk",
  requirements: {
    base: {},
  },
};
```

An author binds an optional slot in that plugin's group, beside its `values` section:

```text
keyframes: {
  fk: {
    values: {
      length: { stops: [ ... ] },
      rotation: { stops: [ ... ] },
    },
    requires: {
      base: "walk/pelvis",
    },
  },
}
```

`requires` is metadata, not a keyframe. Flattening reads `values` and nothing else, so a binding creates no compiled property at all rather than being skipped on the way past. Omitting `requires`, or omitting one slot, creates no edge; the plugin owns its unbound behavior. Every configured slot must be declared by the named plugin, otherwise load fails with `plugin-unknown-requirement`.

The graph derives one input edge per binding. Unknown sources, self-reference, duplicate edges, and cycles are rejected before mount. A requirement is part of edge identity, so two slots such as `base` and `destination` may intentionally bind the same source.

A binding is the only way a value enters composition. A source bound to `fk.requires.base` arrives at the FK plugin as `inputs.base`, retaining the source's natural keys such as `x`, `y`, and `rotation`. It cannot overwrite the track's authored `values.rotation`: the two are separated by object scope rather than by renamed keys, and there is no flat input bag beside the scope for either of them to land in. See ADR-044 and ADR-047.

The contract layer owns section and binding shape, the plugin registry owns plugin and slot resolution, and graph construction owns topology. This keeps validation registry-independent and avoids duplicate normalization owners. See ADR-044 and ADR-049.

### Keyframe namespace rules

- A keyframe name may not contain `:` in a flat key, group name, or leaf name. The colon marks private internal keys and is rejected with `keyframes-reserved-separator`.
- A group holds only `values` and `requires`. Anything else is `keyframes-unknown-section`, and a group authoring its leaves at the top level is `keyframes-missing-values-section`.
- A present `values` must be a non-empty object: `keyframes-values-shape` and `keyframes-values-empty`. Omitting it is how you author no properties.
- Requirement slots may not be empty or contain `:`. Malformed sections use `keyframes-requires-shape`, `keyframes-requires-empty`, `keyframes-requires-slot`, and `keyframes-requires-source`.
- A top-level `values` or `requires` is rejected with `keyframes-reserved-section` because it has no owning plugin.
- An empty object is an accepted no-op property rather than a group, because it names no section.
- One compiled key may be authored once. Collisions use `keyframes-duplicate-key`.
- 3D content is detected by leaf name, including inside a `values` section, and missing perspective is a warning.

## Observation edges

Generic edges remain available on the observing track, and carry exactly one authored field:

```text
{ source: "motionA/arm" }
```

`source` may be local, qualified motion, or free-track.

Every edge an `observes` entry declares is an output edge: the source's contribution merges over the observer's composed patch. There is no way to declare an input edge by hand, and no need for one. A dependency that feeds a track's own composition is bound under a plugin group's `requires` section and arrives scoped to that plugin.

Three authored fields were removed, and each is refused rather than accepted and ignored:

- `target` is `observation-target-unsupported`. It named a destination key that no consumer read on either role. See ADR-046.
- `role` is `observation-role-unsupported`, for `"input"` and for `"output"` alike. It is refused on both, because if the only legal value is the default then writing it is a field accepted and then ignored.
- `projection` is `observation-projection-unsupported`. It renamed an upstream key to keep it from colliding inside a flat input bag, and an output edge merges the source's whole patch rather than renaming anything.

See ADR-047.

The graph rejects unknown, duplicate, self-referential, and cyclic edges before mount.

## Free tracks

A free track is authored under `freeTracks`, participates in the same graph, and has no Motion schedule. Its runtime id is `~/trackId`.

## Perspective

`perspective` describes the stage's 3D projection in CSS pixels. Missing perspective alongside 3D content is a warning; invalid present perspective is an error. The renderer owns applying it.

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

Errors reject a candidate project before it replaces the active project. Warnings load and remain readable.

A diagnostic about a grouped leaf cites the authored path, including the section: `keyframes.fk.values.length`.

## Rejected input

Wrong schema version, malformed or duplicate ids, reserved namespace characters, invalid triggers, invalid perspective, malformed group sections, malformed bindings and edges, unknown sources, duplicate edges, self-reference, cycles, removed fields, and legacy `use` entries are errors. The removed fields are an observation `target`, `role`, and `projection`, reported as `observation-target-unsupported`, `observation-role-unsupported`, and `observation-projection-unsupported`, and a track `use`. A plugin group that names an unknown section, or that authors its properties outside `values`, is also an error. Flat keys with multiple plugin claimants are errors too. Missing perspective for detected 3D content and unused free tracks are warnings.
