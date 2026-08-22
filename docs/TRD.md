# motion5 technical requirements document

**Status:** Normative. This document says what the system must do to be correct. It does not say when the work happens; sequencing lives in [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md), and what actually exists today lives in [SESSION-STATUS.md](./SESSION-STATUS.md).
**Authored contract:** schema v5.
**Relationship to other documents:** [PRD.md](./PRD.md) states the product intent and functional requirements. [ARCHITECTURE.md](./ARCHITECTURE.md) states ownership and invariants. This document turns both into testable technical requirements. [DECISIONS.md](./DECISIONS.md) records why alternatives were rejected.

## 1. Purpose, scope, and audience

This document is the acceptance contract for implementers and reviewers. A pull request is judged against the requirements it claims to satisfy, and a requirement is satisfied only when its verification method is executable and green.

**In scope:** the `@motion5/core` runtime, its ports and adapters, the `@motion5/react` bindings, packaging, performance budgets, and the evidence model.

**Out of scope:** example applications, visual editors, physics or inverse-kinematics solvers, server-side ticking, and runtime compatibility with the predecessor's APIs. See PRD section 5 and ADR-009.

**Requirement language.** "Must" is binding. "Must not" is prohibitive. "Should" marks a strong default that requires a written justification to break. Nothing here is aspirational; if a requirement cannot be verified, it is deleted rather than softened.

**Requirement identifiers.** `TR-A` architecture and boundaries, `TR-D` authored data contract, `TR-G` graph kernel, `TR-R` runtime and publication, `TR-M` domain model, `TR-P` ports and adapters, `TR-L` lifecycle and memory, `TR-E` diagnostics and errors, `TR-S` public surface and packaging, `TR-PF` performance, `TR-SC` supply chain, `TR-T` testability and CI.

## 2. Glossary

- **Project:** one authored schema v5 document plus the runtime state loaded from it.
- **Motion:** the only composite. Owns children, scheduling, triggers, playback, stagger, and child teardown.
- **Track:** a leaf. Owns playhead, interpolation inputs, local plugin composition, and renderer-neutral snapshots.
- **Free track:** a project-level track that nothing schedules, qualified `~/trackId`.
- **Qualified id:** the runtime identity of a node, either `motionId/trackId` or `~/trackId`.
- **Observation edge:** a dependency from an observing track to a source. An output edge is authored with `observes`. An input edge is derived from a plugin requirement binding and is never authored as an edge.
- **IR:** the immutable graph intermediate representation produced by normalization.
- **Live state:** the long-lived `ObservationState` object holding live edges and observers.
- **Commit:** replacing the immutable IR snapshot after a successful transaction.
- **Flush:** one traversal producing one batch of patches for one tick.
- **Patch:** the frozen published value set for one node at one revision.
- **Batch:** all patches produced by one flush, plus tick number, seed set, and diagnostics summary.
- **Closure:** the set of nodes reachable downstream from a seed in canonical order.

## 3. System context and constraints

- **TR-C-01 Runtime target.** The core must run on Node 24 and in evergreen browsers, as ESM only. No CommonJS entrypoint is published.
- **TR-C-02 Language.** TypeScript is required for public contracts and runtime boundaries. A package uses one language. There must be no declaration-file seam layered over untyped JavaScript.
- **TR-C-03 Dependencies.** `@motion5/core` must have zero runtime dependencies. Animation engines, DOM helpers, and React are permitted only in adapter modules and in `@motion5/react`.
- **TR-C-04 Determinism of environment.** Core behavior must not depend on wall-clock time, `Math.random`, locale, time zone, or unordered collection iteration.
- **TR-C-05 Repository shape.** The repository contains libraries, tests, docs, scripts, and deterministic benchmarks only. Example applications live elsewhere and consume the published package. See ADR-009.

## 4. Architecture and boundary requirements

- **TR-A-01 Single ownership.** For each loaded project there must be exactly one observation graph, one live observation state, one topology mutation coordinator, one publisher, one patch registry, and one upstream clock subscription. A change that makes any of these ambiguous is rejected regardless of test results.
- **TR-A-02 Inward dependencies.** Dependencies point inward only. Contract depends on nothing. Domain depends on contract. Graph depends on contract and domain. Runtime depends on graph. Ports are depended upon and depend on nothing. Only the composition root depends on adapters.
- **TR-A-03 Renderer neutrality.** No module under `core/contract`, `core/domain`, `core/graph`, or `core/runtime` may import an animation engine, a DOM API, or React. Verified by the boundary job and by a headless integration test. Implements I-11.
- **TR-A-04 No flags.** No shipped code may branch on a capability or rollout flag for core behavior. Free tracks and cross-motion references travel the same path as any authored node. Implements I-14 and ADR-003.
- **TR-A-05 Renderer-owned metadata.** `perspective` must be validated and preserved as project metadata, must not appear in any patch, and must be applied to a stage container by a renderer adapter only. Implements FR-4 and ADR-012.
- **TR-A-06 React consumes, never composes.** `@motion5/react` must import only the documented public core surface. No hook may traverse the graph, call a track composition method, or hold a runtime internal.
- **TR-A-07 Consumer immutability.** Any value crossing the subscriber boundary must be frozen before it is handed out, including through framework bindings.
- **TR-A-08 No second implementation.** There must be no legacy facade, observation alias, ownership mode, resolver, parity mode, or bridge object that recreates live state after a commit. Reintroducing any of these requires a superseding record in DECISIONS.md.

## 5. Authored data contract requirements

- **TR-D-01 Version gate.** The runtime boundary must accept `schemaVersion: 5` only. v4 must be rejected with a migration diagnostic and must never be silently accepted or auto-migrated. Implements FR-1 and ADR-011.
- **TR-D-02 Structural validation.** Loading must validate ids, triggers, tracks, perspective, observation edges, duplicates, and cycles before anything mounts. Implements FR-2.
- **TR-D-03 Reserved namespace.** Track ids must not contain `/`. Motion ids must not contain `/` and must not equal `~`. Violations are errors.
- **TR-D-04 Perspective.** `perspective` is optional. When present it must be a finite number greater than zero; anything else is an error. Missing perspective alongside detected 3D content is a warning.
- **TR-D-05 Edge semantics.** An edge is identified by `(observer, source, role, requirement)`, where an absent requirement is a distinct value from any present one. `observes` declares output edges only and carries no authored `role`, `target`, or `projection`; an authored one is an error. An output edge merges the source's finished patch over the observer's composed patch after local composition. An input edge is never authored directly: the graph derives exactly one per `keyframes..requires.` binding, and its value is delivered to the named plugin scoped by slot, never merged into the observer's authored values. Two slots of one plugin may bind the same source and are two edges.
- **TR-D-06 Rejected input.** Wrong version, malformed or duplicate ids, reserved characters, invalid trigger, invalid perspective, malformed edges, unknown sources, duplicate edges, self-reference, and cycles must all be errors. Missing perspective for 3D content and unused free tracks must be warnings.
- **TR-D-07 Pure migration.** The v4-to-v5 migration must be a pure function outside the runtime. It must not mutate its input and must return the input unchanged for a non-v4 document. Implements FR-5.
- **TR-D-08 Migration idempotence.** Applying migration to an already-migrated document must produce a structurally equal document.
- **TR-D-09 Ambiguity refusal.** A document carrying both top-level `tracks` and `freeTracks` must fail migration rather than resolve the conflict by preference.
- **TR-D-10 Deterministic serialization.** The golden serializer must sort object keys lexicographically, preserve array order, emit JSON-safe values only, and end output with exactly one newline. Serializing the same logical document twice must be byte-identical regardless of key insertion order.
- **TR-D-11 Authored identity stays local.** Authored track ids are local to their owner, and cross-boundary references use `motionId/trackId` or `~/trackId` reference syntax only. No authored document may define a node whose id is already a qualified runtime id, and no public API may accept a qualified id as authored identity. Implements FR-3 and ADR-014.

## 6. Graph kernel requirements

- **TR-G-01 Qualify once.** Identity qualification happens exactly once, at load. No component downstream of load may observe an unqualified id. Implements FR-3 and ADR-014.
- **TR-G-02 Total id functions.** Qualification and parsing must be pure, total, and lossless round-trips. Implements FR-3 and ADR-014.
- **TR-G-03 Immutable IR.** The graph IR must be frozen and must carry nodes, edges, diagnostics, and canonical order. Implements FR-6.
- **TR-G-04 One node model.** Free tracks and motion tracks must produce the same node shape and must share normalization, validation, state, publication, diagnostics, and lifecycle paths. Implements FR-9 and ADR-013.
- **TR-G-05 Stable diagnostics.** Validation diagnostics must be sorted deterministically by rule id then path, so identical input yields byte-identical diagnostic output. Implements FR-20 and I-15.
- **TR-G-06 Canonical order.** Order must be a pure function of qualified ids and authored order, with a deterministic tie-break. It must never depend on `Map` insertion order derived from runtime events. Implements I-12 and FR-6.
- **TR-G-07 Cycle reporting.** A cycle must be an error before mount, and its diagnostic must name the participating qualified ids as a minimal cycle path. Traversal must be iterative so that graph depth cannot overflow the stack. Implements FR-20 and I-15.
- **TR-G-08 Live state identity.** Exactly one `ObservationState` exists per loaded project and its identity is stable across every successful and failed mutation. It must be mutated in place and must expose no rebuild-from-snapshot method. Implements FR-8, I-1, and ADR-006.
- **TR-G-09 Single mutation coordinator.** Every add, remove, and replace of a node or edge must go through `GraphBinding`. Implements FR-7 and ADR-005.
- **TR-G-10 Transaction order.** A mutation must follow the build, validate, journal, schedule, commit, invalidate, release sequence.
- **TR-G-11 Atomic failure.** Any failure before commit must replay the undo journal in reverse and rethrow the original error with candidate diagnostics attached. Implements FR-7, I-2, and ADR-005.
- **TR-G-12 Commit semantics.** Commit swaps the immutable IR snapshot. It must not recreate live state and must not recreate subscriptions. Implements FR-8, I-1, and ADR-006.
- **TR-G-13 Total reference resolution.** A reference must resolve to a member or be recorded as a pending reference with a diagnostic. There is no third state, and a pending reference must never publish. Resolution must not depend on mount order. Implements FR-19 and I-14.

## 7. Runtime and publication requirements

- **TR-R-01 One tick, one batch.** A clock tick or an explicit flush opens exactly one batch. Implements FR-11.
- **TR-R-02 Seeded closure traversal.** Dirty seeds come from playhead invalidation and from mutations since the last flush. Traversal walks canonical order restricted to the downstream closure of those seeds. Implements FR-11 and I-5.
- **TR-R-03 Compose at most once.** Each dirty node composes at most once per flush, memoized per batch, so a diamond composes its shared ancestor exactly once. Implements FR-11 and I-5.
- **TR-R-04 One-way publication.** The publisher must expose no method that changes topology. Mutations requested during a flush are deferred to the next tick and must not be applied mid-pass. A flush triggered during a flush must return immediately rather than queue. Implements I-3 and ADR-005.
- **TR-R-05 Patch shape.** A patch must carry `nodeId`, `revision`, `values`, `sourceProgress`, `sourceRevisions`, `status` of `ready`, `blocked`, or `error`, and `diagnostics`, empty when `ready`. A batch must carry its patches, tick number, seed set, and diagnostics summary.
- **TR-R-06 Deep immutability.** Published patches and their nested values must be deeply frozen. Mutating a received patch must throw in strict mode and must never affect a later reader. Implements I-7 and FR-14.
- **TR-R-07 Monotonic revisions.** Revisions must be monotonic per node and must advance only when a published value actually changes.
- **TR-R-08 Deduplication.** Unchanged values, progress, source revisions, status, and inline diagnostics must produce no new revision and no subscriber notification. Implements FR-13.
- **TR-R-09 Batch-close notification.** Subscribers must be notified only at batch close, node subscribers before batch subscribers. No subscriber may observe a partial flush. Implements I-6.
- **TR-R-10 Failure containment.** A composition failure must publish `error` for the failing node and `blocked` for its entire downstream closure, while unrelated branches continue. Aggregated failures within one flush are reported as one aggregate error after the pass completes, never by aborting it. Retry metadata is retained only for nodes whose publication failed. Implements FR-12 and I-9.
- **TR-R-11 Project-wide runtime.** `GraphRuntime` is project-wide, never Motion-wide, and owns one binding, one live state, one publisher, one registry, and one clock subscription. Implements FR-10.
- **TR-R-12 Monotonic ticks.** Exactly one upstream clock subscription exists per project regardless of how many motions are mounted, and tick numbers must never move backwards across detach and reattach cycles. Implements I-13.
- **TR-R-13 Recovery.** When an upstream node unmounts, its downstream closure must publish `blocked` rather than retain stale values. When it remounts, the pending reference resolves and downstream nodes republish at a fresh revision.
- **TR-R-14 Single mount path.** `ProjectRuntime` is the only mount path and owns project lifetime, the normalized project, membership, the instance registry, diagnostics, and exactly one `GraphRuntime`.
- **TR-R-15 Composition root.** `Engine` constructs the runtime, wires adapters to ports, asserts each injected port, and performs no graph work itself. Implements FR-18.

## 8. Domain model requirements

- **TR-M-01 Motion is the sole composite.** Motion owns child membership and hierarchy, stagger, layout, reflow, timeline construction, playback, trigger delegates, and child teardown. Implements FR-15 and ADR-004.
- **TR-M-02 Deterministic stagger.** Stagger offsets must be a pure function of authored order and configuration, independent of mount timing. Implements FR-15 and ADR-023.
- **TR-M-03 Track is a leaf.** Track owns playhead and progress state, interpolation inputs, resolved local plugin composition, local lifecycle, and renderer-neutral snapshots. It must have no children, no parent, no group host, and no composite playback. Implements FR-16 and ADR-004.
- **TR-M-04 No traversal from Track.** No Track method may read or walk graph dependencies. Implements FR-16 and I-4.
- **TR-M-05 Plugin resolution.** Plugin registration must be explicit; duplicate registration of one name is an error rather than a silent overwrite; resolution happens once at track construction and yields a frozen ordered composition list; an unknown plugin is a load-time error diagnostic. Implements FR-16 and ADR-043.
- **TR-M-06 Triggers.** Trigger types are `scroll`, `time`, and `manual`. A trigger is a delegate owned by Motion that converts an external signal into a playback command. No trigger in core may read the DOM. Implements FR-15 and ADR-033.
- **TR-M-07 Progress domain.** Progress must be clamped to `[0, 1]` and non-finite progress input must be rejected. Implements FR-16 and ADR-037.

## 9. Port and adapter requirements

- **TR-P-01 Capabilities, not implementations.** The core accepts `Clock`, `Interpolator`, and `Scheduler` as injected ports and must never construct a concrete implementation itself. Implements FR-17.
- **TR-P-02 Clock contract.** A clock exposes `subscribe(listener)` returning an unsubscribe function and emits frozen ticks carrying `tick`, `time`, and `delta`. Implements FR-17.
- **TR-P-03 Interpolator contract.** An interpolator exposes `create(config)` returning a timeline with `duration`, a progress getter and setter, and an idempotent `kill()`. Implements FR-17.
- **TR-P-04 Scheduler contract.** A scheduler exposes `schedule(job, options)` returning a cancel handle. Cancelling twice is safe and cancelling a completed job is a no-op. Implements FR-17.
- **TR-P-05 Fakes are first class.** Every port ships a fake, and the fake is the implementation the core test suite uses. Implements FR-17.
- **TR-P-06 Shared contract suite.** Every port ships one contract suite that both its fake and every real adapter must pass unchanged. A port with no passing real adapter is an unproven interface. Implements FR-17.
- **TR-P-07 Adapter neutrality.** An adapter may depend on its external engine and on the port it implements, and on nothing else in the repository. No adapter may subscribe to its own ticker; the project owns the clock. Implements FR-18.
- **TR-P-08 Renderer application.** Renderer adapters consume frozen patches and must not mutate them. The DOM adapter is the only component that applies `perspective`, and it applies it once to a stage container. Implements FR-4 and ADR-012.
- **TR-P-09 GSAP is the v1 interpolator.** The supported v1 `Interpolator` implementation is GSAP behind an adapter. It must pass the TR-P-06 contract suite unchanged, must be replaceable through the port, and must not be imported, detected, or branched on by any core layer. No built-in sampler ships in v1. Implements FR-23 and ADR-015.

## 10. Lifecycle and memory requirements

- **TR-L-01 Idempotent teardown.** `dispose` and `destroy` must be idempotent and safe to call during the teardown of an owner. Implements I-10.
- **TR-L-02 Guard-before-notify.** The disposed guard flag must be set before any notification, never after.
- **TR-L-03 Owner-first order.** An owner removes graph membership, subscriptions, and edges before the contained object releases local resources. Implements I-10.
- **TR-L-04 Fixed ownership.** Ownership is decided at construction or adoption and must never change during teardown. A borrowed runtime is detached by its borrower and destroyed only by its owner. Implements FR-19, ADR-013, and ADR-020.
- **TR-L-05 Project-owned free tracks.** A free track authored in `freeTracks` is owned by the project and released with it. Implements FR-19 and ADR-013.
- **TR-L-06 Flat retention.** Repeated load, mount, unmount, and dispose cycles must release subscriptions, timelines, graph membership, and cached patches, leaving retention flat across cycles. Implements FR-22.
- **TR-L-07 Adoption.** A free track adopted at runtime remains owned by its adopter; the project detaches rather than destroys it. Adopting a duplicate qualified id is an error, not a replacement. Implements ADR-020 and ADR-013.
- **TR-L-08 Churn safety.** Repeated unmount and remount cycles must leave no residual subscription and must produce correct blocked-then-ready transitions. Implements FR-19 and I-14.

## 11. Diagnostics and error requirements

- **TR-E-01 One diagnostic shape.** Every diagnostic, at load or at runtime, must carry `ruleId`, `path`, `message`, `severity`, and optional `ids`. No second shape may exist. Implements FR-20.
- **TR-E-02 Severity semantics.** At load, any `error` rejects the project and no `warning` does. Warnings are collected and readable after load. No flag may promote a warning to an error. Implements I-15 and ADR-010.
- **TR-E-03 Candidate isolation.** A candidate project that produces an error must never replace an active project. Implements FR-7 and I-2.
- **TR-E-04 Aggregate reporting.** Multiple runtime failures within one flush are reported as one aggregate error after the pass completes. Implements FR-12.
- **TR-E-05 Retry metadata.** Retry information is retained only for nodes whose publication failed and must be cleared on recovery. Retry scheduling keys off monotonic tick numbers. Implements FR-12 and I-9.
- **TR-E-06 Bounded accumulation.** Runtime diagnostics accumulate in a bounded ring buffer on the project. The buffer must drop oldest entries and report how many entries were dropped. Implements FR-24 and ADR-016.
- **TR-E-07 Patch-level surfacing.** A runtime diagnostic that affects a node must also surface on that node's patch. Implements FR-24 and ADR-016.
- **TR-E-08 Diagnosability.** Every diagnostic must be actionable: it names the rule, the path, and the involved ids where applicable, and never reports only a generic failure message. Implements FR-20.
- **TR-E-09 Inline delivery only.** Runtime diagnostics must be delivered inline on the affected patch and in the batch diagnostics summary. There must be no separate diagnostics stream, event emitter, or parallel subscription in v1. Implements FR-24 and ADR-016.

## 12. Public surface and packaging requirements

- **TR-S-01 Allow-listed exports.** The public entrypoint is an allow list. `GraphRuntime`, `ProjectRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, and normalization helpers must never be exported from it. Implements FR-21.
- **TR-S-02 Documented surface.** Exported from `@motion5/core`: `Engine`, project loading, `Motion`, `Track`, plugin registration, triggers, patch subscription, the manual clock, port assertion helpers, and the authored contract constants. Implements FR-21.
- **TR-S-03 Unadvertised internals.** Internals are reachable only through `@motion5/core/internal`, which is not advertised and carries no stability promise. Deep wildcard imports must be blocked by the export map. Implements FR-21 and ADR-014.
- **TR-S-04 Mechanical enforcement.** Adding a public export without updating the committed API report must fail CI. Implements FR-21 and ADR-008.
- **TR-S-05 Packed verification.** The documented public API must work from a packed tarball installed into a clean consumer, in both ESM and TypeScript, not only from source. Implements FR-22.
- **TR-S-06 Export map regression.** A consumer fixture must fail when the export map regresses or when a blocked deep import starts resolving. Implements FR-22.
- **TR-S-07 React ships in v1.** `@motion5/react` is part of the v1 package set. It must build, pass hook lifecycle and concurrency tests, import only the public core surface, start no clock on import or during server rendering, and pass its own packed-consumer test. A failure in any of those gates blocks the v1 release. Implements FR-25 and ADR-017.

## 13. Performance requirements

- **TR-PF-01 Committed budgets.** Budgets must cover graph traversal, dirty propagation, publication throughput, and memory retention, and must be versioned in `performance/budgets.json`. Implements FR-22.
- **TR-PF-02 Deterministic benchmarks.** Benchmarks must use fixed synthetic graphs, fixed seeds, and the manual clock. They must not depend on wall-clock timing for correctness. Implements FR-22, TR-T-02, and TR-T-03.
- **TR-PF-03 Complexity ceilings.** A flush must be linear in the size of the dirty closure, not in the size of the graph. Canonical ordering must be recomputed on commit only, never per flush. Implements FR-22.
- **TR-PF-04 Memory.** Repeated load, mount, unmount, and dispose cycles must show no monotonic growth in retained subscriptions, timelines, or cached patches. Implements FR-22.
- **TR-PF-05 Advisory has an expiry.** A benchmark that is advisory must record a removal date in session status. "Continue on error forever" is not a policy. Implements FR-22 and TR-T-07.
- **TR-PF-06 Promotion or deletion.** By the hardening phase every budget is required or its benchmark is deleted. No advisory job survives past its recorded expiry. Implements FR-22 and TR-T-07.

## 14. Supply chain and toolchain requirements

- **TR-SC-01 Reproducible install.** CI must install from a committed lockfile with `npm ci`, never an unconstrained install. Implements FR-22 and ADR-011.
- **TR-SC-02 Pinned toolchain.** Node 24 is pinned in `engines` and in CI. Formatter and TypeScript versions are pinned exactly. Implements FR-22 and TR-C-01.
- **TR-SC-03 Least privilege.** CI runs with read-only repository permissions and must never rewrite contributor branches. Formatting is checked automatically and fixed only through a manually dispatched workflow. Implements ADR-007 and ADR-019.
- **TR-SC-04 Concurrency.** CI cancels superseded runs per branch or pull request, and the same required matrix applies to pull requests and to protected branch pushes. Implements ADR-019 and ADR-005.

## 15. Testability and CI requirements

- **TR-T-01 Headless core.** The core test suite must run with fake ports and must import no animation engine, DOM API, or React. Implements FR-17 and I-11.
- **TR-T-02 Named invariant evidence.** Every architecture invariant must have a named executable test whose id matches the invariant id, and that test must fail when the invariant is broken. Implements ADR-008 and I-1 through I-15.
- **TR-T-03 Determinism.** Tests must use the manual clock and must not read wall time, random values, animation frames, or unordered collection iteration. Implements ADR-008 and I-12.
- **TR-T-04 Fresh evidence.** No test, helper, fixture, or snapshot may be copied from the predecessor repository. Behavioral intent may be independently recreated against the motion5 contract. Implements ADR-001.
- **TR-T-05 Honest gates.** Gates must measure executable behavior, API shape, import boundaries, packaging, performance budgets, or mechanical formatting. Comment ratios, prose gates, non-shrinking file allowlists, and source-text scans presented as behavioral evidence are prohibited. A mechanical scan may enforce a boundary but never replaces an integration test. Every mechanical gate must have a planted-violation fixture proving it can fail. Implements ADR-008.
- **TR-T-06 Local reproducibility.** Every CI step must map to an npm script that reproduces it locally. If it cannot, the script is added before the job.
- **TR-T-07 Documentation truth.** No document may claim a live gate or an implemented behavior that does not exist. Reality is reported in one status file only. Implements ADR-008.
- **TR-T-08 Deletion discipline.** Code that exists only for a transition, and any document describing deleted code, must be removed in the same change that removes its reason to exist. Implements ADR-008 and ADR-003.
- **TR-T-09 Failure hygiene.** A flaky test is fixed or deleted in the same working session. Skipping a test to reach green is treated as a revert. Implements ADR-008 and ADR-003.
- **TR-T-10 Coverage is not a gate.** Coverage is reported but never the release gate. The release gate is the invariant matrix, the package consumer test, migration suite, contract suites, integration behavior, and deterministic benchmarks. Implements ADR-008.

## 16. Traceability

### Product requirements to technical requirements

- FR-1: TR-D-01.
- FR-2: TR-D-02, TR-D-06.
- FR-3: TR-G-01, TR-G-02, TR-D-11.
- FR-4: TR-A-05, TR-D-04.
- FR-5: TR-D-07, TR-D-08, TR-D-09.
- FR-6: TR-G-03.
- FR-7: TR-G-09, TR-G-10.
- FR-8: TR-G-08.
- FR-9: TR-G-04.
- FR-10: TR-R-11, TR-R-14.
- FR-11: TR-R-01, TR-R-03.
- FR-12: TR-R-10.
- FR-13: TR-R-07, TR-R-08.
- FR-14: TR-R-06, TR-R-09.
- FR-15: TR-M-01, TR-M-02.
- FR-16: TR-M-03, TR-M-04, TR-M-07.
- FR-17: TR-P-01 through TR-P-06.
- FR-18: TR-P-07, TR-P-08, TR-A-06.
- FR-19: TR-G-13, TR-A-04.
- FR-20: TR-E-01, TR-E-08, TR-G-05.
- FR-21: TR-S-01, TR-S-02, TR-S-03.
- FR-22: TR-S-05, TR-PF-01.
- FR-23: TR-P-09.
- FR-24: TR-E-09, TR-E-06, TR-E-07.
- FR-25: TR-S-07, TR-A-06, TR-A-07.

### Architecture invariants to technical requirements

- I-1: TR-G-08.
- I-2: TR-G-11.
- I-3: TR-R-04.
- I-4: TR-M-04.
- I-5: TR-R-03.
- I-6: TR-R-09.
- I-7: TR-R-06, TR-A-07.
- I-8: TR-R-07.
- I-9: TR-R-10.
- I-10: TR-L-01, TR-L-02, TR-L-03.
- I-11: TR-A-03, TR-T-01.
- I-12: TR-G-06.
- I-13: TR-R-12.
- I-14: TR-A-04.
- I-15: TR-E-02.

### Decision records to technical requirements

- ADR-014 qualified ids stay internal: TR-D-11, TR-G-01.
- ADR-015 GSAP is the v1 interpolator: TR-P-09, TR-A-03, TR-C-03.
- ADR-016 diagnostics stay inline: TR-E-09, TR-E-06, TR-E-07, TR-R-08.
- ADR-017 React ships in v1: TR-S-07, TR-A-06, TR-A-07.

### Inbound traceability: technical requirements to owners

Every binding requirement in sections 3 through 15 appears below at least once. The references are intentionally redundant where the requirement has multiple owners: product requirements establish why it exists, invariants establish what must remain true, and ADRs establish the decisions that prevent accidental reversal.

- TR-C-01: ADR-001, ADR-009, TR-SC-02.
- TR-C-02: ADR-001, I-11, TR-T-01.
- TR-C-03: FR-18, FR-23, ADR-015, ADR-017.
- TR-C-04: I-12, FR-22, TR-T-03.
- TR-C-05: ADR-009, FR-22.
- TR-A-01: I-1, I-2, I-3, I-13, ADR-005, ADR-006.
- TR-A-02: I-11, ADR-004, ADR-005.
- TR-A-03: I-11, FR-18.
- TR-A-04: I-14, FR-19, ADR-003.
- TR-A-05: FR-4, ADR-012.
- TR-A-06: FR-25, ADR-017.
- TR-A-07: FR-14, I-7.
- TR-A-08: ADR-003, ADR-005, ADR-006, ADR-014.
- TR-D-01: FR-1, ADR-011.
- TR-D-02: FR-2.
- TR-D-03: TR-G-01, TR-D-11, ADR-014.
- TR-D-04: FR-4, ADR-012.
- TR-D-05: FR-20, ADR-034, ADR-044, ADR-046, ADR-047.
- TR-D-06: FR-2, FR-20.
- TR-D-07: FR-5, ADR-011.
- TR-D-08: FR-5, ADR-011.
- TR-D-09: FR-5, ADR-011.
- TR-D-10: FR-5, TR-T-02, TR-T-03.
- TR-D-11: FR-3, TR-G-01, ADR-014.
- TR-G-01: FR-3, ADR-014.
- TR-G-02: FR-3, ADR-014.
- TR-G-03: FR-6.
- TR-G-04: FR-9, ADR-013.
- TR-G-05: FR-20, I-15.
- TR-G-06: I-12, FR-6.
- TR-G-07: FR-20, I-15.
- TR-G-08: FR-8, I-1, ADR-006.
- TR-G-09: FR-7, ADR-005.
- TR-G-10: FR-7, I-2, ADR-005.
- TR-G-11: FR-7, I-2, ADR-005.
- TR-G-12: FR-8, I-1, ADR-006.
- TR-G-13: FR-19, I-14.
- TR-R-01: FR-11.
- TR-R-02: FR-11, I-5.
- TR-R-03: FR-11, I-5.
- TR-R-04: I-3, ADR-005.
- TR-R-05: FR-14.
- TR-R-06: FR-14, I-7.
- TR-R-07: FR-13, I-8.
- TR-R-08: FR-13.
- TR-R-09: FR-14, I-6.
- TR-R-10: FR-12, I-9.
- TR-R-11: FR-10.
- TR-R-12: FR-10, I-13.
- TR-R-13: FR-19, FR-12.
- TR-R-14: FR-10.
- TR-R-15: FR-18, ADR-004.
- TR-M-01: FR-15, ADR-004.
- TR-M-02: FR-15, ADR-023.
- TR-M-03: FR-16, ADR-004.
- TR-M-04: FR-16, I-4.
- TR-M-05: FR-16, ADR-004.
- TR-M-06: FR-15, ADR-033.
- TR-M-07: FR-16, ADR-037.
- TR-P-01: FR-17.
- TR-P-02: FR-17.
- TR-P-03: FR-17.
- TR-P-04: FR-17.
- TR-P-05: FR-17.
- TR-P-06: FR-17.
- TR-P-07: FR-18.
- TR-P-08: FR-4, ADR-012.
- TR-P-09: FR-23, ADR-015.
- TR-L-01: I-10.
- TR-L-02: I-10.
- TR-L-03: I-10.
- TR-L-04: FR-19, ADR-013, ADR-020.
- TR-L-05: FR-19, ADR-013.
- TR-L-06: FR-22.
- TR-L-07: ADR-020, ADR-013.
- TR-L-08: FR-19, I-14.
- TR-E-01: FR-20.
- TR-E-02: I-15, ADR-010.
- TR-E-03: FR-7, I-2.
- TR-E-04: FR-12.
- TR-E-05: FR-12, I-9.
- TR-E-06: FR-24, ADR-016.
- TR-E-07: FR-24, ADR-016.
- TR-E-08: FR-20.
- TR-E-09: FR-24, ADR-016.
- TR-S-01: FR-21.
- TR-S-02: FR-21.
- TR-S-03: FR-21, ADR-014.
- TR-S-04: FR-21, ADR-008.
- TR-S-05: FR-22.
- TR-S-06: FR-22.
- TR-S-07: FR-25, ADR-017.
- TR-PF-01: FR-22.
- TR-PF-02: FR-22, TR-T-02, TR-T-03.
- TR-PF-03: FR-22.
- TR-PF-04: FR-22.
- TR-PF-05: FR-22, TR-T-07.
- TR-PF-06: FR-22, TR-T-07.
- TR-SC-01: FR-22, ADR-011.
- TR-SC-02: FR-22, TR-C-01.
- TR-SC-03: ADR-007, ADR-019.
- TR-SC-04: ADR-019, ADR-005.
- TR-T-01: FR-17, I-11.
- TR-T-02: ADR-008, I-1 through I-15.
- TR-T-03: ADR-008, I-12.
- TR-T-04: ADR-001.
- TR-T-05: ADR-008.
- TR-T-06: ADR-008.
- TR-T-07: ADR-008.
- TR-T-08: ADR-008, ADR-003.
- TR-T-09: ADR-008, ADR-003.
- TR-T-10: ADR-008.

### Delivery slices

The slice that satisfies each requirement is named in [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md). Every requirement in this document must appear in at least one slice; a requirement with no slice means the plan is incomplete, and a slice with no requirement means the work has no acceptance criteria.

## 17. Acceptance for v1

v1 is releasable only when every requirement in sections 4 through 15 has a green verification, the invariant matrix is complete, the packed consumer test passes, benchmarks run as a required job against committed budgets, and documentation matches implementation. The binary checklist lives at the end of [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) and is mirrored by CI jobs.

## 18. Resolved and open technical questions

### Resolved

- **Qualified ids stay internal.** No schema v6 is created to make qualified ids authorable. See ADR-014 and TR-D-11.
- **GSAP remains the interpolator.** The first interpolator stays engine-backed; no built-in sampler ships in v1. See ADR-015 and TR-P-09.
- **Diagnostics stay inline.** Runtime diagnostics ride on patches and batch summaries rather than a separate stream, so TR-E-07 stands unchanged. See ADR-016 and TR-E-09.
- **React stays in v1.** `@motion5/react` remains in the v1 package set, so TR-A-06 and TR-S-05 keep their full scope. See ADR-017 and TR-S-07.

### Still open

Tracked, not answered. Each must be resolved by a decision record before v1.

- Whether deep freezing stays unconditional or becomes development-only once TR-PF-03 has real measurements.
