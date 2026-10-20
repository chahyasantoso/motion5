# G8 — Migrate apps and playgrounds to the new contract

Status: not implemented. Depends on: D7, E7, G1–G7.

## Start here

Read `00-overview.md`, A5's consumer inventory, the final public authoring, entry-handle and adapter APIs, then only the app code reached by import tracing: `apps/ik-playground/src` (`ik-playground-project.ts`, `ik3d-playground-project.ts`, `playground-runtime.ts`, `playground-session.ts`, `projection.ts`, `goal-control.ts` and the stage components), `apps/pose-gap-filler/src/rig` (`rig.ts`, `tracks.ts`, `solver.ts`, `writer.ts`, `bend-policy.ts`) and `src/view/avatar-body.ts`, and `apps/react-demo/src/full-body-project.ts`.

## Outcome and work

Rewrite every app to author and read through the new contract, in 2D and 3D. Nothing is deferred or flagged off for being 3D.

- `ik-playground`: the 2D project uses `point`/`join`/`root` sources with `ik` and `fk`; the 3D project uses `point3d`/`join3d`/`root3d` with `ik3d` (targets dict and optional pole) and `fk3d`. Projection and stages read explicit `poses[id]`; goal dragging and solver options are entry-nested value writes through entry handles.
- `pose-gap-filler`: the image rig (2D) and the world rig (3D) become new-contract skeletons with goal and pole tracks; `writer.ts` writes entry-nested values; anything reading a rig or pose record uses `readPoses3d` or the 2D poses reader; `avatar-body.ts` keeps `SkeletonDriver` but switches to `poseFrameSource`.
- `react-demo`: the full-body walk rig uses the 2D family with explicit poses selection (E7's React projection).

No app keeps a local parser, converter or copy of topology, poses decoding or binding logic. Keep each app's user-visible behavior; record any change with its contract reason.

`validate-v5.ts` perspective detection reads entry-nested values (G2 confirmed it); check that each 3D app track that needs a perspective is still detected and that requires-only entries raise no false warning.

## Evidence and finish

Run app typechecks, the apps' unit tests and a smoke load of every app project through the public parser. Run one 2D and one 3D playground scenario end to end through public APIs: load, solve, drag a goal, edit a point value, rebind a target, dispose. Run browser checks only through the repository's real workflow and report what was not run.

Done when every app runs on the new contract and no app imports a retired API. Record rewritten files, behavior changes, commands/results and unavailable browser coverage. Next: F1.
