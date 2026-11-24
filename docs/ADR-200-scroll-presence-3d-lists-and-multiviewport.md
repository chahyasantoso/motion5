# ADR-200: Scroll presence, 3D lists, cylinder physics, and multi-viewport checks

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

Scroll-driven 3D sections in `apps/pieces/cookie/` still hid off-screen meshes by pushing them behind
the camera (`PARKED_Z`), because `.show(...)` accepted only timed `Beat` windows. Arrays of identical
3D meshes or burst particles required N separate `object(...)` casts instead of one list element,
multi-viewport checks needed one invocation per viewport size, and 3D rigid bodies lacked an upright
or rolling cylinder collider.

## Decision

1. **Scroll-window `.show()` and single-owner `frame().visible`.**
   - `ShowWindow` in `@gerak/stage` also accepts `ScrollBeat`, `[ScrollPoint, ScrollPoint]`,
     `{ from: ScrollPoint }`, and `{ until: ScrollPoint }`. Referenced scroll elements are validated
     as read-only geometry references (usable across `.include()` boundaries).
   - `frame()` is the single owner of `visible[name]`, intersecting clock `.show` windows (`stage.visibleAt(ms)`)
     with scroll `.show` windows evaluated against `scroll.y(time, events)` and measured `rest`, and
     attaches the merged map onto `targets` via `withFrameVisible` / `frameVisible`.
   - `@gerak/three`'s `threeBinder` reads `frameVisible(player.values)` instead of calling
     `stage.visibleAt(ms)` separately, and `@gerak/dom`'s `mount` skips compositor handoff for
     members carrying scroll `.show` rules.

2. **3D list objects (`object(name, { parts: true })`).**
   - `object(name, { parts?: boolean, view? })` accepts `parts: true` for lists posed by
     `ListPose3d` (`(index, count) => Pose3d`), read at runtime with `listPose3d`.
   - `stagger` and `bindEach` carry typed 2D (`Pose2d`) and 3D (`Pose3d`) overloads.
   - `threeBinder` binds `parts: true` objects to either an `Object3D[]` override or a named
     `THREE.Group`'s `children`, reports part counts through `Binder.counts`, and measures per-part
     bounds alongside the base object name. `mount` merges `Binder.counts` into `Measurement.counts`,
     `gerak measure` persists `counts` in `MeasureCache`, and `reviewSceneModule` / `sampleScene`
     expand 3D list parts cleanly (including skipping jump checks while hidden by `.show`).

3. **Multi-viewport `--sizes` and headless `--events` / sticky-zone review.**
   - `gerak check` and `gerak review <page>` accept `--sizes WxH,WxH` (mutually exclusive with
     `--size`). Findings, frames, and page errors are prefixed `[WIDTHxHEIGHT]`, and `gerak review`
     emits one labelled contact sheet `sheet-<WIDTHxHEIGHT>.png` per viewport alongside `sheets` and
     `viewports`.
   - `gerak review <scene.ts>` accepts `--events <list>` alongside `cues`, and probes sticky
     `[minY, maxY]` scroll positions plus watched DOM events (`enter`, `down`, `click`, `focus`)
     on `"settle"` members before flagging them as never moved.

4. **3D cylinder physics.**
   - `@gerak/physics` adds `{ kind: "cylinder", radius, height }` to `Shape3d` and
     `{ kind: "cylinder", x, y, z, radius, height }` to `Collider3d`.
   - `@gerak/rapier` backs both with `RAPIER.ColliderDesc.cylinder(height / 2, radius)`.

## Consequences

- Multi-section 3D pages hide off-screen objects cleanly via `.show(...)` scroll ranges with zero
  parking coordinates and single-owner visibility shared between DOM and Three.js.
- Homogeneous 3D collections and simulated bursts (such as falling cookies and scatter crumbs)
  author as one `object(..., { parts: true })` cast element.
- Responsive checks across desktop and phone sizes run in one pass per tool invocation.

## Amends

- [ADR-197](./ADR-197-objects-in-a-scene.md): `object` now supports `parts: true` lists and
  `threeBinder` reads `frameVisible(player.values)`.
- [ADR-198](./ADR-198-authored-cast.md): `.show(...)` also accepts scroll-point windows.
