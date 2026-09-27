# ADR-125: Public 3D API

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 8,
2026-09-27, above `main` at `6f598965074d50c5c90271ff4d8087620e487fbc`. Accepted when the pull
request carrying it merges.

## Invariant

A consumer reaches the 3D plugins only through the package subpaths
`@motion5/core/plugins/transform3d`, `@motion5/core/plugins/fk3d` and
`@motion5/core/plugins/ik3d`, each of which publishes exactly its plugin definition and a
declaration closure outside `runtime/` and `graph/`; no file under `packages/core/src` imports a
renderer; and a renderer type reaches no solver, because the renderer adapter is its own workspace
package, `@motion5/three`, with `three` as a peer.

## Decisions

- Subpaths, not root exports. The root `@motion5/core` entry is unchanged, so the boundary allow
  list is unchanged by decision: promotion widens the package map, which
  `packages/core/package.json` owns, and nothing else (`TH-111`).
- The boundary scan names `plugins` as a core layer and refuses a directory under
  `packages/core/src` that no layer declares, so the "core imports no renderer" claim holds where
  every solver lives (`TH-112`, `TH-113`).
- A consumer workspace may import only a `@motion5/core` subpath the core manifest declares. The
  source aliases in `tsconfig.json` and the Vite apps resolve any path, so an undeclared one would
  pass in this repository and fail for every consumer of the built package (`TH-114`). A tree with
  no core manifest declares nothing and fails closed.
- The plugin subpaths are held to the root entry's declaration-closure rule (`TH-122`).
- Root `vite.config.ts` aliases exactly the six declared plugin subpaths to source, because its
  string alias for the bare package name would otherwise swallow them. `tsconfig.json`'s existing
  wildcard stays the one type-resolution owner; explicit 3D entries would be a second one.
- The executed 3D guide, `docs/guide/inverse-kinematics-3d.md`, is read by
  `ik3d-guide-examples.test.ts` exactly as printed (`TH-115` to `TH-121`, ADR-095).
- `@motion5/three` writes a published world frame onto an `Object3D`: position as published,
  rotation as radians with Euler order `ZXY`, which three.js composes as `Rz·Rx·Ry`, the
  convention `frame3d.ts` owns. It reads the render decision through `patchRender` and closes the
  switch with `unreachable`, reached through `@motion5/core/internal` exactly as `@motion5/react`
  reaches them, rather than restating either (`TH-123` to `TH-128`). `three` is a peer
  (`>=0.160.0`) and a dev dependency for the package's own tests; the stray React peer is removed.
- The playground's first public 3D slice is renderer-neutral CSS 3D through the core DOM adapter,
  so the app gains no dependency (`TH-129` to `TH-131`). The checkpoint-3 playground is deliberately
  broader: its DOM tab renders the 2D FABRIK stage on the left, the 3D FABRIK stage on the right and
  the solver panel at the far right; its `three.js` tab renders the same 3D project through
  `@motion5/three`, with the panel on the right. On phone-width screens the stages stack and the
  panel becomes the scrollable strip below them (layout checked in headless Chromium, not a suite test).
- The app and the integration suite use one `loadPlayground` setup path. It composes the 2D and 3D
  Motions into one authored project because `addMotion` accepts only empty-track Motions; attempting
  to add the full authored 3D Motion at runtime caused the checkpoint-2 blank page, so composition
  and shared mounting are the owner (`TH-132`).
- The page scroll is the one trigger for both Motions, and it changes only authored member weights:
  top-to-bottom goes from unsolved to solved, while a goal drag writes immediately at the weight the
  scroll currently selected. Planar and spatial drags are separate closed goal moves but share this
  immediate value-tier publication (`TH-134`, `TH-136`, `TH-137`). Non-finite goals are refused,
  finite goals are clamped to the stage bounds, and the planar flip is written by the same control owner (`TH-138`).
- The pending-intent model is withdrawn. The owner asked for immediate drags, so a marker does not
  wait for the next scroll event and the application does not keep pending versus applied goals.
  Scroll owns weight only; `GoalControl` owns goal and flip writes. Coalescing and disposal still cancel queued
  work and source subscriptions exactly once (`TH-139`).
- `@motion5/three` keeps the DOM adapter's per-object, per-node revision ordering, refusing stale or
  duplicate frames and re-arming a node when an object is rebound (`TH-133`). Core import predicates
  all read the single extracted import-specifier set, so dynamic `import()` and `require()` of
  `three`, `react`, or `gsap` are refused at the boundary rather than bypassing the static scan
  (`TH-135`).
- React-demo joint markers derive position only from the published joint frame: labels stay upright
  instead of inheriting a bone rotation, and markers for removed arm members are hidden rather than
  remaining stuck in the previous position (`TH-140`, `TH-141`).
- CSS 3D and WebGL use one centred CSS-perspective projection. The matching three.js camera uses
  the same view dimensions and perspective, with the mirrored y axis accounted for, so a goal at a
  given world point lands on the same pixel and pointer unprojection answers the same depth in both
  tabs (`TH-142` to `TH-144`).
- Every 3D stage draws `IK3D_FRAME`, the box widened until the goal handle stays whole at every
  reachable depth, and a spatial drag is clamped to that drawn frame rather than to the authored
  box, so the handle is never clipped and never stops at an invisible edge (`TH-145`, `TH-146`).
  The handle lives in the 3D world, so perspective scales it with its centre: the margin a frame
  corner and the drag clamp keep is the handle's world radius times the depth scale at that corner
  (`drawnRadius`), not a constant screen margin, which under-framed the nearest depth by about 8px
  (27px authored, 34.7px drawn at `z = 160`). Both tests assert the drawn handle box, not the centre. The
  three.js renderer owns its canvas (a React-owned canvas cannot survive `forceContextLoss()` across
  the StrictMode remount, which blanked the tab), each tab sits in an error boundary, and the goal
  handle over the WebGL canvas is the same DOM control as in the CSS stage, so touch, focus and
  keyboard behave identically. `three` is pinned to `^0.186.1` to match `@types/three`.
- ADR-114, ADR-115, ADR-116, ADR-117, ADR-118, ADR-120, ADR-122, ADR-123 and ADR-124 are marked
  Accepted as the public contract. Their "nothing 3D is exported" sentences describe the surface
  each slice changed and stay as written; ADR-114's internal-only decision carries a marker.
- The 3D section of `BENCH-IK.md` is the published envelope: phases 6 and 7 left the six
  unconstrained scenarios byte-identical (3D tree identity `7e3cf790`), so it is not re-measured.

## What is withdrawn

- Re-exporting the 3D plugins from the root entry: two paths to one definition.
- The earlier CSS-only playground proposal: checkpoint 3 adds a `three.js` tab because the renderer
  adapter now exists, while keeping the DOM tab and the shared project as the two views of one rig.
- The two-bone playground arm: the page now demonstrates 2D FABRIK on the left and 3D FABRIK on the
  right, not an analytic arm example.
- Pending versus applied goal intent: it contradicted the requested immediate drag behavior and made
  scroll a second owner of goals.

## Evidence

`TH-111` to `TH-146`, run in the sandbox under the Vitest stand-in with real TypeScript 5.8.3,
GSAP 3.15.0 and three 0.186.1 and reviewed, not trusted; CI on pull request #516 is the evidence of
record. The checkpoint 2 to 5 records are `TH-132` through `TH-146`: shared playground setup and the
blank-page fix
(`TH-132`), adapter and boundary hardening (`TH-133`, `TH-135`), weight-only
scroll and immediate goal writes (`TH-134`, `TH-136` to `TH-139`), React marker derivation
(`TH-140`, `TH-141`), and the shared CSS/WebGL projection and frame (`TH-142` to `TH-146`).
