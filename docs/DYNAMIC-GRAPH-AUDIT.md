# Dynamic graph audit

**Status: assessment / intent.** `docs/SESSION-STATUS.md` remains the only file allowed to assert what is true in the tree.

- Reviewed ref: `phase5/membership-base` @ `a06b7de4fe50a4b8747cfc2e1f0c06819d02b45c`
- Files read: `runtime/project-runtime.ts`, `runtime/graph-runtime.ts`, `runtime/graph-publisher.ts`, `runtime/patch-registry.ts`, `graph/binding.ts`, `graph/ir.ts`, `graph/observation-state.ts`, `graph/references.ts`, `engine.ts`, `index.ts`

## Why this document exists

The attached trigger article **never mentions the dynamic graph.** Not once across its 7 turns. Its entire field of view is `domain/triggers.ts` plus the four files it needed to trace a signal. That is the article's largest blind spot, and it is the reason its "the concern is internal redundancy, not correctness" verdict reads as reassuring when it should not.

So this is not an index of article topics. It is the audit the article should have contained, done against the tree.

---

## 1. What the dynamic graph actually is

There is a real runtime graph-mutation subsystem here, and it is the most carefully built thing in the repository. The path:

```
ProjectRuntime.adopt(track, owner)          add a runtime-created track
ProjectRuntime.destroyAdopted(id, owner)    remove one, owner-gated
        │
        ▼
GraphBinding.replace(candidateProject)      the only coordinator for a graph swap
        │
        ├─ requireGraph()      → buildGraphIR(): full rebuild + revalidate + topo order
        ├─ #applyDelta()       → node/edge diff applied to live ObservationState
        ├─ hooks (failure injection seams for the rollback harness)
        ├─ #graph = candidate  → immutable snapshot swap, last
        └─ state.commit()      → release the undo journal
              on any throw: state.rollback() then rethrow the original error
```

`ObservationState` is the clever part: live nodes and edges are mutated **in place and never rebuilt**, so a reference a subscriber held before a commit stays authoritative after it. Every mutation records its own inverse in a journal; `rollback()` replays it backwards. The class docblock explicitly refuses to offer a rebuild-from-snapshot method because that seam would destroy the identity that makes an undo journal meaningful. That reasoning is correct and worth preserving.

So the design intent is sound. The problems are all at the seams around it.

---

## 2. Findings

Continuing the numbering from the earlier documents (B1–B12, B14–B19 are already issued). These are `G`-prefixed for graph.

### G1 — **Critical. Adoption cannot produce a ready patch through `Engine.load`.**

`Engine.load` builds its compose resolver as a closure over a local `tracks` map, populated once during load from the authored project:

```ts
const compose = (node) => (inputs) => {
  const snapshot = tracks.get(node.id)!.compose(inputs as Readonly<ImmutableRecord>);
```

`ProjectRuntime.adopt` adds a node to the **graph** but never creates a `Track` for it, and it has no way to: `tracks` is private to `Engine.load`'s scope. So on the first flush that touches an adopted node, `tracks.get(node.id)` is `undefined`, the non-null assertion is a lie, and `undefined.compose(...)` throws.

It does not crash the flush. `GraphPublisher` catches it and publishes `status: "error"` with `ruleId: "composition-failure"`. So the failure mode is: **adoption appears to succeed, the graph is correctly mutated, and the adopted node then publishes an error patch forever.** Silent, contained, and permanently wrong.

The non-null assertion on `tracks.get(nodeId)!` in the `setProgress` callback has the same shape and will throw for the same reason.

Fix requires a real seam: either `Engine` owns adoption (exposing it on `ProjectHandle` and compiling a `Track` first), or `ProjectRuntime.adopt` accepts a compose function alongside the track definition. The second is smaller and keeps `ProjectRuntime` renderer-neutral.

### G2 — **High. The dynamic graph is unreachable from the public API.**

`ProjectHandle` exposes `mount`, `unmount`, `seek`, `signal`, `subscribe`, `dispose`. There is no `adopt` and no `destroyAdopted`. `ProjectRuntime` itself is not exported from `index.ts` (correctly, per the brief's "keep graph internals out of the public package surface").

Net effect: a fully built, transactional, rollback-safe graph mutation subsystem with an owner-gated destroy protocol, and **no consumer can call it.** It is exercised only by tests that construct `ProjectRuntime` directly and supply their own compose resolver, which is also why G1 has gone unnoticed: the tests never go through `Engine`.

This is worth a decision, not just a fix. Either adoption is a v1 feature and needs a public surface plus the G1 seam, or it is speculative and should be marked as such so the next audit does not read it as shipped capability.

### G3 — **High. Unbounded leak: the publisher-node cache is keyed by object identity and never evicted.**

`GraphRuntime`:

```ts
readonly #publisherNodes = new Map<GraphNode, PublisherNode>();
```

A strong `Map`, keyed by `GraphNode` object identity, cleared only in `dispose()`.

`buildGraphIR` constructs **brand new frozen `GraphNode` objects on every call**, and `GraphBinding.replace` calls it every time. So after each `replace`:

- every cache entry misses, because the keys are new objects,
- a fresh `compose` closure is resolved for **every node in the project**, not just the changed one,
- and every previous entry is retained, pinning the dead `GraphNode`, its `TrackDefinition`, and its compose closure in memory.

N adoptions on a P-node project leaves roughly N×P dead entries alive. For a subsystem whose entire purpose is repeated runtime mutation, this is the wrong data structure. A `WeakMap` fixes the leak; keying by node id plus a graph revision fixes the pointless re-resolution as well.

### G4 — **High. `PatchRegistry` has no teardown, and `GraphRuntime.dispose` never clears it.**

`GraphRuntime.dispose()` clears `#members`, `#pendingSeeds`, `#publisherNodes`, and unsubscribes from the clock. It does **not** touch `#registry`. `PatchRegistry` has no `dispose` method at all, so after disposal it still holds:

- every published `Patch` in `#patches`,
- every node listener in `#nodeListeners`,
- every batch listener in `#batchListeners`.

`remove(nodeId)` deletes only the patch, and its docblock says so deliberately ("without touching subscriber identity"), which is right for **remount**. It is wrong for a node that was adopted and destroyed and will never return: that `#nodeListeners` entry is unreachable and immortal. Combined with G3, a long-lived page doing repeated adopt/destroy cycles leaks on two independent axes.

### G5 — **Medium. `ObservationState.rollback()` has no failure containment.**

Every method rollback calls (`addNode`, `removeNode`, `addEdge`, `removeEdge`) throws on a precondition violation, and `rollback` clears the journal in a `finally`:

```ts
} finally {
  this.#journal = [];
  this.#replaying = false;
}
```

If a replay step throws halfway through, the remaining undo entries are **discarded** and the partially-unwound state silently becomes the new baseline, with `#replaying` still suppressing any re-recording. The exception propagates, `GraphBinding.replace` rethrows the original error, and live state is now inconsistent with `#graph` and unrecoverable.

The undo ordering itself is correct (edges before nodes on the way down, nodes before edges on the way back), so this is not currently reachable through `#applyDelta`. But it is the failure mode of the one mechanism the whole transaction story rests on, and it deserves an explicit invariant assertion rather than a `finally` that eats the evidence.

### G6 — **Medium. `ObservationState` silently drops `projection` from live edges.**

`normalizeEdge` reconstructs each edge from exactly four fields:

```ts
{ observerId, sourceId, role, target? }
```

`projection` is discarded. But `ObservationStateSnapshot.edges` is typed `readonly GraphEdge[]`, and `GraphEdge` declares `projection?: InputProjection`. So the snapshot type advertises a field the snapshot can never carry.

Compounding it: `edgeKey` also excludes `projection`. So a `replace` that changes only an edge's projection (`pick` → `map`, same observer/source/role/target) produces an identical key, `#applyDelta` sees no change, and no state mutation occurs. `#graph` swaps to the new IR; `ObservationState` keeps the old edge. Publication stays correct, because `GraphPublisher` reads projections off the IR snapshot, not off live state. But `state.sourcesOf()` and `snapshot()` are the designated **evidence and inspection** surface, and they now disagree with the committed graph.

Either make projection part of edge identity, or narrow the snapshot type to the four fields it actually carries and say why in the docblock. Do not leave the type lying.

### G7 — **Medium. `GraphBinding.replace` can orphan `GraphRuntime` membership.**

`#members` lives in `GraphRuntime`. `replace` lives in `GraphBinding`, reachable as `runtime.graph.binding.replace(...)`. Nothing reconciles the two. Replace a project so that a currently-attached node disappears, and `#members` keeps the stale id; the next `flush([...#members])` seeds a node that no longer exists, `byId.get(id)` returns `undefined`, and the publisher's `continue` swallows it with no diagnostic.

`ProjectRuntime.destroyAdopted` gets the ordering right (`unmount` before `replace`), so this is not reachable through the intended path. It is reachable through the exposed one. `GraphRuntime` should own a `replace` wrapper that prunes membership and invalidates the node cache, which would also fix G3's re-resolution problem in the same place.

### G8 — **Medium. `adopt` commits the graph before mounting, with no compensation.**

Order of operations:

```ts
this.#graph.binding.replace({ ...this.#project, freeTracks: nextFreeTracks }); // committed
this.#adopted.set(id, { track, owner });
this.mount(id);                                                              // can throw
```

The graph transaction is already committed when `mount` runs. If `mount` throws, `#adopted` retains the entry and the graph retains the node, but no instance exists. The whole point of `GraphBinding`'s transaction is that a failed mutation leaves nothing behind; `adopt` reintroduces a non-atomic window immediately outside it.

Low likelihood today (the preceding `hasNode` / `#adopted` checks make a `mount` throw hard to trigger), but it is the same class of defect as B4 in the feasibility assessment: a partial-failure path with no unwind.

### G9 — **Medium. Adopted tracks bypass keyframe validation entirely.**

`adopt` runs `qualifyFreeTrack(track.id)` for id validation, then hands the definition to `binding.replace` → `buildGraphIR`. `buildGraphIR` validates ids, observation shape, projections, duplicate edges, unknown sources, self-reference, and cycles. It does **not** validate keyframes: `validateKeyframes` is only called from `validateV5`, which `adopt` never invokes.

So a runtime-adopted track with malformed stops (non-finite `p`, non-monotonic, duplicate positions) is accepted into the committed graph. Authored tracks cannot do this. Two different trust levels for the same node type.

### G10 — **Low. `replace` is O(project) per mutation.**

Every `adopt` and every `destroyAdopted` rebuilds the entire graph IR from scratch: re-collect every track, re-validate every edge, re-run `orderGraph` over all nodes. N sequential adoptions cost O(N²). Acceptable for a handful of runtime tracks, and the full-rebuild-then-diff approach is what makes the transaction safe, so this is a deliberate trade rather than a mistake. Worth recording as a known ceiling before anyone builds a feature that adopts per frame.

### G11 — **Low. Deferred-flush diagnostic reports one seed as its `path`.**

`deferredBatch` sets `path: ids[0] ?? ""`. When a reentrant flush defers many seeds, the diagnostic's `path` names an arbitrary one (the full set is preserved in `ids`, so nothing is lost). Cosmetic, but it makes the diagnostic look node-specific when it is batch-level.

---

## 3. What is genuinely good here

Worth saying, because the finding list above is long and the design underneath it is not the problem.

- **`ObservationState`'s identity-preserving mutation plus undo journal** is the right answer to "how do I mutate a live graph without invalidating references subscribers already hold." The refusal to add a rebuild seam is disciplined.
- **`GraphBinding`'s stage ordering** validates the candidate fully before touching live state, and swaps the immutable snapshot last. Pre-commit failure genuinely rolls back.
- **`graph/references.ts`** classifies pending-vs-resolved **before** attempting composition, so a not-yet-published source is a `warning` diagnostic rather than an exception caught after the fact. Single-owner, no fabricated values. Exactly right.
- **`GraphPublisher`'s three-state containment** (`blocked` upstream / `pending` reference / `error` composition) with canonical edge-key ordering means failure attribution is deterministic.
- **`PatchRegistry.closeBatch`** settles all state before notifying, collects the first listener error, and rethrows once. Same policy as `browser-clock.ts`. Consistent failure discipline across two unrelated modules is a good sign.

---

## 4. Recommended order

1. **G1** and **G2** together, as one decision: is adoption a v1 feature? If yes, add the compose seam and a public surface. If no, mark it speculative. Everything else is downstream of that answer.
2. **G3** and **G4**, the two leaks. Independent of the G1/G2 decision, mechanical, and testable with a repeated adopt/destroy loop asserting bounded growth.
3. **G7**, by giving `GraphRuntime` a `replace` wrapper that prunes membership and invalidates the node cache. Fixes G3's redundant re-resolution in the same change.
4. **G6** and **G9**, both "two things disagree about what a node is" defects.
5. **G5**, **G8**, **G10**, **G11** as cleanup with recorded rationale.

All of this sits **behind** the Stage 0 correctness fixes from `docs/TRIGGER-ARTICLE-FEASIBILITY-ASSESSMENT.md` (B1, B3, B4, B14). A `"time"` trigger that never ticks and a multi-track motion that publishes one track are both more visible than an adoption path nobody can reach.
