# Normative skeldata contract and invariant owners

Status: normative specification for breaking v5 2D skeleton and cache architecture.
Scope: Phase A through Phase F implementation baseline.
Shared references:

- [00-overview.md](../../motion5-implementation-plans/00-overview.md)
- [cache-contract.md](../../motion5-implementation-plans/cache-contract.md)
- [motion5-plugin-api-decisions.md](../../motion5-implementation-plans/motion5-plugin-api-decisions.md)
- [ADR-142](../ADR-142-plugin-structural-api.md)

Rule ids marked _proposed_ are not yet in `packages/core/src/contract/rule-id.ts`; the named
slice adds them.

## 1. Scope, precedence and architecture boundaries

This document records the single normative answer for every invariant across authoring, identity,
operations, topology, numerics, plugin state, memoization, editing, and rendering.

### Precedence

1. This contract and its referenced shared cache contract supersede historical skeldata and PlanX
   proposals.
2. Dialect is schemaVersion 5 clean break. No v4 or legacy migration shims, no alias decoders, no
   tree plugin, and no 3D compatibility bridge: phase G migrates the 3D plugins, generators and
   consumers directly, with a per-space plugin family (`point`/`root`/`join` and
   `point3d`/`root3d`/`join3d`) whose distinct capability names refuse cross-space wiring. One
   temporary exception: from C7 not-yet-migrated compose plugins run through the `legacy-compose`
   execution strategy, and C6 quarantines the legacy kinematic channel; F2 deletes both (ADR-143).
3. Source control is rollback. Rejected syntax fails early and explicitly.

### Architecture boundaries

- Core contract and compiler: own document syntax, identity validation, structural scheduling, and
  atomic candidate acceptance. Core never imports kinematic algorithms or provider types.
- Plugin registry and admission: validate declared operations (`collect`, `fold`), the execution
  strategy (stateless, or stateful `init`/`prepare`) and requirement slots.
- Skeleton derivation: derives static parent-first layouts, bone order, and ID locators from
  authored records.
- Operation executor and runtime: manages per-generation execution, state proposals, and service
  injection.
- Pure mathematics: stateless kinematic formulas (FK trigonometry, IK solvers). Mathematics never
  imports caches, registries, or publication state.
- Injected cache providers: external pluggable storage implementations adhering to the generic cache
  port.

## 2. Invariant inventory and single ownership

Each invariant defines exactly one owner and its earliest validation stage. Validation stages occur
in strict sequence:

1. Shape: syntactic validation of raw document tree.
2. Registry: validation against admitted plugin definitions and declared requirement slots.
3. Derivation: precommit validation of track references, layouts, and topology.
4. Preparation/Evaluation: runtime evaluation, local input normalization, and operation execution.
5. Publication: output payload verification, type freezing, and diagnostics checks.
6. Adapter: presentation and target binding dispatch.

### Authoring invariants

- **A-INV-01: Singleton-map entry array**
  - Invariant: Keyframes arrays contain singleton maps `{ "<entryId>": { plugin, values?, requires? } }`.
  - Earliest stage: Shape.
  - Owner: Core contract validator (`validateKeyframes`).
  - Refusal rule: Non-object entries, empty maps, or multi-key maps refuse immediately.

- **A-INV-02: Track-unique entry identifiers**
  - Invariant: Each `entryId` must be a non-empty string unique within its owning track keyframes array.
  - Earliest stage: Shape.
  - Owner: Core keyframe validator.
  - Refusal rule: Duplicate entry IDs within a track refuse at load.

- **A-INV-03: Group payload shape**
  - Invariant: Inner entry record contains `plugin` (string), optional `values` object, and optional
    `requires` object. No inner `id`, `kind`, `stage`, or `operations` fields are permitted.
  - Earliest stage: Shape.
  - Owner: Core keyframe validator.
  - Refusal rule: Unknown fields refuse as schema violations.

- **A-INV-04: Leaf representation**
  - Invariant: Leaves inside `values` are either monotonic stop arrays `[{ p, v, ease? }]` or static
    scalars (finite number, string, boolean). No `{ stops: [...] }` wrapper is accepted.
  - Earliest stage: Shape.
  - Owner: Authored leaf validator.
  - Refusal rule: Non-scalar, non-array, or wrapped objects refuse as leaf shape errors.

- **A-INV-05: Dependency-only entries**
  - Invariant: Omitted or empty `values` is legal when `requires` is present, representing a pure
    dependency-driven calculation.
  - Earliest stage: Shape.
  - Owner: Core keyframe validator.

### Identity invariants

- **I-INV-01: Disjoint identifier namespaces**
  - Invariant: Entry ID, point member ID, link ID, compile instance key, generation token, and render
    target occupy distinct namespaces.
  - Point member ID: equals outer entry ID of the defining point entry.
  - Link ID: assigned by core compiler for each join entry; separate link namespace.
  - Earliest stage: Derivation.
  - Owner: Skeleton layout compiler.

- **I-INV-02: Point ID uniqueness within skeleton**
  - Invariant: Point IDs must be unique across all chains participating in a resolved skeleton. Link
    IDs must be unique within their join chain. Separate skeletons may reuse point IDs without
    qualification.
  - Earliest stage: Derivation.
  - Owner: Skeleton layout validator.
  - Refusal rule: Overlapping point IDs across joined chains refuse at derivation.

- **I-INV-03: Generation-backed handle identity**
  - Invariant: Runtime handles bind specific generation tokens, not array indices or raw IDs alone.
    Removing and re-inserting an entry creates a new generation; stale handles refuse operation.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Project runtime entry manager.

- **I-INV-04: Reserved delimiter characters**
  - Invariant: Colons and slashes are reserved for compiler tuple encoding and qualified track
    locators. They are forbidden in authored entry IDs, plugin names, and requirement slots.
  - Earliest stage: Shape.
  - Owner: Core identifier validator.

### Operation invariants

- **O-INV-01: Collect, fold, or both**
  - Invariant: A plugin definition declares `collect`, `fold`, or both; it never declares neither.
    Top-level `compose`, `stage`, and `priority` are retired. Until F2, admission still accepts a
    legacy `compose` definition for plugins not yet migrated; from C7 it compiles to the temporary
    `legacy-compose` strategy, and a track mixing it with collect/fold entries refuses
    (`legacy-compose-mixed-track`).
  - Earliest stage: Registry.
  - Owner: Plugin registry admission.
  - Refusal rule: A definition lacking both collect and fold, or declaring retired fields, refuses
    registration.

- **O-INV-02: Stateless collect output**
  - Invariant: Stateless collect is a pure callback returning exactly one renderer-neutral record
    published under the reserved `collect` output. Core stamps `id = entryId` and appends to the
    collection in entry order.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Operation executor (`track-operations.ts`).

- **O-INV-03: Stateless fold delta**
  - Invariant: Stateless fold declares output names and a pure callback returning a top-level delta
    record. The executor safe-merges declared delta fields into preceding fold state
    (last-write-wins).
  - Earliest stage: Preparation/Evaluation.
  - Owner: Operation executor (`track-operations.ts`).

- **O-INV-04: Fold collect reserved name refusal**
  - Invariant: Fold outputs cannot use the reserved output name `collect`. Collect appends to the
    single `collect` output in entry order. Fold + fold merges per-field in authored order.
  - Earliest stage: Registry / Derivation.
  - Owner: Plugin registry and track compiler.
  - Refusal rule: Any fold output named `collect` refuses at admission before evaluation.

- **O-INV-05: Both-operation input isolation**
  - Invariant: An entry declaring both collect and fold executes in strict order: prepare, collect,
    then fold. Collect sees prepared data only; fold sees prepared data plus preceding fold state.
    Collect cannot see fold state; fold cannot see collection buffers or its own collect output.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Operation executor (`track-operations.ts`).

- **O-INV-06: Execution strategy**
  - Invariant: Exactly one strategy exists per definition: `stateless` (pure `collect`/`fold.run`)
    or `stateful` (`init` and `prepare`, optional `dispose`). There is no evaluator factory, no
    operation claim list, and no duplicate runner or runtime fallback path. The compiled
    `ExecutionStrategy` union is consumed by an exhaustive switch.
  - Earliest stage: Registry.
  - Owner: Plugin admission (`plugin-admission.ts`) and execution plan compiler.
  - Refusal rule: `createEvaluator`, `init` without `prepare`, `prepare` or `dispose` without
    `init`, and non-function `collect` or `fold.run` refuse registration.

### Topology and kinematic invariants

- **T-INV-01: Built-in skeleton roles**
  - `point`: collects local numeric coordinates and lengths under `collect`. Declares no
    requirements or frame math. Its `derive` produces `chain`.
  - `join`: connects chains into trees and collects link records under `collect`. Requires a chain
    source; optional parent chain source. Its `derive` produces `joined` (C3).
  - `root`: folds external 2D frame. Optional `frame` slot with no capability; the frame is a
    runtime value read by `readFrame`. Delta is `{ root: frame }`. Its `derive` owns the
    duplicate-root rule.
  - `ik`: folds rotations and optional inspection. Requires skeleton and targets dict.
  - `fk`: folds poses mapping point ID to tip frame `{ x, y, rotation }`. Requires skeleton; optional solver.
  - Earliest stage: Registry.
  - Owner: Built-in plugins package.

- **T-INV-02: Single root per source**
  - Invariant: A source track may contain at most one root entry. The root entry may appear at any
    array position. If omitted, root frame defaults to origin `{ x: 0, y: 0, rotation: 0 }`.
  - Earliest stage: Derivation.
  - Owner: `root` plugin `derive` through `readRootPolicy` (`packages/plugins/src/root-policy.ts`).
  - Refusal rule: More than one root entry refuses during derivation with exactly one
    `derivation-failure` diagnostic. A root-only track is legal and derives no `chain`.

- **T-INV-03: Topology root is first join**
  - Invariant: In a joined skeleton source, the first join entry defines the topology root. Exactly one
    join must omit parent; every subsequent join must specify an earlier join's chain as parent.
  - Earliest stage: Derivation.
  - Owner: Skeleton joined layout compiler.
  - Refusal rule: Multiple parent-less joins or forward-referencing parents refuse at derivation.

- **T-INV-04: Attachment at parent tips only**
  - Invariant: Child chains attach strictly to the tip of the parent chain. Mid-chain attachments or
    nested joined sources as chains are forbidden.
  - Earliest stage: Derivation.
  - Owner: Skeleton joined layout compiler.

- **T-INV-05: Refusal of rooted chain imports**
  - Invariant: A chain imported by a join entry must NOT have a root entry, even if set to origin.
    The joined source's root is the sole external frame.
  - Earliest stage: Derivation.
  - Owner: `join` plugin `validate` (C3), reading `ctx.read("chain", source).rootPolicy`.
  - Refusal rule: Importing a chain containing a root entry refuses structurally at derivation
    (rule id `skeleton-imported-chain-has-root`, registered in `rule-id.ts` and `rule.ts` by C3).

- **T-INV-06: Anchored first point**
  - Invariant: The first point's tip frame is anchored directly from the external root and authored
    values. IK never solves or targets the anchored first point.
  - Earliest stage: Preparation/Evaluation.
  - Owner: IK and FK adapters.

- **T-INV-07: Leaf goal requirement for IK**
  - Invariant: IK requires at least one non-root solve point, and exactly one goal per non-root leaf.
    A root-only track has no skeleton capability, so IK and FK bound to it refuse.
  - Earliest stage: Derivation.
  - Owner: IK solver adapter validator.
  - Refusal rule: IK with no non-root points, missing goals, or goals on non-leaves refuses at derivation.
    No solve member uses rule id `ik-solver-no-solve-members`, registered by C4. `ik3d` (G4) applies
    the same rules through the same ids.

### Numeric invariants

- **N-INV-01: Coordinate conventions**
  - Invariant: 2D plane: screen +x right, +y down. Angles in degrees, clockwise positive.
  - Transformations apply pivot in parent frame, then extension along local +x.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Pure frame mathematics (`domain/frame-math.ts`).

- **N-INV-02: Exact equality and signed zero**
  - Invariant: Exact numeric equality uses `Object.is`. The distinction between +0 and -0 is preserved.
    No epsilon comparisons, coordinate rounding, or lossy serializations for cache keys or frame checks.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Evaluator readers and cache adapters.

- **N-INV-03: Non-finite value refusal**
  - Invariant: Non-finite numeric inputs (NaN, Infinity, -Infinity) refuse publication and storage.
    Missing numeric leaves use declared reader defaults (lengths default 0, weights default 1 clamped
    to [0, 1]).
  - Earliest stage: Preparation/Evaluation.
  - Owner: Input readers and publication validator.

### Evaluator and cache invariants

- **C-INV-01: Generic injected cache port**
  - Invariant: Memoization uses a generic `CacheProvider` port injected via `EvaluatorServices`. Core
    evaluator, scheduling, and transaction dispatch have no knowledge of FK, IK, or kinematics.
  - Earliest stage: Runtime composition.
  - Owner: Composition root and core `EvaluatorServices`.

- **C-INV-02: Cache snapshot isolation**
  - Invariant: Tables belong to specific entry generations' plugin state. `lookup` and `remember` are pure.
    `remember` returns a new immutable `CacheSnapshot`. No mutable maps or shared state across
    entries.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Generic cache provider implementation.

- **C-INV-03: Conformance without semantic drift**
  - Invariant: Provider selection (bounded LRU, no-cache, test spy) affects computational cost only.
    Accepted output numbers and diagnostic meaning remain strictly identical.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Injected cache provider conformance suite.

- **C-INV-04: FK per-point memoization**
  - Invariant: FK memoizes parent tip frame, pivot, extent, and blended angle per point slot in a
    single batch. Unchanged tips are reused; identical recompositions retain prior frame references.
  - Earliest stage: Preparation/Evaluation.
  - Owner: FK stateful plugin (`defineStatefulPlugin`, `D5`).

- **C-INV-05: IK whole-solve memoization**
  - Invariant: IK builds a canonical immutable `SolveRequest` and memoizes the complete validated
    `SolveResult` (rotations and inspection diagnostics) in one slot. No per-member warm starts.
  - Earliest stage: Preparation/Evaluation.
  - Owner: IK stateful plugin (`defineStatefulPlugin`, `D4`).

- **C-INV-06: Precommit proposal abandonment**
  - Invariant: On evaluation failure or invalid candidate state, proposed cache snapshots and outputs
    are discarded. Committed cache snapshots and ready outputs remain untouched.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Existing transaction owner (executor proposes; C7 wires acceptance).

- **C-INV-07: Cold generation resets**
  - Invariant: Structural changes, rebinding, entry removal, or re-insertion cold-reset entry
    generations. Caches are not migrated across generations.
  - Earliest stage: Derivation / Acceptance.
  - Owner: Entry generation lifecycle owner (C7, D6).

### Editing and rendering invariants

- **E-INV-01: Nested value batches**
  - Invariant: Public live value edits use entry-nested syntax `setValues({ <entryId>: { prop: val } })`.
    No flat shortcuts or un-scoped property writes.
  - Earliest stage: Preparation/Evaluation.
  - Owner: Value transaction manager.

- **E-INV-02: Atomic structural recipes**
  - Invariant: Structural mutations (insert, move, remove) compile, derive, evaluate, and validate
    privately as a whole candidate before single atomic acceptance.
  - Earliest stage: Derivation / Acceptance.
  - Owner: Project runtime mutation manager.

- **R-INV-01: Explicit adapter bindings**
  - Invariant: Render adapters explicitly bind track/member targets and fan out published poses. No
    implicit auto-rendering of internal points, links, or roots.
  - Earliest stage: Adapter.
  - Owner: Presentation render adapter.

- **R-INV-02: Per-binding revision scope**
  - Invariant: Revisions are tracked per binding. Newly bound targets initialize immediately, even if
    the evaluated pose matches previous values. Cleanup releases owned targets only.
  - Earliest stage: Adapter.
  - Owner: Render binding lifecycle manager.

## 3. Generic cache port specification

The generic cache contract adheres strictly to the minimal typed port in
`packages/core/src/domain/cache.ts`:

```ts
export type CacheLookup<V> =
  | { readonly kind: "miss" }
  | { readonly kind: "hit"; readonly value: V };

export interface CacheSpec<K> {
  readonly equals: (left: K, right: K) => boolean;
  readonly maxSlots: number;
}

export interface CacheWrite<K, V> {
  readonly slot: string;
  readonly key: K;
  readonly value: V;
}

export interface CacheSnapshot<K, V> {
  lookup(slot: string, key: K): CacheLookup<V>;
  remember(writes: readonly CacheWrite<K, V>[]): CacheSnapshot<K, V>;
}

export interface CacheProvider {
  create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V>;
}

export interface EvaluatorServices {
  readonly cache: CacheProvider;
  readonly [service: string]: unknown;
}
```

### Cache responsibilities and ownership

- Core API: declares cache port interfaces and the `EvaluatorServices` type.
- Generic provider: implements bounded snapshot with single-copy batch writes, and no-cache provider.
- Runtime composition root: selects provider and injects `EvaluatorServices`.
- Stateful plugin: constructs semantic immutable keys, requests slot capacity, and proposes writes.
- Math solvers: compute results purely without referencing cache tables.

## 4. Stateful plugin protocol and execution owners

A plugin definition compiles to exactly one `ExecutionStrategy` variant, `stateless` or `stateful`,
consumed by an exhaustive switch in the operation executor. From C7 until F2 the union has a
temporary third variant, `legacy-compose`, that reproduces `Track.compose` → `plugin.compose`
(replacement chaining, plugin-name input scoping and published keys) for not-yet-migrated plugins,
proven by one parity test per catalog compose plugin:

- **Stateless definition**: declares `collect(entry, ctx)` and/or `fold.run(entry, prior, ctx)`,
  where `entry` is the prepared local evaluation. Pure, immutable, stateless.
- **Stateful definition** (`defineStatefulPlugin<S, P>` in
  `packages/core/src/domain/stateful-plugin.ts`): declares `init(ctx, services)` for initial state,
  `prepare(entry, state, services)` returning `{ prepared, state }`, optional `dispose(state)`,
  optional `collect(prepared, ctx)` returning the single record, and optional
  `fold.run(prepared, prior, ctx)` returning `{ delta, state? }`.

Per entry the executor reads the committed state (by compiler key, then entry id) or calls `init`;
calls `prepare` once; runs `collect`, then `fold.run`; and proposes fold's state when returned, else
`prepare`'s state, under the compiler key. C7 removes the entry-id fallback: committed and proposed
maps become `ReadonlyMap<CompilerEntryKey, unknown>`, and each proposal carries
`origin: "continued" | "initialized"`. `dispose` runs once per entry generation (LIFECYCLE §4.3). Core treats state as opaque. The executor and this
protocol are proven at the seam by `packages/core/test/contract/staged-state-b7.test.ts`; wiring committed
states, acceptance and `dispose` into the runtime transaction is owned by C7 and D6.

Execution owner assignments:

- `B7`: stateful definition seams (`init`/`prepare`), provider implementation, and conformance suite.
- `C6`: quarantine of the legacy kinematic channel behind `isLegacyComposeDefinition`.
- `C7`: runtime wiring of committed/proposed states, atomic acceptance, `dispose`, the temporary
  `legacy-compose` strategy and the augmentable `EvaluatorServices` interface.
- `D4`: IK whole-solve memoization consumer and reusable memo helper.
- `D5`: FK per-point memoization consumer and reusable cached walk helper.
- `G3`, `G4`: `fk3d` and `ik3d` consumers of the same helpers.
- `F2`: deletion of `legacy-compose` and the quarantined channel.
- `D6`: shared dual-cache lifecycle and failure injection proof.

## 5. Invariant review matrix: valid vs minimal invalid

### Case 1: One-point FK vs one-point IK

- Valid one-point FK: Track with one `point` entry and optional `root`. FK composes root frame plus
  authored point coordinates to produce single tip frame pose.
- Minimal invalid one-point IK: IK bound to a one-point chain has no non-root solve member. Refused
  at derivation by C4's `ik.validate` (rule id `ik-solver-no-solve-members`, registered by C4).
- Minimal invalid root-only binding: FK or IK whose skeleton slot binds a root-only track. The track
  is legal but derives no `chain`, so core refuses with `derivation-missing-capability`.

### Case 2: Omitted root vs Rooted chain import

- Valid omitted root: Skeleton chain with `point` entries and no `root`. Frame defaults to origin
  `{ x: 0, y: 0, rotation: 0 }`.
- Minimal invalid rooted import: Joined source imports a chain that authors a `root` plugin entry.
  Refused at derivation by C3's `join.validate` because imported chains must be rootless (rule id
  `skeleton-imported-chain-has-root`, registered by C3).

### Case 3: Non-kinematic slots named targets or root

- Valid non-kinematic slot: Non-kinematic plugin declares requirement slot `targets` with `{ dict: true }`
  or `root` with scalar binding. Registry binds inputs purely as declared data.
- Core and graph do not restrict slot names to kinematic plugins.

### Case 4: Both-operation input isolation

- Valid isolation: Plugin declaring both collect and fold receives prepared data in collect, and
  preceding fold state in fold.
- Invalid coupling: Plugin attempting to read fold state during collect, or accessing collection
  buffers during fold. Prevented by the typed signatures: `collect(prepared, ctx)` and
  `fold.run(prepared, prior, ctx)` receive no other operation's buffers.

### Case 5: Two injected provider instances

- Valid isolation: Two entries or runtimes receive different `CacheProvider` instances or separate
  tables in their own plugin state. No key or slot collision occurs between parallel runtimes or tracks.

### Case 6: Late evaluation failure after domain computation

- Valid precommit rollback: FK and IK compute and propose new cache snapshots. Downstream track throws
  during evaluation or freezing. Entire candidate transaction aborts. Prior committed cache snapshots
  remain active; retry starts cold from committed state.

### Case 7: No-cache and eviction semantics

- Valid equivalence: Workload executed with bounded cache, no-cache provider, and aggressive eviction
  provider yields identical pose coordinates and inspection results down to `Object.is` precision.
