# motion5 architectural decision records

These records capture decisions whose accidental reversal would recreate the predecessor’s problems. They are not implementation instructions pasted into every file. A record contains context, the decision, alternatives considered, consequences, and evidence or follow-up where useful.

## How to use this file

Before introducing a flag, alias, facade, second owner, compatibility path, new public export, authored identity form, diagnostics channel, or interpolation engine, search this file. If the proposal conflicts with an accepted record, either reject it or add a superseding record in the same pull request. Never leave two active records that say opposite things.

## ADR-001: Start a new repository

**Status:** Accepted, 2026-08-10

**Context.** The predecessor has valuable behavior but accumulated migration residue: overlapping observation owners, per-Motion runtime pieces, compatibility APIs, demos coupled to package layout, and tests that protect historical seams. Refactoring in place would keep both the old and new assumptions alive while the ownership model was being changed.

**Decision.** motion5 starts with a clean repository. The predecessor is a read-only behavioral oracle. No source files, tests, fixtures, demos, commit history, or status documents are copied.

**Alternatives rejected.** A fork would be faster for the first feature but would import the very seams this project is meant to remove. A branch inside the old repository would make “new contract” and “old contract” impossible to distinguish.

**Consequences.** Phase 0 is slower. Later changes are easier to reason about because there is no compatibility layer to preserve.

## ADR-002: Authored schema v5 is the contract

**Status:** Accepted, 2026-08-10

**Context.** The project initially considered keeping schema v4 while renaming the top-level free-track field to `freeTracks`. That would make the version claim dishonest: a v4-shaped document would be rejected.

**Decision.** The motion5 authored contract is `schemaVersion: 5`. Schema v4 is not accepted as an alias. Existing v4 documents go through the explicit migration in [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md) before loading.

**Alternatives rejected.** Silent v4 acceptance creates two dialects. Automatic in-runtime migration gives the loader two meanings for the same input and hides migration work from callers.

**Consequences.** Migration is a visible one-time operation. Validators can have one clear input contract and one set of diagnostics.

## ADR-003: No capability or rollout flags

**Status:** Accepted, 2026-08-10

**Context.** Flags such as publisher rendering, cross-motion, and free tracks keep dead and live behavior paths in the same binary. They multiply the test matrix and make default-green CI untrustworthy.

**Decision.** Features merge on, or they do not merge. No shipped code branches on a capability or rollout flag for core behavior.

**Alternatives rejected.** A temporary flag almost always becomes a permanent API because removing it feels riskier after callers depend on it.

**Consequences.** Risk is handled with small vertical pull requests, explicit adapters, and fast reverts rather than hidden runtime modes.

## ADR-004: Track is a leaf; Motion is the sole composite

**Status:** Accepted, 2026-08-10

**Context.** The predecessor allowed Track to own children, group hosts, playback delegation, graph recursion while Motion also owned scheduling. That produced two composite owners and unclear teardown.

**Decision.** Track owns only playhead/progress, interpolation inputs, local plugin composition, renderer-neutral snapshots, and local lifecycle. Motion owns child membership, hierarchy, stagger, layout, scheduling, triggers, playback, and child teardown. Graph traversal belongs to the graph layer.

**Alternatives rejected.** Keeping convenience methods on Track would preserve a second composite API. Having Motion delegate graph composition to Track would bypass the project-wide publisher.

**Consequences.** Callers use Motion for hierarchy and the runtime for graph observation. Track becomes simpler to test and safe to reuse as a leaf.

## ADR-005: Publication is one-way

**Status:** Accepted, 2026-08-10

**Context.** A publisher that can also add/remove nodes or edges overlaps with the topology binding. Two writers cannot guarantee atomic graph changes.

**Decision.** GraphBinding is the only topology mutation coordinator. GraphPublisher accepts a validated snapshot and publishes patches. It has no topology mutation methods.

**Alternatives rejected.** A convenience mutation method on the publisher is still a second owner, even if it forwards to the binding today.

**Consequences.** Changes during a flush are deferred to the next tick. Publication observes committed graph snapshots only.

## ADR-006: Live state is stable and mutated in place

**Status:** Accepted, 2026-08-10

**Context.** Recreating an observation bridge after a graph commit invalidates references held by subscribers and makes rollback ambiguous.

**Decision.** Each project has one long-lived ObservationState. GraphBinding mutates it transactionally with an undo journal. Commit replaces the immutable graph snapshot, not the live state object.

**Alternatives rejected.** Rebuilding from the entire graph after every change is simpler locally but loses identity and makes side effects difficult to undo.

**Consequences.** Mutation code must be explicit and reversible. Invariants I-1 and I-2 are mandatory evidence.

## ADR-007: Formatting is manual

**Status:** Superseded by ADR-019, 2026-08-10

**Context.** Automatic formatting was initially rejected because it can rewrite branches during rebases, contaminate review diffs, and require write permissions on untrusted pull requests.

**Decision.** The original manual-only policy is superseded for same-repository pull requests. The formatter now runs automatically on pull request open, synchronize, and reopen events and commits mechanical changes back to the exact source branch. Fork pull requests remain check-only because their source code is untrusted and their token cannot safely receive branch-write access.

**Consequences.** Same-repository contributors get automatic formatting, while fork contributors retain the safer format-check gate. The workflow must use concurrency cancellation and a mechanical-only commit message. Reverting this policy requires restoring manual-only behavior in the workflow and docs.

## ADR-008: Gates measure behavior, not prose

**Status:** Accepted, 2026-08-10

**Context.** Comment ratios, source-text greps, and non-shrinking file allowlists can be green while the runtime is wrong, and can block legitimate deletion.

**Decision.** Gates measure executable behavior, API shape, import boundaries, packaging, performance budgets, or mechanical formatting. They do not use comments or file counts as behavioral evidence.

**Consequences.** Review must explain architecture, while tests prove behavior. A banned symbol scan may enforce a boundary, but it cannot replace an integration test.

**Amended, 2026-09-03 (issue #267).** A byte budget on a source file belongs to the allowed family above rather than being an exception to it, and the amendment is recorded here because the context above names a non-shrinking file allowlist as one of the things this record refuses. Neither hazard that sentence describes reaches a read budget. It cannot be green while the runtime is wrong, because it makes no claim about the runtime at all, and it cannot block a legitimate deletion, because every deletion moves a file the way the budget wants. What it measures is not a proxy for correctness: it is the toolchain precondition an anchor-based edit already depends on, which puts it beside import boundaries and mechanical formatting rather than beside a comment ratio. The measured evidence is that `packages/core/src/runtime/project-runtime.ts` truncates on a single contents read, so an implementor with no local checkout can edit a method by anchor without ever seeing an invariant written earlier in the same file.

**The warning about allowlists is kept rather than argued with, and answered with a ratchet rather than a date.** A waiver in `scripts/read-budget-scan.mjs` carries the file's exact current size as a ceiling it may not exceed, so the list can only shrink and the slice that splits a file lowers its number in the same commit. A bare path with no ceiling is the gate this record was right to refuse. A removal date was written into the first draft of that waiver and then taken back out, and the reasoning is worth keeping: a date does not shrink a file, it fails the build on a morning nobody picked, and it is satisfied by editing the date, so it reports the calendar rather than the tree. What a date guards against is a waiver that stalls, and this record does not claim the ratchet prevents that. It prevents the file getting worse while it stalls, which is the part a check can honestly see, and the waiver is deleted by the commit that brings the file under budget. A comment ratio stays refused outright and is not what this measures: 43 percent of that file being comment is a symptom, and a percentage adopted as a target is met by deleting whichever comments are easiest rather than whichever are redundant.

## ADR-009: No demos in this repository

**Status:** Accepted, 2026-08-10

**Decision.** motion5 contains libraries, tests, docs, scripts, and deterministic benchmarks. Example applications live elsewhere and consume the package like users do.

## ADR-010: Perspective, free tracks, and diagnostic severity

**Status:** Superseded by ADR-011, 2026-08-10

**Decision.** The semantics remain valid, but the version decision is superseded. `perspective` remains optional renderer metadata. Free tracks remain ordinary graph nodes qualified as `~/trackId`. Diagnostics retain `error` and `warning` severity.

## ADR-011: Schema v5 and explicit v4 migration

**Status:** Accepted, 2026-08-10

**Decision.** Require `schemaVersion: 5`, `freeTracks`, and qualified free-track references. Reject v4 at the loader boundary with a migration diagnostic. Migration occurs outside the runtime and is tested as a pure transformation.

## ADR-012: Perspective is metadata, not runtime state

**Status:** Accepted, 2026-08-10

**Decision.** `perspective` is validated and preserved as project metadata for renderer integration. It is not a keyframe, graph node, patch value, or clock-driven state.

## ADR-013: Free tracks are first-class graph nodes

**Status:** Accepted, 2026-08-10

**Decision.** Free tracks differ only in scheduling ownership. They participate in the same normalization, validation, graph state, publication, diagnostics, and lifecycle paths.

## ADR-014: Qualified ids stay internal; there is no schema v6 for authorable ids

**Status:** Accepted, 2026-08-10

**Decision.** Authored identity stays local. A motion track is authored with a local id, free-track references use explicit `~/trackId`, and canonical node identity is produced exactly once by normalization.

## ADR-015: GSAP remains the v1 interpolator

**Status:** Accepted, 2026-08-10

**Decision.** GSAP remains the supported v1 implementation behind the Interpolator port. Core stays renderer-neutral.

## ADR-016: Runtime diagnostics stay inline on patches

**Status:** Accepted, 2026-08-10

**Decision.** Runtime diagnostics surface inline on patches and batch diagnostics, with bounded project inspection. No separate diagnostics stream ships in v1.

## ADR-017: React ships in the v1 package set

**Status:** Accepted, 2026-08-10

**Decision.** `@motion5/react` consumes only the documented public core surface and remains outside core.

## ADR-018: Deep freezing is unconditional in v1

**Status:** Accepted, 2026-08-10

**Decision.** Published patches, batches, and nested values are deeply frozen in every environment. There is no production opt-out.

## ADR-019: Automatic Prettier write-back for same-repository pull requests

**Status:** Accepted, 2026-08-10

**Decision.** Same-repository pull requests receive automatic mechanical formatting commits; fork pull requests remain check-only.

## ADR-020: Runtime adoption is an internal recovery capability

**Status:** Accepted, 2026-08-15

**Decision.** Runtime adoption is internal to ProjectRuntime and safely compiled by Engine.

## ADR-021: Separate composite Motion signals from leaf node seeking

**Status:** Accepted, 2026-08-15

**Decision.** `seek(nodeId)` positions a leaf; `signal(motionId, signal)` controls a composite Motion.

**Clarified, 2026-08-18.** `seek` is deliberately not gated by `acceptsExternalSignal`. A driver-backed Motion rejects `signal()`, but `seek(nodeId, progress)` still writes node progress directly, and the next driver emission overwrites it. That is intended: `signal()` is Motion-level control and `seek` is leaf-level scrubbing, so merging them would give one responsibility two owners and would remove the only way to scrub a driven node. Gating `seek` behind the driver capability would need a new record here rather than an implementation change. Pinned in executable form by case `T-12` in `packages/core/test/integration/motion-trigger-types.test.ts`. See ADR-033.

## ADR-022: Export TriggerSignal from core package entry

**Status:** Accepted, 2026-08-15

**Decision.** Export TriggerSignal from the core entrypoint.

## ADR-023: Motion owns stagger playhead delay calculations

**Status:** Accepted, 2026-08-15

**Decision.** Motion computes per-track staggered progress; Track remains a passive leaf.

## ADR-024: GraphRuntime reentrancy uses queued deferred drains

**Status:** Accepted, 2026-08-15

**Decision.** Retain queued deferred drains for reentrant flushes.

## ADR-025: Editor mutation uses one removable track store

**Status:** Accepted, 2026-08-17

**Context.** The editor must add, edit, and remove both initially authored tracks and runtime-created tracks. Keeping a permanent schema baseline beside a removable runtime overlay makes deletion semantics conditional and forces every edit to understand two owners.

**Decision.** After `Engine.load` validation, authored motion and free tracks are ingested into the same ProjectRuntime track store used by runtime additions. Ingestion preserves validated object identity and does not auto-mount nodes. This intentionally removes the old guarantee that schema-declared tracks are structurally permanent; editor deletion is now the uniform behavior.

**Alternatives rejected.** Keeping the two-tier store preserves permanence but makes the primary editor use case impossible without special-case APIs. Auto-mounting changes existing load semantics and is rejected.

**Consequences.** `snapshot`/export must be based on the live store in a follow-up or public runtime snapshot API. Fixed-schema consumers must treat loaded tracks as removable through the new capability surface.

## ADR-026: Track mutation uses capability handles and non-destructive replacement

**Status:** Accepted, 2026-08-17. Superseded in part by [ADR-056](./ADR-056-uniform-stale-track-handle.md), 2026-08-29.

**Context.** Caller-invented owner objects can be reused with the wrong id, and destroy/recreate emits terminal `destroyed` patches that React consumers interpret as permanent removal.

**Decision.** `TrackHandle` owns a private monotonic token. A stale handle cannot affect a later node that reuses the same id. `replace` preserves node identity and uses a normal ready patch path; renaming remains remove plus add.

**Superseded in part by [ADR-056](./ADR-056-uniform-stale-track-handle.md), 2026-08-29.** This record originally read “`remove` and `replace` are idempotent for stale handles and cannot affect a later node that reuses the same id.” The idempotence is withdrawn; the token and the ABA guarantee beside it are unchanged and are the half of this record ADR-056 builds on. A stale handle now refuses uniformly, from every member it has, with `StaleTrackHandleError`, and `readonly live: boolean` is the non-throwing probe that replaces the idempotence for a caller whose second call is expected rather than mistaken. Reverting the refusal would restore one condition with two public failure contracts, which is the defect ADR-056 exists to delete.

**Consequences.** Handles are the only capability for track mutation. Observation edges remain fields on the observer track and are edited through replacement helpers.

## ADR-027: Graph validation remains deletion enforcement

**Status:** Accepted, 2026-08-17

**Decision.** `dependantsOf` is a read-only query over committed GraphIR for editor preflight. It never replaces candidate graph validation, which remains the sole enforcement for rejecting source deletion with live dependants. No cascade deletion.

## ADR-051: Derived Solver Membership and Pre-Composition State Delivery

**Status:** Accepted, 2026-08-27

**Context.** Inverse Kinematics (IK) requires end-effector joint angles calculated from member bone lengths and world targets without circular requirement edges or multi-pass execution.

**Decision.** Graph finalization runs `resolveSolvers` to derive solver members root-most first (`GraphNode.solves`). Solvers bind `root` and `target`; member bones bind `base` and `solver`. Member timeline states are gathered pre-composition via `memberNode.interpolated()`, and `fkPlugin` uses `inputs.solver.rotations[nodeId]` as local rotation override. Solver results are memoized on deep value equality, and member invalidations trigger seed propagation to solvers.

**Convariants.** `J-5` 1:1 edge binding preserved, single-pass pure composition preserved (`TR-R-03`/`TR-R-04`), deterministic ordering maintained. Load-time diagnostics enforce the structural constraints (`ik-solver-*`).

**Clarified, 2026-08-28 (slice D3, issue #195).** The solve dispatches on derived shape, and that is a mode, so it is recorded here rather than left in a plugin comment. `solveChain` sends two members and one goal to the analytic `solveTwoBone` and everything else to the iterative `solveFabrik`. The two are deliberately not one code path: `IK-1` and `IK-3` pin exact rotations an iterative solve reaches only within a tolerance, and `flip` at arity two selects an exact branch rather than a basin, so a single solver would move published values for every rig that already solves. The DRY guarantee is therefore an equivalence assertion, `FB-2`, and `FB-9` pins the analytic path as byte-identical with the dispatcher in front of it. Reversing this by deleting `solveTwoBone` recreates that regression.

With the cap gone, `ik-solver-unsupported-arity` is deleted rather than widened, because a rule that refuses a shape the code solves is worse than no rule. The guarantee it was making silently, that a chain has exactly one leaf for the bare `target` slot to address, is `ik-target-not-single-leaf`.

**Convergence metadata is not published, and that is a decision rather than an omission.** `solveFabrik` returns `residual` and `stalled` beside `converged`, because an unreachable goal and a merely slow chain both end without converging and reporting them as one thing tells a caller to raise a cap that is not the problem. `solveChain` drops them, for three reasons that hold together: the analytic path carries neither, so publishing them would make a solver's patch shape a function of its arity and break `FB-9`'s byte identity; roughly four percent of ordinary reachable chains do not reach tolerance before the cap, so a per-tick diagnostic would fire on rigs nobody would call broken; and a bare scalar such as `converged` is exactly the shape `renderableValues` does not shield, so it would fall through `defaultWriter` to `target[key] = value` and be assigned to the stage element every frame. `FB-13` pins the published key set. If a consumer ever needs the record, it goes inside a plain record beside `rotations` and never as a scalar, and that needs an amendment here rather than a patch to the plugin.

**Extended by [ADR-052](./ADR-052-goal-addressing-by-member-id.md), 2026-08-28.** This record owns how a solver finds its bones. How a solver is told what to reach for is ADR-052: the goal-addressing grammar keyed by member id, the split across the contract layer, the plugin registry and graph construction, the rules that police it, and the withdrawal of the FABRIK benchmark claim. The two clarifications above are the dispatch half of that work and stay here, because dispatch is a property of this record's solve.
