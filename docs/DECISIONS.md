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

**Context.** The predecessor allowed Track to own children, group hosts, playback delegation, and graph recursion while Motion also owned scheduling. That produced two composite owners and unclear teardown.

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

**Status:** Accepted, 2026-08-10

**Context.** An automatic formatter that pushes to contributor branches can rewrite history mid-rebase, mix mechanical changes with behavior, and require broad write permission.

**Decision.** CI checks formatting and reports the local fix command. A separately dispatched workflow may create a formatting-only pull request.

**Alternatives rejected.** A push-on-every-PR formatter is convenient but unsafe for branches, forks, and review diffs.

**Consequences.** Contributors normally run Prettier locally. Bulk cleanup remains available without mutating work unexpectedly.

## ADR-008: Gates measure behavior, not prose

**Status:** Accepted, 2026-08-10

**Context.** Comment ratios, source-text greps, and non-shrinking file allowlists can be green while the runtime is wrong, and can block legitimate deletion.

**Decision.** Gates measure executable behavior, API shape, import boundaries, packaging, performance budgets, or mechanical formatting. They do not use comments or file counts as behavioral evidence.

**Consequences.** Review must explain architecture, while tests prove behavior. A banned symbol scan may enforce a boundary, but it cannot replace an integration test.

## ADR-009: No demos in this repository

**Status:** Accepted, 2026-08-10

**Context.** A Vite demo application caused renderer dependencies, routes, fixtures, and visual evidence to shape the package architecture.

**Decision.** motion5 contains libraries, tests, docs, scripts, and deterministic benchmarks. Example applications live elsewhere and consume the package like users do.

**Consequences.** Package-consumer tests and integration fixtures carry the evidence that demos previously carried. Visual examples need a separate repository.

## ADR-010: Perspective, free tracks, and diagnostic severity

**Status:** Superseded by ADR-011, 2026-08-10

**Context.** The initial motion5 draft added optional `perspective`, project-level `freeTracks`, and warning diagnostics while retaining schema v4.

**Decision.** The semantics remain valid, but the version decision is superseded. `perspective` remains optional renderer metadata. Free tracks remain ordinary graph nodes qualified as `~/trackId`. Diagnostics retain `error` and `warning` severity.

**Why superseded.** Renaming a v4 field while claiming v4 compatibility made the contract dishonest.

## ADR-011: Schema v5 and explicit v4 migration

**Status:** Accepted, 2026-08-10

**Context.** Project-level free tracks were previously represented by an ambiguous top-level `tracks` key. Motion-owned tracks use the same key inside each motion. The new contract names project-level tracks `freeTracks`, reserves `/` for qualified ids, and reserves `~` as the free-track namespace.

**Decision.** Require `schemaVersion: 5`, `freeTracks`, and qualified free-track references. Reject v4 at the loader boundary with a migration diagnostic. Migration occurs outside the runtime and is tested as a pure transformation.

**Alternatives rejected.** Accepting both `tracks` and `freeTracks` creates two authored spellings. Guessing whether a bare reference is free or motion-owned recreates ambiguity. Auto-migration inside `loadProject` hides data changes and complicates rollback.

**Consequences.** Existing projects need an explicit migration step. The loader has one dialect and can produce deterministic diagnostics. Migration tooling must validate migration assumptions before moving top-level `tracks`.

## ADR-012: Perspective is metadata, not runtime state

**Status:** Accepted, 2026-08-10

**Decision.** `perspective` is validated and preserved as project metadata for renderer integration. It is not a keyframe, graph node, patch value, or clock-driven state. A missing value alongside 3D content emits a warning; an invalid present value emits an error.

**Consequences.** Renderer adapters apply it once to a stage container. Core remains renderer-neutral and does not import CSS or DOM APIs.

## ADR-013: Free tracks are first-class graph nodes

**Status:** Accepted, 2026-08-10

**Decision.** A free track differs from a motion track only in scheduling ownership. It participates in the same normalization, validation, graph state, publication, diagnostics, and lifecycle paths. It is not a second node type and is never capability-gated.

**Consequences.** Shared upstream values can outlive unrelated motions. A free track authored in the project is project-owned; an adopted runtime track remains owned by its adopter and is detached rather than destroyed when detached.

## ADR-014: Qualified ids stay internal; there is no schema v6 for authorable ids

**Status:** Accepted, 2026-08-10

**Context.** TRD section 18 tracked whether a future schema v6 should make qualified runtime ids directly authorable. Doing so would make normalization output part of the authored contract and would give one track two valid spellings inside its own motion.

**Decision.** Authored identity stays local. A motion track is authored with a local id, cross-motion and free-track references use explicit `motionId/trackId` and `~/trackId` reference syntax, and canonical node identity is produced exactly once by normalization. No schema v6 is planned for the purpose of making qualified node ids authorable.

**Alternatives rejected.** Fully qualified authored ids remove one lookup but leak storage identity into authoring, make motion reuse and project composition harder, and turn any future namespace change into a schema migration. Treating authored ids as already normalized would delete the load-time boundary where reserved characters are rejected.

**Consequences.** Validators must keep rejecting `/` in track ids, `/` in motion ids, and `~` as a motion id. No public API may bypass normalization by accepting a runtime node id as authored identity. Reversing this requires a superseding record plus a new authored schema version, not a loader option.

## ADR-015: GSAP remains the v1 interpolator

**Status:** Accepted, 2026-08-10

**Context.** TRD section 18 tracked whether the first interpolator should remain engine-backed or gain a built-in sampler that would remove the last external runtime dependency from the default setup.

**Decision.** GSAP remains the supported v1 implementation of the `Interpolator` port. It lives behind an adapter, passes the shared port contract suite unchanged, and never appears in `core/contract`, `core/domain`, `core/graph`, or `core/runtime`. No built-in sampler ships in v1.

**Alternatives rejected.** A built-in sampler removes a dependency but starts a second animation-engine project, complete with easing compatibility, keyframe semantics, and numerical parity work, before the graph runtime has proven itself. Importing GSAP directly into Track or the runtime would be faster and would destroy renderer neutrality.

**Consequences.** Core stays testable with fakes and imports no engine. The GSAP adapter and its contract evidence are release requirements. A future sampler may be added as another port implementation, never as a branch inside core.

## ADR-016: Runtime diagnostics stay inline on patches

**Status:** Accepted, 2026-08-10

**Context.** TRD section 18 tracked whether runtime diagnostics should remain inline on patches or gain a separate stream. Consumers need failure context atomically with the values they are about to render.

**Decision.** Runtime diagnostics surface inline on the affected patch and in the batch diagnostics summary, and accumulate in a bounded ring buffer on the project for inspection. No separate diagnostics stream ships in v1.

**Alternatives rejected.** An independent stream centralizes logging but races with publication, forces consumers to correlate two timelines, and duplicates subscription lifecycle. Project-level-only diagnostics lose the node context that makes a diagnostic actionable.

**Consequences.** Patch equality and revision rules must account for meaningful diagnostic changes. One batch is enough to render or log a complete state. The ring buffer is observational and must never become a second publication owner.

## ADR-017: React ships in the v1 package set

**Status:** Accepted, 2026-08-10

**Context.** TRD section 18 tracked whether `@motion5/react` belongs in v1 or becomes a follow-on package. React is a primary consumer boundary, and deferring it would leave patch identity, subscription semantics, strict-mode lifecycle, and packaging assumptions unproven until after the core API froze.

**Decision.** `@motion5/react` is part of v1 and its build, hook lifecycle, and packed-consumer gates are release-blocking. It consumes only the documented public core surface, subscribes with external-store semantics, and never traverses the graph or composes recursively.

**Alternatives rejected.** Shipping React later reduces v1 scope but risks discovering an incompatible publication contract after the public API is frozen. Embedding React in core would remove the packaging question and destroy renderer neutrality.

**Consequences.** Core keeps zero React dependency while React tests become part of the release matrix. Concurrency safety is proven by a two-consumer tearing test rather than assumed.

## ADR-018: Deep freezing is unconditional in v1

**Status:** Accepted, 2026-08-10

**Context.** Published patches cross the core-to-renderer boundary and are consumed by DOM adapters, React external-store hooks, and arbitrary renderers. Making freezing development-only would make the documented immutability contract disappear in production and would allow production-only mutation bugs. Freezing cost is a legitimate performance risk, but it is measurable and can be optimized without weakening the contract.

**Decision.** Published patches, batches, and nested values are deeply frozen in every environment in v1. Freezing happens once at publication, not repeatedly during graph traversal or adapter reads. Structural sharing and already-frozen subtree reuse are preferred optimizations. There is no production opt-out flag.

**Alternatives rejected.** Development-only freezing is faster in production but changes runtime semantics by environment, hides bugs until deployment, and makes React/DOM consumer behavior less trustworthy. A caller-controlled opt-out flag creates a second contract and a larger test matrix. Shallow freezing is insufficient because nested values can still mutate later readers.

**Consequences.** P1-01 and P3-01 own the behavior; P3-07 benchmarks freezing cost on representative graphs and patch shapes. If measured cost is too high, optimize allocation and reuse or change the publication representation in a superseding ADR. Do not weaken the guarantee by silently disabling freezing.
