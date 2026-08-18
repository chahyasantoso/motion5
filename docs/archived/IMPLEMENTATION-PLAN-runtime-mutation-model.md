# Runtime Mutation Model — Implementation Plan

> **Audience:** an implementing agent (or engineer) executing this work task by task. This document
> is prescriptive. Where it gives code, that code is the target state, not a sketch.
>
> **Read first, in this order:**
>
> 1. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` — why this work exists.
> 2. `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md` — what was verified and decided.
> 3. This document — how to do it.
>
> **Baseline commit:** all line-level claims were verified against `feat/adopt-motion-track` @
> `751ecbce936b31fc0c3b0101ca2b89ac10b9cac3`. **Before starting, re-read each file you are about to
> change.** If what you find contradicts this plan, stop and report the contradiction rather than
> improvising — the plan is wrong in that case, not the code.
>
> **Scope:** `packages/core` only. Do **not** modify `packages/react` or `apps/react-demo` in any
> work package except where W5-T6 explicitly permits it.

---

## 0. Rules of engagement

Non-negotiable. Violating any of these means the work package is rejected regardless of whether
tests pass.

1. **One work package = one branch = one PR.** Branch names are given per package. Do not combine
   packages. Do not open a long-lived integration branch (`docs/PR-WORKFLOW.md`).
2. **`npm run check` must pass before every commit.** That is `format:check` + `typecheck` + `test`.
   Formatting never shares a behaviour commit — if `prettier` drifts, commit it separately as
   `chore: apply prettier`.
3. **Never weaken, skip, or delete an existing test to make a change pass.** If an existing test
   genuinely encodes the old broken behaviour, say so explicitly in the PR body, quote the
   assertion, and explain why the new behaviour is correct. Only `adopt-destroy-readopt.test.ts`
   and `phase4-dynamic-lifecycle.test.ts` are expected to be behaviourally sensitive to this work;
   see the per-package compatibility notes.
4. **Test-first.** For each task, write the failing test, confirm it fails for the stated reason
   (paste the failure into the PR body), then implement. This repo's convention is evidence-first;
   `docs/TESTING-STRATEGY.md` and the existing `phase0-red-baseline.test.ts` are the precedent.
5. **No new dependencies.** No new top-level `src` directories. No new validation owner — all
   schema validation stays in `packages/core/src/contract/validate-v5.ts`
   (`docs/S4-VALIDATION-OWNER.md`).
6. **Scratch code is disposable.** Reproduction scripts go in `packages/core/test/scratch/`, are run
   with `npx tsx <path>`, and **must be deleted or promoted to a real test before the PR opens.**
   No scratch file may survive a merge.
7. **Commit style:** imperative conventional commits with a module scope, e.g.
   `fix(graph-builder): stop caching failed track collection`.
8. **Every PR body** states: Invariant, Evidence, Ownership, Public surface, Deletions, Status
   (update `docs/SESSION-STATUS.md` in the same PR). Templates are given per package.
9. **Do not fix a finding outside your current package**, even if you spot it. Note it in the PR
   body under a "Deferred" heading.

### Sequencing (hard dependencies)

```
W1  builder cache correctness      (independent — start here)
 ↓
W2  transactional mutation ops     (depends on W1 to be provably correct)
 ↓
W3  identity + freeze on ingest    (depends on W2's pure snapshot helper)
 ↓
W4  motion lifecycle at runtime    (depends on W2's two-phase pattern + W3's store discipline)
 ↓
W5  unified store, handles, replaceTrack, dependantsOf
```

**W1 → W2 is a hard order.** W2 makes rejected mutations retryable; without W1 a retry can _succeed_
with a silently dropped observation edge, which would turn W2 into a bug amplifier. Do not reorder.

### Mapping to the assessment document

The assessment numbered its proposals S1–S4. This plan resequences them so every PR is
independently safe to merge:

| This plan | Assessment   | Findings addressed                        |
| --------- | ------------ | ----------------------------------------- |
| **W1**    | S2.2         | A3, **A5 (new, see §1.0)**                |
| **W2**    | S1           | P1, A1                                    |
| **W3**    | S2.1         | A2                                        |
| **W4**    | S3           | P2                                        |
| **W5**    | S4 + D1 + D3 | P3a, P3b, edit primitive, dependants read |

---

## Facts you will need (verified; do not re-derive)

| Thing                                           | Where                                                                  | Note                                                                                         |
| ----------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `createManualClock`                             | `src/ports/clock.ts`                                                   | Use in tests, not a hand-rolled clock object.                                                |
| `createFakeInterpolator`, `createFakeScheduler` | `src/ports/fakes.ts`                                                   | `scheduler.flush()` drains scheduled work.                                                   |
| `createManualTriggerPort`                       | `src/ports/trigger.ts`                                                 | The **only** trigger `Engine.load()` ever constructs.                                        |
| `deepFreeze`, `clone`                           | `src/contract/validate-v5.ts`                                          | **Module-private today.** W3 must export them.                                               |
| `validateKeyframes`                             | `src/contract/validate-v5.ts`                                          | Already exported; already used by `adopt()`.                                                 |
| `validateTrackShape`                            | `src/contract/validate-v5.ts`                                          | Module-private. W3 wraps it, does not duplicate it.                                          |
| `validateV5`                                    | `src/contract/validate-v5.ts`                                          | Returns a deep-frozen **clone**; input identity is not preserved.                            |
| `buildGraphIR`                                  | `src/graph/ir.ts`                                                      | Uncached reference builder. Used by `validateV5`. **Has none of the cache bugs.**            |
| `IncrementalGraphBuilder`                       | `src/adapters/graph-builder/incremental.ts`                            | Cached. **Always** the one `Engine.load()` uses.                                             |
| `collectTrack`                                  | `src/graph/ir.ts`                                                      | Returns `undefined` on bad id; returns a node with bad edges **omitted** otherwise.          |
| `GraphRuntime.replaceGraph`                     | `src/runtime/graph-runtime.ts`                                         | Already prunes stale members and `registry.evict`s them, and clears `#publisherNodes`.       |
| `PatchRegistry.evict`                           | `src/runtime/patch-registry.ts`                                        | Publishes the terminal `"destroyed"` patch. Safe to call twice (second call finds no patch). |
| `PatchRegistry.remove`                          | same                                                                   | Remount-safe, publishes **nothing**. Used by `detach`/`unmount`.                             |
| Test roots                                      | `packages/core/test/{unit,integration,contract,migration}`             | Integration tests use the real `Engine`.                                                     |
| Gates                                           | `npm run check`, `npm run test:integration`, `npm run test:boundaries` |                                                                                              |

---

# W1 — Graph builder cache correctness

**Branch:** `fix/w1-graph-builder-cache-correctness`
**Files:** `packages/core/src/adapters/graph-builder/incremental.ts` (+ tests)
**Fixes:** A3 (cached failures silently disappear), A5 (below)
**Risk:** low. Pure builder change, no API surface, no runtime behaviour change on the happy path.

### 1.0 Finding A5 — the cache key is incomplete (new; not in either prior document)

Discovered while sequencing this work. The cache is keyed on the `TrackDefinition` object **alone**:

```ts
readonly #trackCache = new WeakMap<TrackDefinition, GraphNode | undefined>();
```

But `collectTrack(track, owner, ownerId, ...)` derives the node id **from the owner**:
`qualifyFreeTrack(track.id)` vs `qualifyMotionTrack(ownerId, track.id)`. So the same track object
under two different owners must produce two different nodes, and the cache cannot express that.

Consequences, both reachable:

1. **A legal project fails to load.** Reusing one track definition object across two motions is
   legal (`validateV5` scopes track-id uniqueness per motion via a per-motion `localIds` set), and
   `buildGraphIR` handles it correctly. `IncrementalGraphBuilder` returns motion A's cached node for
   motion B, `seen.has(node.id)` is then true, and the build fails with a misleading
   `node-duplicate`. `validateV5` accepts the project; `Engine.load()` throws.
2. **Same object adopted twice under different owners** (free, then into a motion) fails the same
   way, with the same misleading diagnostic.

Fix it in the same PR as A3 — same three lines of cache logic, same test file.

### W1-T1 — Red test: cached failure disappears on the second build

**New file:** `packages/core/test/unit/graph/incremental-cache.test.ts`

Against `IncrementalGraphBuilder` directly (no `Engine` needed):

1. Build a project containing a track whose `observes[0]` has a malformed projection
   (`{ pick: [], map: { a: "b" } }` — trips `observation-input-projection`, which `continue`s and
   omits the edge). Assert the result has that diagnostic and no `graph`.
2. Call `build()` **again with the same project object**. Today: diagnostics are empty and
   `result.graph` is defined with the edge silently missing. Assert the corrected behaviour — the
   **same diagnostic is emitted again** and `graph` is still `undefined`.
3. Same two-build shape for an invalid track id (`"a/b"`, trips `track-id`, `collectTrack` returns
   `undefined`, `undefined` gets cached). Today build #2 succeeds with the node silently absent.
4. **A5 case:** one track object referenced by `motions[0].tracks` and `motions[1].tracks`, ids
   `"m1"`/`"m2"`. Assert `build()` produces two nodes, `m1/t` and `m2/t`, and **no**
   `node-duplicate`. Cross-check against `buildGraphIR` on the same project: both builders must
   return the same node ids.

Confirm all four fail before touching `incremental.ts`. Paste failures into the PR body.

### W1-T2 — Implement

In `incremental.ts`:

```ts
// Composite key: the same TrackDefinition object under a different owner is a different node.
// Node ids are derived from (owner, ownerId, track.id), so the object alone cannot key this.
readonly #trackCache = new Map<string, GraphNode>();

#collect(
  track: TrackDefinition,
  owner: "motion" | "free",
  ownerId: string,
  authoredIndex: number,
  diagnostics: Diagnostic[],
): GraphNode | undefined {
  const key = `${owner}|${ownerId}|${track.id}`;
  const cached = this.#trackCache.get(key);
  if (cached !== undefined && cached.track === track) return cached;

  const local: Diagnostic[] = [];
  const node = collectTrack(track, owner, ownerId, authoredIndex, local);
  diagnostics.push(...local);

  // Never cache a failure. `collectTrack` reports problems only on the path that computes the
  // node, so a cached failure is a permanently silent one: the next build gets a hit, emits no
  // diagnostic, and succeeds with the node (or one of its edges) missing.
  if (node === undefined || local.length > 0) {
    this.#trackCache.delete(key);
    return node;
  }

  this.#trackCache.set(key, node);
  return node;
}
```

Then replace **both** inlined cache blocks (the motion-tracks loop and the `freeTracks` loop) with
a single `this.#collect(...)` call each. Delete the old `#trackCache` field and both `has`/`get`/
`set` blocks.

**Design notes, in this order of importance:**

- `cached.track === track` is the identity guard that preserves the original invariant: a _different
  object_ at the same logical id is a cache miss, so a replaced track always rebuilds. This is what
  makes W5's `replaceTrack` (D1) correct.
- A `Map` keyed by string, not a `WeakMap`, is deliberate: the key is no longer an object. Entries
  are bounded by the number of live nodes, and stale keys are overwritten on the next build. If a
  future editor session churns ids heavily, prune in `build()` by intersecting keys with `seen` —
  do **not** add that now.
- Filtering on `local.length > 0` (not `severity === "error"`) is intentional and conservative:
  `collectTrack` only ever emits errors today, and caching a warning would silently drop it on
  every later build. Warnings are cheap to recompute.

### W1-T3 — Regression guard

Prove the cache still _works_, or this task silently becomes "delete the cache":

- Build twice with a valid project and assert the returned `GraphNode` objects are
  **reference-identical** across builds (`toBe`, not `toEqual`).
- Run `npm run benchmark` before and after and record both numbers in the PR body. No regression
  is expected; a large one means the composite key is missing on the hot path.

### W1 acceptance gate

- [ ] All four W1-T1 cases pass; each was seen failing first.
- [ ] Node identity across two valid builds is preserved (W1-T3).
- [ ] `npm run check` green. `npm run benchmark` recorded, no regression.
- [ ] For every project shape in the new test file, `IncrementalGraphBuilder` and `buildGraphIR`
      agree on node ids and on error/no-error. **This equivalence is the real invariant** — state it
      as such in the PR.

### W1 PR body

- **Invariant:** the incremental builder is observationally equivalent to `buildGraphIR` for any
  project, on any build after the first. Failures are never cached; node identity is keyed by
  (owner, ownerId, track.id) plus object identity.
- **Evidence:** `packages/core/test/unit/graph/incremental-cache.test.ts`.
- **Ownership:** diagnostic production stays entirely in `collectTrack`; the builder gains an
  explicit "only cache clean results" rule and no longer has a second, silent path that returns a
  node without its diagnostics.
- **Public surface:** none.
- **Deletions:** the object-keyed `WeakMap` and both inlined cache blocks.

---

# W2 — Transactional mutation operations

**Branch:** `fix/w2-transactional-runtime-mutation`
**Files:** `packages/core/src/runtime/project-runtime.ts` (+ tests)
**Fixes:** P1 (`destroyAdopted` not transactional), A1 (`adopt` has the same defect)
**Risk:** medium. Changes observable failure behaviour. Read the compatibility note before starting.

### The invariant being installed

> **A mutating operation on `ProjectRuntime` either fully succeeds or changes nothing that any
> caller can observe.** After a rejected mutation the runtime must be indistinguishable from its
> pre-call state: same graph, same ids free or taken, same compiled tracks, no patch delivered.

`GraphBinding.replace()` already honours this one layer down. W2 is that discipline propagated up.

### W2-T1 — Red test: the ghost node (P1)

**New file:** `packages/core/test/integration/mutation-transactionality.test.ts`

Use the real `Engine`, real `PluginRegistry` with `transformPlugin` and `fkPlugin`, real
`createManualClock` / `createFakeInterpolator` / `createFakeScheduler`. Start from
`{ schemaVersion: 5, projectId: "x", motions: [] }`.

```
adopt root  (keyframes x, y, rotation)
adopt elbow (keyframes boneLength, boneRotation; observes root as role "input"
             with projection.map → parentX / parentY / parentRotation)
seek(root.id, 1)        // seed a real published patch
subscribe(root.id)      // collect patches
expect(() => destroyAdopted(root.id, owner)).toThrow(/observation-unknown-source/)
```

Then assert, all of which fail today:

1. **No terminal patch was delivered.** `patches.some(p => p.status === "destroyed")` is `false`.
   (Today it is `true` — this is the assertion a React consumer's correctness rests on.)
2. `seek(root.id, 0.7).patches` yields `status: "ready"`, not `"error"`, and no
   `"Cannot read properties of undefined (reading 'compose')"`.
3. A **second** `destroyAdopted(root.id, owner)` throws the _same_ `observation-unknown-source`
   error — not `Node "~/root" is not adopted.`
4. `handle.get(root.id)` is still defined; the node is still in the graph.
5. **The recovery path works:** `destroyAdopted(elbow.id, owner)` succeeds, then
   `destroyAdopted(root.id, owner)` succeeds, and _that_ delivers exactly one `"destroyed"` patch
   for `root`.

### W2-T2 — Red test: burned id on rejected adopt (A1)

Same file. From an empty project:

```
expect(() => adopt({ id: "child", observes: [{ source: "~/missing", role: "input",
                                               projection: { map: { x: "px" } } }] }, owner))
  .toThrow(/observation-unknown-source/)
```

Assert:

1. The id is **immediately reusable**: `adopt({ id: "child", keyframes: { x: ... } }, owner)`
   succeeds. Today it throws `Adopted track "~/child" already exists.`
2. The re-adopted node composes and `seek`s to `"ready"` — proving no leaked compiled `Track` from
   attempt #1 is shadowing it.
3. A cycle case rejects identically and leaves both ids free: adopt `a`, then attempt to adopt `b`
   observing `a` while `a` already observes `b`... since `a` cannot observe a not-yet-existent `b`,
   build the cycle via W5's `replaceTrack` later. **For W2, use the simpler self-reference case**
   (`observes: [{ source: "~/self" }]` on track `self`, trips `observation-self-reference`) and
   assert the id stays free.

### W2-T3 — Make snapshot construction pure

In `project-runtime.ts`, add a type alias and convert the private method to take its input:

```ts
type AdoptedEntry = { track: TrackDefinition; owner: object; motionId?: string };

#projectSnapshot(adopted: ReadonlyMap<string, AdoptedEntry>): ProjectDefinition {
  // Body is today's #buildProjectSnapshot verbatim, except every `this.#adopted`
  // becomes `adopted`. No other change. This method must stay pure: it reads its
  // argument and `this.#project`, and mutates nothing.
}
```

Delete `#buildProjectSnapshot()`. Use `AdoptedEntry` as the value type of `#adopted` too.

This is the enabling step. "Just move the `replaceGraph` line up" is **not possible** — the
candidate for a destroy is "the project without this node", which today can only be expressed by
mutating `#adopted` first.

### W2-T4 — `destroyAdopted`: validate, then commit

```ts
destroyAdopted(nodeId: string, owner: object): void {
  this.#assertLive();
  const adopted = this.#adopted.get(nodeId);
  if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
  if (adopted.owner !== owner)
    throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);

  // ---- phase 1: pure candidate. Throws before anything live is touched. ----
  // A surviving node that still observes `nodeId` makes this candidate invalid
  // (observation-unknown-source), which is exactly the "reject while a dependant exists"
  // rule. It needs no dependency tracking of its own and cannot drift from the graph.
  const candidate = new Map(this.#adopted);
  candidate.delete(nodeId);
  this.#graph.replaceGraph(this.#projectSnapshot(candidate));

  // ---- phase 2: commit. Nothing below may throw. ----
  this.#adopted.delete(nodeId);
  this.#instances.delete(nodeId);
  // evictNode, not unmount: unmount routes through detach -> registry.remove, which is
  // remount-safe and publishes nothing. Destruction must be visible on the wire.
  // replaceGraph already evicted this node if it was a member; evict is idempotent, and
  // this call is what frees #nodeListeners for a node destroyed while unmounted.
  this.#graph.evictNode(nodeId);
  this.#disposeTrack?.(nodeId);
  if (adopted.motionId !== undefined) this.#removeMotionTrack?.(adopted.motionId, nodeId);
}
```

**Verify while implementing:** `GraphRuntime.replaceGraph`'s pruning loop mutates `this.#members`
while iterating it (`for (const id of this.#members) { ... this.#members.delete(id) ... }`). That
is legal for a `Set` in JS and is pre-existing behaviour — do not "fix" it in this PR, but add an
assertion that the terminal patch fires **exactly once** per destroy, since W2 now routes eviction
through both `replaceGraph` and the explicit `evictNode`.

### W2-T5 — `adopt`: validate, then commit

Replace the mutation section (keep every existing check above it — `#assertLive`, motion existence,
id collision, `validateKeyframes` — unchanged and still first):

```ts
const candidate = new Map(this.#adopted);
candidate.set(id, { track, owner, motionId });

// ---- phase 1 ----
try {
  this.#compileTrack?.(track, id);
  this.#graph.replaceGraph(this.#projectSnapshot(candidate));
} catch (error) {
  // compileTrack is the one pre-commit side effect that cannot be deferred (the compose
  // closure needs it before the first flush). Undo it so the id is left completely free.
  this.#disposeTrack?.(id);
  throw error;
}

// ---- phase 2 ----
this.#adopted.set(id, { track, owner, motionId });
this.mount(id);
if (motionId !== undefined) this.#addMotionTrack?.(motionId, id, track.duration);

return Object.freeze({ id, track });
```

### W2-T6 — Make the post-commit phase non-throwing by construction

The three calls after `replaceGraph` in `adopt` can each still throw: `mount()` on
`already mounted`, `addMotionTrack` on `Unknown motion` / `Unknown graph node`, and
`Motion.addTrack` on `Duplicate Motion track id`. A throw there leaves a committed graph with
incomplete bookkeeping — the same class of bug W2 exists to kill.

Add these as **pre-checks before phase 1**, alongside the existing id-collision check:

```ts
if (this.#instances.has(id)) throw new TypeError(`Node "${id}" is already mounted.`);
```

The `Motion`-level duplicate-id case cannot be checked from `ProjectRuntime` (it has no view of
`Engine`'s motions). Note it in the PR under Deferred and cover it in **W4**, which introduces the
motion store that makes the check possible. Do not add a hook for it here.

### W2-T7 — Invariant test per operation

Add to the same test file, as a shared helper so it cannot rot:

```ts
function snapshotState(handle) {
  /* graph order, adopted-id set, get() per id, patch log length */
}
```

For each rejecting mutation: capture, attempt, expect throw, capture again, `expect(after).toEqual(before)`.

### W2 compatibility notes — read before you start

- `packages/core/test/integration/adopt-destroy-readopt.test.ts` exercises
  adopt → destroy → re-adopt on the **happy path** with no dependants. W2 must not change it. If it
  fails, your phase-2 ordering is wrong — most likely you dropped `evictNode` and lost the terminal
  patch. **Do not edit that test.**
- It re-adopts the _same_ `armTrack` object after destroying it. That works and must keep working.
  It also means W1's `cached.track === track` guard is load-bearing here.
- `phase4-dynamic-lifecycle.test.ts` and `handle-adoption.test.ts` also cover this surface. Run
  `npm run test:integration` early and often.

### W2 acceptance gate

- [ ] Every W2-T1 and W2-T2 assertion passes; each was seen failing first, with the failure quoted.
- [ ] `snapshotState` before/after equality holds for every rejecting mutation (W2-T7).
- [ ] Exactly one `"destroyed"` patch per successful destroy. Zero per failed destroy.
- [ ] No existing integration test modified. `npm run check` green.

### W2 PR body

- **Invariant:** `adopt` and `destroyAdopted` are atomic. A rejected mutation leaves the runtime
  byte-for-byte reusable, and "reject a destroy while a live dependant still observes the node" is
  enforced by graph validation rather than by bespoke bookkeeping.
- **Evidence:** `packages/core/test/integration/mutation-transactionality.test.ts`.
- **Ownership:** `ProjectRuntime` now owns the commit decision explicitly and delegates validity to
  `GraphBinding`, which already owned it. `#projectSnapshot` becomes a pure function, so no method
  both derives the candidate and mutates the state it derives from.
- **Public surface:** unchanged. Failure _modes_ change: previously-poisoned ids now stay usable.
- **Deletions:** `#buildProjectSnapshot()`.

---

# W3 — Identity and freeze on ingest

**Branch:** `fix/w3-adopted-track-immutability`
**Files:** `packages/core/src/contract/validate-v5.ts`, `packages/core/src/runtime/project-runtime.ts` (+ tests)
**Fixes:** A2 (adopted tracks are never frozen, so the identity-keyed cache invariant is unenforced)
**Risk:** medium-low. Touches the validation owner; watch the `adopt()` cost.

### W3-T1 — Red test

**New file:** `packages/core/test/integration/adopted-track-immutability.test.ts`

1. `adopt` a track, then mutate the caller's original object in place
   (`track.keyframes.x.stops[1].v = 999`). Assert either a `TypeError` (frozen) **or** that a
   subsequent `seek` composes the original value. Today: the mutation lands and the composed value
   silently disagrees with the cached `GraphNode`.
2. Assert `Object.isFrozen(result.track)` and that `result.track` is what the runtime stores.
3. Assert a structurally invalid `observes` (`observes: "nope"`) is rejected by `adopt()` with an
   `observes-shape` diagnostic, not deferred to the graph builder.

### W3-T2 — Export a single-track validator from the validation owner

In `validate-v5.ts` — reuse the private `validateTrackShape`, `clone`, `deepFreeze`. **Do not
duplicate their logic and do not create a new file:** `docs/S4-VALIDATION-OWNER.md` mandates one
validation owner.

```ts
export interface TrackValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: TrackDefinition | null;
}

/**
 * Validate and freeze one runtime-supplied track at the same trust level as an authored one.
 *
 * Returns a deep-frozen clone. The clone is deliberate: the graph builder caches nodes by track
 * identity, so the runtime must key on an object the caller cannot mutate afterwards.
 *
 * Project-level rules (perspective, cross-track duplicates, graph shape) are NOT applied here.
 * They belong to the candidate build in ProjectRuntime, which sees the whole project.
 */
export function validateTrackDefinition(track: unknown, path: string): TrackValidationResult {
  const diagnostics: Diagnostic[] = [];
  const ok = validateTrackShape(track, path, new Set<string>(), diagnostics);
  const valid = ok && !diagnostics.some(({ severity }) => severity === "error");
  return {
    valid,
    diagnostics: Object.freeze(diagnostics),
    value: valid ? deepFreeze(clone(track) as TrackDefinition) : null,
  };
}
```

Note `validateTrackShape` already calls `validateKeyframes`, so this **subsumes** `adopt()`'s
current inline `validateKeyframes` call. Do not run both.

### W3-T3 — Use it in `adopt()`

Replace the inline `validateKeyframes` block with `validateTrackDefinition(track, \`adopt(${track.id})\`)`,
throw on `!valid`using the existing`ruleId at path: message`join format, and **use the returned
frozen clone everywhere downstream** —`#compileTrack`, `#adopted`, the snapshot, and the returned
`{ id, track }`. The original argument object must not be referenced after validation.

### W3-T4 — Document the identity consequence

Since `adopt()` now stores a clone, adopting the same object twice is a builder cache **miss**
(different object). That is correct and cheap. Add a comment saying so at the `#adopted.set` call,
and assert in the test that re-adopting the same source object after a destroy still works — the
existing `adopt-destroy-readopt.test.ts` depends on it.

### W3 acceptance gate

- [ ] W3-T1 passes; the in-place-mutation hole is closed.
- [ ] `adopt-destroy-readopt.test.ts` unmodified and green.
- [ ] Runtime-created and authored tracks are validated by the same code path. State this in the PR.
- [ ] `npm run benchmark` recorded. If clone+freeze is measurable on an adopt-heavy path, note it
      and open a follow-up for a structural-only fast path. **Do not** add an opt-out flag in this PR.

---

# W4 — Motion lifecycle at runtime

**Branch:** `feat/w4-runtime-motion-lifecycle`
**Files:** `packages/core/src/runtime/project-runtime.ts`, `packages/core/src/engine.ts` (+ tests)
**Fixes:** P2 (no runtime-callable way to create or destroy a `Motion`)
**Risk:** medium-high. New public surface. Get the review on the signature before writing tests.

### 4.0 Two things to know before you design

1. **`Engine.load()` never reads `motionDefinition.trigger`.** Every motion is built with
   `createManualTriggerPort()`. `trigger.type` (`"scroll" | "time" | "manual"`) is required by the
   schema and inert in core. Therefore: `addMotion` accepts `trigger` for schema fidelity, wires a
   manual port exactly as `load()` does, and its docstring **must** say scroll/time are not yet
   driven. Do not add a scroll or time driver in this package.
2. **`#projectSnapshot` iterates `this.#project.motions`.** The `Unknown motion` guard in `adopt()`
   is load-bearing, not merely defensive: a track whose `motionId` has no entry to merge into is
   silently dropped from every candidate. So `addMotion` **requires** `ProjectRuntime` to own a
   mutable motion store. That store is the W5 slice this package must pull forward; keep it minimal.

### W4-T1 — Motion store in `ProjectRuntime`

```ts
readonly #motions = new Map<string, MotionDefinition>();
```

Seed it in the constructor from `project.motions` (**same object references** — they are already
frozen by `validateV5`; cloning them would throw away every builder cache hit). Then:

- `#projectSnapshot(adopted, motions)` maps over the passed `motions` map instead of
  `this.#project.motions`. Keep it pure: **both** varying inputs are parameters.
- `adopt()`'s guard becomes `if (!this.#motions.has(motionId)) throw new TypeError(...)` — message
  unchanged.
- `#projectSnapshot` still spreads `...this.#project` for `schemaVersion`, `projectId`,
  `perspective`, `templates`. That stays until W5.

### W4-T2 — Two new hooks, mirroring the four that exist

In `ProjectRuntimeOptions`:

```ts
readonly createMotion?: (definition: MotionDefinition) => void;
readonly destroyMotion?: (motionId: string) => void;
```

Store them as `#createMotion` / `#destroyMotion` exactly like `#addMotionTrack` / `#removeMotionTrack`.
This is the fifth and sixth hook on an established pattern, not a new seam.

### W4-T3 — `addMotion`, two-phase per W2

```ts
addMotion(definition: MotionDefinition): { readonly id: string } {
  this.#assertLive();
  if (this.#motions.has(definition.id))
    throw new TypeError(`Motion "${definition.id}" already exists.`);

  // Motions are created empty. Tracks join via adopt(track, owner, { motionId }).
  const accepted: MotionDefinition = { ...definition, tracks: [] };

  // phase 1 — the builder validates the id (assertAuthoredMotionId) and duplicates
  // (motion-duplicate) for us; no bespoke id validation here.
  const candidate = new Map(this.#motions);
  candidate.set(accepted.id, accepted);
  this.#graph.replaceGraph(this.#projectSnapshot(this.#adopted, candidate));

  // phase 2
  this.#motions.set(accepted.id, accepted);
  this.#createMotion?.(accepted);
  return Object.freeze({ id: accepted.id });
}
```

If `definition.tracks` is non-empty, **reject it** with a clear message rather than silently
dropping the tracks. Creating a motion with tracks in one call is a compound operation; it is not
in scope and would need its own atomicity story.

### W4-T4 — `destroyMotion`, two-phase

```ts
destroyMotion(motionId: string): void {
  this.#assertLive();
  if (!this.#motions.has(motionId)) throw new TypeError(`Unknown motion "${motionId}".`);

  // Settled constraint (see the assessment, D4): no cascade. A motion that still owns tracks
  // is not destroyable; the caller removes its tracks first.
  const owned = [...this.#adopted.values()].filter((e) => e.motionId === motionId);
  if (owned.length > 0)
    throw new TypeError(
      `Motion "${motionId}" still has ${owned.length} track(s). Remove them before destroying it.`,
    );

  const candidate = new Map(this.#motions);
  candidate.delete(motionId);
  this.#graph.replaceGraph(this.#projectSnapshot(this.#adopted, candidate));

  this.#motions.delete(motionId);
  this.#destroyMotion?.(motionId);
}
```

**Also handle schema-declared tracks.** Until W5 collapses the stores, a motion seeded from
`load()` still carries its authored `tracks` inside its `MotionDefinition`, so removing it removes
those nodes from the candidate too. `observation-unknown-source` will reject the destroy if
anything still observes them — correct and free — but a _successful_ destroy would drop nodes
without evicting them or disposing their tracks. **For W4, reject `destroyMotion` outright when
`this.#motions.get(motionId)!.tracks.length > 0`,** i.e. only runtime-created (empty) motions are
destroyable. Document the limitation; W5 lifts it. Add a test asserting the rejection.

### W4-T5 — `Engine.load()`: extract, do not duplicate

Lift the existing per-motion loop body into a local closure and call it from both places:

```ts
const buildMotion = (definition: MotionDefinition, entries: MotionTrackEntry[]): Motion => {
  const triggerPort = createManualTriggerPort();
  let motion: Motion;
  motion = new Motion({
    clock: this.#options.clock,
    scheduler: this.#options.scheduler,
    tracks: entries,
    trigger: triggerPort,
    disposeTracks: false, // ProjectRuntime owns track disposal
    listenToClock: false, // GraphRuntime's onClockTick fans out to every motion
    invalidate: () => {
      const currentIds = motion.tracks.map((t) => t.id);
      if (currentIds.length > 0) runtime.invalidate(currentIds);
    },
    stagger: definition.stagger,
  });
  motion.play();
  return motion;
};
```

It closes over `clock`, `scheduler`, and the already-hoisted `let runtime` — that late-binding
pattern is exactly what the hook needs, so no new plumbing. Wire the hooks:

```ts
createMotion: (definition) => { motions.set(definition.id, buildMotion(definition, [])); },
destroyMotion: (motionId) => {
  const motion = motions.get(motionId);
  if (motion) { motion.dispose(); motions.delete(motionId); }
},
```

**Verified safe, do not re-litigate:** an empty `Motion` is legal (constructor loop is a no-op,
`#totalDuration()` floors at `1`, `invalidate` is guarded by `currentIds.length > 0`);
`onClockTick` iterates `motions.values()` so a new motion is driven from the next tick;
`disposeTracks: false` means disposing a motion does not dispose tracks `ProjectRuntime` still owns;
and `motion.play()` is **required** — without it `Motion.signal` and `onTick` both silently no-op
because `#scheduleProgress` returns early unless `#playing` and `state === "mounted"`.

### W4-T6 — Extend `ProjectHandle`

Add `addMotion(definition): { readonly id: string }` and `destroyMotion(motionId): void` to the
`ProjectHandle` interface and `createHandle`, delegating straight through. Keep the alphabetical /
grouped ordering already used there. `signal(motionId, ...)` already throws `Unknown motion` for a
destroyed motion — add a test asserting that, so destroy is observable through the existing surface.

### W4-T7 — Tests

**New file:** `packages/core/test/integration/runtime-motion-lifecycle.test.ts`. From
`{ schemaVersion: 5, projectId: "editor", motions: [] }`:

1. `addMotion({ id: "scene", trigger: { type: "manual" }, tracks: [] })` succeeds.
2. `adopt(track, owner, { motionId: "scene" })` succeeds — **this is the exact call that throws
   `Unknown motion "..."` today and is the headline fix.**
3. `signal("scene", { type: "manual", progress: 0.5 })` + `scheduler.flush()` → a `"ready"` patch
   with interpolated values.
4. `destroyMotion("scene")` while it holds a track → throws; after `destroyAdopted` → succeeds.
5. After destroy, `signal("scene", ...)` throws `Unknown motion`, and a clock tick does not throw.
6. `addMotion` with a duplicate id → throws; with a malformed id (`"a/b"`, `"~"`) → throws.
7. Two motions with staggered tracks advance independently (`stagger` and `#position` are
   per-motion) — this is the real reason a runtime `Motion` is worth creating.
8. **Atomicity:** a rejected `addMotion` leaves no motion in the store and no orphan `Motion` in
   `Engine` — assert a subsequent `addMotion` with the same id succeeds.
9. `dispose()` after runtime-created motions exist tears down cleanly (`disposeComposition`
   iterates `motions.values()`).

### W4 acceptance gate

- [ ] All nine W4-T7 cases pass.
- [ ] Zero duplicated `new Motion({...})` call sites in `engine.ts` — grep to confirm exactly one.
- [ ] `addMotion`'s docstring states that `trigger.type` is inert in core today.
- [ ] `npm run check` and `npm run test:boundaries` green (new public surface crosses the package
      boundary the scan guards).
- [ ] `docs/DECISIONS.md` gains one entry: _motions are created empty; no cascade on destroy._

---

# W5 — Unified store, capability handles, non-destructive edit

**Branch:** `feat/w5-unified-mutation-surface`
**Fixes:** P3a, P3b, the edit primitive (D1), the dependants read (D3)
**Risk:** high. This is the API-shaping package. **Get the signatures reviewed before implementing.**

If schedule pressure appears, W5-T5 (`dependantsOf`) and W5-T4 (`replaceTrack`) are independently
valuable and can be split into their own PRs. W5-T1..T3 cannot be split from each other.

### W5-T1 — Ingest schema content into one store (P3a)

In the `ProjectRuntime` constructor, ingest every `project.motions[].tracks[]` and
`project.freeTracks[]` entry into the same store `adopt()` writes to. After ingestion,
`this.#project` contributes only `schemaVersion` / `projectId` / `perspective` / `templates`.

Three hard requirements:

1. **Preserve object identity.** Store the references from the already-frozen `acceptedProject`.
   Do **not** clone them (W3's clone applies to _caller-supplied_ tracks only). Cloning here throws
   away every builder cache hit and turns `load()` into a full rebuild.
2. **Ingestion must not auto-mount.** `Engine.load()` today eagerly _compiles_ every node
   (`for (const nodeId of nodes.keys()) compile(nodeId)`) and mounts none; consumers call
   `handle.mount(nodeId)` themselves, and `apps/react-demo` relies on that. Auto-mounting would
   silently make every node a flush member and change what every existing caller's first tick
   publishes. Compile-eager / mount-explicit is preserved exactly.
3. **Ingested entries need an owner.** Use a single private sentinel object per runtime
   (`readonly #schemaOwner = {}`) so schema content is uniformly represented but not destroyable by
   an arbitrary caller holding some other `owner`. Under W5-T3's handle model, no handle is ever
   minted for ingested content, so it is reachable only through an explicit
   `handleFor(nodeId)`-style lookup — **do not add that lookup in this PR.**

**Name the tradeoff, as the problem statement asks.** Today schema content is _structurally_
undeletable: no code path can remove it. After the collapse it is deletable subject only to op
gating. That is right for an editor and wrong for a fixed-schema consumer. It goes in
`docs/DECISIONS.md` as a deliberate decision with that sentence, not as an emergent side effect.

**Then:** `get project()` becomes a lie (it returns the frozen original, not current state).
Replace it with `snapshot(): ProjectDefinition` built from `#projectSnapshot(...)` — one line once
W2-T3 landed, and it is what an editor needs for save/export anyway. Update every reader; grep for
`.project` across `packages/`.

### W5-T2 — Lift W4's `destroyMotion` limitation

With one store, a motion's tracks are store entries, so `destroyMotion` can apply the same rule as
W4 (reject while it owns tracks) uniformly to authored and runtime-created motions. Delete the
`tracks.length > 0` special case from W4-T4 and update its test.

### W5-T3 — Capability handles instead of `owner` (P3b)

```ts
export interface TrackHandle {
  readonly id: string;
  /** The frozen definition the runtime is keyed on — not necessarily the object you passed in. */
  readonly track: TrackDefinition;
  /** Idempotent. A no-op once this node instance is gone. */
  remove(): void;
  /** Non-destructive edit. See replaceTrack. */
  replace(next: TrackDefinition): void;
}

addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
```

The precedent is already in this codebase: `PatchRegistry.subscribeNode` returns an unsubscribe
closure rather than requiring a caller-held token. Keep `id` on the handle — `mount`, `unmount`,
`seek`, `subscribe`, and `get` are all id-based and stay that way.

**Required: stale handles must be inert, not dangerous.** Ids are freed and immediately reusable, so
this is a live ABA hazard — hold a handle, `remove()`, re-create the same id, then call the stale
handle's `remove()` again. An id-scoped capability would destroy the _new_ node. Mint a private
monotonic token per node instance, store it on the entry, and make `remove()` / `replace()`
**no-ops** (not throws) when the token no longer matches. Idempotent removal is also better editor
ergonomics than today's `not adopted` throw on double-destroy.

**Test this explicitly:** the ABA sequence must leave the new node alive.

### W5-T4 — `replaceTrack`: the edit primitive (D1)

**This overrides the problem statement's destroy-and-recreate lean.** Two reasons, both verified:
`"destroyed"` is contractually terminal (`v5.ts`: _"the node has been evicted from the graph and
will never publish again"_) and React consumers tear down on it, so using it as an edit
notification unmounts and remounts the DOM element on every keyframe nudge; and
`GraphBinding.#applyDelta` diffs by node id and `edgeKey`, so an unchanged id means no
`removeNode`, no eviction, no terminal patch, and only genuinely changed edges applied.

```ts
replaceTrack(nodeId: string, next: TrackDefinition): void {
  // Renaming is a destroy plus a create, and that legitimately produces a terminal patch.
  // Reject any `next` that does not qualify to the same node id.
  //
  // phase 1 — a new object identity forces a fresh collectTrack, so the builder cache stays
  // correct by construction (W1's `cached.track === track` guard).
  const candidate = new Map(this.#store);
  candidate.set(nodeId, { ...entry, track: validated });
  this.#graph.replaceGraph(this.#projectSnapshot(candidate, this.#motions));

  // phase 2 — replaceGraph already cleared #publisherNodes, so the compose closure is
  // re-resolved against the recompiled track.
  this.#store.set(nodeId, { ...entry, track: validated });
  this.#disposeTrack?.(nodeId);
  this.#compileTrack?.(validated, nodeId);
  this.#graph.invalidate([nodeId]);   // a normal "ready" patch on the same revision chain
}
```

Validate `next` through W3's `validateTrackDefinition`. Test: values change, revision increments,
**no** `"destroyed"` patch, subscribers survive, and an invalid edit (cycle, unknown source) is
rejected with the old definition still live and composing.

### W5-T5 — `addObserve` / `removeObserve` are sugar, not new primitives (D2)

An edge is **not** a first-class entity: it lives in `TrackDefinition.observes` on the observer, and
`collectTrack` derives `GraphEdge`s from it with `observerId` fixed to that node. So the capability
to add or remove an edge _is_ the capability to replace the observer's track. Implement both as thin
wrappers over `replaceTrack` on the observer. This dissolves the "can an edge be owned?" question
and removes any need to collapse edge storage separately.

### W5-T6 — `dependantsOf` for editor UX (D3)

The rejection rule is right and free, but the diagnostic an editor receives is
`observation-unknown-source at ~/elbow: Unknown observation source "~/root"` — phrased from the
builder's perspective, naming the node the user did not touch, calling a source "unknown" when the
actual mistake was deleting something still in use. That string must not reach a confirmation dialog.

The committed `GraphIR` already holds every edge, so this needs no new bookkeeping:

```ts
dependantsOf(nodeId: string): readonly string[] {
  return this.#graph.graph.nodes
    .filter((n) => n.edges.some((e) => e.sourceId === nodeId))
    .map((n) => n.id);
}
```

Expose it read-only on `ProjectHandle` so the editor can pre-flight, while the transactional destroy
remains the actual enforcement. **Never** use it _as_ the enforcement — a second dependants owner
would drift from the graph.

### W5-T7 — Deprecate, do not break

Keep `adopt` / `destroyAdopted` as thin wrappers over `addTrack` / `handle.remove()` for one
release, marked `@deprecated` with the replacement named. `apps/react-demo` passes
`useRef({}).current` as `owner` and must keep working untouched in this PR. Migrating the demo is a
separate PR (the only place W5 may touch `apps/`), and only after core is green.

### W5 acceptance gate

- [ ] Every existing integration test passes **unmodified**. That is the whole safety argument for
      the store collapse.
- [ ] `#project` is read only for `schemaVersion` / `projectId` / `perspective` / `templates` —
      grep to prove it.
- [ ] Ingest preserves object identity: assert `GraphNode` reference stability across a mutation
      that does not touch a given node.
- [ ] The ABA stale-handle test passes.
- [ ] `replaceTrack` delivers zero `"destroyed"` patches.
- [ ] `docs/DECISIONS.md` records: store collapse tradeoff; ingest does not auto-mount; handles
      replace `owner`; `replaceTrack` over destroy-and-recreate; edges are not independently owned.
- [ ] `docs/ARCHITECTURE.md` mutation section updated; `npm run test:boundaries` green.

---

## Appendix A — Reproductions that must fail before you start

Put these under `packages/core/test/scratch/`, run with `npx tsx <path>` from the repo root, and
**delete them before opening any PR.** They exist to confirm the baseline, not to ship.

**A1 — P1 ghost node.** The full script is in `docs/PROBLEM-STATEMENT-runtime-mutation-model.md`.
Expected today: `threw: observation-unknown-source ...`, then `second destroyAdopted: threw: Node
"~/root" is not adopted.`, with a `"destroyed"` patch already delivered to the subscriber.

**A2 — A1 burned id.** Empty project; `adopt({ id: "child", observes: [{ source: "~/missing", role:
"input", projection: { map: { x: "px" } } }] }, owner)` → throws; retry the same id with a valid
definition → today throws `Adopted track "~/child" already exists.`

**A3 — cache poisoning.** Adopt a track with `projection: { pick: [], map: { x: "px" } }` → throws
`observation-input-projection`. Then adopt any _valid_ second track → today **succeeds**, and the
first track is now in the graph as an isolated node with its declared edge silently dropped. This
is the silent-data-loss case; capture its output verbatim in the W1 PR body.

**A4 — A5 composite key.** One track object referenced by two motions → `validateV5` accepts,
`Engine.load()` throws `node-duplicate`. Compare `buildGraphIR` (correct) against
`IncrementalGraphBuilder` (wrong) on the same project.

## Appendix B — Things that look like bugs and are not. Do not "fix" them.

- **`PatchRegistry.#notifyTerminal` swallows listener errors.** Deliberate, and documented:
  destruction cannot fail halfway and leave the graph and the wire disagreeing.
- **`PatchRegistry.evict` keeps the listener `Set` when it still has subscribers.** Deliberate:
  unsubscribe closures resolve the `Set` from the map at call time, and dropping a live `Set` would
  orphan every listener in it.
- **`unmount` publishes no terminal patch.** Deliberate: unmount is reversible, the node still
  exists, consumers observe absence via `get()` returning `undefined`.
- **`Engine.load()` compiles every node eagerly but mounts none.** Load-bearing for consumers.
- **`Motion.signal` ignores `signal.type`.** It only acts on a finite `signal.progress`. In scope
  for a future trigger package, not for this work.
- **`GraphBinding.replace()` rolls back only `ObservationState`.** Correct — it is the only live
  state it owns. Everything else is the caller's job, which is exactly what W2 installs.

## Appendix C — Definition of done for the whole effort

1. From `{ schemaVersion: 5, motions: [] }`, an editor can create a motion, add tracks and
   observation edges, edit keyframes, and remove any of it — all at runtime, through the public
   handle.
2. Every mutating operation is atomic: a rejected mutation changes nothing observable.
3. No mutation can produce a graph that disagrees with the compiled tracks or with the patch wire.
4. Destroying a node with a live dependant is rejected, with the dependants readable up front.
5. Editing a track does not emit a terminal patch.
6. No diagnostic is ever produced once and then silently dropped on a later build.
7. `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, and `docs/SESSION-STATUS.md` reflect all of it, and
   `packages/core/test/scratch/` does not exist.
