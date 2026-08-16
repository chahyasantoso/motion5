# Bug Analysis: Arm "sticks" at ~45% on reverse scroll (stuck elbow)

**Branch:** `feat/adopt-motion-track`
**Status:** root-caused and fixed in `fix/D1-terminal-patch-on-eviction` (see §11).
**Scope of investigation:** traced from live code, not from docs. Every doc under `docs/` that
describes the dynamic-graph teardown path is stale and was deliberately ignored while writing this.

---

## 1. Symptom

1. Demo boots with the 9-node core rig (no arms). Walk cycle is correct.
2. Scroll forward past **50%** → 4 arm tracks are adopted into the `walk` motion. Arms animate. Correct.
3. Scroll **backwards** below **45%** → arm tracks are destroyed, but the arm does not disappear.
   It freezes. The elbow marker stays pinned in world space at the pose it held at ~45% while the
   torso keeps walking, so the upper-arm bone rubber-bands from a moving chest to a dead point.

## 2. What the code actually does

### 2.1 Demo wiring (`apps/react-demo/src/App.tsx`)

One scroll callback drives everything:

```ts
port.subscribe((p) => {
  setProgress(p);                                  // (a) re-renders the whole rig subtree
  if (p >= 0.5  && !armsAdoptedRef.current) { ...handle.adopt(track, owner, {motionId:"walk"}) }
  else if (p < 0.45 && armsAdoptedRef.current) {   // (b) hysteresis: adopt @0.50, destroy @0.45
    for (const nodeId of [...ARM_NODES].reverse()) handle.destroyAdopted(nodeId, owner);
  }
  handle.signal("walk", { type: "scroll", progress: p });  // (c) compose + publish
  scheduler.flush();
});
```

Teardown order is **correct** (children before parents: `armR_lower, armR_upper, armL_lower,
armL_upper`), so no graph-validation error is involved. Rule that out.

### 2.2 Rendering (`apps/react-demo/src/components/SkeletonRig.tsx`)

Every bone and joint is `usePatch(handle, nodeId)` plus `if (!patch) return null`. Two facts matter:

- **Presence of a patch is the only render gate.** `patch.status` is never inspected.
- The `"Elbow L"` label sits on `walk/armL_upper`; the upper-arm segment is drawn `chest → armL_upper`
  and the forearm `armL_upper → armL_lower`. So "the elbow" == the tip of the `armL_upper` bone.

### 2.3 Teardown path in core

`handle.destroyAdopted` → `ProjectRuntime.destroyAdopted` (`packages/core/src/runtime/project-runtime.ts`):

1. `#instances.delete(nodeId)`
2. `#graph.evictNode(nodeId)` → `members.delete(nodeId)` + `registry.evict(nodeId)`
3. `#adopted.delete(nodeId)`
4. `disposeTrack(nodeId)` (engine drops the compiled `Track`)
5. `removeMotionTrack("walk", nodeId)`
6. `#graph.replaceGraph(#buildProjectSnapshot())` → rebuild + prune + clear publisher cache

All six steps succeed. The graph is genuinely correct afterwards: the node is gone from the IR,
gone from `members`, and nothing observes it, so the next `flush()` will never seed or republish it.

### 2.4 The actual defect (`packages/core/src/runtime/patch-registry.ts`)

```ts
evict(nodeId: string): void {
  this.#patches.delete(nodeId);
  this.#nodeListeners.delete(nodeId);
}
```

No `publish`, no `beginBatch`/`closeBatch`, no listener invocation. **Destruction has no
representation on the observation wire.** The contract cannot even express it:
`packages/core/src/internal.ts` defines `PatchSource` as `get()` + `subscribeNode()`, and
`PatchListener` accepts a `Patch` — never `undefined`. There is no "this node is gone" event in the
whole system. `remove()` (the unmount path) has the same hole.

### 2.5 Why that freezes the render (`packages/react/src/patch-store.ts`)

```ts
getSnapshot() {
  return detachSource === undefined ? source.get(nodeId) : snapshot;  // memoized while attached
}
```

The store is attached (the component has been mounted since the first adopt) so `getSnapshot()`
returns the **memoized last-delivered patch**, never re-reading the registry. Eviction notified
nobody, so `snapshot` is never cleared.

Critically: this is **not** a missed re-render. `setProgress(p)` in the same callback re-renders the
entire `SkeletonRig` subtree on every scroll event. The arm components *do* re-render, ~60 times a
second, and each time they read the same stale frozen patch. `usePatch` returns a truthy patch, so
`if (!patch) return null` never fires and the bone keeps drawing.

## 3. Root cause, in one sentence

> `PatchRegistry.evict()` deletes a node's patch and its listener set silently, and the
> patch/observation contract has no terminal event, so an evicted node's last published patch stays
> permanently authoritative for every attached subscriber. The React store serves that stale patch
> forever and the renderer, which gates only on patch presence, keeps drawing a destroyed bone.

The frozen geometry is a *legitimate* FK pose — not corrupted math — which is why it looks like a
suspended animation rather than a glitch.

## 4. Why exactly 45%, and why the elbow

- **45%:** the last patch the arm nodes ever published came from the previous scroll event, i.e. the
  last frame where `p >= 0.45`. Destruction happens *before* `handle.signal(...)` in step (c), so the
  arms never compose at `p < 0.45`. The frozen coordinates are the FK solution at `p ≈ 0.45`. The
  0.50/0.45 hysteresis band is also why the arm animates normally between 50% and 45% on the way
  down and only bricks below 45%.
- **The elbow:** both arms freeze, but the right arm renders at `opacity 0.65` in dim slate, while the
  left arm is full-opacity neon and carries the labelled `"Elbow L"` joint marker. The chest keeps
  publishing live values, the elbow point does not — so the visible artifact is a labelled dot nailed
  to the canvas with a bone stretching to it. That is the thing you see and name.

## 5. Second-order defect found on the same line (latent, worse)

`evict()` also deletes the entire `#nodeListeners` Set while live subscribers still hold closures
into it. `subscribeNode` returns `() => listeners.delete(listener)` closing over the **Set object**,
and a later `subscribeNode` after re-adoption creates a **new** Set in the map. So:

- Store subscribed before destroy → its listener lives in an orphaned Set.
- Scroll back down past 50% → `adopt()` + `mount()` + publish all succeed, the banner flips to
  `✨ ARMS ADOPTED (13 NODES)`, but `closeBatch()` finds no listener entry for those node ids.
- The store is **permanently deaf** and `getSnapshot()` still returns the 0.45 patch.

**Prediction to verify:** after one full down→up→down cycle the arms stay frozen at the 0.45 pose
even though the graph reports 13 live nodes. The "adoption works" observation only holds for the
*first* adopt, before any eviction has run.

## 6. Contributing design gaps (not the trigger, but they hide this class of bug)

1. **Status-blind renderer.** `SkeletonRig` ignores `patch.status`. A `blocked` or `error` patch
   renders identically to `ready`.
2. **Stale carry-forward in `publish()`.** For non-`ready` statuses with no new values, the registry
   retains `previous.values`. Combined with (1), any blocked node renders its last good pose. This is
   what the `// MUST destroy in reverse topological order` comment in `App.tsx` is really working
   around: correct order avoids the diagnostics, it does not avoid the staleness.
3. **Teardown asymmetry.** `adopt()` is transactional and validated; `destroyAdopted()` mutates five
   subsystems and publishes nothing. Construction has a wire event, destruction does not.

## 7. Recommended fixes

**A. Give destruction a wire representation (the real fix).**
Widen `PatchListener` to `(patch: Patch | undefined)`, or publish a terminal patch
(`status: "destroyed"`, `values: {}`) inside a real batch from `evict()`/`remove()`. Then
`patch-store` sets `snapshot = undefined` and notifies, `usePatch` returns `undefined`, and the
existing `if (!patch) return null` makes the arm vanish cleanly. No demo change needed.

**B. Stop destroying the listener Set.** Make unsubscribe resolve the Set from the map at call time
(`this.#nodeListeners.get(nodeId)?.delete(listener)`) and only drop the map entry when it is empty.
This unbricks re-adoption (§5).

**C. Defense in depth in the renderer.** Gate on `patch.status === "ready"`, not presence.

**D. Demo-level stopgap** (if you want the visual fixed before touching core): wrap the four arm
elements in `{armsAdopted && ...}` so the components unmount and their stores are discarded.
This masks the library bug — do not ship it as the fix.

## 8. Regression tests worth adding

1. `patch-registry`: `evict()` notifies existing node subscribers exactly once with a terminal value.
2. `patch-registry`: subscribe → evict → re-`subscribeNode` for the same id → the *original*
   subscriber still receives patches (or is provably released).
3. `patch-store`: attached store returns `undefined` after its source node is evicted.
4. Integration: `adopt → destroy → adopt` cycle on `walk/armL_upper`, asserting both
   `handle.get(id)` and the store snapshot follow the lifecycle.

## 9. Files touched by the trace

| File | Role in the bug |
| --- | --- |
| `packages/core/src/runtime/patch-registry.ts` | **Root cause** — silent `evict()` |
| `packages/core/src/internal.ts` | Contract has no destruction event |
| `packages/react/src/patch-store.ts` | Serves the memoized stale patch forever |
| `packages/react/src/index.ts` | `usePatch` store memoized per `(source, nodeId)`, never resubscribes |
| `packages/core/src/runtime/project-runtime.ts` | `destroyAdopted()` teardown sequence |
| `packages/core/src/runtime/graph-runtime.ts` | `evictNode()` / `replaceGraph()` — correct, exonerated |
| `packages/core/src/runtime/graph-publisher.ts` | Confirms evicted nodes are never reseeded |
| `packages/core/src/graph/binding.ts` | Graph replacement is transactional — exonerated |
| `apps/react-demo/src/components/SkeletonRig.tsx` | Presence-only render gate |
| `apps/react-demo/src/App.tsx` | 0.50/0.45 hysteresis explains the "45%" pose |

## 10. Explicitly ruled out

- Teardown order (already children-before-parents).
- Graph validation / ordering errors during the intermediate destroy states.
- `IncrementalGraphBuilder`'s `WeakMap` track cache (keyed on the module-level immutable
  `armTracks` objects; `replaceGraph` clears the publisher cache, so compose closures are re-resolved).
- FK plugin math and keyframe compilation (frozen values are a valid 0.45 pose).
- `Track` disposal / re-compilation on re-adopt.

---

## 11. Resolution (shipped in `fix/D1-terminal-patch-on-eviction`)

Fixes A, B, and C from §7 were taken. Fix D was rejected: it hides a library bug in one consumer.

**A — destruction is now an event.** `PatchStatus` gains a terminal `"destroyed"` member and
`PatchRegistry.evict()` delivers exactly one such patch (`values: {}`, `revision: previous + 1`) to
that node's subscribers before dropping the retained patch. `PatchListener` keeps its
`(patch: Patch) => void` shape, so no consumer signature changes.

The terminal patch is delivered **out of band**, not inside a batch, and deliberately does not reach
`subscribeBatch` listeners:

- Eviction happens during a graph mutation, not inside a flush. Opening a batch there could collide
  with an in-flight one.
- A `PatchBatch` means "one flush produced exactly these patches". Destruction is not a flush result.
- Subscriber failures are swallowed. Destruction mutates five subsystems and cannot be allowed to
  fail halfway and leave the graph and the wire disagreeing about whether a node exists.

**B — live listener Sets are no longer destroyed.** `evict()` drops the `#nodeListeners` entry only
when it is already empty, and the unsubscribe closure returned by `subscribeNode` now resolves the
Set from the map at call time instead of capturing it. This is what makes re-adoption of the same
node id deliverable to a subscriber that predates the eviction (§5).

**C — the renderer gates on liveness, not presence.** `SkeletonRig` routes every node through a
local `useLivePatch` helper that returns `undefined` unless `status === "ready"`, so a `blocked`,
`error`, or terminal patch can never draw a bone at a stale pose again.

**Deliberately unchanged:** `remove()` (the unmount path) publishes no terminal patch. Unmount is
reversible — the node still exists in the graph and may become a member again — and `detach()` runs
for every instance during `dispose()`, where firing listener callbacks into tearing-down consumers
would be actively harmful. Absence there is correctly observed through `get()` on the next read,
which is what a remount does.

**Tests added** (mapping to §8):

| Test | Covers |
| --- | --- |
| `packages/core/test/unit/runtime/patch-registry.test.ts` (5 new cases) | §8.1, §8.2, plus no-op eviction, throwing subscriber, and unmount staying silent |
| `packages/react/test/patch-store-destroy.test.ts` | §8.3, attached and detached, plus recovery on re-adoption |
| `packages/core/test/integration/adopt-destroy-readopt.test.ts` | §8.4 as a full `adopt → destroy → re-adopt` cycle through `ProjectHandle` |

**Expected demo behaviour after the fix:** scrolling back below 45% makes both arms disappear
cleanly instead of freezing, and scrolling forward past 50% again re-adopts and re-animates them on
every subsequent cycle, not just the first.
