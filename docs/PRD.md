# motion5 product requirements document

**Status:** Accepted product direction, Phase 0 implementation
**Authored contract:** schema v5
**Runtime status:** See [SESSION-STATUS.md](./SESSION-STATUS.md)
**Technical requirements:** See [TRD.md](./TRD.md)

## 1. Product summary

motion5 is a deterministic animation runtime for projects whose animated values depend on other animated values. It turns authored motions and tracks into a qualified observation graph, evaluates that graph transactionally, and publishes immutable patches for renderers.

The product is not “another timeline wrapper.” Its differentiator is a single ownership model that makes graph order, failure, lifecycle, and renderer boundaries explicit.

## 2. Problem

A timeline can interpolate one value. Real scenes compose values: a hand follows a forearm; a caption follows a path; several motions consume one cursor or scroll node; an upstream node can disappear while downstream nodes remain mounted.

When application code solves those relationships inside frame callbacks, ordering becomes accidental, intermediate state leaks, failures become stale values, and tests become timing-dependent. motion5 makes the relationship itself part of the project contract.

## 3. Users and jobs

**Creative engineer:** author a scene and drive it from scroll, time, or manual input without writing graph traversal or frame callbacks.

**Rig author:** express forward-kinematics or derived-value relationships and receive deterministic order, cycle diagnostics, and blocked downstream state when inputs fail.

**Renderer author:** consume immutable patches without knowing whether values came from a motion track, free track, or cross-motion dependency.

**Tooling author:** inspect revisions, source contributions, diagnostics, and project membership through stable public contracts.

**Maintainer:** extend the runtime without introducing a second owner, hidden flag, or renderer dependency into core.

## 4. Goals

1. Deterministic graph evaluation.
2. One owner for every state transition.
3. Renderer-neutral core.
4. Atomic topology mutation with rollback.
5. Immutable, revisioned, batched publication.
6. Leak-free owner-first teardown.
7. Small allow-listed public API.
8. Honest CI gates that run what they claim.
9. Explicit schema v5 migration from v4.
10. First-class React support inside the v1 package set.

## 5. Non-goals

- Runtime compatibility with motionpath APIs.
- Authorable runtime-qualified ids, or a schema v6 created for that purpose.
- A built-in interpolation sampler in v1.
- A separate runtime diagnostics event stream in v1.
- A demo or visual editor in this repository.
- A physics, collision, or IK solver.
- Multiple animation engines in core.
- Server-side ticking or DOM access in core.
- A silent v4 compatibility mode.

## 6. Functional requirements

### Loading and authoring

- **FR-1:** Accept only `schemaVersion: 5` at the runtime boundary.
- **FR-2:** Validate ids, triggers, tracks, perspective, observations, duplicates, and cycles before mount.
- **FR-3:** Normalize motion tracks to `motionId/trackId` and free tracks to `~/trackId` exactly once. Authored documents keep local ids and explicit reference syntax; qualified identity stays internal.
- **FR-4:** Preserve project-level perspective as validated metadata without adding it to patches.
- **FR-5:** Provide an explicit pure v4-to-v5 migration outside the runtime.

### Graph and state

- **FR-6:** Produce immutable graph IR with nodes, edges, diagnostics, and canonical order.
- **FR-7:** Route add, remove, and replace through one transactional binding.
- **FR-8:** Keep ObservationState identity stable across commits and rollback.
- **FR-9:** Treat free tracks and motion tracks as one graph node model.

### Runtime and publication

- **FR-10:** One project owns one GraphRuntime, publisher, patch registry, and clock subscription.
- **FR-11:** One tick produces one batch; dirty nodes compose at most once.
- **FR-12:** Composition failure yields error status and blocks downstream closure without aborting unrelated branches.
- **FR-13:** Publication deduplicates unchanged patches and retains retry metadata only for publication failures.
- **FR-14:** Subscribers never see half a flush and cannot mutate later readers through published values.

### Playback and adapters

- **FR-15:** Motion owns playback, triggers, child scheduling, stagger, reflow, and teardown.
- **FR-16:** Track owns playhead and local composition only.
- **FR-17:** Clock, Interpolator, and Scheduler are injectable ports with fake contract implementations.
- **FR-18:** GSAP, DOM, browser clock, and React integrations live behind adapters.

### Membership and tooling

- **FR-19:** Support cross-motion references and free tracks without flags.
- **FR-20:** Diagnose unresolved, duplicate, self-referential, role-invalid, and incompatible references consistently.
- **FR-21:** Export only documented APIs; internals use an unadvertised entrypoint.
- **FR-22:** Ship deterministic benchmarks and package-consumer smoke tests.

### Locked v1 scope

- **FR-23:** GSAP is the supported v1 `Interpolator` implementation, reachable only through the port. No built-in sampler ships in v1. See ADR-015.
- **FR-24:** Runtime diagnostics surface inline on affected patches and batch summaries, with bounded project-level history and no separate stream. See ADR-016.
- **FR-25:** `@motion5/react` ships in the v1 package set and its lifecycle, build, and packed-consumer gates are release-blocking. See ADR-017.

## 7. Quality attributes

**Determinism:** no wall-clock or random input in core tests; canonical order is based on qualified ids and authored order.

**Diagnosability:** every diagnostic has rule id, path, severity, message, and involved ids where applicable, and runtime failures appear where consumers already read state.

**Performance:** committed budgets cover graph traversal, dirty propagation, publication, and memory retention. A benchmark that is advisory must have a removal date.

**Memory:** repeated load, mount, unmount, and dispose cycles release subscriptions, timelines, graph membership, and cached patches.

**Packaging:** core has no renderer dependency; public exports work from the packed artifact, not only from source. React is a separately consumable v1 package.

**Testability:** core runs headless with fake ports and no GSAP, DOM, or React.

## 8. Success metrics

- Every architecture invariant has a named executable test.
- v4 migration output is deterministic and v4 runtime input is rejected.
- Core test suite imports no animation engine.
- The GSAP adapter passes the Interpolator contract suite unchanged, with no GSAP import in core.
- Runtime diagnostics appear on the affected patch and in the batch summary.
- React strict-mode lifecycle, build, and packed-consumer gates are green.
- No capability flags or compatibility facades ship.
- The documented public API passes a tarball consumer test.
- No phase requires a second revert.

## 9. Release criteria

v1 is releasable only when schema v5 loading, migration, graph transactions, inline diagnostics, publication, lifecycle, ports, the GSAP adapter, browser and DOM adapters, React, package exports, benchmarks, and documentation all have green evidence. The complete binary checklist lives in the implementation plan and is mirrored by CI jobs.

## 10. Resolved product decisions

These were open questions. They are now settled, and reversing one requires a superseding record in [DECISIONS.md](./DECISIONS.md) plus matching PRD, TRD, and plan updates in the same pull request.

- **Qualified ids stay internal.** No schema v6 is planned to make runtime-qualified ids authorable. Authored identity remains local, and normalization owns canonical identity. See ADR-014.
- **GSAP remains the interpolator.** The first and only v1 interpolator is GSAP behind the port. A built-in sampler is out of scope. See ADR-015.
- **Diagnostics stay inline.** Runtime diagnostics ride on patches and batch summaries rather than a separate stream. See ADR-016.
- **React stays in v1.** `@motion5/react` ships with v1 and blocks release if its gates fail. See ADR-017.

Remaining technical questions, including whether deep freezing stays unconditional once benchmarks exist, are tracked in [TRD.md](./TRD.md) section 18.
