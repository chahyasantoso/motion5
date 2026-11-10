# ADR-170: Core and plugins are retired

**Status:** Accepted, 2026-11-09

## Context

ADR-156 froze `@gerak/core` and `@gerak/plugins`, and ADR-167 put the engine parts of the other packages behind
`/engine` entries. Frozen, the engine was still about 60% of the source and 69% of the tests, cost about 30 s of every
check, imported moves and rig in 36 places so their APIs could not change freely, and kept two ways to make motion.

## Decision

- `@gerak/core` and `@gerak/plugins` are deleted. The engine path goes with them: JSON projects, patches, the plugin
  catalog and the GSAP adapters. This supersedes ADR-156's freeze.
- Every `/engine` entry goes (`dom`, `react`, `three`, `tools`), and with it ADR-167's `"gerak": { "engine" }`
  manifest key and the boundary rule that read it.
- `@gerak/three/skeleton`, the apps `ik-playground` and `pose-gap-filler`, `react-demo`'s engine demos, the engine
  modes of the tools, the benchmarks and CI steps that build or run core, and the engine guide pages go too.
- `moves`, `rig`, `player`, `dom`, `react`, `three`, `tools`, `physics`, `rapier` and every code-scene worked example
  stay. Rig keeps its 3D solvers.
- The archive is the branch `archive/core-plugins`, at `main`'s last commit before the deletion. Anything needed later
  is read from it. There is no tag and no copy inside the repository.
- ADRs stay unedited. A non-ADR doc that an ADR links to stays, with one line at its top saying it was retired with
  core and is kept as history; it leaves every index. A doc that no ADR links to and whose subject is gone is deleted.
- The repository gate tests that lived in core move to `test/repo/` first; a rule that only concerned core is deleted
  with the code it guarded.

## Consequences

The repository is the code path alone. A check runs only what a code scene can reach. What only the engine used in
`moves` and `rig` is trimmed after the deletion, in a separate change, so a deletion and an API change never share a
review. The bones work rebuilds a skinned mesh on the code path, reading the archive.

## Rejected

- Keeping core frozen: it still cost every check and pinned the pure layer's APIs.
- A tag, or a copy under an `archive/` folder: a branch is enough to read from, and a copy would still cost every search.
