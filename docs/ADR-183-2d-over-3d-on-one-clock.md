# ADR-183: 2D over 3D on one clock

**Status:** Accepted, 2026-11-14

## Context

One scene could already return 2D and 3D targets, since `useTarget` and `useTarget3d` subscribe to the same player,
but nothing turned a 3D point into stage pixels or answered where a posed bone's joint is, so a label could not
follow a point. `motion:review` held one limit per field kind for every target, so a scene holding px and world units
was judged by one of them, and a 0-1 custom number was judged as a position. A 3D page drew on its own
`requestAnimationFrame` loop while DOM targets were written on the player's step.

## Decision

- **The scene projects, the page draws.** `project3d(point, lens, stage)` in `@gerak/moves`, beside `orbit` and
  `aim`, answers a world point's stage position in px from the top left, its depth along the view, and whether it is
  in front of the lens. `lens` is a camera `Pose3d` plus `fov`, vertical degrees (`Lens3d`). It is pure, so a label's
  pose is part of the scene: sampled, reviewed and scrubbed like any other. The page builds its camera from the
  `fov` and stage size the scene module exports, so the lens has one owner.
- **A posed joint's point is rig's answer.** `posedJoints3d(table, bones, root)` in `@gerak/rig` answers every
  joint's world point under bone poses by the equation `applyBones` writes, from a `motion:joints` table, with
  `root` the pose of the model's parent group.
- **Review limits belong to targets.** A scene module may export `limits`, a record of target name to
  `{ jump?, turn?, ratio? }`; the command's flags are the default for every other target. A `custom.*` number is
  judged by `ratio`.
- **A 3D page draws on the player's step,** when a target it binds is written, never from a free-running loop, so the
  canvas and DOM targets show the same time. The `--three` scaffold does so.
- **Labels stay plain DOM over the canvas,** in the same stage box. No `CSS2DRenderer`, no React Three Fiber
  `<Html>`, and no occlusion: the scene hides a label through `opacity`.

## Consequences

- A label pinned to a point is checked like any pose: by samples, by the review and by scrubbing.
- A page that sets its own `fov` or aspect drifts every label; the scaffold and the guide read both from the scene.
