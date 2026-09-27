# Inverse kinematics in 3D

This page is for someone rigging a three-dimensional chain with the `transform3d`, `fk3d` and
`ik3d` plugins: which way the frame points, what a solve reads, how a rig branches, and how the
published pose reaches a renderer. Authored keys are normative in [AUTHORED-SCHEMA.md](../AUTHORED-SCHEMA.md#inverse-kinematics-ik-and-fkrequiressolver), and every load refusal is listed in [Errors and diagnostics](./errors-and-diagnostics.md#inverse-kinematics-and-solver-rules). This page does not duplicate either contract.

Every JSON project on this page is executed by `packages/core/test/unit/plugins/ik3d-guide-examples.test.ts`, exactly as printed. That test reads this file, parses every `json` block, loads each project, registers all three 3D plugins, mounts every track and seeks the cases described below. The examples are executable evidence, not illustrative pseudocode.

## Conventions

A world frame is `x`, `y`, `z`, `rotation`, `rotationX` and `rotationY`, with angles in degrees.
The orientation is `Rz(rotation) · Rx(rotationX) · Ry(rotationY)`, CSS's intrinsic Z-X-Y order,
which is the same order named `ZXY` by three.js. The DOM adapter writes the frame as
`translate3d(x, y, z)`, `rotate(rotation deg)`, `rotateX(rotationX deg)` and
`rotateY(rotationY deg)`. A positive angle follows the CSS frame convention; the values are not
converted to radians or to a different Euler order by the core.

A published `fk3d` member frame is at the member's tip: its `x`, `y` and `z` are the world position
where its child hangs. Its `rotation`, `rotationX` and `rotationY` are that member's world
orientation. Authored `fk3d` rotations are local to the member's parent and are the rest
orientation. Authored `transform3d` frames for roots and goals are world frames. A member's
`x`, `y` and `z` in `fk3d` are a pivot offset in the parent's rotated frame, before the member's
length extends along local `+x`.

The solver publishes `rotations3d`, a local Euler triple per solved member, keyed by qualified
member id. The member plugin composes those triples into world frames. `ik3d` does not move the
root or the goal. It reads world-space goal positions, and an optional pole is a world-space point.
Missing or
non-finite frame numbers are read as zero by the relevant frame reader; authored angle and weight
semantics remain those described in the schema.

## Registration and rig shape

The registry has no implicit 3D plugins. Register all three explicitly before loading a project:

```ts
import { PluginRegistry } from "@motion5/core";
import { fk3dPlugin } from "@motion5/core/plugins/fk3d";
import { ik3dPlugin } from "@motion5/core/plugins/ik3d";
import { transform3dPlugin } from "@motion5/core/plugins/transform3d";

const plugins = new PluginRegistry();
plugins.register(transform3dPlugin);
plugins.register(fk3dPlugin);
plugins.register(ik3dPlugin);
// Pass `plugins` to the Engine options together with the clock, interpolator and scheduler for
// your host.
```

The snippet is a registration sketch; the JSON projects below are the complete definitions
executed by the guide test. A `transform3d` track supplies a root, goal or pole frame. An `fk3d`
track supplies a member with `length` and optional local rest orientation, pivot offset, `weight`,
`joint` limit, `influence` or `orient`; it binds `base` and `solver`. An `ik3d` track binds `root` and either one
`target` or a dictionary of `targets`; it may also bind `pole`. Authoring is grouped-only, so these
sections live under `keyframes` as `transform3d`, `fk3d` and `ik3d` groups.

The solver's chain shape is derived from those bindings. A parent with one addressed child and no
constraining joint uses the closed-form two-bone solve. Longer chains and branches use 3D FABRIK;
that solve reconstructs the missing roll from each member's rest orientation and adds no arbitrary
roll. A `joint` of `hinge`, `cone` or `swing-twist` sends even a two-member chain through FABRIK.
A `free` joint is the default and adds no constraint. A hinge uses an axis in the parent's solved
frame and `minRotation`/`maxRotation`; a cone uses `maxSwing`; a swing-twist uses `maxSwing` and
`minTwist`/`maxTwist`. Bounds are local to the member and are not measured from its rest pose.

## Rest orientation, weight and offsets

A member's authored `rotation`, `rotationX` and `rotationY` are its local rest orientation. When a
solver is bound, its `weight` blends that rest orientation toward the solved local orientation for
that member. Weight `0` is the rest pose, weight `1` is the solve, and the blend follows the shorter
rotation arc rather than independently interpolating Euler coordinates. Because weight belongs to a
member, different members can commit at different progress values. Under a FABRIK chain the rest
orientation also supplies the roll used to reconstruct a 3D pose.

The member's `x`, `y` and `z` are pivot offsets in its parent's rotated frame. They are composed
before local orientation and are included in the solve geometry. A non-zero offset therefore changes
both where the member's pivot starts and the effective link the solver reaches through; it is not a
renderer-only translation.

## Pole, chains and branches

A solver's `pole` requirement names a world-space point. For a two-bone chain it selects the bend
side:
the elbow lies on the pole's side of the line from the effective root pivot to the goal. On a longer
chain or tree it bends the seed plane for each root-to-leaf path, after which FABRIK follows all
addressed goals. A pole on a chain with no interior joint is refused at load.

A dictionary in `targets` addresses leaves by member id. A tree can share trunk members and
branch to multiple leaves. The tree solve uses each addressed leaf's positive `influence` as its pull
weight; `influence` has no effect on a one-goal chain. A solve with `inspect: true` adds
`inspection` beside `rotations3d`; it reports the quality kind, residuals, iterations and any
limited members. Without that opt-in, the authored `inspect` value remains beside `rotations3d`,
and the solver omits `inspection`.

## Leaves and orientation goals

`orient` is an optional static weight on an addressed `fk3d` leaf. After the position solve,
`orient` turns that leaf toward the goal frame's world orientation without changing its solved tip.
A positive-length leaf can change its roll about local `+x`; a zero-length leaf can take the whole
orientation.
`orient: 0` is the position solve, and `orient: 1` reaches the goal orientation subject to any joint
limit. Position residuals and quality still describe the position solve, not a separate orientation
residual.

## Lifecycle and determinism

Loading and mounting publish no pose until the first seek, tick or value write. A seek recomposes
root, goals, solver and members from the current inputs. Seeking backward, randomly or repeatedly is
deterministic: no solve carries state from a previous progress, so a scrub reproduces the same
published values byte for byte. Value edits to authored fields are read on the next composition;
changing graph bindings is a load-time graph edit.

A malformed or misgrouped field is refused by name rather than ignored. Examples include
`ik-chain-unsupported`, `ik-pole-without-chain`, `ik-pole-without-bend`, `ik-joint-malformed`,
`ik-joint-key-unused`, `ik-orient-malformed`, `ik-orient-without-goal`, and the corresponding
limit and influence rules. See [Errors and diagnostics](./errors-and-diagnostics.md#inverse-kinematics-and-solver-rules)
for the complete inventory and paths.

## Examples

The examples all use one manual motion, `rig`. Register `transform3dPlugin`, `fk3dPlugin` and
`ik3dPlugin`, load the project, mount `rig/<track>` for every track, and seek the goal or member
tracks. The guide test performs that sequence.

### Rest to reach

The two members begin in their authored local rest orientations because both weights are zero at
progress `0`. At progress `1`, both weights are one and the forearm tip reaches the world-space
goal.
The solver's `rotations3d` is available at both progress values; member weight, not a solver-wide
weight, controls the staged pose.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-rest-to-reach",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 5,
                "y": -5,
                "z": 0
              }
            }
          }
        },
        {
          "id": "goal",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 70,
                "y": 40,
                "z": 50
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "requires": {
                "root": "root",
                "target": "goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 80,
                "rotation": 20,
                "rotationX": -30,
                "rotationY": 10,
                "weight": [
                  {
                    "p": 0,
                    "v": 0
                  },
                  {
                    "p": 1,
                    "v": 1
                  }
                ]
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 60,
                "rotation": 0,
                "rotationX": 15,
                "rotationY": -25,
                "weight": [
                  {
                    "p": 0,
                    "v": 0
                  },
                  {
                    "p": 1,
                    "v": 1
                  }
                ]
              },
              "requires": {
                "base": "upper",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Pole flip

The pole moves from one side of the goal line to the other. At both endpoints the forearm reaches
the goal, while the elbow is on the side named by the current pole. The pole is a world-space
`transform3d` point and is bound on the same `ik3d` group as `root` and `target`.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-pole-flip",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 0,
                "y": 0,
                "z": 0
              }
            }
          }
        },
        {
          "id": "goal",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 70,
                "y": 40,
                "z": 50
              }
            }
          }
        },
        {
          "id": "pole",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 30,
                "y": [
                  {
                    "p": 0,
                    "v": 120
                  },
                  {
                    "p": 1,
                    "v": -120
                  }
                ],
                "z": 10
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "requires": {
                "root": "root",
                "target": "goal",
                "pole": "pole"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 80
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 60
              },
              "requires": {
                "base": "upper",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Offsets and staggered weight

The root is rotated, and both members use non-zero pivot offsets. The upper member reaches fully at
progress `0.5`, while the forearm remains in its rest orientation until progress `0.5` and then
reaches. At progress `1` the published forearm tip is on the goal; the offsets are part of that
closed-form geometry rather than a post-solve drawing adjustment.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-offsets-staggered",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 5,
                "y": -3,
                "z": 2,
                "rotation": 25,
                "rotationX": -15,
                "rotationY": 20
              }
            }
          }
        },
        {
          "id": "goal",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 70,
                "y": 40,
                "z": 50
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "requires": {
                "root": "root",
                "target": "goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 80,
                "x": 5,
                "y": -3,
                "z": 2,
                "weight": [
                  {
                    "p": 0,
                    "v": 0
                  },
                  {
                    "p": 0.5,
                    "v": 1
                  },
                  {
                    "p": 1,
                    "v": 1
                  }
                ]
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 60,
                "x": -10,
                "y": 6,
                "z": 4,
                "rotation": 10,
                "weight": [
                  {
                    "p": 0,
                    "v": 0
                  },
                  {
                    "p": 0.5,
                    "v": 0
                  },
                  {
                    "p": 1,
                    "v": 1
                  }
                ]
              },
              "requires": {
                "base": "upper",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

### A branched tree with influence

The shared member feeds two addressed leaves. Inspection is opted in on the solver, and each leaf
has a goal through `targets`. The weighted version below pulls the `left` branch four times as hard
as the `right` branch; both remain part of one deterministic FABRIK tree solve.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-branched-influence",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 0,
                "y": 0,
                "z": 0
              }
            }
          }
        },
        {
          "id": "goal-left",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 70,
                "y": 60,
                "z": 0
              }
            }
          }
        },
        {
          "id": "goal-right",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 70,
                "y": -60,
                "z": 0
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "values": {
                "inspect": true
              },
              "requires": {
                "root": "root",
                "targets": {
                  "left": "goal-left",
                  "right": "goal-right"
                }
              }
            }
          }
        },
        {
          "id": "shared",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 50
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "left",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 50,
                "influence": 4
              },
              "requires": {
                "base": "shared",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "right",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 50,
                "influence": 1
              },
              "requires": {
                "base": "shared",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Joint-limited chain

The upper member is a `cone` and the lower member is a one-way `hinge`. The first goal is inside
those limits and converges. At progress `1`, the goal is outside the legal set, so inspection
reports
`limited`, a positive residual and at least one member in `atBound`; the solver does not claim that
the unreachable limited pose reached its goal.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-limited-chain",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 4,
                "y": -2,
                "z": 1,
                "rotation": 15
              }
            }
          }
        },
        {
          "id": "goal",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": [
                  {
                    "p": 0,
                    "v": 58.8
                  },
                  {
                    "p": 1,
                    "v": -40
                  }
                ],
                "y": [
                  {
                    "p": 0,
                    "v": 2.8
                  },
                  {
                    "p": 1,
                    "v": -30
                  }
                ],
                "z": [
                  {
                    "p": 0,
                    "v": 1
                  },
                  {
                    "p": 1,
                    "v": 20
                  }
                ]
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "values": {
                "inspect": true
              },
              "requires": {
                "root": "root",
                "target": "goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 30,
                "joint": "cone",
                "maxSwing": 40
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "lower",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 30,
                "joint": "hinge",
                "minRotation": -90,
                "maxRotation": 0
              },
              "requires": {
                "base": "upper",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

### Orientation on a leaf

The zero-length `hand` is the addressed leaf. Position solving places its pivot at the goal within
FABRIK tolerance, and `orient: 1` gives that leaf the goal's complete world orientation without
moving the pivot. This is
why a zero-length end effector is useful when a rig needs both position and orientation.

```json
{
  "schemaVersion": 5,
  "projectId": "3d-oriented-leaf",
  "motions": [
    {
      "id": "rig",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "root",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 5,
                "y": -4,
                "z": 7,
                "rotation": 12,
                "rotationX": -8,
                "rotationY": 15
              }
            }
          }
        },
        {
          "id": "goal",
          "keyframes": {
            "transform3d": {
              "values": {
                "x": 32,
                "y": -48,
                "z": 42,
                "rotation": 125,
                "rotationX": 35,
                "rotationY": -55
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik3d": {
              "requires": {
                "root": "root",
                "target": "goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 55
              },
              "requires": {
                "base": "root",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 45
              },
              "requires": {
                "base": "upper",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "hand",
          "keyframes": {
            "fk3d": {
              "values": {
                "length": 0,
                "orient": 1
              },
              "requires": {
                "base": "fore",
                "solver": "solve"
              }
            }
          }
        }
      ]
    }
  ]
}
```

## Rendering

For DOM output, use the core DOM adapter: it composes the scalar frame as `translate3d`, `rotate`,
`rotateX` and `rotateY`. A renderer-specific adapter can map the same published values without
changing the solver. The `@motion5/three` workspace package provides `createObject3dPatchAdapter(resolve)` and `writeFrame3d(object, values)`, mapping the three Euler angles to an `Object3D` whose Euler order is `ZXY`.
