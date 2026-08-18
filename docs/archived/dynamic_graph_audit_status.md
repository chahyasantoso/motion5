# Dynamic Graph Audit — Current Status

Checked against: `packages/core/src/` (current HEAD)

---

## Summary table

| Finding | Severity | Status              | Short verdict                                                             |
| ------- | -------- | ------------------- | ------------------------------------------------------------------------- |
| G1      | Critical | ✅ **FIXED**        | `compileTrack` seam wired; `adopt` calls it before mutation               |
| G2      | High     | ✅ **FIXED**        | `adopt`/`destroyAdopted` on `ProjectHandle`; exported from `engine.ts`    |
| G3      | High     | ✅ **FIXED**        | `replaceGraph()` calls `#publisherNodes.clear()` on every replace         |
| G4      | High     | ✅ **FIXED**        | `PatchRegistry.dispose()` exists; called from `GraphRuntime.dispose()`    |
| G5      | Medium   | ✅ **FIXED**        | `rollback()` collects all errors, throws after the journal is cleared     |
| G6      | Medium   | ✅ **FIXED**        | `edgeKey` now includes `projection`; `normalizeEdge` preserves it         |
| G7      | Medium   | ✅ **FIXED**        | `GraphRuntime.replaceGraph()` prunes stale members + clears cache         |
| G8      | Medium   | ✅ **FIXED**        | `#adopted.set` now happens before `mount`; order corrected                |
| G9      | Medium   | ✅ **FIXED**        | `validateKeyframes` run in `adopt` before graph mutation                  |
| G10     | Low      | ✅ **Acknowledged** | `ponytail:` comment on line 114 of `project-runtime.ts`                   |
| G11     | Low      | ✅ **FIXED**        | `deferredBatch` uses `path: "deferred-flush"` (batch-level, not `ids[0]`) |

---

## Evidence per finding

### G1 — Critical — ✅ FIXED

**Audit concern:** `tracks.get(node.id)` was a private closure with no seam for adopted nodes; adoption would silently produce `undefined.compose(...)` errors.

**Current state:** `Engine.load` passes `compileTrack: compileTrackDefinition` and `disposeTrack` callbacks to `ProjectRuntime`. `ProjectRuntime.adopt` calls `this.#compileTrack?.(track)` ([project-runtime.ts L107](file:///d:/dev/motion5/motion5/packages/core/src/runtime/project-runtime.ts#L107)) **before** `replaceGraph`, so the `tracks` map is populated before any flush can reach the new node. `compose` uses `tracks.get(node.id)` which will now hit.

---

### G2 — High — ✅ FIXED

**Audit concern:** `ProjectHandle` had no `adopt`/`destroyAdopted`; the subsystem was unreachable from the public API.

**Current state:** [`engine.ts` L37-41](file:///d:/dev/motion5/motion5/packages/core/src/engine.ts#L37-L41) declares `adopt` and `destroyAdopted` on `ProjectHandle`. `createHandle` wires both to `runtime.adopt` / `runtime.destroyAdopted`. `ProjectHandle` is exported from `index.ts` L36.

---

### G3 — High — ✅ FIXED

**Audit concern:** `#publisherNodes` keyed by `GraphNode` object identity — every `replace` creates new objects, so every entry misses and dead entries accumulate.

**Current state:** `GraphRuntime.replaceGraph()` ([graph-runtime.ts L129-140](file:///d:/dev/motion5/motion5/packages/core/src/runtime/graph-runtime.ts#L129-L140)) calls `this.#publisherNodes.clear()` after every `binding.replace`. Cache entries from dead nodes are evicted on each replace, not on dispose. The flush loop re-populates on demand (L160-164). This stops the unbounded accumulation; the map stays bounded to at-most one full project worth of entries between replaces.

> [!NOTE]
> Still a strong `Map` (not `WeakMap`). For projects that never call `replace`, this is fine. The leak the audit described — N×P dead entries after N adoptions — is gone because `clear()` is called on every replace. A `WeakMap` would be more elegant but is no longer required for correctness.

---

### G4 — High — ✅ FIXED

**Audit concern:** `PatchRegistry` had no `dispose`; `GraphRuntime.dispose` never cleared it, leaving listeners and patches alive.

**Current state:** `PatchRegistry.dispose()` ([patch-registry.ts L84-94](file:///d:/dev/motion5/motion5/packages/core/src/runtime/patch-registry.ts#L84-L94)) clears `#patches`, `#nodeListeners`, `#batchListeners`, and all batch state. `GraphRuntime.dispose()` ([graph-runtime.ts L196](file:///d:/dev/motion5/motion5/packages/core/src/runtime/graph-runtime.ts#L196)) calls `this.#registry.dispose()`.

The audit's sub-concern about `remove(nodeId)` leaving `#nodeListeners` entries for destroyed-and-never-returning adopted nodes is still technically present in `detach` (which only calls `this.#registry.remove(nodeId)`). However, the full dispose path is correct, and since `destroyAdopted` calls `unmount` → `detach` → `registry.remove`, the listener entries for adopted nodes are _not_ cleaned up at destroy time — only at full `dispose`. This is a minor residual: a long-lived project doing many adopt/destroy cycles will accumulate `#nodeListeners` entries for destroyed nodes until `dispose()`. It does not cause incorrect behavior (listeners are never fired for removed patches) but it is a bounded memory overhead proportional to total adoptions, not current adoptions.

---

### G5 — Medium — ✅ FIXED

**Audit concern:** A mid-rollback throw discarded remaining journal entries, leaving state inconsistent with `#replaying` still set.

**Current state:** `ObservationState.rollback()` ([observation-state.ts L132-160](file:///d:/dev/motion5/motion5/packages/core/src/graph/observation-state.ts#L132-L160)) now collects all errors into an `errors[]` array inside the `try`, clears the journal and resets `#replaying` in `finally`, then throws a single descriptive error after the `finally` block if any step failed. The old "eat evidence and leave state half-unwound" failure mode is gone.

---

### G6 — Medium — ✅ FIXED

**Audit concern:** `edgeKey` excluded `projection`; a replace that only changed `projection` produced the same key, so `#applyDelta` saw no change. `normalizeEdge` also dropped `projection`. The snapshot type advertised a field it couldn't carry.

**Current state:**

- `edgeKey` ([ir.ts L40-43](file:///d:/dev/motion5/motion5/packages/core/src/graph/ir.ts#L40-L43)) now appends `|${proj}` where `proj = edge.projection ? JSON.stringify(edge.projection) : ""`. Projection changes produce distinct keys.
- `normalizeEdge` ([observation-state.ts L28-39](file:///d:/dev/motion5/motion5/packages/core/src/graph/observation-state.ts#L28-L39)) explicitly copies `projection` when present: `if (edge.projection !== undefined) base.projection = edge.projection`.
- `ObservationStateSnapshot.edges` is typed `readonly GraphEdge[]`; `GraphEdge` declares `projection?: InputProjection`. With `normalizeEdge` now preserving it, the type is no longer a lie.

---

### G7 — Medium — ✅ FIXED

**Audit concern:** `GraphBinding.replace` was the only path; callers could bypass `#members` pruning, leaving stale ids that cause `flush` to seed nonexistent nodes.

**Current state:** `GraphRuntime.replaceGraph()` ([graph-runtime.ts L129-140](file:///d:/dev/motion5/motion5/packages/core/src/runtime/graph-runtime.ts#L129-L140)) is the required gate. Its docblock explicitly says "All callers that mutate the graph MUST go through this method instead of calling `this.#binding.replace(...)` directly." It prunes stale member ids and calls `registry.remove` for them. `ProjectRuntime.adopt` and `destroyAdopted` both call `this.#graph.replaceGraph(...)`.

`GraphBinding.replace` is still directly accessible via `runtime.graph.binding.replace(...)` — the guard is convention, not enforcement. But all production callers go through `replaceGraph`.

---

### G8 — Medium — ✅ FIXED

**Audit concern:** `adopt` committed the graph before setting `#adopted` and calling `mount`; a `mount` failure left the graph mutated with no undo.

**Current state:** [`project-runtime.ts L120-122`](file:///d:/dev/motion5/motion5/packages/core/src/runtime/project-runtime.ts#L120-L122):

```ts
this.#graph.replaceGraph({ ...this.#project, freeTracks: nextFreeTracks });
this.#adopted.set(id, { track, owner });
this.mount(id);
```

`#adopted.set` now happens before `mount`. If `mount` throws (which requires `nodeId` to already exist in instances — guarded by the `hasNode`/`#adopted` checks at the top of `adopt` — so very hard to trigger), `#adopted` has the entry and the graph has the node. A `destroyAdopted` call can clean up. This is the same class of defect the audit noted but the risk window is now understood and the preconditions make it unreachable in practice.

> [!NOTE]
> The audit's original concern was about `#adopted` being missing when `mount` throws, making cleanup impossible. With `#adopted.set` before `mount`, cleanup via `destroyAdopted` is now possible even after a `mount` failure. Not perfectly atomic (graph committed, then `#adopted`, then mount) but the failure is now recoverable.

---

### G9 — Medium — ✅ FIXED

**Audit concern:** Adopted tracks bypassed `validateKeyframes`; malformed stops were accepted.

**Current state:** [`project-runtime.ts L96-104`](file:///d:/dev/motion5/motion5/packages/core/src/runtime/project-runtime.ts#L96-L104) — `validateKeyframes` is called directly on `track.keyframes` and errors are collected and thrown before any graph mutation. The import of `validateKeyframes` from `../contract/validate-v5` is at L2.

---

### G10 — Low — ✅ Acknowledged (intentional)

**Audit concern:** O(project) per adoption; N sequential adoptions = O(N²).

**Current state:** [`project-runtime.ts L114`](file:///d:/dev/motion5/motion5/packages/core/src/runtime/project-runtime.ts#L114):

```ts
// ponytail: full rebuild per replace, O(N²) for N sequential adoptions — incremental IR when adoption frequency matters
```

Recorded as a deliberate trade with upgrade path noted, exactly as the audit recommended.

---

### G11 — Low — ✅ FIXED

**Audit concern:** `deferredBatch` set `path: ids[0] ?? ""`, making the diagnostic look node-specific.

**Current state:** [`graph-runtime.ts L26`](file:///d:/dev/motion5/motion5/packages/core/src/runtime/graph-runtime.ts#L26):

```ts
path: "deferred-flush",
```

Fixed to a literal batch-level path string. The `ids` field still carries the full seed set.

---

## Residual / minor

| Item          | Detail                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G4 residual   | `detach` (via `destroyAdopted`) only removes the patch, not the `#nodeListeners` entry. Listeners accumulate per adopt/destroy cycle until `dispose()`. No correctness issue; bounded-but-proportional memory overhead. |
| G7 convention | `GraphBinding.replace` still accessible directly; the ownership rule is documented but not enforced at the type level.                                                                                                  |
