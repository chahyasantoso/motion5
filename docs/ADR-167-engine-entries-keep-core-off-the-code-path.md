# ADR-167: Engine entries keep core off the code path

**Status:** Accepted, 2026-11-09

## Context

A code scene needs moves, rig, player, a renderer and the tools, and none of core. But `@gerak/react`'s main entry
re-exported core's patch types and hooks, `@gerak/three`'s adapter imported core, and each manifest listed core as a
dependency, so loading the code-scene hooks loaded a module that referenced the engine.

## Decision

- Each package that serves both paths has two entries. The main entry holds the code path and imports neither
  `@gerak/core` nor `@gerak/plugins`; `./engine` holds the rest.
- `@gerak/react`: main has `usePlayer`, `useTarget`, `useValue`, `useWatch`, `centreIn` and `mergeRefs`;
  `@gerak/react/engine` has the patch hooks, `useMotionProject`, `useAnchor`, `Word` and the patch types.
- `@gerak/three`: main has `applyPose2d` and the frame helpers; `@gerak/three/engine` has the patch adapter.
  `@gerak/dom/engine` and `@gerak/tools/engine` already existed.
- A manifest declares `"gerak": { "engine": [paths] }`, the paths inside its `src` that may reach core. The
  boundary scan refuses any other file of that package that imports core or plugins, or imports an engine file.
- Every importer in the repository moved to the entry that holds what it uses.

## Consequences

Importing a main entry of `react`, `dom`, `three` or `tools` loads nothing of the engine, and the scan keeps it so.
Manifests still list core as a dependency, because the `/engine` entries need it; splitting a package in two would
drop that and is not done. ADR-156's freeze holds: only imports and entry points moved.

## Rejected

- Leaving the re-exports and relying on tree shaking: a bundler may not drop them, and nothing would stop a new
  main-entry import of core.
- Separate packages for the engine parts: the same code in more manifests and releases, for no behaviour gained.
