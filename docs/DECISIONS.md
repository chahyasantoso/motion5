# Architectural decision records

One entry per decision that would otherwise be relitigated. Format: context, decision, consequences. A reversal edits the original entry to say it is reversed and adds a new entry. Contradictory records are never left in the tree.

## ADR-001: New repository, not a refactor

**Status:** Accepted, 2026-08-10

**Context.** The reference project has the right mental model and the wrong ownership. Two implementations of one responsibility, rollout flags keeping dead branches alive, a leaf that owns composites, and a publisher that can mutate topology. These are structural, and unwinding them in place means carrying every reversed decision as history.

**Decision.** Start a new repository. Keep the old one read-only, as a behavioral oracle and a source of fixture intent. Copy no source, no tests, no fixtures, no demos, no history, no status documents.

**Consequences.** Slower to first working demo. Much cheaper to keep ownership unambiguous, because there is never a moment where both the old and the new path exist.

## ADR-002: Authored schema stays at version 4

**Status:** Accepted, 2026-08-10

**Context.** The authored JSON contract is stable and well understood. The runtime is what needs replacing.

**Decision.** Keep `schemaVersion: 4` as the authored input contract. Version the runtime independently. Qualify ids internally rather than changing authored syntax.

**Consequences.** Existing authored projects load. The schema version number no longer tracks the runtime version, which must be documented clearly or it will confuse people. Open question Q1 in [PRD.md](./PRD.md) revisits this before v1.

## ADR-003: No capability or rollout flags in shipped code

**Status:** Accepted, 2026-08-10

**Context.** Flags such as publisher rendering, cross-motion, and free tracks kept two behaviors alive indefinitely, doubled the test matrix, and made green CI meaningless because the default path was the untested one.

**Decision.** No shipped code branches on a capability or rollout flag. A feature merges on, or it does not merge. Incomplete work lives on a branch, not behind a flag on `main`.

**Consequences.** Larger, later merges for risky features. Compensated by vertical slicing and by cheap reverts. Invariant I-14 enforces this.

## ADR-004: Track is a leaf, Motion is the sole composite

**Status:** Accepted, 2026-08-10

**Context.** In the reference, Track owned children, group hosts, playback delegation, and graph recursion, while Motion also owned scheduling. Two composites, unclear teardown order, and recursion that bypassed the graph layer.

**Decision.** Track owns playhead, interpolation, local plugin composition, and local lifecycle. Nothing else. Motion owns hierarchy, scheduling, triggers, playback, and child teardown. Graph traversal belongs to the graph layer alone.

**Consequences.** Some convenience APIs disappear from Track. Callers go through Motion. Invariant I-4 enforces the boundary.

## ADR-005: Publication is one-way

**Status:** Accepted, 2026-08-10

**Context.** A publisher that could also add and remove nodes and edges overlapped with the binding, giving topology two writers.

**Decision.** The publisher accepts a validated snapshot and publishes. It has no mutation methods. The binding is the only topology writer.

**Consequences.** Mutations during a flush are scheduled for the next tick rather than applied inline. Invariant I-3 enforces this.

## ADR-006: Live state is mutated in place, never rebuilt

**Status:** Accepted, 2026-08-10

**Context.** Rebuilding the observation bridge after each commit meant state identity changed under live subscribers, and made an undo journal impossible to define.

**Decision.** One long-lived observation state per project, mutated in place, with an undo journal for rollback. Commit swaps the immutable IR snapshot only.

**Consequences.** Mutation code must be carefully reversible. Invariants I-1 and I-2 enforce the result.

## ADR-007: Formatting is manual and never automatic

**Status:** Accepted, 2026-08-10

**Context.** An auto-fix workflow that pushes to contributor branches rewrites history mid-rebase, mixes mechanical changes into behavior commits, and needs write permission on every run.

**Decision.** CI checks formatting and fails with the fix command. A separate, manually dispatched workflow can apply Prettier and open its own pull request. See [FORMATTING.md](./FORMATTING.md).

**Consequences.** Contributors run `npm run format` themselves. Bulk reformats stay one click away without the everyday risk.

## ADR-008: Gates measure behavior, never prose

**Status:** Accepted, 2026-08-10

**Context.** Readability tests protecting comments and a non-shrinking file allowlist caused planned deletions to fail for reasons unrelated to behavior, and source-text symbol scans were mistaken for proof that a seam was gone.

**Decision.** Every gate measures behavior, API shape, boundaries, packaging, or mechanical formatting. No comment density, no prose ratio, no allowlist that cannot shrink, no source-text scan presented as behavioral evidence.

**Consequences.** Some things previously "enforced" are now enforced by review instead. That is the honest position. See [TESTING-STRATEGY.md](./TESTING-STRATEGY.md).

## ADR-009: No demos in this repository

**Status:** Accepted, 2026-08-10

**Context.** The reference repository was a Vite application that happened to contain two packages. Demo needs leaked into package structure, dependencies, and build configuration.

**Decision.** This repository ships libraries, tests, benchmarks, and docs. Example applications live in a separate repository and consume the published package like any other user.

**Consequences.** Visual evidence needs a home outside this tree. Integration fixtures and the package consumer test carry the load that demo smoke tests used to.
