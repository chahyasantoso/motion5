# ADR-189: Core, modules and library

**Status:** Accepted, 2026-11-16
**Superseded in part by ADR-192:** the library's tools, plugin hooks and search.

## Context

`@gerak/moves` mixes what every piece needs (fields, time, blend, eases, geometry) with choices a project could make
its own (squash, follow-through, named moves, qualities, styles). Every renderer, the stage and the tools import it,
`@gerak/tools` depends on every package, and one 88 KB reference covers all of it. On a 20 s brief a gerak agent cost
187.5k tokens against a plain HTML/JS agent's 110.6k: it read the guide, grepped the reference, opened package source,
and still missed public helpers. Nothing marks which code a project may replace and which it may not.

## Decision

- **Three groups, imports only downward.** Core holds primitives: definitions and maths no project would want its own
  version of, and the mechanisms that attach a look. Modules hold opt-in capabilities that are still pure maths: bones
  (`@gerak/rig`) and bodies (`@gerak/physics`, `@gerak/rapier`). The library holds parts and moves that carry a choice,
  qualities, styles and their commands (`@gerak/moves`). Library may import modules and core; modules import core;
  core imports neither. Squash, smear, follow-through and wander are library; `cubicOut`, a sine wave and `velocity`
  are core.
- **Groups are a field, not folders.** `packages/` stays flat. Each package's manifest declares
  `"gerak": { "group": "core" | "modules" | "library" }`, beside the pure layer the same field already declares, so the
  group ships with the package. The boundary scan refuses a package with no group, and an import of a package in a
  higher group; today's upward imports are `scripts/group-baseline.json`, which may only shrink.
- **`@gerak/core` is new** and takes from `@gerak/moves` its fields, its time helpers and the primitives (blend,
  eases, dynamics, envelopes, oscillation, geometry, paths, utility, and the signal measures `keyframes`, `velocity`,
  `velocity3d`, `speedOf`, `tally`), plus the Euler, matrix and quaternion maths core uses from `@gerak/rig`. Core's
  primitives are documented by their doc comments, read whole, and never registered; `definePart`, the part kinds and
  every part that carries a choice stay in `@gerak/moves`. A core export comes only from core's fixed folders.
- **There is no compose layer.** Composition and time parts are one thing, a time in and a time out, so `compose/`
  joins core's `time` folder. Time helpers have two shapes, held by one exported `Timing` type: a time in and a time
  out, or a `Timing` built once from its settings and read with `.of(time, ...)`; and `sequence`, the one picker. A
  timing that carries a choice is a library part of kind `time`.
- **Private geometry becomes core,** moved, never copied: the SVG path parser, shape outlines, arcs, path transforms,
  resampling, reversal, bounds, area, closure and length.
- **One owner for shared helpers:** `unreachable` and `clamp` from `@gerak/core`, every copy removed; a duplicate scan
  joins `npm run check` with a baseline that may only shrink.
- **The skeleton binding leaves the core renderer:** `@gerak/three/skeleton` becomes its own package,
  `@gerak/rig-three` (modules, not pure, so rig stays pure), and
  `@gerak/tools` drops `rig` and `three`.
- **Commands plug in.** A package declares `"gerak": { "commands", "review" }`; `listCommands()` in `@gerak/tools`
  reads its own list and each installed package's. The library's commands ship in `@gerak/moves-tools` (library, not pure,
  so `@gerak/moves` stays pure); `gerak joints` reads a glTF file without rig and stays a core command.
- **Each package ships its own docs** in `docs/`, generated from doc comments by source folder. `@gerak/core` and
  `@gerak/stage` each ship one read-whole page of at most 20 KB; `gerak init` writes an `AGENTS.md` naming them and one
  line per installed module or library package.

This supersedes in part ADR-185's layers inside `@gerak/moves` (its `compose/` layer above `moves/`, and the kernel
living there) and ADR-187's clause that a brief imports `@gerak/moves`: a brief imports core, and a module or the
library only when installed.

## Consequences

- A project with only the core packages makes, plays and checks a piece; bones, bodies and the move vocabulary arrive
  with their packages, docs and commands.
- A core-only piece writes its own motion where the library would have offered a named move; that trade is chosen.
- Until the split lands, the group baseline lists every package that imports `@gerak/moves` or `@gerak/rig` from a
  lower group; each slice that removes one deletes its line.
- Search over the library, and harvesting a piece's own helpers into declared parts, wait for this split.
