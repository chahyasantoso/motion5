# motion5 architecture

**Status:** Target design. Phase 0 has no implementation. Where this document uses the present tense, it describes what the code must satisfy once it exists, not what exists today. Reality lives in [SESSION-STATUS.md](./SESSION-STATUS.md).

## 1. The one invariant

A loaded project has exactly one:

- authoritative observation graph;
- live observation state;
- mutation coordinator;
- publisher;
- patch registry;
- clock subscription.

Every other rule in this document is a consequence of that one. When a change makes any of those six ambiguous, the change is wrong regardless of how well it is written.

## 2. Layers

```text
         GSAP        DOM        React       Browser clock
            \         |           |            /
             +--------+-----------+-----------+
                            |
                          Ports
                 Clock  Interpolator  Scheduler
                            |
                         Engine
                            |
                      ProjectRuntime
                            |
                       GraphRuntime
                     /      |       \
           GraphBinding  Publisher  PatchRegistry
                  |
           ObservationState

  Motion  owns topology, scheduling, triggers, playback, children
  Track   owns playhead, interpolation, local plugin composition
```

Dependencies point inward only. Contract has no dependencies. Domain depends on contract. Graph depends on contract and domain. Runtime depends on graph. Ports are depended upon, never depending. Adapters depend on ports and on their own external engine, and nothing depends on adapters except the composition root.

## 3. Ownership

One owner per responsibility. If two things can perform an operation, one of them is wrong.

- **Engine** owns the composition root: constructing a `ProjectRuntime`, wiring adapters to ports, and the user-facing entrypoint. It performs no graph work itself.
- **ProjectRuntime** owns project lifetime, the normalized project, membership, the instance registry, diagnostics, and exactly one `GraphRuntime`. It is the only mount path.
- **GraphRuntime** owns one binding, one observation state, one publisher, one patch registry, and one clock subscription. It is project-wide, never Motion-wide.
- **GraphBinding** is the only topology mutation coordinator. Every add, remove, and replace of a node or edge goes through it, transactionally.
- **ObservationState** owns live edges and observers. It is long-lived and mutated in place with an undo journal. It is never rebuilt after a commit.
- **GraphPublisher** owns traversal and publication of a validated snapshot. It cannot add or remove graph entities. It has no mutation methods at all.
- **PatchRegistry** owns patch identity, revisions, immutability, batching, and subscriber notification.
- **Motion** owns child membership and hierarchy, stagger, layout, reflow, timeline construction, playback, trigger delegates, and child teardown. Motion is the only composite.
- **Track** owns playhead and progress state, interpolation inputs, resolved local plugin composition, local lifecycle, and renderer-neutral snapshots. Track is a leaf. It has no children, no parent, no group host, and no graph traversal.

Some authored data has no runtime owner at all, and that is deliberate. `perspective` is validated at load and handed to the renderer untouched. Nothing in the core reads it. See [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md).

The **trigger factory** is the only object that knows trigger kinds. A declared trigger type selects a real driver or fails loudly: there is no manual fallback for `time` or `scroll`, and a trigger field the runtime does not honor is rejected at validation rather than accepted and ignored. `Motion` never learns what a trigger type is. It takes normalized progress in `[0, 1]` and one capability flag, `acceptsExternalSignal`. See ADR-033.

A Motion's relationship to the one project clock is a three-state `ClockBinding`, not an optional callback beside a flag. `driver` feeds project ticks to a driver that owns time semantics, `motion` lets the Motion advance itself, and `none` is push-driven and registers no clock consumer at all. Two fields encoding one decision would need a runtime invariant to police a state the type system should have forbidden; with three states, holding both a driver and `motion.onTick` is unrepresentable and the registration site is an exhaustive switch with no fallback.

## 4. Invariants

Each one is a test, not a hope. The test id is the invariant id.

- **I-1** Exactly one observation state instance exists per loaded project, and its identity is stable across every successful and failed mutation.
- **I-2** A failed mutation leaves graph IR, live edges, publisher indexes, lifecycle subscriptions, ownership, and published patches byte-identical to their pre-mutation snapshot.
- **I-3** The publisher exposes no method that changes topology.
- **I-4** No Track method reads or walks graph dependencies.
- **I-5** A flush composes each dirty node at most once.
- **I-6** Subscribers are notified only at batch close. No subscriber observes a partial flush.
- **I-7** Published patches are deeply frozen. Mutating a received patch throws in strict mode and never affects a later reader.
- **I-8** Revisions are monotonic per node and only advance when a published value actually changes.
- **I-9** A composition failure blocks its entire downstream closure and publishes a blocked status for those nodes.
- **I-10** `dispose` and `destroy` are idempotent, owner-first, and safe to call during teardown of an owner.
- **I-11** No module under `core/contract`, `core/domain`, `core/graph`, or `core/runtime` imports an animation engine, the DOM, or React.
- **I-12** Canonical ordering is a pure function of qualified ids and authored order. It never depends on `Map` insertion order derived from runtime events.
- **I-13** Exactly one upstream clock subscription exists per project, regardless of how many motions are mounted.
- **I-14** No shipped code branches on a capability or rollout flag. Free tracks and cross-motion references travel the same path as any authored node.
- **I-15** A warning-severity diagnostic never blocks a load, and an error-severity diagnostic never permits one.

## 5. Identity

Authored ids stay local to their motion. Runtime ids are always qualified, and qualification happens exactly once, at load.

- `motionId/trackId` for a track authored inside a motion.
- `~/trackId` for a free track, authored in the project's `freeTracks` array or adopted at runtime.

Qualified ids are the sort key for canonical ordering, the key of every registry, and the node id on every published patch. Nothing downstream of load ever sees an unqualified id. `/` is reserved as the separator and `~` is reserved as the free-track namespace; both are rejected in authored ids.

A free track is not a distinct node type. Once qualified, it differs from a motion track in exactly one way: nothing schedules it, so its playhead is advanced by whoever owns it. Ordering, validation, composition, publication, and teardown are identical.

Reference resolution is total: a reference is either resolved to a member, or recorded as a pending reference with a diagnostic. There is no third state, and a pending reference never publishes.

## 6. Mutation transaction

All topology changes take the same path.

```text
command
  -> build candidate graph
  -> normalize and validate candidate
  -> resolveSolvers (derive solver members root-most first)
  -> apply observation state changes, recording an undo journal
  -> apply publisher schedule changes
  -> commit immutable graph snapshot
  -> invalidate affected nodes
  -> release journal
```

Any failure before commit replays the undo journal in reverse and rethrows the original error with the candidate diagnostics attached. Nothing observable changes. There is no partial application and no repair step.

Commit swaps an immutable IR snapshot. It does not recreate live state, and it does not recreate subscriptions. Live state is mutated in place precisely so that identity survives commit, which is what makes an undo journal meaningful.

## 7. Flush

One tick produces one batch.

1. A clock tick or an explicit flush opens a batch.
2. Dirty seeds are collected from playhead invalidation and from mutations since the last flush. Solver members register their solver as dependent, so invalidating a member's length schedules its solver in the affected BFS.
3. The publisher walks the canonical topological order, restricted to the downstream closure of the seeds.
4. Each dirty node composes at most once. For solver nodes (`node.solves`), member timeline states are gathered pre-composition via `memberNode.interpolated()` and supplied under `inputs[plugin].members`. Solver composition is memoized using deep value equality (`equalValues`) over inputs and member states.
5. Input-role edges contribute to the source object before local composition. `fkPlugin` inspects `inputs.solver?.rotations[nodeId]` to override local rotation before computing parent frame extension.
6. Output-role edges merge over the resulting patch after composition.
7. If a node's composition throws, the node publishes an error status, its downstream closure publishes a blocked status, and traversal continues for unrelated branches.
8. Publication is deduplicated: unchanged values, progress, source revisions, and status mean no new revision.
9. Retry metadata is retained only for nodes whose publication failed.
10. The batch closes and subscribers are notified, node subscribers first, then batch subscribers.

Reentrancy is refused, not queued: a flush triggered during a flush returns immediately. A subscriber that mutates the graph schedules work for the next tick.

## 8. Ports

The core accepts capabilities, never implementations.

```ts
interface Clock {
  subscribe(listener: (event: { tick: number; time: number }) => void): () => void;
}

interface Interpolator {
  create(config: unknown): InterpolationTimeline;
}

interface Scheduler {
  schedule(job: () => void, options?: unknown): Cancel;
}
```

Every port ships with a fake, and the fake is the implementation the core test suite uses. Every port also ships a contract test suite that both the fake and each real adapter must pass. A port without a passing real adapter is an unproven interface.

One clock subscription exists per project. Tick numbers are monotonic across detach and reattach cycles, because retry scheduling depends on them never moving backwards.

## 9. Publication contract

A patch is frozen and carries:

- `nodeId`, the qualified id;
- `revision`, monotonic per node;
- `values`, deeply frozen;
- `sourceProgress`, the playhead of the producing node;
- `sourceRevisions`, the revision of every node that contributed;
- `status`, one of `ready`, `blocked`, `error`;
- `diagnostics`, empty for `ready`.

A batch carries its patches, the tick number, the seed set, and a diagnostics summary. Subscribers consume batches or node patches. Nothing in the subscriber contract exposes a Track, a Motion, or a graph object.

## 10. Lifecycle

Teardown is owner-first. The owner removes graph membership, subscriptions, and edges before the contained object releases local resources, so no callback ever fires against a half-detached node.

`dispose` and `destroy` are idempotent and reentrancy-safe: the guard flag is set before any notification, never after. A borrowed runtime is detached by its borrower and destroyed only by its owner. Ownership is decided at construction and never changes during teardown.

A free track authored in `freeTracks` is owned by the project and released with it. A free track adopted at runtime is owned by whoever adopted it, and the project detaches rather than destroys it.

## 11. Diagnostics

One diagnostic shape everywhere:

```ts
interface Diagnostic {
  ruleId: string;
  path: string;
  message: string;
  severity: "error" | "warning";
  ids?: string[];
}
```

At load, any `error` rejects the project and no `warning` does. Warnings are collected on the project and readable after load. They are never thrown and never promoted by a flag. See invariant I-15 and ADR-010.

At runtime, diagnostics accumulate on the project in a bounded ring buffer and surface on the affected patch. Aggregated failures within a single flush are reported as one aggregate error after the pass completes, never by aborting the pass.

## 12. Module layout

```text
packages/
  core/
    src/
      contract/    authored schema constants, public types, diagnostics shape
      domain/      Track, Motion, plugins, immutable value snapshots
      graph/       qualified ids, IR, normalization, validation, ObservationState, GraphBinding
      runtime/     ProjectRuntime, GraphRuntime, GraphPublisher, PatchRegistry
      ports/       Clock, Interpolator, Scheduler and their fakes
      adapters/    GSAP, DOM, browser clock
      errors/
      index.ts     allow-listed public surface
      internal.ts  unadvertised entrypoint, repository use only
    test/
      unit/
      integration/
      contract/    port contract suites run against fake and real
      fixtures/
  react/
    src/           patch and lifecycle hooks only
performance/
  budgets.json
  graph-benchmark.mjs
scripts/
  boundary-scan.mjs
  api-surface-check.mjs
```

TypeScript is required for public contracts and runtime boundaries. Language is consistent within a package. There is no declaration-file seam over untyped JavaScript.

## 13. Public surface

Exported from `@motion5/core`: `Engine`, project loading, `Motion`, `Track`, plugin registration, triggers, patch subscription, the manual clock, port assertion helpers, and the authored contract constants.

Never exported: `GraphRuntime`, `ProjectRuntime`, `GraphBinding`, `GraphPublisher`, `PatchRegistry`, `ObservationState`, normalization helpers. These are reachable only through `@motion5/core/internal`, which is not advertised and carries no stability promise. The export map is an allow list; deep wildcard imports are blocked.

## 14. Deliberately excluded

These are not omissions. They are decisions, and reintroducing any of them requires an entry in [DECISIONS.md](./DECISIONS.md).

- Legacy observation facades and Track observation aliases.
- Observation ownership modes, resolvers, adapter aliases, and parity modes.
- Publisher-off rendering branches and any rendering rollout flag.
- Cross-motion and free-track capability flags. The features ship on, or they do not ship.
- Any bridge object that recreates live state after a commit.
- Graph composition methods on Motion, and graph order application from outside the graph layer.
- Motion host compatibility constructors.
- Track child topology, parent and children ownership, group-host bridging, and composite playback.
- Manual trigger fallbacks for a declared `scroll` or `time` type, and trigger fields that validate but are not honored. A declared type either selects a real driver or fails loudly. See ADR-033.
- Source-text symbol scans as behavioral evidence, prose ratio gates, and non-shrinking file allowlists.

## 15. Why not just clean up motionpath

Because the problems are structural, not cosmetic. Two implementations of one responsibility cannot be formatted away, and a repository with migration branches, rollout flags, and status documents for six overlapping passes carries the cost of every decision it has ever reversed. Starting from the leaf domain and the graph kernel, with ownership fixed before the surface grows, is cheaper than unwinding it. The old repository stays valuable as a behavioral oracle and a source of fixture intent. It is not an architecture template.
