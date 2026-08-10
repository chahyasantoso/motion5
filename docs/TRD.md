# motion5 technical requirements document

**Status:** Approved target requirements
**Product requirements:** [PRD.md](./PRD.md)
**Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
**Execution:** [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)
**Current reality:** [SESSION-STATUS.md](./SESSION-STATUS.md)

This document specifies what the v1 implementation must do at its technical boundaries. It is normative for implementation and acceptance, but it does not claim that planned modules currently exist.

## 1. Scope

motion5 is a renderer-neutral, deterministic animation runtime for authored projects whose tracks may depend on other tracks. It validates schema v5, normalizes local ids into a project-wide graph, evaluates affected nodes in canonical order, and publishes one immutable patch batch per clock tick.

v1 includes `@motion5/core`, GSAP interpolation, browser/DOM adapters, and `@motion5/react`. It excludes a built-in interpolator, a visual editor, demos in this repository, physics solvers, server-side ticking, silent v4 compatibility, and authorable qualified ids.

## 2. Locked technical decisions

1. **Qualified ids remain internal.** Authors use local track ids within motions, explicit `motionId/trackId` references when crossing motions, and `~/trackId` for free-track references. Runtime node identity is normalized once and is not a schema v6 authoring surface.
2. **GSAP is the v1 interpolator.** It implements the `Interpolator` port. Core never imports GSAP. No built-in sampler ships in v1.
3. **Runtime diagnostics remain inline.** Affected patches carry diagnostics and batches carry a summary. The project retains a bounded inspection buffer. There is no separate diagnostics stream in v1.
4. **React ships in v1.** `@motion5/react` is release-blocking and consumes public immutable patch and lifecycle contracts only.

Changing any decision requires a superseding ADR, matching PRD/TRD changes, and an implementation-plan revision in the same pull request.

## 3. Runtime topology and ownership

One loaded project must own exactly one instance of each authoritative runtime component:

```text
Engine
  -> ProjectRuntime
       -> Motion[] and Track[]
       -> GraphRuntime
            -> GraphBinding
            -> ObservationState
            -> GraphPublisher
            -> PatchRegistry
            -> Clock subscription
```

Technical ownership requirements:

- Engine constructs and disposes the composition root but performs no graph work.
- ProjectRuntime is the only project mount and replacement path.
- GraphRuntime owns the project-wide graph services and upstream clock subscription.
- GraphBinding is the only topology writer.
- ObservationState is long-lived and mutated in place.
- GraphPublisher reads committed snapshots and has no topology mutation API.
- PatchRegistry is the only owner of published identity, revisions, batching, and subscriber notification.
- Motion is the only composite and owns child membership, scheduling, triggers, playback, and owner-first teardown.
- Track is a leaf and owns playhead, local interpolation/composition, snapshots, and local lifecycle.

No convenience API may create a second path to any owned transition.

## 4. Package and module requirements

Target layout:

```text
packages/
  core/
    src/
      contract/
      domain/
      graph/
      runtime/
      ports/
      adapters/
      errors/
      index.ts
      internal.ts
  react/
    src/
performance/
scripts/
```

Dependency direction is inward:

```text
contract <- domain <- graph <- runtime
          <- ports  <- adapters
```

- `contract`, `domain`, `graph`, and `runtime` must not import GSAP, React, DOM APIs, browser globals, or adapter modules.
- `ports` contains capability interfaces and assertions, not environment implementations.
- `adapters` may import external engines or environment APIs and must satisfy shared contract suites.
- `@motion5/core` exports only documented public APIs.
- `@motion5/core/internal` is unadvertised, repository-only, and carries no stability promise.
- Wildcard deep exports are forbidden.
- The packed artifact, not source-tree resolution, is the packaging authority.

## 5. Authored input requirements

### 5.1 Project boundary

The loader must accept only an object with `schemaVersion: 5`, a `motions` array, and optional `freeTracks`, `templates`, `projectId`, and `perspective` fields. It must reject v4 and direct callers to explicit migration.

Validation occurs before runtime construction and reports deterministic diagnostics with:

```ts
interface Diagnostic {
  readonly ruleId: string;
  readonly path: string;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly ids?: readonly string[];
}
```

Any error blocks loading. No warning blocks loading. There is no severity promotion flag.

### 5.2 Identity

- Motion ids are unique, non-empty, must not contain `/`, and must not equal `~`.
- Track ids are non-empty, local to their owner, unique within that owner, and must not contain `/`.
- A motion track normalizes to `motionId/trackId`.
- A free track normalizes to `~/trackId`.
- Qualification happens exactly once during normalization.
- Internal registries, graph nodes, patches, and revisions use qualified ids only.
- Authors cannot directly define runtime-qualified node ids as an alternate schema dialect.

### 5.3 Observation edges

An observation is declared by the observing track and identifies a source, role, and optional target.

- `role: "input"` requires a non-empty target and contributes before local composition.
- `role: "output"` forbids target and merges over local output after composition.
- Omitted role defaults to `output`.
- Edge identity is `(observer, source, role, target)`.
- Unknown, duplicate, self-referential, incompatible, and cyclic edges are errors.
- Local references resolve in the observer's motion; cross-motion and free references use explicit authored reference syntax.

### 5.4 Perspective

Perspective is optional finite positive project metadata measured in CSS pixels. Invalid present values are errors. Missing perspective with detected 3D content is a warning. Core preserves it but never publishes or applies it; renderer adapters apply it to their stage boundary.

## 6. Migration requirements

`migrateV4ToV5` must be pure, deterministic, and separate from runtime loading.

It must:

- preserve its input by reference and deep value;
- change schema version 4 to 5;
- rename only project-level `tracks` to `freeTracks`;
- preserve `motion.tracks`;
- reject simultaneous top-level `tracks` and `freeTracks`;
- validate migration assumptions before transforming;
- qualify known free-track references where unambiguous;
- return stable diagnostics and stable serialization;
- return v5 input unchanged or as a documented no-op result.

The runtime must never invoke migration implicitly.

## 7. Domain requirements

### 7.1 Values

Renderer-neutral values must be JSON-compatible primitives, arrays, and plain records unless a plugin contract explicitly introduces another immutable type. Published values must be deeply frozen. Structural equality must be deterministic and independent of object key insertion order. Cyclic, executable, or unsupported mutable values must fail before publication.

### 7.2 Track

A Track must:

- own one interpolation timeline at a time;
- expose deterministic progress and immutable snapshots;
- clamp or reject progress according to one documented contract;
- compose registered local plugins in deterministic order;
- invalidate only on meaningful state changes;
- release its interpolation resources exactly once;
- support detach separately from destroy when borrowed;
- have no children, parent, graph traversal, trigger, schedule, or renderer access.

### 7.3 Motion

A Motion must:

- create and own authored child tracks;
- preserve authored child order;
- calculate duration, stagger, and reflow deterministically;
- own trigger delegates and playback controls;
- route graph membership through ProjectRuntime and GraphBinding rather than mutating graph services itself;
- remove graph membership and subscriptions before destroying children;
- make teardown idempotent and safe during callbacks.

## 8. Graph requirements

### 8.1 Graph IR

The normalized graph must be an immutable snapshot containing qualified nodes, edges, adjacency, authored-order metadata, diagnostics, and canonical topological order. It must not contain live subscriptions or mutable runtime instances.

Canonical order must be a pure function of dependencies, qualified ids, and authored order. It must never depend on event timing or incidental collection insertion order.

### 8.2 Validation and cycles

Candidate topology must be fully normalized and validated before live application. Cycle diagnostics must be deterministic and identify involved ids. Invalid candidates must not mount, publish, or alter the active graph.

### 8.3 Transactions

Every add, remove, and replace operation must follow:

```text
build candidate
-> normalize and validate
-> apply live-state changes with undo journal
-> apply publisher schedule changes
-> commit immutable graph snapshot
-> invalidate affected closure
-> release journal
```

If any pre-commit step fails, GraphBinding must replay the journal in reverse and rethrow the original failure with candidate diagnostics. Graph IR, live edges, indexes, lifecycle subscriptions, ownership, patches, revisions, and externally visible diagnostics must equal their pre-mutation state.

ObservationState identity must remain stable after both successful and failed transactions.

## 9. Clock, scheduler, and interpolation ports

### 9.1 Clock

Clock events contain monotonic `tick`, monotonic `time`, and non-negative `delta`. One project has one subscription regardless of motion count. Unsubscribe and dispose are idempotent. Detach/remount must not cause tick numbers to move backward.

### 9.2 Scheduler

Scheduled jobs execute in deterministic order under the fake. Cancellation is idempotent. A canceled job cannot run. Jobs scheduled during a dispatch follow one documented next-turn rule and cannot corrupt the active iteration.

### 9.3 Interpolator

The port creates a timeline with duration, progress get/set, and kill semantics. Fake and GSAP adapters must pass the same contract suite. The GSAP adapter is the supported v1 implementation; no core code may detect or branch on GSAP.

## 10. Flush and publication requirements

One clock tick or explicit flush creates at most one batch:

1. Reject reentrant flush without queueing it.
2. Open a registry batch.
3. Collect playhead and mutation dirty seeds.
4. Restrict traversal to their downstream closure.
5. Visit nodes in canonical topological order.
6. Compose each dirty node at most once.
7. Apply input observations before local composition.
8. Apply output observations after local composition.
9. Publish changed patches or statuses.
10. Close the batch and notify node subscribers before batch subscribers.

A patch contains:

```ts
interface Patch {
  readonly nodeId: string;
  readonly revision: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly status: "ready" | "blocked" | "error";
  readonly diagnostics: readonly Diagnostic[];
}
```

A batch contains tick identity, ordered patches, dirty seeds, and an inline diagnostic summary.

- Patches and nested values are deeply frozen.
- Revisions are monotonic per node.
- A revision advances only when values, source progress, source revisions, status, or inline diagnostics meaningfully change.
- Subscribers cannot observe a half-flush.
- Subscriber mutation cannot alter later readers.
- Graph changes requested by subscribers take effect no earlier than the next tick.

## 11. Failure and diagnostics requirements

If composition fails:

- the failing node publishes `error` with inline diagnostics;
- its downstream closure publishes `blocked` and cannot expose stale ready values;
- unrelated branches continue;
- failures from the pass are aggregated after traversal;
- recovery on a later tick may return nodes to `ready` with new revisions.

Publication failures may retain bounded retry metadata. Composition failures must not be mislabeled as publication retries.

Diagnostics remain inline on affected patches and summarized inline on batches. ProjectRuntime may retain a bounded ring buffer for inspection. No independent event stream is part of v1.

## 12. Adapter requirements

### 12.1 GSAP

The adapter must translate normalized keyframe inputs into GSAP timelines, preserve duration and progress semantics, and kill resources idempotently. It must not expose GSAP objects in public patches or domain snapshots.

### 12.2 Browser clock

The browser clock uses animation frames, emits monotonic events, and cancels pending work on dispose. Tests use a fake RAF boundary and never depend on wall time.

### 12.3 DOM

The DOM adapter consumes immutable patches and performs renderer writes without graph access. Missing targets, blocked patches, and error patches follow documented non-stale behavior. Perspective is applied from project metadata, not patch values.

### 12.4 React

`@motion5/react` must ship in v1 and:

- subscribe using external-store semantics;
- provide stable immutable snapshots and selector behavior;
- avoid duplicate subscriptions under React Strict Mode;
- start no browser clock during server rendering or import;
- expose playback and lifecycle hooks through public core APIs;
- never import core internals, traverse the graph, or recursively compose tracks;
- clean up subscriptions on unmount and runtime replacement.

## 13. Lifecycle and membership requirements

Lifecycle states are `created`, `mounted`, `detached`, and `destroyed`. Guards are set before notifications. Disposal and destruction are idempotent.

- Authored free tracks are project-owned and destroyed with the project.
- Adopted free tracks remain adopter-owned; the project detaches but does not destroy them.
- Cross-motion and free-track nodes share the same graph, validation, publication, and diagnostic path.
- Removing a source blocks dependent mounted nodes until a valid source returns.
- Remount reuses the same ObservationState and project clock subscription.
- No capability or rollout flag controls membership behavior.

## 14. Public API requirements

The final public surface must include documented forms of:

- Engine and project loading/replacement;
- Motion and Track user-facing controls;
- plugin registration;
- trigger contracts;
- patch and batch subscriptions;
- manual clock and port assertions;
- authored schema constants, types, validation, and v4 migration.

GraphRuntime, ProjectRuntime, GraphBinding, GraphPublisher, PatchRegistry, ObservationState, normalization helpers, and adapter internals must not be public exports.

Every public API must have declaration tests and a packed-consumer import test. Removing or changing a public contract requires explicit release policy and documentation.

## 15. Non-functional requirements

### Determinism

Core tests must not read wall time, random values, animation frames, or runtime-derived insertion order. Equivalent input and fake-port events must produce byte-identical golden output.

### Performance

Versioned budgets must cover graph construction, topological traversal, dirty propagation, patch publication, and repeated load/dispose retention. Datasets and environment metadata are committed. Advisory calibration must have an expiry date.

### Memory

Repeated mount, unmount, replacement, and disposal must release clock listeners, scheduler jobs, interpolation timelines, DOM/React subscriptions, graph membership, cached patches, and retry metadata.

### Security and robustness

Authored input is untrusted data. Validation must avoid prototype pollution, executable values, uncontrolled recursion, and path ambiguity. Diagnostics must not execute or interpolate authored code. Published objects expose no mutable runtime references.

### Compatibility

Node 24 and ESM are required. Runtime schema compatibility is v5 only. The v4 migration helper is supported explicitly; motionpath APIs are not.

## 16. Verification matrix

Required evidence before v1:

- unit tests for each module and validation rule;
- shared contract suites for fake and real ports;
- invariant tests I-1 through I-15;
- integration tests for loading, transaction rollback, publication, lifecycle, cross-motion, and free tracks;
- migration and deterministic golden tests;
- DOM and React adapter tests;
- import boundary and API surface checks;
- build and packed-tarball consumers for core and React;
- required deterministic performance and memory budgets.

Coverage percentage is informational. The release gate is contract evidence, not a line-count target.

## 17. Acceptance scenarios

### Mixed project

A project with two motions and one free track loads once, normalizes all ids, creates one graph runtime and clock subscription, and publishes one ordered immutable batch per tick.

### Atomic replacement

Replacing the active project with an invalid cyclic candidate returns deterministic errors and leaves the active project's graph, subscriptions, patches, revisions, and state identity unchanged.

### Diamond composition

When one dirty source feeds two branches that converge, each affected node composes once, the convergence node sees both current revisions, and subscribers receive nothing until batch close.

### Failure isolation

A composing node failure publishes inline error diagnostics, blocks its downstream closure, permits an unrelated branch to publish ready values, and recovers on a later valid tick.

### React lifecycle

Strict Mode mount/unmount and runtime replacement create no duplicate subscriptions, expose stable immutable snapshots, and release every listener after unmount.

### Adopted free track

An externally owned free track can join the project graph, drive multiple motions, detach and remount, and survive project disposal without being destroyed by the borrower.

## 18. Release conditions

v1 may ship only when the four locked decisions are reflected in code and docs, every architecture invariant has executable evidence, packed core and React consumers pass, required CI jobs are green, benchmark budgets are enforced, and `SESSION-STATUS.md` reports no transitional runtime path.
