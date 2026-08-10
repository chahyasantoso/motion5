# motion5 technical requirements document

**Status:** Normative technical contract for v1. Target state, not current state.
**Reality:** [SESSION-STATUS.md](./SESSION-STATUS.md).
**Upstream:** [PRD.md](./PRD.md) defines the product requirements FR-1 through FR-22. [ARCHITECTURE.md](./ARCHITECTURE.md) defines ownership and invariants I-1 through I-15.
**Downstream:** [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) sequences the work. [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) defines what counts as evidence.

## 1. Purpose and scope

This document specifies what the motion5 implementation must do, precisely enough that two engineers reading it independently would build the same observable behavior. The PRD says why a requirement exists. This document says what shape it takes, what it rejects, and how it is verified.

In scope: the contract layer, identity and normalization, the domain layer, the graph kernel, the runtime and publication path, ports and adapters, the public surface, diagnostics, performance and memory budgets, and packaging.

Out of scope: rendering strategy beyond the adapter boundary, example applications, physics or IK solvers, server-side ticking, and any compatibility path with motionpath APIs.

Audience: implementers and reviewers. A reviewer should be able to reject a pull request by citing a TR id.

## 2. Requirement ids and conventions

Requirement ids use a layer prefix.

- `TR-C` contract and schema.
- `TR-N` identity and normalization.
- `TR-D` domain: Track, Motion, plugins, values, lifecycle.
- `TR-G` graph kernel: IR, validation, ordering, live state, transactions.
- `TR-R` runtime and publication.
- `TR-P` ports and adapters.
- `TR-A` public API and packaging.
- `TR-Q` quality: performance, memory, determinism, CI.

"Must" is binding. "Must not" is a rejection rule. "May" marks an implementation choice that no test may depend on. Every binding requirement names its verification.

## 3. System context

```text
 author -> authored project (schema v5, plain data)
              |
              v
         Engine (composition root)
              |
              v
        ProjectRuntime  ---- diagnostics ---->  caller
              |
              v
         GraphRuntime
        /     |      \
GraphBinding Publisher PatchRegistry
      |
ObservationState
              |
              v
     immutable patch batches -> DOM adapter | React hooks | any renderer

ports in:  Clock, Interpolator, Scheduler
```

Runtime dependencies of the core package: none beyond the language runtime. Node 24, ESM, TypeScript for public contracts and runtime boundaries. GSAP, the DOM, and React are adapter concerns and are never core dependencies.

## 4. Contract layer

### TR-C-1 Version gate

The runtime boundary must accept `schemaVersion: 5` only. Any other value, including `4`, is rejected with an `error` diagnostic that names the migration path. There is no alias, no coercion, and no silent migration. Satisfies FR-1, ADR-002, ADR-011.

**Verification:** `test/unit/validate-v5.test.ts`, case "v4 input is rejected with a migration diagnostic".

### TR-C-2 Authored document shape

```ts
export interface AuthoredProjectV5 {
  schemaVersion: 5;
  projectId?: string;
  perspective?: number;
  templates?: AuthoredTemplate[];
  motions: AuthoredMotion[];
  freeTracks?: AuthoredTrack[];
}

export interface AuthoredMotion {
  id: string;
  trigger: AuthoredTrigger;
  stagger?: number;
  tracks: AuthoredTrack[];
}

export interface AuthoredTrack {
  id: string;
  duration?: number;
  keyframes?: Record<string, AuthoredChannel>;
  template?: string;
  observes?: AuthoredEdge[];
}

export interface AuthoredChannel {
  stops: Array<{ p: number; v: unknown }>;
}

export interface AuthoredEdge {
  source: string;
  role?: "input" | "output";
  target?: string;
}

export type AuthoredTrigger =
  | { type: "time"; autoplay?: boolean }
  | { type: "scroll"; autoplay?: boolean }
  | { type: "manual" };
```

`motions` is required and may be empty. `freeTracks` is optional and defaults to an empty array. Unknown top-level keys are rejected rather than ignored, so that a typo is a diagnostic instead of a silent no-op.

**Verification:** `test/unit/validate-v5.test.ts`, shape cases including "unknown top-level key is an error".

### TR-C-3 Validation is not normalization

The contract validator must not rewrite, reorder, default, or qualify anything in the caller's document. It returns a result and diagnostics. Normalization is a separate step owned by the graph layer. Satisfies FR-2 and FR-3.

**Verification:** `test/unit/validate-v5.test.ts`, case "validation does not mutate or clone-and-alter its input".

### TR-C-4 Validator result shape

```ts
export interface ValidationResult<T> {
  ok: boolean;
  value?: T;
  diagnostics: readonly Diagnostic[];
}
```

`ok` is `true` if and only if no diagnostic has `severity: "error"`. `value` is present if and only if `ok` is `true`. Diagnostics are returned in a stable order: by `path`, then `ruleId`, then the joined `ids`.

**Verification:** `test/unit/validate-v5.test.ts`, case "diagnostic order is stable across runs and input orderings".

### TR-C-5 Perspective is metadata

`perspective` must be a finite number greater than zero when present. Core validates and preserves it and must never read it during composition, place it in a patch, or import a CSS or DOM API because of it. Satisfies FR-4, ADR-012.

**Verification:** `test/integration/dom-perspective.test.ts`, case "perspective reaches the adapter and never a patch".

### TR-C-6 Migration is pure and external

The v4 to v5 migration is a pure function outside the runtime. It must not mutate its input, must be idempotent when applied to an already-migrated document, must produce byte-identical output for identical input under the golden serializer, and must emit diagnostics for assumptions it cannot verify, including id collisions created by moving top-level `tracks` into `freeTracks`. `loadProject` must not call it. Satisfies FR-5, ADR-011.

**Verification:** `test/migration/*`, cases "input is not mutated", "migration is idempotent", "collisions diagnose rather than overwrite".

### TR-C-7 Golden serialization format

Golden output must sort object keys lexicographically, preserve array order as authored, emit JSON-safe values only, and end with exactly one newline. Parsing a golden must round-trip to a structurally equal value.

**Verification:** `test/integration/golden-serialization.test.ts`.

## 5. Identity and normalization

### TR-N-1 Qualification happens once, at load

A track authored inside a motion becomes `motionId/trackId`. A free track becomes `~/trackId`. Qualification occurs exactly once, during normalization. No later stage may qualify, re-qualify, or unqualify an id. Satisfies FR-3.

**Verification:** `test/unit/qualified-ids.test.ts`, case "qualifying an already qualified id is an error, not an `a/b/c`".

### TR-N-2 Reserved characters

`/` is reserved as the qualification separator. `~` is reserved as the free-track namespace. An authored track id containing `/` is an error. A motion id containing `/` or equal to `~` is an error. These are checked before any qualification is attempted.

**Verification:** `test/unit/qualified-ids.test.ts`, reserved character cases.

### TR-N-3 Qualified ids are the only downstream identity

Qualified ids are the sort key for canonical order, the key of every registry, and the `nodeId` on every published patch. No structure downstream of normalization may key on an authored id. Satisfies FR-6.

**Verification:** `test/unit/graph-ir.test.ts`, case "no registry key is unqualified".

### TR-N-4 Free tracks are one node model

A free track differs from a motion track in exactly one respect: nothing schedules its playhead. Normalization, validation, ordering, composition, publication, diagnostics, and teardown paths are identical, and none of them may branch on membership kind. Satisfies FR-9, FR-19, ADR-013, invariant I-14.

**Verification:** `test/integration/diagnostics-parity.test.ts` and `test/integration/cross-motion.test.ts`.

### TR-N-5 Reference resolution is total

An `observes.source` resolves to exactly one of two outcomes: a member node, or a pending reference carrying a diagnostic. There is no third state and no `undefined` fallthrough. A pending reference must never publish a patch. Satisfies FR-20.

**Verification:** `test/integration/diagnostics-parity.test.ts`, case "a pending reference publishes nothing and diagnoses once".

## 6. Diagnostics

### TR-G-1 One diagnostic shape

```ts
export interface Diagnostic {
  ruleId: string;
  path: string;
  message: string;
  severity: "error" | "warning";
  ids?: string[];
}
```

`path` is a JSON pointer style path into the authored document, for example `/motions/0/tracks/1/observes/0`. `ids` lists the qualified ids involved, in canonical order, when the rule concerns nodes or edges.

### TR-G-2 Severity semantics

An `error` rejects the candidate project and it never replaces the active project. A `warning` never blocks a load and remains readable on the project after load. No configuration, option, or flag may promote a warning to an error or demote an error. Satisfies invariant I-15, ADR-010.

**Verification:** `test/unit/graph-validate.test.ts`, cases "a warning-only project loads" and "no option promotes a warning".

### TR-G-3 Rule catalog

Rule ids are stable identifiers and part of the public contract. Adding a rule is a minor change. Renaming or removing one is a breaking change.

Errors:

- `schema.version.unsupported`: `schemaVersion` is absent or not `5`.
- `schema.shape.invalid`: a field has the wrong type or an unknown top-level key is present.
- `id.missing`: a motion or track has no non-empty string id.
- `id.duplicate`: two motions, or two tracks within one scope, share an id.
- `id.reserved-character`: an authored id contains `/`, or a motion id is `~`.
- `trigger.type.invalid`: a trigger type is not `time`, `scroll`, or `manual`.
- `perspective.invalid`: `perspective` is present and is not a finite number greater than zero.
- `edge.malformed`: an `observes` entry is not an object or lacks a non-empty `source`.
- `edge.role.invalid`: `role` is present and is not `input` or `output`.
- `edge.target.required`: `role` is `input` and `target` is absent or empty.
- `edge.target.forbidden`: `role` is `output` and `target` is present.
- `edge.source.unknown`: `source` does not resolve to a node in the candidate project.
- `edge.duplicate`: two edges share the same source, role, and target triple.
- `edge.self-reference`: an edge's source resolves to its own observing node.
- `graph.cycle`: the observation graph contains a cycle. `ids` lists every participating node in canonical order.
- `template.unknown`: a track references a template id that does not exist.

Warnings:

- `perspective.missing-for-3d`: 3D content is detected (`z`, `rotationX`, `rotationY`, or a non-zero path-point `z`) and `perspective` is absent.
- `freetrack.unused`: a free track is observed by nothing and is not adopted.

Edge identity is the source, role, and target triple, so a single source may legitimately provide both an `input` and an `output` edge to the same observer.

**Verification:** `test/unit/graph-validate.test.ts` has one named case per rule id. The suite fails if a rule id exists in code with no test, or in this catalog with no code.

### TR-G-4 Runtime diagnostics are bounded

Runtime diagnostics accumulate on the project in a bounded ring buffer with a documented capacity, and also surface on the affected patch. Overflow drops the oldest entries and records a single overflow marker. Aggregated failures within one flush are reported as one aggregate error after the pass completes, never by aborting the pass.

**Verification:** `test/integration/blocked-closure.test.ts`, case "many failures in one flush produce one aggregate after the pass".

## 7. Domain layer

### TR-D-1 Immutable value snapshots

All published and shared values are deeply frozen. Freezing is recursive through plain objects and arrays. A frozen snapshot must not alias any mutable input object. Equality used for deduplication is structural, and numeric equality uses a documented tolerance so that floating point noise does not advance a revision. Satisfies invariants I-7 and I-8.

**Verification:** `test/unit/values.test.ts`.

### TR-D-2 Track is a leaf

Track owns playhead and progress state, interpolation inputs, resolved local plugin composition, local lifecycle, and renderer-neutral snapshots. Track must not expose children, a parent, a group host, composite playback, or any method that reads or walks a graph dependency. Satisfies FR-16, ADR-004, invariant I-4.

**Verification:** `test/unit/track-leaf.test.ts`.

### TR-D-3 Motion is the only composite

Motion owns child membership and hierarchy, stagger, layout, reflow, timeline construction, playback, trigger delegates, and child teardown. Motion must not perform graph composition or apply graph order, and must not receive graph order from outside the graph layer. Satisfies FR-15, ADR-004.

**Verification:** `test/unit/motion-composite.test.ts`.

### TR-D-4 Plugin composition is pure

A plugin receives values and configuration and returns values. It must not receive a Track, a Motion, a runtime, or the graph. Registration rejects duplicate ids with a diagnostic, and resolution order is deterministic and documented.

**Verification:** `test/unit/plugins.test.ts`.

### TR-D-5 Teardown is owner-first and idempotent

The owner removes graph membership, subscriptions, and edges before the contained object releases local resources. `dispose` and `destroy` are idempotent and reentrancy-safe, and the guard flag is set before any notification is emitted. A borrowed runtime is detached by its borrower and destroyed only by its owner. Ownership is decided at construction and never changes during teardown. Satisfies invariant I-10.

**Verification:** `test/unit/lifecycle.test.ts`, `test/integration/adoption.test.ts`.

## 8. Graph kernel

### TR-G-5 Immutable graph IR

The IR contains nodes, edges, diagnostics, and canonical order, and is frozen. It stores identity and authored data only. It must not hold references to live runtime objects. Building the IR twice from identical input produces byte-identical golden output. Satisfies FR-6.

**Verification:** `test/unit/graph-ir.test.ts`.

### TR-G-6 Canonical ordering

Canonical order is a pure function of qualified ids and authored order. The algorithm is a topological sort over observation edges with a deterministic tie-break: among nodes that are simultaneously ready, order by qualified id lexicographically using a fixed code-unit comparison, and use authored index only to break exact id ties, which cannot occur after duplicate rejection. Order must never depend on `Map` or `Set` insertion order derived from runtime events. Satisfies invariant I-12.

**Verification:** `test/unit/graph-order.test.ts`, cases "shuffling authored edge arrays does not change canonical order" and "order is independent of mount sequence".

### TR-G-7 Cycle rejection

Cycles are detected during validation, before mount. The `graph.cycle` diagnostic lists every participating node in canonical order so that two runs of the same broken project produce the same message. Satisfies FR-2.

**Verification:** `test/unit/graph-order.test.ts` and `test/integration/cycle-rejection.test.ts`.

### TR-G-8 ObservationState identity

Exactly one ObservationState instance exists per loaded project. It holds live edges and observers, is mutated in place, and is never rebuilt after a commit. Its identity is stable across every successful and failed mutation. Satisfies FR-8, ADR-006, invariant I-1.

**Verification:** `test/integration/observation-identity.test.ts`.

### TR-G-9 Single mutation coordinator

GraphBinding is the only coordinator for adding, removing, or replacing a node or an edge. No other object exposes a topology mutation method, including as a forwarding convenience. Satisfies FR-7, ADR-005, invariant I-3.

**Verification:** `test/unit/publisher-contract.test.ts` and the duplicate-owner rule in `scripts/boundary-scan.mjs`.

### TR-G-10 Transaction stages

Every topology change follows the same path:

```text
command
  -> build candidate graph
  -> normalize and validate candidate
  -> apply observation state changes, recording an undo journal
  -> apply publisher schedule changes
  -> commit immutable graph snapshot
  -> invalidate affected nodes
  -> release journal
```

Any failure before commit replays the undo journal in reverse and rethrows the original error with the candidate diagnostics attached. There is no partial application and no repair step. Commit swaps the immutable IR snapshot only; it does not recreate live state or subscriptions.

**Verification:** `test/integration/rollback.test.ts` injects a failure at each stage boundary.

### TR-G-11 Rollback fidelity

After a failed mutation, graph IR, live edges, publisher indexes, lifecycle subscriptions, ownership records, and published patches must be byte-identical to their pre-mutation snapshot under the golden serializer, and object identity for ObservationState must be unchanged. Satisfies invariant I-2.

**Verification:** `test/integration/rollback.test.ts`.

### TR-G-12 Undo journal records values, not intent

Journal entries record the exact prior value and the exact prior position, sufficient to restore identity. An entry that records only "an edge was added here" is insufficient, because reversing it cannot restore an equal-but-different object.

**Verification:** `test/integration/rollback.test.ts`, case "rollback restores object identity, not merely structural equality".

## 9. Runtime and publication

### TR-R-1 One owner set per project

A loaded project has exactly one authoritative observation graph, live observation state, mutation coordinator, publisher, patch registry, and clock subscription. GraphRuntime is project-wide. There is no per-Motion runtime object. Satisfies FR-10, invariants I-1 and I-13.

**Verification:** `test/integration/single-clock.test.ts`, case "mounting many motions produces one upstream subscription".

### TR-R-2 Flush algorithm

One tick produces one batch.

```text
1. clock tick or explicit flush opens a batch
2. collect dirty seeds from playhead invalidation and mutations since last flush
3. walk canonical order restricted to the downstream closure of the seeds
4. compose each dirty node at most once; memoize per batch
5. input-role edges contribute to the source object before local composition
6. output-role edges merge over the resulting patch after local composition
7. on composition throw: node publishes error, downstream closure publishes blocked,
   traversal continues for unrelated branches
8. deduplicate publication against values, progress, source revisions, and status
9. retain retry metadata only for nodes whose publication failed
10. close the batch, then notify node subscribers, then batch subscribers
```

Satisfies FR-11, FR-12, FR-13, invariants I-5, I-6, I-9.

**Verification:** `test/unit/diamond-memoization.test.ts`, `test/integration/flush-batch.test.ts`, `test/integration/blocked-closure.test.ts`.

### TR-R-3 Reentrancy is refused

A flush triggered while a flush is in progress returns immediately. It is not queued and not nested. A subscriber that mutates the graph schedules work for the next tick.

**Verification:** `test/integration/reentrancy.test.ts`.

### TR-R-4 Patch contract

```ts
export type PatchStatus = "ready" | "blocked" | "error";

export interface Patch {
  readonly nodeId: string;
  readonly revision: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly status: PatchStatus;
  readonly diagnostics: readonly Diagnostic[];
}

export interface PatchBatch {
  readonly tick: number;
  readonly patches: readonly Patch[];
  readonly seeds: readonly string[];
  readonly diagnosticsSummary: {
    readonly errors: number;
    readonly warnings: number;
  };
}
```

Patches are deeply frozen. `diagnostics` is empty when `status` is `ready`. Nothing in the subscriber contract exposes a Track, a Motion, or a graph object. Satisfies FR-14, invariant I-7.

**Verification:** `test/unit/patch-registry.test.ts`, `packages/react/test/patch-immutability.test.tsx`.

### TR-R-5 Revision semantics

`revision` is monotonic per node and advances only when a published value actually changes, where "value" includes `values`, `sourceProgress`, `sourceRevisions`, and `status`. A recompute that produces an identical result must not advance the revision and must not notify subscribers for that node. Satisfies invariant I-8.

**Verification:** `test/unit/patch-registry.test.ts`, cases "identical recompute does not advance revision" and "a status-only change does advance it".

### TR-R-6 Notification order

Subscribers are notified only at batch close, node subscribers first and batch subscribers second. No subscriber may observe a partial flush. Satisfies invariant I-6.

**Verification:** `test/integration/flush-batch.test.ts`.

### TR-R-7 Blocked closure

When a node's composition throws, that node publishes `error` with diagnostics, every node in its downstream closure publishes `blocked`, and unrelated branches complete normally within the same batch. Satisfies invariant I-9.

**Verification:** `test/integration/blocked-closure.test.ts`.

### TR-R-8 Recovery

When an upstream node is unmounted, its downstream closure publishes `blocked`. On remount, affected nodes return to `ready` without a reload. Tick numbers are monotonic across detach and reattach cycles, because retry scheduling depends on them never moving backwards.

**Verification:** `test/integration/remount.test.ts`.

### TR-R-9 ProjectRuntime is the only mount path

ProjectRuntime owns project lifetime, the normalized project, membership, the instance registry, diagnostics, and exactly one GraphRuntime. No other object may mount a project, including in tests.

**Verification:** `test/integration/project-lifecycle.test.ts` and the duplicate-owner rule in the boundary scan.

### TR-R-10 Engine does no graph work

Engine owns construction of a ProjectRuntime, wiring of adapters to ports, and the user-facing entrypoint. It must not traverse, validate, order, or publish.

**Verification:** `test/integration/engine-headless.test.ts`.

## 10. Ports and adapters

### TR-P-1 Port interfaces

```ts
export interface ClockEvent {
  tick: number;
  time: number;
}

export interface Clock {
  subscribe(listener: (event: ClockEvent) => void): () => void;
}

export interface Interpolator {
  create(config: unknown): InterpolationTimeline;
}

export type Cancel = () => void;

export interface Scheduler {
  schedule(job: () => void, options?: unknown): Cancel;
}
```

The core accepts capabilities, never implementations. Satisfies FR-17.

### TR-P-2 One contract suite per port

Each port ships one contract test suite. The fake and every real adapter run that same suite with no adapter-specific branches. A port with no passing real adapter is an unproven interface and must be recorded as such in session status.

**Verification:** `test/contract/ports.test.ts` parameterized over implementations.

### TR-P-3 Fakes are the core's test implementation

The core test suite uses the manual clock, the fake interpolator, and the fake scheduler. Core tests must not read wall time, random values, animation frames, or unordered collection iteration. Satisfies the determinism attribute in the PRD.

**Verification:** `test/integration/engine-headless.test.ts` plus the boundaries job.

### TR-P-4 Clock semantics

Exactly one upstream clock subscription exists per project regardless of how many motions are mounted. Tick numbers are monotonically increasing and never reset for the lifetime of the project. Satisfies invariant I-13.

**Verification:** `test/integration/single-clock.test.ts`, `test/integration/remount.test.ts`.

### TR-P-5 Adapter boundary

No module under `core/contract`, `core/domain`, `core/graph`, or `core/runtime` may import an animation engine, the DOM, or React, including type-only imports. Adapters depend on ports and on their own external engine. Nothing depends on adapters except the composition root. Satisfies FR-18, invariant I-11.

**Verification:** `scripts/boundary-scan.mjs` in the required boundaries job, plus `test/integration/engine-headless.test.ts`.

### TR-P-6 Renderer responsibilities

A renderer adapter consumes batches or node patches. It must not traverse the graph, call composition on a Track, or inspect runtime internals. The DOM adapter is the only component that reads `perspective`, and it applies it once to a stage container.

**Verification:** `test/integration/dom-perspective.test.ts`, `packages/react/test/patch-immutability.test.tsx`.

## 11. Public API and packaging

### TR-A-1 Allow-listed exports

`@motion5/core` exports `Engine`, project loading, `Motion`, `Track`, plugin registration, triggers, patch subscription, the manual clock, port assertion helpers, and the authored contract constants. The export map is an allow list and deep wildcard imports are blocked. Satisfies FR-21.

**Verification:** `scripts/api-surface-check.mjs`, case "a planted extra export fails the check".

### TR-A-2 Never exported

`GraphRuntime`, `ProjectRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, and normalization helpers are reachable only through `@motion5/core/internal`, which is unadvertised and carries no stability promise. A type-only export that reveals one of these shapes counts as a violation.

**Verification:** `scripts/api-surface-check.mjs`.

### TR-A-3 Packed artifact

The documented public API must work from a packed tarball installed into a clean consumer, not only from workspace source. Satisfies FR-22.

**Verification:** the package job: `npm pack`, install into a clean fixture, import only documented exports, run a headless smoke scene.

### TR-A-4 No flags

No shipped code branches on a capability or rollout flag for core behavior. Free tracks and cross-motion references travel the same path as any authored node. Satisfies ADR-003, invariant I-14.

**Verification:** the banned-symbol rule in the boundaries job plus `test/integration/cross-motion.test.ts`.

## 12. Performance and memory

### TR-Q-1 Budgets are committed and versioned

Budgets live in `performance/budgets.json` and are versioned with the code. A budget change is a reviewed change with a stated reason.

```json
{
  "version": 1,
  "scenarios": {
    "chain-1000": { "metric": "flushMs", "budget": 0 },
    "diamond-500": { "metric": "compositionsPerFlush", "budget": 0 },
    "wide-fanout-2000": { "metric": "flushMs", "budget": 0 },
    "mount-unmount-100x": { "metric": "retainedBytes", "budget": 0 }
  }
}
```

Budget values are `0` here because they are set during P3-07 calibration on the CI runner. A budget that has not been calibrated must be recorded as advisory in session status with an expiry date, and must be promoted or deleted by that date.

### TR-Q-2 Counted, not timed, where possible

Wherever a property can be proven by counting rather than timing, it must be. `compositionsPerFlush`, allocation counts, and retained subscription counts are deterministic and are required gates. Wall-clock metrics are secondary and are compared with a tolerance.

**Verification:** `performance/graph-benchmark.mjs` plus `test/unit/diamond-memoization.test.ts`.

### TR-Q-3 Memory release

Repeated load, mount, unmount, and dispose cycles must release subscriptions, timelines, graph membership, and cached patches. Retained bytes after N cycles must not grow with N.

**Verification:** `test/integration/project-lifecycle.test.ts` and the `mount-unmount-100x` scenario.

### TR-Q-4 Determinism of the benchmark itself

Benchmark workloads use fixed graph shapes, fixed seeds, and the manual clock. A benchmark whose result varies with machine load in the counted metrics is broken and is fixed or deleted in the same session.

## 13. Quality gates

### TR-Q-5 Every invariant has a named test

Each of I-1 through I-15 maps to at least one named executable test. The test fails when the invariant is broken and is not satisfied by a source-text scan. Satisfies ADR-008.

### TR-Q-6 Prohibited evidence

Comment-density gates, non-shrinking file allowlists, source-text scans presented as behavioral tests, snapshots of private object graphs, and value-only parity tests that ignore payload shape are not acceptable evidence. Boundary scans are mechanical enforcement and complement, never replace, runtime tests.

### TR-Q-7 CI job contract

Every CI step maps to an npm script reproducible locally. Required jobs block merges. An advisory job must name its expiry. See [CI-WORKFLOW.md](./CI-WORKFLOW.md).

### TR-Q-8 No copied predecessor evidence

No test, helper, fixture, snapshot, or source file is copied from motionpath. Behavioral intent may be independently recreated against the motion5 contract. Satisfies ADR-001.

## 14. Traceability

Product requirement to technical requirement:

- FR-1 to TR-C-1. FR-2 to TR-C-2, TR-G-3, TR-G-7. FR-3 to TR-N-1, TR-N-2. FR-4 to TR-C-5. FR-5 to TR-C-6.
- FR-6 to TR-G-5, TR-N-3. FR-7 to TR-G-9, TR-G-10. FR-8 to TR-G-8. FR-9 to TR-N-4.
- FR-10 to TR-R-1. FR-11 to TR-R-2. FR-12 to TR-R-7. FR-13 to TR-R-5. FR-14 to TR-R-4, TR-R-6.
- FR-15 to TR-D-3. FR-16 to TR-D-2. FR-17 to TR-P-1, TR-P-2. FR-18 to TR-P-5.
- FR-19 to TR-N-4, TR-A-4. FR-20 to TR-N-5, TR-G-3. FR-21 to TR-A-1, TR-A-2. FR-22 to TR-A-3, TR-Q-1.

Architecture invariant to technical requirement:

- I-1 to TR-G-8. I-2 to TR-G-11, TR-G-12. I-3 to TR-G-9. I-4 to TR-D-2. I-5 to TR-R-2.
- I-6 to TR-R-6. I-7 to TR-D-1, TR-R-4. I-8 to TR-R-5. I-9 to TR-R-7, TR-R-8. I-10 to TR-D-5.
- I-11 to TR-P-5. I-12 to TR-G-6. I-13 to TR-P-4, TR-R-1. I-14 to TR-N-4, TR-A-4. I-15 to TR-G-2.

Phase to technical requirement, as sequenced in [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md):

- Phase 0: TR-C-1 through TR-C-7, TR-P-1 through TR-P-3, TR-G-1, TR-G-2.
- Phase 1: TR-D-1 through TR-D-5.
- Phase 2: TR-N-1 through TR-N-3, TR-G-3, TR-G-5 through TR-G-12, TR-P-5.
- Phase 3: TR-R-1 through TR-R-7, TR-G-4, TR-Q-1, TR-Q-2.
- Phase 4: TR-P-2, TR-P-4, TR-P-6, TR-C-5.
- Phase 5: TR-N-4, TR-N-5, TR-R-8, TR-A-4.
- Phase 6: TR-A-1 through TR-A-3, TR-Q-1 through TR-Q-8.

## 15. Open technical questions

These are tracked here and resolved by an ADR, not by an implementation detail landing quietly.

1. Numeric equality tolerance for revision deduplication in TR-D-1: exact bit equality, a fixed epsilon, or a per-channel policy.
2. Runtime diagnostics ring buffer capacity in TR-G-4, and whether capacity is configurable at load.
3. Whether the first interpolator remains GSAP-backed or gains a built-in sampler, which would change TR-P-2 evidence.
4. Whether runtime diagnostics remain inline on patches or gain a separate stream, which would change TR-R-4.
5. Whether React stays in the v1 package set, which would change TR-A-3.
6. Whether a future schema v6 makes qualified ids authorable, which would change TR-N-1 and TR-N-2.
