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
            opacity: [
              { p: 0, v: 0 },
              { p: 1, v: 1 },
            ],
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
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    },
  ],
};
```

## Top-level fields

- **`schemaVersion`**: required number `5`.
- **`projectId`**: optional non-empty informational string.
- **`perspective`**: optional finite number greater than zero. Core preserves it but does not animate or publish it.
- **`motions`**: required array, possibly empty.
- **`freeTracks`**: optional array, defaulting to empty. Free tracks have no trigger or automatic schedule.

There is no `templates`. It promised reusable keyframe bundles, nothing ever read one, and the runtime's project snapshot carried it through every graph rebuild untouched, so it is removed and an authored one is refused by name as `project-templates-unsupported`. A field with no consumer is removed and then refused rather than left declared, and a documented feature that does not exist is the one documentation failure ADR-053 calls worse than none.

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

A keyframe entry is either a property or a plugin-named group.

### A property is the stops, or a static value

There are exactly two ways to author a leaf, and no wrapper around either:

```text
opacity: [ { p: 0, v: 0 }, { p: 1, v: 1 } ]   // animated: the array is the value
length: 62                                    // static: never changes, never interpolated
```

A stop is `{ p, v }` with an optional `ease`, where `p` is a finite position between 0 and 1. Positions must be monotonic and unique. A sequence that does not define `p=0` or `p=1` loads with a warning.

A static value is a finite number, a string, or a boolean. It is not sugar for two identical stops: a static leaf never enters the interpolator, so it produces no percent-map entry, no tween, and no contribution to the merged timeline. It is published at every progress from the compiled initial values. That also means a static value has nowhere to put an `ease`, which is the point: a hold with a meaningless easing curve is unrepresentable rather than rejected.

The static domain stops at scalars deliberately. `null` and `undefined` are refused because omitting the key is already how you author nothing, a non-finite number is refused for the same reason a stop position must be finite, and an object is refused because that is what makes the retired wrapper diagnosable at all.

The `{ stops: [...] }` wrapper is **retired**, and refused by name as `property-stops-wrapper`. It is not an accepted alias and it is never normalized: two authoring shapes would be two validation paths and two documentation paths. Drop the wrapper and keep the array. See ADR-050.

### A group names the plugin that owns its leaves

A group has exactly two members, both reserved by name: `values` holds the properties the named plugin claims, and `requires` holds the graph bindings that plugin owns. Grouping scopes ownership; it does not rename leaves:

```text
keyframes: {
  opacity: [ ... ],
  transform: {
    values: {
      x: [ ... ],
      y: [ ... ],
      rotation: [ ... ],
    },
  },
  fk: {
    values: {
      length: 62,
      rotation: [ ... ],
    },
    requires: { base: "walk/pelvis" },
  },
}
```

A leaf inside `values` is held to exactly the rules a flat property is held to, both forms included. A group name addresses a registered plugin and every leaf of its `values` section must be a key that plugin claims. The section is flattened to unprefixed leaves before interpolation and composition, and it is the only compiled value domain. Nesting is one level deep inside `values`.

Because both section names are reserved, a group is recognised by the sections it names rather than by the shape of its leaves. That is what lets the registry-free contract layer tell a section from a property, report a typo'd section as `keyframes-unknown-section`, and refuse the pre-v5-final leaf form as `keyframes-missing-values-section` instead of as a property of an unknown shape. There is one authored group shape and no compatibility form. See ADR-049.

Group detection is unaffected by the leaf forms. A bare array and a bare scalar both fail the group predicate before its section check runs, so neither can be misread as a group.

Two shapes are deliberately legal and worth knowing. A group may author `requires` with no `values`, which is how a plugin joins composition to receive an upstream value without animating anything itself. And a leaf named `values` inside the section is an ordinary property, because the reservation is on section position rather than on the string everywhere.

More than one plugin may claim the same key. `transformPlugin` claims `x`, `y`, and `rotation`, while `fkPlugin` claims `x`, `y`, `length`, `rotation`, and `weight`. With both registered, flat `x`, `y` and `rotation` are each `plugin-ambiguous-key`; author a bone under `fk` and a root under `transform`. `length` and `weight` have one claimant each in this package, so their flat spelling stays unambiguous, and an application plugin is free to claim either of them as well.

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
      length: 62,
      rotation: [ ... ],
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

A prepare-stage plugin's `contribute` hook derives a contribution from a property's stops, so a static leaf on a key such a plugin owns is refused with `plugin-contribution-static-unsupported`. There are no stops to contribute from, and an empty list would be a field accepted and then ignored.

The contract layer owns section and binding shape, the plugin registry owns plugin and slot resolution, and graph construction owns topology. This keeps validation registry-independent and avoids duplicate normalization owners. See ADR-044 and ADR-049.

#### A slot whose value is a dict of sources

Most slots inside `requires` name one source id. A slot may take a dict instead: one source id per key you name. `ik`'s `targets` is the case that forced it, mapping a solver chain member's id to the node that member reaches toward, because a plugin cannot enumerate a slot family whose members the rig names rather than the plugin.

The capability is declared rather than detected from the slot's name. A plugin marks the slot in its own definition:

```ts
const ikPlugin = {
  name: "ik",
  requirements: {
    root: {},
    target: {},
    targets: { dict: true },
  },
};
```

So any plugin may declare one, and `targets` is an ordinary slot name with nothing reserved about it. A dict authored at a slot that declared none is `plugin-requirement-dict-unsupported`, and one source authored at a slot that declared one is `plugin-requirement-dict-required`. Both are refused, because a mismatch is silent in both directions: the first is a binding accepted and then ignored, and the second hands a plugin one node's values where it reads a keyed record. See ADR-052 and ADR-057.

One authored dict, but one binding per entry. Each entry derives exactly one input edge, and the key it was authored under travels beside the slot as data rather than inside a formatted slot name, so every downstream owner sees an ordinary edge and two entries of one slot stay two distinct edges even when they name the same source. The values arrive at the plugin under the keys you wrote, as `inputs.<plugin>.<slot>.<key>`.

### Inverse Kinematics (`ik` and `fk.requires.solver`)

Inverse Kinematics computes joint rotations so a bone chain reaches toward one or more world goals:

- **`ik` Plugin Group**: Declares configuration under `values` and topology under `requires`:
  - `values.flip`: boolean (optional, default `false`) to mirror the joint bend angle (e.g. elbow/knee orientation). One `flip` serves the whole solve, including every limb of a branching chain.
  - `requires.root`: qualified ID of the world frame the chain hangs from. The root is never moved by the solve.
  - `requires.target`: qualified ID of the world-space coordinate the chain's single leaf reaches toward.
  - `requires.targets`: a dict of goals keyed by member id, for a chain with more than one leaf. Every leaf must be named once the dict is used at all.
  - One of the two goal spellings is required. A solver with a root and members and no goal at all is `ik-solver-no-goal`, refused at load rather than left to a composition that has nothing to solve.
- **`fk` Solver Binding**: A member bone binds `keyframes.fk.requires.solver` naming the solver node. It authors `values.length`, a pivot offset `x` and `y` if the rig wants one, and optionally `values.weight`. Both solves account for the pivot offset, so it is an ordinary authored value on a member exactly as it is on any other bone. See ADR-054.
- **`fk.values.weight`**: how much of the solved rotation this bone composes with, per member rather than per solver, so a chain can stagger its reach: a shoulder that commits early while a wrist lags is two weights on two bones. It defaults to `1`, which is the unconditional override every rig had before the key existed, `0` is exactly the authored `rotation` with the solve discarded, and anything between blends along the shorter of the two arcs between them. Values outside `[0, 1]` are clamped rather than extrapolated, and a non-finite weight reads as `1`. Authoring `rotation` on a solver-bound member is legal exactly when a `weight` sits beside it in the same group, and refused as `ik-solved-rotation-dead` when it does not. A member that bound its solver under one plugin group and authored its `weight` under another is `ik-weight-without-solver`, because the solve cannot reach a key outside the group that asked for it. See ADR-055.

```text
// Solver node, single goal:
{
  id: "arm-solve",
  keyframes: {
    ik: {
      values: { flip: false },
      requires: { root: "walk/shoulder", target: "walk/hand-target" },
    },
  },
}

// Member bones:
{
  id: "upper-arm",
  keyframes: {
    fk: {
      values: { length: 30 },
      requires: { base: "walk/shoulder", solver: "walk/arm-solve" },
    },
  },
}

// A member that reaches gradually, holding its authored rest pose at progress 0:
{
  id: "forearm",
  keyframes: {
    fk: {
      values: {
        length: 25,
        rotation: -15,
        weight: [ { p: 0, v: 0 }, { p: 1, v: 1 } ],
      },
      requires: { base: "walk/upper-arm", solver: "walk/arm-solve" },
    },
  },
}
```

A chain may be any length and any shape. Its members are derived from the `solver` bindings they authored, its leaves are the members no member hangs from, and there is no authored member count and no cap. The solve dispatches on that derived shape: two members and one goal take the analytic closed form, and everything else takes the iterative one. Nothing about the choice is authorable, so no rig selects its own solver.

A branching chain addresses its goals by member id:

```text
{
  id: "spine-solve",
  keyframes: {
    ik: {
      requires: {
        root: "walk/spine",
        targets: { "walk/forearm-L": "walk/armL-target", "walk/forearm-R": "walk/armR-target" },
      },
    },
  },
}
```

Keyed by member id rather than by position, because an index cannot be wrong: it silently means whatever the rig currently makes it mean, so inserting a bone or reordering two tracks would keep loading and pull the wrong limb. A member id can be wrong, so it can be checked.

Two leaves may reach for the same node. Each goal is its own binding carrying its own key, so two entries naming one target are two distinct edges rather than one, and neither is reported as a duplicate. See ADR-057.

Both spellings are supported and neither is deprecated. `target` is exactly the degenerate case of the dict, so a solver picks one and `ik-goal-conflict` refuses both together. Because `target` names no member, it addresses a leaf only while there is one leaf to address, and a solver that binds it over a branching chain is `ik-target-not-single-leaf`. A linear chain has one leaf however long it is, so the bare slot keeps working past two bones.

A solve publishes `rotations`, a record of one local rotation per member id, and nothing else. Convergence is not reported on the patch: an iterative solve reaches a goal within a tolerance, an unreachable goal leaves the chain fully extended toward it, and both are ordinary results rather than failures. A member's `weight` never reaches a patch either: `fk` publishes a composed frame, so the blend is applied and the key is dropped. See ADR-051, ADR-052, and ADR-055.

### Keyframe namespace rules

- A keyframe name may not contain `:` in a flat key, group name, or leaf name. The colon marks private internal keys and is rejected with `keyframes-reserved-separator`.
- A leaf is an array of stops or a static scalar. Anything else is `stops-shape`, and the retired object wrapper is `property-stops-wrapper`.
- A group holds only `values` and `requires`. Anything else is `keyframes-unknown-section`, and a group authoring its leaves at the top level is `keyframes-missing-values-section`.
- A present `values` must be a non-empty object: `keyframes-values-shape` and `keyframes-values-empty`. Omitting it is how you author no properties.
- Requirement slots may not be empty or contain `:`. Malformed sections use `keyframes-requires-shape`, `keyframes-requires-empty`, `keyframes-requires-slot`, and `keyframes-requires-source`.
- A dict-valued slot holds a non-empty record of key to source id. `targets` specifically must be a record at all, which is `keyframes-targets-shape`, because only the slot's name can say so. The dict itself uses `keyframes-requires-dict-empty`, `keyframes-requires-dict-key`, and `keyframes-requires-dict-source`. A key may not be empty or contain `:`, `[`, or `]`: the colon is reserved in every authored name, and the brackets go with it because they were refused before and no authored spelling gains legality here.
- Whether a slot was allowed to carry a dict at all is the plugin's declaration, reported as `plugin-requirement-dict-unsupported` for a dict at a slot that takes one source and `plugin-requirement-dict-required` for one source at a slot that takes a dict.
- A top-level `values` or `requires` is rejected with `keyframes-reserved-section` because it has no owning plugin.
- An empty object is an accepted no-op property rather than a group, because it names no section.
- One compiled key may be authored once. Collisions use `keyframes-duplicate-key`.
- 3D content is detected by leaf name, including inside a `values` section and including a static leaf, and missing perspective is a warning.

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

A diagnostic about a grouped leaf cites the authored path, including the section: `keyframes.fk.values.length`. A diagnostic about a stop cites its index on the property: `keyframes.x[0].p`. A diagnostic about a dict entry cites the key you typed: `keyframes.ik.requires.targets.forearm`. There is no derived slot spelling for it to cite instead.

Load-time solver diagnostics include:

- `ik-solver-no-root`: A solver node does not bind a `root` requirement edge.
- `ik-solver-no-members`: A solver node has no member nodes binding `solver` to it.
- `ik-solver-no-goal`: A solver node binds neither `target` nor `targets`, so it has nothing to reach for.
- `ik-solver-unreachable-root`: A member's `base` hierarchy walk fails to terminate at the solver's bound `root`.
- `ik-mode-ambiguous`: A single node binds `solver` alongside `root` or a goal, or binds `root` under multiple plugins.
- `ik-solved-rotation-dead`: A bone bound to a `solver` authors a local `rotation` with no `weight` beside it in the same group, so nothing could read the authored value.
- `ik-weight-without-solver`: A node that bound a `solver` slot under one plugin group authors a `weight` under another, where no solved rotation reaches it.
- `ik-goal-unknown-member`: A goal key qualifies to no member of that solver's chain.
- `ik-goal-not-leaf`: A goal is authored on a member another member hangs from.
- `ik-goal-duplicate`: Two goal keys qualify to one member id.
- `ik-goal-conflict`: One solver authors both `target` and `targets`.
- `ik-leaf-without-goal`: The goal dict was used and a chain leaf it never named has nothing to reach for.
- `ik-target-not-single-leaf`: A solver binds the bare `target` slot over a chain with more than one leaf.

Those all answer about the member a goal key names. Whether `targets` was allowed to carry keys at all is answered one layer up by the plugin's declaration, so the two never report together.

There is no diagnostic about a solver's derived member count. `ik-solver-unsupported-arity` refused every count other than two and is deleted rather than widened, because a rule that refuses a shape the runtime solves is worse than no rule. See ADR-052.

There is no diagnostic about a solved member's pivot offset either, for the same reason. `ik-solved-pivot-unsupported` refused a non-zero authored `x` or `y` on a solved member while neither solve accounted for one, and it is deleted rather than widened now that both do. See ADR-054.

And there is no diagnostic about a `weight` on a bone that bound no solver anywhere. Such a weight is inert, exactly as an unbound one inside a chain would be, but `weight` may have more than one claimant and the load-time rule holds no plugin registry, so on a node with no solve in reach it cannot tell a blend weight from another plugin's own live input and does not guess. It is the same boundary that keeps a member's flat `rotation` out of `ik-solved-rotation-dead`. See ADR-043 and ADR-055.

## Rejected input

Wrong schema version, malformed or duplicate ids, reserved namespace characters, invalid triggers, invalid perspective, the retired stops wrapper, a leaf that is neither an array nor a static scalar, malformed group sections, malformed bindings and edges, a malformed goal dict, a dict at a slot that takes one source or one source at a slot that takes a dict, unknown sources, duplicate edges, self-reference, cycles, invalid solver topologies, solvers with no goal, unaddressable or unaddressed solver goals, dead rotations and unreachable blend weights on solved bones, removed fields, and legacy `use` entries are errors. The removed fields are an observation `target`, `role`, and `projection`, reported as `observation-target-unsupported`, `observation-role-unsupported`, and `observation-projection-unsupported`, a project `templates`, reported as `project-templates-unsupported`, and a track `use`. A plugin group that names an unknown section, or that authors its properties outside `values`, is also an error. Flat keys with multiple plugin claimants are errors too. Missing perspective for detected 3D content and unused free tracks are warnings.
