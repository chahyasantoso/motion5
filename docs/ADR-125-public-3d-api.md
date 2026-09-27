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
- The playground demo is renderer-neutral CSS 3D through the core DOM adapter, so the app gains no
  dependency (`TH-129` to `TH-131`).
- ADR-114, ADR-115, ADR-116, ADR-117, ADR-118, ADR-120, ADR-122, ADR-123 and ADR-124 are marked
  Accepted as the public contract. Their "nothing 3D is exported" sentences describe the surface
  each slice changed and stay as written; ADR-114's internal-only decision carries a marker.
- The 3D section of `BENCH-IK.md` is the published envelope: phases 6 and 7 left the six
  unconstrained scenarios byte-identical (3D tree identity `7e3cf790`), so it is not re-measured.

## What is withdrawn

- Re-exporting the 3D plugins from the root entry: two paths to one definition.
- A three.js demo in the playground: it would add a renderer dependency to an app whose point is
  core, and the adapter package already proves the mapping.

## Evidence

`TH-111` to `TH-131`, run in the sandbox under the Vitest stand-in with real TypeScript 5.8.3,
GSAP 3.15.0 and three 0.186.1; reviewed, not trusted, and no CI run yet.
