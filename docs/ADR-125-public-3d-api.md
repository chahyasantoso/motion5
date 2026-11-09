# ADR-125: Public 3D API

**Superseded in part by ADR-133, 2026-10-04.**

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 8,
2026-09-27, above `main` at `6f598965074d50c5c90271ff4d8087620e487fbc`. Accepted when the pull
request carrying it merges.

## Invariant

Consumer reaches 3D plugins only through package subpaths `@motion5/core/plugins/transform3d`, `@motion5/core/plugins/fk3d` and `@motion5/core/plugins/ik3d`, each publishing exactly its plugin definition and declaration closure outside `runtime/` and `graph/`; no file under `packages/core/src` imports renderer; and renderer type reaches no solver, because renderer adapter is own workspace package, `@motion5/three`, with `three` as peer.

## Decisions

- Subpaths, not root exports. Root `@motion5/core` entry unchanged → boundary allow list unchanged by decision: promotion widens package map, which `packages/core/package.json` owns, and nothing else (`TH-111`).
- Boundary scan names `plugins` as core layer and refuses directory under `packages/core/src` that no layer declares → "core imports no renderer" claim holds where every solver lives (`TH-112`, `TH-113`).
- Consumer workspace may import only `@motion5/core` subpath core manifest declares. Source aliases in `tsconfig.json` and Vite apps resolve any path → undeclared one would pass in this repository and fail for every consumer of built package (`TH-114`). Tree with no core manifest declares nothing, fails closed.
- Plugin subpaths held to root entry's declaration-closure rule (`TH-122`).
- Root `vite.config.ts` aliases exactly six declared plugin subpaths to source, because its string alias for bare package name would otherwise swallow them. `tsconfig.json`'s existing wildcard stays one type-resolution owner; explicit 3D entries would be second.
- Executed 3D guide, `docs/guide/inverse-kinematics-3d.md`, read by `ik3d-guide-examples.test.ts` exactly as printed (`TH-115` to `TH-121`, ADR-095).
- `@motion5/three` writes published world frame onto `Object3D`: position as published, rotation as radians with Euler order `ZXY`, which three.js composes as `Rz·Rx·Ry`, convention `frame3d.ts` owns. Reads render decision through `patchRender` and closes switch with `unreachable`, reached through `@motion5/core/internal` exactly as `@motion5/react` reaches them, rather than restating either (`TH-123` to `TH-128`). `three` is peer (`>=0.160.0`) and dev dependency for package's own tests; stray React peer removed.
- Playground's first public 3D slice renderer-neutral CSS 3D through core DOM adapter → app gains no dependency (`TH-129` to `TH-131`). Checkpoint-3 playground deliberately broader: DOM tab renders 2D FABRIK stage left, 3D FABRIK stage right, solver panel far right; `three.js` tab renders same 3D project through `@motion5/three`, panel right. On phone-width screens stages stack and panel becomes scrollable strip below them (layout checked in headless Chromium, not suite test).
- App and integration suite use one `loadPlayground` setup path. Composes 2D and 3D Motions into one authored project because `addMotion` accepts only empty-track Motions; attempting to add full authored 3D Motion at runtime caused checkpoint-2 blank page → composition and shared mounting are owner (`TH-132`).
- Page scroll is one trigger for both Motions, changes only authored member weights: top-to-bottom goes unsolved to solved, while goal drag writes immediately at weight scroll currently selected. Planar and spatial drags separate closed goal moves but share this immediate value-tier publication (`TH-134`, `TH-136`, `TH-137`). Non-finite goals refused, finite goals clamped to stage bounds, planar flip written by same control owner (`TH-138`).
- Pending-intent model withdrawn. Owner asked for immediate drags → marker does not wait for next scroll event, application does not keep pending versus applied goals. Scroll owns weight only; `GoalControl` owns goal and flip writes. Coalescing and disposal still cancel queued work and source subscriptions exactly once (`TH-139`).
- `@motion5/three` keeps DOM adapter's per-object, per-node revision ordering, refusing stale or duplicate frames and re-arming node when object rebound (`TH-133`). Core import predicates all read single extracted import-specifier set → dynamic `import()` and `require()` of `three`, `react`, or `gsap` refused at boundary rather than bypassing static scan (`TH-135`).
- React-demo joint markers derive position only from published joint frame: labels stay upright instead of inheriting bone rotation; markers for removed arm members hidden rather than stuck in previous position (`TH-140`, `TH-141`).
- CSS 3D and WebGL use one centred CSS-perspective projection. Matching three.js camera uses same view dimensions and perspective, mirrored y axis accounted for → goal at given world point lands on same pixel, pointer unprojection answers same depth in both tabs (`TH-142` to `TH-144`).
- Every 3D stage draws `IK3D_FRAME`, box widened until goal handle stays whole at every reachable depth; spatial drag clamped to that drawn frame rather than authored box → handle never clipped, never stops at invisible edge (`TH-145`, `TH-146`). Handle lives in 3D world → perspective scales it with centre: margin frame corner and drag clamp keep is handle's world radius times depth scale at that corner (`drawnRadius`), not constant screen margin, which under-framed nearest depth by about 8px (27px authored, 34.7px drawn at `z = 160`). Both tests assert drawn handle box, not centre. Three.js renderer owns its canvas (React-owned canvas cannot survive `forceContextLoss()` across StrictMode remount, which blanked tab), each tab sits in error boundary, and goal handle over WebGL canvas is same DOM control as in CSS stage → touch, focus and keyboard behave identically. `three` pinned to `^0.186.1` to match `@types/three`.
- ADR-114, ADR-115, ADR-116, ADR-117, ADR-118, ADR-120, ADR-122, ADR-123 and ADR-124 marked Accepted as public contract. Their "nothing 3D is exported" sentences describe surface each slice changed and stay as written; ADR-114's internal-only decision carries marker.
- 3D section of `BENCH-IK.md` is published envelope: phases 6 and 7 left six unconstrained scenarios byte-identical (3D tree identity `7e3cf790`) → not re-measured.

## What is withdrawn

- Re-exporting 3D plugins from root entry: two paths to one definition.
- Earlier CSS-only playground proposal: checkpoint 3 adds `three.js` tab because renderer adapter now exists, while keeping DOM tab and shared project as two views of one rig.
- Two-bone playground arm: page now demonstrates 2D FABRIK left and 3D FABRIK right, not analytic arm example.
- Pending versus applied goal intent: contradicted requested immediate drag behavior and made scroll second owner of goals.

## Evidence

`TH-111` to `TH-146`, run in sandbox under Vitest stand-in with real TypeScript 5.8.3, GSAP 3.15.0 and three 0.186.1 and reviewed, not trusted; CI on pull request #516 is evidence of record. Checkpoint 2 to 5 records are `TH-132` through `TH-146`: shared playground setup and blank-page fix (`TH-132`), adapter and boundary hardening (`TH-133`, `TH-135`), weight-only scroll and immediate goal writes (`TH-134`, `TH-136` to `TH-139`), React marker derivation (`TH-140`, `TH-141`), and shared CSS/WebGL projection and frame (`TH-142` to `TH-146`).
