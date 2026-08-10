# motion5 product requirements

**Owner:** [@chahyasantoso](https://github.com/chahyasantoso)
**Status:** Accepted for Phase 0
**Authored contract:** `schemaVersion: 4`

## 1. Problem

Rich web animation work fails at the same place every time: dependency between animated things. A hand follows a forearm, which follows an upper arm, which follows a scroll position. A caption derives from a path sampler. A camera derives from three rigs at once.

Tools handle the single-timeline case well and the dependency case badly. Developers end up hand-rolling ordering, caching, and invalidation inside render callbacks. The result is order-dependent, framerate-dependent, hard to test, and impossible to reason about once more than two things observe each other.

The predecessor project, `motionpath`, proved the model works: normalize authored dependencies into a graph, resolve topologically, publish immutable patches. It also proved how the model rots. Ownership was allowed to blur, so the same responsibility ended up implemented twice: two observation ownership modes resolving to one implementation, a publisher that could also mutate topology, a leaf object that also owned composites, and capability flags that kept dead paths alive. Every one of those was a small, reasonable local decision.

## 2. Vision

A small animation runtime where **ownership is impossible to misunderstand**. One authority per state transition, one live state per project, one publication path, one clock. Features are added as vertical slices that each prove a user-visible capability, and never as a second way to do an existing thing.

## 3. Users

- **Creative engineer.** Builds scroll and time driven scenes in React or plain DOM. Wants declarative authoring, predictable ordering, and no per-frame React re-renders.
- **Rig author.** Builds forward-kinematics style hierarchies where tracks observe tracks. Wants correct topological evaluation, useful diagnostics on bad graphs, and stable behavior when parts unmount.
- **Tooling author.** Builds editors and inspectors on top of the runtime. Wants immutable published state, revisioned patches, and a documented public API that is not a moving target.
- **Maintainer.** Extends the runtime. Wants boundaries enforced by CI rather than by memory.

## 4. Goals

1. **G1 Deterministic evaluation.** Same authored project plus same tick sequence yields byte-identical published patches, on any machine.
2. **G2 Single authority.** Every state transition has exactly one code path. No aliases, no parity modes, no rollout flags in shipped code.
3. **G3 Renderer neutrality.** The core resolves and publishes without importing GSAP, the DOM, or React. Verified by CI, not by convention.
4. **G4 Transactional topology.** A failed graph mutation leaves the runtime exactly as it was: IR, live edges, publisher indexes, subscriptions, and published patches all unchanged.
5. **G5 Immutable publication.** Subscribers receive frozen, revisioned patches in whole batches. A subscriber can never observe half of a flush.
6. **G6 Honest gates.** Every claim of enforcement is backed by a CI job that runs. Gates measure behavior, API shape, boundaries, packaging, or mechanical formatting. Never prose, never comment density, never file counts.
7. **G7 Leak-free lifecycle.** Teardown is owner-first and idempotent. Borrowed runtimes are detached, never destroyed by a non-owner.
8. **G8 Small public surface.** The published API is allow-listed. Internals are reachable only through an explicitly unadvertised entrypoint used by this repository.

## 5. Non-goals

- Backward compatibility with any `motionpath` runtime API. The authored data contract is preserved; the runtime API is not.
- A demo application, example gallery, or documentation site in this repository.
- A visual editor, timeline UI, or authoring GUI.
- Physics, collision, or IK solvers. Forward kinematics composition is in scope; solving is not.
- Supporting animation engines beyond one reference interpolator adapter in v1.
- SSR rendering of animated output. Loading and validating a project on the server is in scope; ticking is not.

## 6. User stories

- As a creative engineer, I load an authored project, mount a motion, and drive it from scroll without writing frame callbacks.
- As a rig author, I declare that `hand` observes `forearm` as an input, and the runtime guarantees `forearm` composes first, every tick, without me ordering anything.
- As a rig author, I author a cycle by mistake and get a diagnostic naming both tracks and the authored path, before anything mounts.
- As a rig author, I unmount an upstream motion mid-session, and downstream nodes report a blocked status with a diagnostic instead of rendering stale values.
- As a tooling author, I subscribe to a node and receive frozen patches with monotonic revisions and the revisions of every source that contributed.
- As a tooling author, I subscribe to the whole batch and know that everything I see came from one tick.
- As a maintainer, I import GSAP into a core graph module and CI fails on that pull request.
- As a maintainer, I mutate the graph in a way that throws halfway through, and a test proves the runtime is byte-identical to its pre-mutation snapshot.

## 7. Functional requirements

### Authoring and loading

- **FR-1** Load and validate authored `schemaVersion: 4` projects. Invalid projects fail before any Motion mounts and never replace an already-loaded project.
- **FR-2** Reject ambiguous, duplicate, malformed, unknown, self-referential, and cyclic references at load time, with a diagnostic carrying a rule id, an authored path, and a human message.
- **FR-3** Normalize authored ids into qualified runtime ids exactly once, at load.
- **FR-4** Support programmatic composition (`createMotion`) with the same validation as authored input.

### Graph

- **FR-5** Produce an immutable graph IR: nodes, edges, diagnostics, canonical topological order.
- **FR-6** Support `input` and `output` edge roles. Role and target are part of edge identity, so one source may feed one observer twice with different roles.
- **FR-7** Route every topology change through one mutation coordinator, transactionally, with an undo journal.
- **FR-8** Keep one long-lived observation state per project, mutated in place. Never recreate it on commit.

### Runtime and publication

- **FR-9** One `ProjectRuntime` per loaded project, owning exactly one `GraphRuntime`.
- **FR-10** One flush per tick producing one immutable batch: compose each dirty node at most once, in canonical order.
- **FR-11** Block the downstream closure of a failed composition, and mark those nodes with a status rather than publishing stale values.
- **FR-12** Retain retry metadata only for failed publication, never for successful state.
- **FR-13** Publish revisioned patches carrying values, source progress, contributing source revisions, status, and diagnostics.
- **FR-14** Deduplicate publication: an unchanged node does not bump its revision.

### Playback

- **FR-15** Motion owns timeline construction, playback (`play`, `pause`, `seek`, `reverse`), triggers, child membership, stagger, and reflow.
- **FR-16** Track owns only playhead state, interpolation inputs, resolved local plugin composition, and renderer-neutral snapshots.
- **FR-17** Support time, scroll, and manual triggers through delegates that the runtime does not special-case.

### Ports and adapters

- **FR-18** Define `Clock`, `Interpolator`, and `Scheduler` ports with fake implementations that the core test suite uses exclusively.
- **FR-19** Provide a manual clock so any consumer can drive the runtime deterministically.
- **FR-20** Provide GSAP and DOM adapters behind the ports, and React hooks that subscribe to published batches without recursive composition.

### Membership

- **FR-21** Support cross-motion observation using `motionId/trackId` references, with no capability flag.
- **FR-22** Support adopted free tracks using `~/trackId`, with no capability flag.
- **FR-23** Diagnose missing, unknown, duplicate, role-mismatched, and incompatible references consistently for authored, cross-motion, and adopted nodes.

### Tooling

- **FR-24** Ship an allow-listed package export map. Deep wildcard imports are blocked, not merely discouraged.
- **FR-25** Ship TypeScript declarations for the entire public surface.
- **FR-26** Ship deterministic benchmarks with explicit budgets, failing only on a defined threshold.

## 8. Quality attributes

- **Determinism.** No wall-clock reads, no `Math.random`, no iteration over unordered sets in any path that affects output. Canonical ordering is by qualified id.
- **Performance.** A 200 node, 400 edge graph flushes a single dirty seed in under one millisecond on the reference machine, and a full-graph invalidation within one frame budget. Budgets live in `performance/budgets.json` and are versioned.
- **Memory.** Disposing a project releases every subscription, timeline, and cached patch. A load/dispose cycle repeated 100 times shows no growth in retained node count.
- **Bundle.** Core has zero runtime dependencies. Adapters declare their engines as peer dependencies.
- **Diagnosability.** Every rejection names the rule, the authored path, and the ids involved.
- **Testability.** The core runs headless under Node with no DOM and no animation engine.

## 9. Success metrics

- Core test suite runs green with zero animation-engine imports.
- Zero shipped capability flags and zero compatibility facades at v1.
- One hundred percent of documented public API covered by a package-consumer smoke test that installs the tarball.
- Median pull request touches fewer than twenty semantic files.
- No phase requires a second revert.

## 10. Release criteria for v1

Every item is binary and independently verifiable in CI.

1. Authored `schemaVersion: 4` projects load and validate.
2. No compatibility facade exists on any Track construction path.
3. Exactly one qualified graph and one long-lived observation state exist per loaded project.
4. The mutation coordinator is the only writer of topology, and the publisher cannot mutate topology.
5. Exactly one project-wide graph runtime, patch registry, publisher, and clock subscription exist per project.
6. No Track recursively composes graph dependencies.
7. Track is a leaf and Motion is the sole composite.
8. `Clock`, `Interpolator`, and `Scheduler` are real, tested, injectable ports.
9. Cross-motion and adopted-track membership work with no capability flags.
10. Teardown is owner-first, idempotent, and leak-free under a repeated load/dispose test.
11. Core imports no animation engine and no DOM.
12. React and DOM consume immutable published batches only.
13. Tests, types, exports, docs, and benchmarks describe only the shipped contract.
14. Every gate in [CI-WORKFLOW.md](./CI-WORKFLOW.md) exists and runs.

## 11. Risks

- **Rebuilding the same drift.** Mitigation: boundary and API surface checks land in Phase 2, before the surface is large enough to hide a second owner.
- **Scope creep from the reference repository.** Mitigation: features are pulled in only when a phase explicitly names them, and the delete list in [ARCHITECTURE.md](./ARCHITECTURE.md) is treated as binding.
- **Benchmarks becoming decoration.** Mitigation: budgets are committed, and the performance job fails on a defined threshold rather than reporting.
- **Docs drifting from code.** Mitigation: one status file, and doc updates required in the same pull request as the behavior change.
- **Under-tested adapters.** Mitigation: contract tests run against both the fake and the real implementation of every port.

## 12. Open questions

- **Q1** Does the authored schema stay at version 4 forever, or does v1 introduce version 5 with qualified ids as first-class authored syntax? Currently: stay at 4, qualify internally.
- **Q2** Is the reference interpolator adapter GSAP, or a built-in keyframe sampler with GSAP as an optional adapter? Currently: GSAP first, revisit at Phase 4.
- **Q3** Do published batches expose diagnostics inline, or through a separate diagnostics stream? Currently: inline on the patch, with a batch-level summary.
- **Q4** Is `packages/react` in scope for v1, or a follow-on release? Currently: in scope, minimal surface.
