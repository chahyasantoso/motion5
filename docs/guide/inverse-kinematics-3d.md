# Inverse kinematics in 3D

`ik3d` and `fk3d` are identified plugins over aggregate tables. A chain is authored once as a body
table and a goals table; the solver publishes one solved row per member and `fk3d` publishes one
world-frame pose row per member.

## Registration

```ts
import { PluginCatalog } from "@motion5/core";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";

const plugins = new PluginCatalog();
plugins.registerAll([fk3dPlugin, ik3dPlugin]);
```

Pass the catalog to `EngineOptions.plugins`. There is no implicit 3D plugin.

## Rig shape

- `root` is a record track with `x`, `y`, `z`, `rotation`, `rotationX` and `rotationY`.
- `body` is a table with one row per member. Cells are `parentId?`, `length`, `rotation`,
  `rotationX`, `rotationY`, `weight?`, `x?`, `y?`, `z?` and optional joint-limit fields.
- `goals` is a table with one row per addressed leaf. Cells are `memberId`, `x`, `y`, `z` and
  optional `influence`, `rotation`, `rotationX`, `rotationY`.
- `solve` is an `ik3d` track binding `chain: "body"`, `goals: "goals"`, `base: "root"` and an
  optional `pole` record.
- `pose` is an `fk3d` track binding `chain: "body"`, `solved: "solve"`, `base: "root"`.

```js
const tracks = [
  {
    id: "root",
    input: { values: { x: 110, y: 70, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
  },
  {
    id: "body",
    input: {
      values: [
        { id: "upper", cells: { length: 50, rotation: 70, rotationX: -8, rotationY: 8 } },
        {
          id: "fore",
          cells: { parentId: "upper", length: 42, rotation: 18, rotationX: 6, rotationY: -5 },
        },
        {
          id: "wrist",
          cells: { parentId: "fore", length: 34, rotation: 16, rotationX: -4, rotationY: 3 },
        },
        {
          id: "hand",
          cells: { parentId: "wrist", length: 26, rotation: 12, rotationX: 3, rotationY: -2 },
        },
      ],
    },
  },
  {
    id: "goals",
    input: { values: [{ id: "goal", cells: { memberId: "hand", x: 205, y: 170, z: 30 } }] },
  },
  {
    id: "solve",
    plugin: "ik3d",
    input: {
      values: { inspect: true },
      requires: { chain: "body", goals: "goals", base: "root" },
    },
  },
  {
    id: "pose",
    plugin: "fk3d",
    input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
  },
];
```

## Rest orientation, weight and offsets

A member's `rotation`, `rotationX` and `rotationY` are its local rest orientation. When a solver is
bound, `weight` blends rest toward the solved local orientation for that member: `0` is rest, `1` is
the solve, and the blend follows the shorter arc. Weight belongs to the member, so members can commit
at different progress values. Under a FABRIK chain the rest orientation also supplies the roll used
to reconstruct a 3D pose.

A member's `x`, `y` and `z` are pivot offsets in its parent's rotated frame. They are composed before
local orientation and participate in the solve geometry, so a non-zero offset changes both the pivot
and the effective link.

## Pole, chains and branches

A `pole` record names a world-space point. A two-bone chain bends toward the pole's side of the
root-to-goal line. Longer chains and trees use it to bend each seed plane before FABRIK follows all
addressed leaves. A pole on a chain with no interior joint is refused at load.

Each goals row addresses one leaf by `memberId`; a tree may bind several leaves. Each leaf's positive
`influence` weights its pull when goals disagree and has no effect on a single-goal chain. A table
must address every body leaf exactly once.

With `inspect: true`, the solver publishes an `inspect` record beside `values`: quality kind,
residual, iterations and whether any member is at a bound.

## Leaves and orientation goals

`orient` is an optional static weight on an addressed `fk3d` leaf. After the position solve it turns
that leaf toward the goal frame's world orientation without changing its solved tip. `orient: 0` is
the position solve; `orient: 1` reaches the goal orientation subject to joint limits. Position
residuals describe the position solve, not a separate orientation residual.

## Lifecycle and determinism

Loading and mounting publish no pose until the first seek, tick or value write. A seek recomposes
the aggregate from current inputs. Seeking backward or repeatedly is deterministic: no solve carries
state from a previous progress, so a scrub reproduces the same published values byte for byte.
Authored value edits are read on the next composition; changing bindings is a structural edit.

A malformed or misplaced field is refused by name rather than ignored, including
`ik-chain-unsupported`, `ik-pole-without-chain`, `ik-pole-without-bend`, `ik-joint-malformed`,
`ik-joint-key-unused`, `ik-orient-malformed` and `ik-orient-without-goal`. See [Errors and
diagnostics](./errors-and-diagnostics.md#inverse-kinematics-and-solver-rules).

## Reading the published tables

`solve` publishes `values` as one row per member with `rotation`, `rotationX`, `rotationY`, and
optional `residual` and `atBound`. `pose` publishes world frames with `x`, `y`, `z`, `rotation`,
`rotationX` and `rotationY`. A renderer selects a row by envelope id through the core selector; the
Three adapter then writes the cells onto its object through `applyValues`.
