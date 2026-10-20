# Skeldata v5 Lifecycle, Atomicity, and Failure Boundaries

Normative specification of candidate evaluation, private evaluator state, cache integration,
and failure boundaries for skeldata v5. Governs slices B7, C7, D6, E2, and both kinematics caches.

## 1. Candidate and Evaluation Protocol

Every mutation—whether a structural recipe via `SchemaTransaction` or a live value update via
`ValueTransaction`—executes through a single, strictly ordered seven-phase lifecycle:

1. **Private Candidate Build:**
   Construct private staged state via copy-on-write. Retained definitions, active authoring records,
   bindings, and committed cache snapshots remain completely untouched.

2. **Authoring and Operation Validation:**
   Validate candidate syntactic schema, entry declarations, and operation claims before any execution.
   Reject invalid shapes immediately with descriptive diagnostics.

3. **Descriptor and Topology Derivation:**
   Derive candidate immutable topological sort, parent-first point ordering, dependency graph,
   and layout provenance tokens. Lookalike arrays lacking required capabilities are refused.

4. **Preparation and Evaluation:**
   Execute plugin operations; stateful plugins receive immutable `EvaluatorServices` in `init` and `prepare`:
   - `prepare(localEvaluation, state)` runs once, returning immutable prepared data and a proposed state.
   - If declared, `collect` runs once from prepared data and returns its single item.
   - If declared, `fold` runs once from the same prepared data plus preceding fold state, returning a delta and final state proposal.
   - Evaluator cache writes return newly branched `CacheSnapshot` instances passed through proposed state.

5. **Output Validation and Freezing:**
   Validate output values against plugin schemas and ensure all state-owned material and published
   frames are deeply frozen before acceptance. Non-finite numbers or malformed outputs are refused.

6. **Atomic Acceptance and No-Fail Swap:**
   Atomically assign ready outputs and proposed per-entry private states to active runtime references.
   This step consists strictly of in-memory pointer swaps. No provider calls, cache allocations,
   or arbitrary plugin callbacks may execute inside the swap.

7. **Postcommit Delivery and Notification:**
   Dispatch accepted outputs to subscribers, adapters, and renderer bindings. Downstream delivery
   failures do not roll back the accepted state.

## 2. Evaluation Transaction Scope and Baselines

### 2.1 Staged Evaluation Visibility

During Phase 4 (Preparation and Evaluation), downstream entries in the dependency graph read staged
upstream outputs produced by earlier entries in the same candidate pass. This permits valid feed-forward
derivation (e.g., an IK solver reading an upstream root frame, or FK composing against an upstream solve).
However, these staged outputs remain strictly internal to the candidate evaluation pass.

### 2.2 Rejection of Piecemeal Acceptance

Externally observable outputs and private evaluator states are never accepted incrementally or
partially. Either every track, entry, output, and private state proposal in the candidate pass succeeds,
or the entire transaction is rejected. The runtime strictly preserves the three distinct result states:

- `ready`: All computations succeeded and outputs are valid.
- `blocked`: Evaluation is waiting on unresolved dependencies.
- `error`: Evaluation failed validation or threw an unhandled exception.

A failed transaction leaves previous `ready` outputs intact; it is never treated as partial success.

### 2.3 Multiple Staged Operations Within One Transaction

When an operation comprises multiple internal evaluations (e.g., a batched schema recipe editing several
tracks), each intermediate stage executes against private baselines. Intermediate changes accumulate
privately in the candidate descriptor. Active committed state is never mutated to establish these
baselines. If any sub-step fails, all accumulated candidate state is discarded.

## 3. Candidate Rejection and Invariant Preservation

### 3.1 Preserved Observations on Rejection

When a structural or value transaction is rejected at any phase prior to Phase 6 (Acceptance):

- Active authoring records and definitions remain identical to their state before the transaction opened.
- Active value overlays and transient overrides remain undisturbed.
- Graph bindings, entry handles, and handle generation tokens remain valid.
- Active public subscriptions and observers receive no false notifications.
- Active published outputs and inspection payloads remain unchanged.
- **All committed plugin cache snapshots remain untouched.** Neither FK tip caches nor IK solve caches
  permit evicted entries or altered recency from rejected candidate proposals.

### 3.2 Cache State Protection

- Pure lookup inside a cache snapshot is observationally pure and cannot mutate committed recency
  or trigger eviction in the active table.
- Proposed `remember` calls return a new speculative snapshot. If the candidate transaction fails,
  the speculative snapshot is dropped; active entries in committed snapshots are never evicted.

### 3.3 Cold Reset versus State Migration

- Structural changes, entry or plugin replacements, parent/solver rebinding, and topology changes
  require a cold reset of the affected evaluator generation.
- The runtime explicitly forbids migrating private cache state or solver accumulators by member ID
  across structural boundaries.
- Re-ordering or moving entries preserves public handle identity, but the underlying evaluator
  starts cold. Numeric updates compare exact effective keys, whereas structural rebuilds reset cold.

## 4. Provider and Plugin Error Boundaries

### 4.1 Fallible Provider Operations

- Exceptions thrown during `CacheProvider.create`, `CacheSnapshot.lookup`, `CacheSpec.equals`, or
  `CacheSnapshot.remember` are treated as fallible preparation or evaluation failures with contextual
  diagnostics (citing `nodeId`, `entryId`, and the failing operation).
- A provider error is **never** swallowed or converted into a silent cache miss.
- The runtime provides no silent fallback to uncached evaluation when a configured cache provider fails.

### 4.2 Cache Hit Validation

Values retrieved from a cache hit must pass standard publication and plugin boundary validations.
A defective or corrupted cache provider cannot bypass contract validation or inject non-finite numbers.

### 4.3 Evaluator Resource Lifecycle

- Default cache providers store immutable data in encapsulated memory structures; they require no
  custom snapshot-level finalizers.
- Candidate abandonment drops uncommitted references, permitting garbage collection without explicit
  cleanup hooks.
- Storage still shared with committed snapshots must never be freed or modified when discarding a candidate.
- Public disposal of engines, runtimes, and handles is strictly idempotent.

## 5. No-Fail Swap and Postcommit Delivery

### 5.1 Invariant of the No-Fail Swap

Phase 6 (Atomic Acceptance) is designed to be mathematically incapable of failure:

- All validation, formatting, freezing, and allocations occur prior to Phase 6.
- The swap consists entirely of synchronous assignments of reference pointers.
- No plugin code, third-party callbacks, cache writes, or garbage collection triggers are executed.

### 5.2 Postcommit Delivery Failures

- Exceptions thrown by user subscribers, renderer adapters, or external event listeners during
  Phase 7 (Postcommit Delivery) are classified as delivery errors.
- Delivery errors do not roll back the accepted transaction, invalidate committed cache snapshots,
  or revert published outputs.
- Errors are logged or reported through the runtime unhandled exception port according to standard
  repository error policies.

---

## 6. Comprehensive Failure Ledger

The following ledger establishes the normative failure scenarios, preserved observations, and
owning test suites across Phase A–F slices.

### Scenario 1: Cache Provider Creation Failure

- **Trigger:** `CacheProvider.create` throws during evaluator factory initialization.
- **Failure Phase:** Phase 4 (Evaluator Initialization).
- **Preserved Observations:** Evaluator candidate fails to build. Project remains on previous runtime
  generation; existing outputs, handles, and subscriptions remain intact.
- **Owning Test Suite / Slice:** Slice B7 (`packages/core/test/unit/runtime/evaluator-lifecycle.test.ts`).

### Scenario 2: Source Descriptor or Topology Derivation Failure

- **Trigger:** Candidate tree contains missing parent reference, invalid capability, or cycle.
- **Failure Phase:** Phase 3 (Descriptor Derivation).
- **Preserved Observations:** Candidate rejected with diagnostic. Active graph topology and execution
  plan unchanged.
- **Owning Test Suite / Slice:** Slice C7 (`packages/core/test/unit/graph/candidate-acceptance.test.ts`).

### Scenario 3: Early Operation Failure (Prepare Hook Throws)

- **Trigger:** Plugin `prepare` hook throws during local normalization.
- **Failure Phase:** Phase 4 (Preparation).
- **Preserved Observations:** Evaluation halts immediately. Downstream entries do not run. Committed
  evaluator state and previous outputs preserved.
- **Owning Test Suite / Slice:** Slice B7, D6 (`packages/core/test/unit/runtime/staged-state.test.ts`).

### Scenario 4: Partial Operation Sequence (Collect Succeeds, Fold Throws)

- **Trigger:** Entry declares both operations; `collect` succeeds, but `fold` throws during delta calculation.
- **Failure Phase:** Phase 4 (Fold Execution).
- **Preserved Observations:** Collected item is discarded. Proposed state from fold is abandoned.
  Neither collect nor fold outputs enter active state.
- **Owning Test Suite / Slice:** Slice B7 (`packages/core/test/unit/runtime/evaluator-operations.test.ts`).

### Scenario 5: Key Comparison Exception

- **Trigger:** Custom plugin `CacheSpec.equals` throws during cache lookup or collision check.
- **Failure Phase:** Phase 4 (Cache Lookup).
- **Preserved Observations:** Evaluator aborts with contextual error naming entry and plugin. Table
  recency and committed snapshot unchanged. Not treated as a cache miss.
- **Owning Test Suite / Slice:** Slice B7, D6 (`packages/core/test/unit/domain/cache-provider.test.ts`).

### Scenario 6: Cache Remember Failure

- **Trigger:** `CacheSnapshot.remember` throws (e.g., out-of-memory or bounded storage violation).
- **Failure Phase:** Phase 4 (State Proposal).
- **Preserved Observations:** Proposed snapshot dropped. Active snapshot retains committed entries
  and original eviction order.
- **Owning Test Suite / Slice:** Slice B7, D6 (`packages/core/test/unit/domain/cache-provider.test.ts`).

### Scenario 7: Upstream Kinematic Success, Downstream Consumer Failure

- **Trigger:** Upstream FK evaluates and produces valid tip frames, but downstream consumer entry
  fails validation.
- **Failure Phase:** Phase 4 or 5 (Downstream Evaluation / Validation).
- **Preserved Observations:** Entire candidate rejected. Upstream FK cache proposals are discarded;
  retry must execute from previously committed state without false cache hits.
- **Owning Test Suite / Slice:** Slice D6 (`packages/core/test/unit/kinematics/cache-lifecycle.test.ts`).

### Scenario 8: IK Solve Success, Late Candidate Failure

- **Trigger:** IK solver produces a valid `SolveResult` and speculative cache write, but subsequent
  downstream entry or commit check fails.
- **Failure Phase:** Phase 5 (Output Freezing / Commit Validation).
- **Preserved Observations:** Speculative IK solve memo is dropped. Active IK cache retains previous
  solve result. A retry starting after the failure computes identically to an uncached solve.
- **Owning Test Suite / Slice:** Slice D6 (`packages/core/test/unit/kinematics/cache-lifecycle.test.ts`).

### Scenario 9: Output Validation and Freezing Failure

- **Trigger:** Plugin returns non-finite numbers (NaN or Infinity) or unfreezable objects.
- **Failure Phase:** Phase 5 (Validation & Freezing).
- **Preserved Observations:** Rejection occurs prior to Phase 6. No corrupted outputs reach runtime
  references. Last-ready outputs preserved.
- **Owning Test Suite / Slice:** Slice C7, D1 (`packages/core/test/unit/contract/numerics.test.ts`).

### Scenario 10: Candidate Abandonment

- **Trigger:** Caller aborts recipe or unmounts project before commit.
- **Failure Phase:** Precommit Abandonment.
- **Preserved Observations:** Uncommitted candidate references released. Committed state, handles,
  and cache tables unaffected.
- **Owning Test Suite / Slice:** Slice E2 (`packages/core/test/unit/runtime/atomic-batches.test.ts`).

### Scenario 11: Postcommit Delivery Exception

- **Trigger:** External UI subscriber or Three adapter throws inside change listener.
- **Failure Phase:** Phase 7 (Delivery).
- **Preserved Observations:** Transaction remains committed. Outputs and cache snapshots are accepted
  and current. No rollback occurs. Exception dispatched to runtime error handler.
- **Owning Test Suite / Slice:** Slice E7 (`packages/core/test/unit/runtime/subscriber-delivery.test.ts`).

---

## 7. Exact Retry Guarantee

Any retry following a rejected candidate transaction must start strictly from the last accepted
committed state. Because speculative cache snapshots are abandoned upon failure, a retried evaluation
executes with exact parity to an uncached fresh evaluation from the committed baseline.
No phantom cache hits, partially evicted slots, or stale intermediate frames may survive a rejected pass.
