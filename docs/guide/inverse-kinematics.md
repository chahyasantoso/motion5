# Inverse kinematics

This page is for someone rigging bones with the `fk` and `ik` plugins: which way the numbers point, what a solve does and does not read, what it costs, and how a rig behaves across load, edits and seeks. The authored keys themselves are normative in [AUTHORED-SCHEMA.md](../AUTHORED-SCHEMA.md#inverse-kinematics-ik-and-fkrequiressolver), and every load refusal a rig can meet is listed in [Errors and diagnostics](./errors-and-diagnostics.md#inverse-kinematics-and-solver-rules). This page does not restate either.

Every JSON project on this page is executed by the test suite exactly as printed: the `GE-` cases in `packages/core/test/unit/plugins/ik-guide-examples.test.ts` read this file, load each block, and check the behaviour its paragraph claims. An example that stops doing what its paragraph says fails `CI`, so the examples are evidence rather than illustration.

## Conventions

A world frame is `x`, `y` and `rotation`, and nothing else. `x` grows to the right, `y` grows downward, and `rotation` is in degrees, with a positive angle turning `+x` toward `+y`. Those are the numbers the DOM adapter writes as `translate3d(x, y, 0)` and `rotate(rotation deg)`, so a published frame renders without any conversion: a positive rotation turns clockwise on screen. Plotted on the y-up axes of a textbook the same numbers read counter-clockwise; nothing in motion5 flips them for you.

A bone's authored `rotation` is local, relative to the world rotation of the node it hangs from, and it is the bone's rest pose: what it composes when no solve overrides it. Its published `rotation` is world-space, and its published `x` and `y` are its tip, which is where a child bone hangs. A pivot offset (`x` and `y` authored on the bone) is read in the parent's rotated frame, before `length` extends the bone along its own `+x`.

A solver publishes `rotations`, one local angle per member keyed by the member's qualified id, and never moves its `root`. Unconstrained angles are not wrapped into a range: a turn of 370 degrees stays 370 rather than becoming 10, so an animation that scrubs through a full turn does not jump. A member with `minRotation` or `maxRotation` publishes an angle inside its range.

## What a solve reads, and what scale means

A solve reads the root's world frame, each member's `length` and pivot offset, each member's limits, and each goal's `x` and `y`. It reads no scale, because a world frame carries none: `transformPlugin` claims `x`, `y` and `rotation` only. Lengths are world units, and a rig drawn at twice the size is authored with twice the lengths.

To show a rig larger or smaller, scale its container rather than the solve. Any transform applied to the element that holds the whole rig maps every point the same way, so a hand that sits on its goal stays on it, uniformly scaled or not. A nonuniform scale on that container still keeps the hand on the goal, but it skews the bone artwork and no longer shows the angles the solve published, so prefer a uniform one. A `scale` written on one bone's own element changes how that element draws and nothing else: its children hang from the tip the solve computed, not from the scaled drawing.

The solve is exact over every finite rig, from lengths near the smallest double to lengths near the largest, and it is a pure function of its inputs. A rig past `2 ** 500` world units solves as an exactly scaled image of itself, so its angles are the ones the smaller rig would publish. A goal the runtime delivers is always finite, because a goal field that is not a finite number is read as zero where the solver reads its frame, like every frame field. The solve underneath is total over goals too: a coordinate of `Infinity` or `-Infinity` is a direction, so the chain straightens along it and its residual is infinite, and a `NaN` coordinate refuses the solve by name instead of publishing `NaN` (issue [#489](https://github.com/chahyasantoso/motion5/issues/489), ADR-111). A `NaN` is never turned into a plausible number on the way through. The iterative solver's tolerance is an absolute `0.001` world units at every size. A negative `length` means a segment with no extent, in `fk`'s composition and in every solve alike, whether it was authored, written live or produced by an easing overshoot; it is accepted rather than refused, and the bone's tip sits on its pivot (issue [#482](https://github.com/chahyasantoso/motion5/issues/482)).

## Which solver answers a chain

Nobody chooses a solver; the shape of the chain does. A parent and one addressed child with no limits take the closed form, which is exact, costs about the same at any distance, and reports `reached`, `too-far`, `too-near` or `coincident`. Every other chain, longer, branching or limited, takes the iterative solver, which runs at most 64 passes and reports `converged`, `stalled`, `iteration-cap`, `limited` or `conflicted`. Opt into `inspect` on the solver to see which one, with its residual.

## What it costs

A closed-form solve measured 2.3257 microseconds in one fresh run and 1.9013 in its paired run. An iterative solve costs roughly its member count times the passes it takes: chain-8 measured 76.2351 and 75.8308 microseconds, while chain-64 measured 2.9674 and 2.8637 milliseconds and had 17 of 200 results at the 64-pass cap. Branching chains whose leaves pull against a shared member mostly report `conflicted`, including 190 of 200 feasible tree-14 rigs and all 200 feasible tree-30 rigs in the first run. The engine cost per solver per frame was 49.53 microseconds for one rig in the first run, so on a page with many small rigs the publisher, not the closed-form arithmetic, is what you are paying for.

The measured numbers, the machine they were measured on, and the command that reproduces them are in [BENCH-IK.md](../BENCH-IK.md). Read them as a shape rather than a promise: they are one machine's numbers, and the only part `CI` holds is the part that is not a timing.

## A rig across its lifecycle

Loading and mounting a rig publish nothing. The first seek, tick or value write publishes the solve and every bone below it together.

A value edit on a member, such as `overrideValues({ length: 100 })` or a new `weight`, does not rebuild the graph: the solver recomposes from the new value in the same call. Adding or removing a goal with `setGoal` and `removeGoal` is a graph edit, and removing a member re-solves the chain it left, because membership is derived from the members rather than listed on the solver. Remove children before parents, as with any bone.

Nothing carries from one solve to the next. Seeking backward, seeking at random, and replaying the same position publish exactly the bytes the forward pass did, so a scrubber never drifts and a paused frame is the same frame every time.

## Examples

Drive each example the way [Getting started](./getting-started.md) drives any project: register `transformPlugin`, `fkPlugin` and `ikPlugin`, load it, mount every track, and seek. Each example is one motion called `arm`, so its tracks are `arm/<id>`.

### Rest to reach

Weight animates from `0` to `1` on both bones, so the arm starts in its authored rest pose and ends with the hand on the goal. At progress `0` the bones publish exactly their rest rotations composed down the chain; at `1` the forearm's tip sits on `hand-goal`; in between each bone turns along the shorter arc from rest toward the solved angle. The solve itself is the same at every progress: weight is the bone's question, not the solver's.

```json
{
  "schemaVersion": 5,
  "projectId": "rest-to-reach",
  "motions": [
    {
      "id": "arm",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "shoulder",
          "keyframes": {
            "transform": {
              "values": {
                "x": 0,
                "y": 0,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "hand-goal",
          "keyframes": {
            "transform": {
              "values": {
                "x": 90,
                "y": 60,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik": {
              "requires": {
                "root": "shoulder",
                "target": "hand-goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk": {
              "values": {
                "length": 80,
                "rotation": 30,
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
                "base": "shoulder",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk": {
              "values": {
                "length": 60,
                "rotation": 20,
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

### Staggered weight

The upper arm commits over the first half and the forearm over the second, so the shoulder has finished moving before the elbow starts. At progress `0.5` the upper arm publishes exactly the solved angle while the forearm still publishes its rest angle on top of it. Staggering is two weights on two bones; there is no per-solver weight.

```json
{
  "schemaVersion": 5,
  "projectId": "staggered-weight",
  "motions": [
    {
      "id": "arm",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "shoulder",
          "keyframes": {
            "transform": {
              "values": {
                "x": 0,
                "y": 0,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "hand-goal",
          "keyframes": {
            "transform": {
              "values": {
                "x": 90,
                "y": 60,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik": {
              "requires": {
                "root": "shoulder",
                "target": "hand-goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk": {
              "values": {
                "length": 80,
                "rotation": 30,
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
                "base": "shoulder",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk": {
              "values": {
                "length": 60,
                "rotation": 20,
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

### Branches

One spine, two arms, one goal per hand through `targets`. The spine is shared, so it takes the influence-weighted compromise of what each arm needs from it. These goals can be reached together, so the solve converges and `inspection.residuals` shows both hands within tolerance. Move one goal out of reach of the other and the kind becomes `conflicted`, with `residuals` saying which hand paid; branching goals that cannot all be met are the case that runs to the 64-pass cap.

```json
{
  "schemaVersion": 5,
  "projectId": "branches",
  "motions": [
    {
      "id": "arm",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "hips",
          "keyframes": {
            "transform": {
              "values": {
                "x": 0,
                "y": 0,
                "rotation": -90
              }
            }
          }
        },
        {
          "id": "left-goal",
          "keyframes": {
            "transform": {
              "values": {
                "x": -78,
                "y": -89,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "right-goal",
          "keyframes": {
            "transform": {
              "values": {
                "x": 78,
                "y": -89,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik": {
              "values": {
                "inspect": true
              },
              "requires": {
                "root": "hips",
                "targets": {
                  "left-fore": "left-goal",
                  "right-fore": "right-goal"
                }
              }
            }
          }
        },
        {
          "id": "spine",
          "keyframes": {
            "fk": {
              "values": {
                "length": 60
              },
              "requires": {
                "base": "hips",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "left-upper",
          "keyframes": {
            "fk": {
              "values": {
                "length": 45
              },
              "requires": {
                "base": "spine",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "left-fore",
          "keyframes": {
            "fk": {
              "values": {
                "length": 40
              },
              "requires": {
                "base": "left-upper",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "right-upper",
          "keyframes": {
            "fk": {
              "values": {
                "length": 45
              },
              "requires": {
                "base": "spine",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "right-fore",
          "keyframes": {
            "fk": {
              "values": {
                "length": 40
              },
              "requires": {
                "base": "right-upper",
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

### Transformed root

The shoulder is moved and turned a quarter turn, and the goal is authored in world space as always. The hand still lands on the goal, and the solver's `rotations` are local: the upper arm's published world rotation is the shoulder's `90` plus its solved local angle. `bend: "positive"` picks the elbow that turns toward increasing local rotation.

```json
{
  "schemaVersion": 5,
  "projectId": "transformed-root",
  "motions": [
    {
      "id": "arm",
      "trigger": {
        "type": "manual"
      },
      "tracks": [
        {
          "id": "shoulder",
          "keyframes": {
            "transform": {
              "values": {
                "x": 200,
                "y": 150,
                "rotation": 90
              }
            }
          }
        },
        {
          "id": "hand-goal",
          "keyframes": {
            "transform": {
              "values": {
                "x": 150,
                "y": 260,
                "rotation": 0
              }
            }
          }
        },
        {
          "id": "solve",
          "keyframes": {
            "ik": {
              "values": {
                "bend": "positive"
              },
              "requires": {
                "root": "shoulder",
                "target": "hand-goal"
              }
            }
          }
        },
        {
          "id": "upper",
          "keyframes": {
            "fk": {
              "values": {
                "length": 80
              },
              "requires": {
                "base": "shoulder",
                "solver": "solve"
              }
            }
          }
        },
        {
          "id": "fore",
          "keyframes": {
            "fk": {
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
