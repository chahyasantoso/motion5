# ADR-152: `@motion5/rig` owns solvers and their vocabulary

**Status:** Accepted, 2026-11-08

**Supersedes in part:** [ADR-133](./ADR-133-plugin-api-is-the-plugin-package-contract.md). `plugin-api` stops
exposing solver vocabulary.

## Context

ADR-133 kept solver vocabulary in core because "graph code also reads the protocol". Nothing in core imports
`contract/solver-constraints.ts` except the re-export in `plugin-api.ts`. The solvers, `solveChain`,
`solveChain3d` and `composeWorld`, are already pure, but live in `@motion5/plugins` behind the plugin contract.

## Decision

`@motion5/rig` owns world frames, FK composition, the 2D and 3D IK solvers, FABRIK, the body topology parse, and
the joint and constraint vocabulary. It has no dependencies. Code builds a chain once with `buildChain(bones)`
and calls `fk` and `ik` on it each frame; the `Body` models parse through the same topology owner. FK composition
has one owner, `composeChain`, and a solve member one builder, `solveMember`, which the plugins and `rope` call too. Tests
reach solver internals through `@motion5/rig/internal`; the package root carries only what callers use.

## Consequences

Files move without logic changes. The IK envelope and stability suites pass unchanged. A test pins that the
rig's import closure has no workspace imports.

## Rejected

- Keeping the vocabulary in core: it has no reader there.
- Copying the solvers into `@motion5/moves`: rigs are a separate vocabulary that most moves never read.
