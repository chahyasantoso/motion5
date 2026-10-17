# Cache contract — generic injected memoization

Status: design specification only; runtime implementation and verification remain pending.

This is a shared reference, **not a new slice to execute after F6**. Read it during A1/A3/A6 and before B2/B7. B7 implements the generic seam; D4 and D5 consume it; D6 proves lifecycle integration. The numbered implementation order remains 01–41. This contract extends `00-overview.md`; it does not revive the legacy snapshot's `compose` API or change the authored dialect.

## 1. Decision and boundaries

Use **plugin-owned memoization over a generic, injected, immutable cache port**, with cache snapshots held in proposed evaluator state. Core owns evaluation scheduling and atomic acceptance; plugins own semantic keys, validation, and mathematics; the injected provider owns bounded storage and eviction policy. No separate cache transaction manager is needed.

The primary implementation is a synchronous, bounded, in-memory provider. Supply an interchangeable no-cache provider and prove a third, test-only provider works without core or FK/IK branches. Future non-kinematic plugins must use the same port. A cache miss, disabled cache, or eviction may change cost and references, never accepted numeric/data meaning.

Do not add authored `cache` leaves, a plugin-name switch, global maps, a service locator, a second scheduler, commit callbacks, or automatic memoization of arbitrary collect/fold callbacks. This revision does not promise Redis, asynchronous lookup, persistence, cross-runtime sharing, TTL, nondeterministic warm starts, or partial IK solves.

## 2. Ownership and dependency direction

| Concern | Owner | Must not know |
| --- | --- | --- |
| Generic cache interfaces and conformance contract | Core plugin-facing API | Skeletons, FK/IK names, graph registry |
| Entry/generation lifecycle and acceptance | Existing core evaluator/transaction owner | Cache keys, member topology, solver strategy |
| Default bounded provider and no-cache provider | Generic cache implementation module | Plugin semantics or engine state |
| Runtime provider selection | Application composition root | Per-frame cache contents |
| Effective key/value construction | Each plugin adapter | Runtime internals or arbitrary source lookup |
| Frame composition and solve algorithms | Existing pure math modules | Cache provider, graph, publication |

Core contracts are defined independently of the default implementation. Runtime construction wires the default provider and passes the selected provider as an explicit evaluator service. A custom provider does not require editing the registry, compiler, or built-in plugins. Keep the port small; a new backend is an implementation of an open interface, not another member of a closed backend enum.

Use proposed module locations such as `packages/core/src/domain/cache.ts` for contracts and a separate generic implementation module for providers; confirm boundary conventions in the actual checkout before choosing final paths. Re-export only the plugin-facing port, providers, and evaluator helper needed by supported consumers. Never put provider dependencies into pure frame/solver files.

## 3. Minimal typed cache port

The following is the intended API shape, not a claim these names already exist in the snapshot:

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
}
```

A slot identifies one logical memo cell **inside one private table**. The default provider keeps at most one `(key, value)` per slot. `remember` applies its ordered write batch atomically to a new snapshot; later writes to the same slot win, while replacements preserve that slot's insertion position. Empty writes may return the same snapshot. `maxSlots` is a finite positive integer validated at table creation; the provider never exceeds it. The default evicts the oldest inserted other slot when necessary. Lookup never refreshes order. An alternative conforming provider may evict more aggressively, including always missing. False hits are forbidden.

The default copies its encapsulated map **once per write batch**, not once per point. FK gathers miss writes during its parent-first walk and calls remember once after producing all tentative tips; each point is visited once, so no read of an uncommitted same-pass table entry is needed. IK uses a singleton write batch. Do not add a second single-write API or copy a whole table N times per FK pass: that would add O(NK), worst-case O(N²), storage work for K misses. Count the O(N) map copy and O(K) writes honestly; a tested persistent map is another permitted implementation. A generic consumer needing sequential same-slot updates may apply multiple batches explicitly and owns that cost. Never retain caller-owned mutable write arrays.

`create` returns a fresh empty table. A shared provider object is allowed only as an immutable/stateless factory; each returned table belongs to its evaluator generation. It cannot expose another table's contents even when slot names and numeric keys match. `equals` is pure and supplied by the plugin; providers cannot replace it with reference identity, rounding, or a lossy serialization. A hashing optimization must verify full equality after bucket selection.

`lookup` and `remember` are synchronous and observationally pure. `remember` returns a new snapshot, structurally sharing only immutable internals. Old snapshots, keys, values, and lookup recency remain unchanged. `Object.freeze(new Map())` is not sufficient: the map can still be mutated. Use encapsulated maps copied before writes, immutable entries, or another demonstrated persistent representation; expose no mutable backing store.

Keys and values must be immutable before insertion. TypeScript `readonly` alone does not freeze caller-owned objects. Built-ins retain only validated frozen normalized keys/results and immutable frames. Custom providers and plugins must pass aliasing/conformance tests; no engine API can make arbitrary malicious provider code pure. Keys may contain generation-local identity tokens and cannot be assumed serializable.

The no-cache provider returns `miss` for every lookup and retains no key/value on remember. It implements the **same port**, not a second plugin path. Use an exhaustive `switch` on `CacheLookup.kind`, ending in the repository's `unreachable(never)` helper. This represents cached `undefined` unambiguously for generic users; whether a plugin may publish undefined is a separate publication rule. A ready/error/blocked result remains governed by existing result unions. Do not add a collect/fold/both tag or encode open-ended providers as a discriminated union.

## 4. Injection and evaluator protocol

At runtime construction, accept an optional typed evaluator-services override containing `cache`. If omitted, wire the default bounded provider. Give a per-instance `createEvaluator` factory an immutable instance context plus `EvaluatorServices`. The context contains existing runtime/track/compiler-entry/generation identity and relevant compiled descriptors, not engine or registry access.

Stateless collect/fold definitions remain usable without factories, state parameters, or cache imports. A stateful definition keeps the same finite collect/fold **claims**; its factory owns execution of every operation it declares, without duplicate stateless run callbacks. Core compiles one stateless/factory execution discriminated union and consumes it exhaustively: the factory evaluator when declared, otherwise the stateless callbacks. Reject ambiguous or incomplete runners. Never run both paths, duplicate output declarations, or infer statefulness from the plugin name.

B2/B7 must pin a typed helper binding plugin-local state `S` and prepared local data `P`, without leaking `any` through the public API. A suitable protocol is:

1. The factory creates initial committed state once per candidate entry generation.
2. `prepare(localEvaluation, committedState)` runs once and returns immutable prepared data plus a proposed state. It sees local values, scoped inputs and context, but no fold accumulator or collections.
3. If declared, collect runs once from that prepared data and returns its one item. It cannot read fold state or collections and cannot write hidden evaluator state.
4. If declared, fold runs once from the **same** prepared data plus preceding fold state. It returns a delta plus the final state proposal. It cannot receive its collect result or collection buffers. A collect-only entry uses prepare's state proposal.
5. Validate/freeze outputs and state-owned immutable material before acceptance. Core stores only the final opaque state proposal after the complete transaction succeeds.

This separates preparation from ordered operation dispatch, permits fold-dependent caching inside fold, and avoids a mutable closure remembering what collect did. For both-operation entries, prepare must not emulate collect and feed its output to fold. Shared normalized local data is allowed; an implicit current-output channel is not. Cache writes return new snapshots passed explicitly through prepared data/proposals. No finalizer/commit hook is called at acceptance.

Use an explicit example in B7 to lock these semantics and type-test collect-only, fold-only, both, and stateless definitions. The helper may encapsulate the core's heterogeneous state erasure internally; individual plugins must not cast opaque state or downcast the provider. Do not store mutable current state in a shared plugin-definition object or factory closure.

## 5. Acceptance, identity, and failures

One table lives inside one runtime/track/entry generation; an evaluator can own more than one named private table if needed. FK member IDs and IK's private `solve` cell are local slot names, not global cache namespaces. Repeated same-definition entries, different tracks, identical-ID rigs, and separate runtimes get fresh tables.

Use the existing A6/B7/C7 transaction boundary, not a cache-specific transaction. Evaluate from committed snapshots and accumulate new snapshots privately. Staged downstream reads may consume staged upstream outputs through ordinary graph delivery. After all tracks/operations, validation and freezing succeed, the existing owner accepts output and opaque state together in its no-fail swap. No provider method or arbitrary plugin code runs inside that swap.

On precommit failure, abandon proposals and preserve committed cache contents, published ready output, and existing last-ready/error/blocked semantics. Read hits must not mutate committed recency. Failed proposals must not evict active entries. A successful speculative solve followed by a later fold/freeze failure is not a committed cache hit on retry. Retry starts from the last accepted state and must match cold semantics.

Cold-reset on structural replacement, entry/plugin replacement, relevant source/root/solver/target rebinding, layout or member-generation changes, remove/reinsert, and dispose/recreate. Conservatively resetting a broader affected candidate is allowed. An authored move preserves handle identity, but the rebuilt evaluator starts cold when its execution/layout assumptions are replaced; identity preservation does not imply state migration. Numeric edits use exact effective keys, not structural derivation or unconditional reset. Provider changes are structural runtime reconfiguration: recreate affected evaluator generations; never switch policies inside an active table.

Provider creation, lookup, equality, or remember exceptions are evaluation/preparation failures with entry context, not implicit misses. Validate the actual value returned by a hit at the ordinary plugin/publication boundary; bad providers cannot bypass validation. No silent catch-and-disable path is introduced. Failures, missing/blocked dependencies and invalid/non-finite solver results are not memo values for built-ins.

Default snapshots need no individual disposal: release evaluator-owned references and allow shared immutable storage to be collected. Retire old evaluators only after successful replacement; dispose rejected candidates and keep public disposal idempotent. Follow the existing single resource protocol for any custom evaluator-owned resources; never add snapshot finalizers or dispose storage still reachable from committed snapshots. Postcommit subscriber/adapter errors are delivery errors and do not roll back accepted cache/output.

## 6. Exact equality and numerical policy

Normalize once through the shared readers and build keys from the exact effective request sent to mathematics. Compare finite numeric fields with `Object.is`, including a deliberate distinction between +0 and -0. Preserve JavaScript arithmetic results; do not canonicalize signed zero just for caching. A3 applies the same policy to exact frame equality and accepted in-memory numeric values. Non-finite values are rejected before storage/publication according to the declared reader/validation contract.

No epsilon, rounded coordinates, JSON-stringify equality, partial value bags, or whole upstream object identity as the only semantic key. An identity fast path for already immutable objects is allowed; value comparison handles equal fresh records. Extra conservative key fields may produce misses but cannot omit an input that changes the answer. Tolerances remain appropriate for independent trig/iterative geometry tests, not for skipping work.

Do not key on progress, broad source revision or arbitrary metadata unless mathematics actually consumes it. Do not promise O(K) total FK work or O(1) IK lookup: canonical request construction, exact comparisons, validation, copying, and publication have costs.

## 7. FK consumer: one cell per point

D5 uses the injected port; there is no second FK-specific map policy. A private table's generation binds source/layout/root/solver provenance. For each compiled parent-first point, use a stable local slot and a frozen key containing the **effective parent tip frame** (external source root for the first point), normalized pivot x/y, nonnegative extent, and effective local angle after authored/solved blending. Compare frame x/y/rotation exactly. Keep structural identity in the table generation rather than pretending member ID alone is sufficient.

On hit, reuse the stored immutable tip. On miss, use D1's unchanged pivot-then-extension arithmetic. Compare the result to that point's previous accepted pose; when all fields are exactly equal, retain that old frame object. Append a write for the retained frame under its new key to the local miss batch. After the walk, propose one remember batch and the completed poses together; on an all-hit pass reuse the old table. Previous poses support exact result interning, not a separate storage-policy implementation. Descendants compare against the newly computed/retained parent tip and can hit the committed table when that effective frame is unchanged. Reuse the entire poses record if layout/order/members/tips match and publication allows it.

The default provider requests `maxSlots = pointCount`, so the latest effective input per point is retained. A smaller/evicting/no-cache provider can increase compositions without changing poses. No-cache still computes every visited frame when the evaluator actually runs; retaining exactly equal published frames is allowed. The engine may independently skip an unchanged evaluation, so count evaluator calls separately from cache hits and math calls.

Changing limits, influence, inspection or solver record identity alone does not invalidate FK if final effective inputs are equal. Parent/root/goal changes may propagate broadly; only actual effective inputs determine numerical reuse. Initial implementation may retain O(N) comparisons/container allocation; benchmark it honestly.

## 8. IK consumer: exact whole-solve memoization

D4 owns one private `solve` slot with capacity one in the default provider. A coupled IK solve is one memoized mathematical operation, not independent per-point memo entries. Cache the complete validated `SolveResult` (rotations and the residual/quality data required for inspection), not a fold delta, accumulated output, or only rotations.

Create one immutable canonical `SolveRequest` after C5 dynamic validation. The same request drives equality and the solver adapter; do not separately rebuild two lists of inputs. Its equality must cover:

- Canonical source/layout/root provenance and evaluator/solver implementation/configuration identity, protected by the table generation and immutable tokens.
- The effective anchored first-point tip passed as solver root. Construct it once from the source root and first point; never solve that point again.
- Every ordered non-root solve member's ID, parent link/order, effective pivot, extent, normalized constraint/range variant and endpoints, and effective influence.
- Every mandatory goal association and all frame components actually consumed by the algorithm. Distinguish meaningful optional/variant states; compare the normalized representation used by math.
- Effective flip/bend and every solver policy/strategy option, tolerance, iteration cap, scaling/config choice or seed **if it is an input**. Fixed policies belong to immutable solver-generation identity, not magic unstated assumptions.

Audit `ik-solve.ts`, `ik-member.ts`, `ik-chain.ts`, constraint/goal/seed helpers and retained strategy entrypoints when implementing. In the supplied snapshot, `solveChain(root, members, flip)` reads `SolveMember` IDs, base links, length, pivot, goals, limits and influence; this is evidence for the audit, not permission to freeze the new adapter's key to an old signature. If a new request field is introduced, update equality and single-field-perturbation tests in the same change. Compare genuine request variants exhaustively using the existing never-check pattern.

Do not feed previous cached rotations into the seed. The same effective request must have the same cold/warm/direct/reverse-seek answer, including quality/inspection meaning, regardless of cache history. Retain the current deterministic seed policy. Warm-start algorithms require a separately approved semantic change and are out of scope.

Project the current entry's inspection opt-in from the full cached result **after** lookup; an off-to-on inspection change must not require an otherwise identical solve. If the retained solver truly omits diagnostics unless requested, include that diagnostic-computation option in the request until full-result caching is implemented; never fabricate diagnostics. FK blend weight, elapsed time, raw goal record identity and metadata are excluded unless actually consumed by the solve. A real goal/limit/influence/root/seed/options change causes a miss even if the resulting rotations happen to match.

Validate required result membership, local finite rotations and full result invariants before insertion, and preserve the normal publication validation on hits. Solver exceptions, invalid outputs and upstream blocked/error results do not write the cell. On a hit, emit the current operation's delta from the stored result; do not reuse a previous fold accumulator or overwrite unrelated preceding fields.

## 9. Verification obligations

B7 must supply reusable conformance tests for all providers: fresh empty state, hit/miss including a stored undefined, exact equality (+0/-0), collision/slot isolation, capacity/replacement/eviction, ordered duplicate-slot batches and empty batches, batch atomicity on failure, one-copy-per-batch instrumentation, lookup purity, old-snapshot stability after write, frozen value/key/write-array alias safety, thrown provider operations, and interleaved candidates from one committed state. An evicting provider and no-cache provider must preserve output semantics. Custom providers remain application code and must pass this contract.

Use a tiny non-kinematic plugin, such as memoized text measurement over normalized text/style, to prove the feature is not a skeleton facility. Exercise stateless/collect-only/fold-only/both entries, preceding-fold dependencies included in fold cache keys, two same-definition entries, identical-ID tracks/runtimes, collect success then fold failure, late downstream failure, freeze rejection, retry, replacement and disposal. Changing prior fold data must not hit an incomplete key.

D4/D5/D6/D7 add domain tests:

| Case | Required observation |
| --- | --- |
| Identical effective FK inputs, new source records | Default provider zero extra frame compositions when evaluator runs |
| Leaf-only FK edit | One composition in uncoupled FK-only fixture; exact D3 poses |
| Changed parent inputs with equal resulting frame | Old frame retained; unaffected descendants hit |
| Identical IK request with new records | Zero extra solve calls; same rotations/quality |
| Change each consumed IK field independently | Miss; result matches cache-disabled solve |
| Inspection off/on with full-result cache | Projection changes correctly without another solve |
| Goal/constraint change in a branched rig | Whole solve miss; no false per-point invalidation claim |
| Late failure after FK or IK cache work | Neither proposal accepted; retry from last accepted state |
| Rebind to same numeric data / remove then reuse ID | Cold new generation; no stale provenance reuse |
| Interleaved rigs/runtimes/providers | No state or value alias contamination |
| Capacity eviction / disabled provider / seek histories | Same accepted meaning; only cost/reference differences allowed |

F4 measures provider-disabled versus default and a test alternative on the same new-contract workload. Report lookup comparisons, request building, snapshot writes/copies, slots/retention, FK math, IK calls/time/iterations, validation/publication and end-to-end time separately. F5 generates failure/history sequences; F6 requires all provider and both-domain evidence on the exact release candidate. Plan validation is not runtime or performance verification.

## 10. Architectural rationale and non-goals

**DIP/OCP:** plugins depend on a tiny cache port; the composition root supplies policy. **SRP:** keys and math stay with their owners; storage and acceptance remain separate. **DRY:** one port, one provider conformance suite and one existing acceptance protocol; no parallel FK/IK lifecycle machinery. **LSP:** no-cache/evicting providers preserve accepted meaning. **ISP:** ordinary stateless plugins and math have no cache obligations. **Discriminated unions:** use them for genuine hit/miss and request/result variants, with exhaustive consumers; not as decorative plugin modes or a closed list of injectable implementations.

Do not add dirty-member scheduling, cross-generation migration, multi-request IK LRU, hash-only equality, revision-only shortcuts, automatic dependency inference or a new general transaction framework in this revision. Measure the simple bounded design first.
