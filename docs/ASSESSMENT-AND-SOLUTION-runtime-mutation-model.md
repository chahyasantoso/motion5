# Runtime Mutation Model — Assessment & Proposed Solution

> **Companion to:** `PROBLEM-STATEMENT-runtime-mutation-model.md` (handoff brief, problem-only).
> **This document:** independent verification of that brief, plus a proposed solution.
> **Verified against:** `chahyasantoso/motion5`, branch `feat/adopt-motion-track`, commit
> `751ecbce936b31fc0c3b0101ca2b89ac10b9cac3`.
> **Method:** every claim below was checked by reading the source at that commit. Files read in
> full: `packages/core/src/runtime/project-runtime.ts`, `packages/core/src/engine.ts`,
> `packages/core/src/graph/binding.ts`, `packages/core/src/runtime/graph-runtime.ts`,
> `packages/core/src/runtime/patch-registry.ts`, `packages/core/src/contract/v5.ts`,
> `packages/core/src/adapters/graph-builder/incremental.ts`, `packages/core/src/graph/ir.ts`,
> `packages/core/src/domain/motion.ts`.
> **Scope:** `packages/core` only. No changes proposed to `packages/react` or `apps/react-demo`.

---

## 0. Verdict at a glance

| #            | Claim / area                                                                                    | Verdict                                                                                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1           | `destroyAdopted()` is not transactional                                                         | **Confirmed.** Live bug, exactly as described.                                                                                                                                                                                                        |
| P1-fix       | "This is a reordering of existing logic, not new code"                                          | **Corrected.** A plain reorder is impossible; `#buildProjectSnapshot()` derives the candidate _from_ `#adopted`. Needs to become a pure function of a passed map. Small, but not free.                                                                |
| P1-audit     | "`adopt()`'s only pre-`replaceGraph` side effect is `this.mount(id)`"                           | **Wrong on both counts.** `mount()` runs _after_ `replaceGraph`. The real pre-commit side effects are `compileTrack()` and `#adopted.set()`, and `adopt()` has the same class of bug with a _worse_ practical blast radius for an editor. See **A1**. |
| P2           | No runtime-callable way to create/destroy a `Motion`                                            | **Confirmed**, and the fix is bigger than the brief implies: it structurally requires part of 3a.                                                                                                                                                     |
| P2-rationale | "A `Motion` is the only thing that carries a trigger — the thing that actually drives playback" | **Corrected.** `Engine.load()` ignores `MotionDefinition.trigger` entirely. Every motion gets `createManualTriggerPort()`. Scroll/time drivers do not exist in core today. See **A4**.                                                                |
| P3a          | Collapse the two-tier store                                                                     | **Endorsed**, with a sequencing correction: a slice of it is a _prerequisite_ for P2, not lower priority than it.                                                                                                                                     |
| P3a-mount    | "Ingestion should be pure storage; don't auto-mount"                                            | **Endorsed**, with supporting evidence.                                                                                                                                                                                                               |
| P3b          | Replace `owner` with a returned handle                                                          | **Endorsed**, with one missing spec requirement (stale-handle ABA).                                                                                                                                                                                   |
| P3-cascade   | Cascade-delete rejected; "reject when a dependant exists"                                       | **Endorsed and confirmed** to fall out of `observation-unknown-source`. But the resulting error is unusable as editor UX. See **D3**.                                                                                                                 |
| P3-edit      | Destroy-and-recreate as the edit primitive                                                      | **Pushed back on.** A non-destructive `replaceTrack` is cheaper, simpler, and already supported by the existing delta machinery. See **D1**.                                                                                                          |
| —            | 4 defects not in the brief                                                                      | **New.** See **A1–A4**. A3 is silent data loss.                                                                                                                                                                                                       |

**Recommended order of work:** **S1** (transactionality, both ops) → **S2** (identity/freeze hardening) → **S3** (motion lifecycle) → **S4** (unification + capability handles). S1 and S2 are bug fixes and should ship independently of the editor work; S3 depends on a small slice of S4.

---

## Part A — Verification of the brief

### A.0 Orientation claims: all confirmed

- `ProjectRuntime`'s public surface is exactly `mount`, `unmount`, `adopt`, `destroyAdopted`,
  `seek`, `invalidate`, `dispose` (plus `project`, `graph`, `instanceCount`, `diagnostics`
  getters). Confirmed.
- `GraphBinding.replace()` **is** correctly transactional: `validateGraphResult(this.#builder.build(project))`
  runs as a pure computation before any live state is touched, and every failure in the apply phase
  calls `this.#state.rollback()` and rethrows. Confirmed verbatim.
- `IncrementalGraphBuilder` keys its cache on object identity:
  `readonly #trackCache = new WeakMap<TrackDefinition, GraphNode | undefined>()`. Confirmed.
- `Engine.load()` constructs `new IncrementalGraphBuilder()` per call, so the cache does not span
  `load()` calls. Confirmed — re-`load()`-per-edit would indeed throw away all incrementality.
- Motion construction lives entirely inside `load()`'s closure over a private
  `const motions = new Map<string, Motion>()`. `ProjectRuntime` has no access to it. Confirmed.

One addition the brief omits: `ProjectRuntime` already owns **four** delegation hooks, not two —
`compileTrack`, `disposeTrack`, `addMotionTrack`, `removeMotionTrack`. The last two already reach
into `Engine`'s `motions` map (`motions.get(motionId)` → `motion.addTrack(...)`). So the seam for
P2 is not a new idea in this codebase; it is a _fifth and sixth_ hook on an established pattern.
That makes P2 cheaper than the brief estimates on the `Engine` side, and more expensive on the
`ProjectRuntime` side (see **S3**).

---

### A.1 Problem 1: confirmed, with a corrected fix shape

The code at `project-runtime.ts` is exactly as quoted. Five irreversible side effects precede the
only fallible call:

```
#instances.delete(nodeId)        // irreversible
#graph.evictNode(nodeId)         // irreversible + publishes terminal patch to subscribers
#adopted.delete(nodeId)          // irreversible — destroys the bookkeeping needed to retry
#disposeTrack?.(nodeId)          // irreversible — disposes the compiled Track
#removeMotionTrack?.(...)        // irreversible
#graph.replaceGraph(candidate)   // ← the only step that can fail
```

The failure mode chain is confirmed end to end against the real code paths:

1. `replaceGraph` → `GraphBinding.replace` → `IncrementalGraphBuilder.build` emits
   `observation-unknown-source` whenever a surviving node's edge names the removed node
   (`ir.ts`: `if (!known.has(edge.sourceId))`). `GraphBinding` rolls back its own
   `ObservationState` and rethrows. Correct behaviour, in isolation.
2. `ProjectRuntime` never asked whether the commit succeeded, so its five mutations stand.
3. `status: "error"` / `"Cannot read properties of undefined (reading 'compose')"` is fully
   explained: `Engine`'s compose resolver is
   `(node) => (inputs) => tracks.get(node.id)!.compose(...)`. `disposeTrack` already did
   `tracks.delete(nodeId)`, but the node is still in the committed `GraphIR`, so the publisher
   still calls its compose closure. The non-null assertion `!` is what turns a torn-down track
   into a `TypeError` at flush time.
4. The permanent-ghost claim is confirmed: `#adopted.delete` ran, so `destroyAdopted` now throws
   `not adopted`; `#graph.state.hasNode(id)` is still true, so `adopt()` throws `already exists`.
   Both exits are closed.
5. The terminal `status: "destroyed"` patch really is delivered against the engine's own
   disagreement. `PatchRegistry.evict` publishes it out of band
   (`#notifyTerminal`, revision + 1, `status: "destroyed"`) and **deliberately swallows listener
   errors** because "destruction cannot be allowed to fail halfway through and leave the graph and
   the wire disagreeing about whether the node still exists." That docstring describes precisely
   the state this bug produces. The mechanism is correct; the _caller_ violates its precondition.

**Correction to the proposed direction.** "Call `replaceGraph` first" cannot be done by moving one
line, because `#buildProjectSnapshot()` takes no arguments and reads `this.#adopted` directly. The
candidate for a destroy is by definition "the project _without_ this node", which today can only
be produced by mutating `#adopted` first. The fix is therefore: **make snapshot construction a
pure function of an explicitly passed map.** That is a real (if small) refactor, and it is what
makes both `adopt` and `destroyAdopted` genuinely two-phase. See **S1**.

**Correctly noted in the brief:** once the ordering is fixed, "reject a destroy while a live
dependant still observes the node" is free. `observation-unknown-source` already does the
detection. No dependency tracking needs to be written.

---

### A.2 New defect **A1** — `adopt()` has the same bug, and it fires more often

The brief's audit note is inaccurate. Actual order in `adopt()`:

```ts
this.#compileTrack?.(track, id);                       // ← side effect #1, pre-commit
this.#adopted.set(id, { track, owner, motionId });      // ← side effect #2, pre-commit
this.#graph.replaceGraph(this.#buildProjectSnapshot()); // ← can throw
this.mount(id);                                         // post-commit (not pre-commit)
if (motionId !== undefined) this.#addMotionTrack?.(...); // post-commit
```

`replaceGraph` fails inside `adopt()` whenever the new track's own `observes` array names a source
that does not exist yet, or introduces a cycle (`orderGraph`), or collides on `edgeKey`. **In an
editor this is the common case, not the edge case**: the user draws an edge to a node they haven't
created yet, mistypes a source id, or wires a loop. On that throw:

- `#adopted` retains the entry → every retry of the same id throws
  `Adopted track "<id>" already exists.` The id is burned for the lifetime of the runtime, and
  unlike Problem 1 there is not even an `unmount()` escape hatch, because the node was never
  added to the graph at all.
- `Engine`'s `tracks` map retains the compiled `Track` (`compileTrackDefinition` does
  `tracks.set(nodeId, track)` and only `disposeTrack` removes it). Leaked until `dispose()`.
- The `WeakMap` in the builder is now poisoned for that track object — see **A3**, where this
  becomes silent data loss rather than a leak.

The pre-commit `#adopted.set` is not gratuitous: `#buildProjectSnapshot()` needs the entry to
produce the candidate. Same root cause as Problem 1, same fix (**S1**). Treat A1 as part of the
same change, not a follow-up.

Separately, the two **post-commit** calls in `adopt()` can also throw after the graph is
committed: `mount()` throws on `already mounted`, and `addMotionTrack` throws
`Unknown motion` / `Unknown graph node`, and `Motion.addTrack` throws
`Duplicate Motion track id`. Lower priority (the graph itself stays consistent), but the
post-commit phase should be made non-throwing by construction — see **S1.4**.

---

### A.3 New defect **A2** — adopted tracks are never frozen, so the WeakMap invariant is unenforced

The brief states that "every `ProjectDefinition`/`TrackDefinition` in the system is deep-frozen
(`validateV5` → `deepFreeze`)" and that this is what keeps the identity-keyed cache correct.
**That is true only for tracks that came through `Engine.load()`.**

`adopt()` runs `validateKeyframes(...)` and nothing else. It never calls `validateV5`, never
freezes, and stores the **caller's own object reference**:
`this.#adopted.set(id, { track, owner, motionId })`. `#buildProjectSnapshot()` then spreads that
same reference into every subsequent candidate.

Consequence: an editor holding its own track object can mutate `track.keyframes.x.stops[1].v` in
place, and the builder's `WeakMap` will keep returning the `GraphNode` it cached for the _old_
content — the exact correctness bug deep-freeze exists to prevent, on exactly the objects a
long-lived editor is most likely to mutate. Nothing warns; nothing throws.

This also silently undermines P3's "destroy-and-recreate is the edit primitive" lean: nothing in
the API prevents the cheaper, wrong path.

Secondary gap in the same area: adopted tracks bypass `validateV5` entirely, so runtime-created
content is validated at a _lower_ trust level than authored content, not the same level the
`adopt()` comment claims ("Validate keyframes at the same trust level as authored tracks").
Keyframes are checked; `observes` shape, ids, and duration are only checked later and indirectly,
by the graph builder.

---

### A.4 New defect **A3** — WeakMap cache poisoning turns a hard error into silent omission

This is the most serious finding in this document, because it fails _silently_.

```ts
// incremental.ts
if (this.#trackCache.has(track)) {
  node = this.#trackCache.get(track);          // cache hit: no diagnostics are produced
} else {
  node = collectTrack(track, ..., diagnostics); // diagnostics only ever produced here
  this.#trackCache.set(track, node);            // note: `undefined` is cached too
}
```

`collectTrack` (in `ir.ts`) has two distinct failure behaviours, and the cache breaks both:

1. **Invalid track id** → pushes `track-id` and returns `undefined`. `undefined` is cached. On the
   next build with the same object, `has(track)` is `true`, `node` is `undefined`, **no diagnostic
   is pushed**, and the track is simply skipped. Build #1 correctly rejects the project; build #2
   _succeeds_ with the node silently missing.
2. **Invalid edge** (`observation-role`, `observation-source`, `observation-input-projection`) →
   pushes a diagnostic and `continue`s, returning a node with the bad edge **omitted**. That
   partial node is cached. On the next build, no diagnostic is re-emitted, so the project builds
   successfully with an observation edge the author declared and the engine silently dropped.

Now compose this with **A1**. Sequence, all with real production code:

1. `adopt(badTrack)` — say `observes: [{ role: "input", projection: { pick: [], map: {...} } }]`.
   Build #1 emits `observation-input-projection`, `replaceGraph` throws. Per A1, `badTrack` stays
   in `#adopted`, and the builder has now cached a node for it with the edge dropped.
2. Any later `adopt()` or `destroyAdopted()` rebuilds the snapshot, which still contains
   `badTrack`. Cache hit. No diagnostics. **`replaceGraph` succeeds.**
3. The graph now contains `badTrack` as an isolated node with no observation edge. The editor
   believes the wiring exists. Nothing ever said otherwise.

Note that `buildGraphIR` (the `defaultGraphBuilder`) has no cache and does not have this
behaviour — but `Engine.load()` always passes `new IncrementalGraphBuilder()`, so every real
runtime is exposed. Fix in **S2.2**.

---

### A.5 Problem 2: confirmed, with the rationale corrected

The mechanical claims are exact:

```ts
if (motionId !== undefined) {
  const motionExists = this.#project.motions.some((m) => m.id === motionId);
  if (!motionExists) throw new TypeError(`Unknown motion "${motionId}".`);
}
```

`readonly #project: ProjectDefinition` is assigned once in the constructor and never reassigned.
There is no `addMotion`/`destroyMotion` anywhere in `ProjectRuntime`, `ProjectHandle`, or
`Engine`. Confirmed.

There is a second, harder blocker the brief does not mention, and it is the one that actually
sizes the work: **`#buildProjectSnapshot()` iterates `this.#project.motions`.** Even if the guard
were removed, an adopted track with an unknown `motionId` would be silently dropped from every
candidate — its motion has no entry to be merged into. So the guard is not merely a check to
relax; it is load-bearing. `addMotion` requires `ProjectRuntime` to own a **mutable motion store**
that the snapshot builder reads from. That is a slice of P3a, which is why P3a cannot be treated
as strictly lower priority than P2.

**Correction to the rationale.** The brief argues a `Motion` matters because it "is the only thing
in the schema that carries a **trigger** … the thing that actually drives playback." The schema
does require it (`MotionDefinition.trigger: { type: TriggerType; ... }`, with
`SUPPORTED_TRIGGER_TYPES = ["scroll", "time", "manual"]`), but **`Engine.load()` never reads
`motionDefinition.trigger`**. Every motion is constructed as:

```ts
const triggerPort = createManualTriggerPort();
motion = new Motion({ ..., trigger: triggerPort, disposeTracks: false, listenToClock: false,
                      invalidate: () => ..., stagger: motionDefinition.stagger });
motion.play();
```

So: `trigger.type` is dead data in core, no scroll or time driver exists, and playback is driven
by `GraphRuntime`'s clock subscription fanning out through `onClockTick` → `motion.onTick(event)`.
A `Motion` is worth creating at runtime for three real reasons, none of which is the trigger:

1. It is an independently signalable progress group — `handle.signal(motionId, { progress })` →
   `Motion.signal` → `#scheduleProgress`. (Note `Motion.signal` is a **no-op** unless
   `signal.progress` is a finite number; there is no `type`-based dispatch.)
2. It owns `stagger` and a shared `#totalDuration()`, i.e. relative timing across tracks. Free
   tracks have neither.
3. It owns its own `#position`, so it is the unit of "scene" scrubbing.

This matters for the design: **`addMotion` should not pretend to accept a meaningful `trigger`
until core actually consumes one.** Accept the field for schema round-tripping, wire a manual port
exactly as `load()` does, and file scroll/time drivers as separate work. Documenting a
`trigger: { type: "scroll" }` parameter that silently does nothing would be a worse outcome than
today's hard ceiling.

---

## Part B — Proposed solution

Four changes, sequenced. S1 and S2 are standalone bug fixes with no API change and should land
first, on their own PRs, with their own regression tests. S3 and S4 are the editor enablement.

### S1 — Two-phase discipline for every mutating op _(fixes P1 and A1)_

**S1.1 Make snapshot construction pure.**

```ts
#projectSnapshot(adopted: ReadonlyMap<string, AdoptedEntry>): ProjectDefinition {
  // identical body to today's #buildProjectSnapshot, but reading `adopted`, not `this.#adopted`
}
```

No other behaviour changes. This is the enabling refactor the brief's "just reorder it" framing
misses.

**S1.2 `destroyAdopted` becomes validate-then-commit.**

```ts
destroyAdopted(nodeId: string, owner: object): void {
  this.#assertLive();
  const adopted = this.#adopted.get(nodeId);
  if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
  if (adopted.owner !== owner)
    throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);

  // ---- phase 1: pure candidate, zero live mutation ----
  const candidate = new Map(this.#adopted);
  candidate.delete(nodeId);
  this.#graph.replaceGraph(this.#projectSnapshot(candidate)); // throws → nothing has changed

  // ---- phase 2: commit; every step below is now unconditional-by-construction ----
  this.#adopted.delete(nodeId);
  this.#instances.delete(nodeId);
  this.#graph.evictNode(nodeId);
  this.#disposeTrack?.(nodeId);
  if (adopted.motionId !== undefined) this.#removeMotionTrack?.(adopted.motionId, nodeId);
}
```

Two details that only show up once you read `GraphRuntime.replaceGraph`:

- **`replaceGraph` already evicts removed nodes.** Its membership-reconciliation loop does
  `this.#members.delete(id); this.#registry.evict(id);` for every member id absent from the new
  graph. So the terminal `"destroyed"` patch now fires _inside_ the successful commit, which is
  exactly where it belongs. Keep the explicit `evictNode(nodeId)` anyway: it is the only thing
  that frees the `#nodeListeners` entry for a node that was **unmounted** (hence not a member)
  before being destroyed. `PatchRegistry.evict` is safe to call twice — the second call finds no
  retained patch and publishes nothing. Assert "exactly one terminal patch" in a test.
- Do **not** replace `#instances.delete` with `unmount()`; `unmount` calls `#graph.detach`, whose
  `registry.remove` is the remount-safe path and would suppress the terminal patch. The current
  `evictNode` choice and its comment are correct and should survive the refactor.

**S1.3 `adopt` becomes validate-then-commit.**

```ts
const candidate = new Map(this.#adopted);
candidate.set(id, { track, owner, motionId });
try {
  this.#compileTrack?.(track, id);
  this.#graph.replaceGraph(this.#projectSnapshot(candidate));
} catch (error) {
  this.#disposeTrack?.(id); // undo compileTrack; #adopted was never touched
  throw error;
}
this.#adopted.set(id, { track, owner, motionId });
// ...post-commit
```

The key win: on any rejection the id stays **free and immediately reusable**, which is the
behaviour an editor needs when the user fixes their typo and hits enter again.

**S1.4 Make the post-commit phase non-throwing by construction.**
In `adopt`, pre-check what the post-commit calls would throw on (`#instances.has(id)`, motion
existence, `Motion` duplicate track id) _before_ `replaceGraph`. A throw after commit leaves the
runtime in a state no caller can reason about, which is the whole class of bug being fixed here.

**S1.5 Add the invariant as an executable rule.** A regression test per mutating op:
_"after a rejected mutation, the runtime is byte-for-byte re-usable"_ — retry succeeds, `seek`
returns `"ready"` not `"error"`, no `"destroyed"` patch was delivered, and `graph.order` is
unchanged.

---

### S2 — Identity and freeze hardening _(fixes A2 and A3)_

**S2.1 Freeze on ingest.** `adopt()` must deep-freeze the incoming `TrackDefinition` (reuse
`validate-v5`'s `deepFreeze`) before storing it, and should route it through the same `validateV5`
track-level rules authored tracks get, not just `validateKeyframes`. Cheapest correct version:
validate + freeze a defensive clone, store the clone, and return it as `handle.track` so the
caller can tell which object the runtime is actually keyed on. This closes the in-place-mutation
hole and makes the identity contract enforceable rather than aspirational.

**S2.2 Never cache a failure.** In `IncrementalGraphBuilder`:

- Do not cache `undefined`. If `collectTrack` returns `undefined`, leave the cache untouched so
  the diagnostic is re-emitted on every build.
- Cache the node **and** the diagnostics `collectTrack` produced for it, and re-push those
  diagnostics on every cache hit. Cheapest correct version: only populate the cache when
  `collectTrack` produced **zero** diagnostics for that track; otherwise recompute. Bad tracks are
  rare and the cache exists for the happy path.
- Change the type to `WeakMap<TrackDefinition, GraphNode>` so "absent" and "cached failure" stop
  being the same state.

Without S2.2, S1 is not sufficient: A1 leaves poisoned objects in `#adopted` today, and once S1
lands, a _rejected_ `adopt()` still leaves a poisoned WeakMap entry for the caller's object — so
if the caller re-submits the **same object** after fixing nothing, the second attempt can now
succeed with the bad edge silently dropped. **S1 and S2.2 must ship together.**

---

### S3 — Motion lifecycle at runtime _(fixes P2)_

**S3.1 `ProjectRuntime` owns a motion store.**

```ts
readonly #motions = new Map<string, MotionDefinition>();  // seeded from project.motions in ctor
```

`#projectSnapshot()` maps over `#motions` instead of `this.#project.motions`. `adopt()`'s guard
becomes `this.#motions.has(motionId)`. This is the P3a slice that P2 structurally requires.

**S3.2 Two new hooks, mirroring the existing four.**

```ts
readonly createMotion?: (definition: MotionDefinition) => void;
readonly destroyMotion?: (motionId: string) => void;
```

**S3.3 Two new ops, both two-phase per S1.**

- `addMotion(definition)`: candidate = `#motions` + definition (with `tracks: []`) → `replaceGraph`
  → commit (`#motions.set`, `createMotion` hook). Motion id validation is free:
  `IncrementalGraphBuilder` already runs `assertAuthoredMotionId` and emits `motion-duplicate`.
- `destroyMotion(motionId)`: candidate = `#motions` − motionId → `replaceGraph` → commit
  (`#motions.delete`, `destroyMotion` hook, drop its `#adopted` entries). Removing a motion
  removes its tracks from the candidate, so `observation-unknown-source` **already** rejects the
  destroy if anything outside still observes one of them. Same free dependant guard as S1, no new
  code. Decide explicitly whether a non-empty motion is rejected outright or removed with its own
  tracks; recommend **reject if it still has tracks**, consistent with the no-cascade constraint.

**S3.4 `Engine.load()`: extract, don't duplicate.** Lift the existing per-motion loop body into a
local `buildMotion(definition, entries): Motion` closure and call it from both the load loop and
the new `createMotion` hook. It already closes over `clock`, `scheduler`, `tracks`, and the
hoisted `runtime` (`let runtime; runtime = new ProjectRuntime(...)` is exactly the late-binding
pattern the hook needs), so no new plumbing is required. Verified as safe:

- A motion created with `tracks: []` is legal. `Motion`'s constructor loop is a no-op,
  `#totalDuration()` floors at `1`, and `invalidate` is already guarded by
  `if (currentIds.length > 0)`.
- Tracks join afterwards through the existing path: `adopt(track, owner, { motionId })` →
  `addMotionTrack` → `motion.addTrack(...)`, which also seeds progress with stagger applied.
- `onClockTick` iterates `motions.values()`, so a new motion is driven from the next tick with no
  extra wiring, and `destroyMotion` → `motion.dispose()` + `motions.delete(id)` removes it from
  the fanout. `disposeTracks: false` means disposing a motion correctly does **not** dispose
  tracks that `ProjectRuntime` still owns.
- Call `motion.play()` for runtime motions, matching `load()`, or `Motion.signal` and `onTick`
  will both silently no-op (`#scheduleProgress` returns early unless `#playing` and
  `state === "mounted"`).

**S3.5 Do not expose a trigger that does nothing.** Per **A.5**: accept `definition.trigger` for
schema fidelity, wire `createManualTriggerPort()` as `load()` does, and document that
`type: "scroll" | "time"` is inert in core today. Scroll/time drivers are separate work.

---

### S4 — Unify the store and replace `owner` with capability handles _(P3)_

**S4.1 Ingest at construction (3a): endorsed.** In the `ProjectRuntime` constructor, ingest every
`project.motions[].tracks[]` and `project.freeTracks[]` entry into the same store `adopt()` writes
to, then never read `#project` for graph content again. Two hard requirements:

- **Preserve object identity on ingest.** Schema track objects are already frozen by `validateV5`;
  store the _same references_, do not clone them, or you throw away every `WeakMap` cache hit and
  turn `load()` into a full rebuild.
- **Name the tradeoff in the design doc, as the brief asks.** Today schema content is
  _structurally_ undeletable. After the collapse it is deletable subject only to op gating. That
  is the right call for an editor and the wrong call for a fixed-schema consumer; it should be a
  recorded decision in `docs/DECISIONS.md`, not an emergent side effect.

**Ingestion must not auto-mount — endorsed, with evidence.** `Engine.load()` today eagerly
_compiles_ every node (`for (const nodeId of nodes.keys()) compile(nodeId)`) and mounts none;
consumers call `handle.mount(nodeId)` themselves. Auto-mounting on ingest would silently make
every existing node a flush member, changing what every `load()` caller's first tick publishes.
Keep compile-eager / mount-explicit exactly as it is. Ingestion is storage only.

**Follow-on:** once nothing reads `#project` for content, the public `get project()` getter becomes
a lie (it returns the frozen original, not current state). Replace it with a
`snapshot(): ProjectDefinition` built from the live store — an editor needs that for save/export
anyway, and it is one line once `#projectSnapshot` is pure (**S1.1**).

**S4.2 Capability handles instead of `owner` (3b): endorsed.**

```ts
export interface TrackHandle {
  readonly id: string;
  readonly track: TrackDefinition;   // the frozen object the runtime is keyed on (S2.1)
  remove(): void;
  replace(next: TrackDefinition): void;  // see D1
}
addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
```

The brief's rationale holds and the precedent is real: `PatchRegistry.subscribeNode` already
returns an unsubscribe closure rather than requiring a caller-held token. Keep `id` on the handle
— `mount`, `unmount`, `seek`, `subscribe`, and `get` are all id-based and stay that way.

**One requirement the brief omits: stale handles must be inert, not dangerous.** Ids are freed and
immediately re-adoptable, so this is a live ABA hazard: hold a handle, `remove()`, re-create the
same id, then call the stale handle's `remove()` again. A capability scoped by id alone would
destroy the _new_ node. Spec it explicitly: mint a private monotonic token per node instance,
store it alongside the entry, and make `remove()`/`replace()` **no-ops** (not throws) when the
token no longer matches the live entry. Idempotent removal is also just better editor ergonomics
than today's `not adopted` throw on double-destroy.

**S4.3 Keep `adopt`/`destroyAdopted` as thin deprecated wrappers** over `addTrack`/`handle.remove()`
for one release. `apps/react-demo` uses `useRef({}).current` as `owner`; it keeps working
untouched, and the migration is mechanical.

---

## Part C — Decisions, and where this document disagrees with the brief

### D1 — `replaceTrack` instead of destroy-and-recreate for edits **(main pushback)**

The brief's lean is: edit a track by destroying it and re-adopting under the same id, accepting a
transient `"destroyed"` → `"ready"` patch pair. **Don't.** Two reasons, both grounded in verified
code:

1. **`"destroyed"` is contractually terminal.** `v5.ts`: _"`"destroyed"` is terminal: the node has
   been evicted from the graph and will never publish again."_ React consumers are built to tear
   down on it. Using a terminal signal as an edit notification means every keyframe nudge unmounts
   and remounts the consumer's DOM element — losing element state, restarting CSS transitions, and
   flashing. On a drag interaction that is unusable.
2. **A non-destructive swap is strictly cheaper and already supported.** `GraphBinding.#applyDelta`
   diffs by node id and `edgeKey`. If the node id is unchanged, `previousIds` and `nextIds` both
   contain it: no `removeNode`, no eviction, no terminal patch, and only the genuinely changed
   edges are removed/added. Meanwhile the _new object identity_ forces a fresh `collectTrack`, so
   the WeakMap stays correct by construction, and `replaceGraph` clears
   `#publisherNodes`, so the compose closure is re-resolved.

```ts
replaceTrack(handle: TrackHandle, next: TrackDefinition): void {
  // phase 1
  const candidate = new Map(this.#store);
  candidate.set(handle.id, { ...entry, track: freeze(validate(next)) });
  this.#graph.replaceGraph(this.#projectSnapshot(candidate));   // rejects invalid edits, no damage
  // phase 2
  this.#store.set(handle.id, ...);
  this.#disposeTrack?.(handle.id);
  this.#compileTrack?.(next, handle.id);
  this.#graph.invalidate([handle.id]);   // publishes a normal "ready" patch, same revision chain
}
```

Constraint: `next.id` must qualify to the same node id; reject otherwise. Renaming is a
destroy-plus-create, and _that_ legitimately produces a terminal patch.

### D2 — `addObserve`/`removeObserve` do not need their own API or their own capability

The brief leaves edge ownership open. It resolves itself: in the data model, an edge is **not a
first-class entity** — it lives in `TrackDefinition.observes` on the observer, and `collectTrack`
derives `GraphEdge`s from it with `observerId` fixed to that node. Therefore the capability to add
or remove an edge _is_ the capability to replace the observer's track. Implement
`addObserve`/`removeObserve` as sugar over **D1**'s `replaceTrack` on the observer, and the
"can an edge be owned?" question disappears along with any need to collapse edge storage
separately in 3a.

### D3 — Keep "reject when a dependant exists", but add a dependants read for the UI

The constraint is right and, as the brief says, free. But the diagnostic an editor gets back is
`observation-unknown-source at ~/elbow: Unknown observation source "~/root"` — phrased from the
builder's perspective, naming the node you _didn't_ touch, describing a source as "unknown" when
the user's actual mistake was deleting something still in use. Shipping that string into a
confirmation dialog is not acceptable.

Cheap fix, no new bookkeeping: the committed `GraphIR` already holds every edge.

```ts
dependantsOf(nodeId: string): readonly string[] {
  return this.#graph.state /* or binding.graph */.nodes
    .filter((n) => n.edges.some((e) => e.sourceId === nodeId))
    .map((n) => n.id);
}
```

Expose it as a read-only query so the editor can pre-flight ("`elbow` depends on `root`") and
still let the transactional destroy be the actual enforcement. Read-only, no invariants at risk.

### D4 — Confirmed settled: no cascade delete

Agreed and verified as free. Worth stating once in `docs/DECISIONS.md` so it does not get
re-litigated: rejection is enforced by graph validation, not by a bespoke dependants check, which
means it cannot drift out of sync with the graph.

---

## Part D — Evidence gates

One test per finding, all against real `Engine` + real `PluginRegistry` (no test-local stand-ins),
consistent with this repo's existing evidence-gate convention:

1. **P1** — adopt `root`, adopt `elbow` observing `root`, `destroyAdopted(root)` throws; then
   assert: `seek(root)` still `"ready"`, no `"destroyed"` patch delivered, a second
   `destroyAdopted(root)` throws the _same_ error (not `not adopted`), and destroying `elbow`
   first then `root` both succeed.
2. **A1** — `adopt` a track whose `observes.source` does not exist → throws; then assert the same
   id is immediately re-adoptable with a valid definition, and `Engine`'s track map did not grow.
3. **A2** — after `adopt`, mutating the caller's original track object must not change what the
   graph composes (or must throw, post-freeze).
4. **A3** — `adopt` a track with a malformed projection → throws; then perform any second
   mutation and assert it **also** fails with the same diagnostic, rather than succeeding with a
   silently dropped edge.
5. **S3** — from `{ schemaVersion: 5, motions: [] }`: `addMotion`, `addTrack` into it,
   `signal(motionId, { progress })`, observe a `"ready"` patch, `destroyMotion` rejected while it
   has tracks, then accepted once empty.
6. **D1** — `replaceTrack` with changed keyframes: assert values change, revision increments, and
   **no** `"destroyed"` patch is delivered.

Reproduction scripts belong under `packages/core/test/scratch/` (run with `npx tsx`) while
investigating, and should be promoted into real tests before merge — the ghost-node and
cache-poisoning cases are exactly the kind that regress silently.

---

## Part E — Open questions for the author

1. **Motion destroy semantics:** reject a non-empty `destroyMotion`, or remove it together with
   its own tracks? The latter is a cascade _within_ an ownership boundary, which may be acceptable
   where a cross-node cascade is not. Recommendation: reject; make the editor delete tracks first.
2. **Does `validateV5` apply to runtime-created content?** Recommended yes (**S2.1**), which means
   accepting its cost on every `addTrack`. If that is measurable in an editor's drag loop, split
   validation into a cheap structural pass plus an opt-in deep pass.
3. **Should `"destroyed"` remain the only terminal status?** If node _renames_ become common in the
   editor, a distinguishable `"replaced"` status would let consumers migrate state rather than
   tear down. Out of scope here; flagging it before `"destroyed"` accretes more meanings.
4. **Scroll/time triggers:** are they in scope for the editor at all? If yes, that is a separate
   port-level piece of work (`TriggerPort` implementations plus `Engine` wiring), and it should be
   planned before `addMotion`'s signature freezes.
