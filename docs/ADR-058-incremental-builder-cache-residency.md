# ADR-058: The incremental builder owns its cache residency, and residency is the last built project

**Status:** Accepted, 2026-08-30

**Context.** `IncrementalGraphBuilder.#trackCache` grew, never shrank. Keyed `owner/ownerId/trackId` via `#cacheKey`; `TrackDefinition` identity compared only on hit → freshness check, not key. `delete` ran one place: reject path in `#collect`, `collectTrack` returned no node or complained. No removal path reached builder. `ProjectRuntime.#removeTrack`: `replaceGraph` → `evictNode` → `disposeTrack`; `destroyMotion`, `ProjectRuntime.dispose` same shape. None own builder state, none should.

Blast radius: one `GraphNode` per node id ever built, retained builder lifetime; `GraphNode` holds `track` → authored `TrackDefinition` retained. `defaultGraphBuilder` stateless → incremental adapter's defect alone; `ports/graph-builder.ts` wrong nowhere.

Correction to issue #225: it says `engine.ts` constructs one builder per Engine. `Engine.load` constructs it → one per loaded project; Engine loading twice already had two. Retention per project runtime, not Engine: smaller leak ceiling, same shape -- long-lived project churning tracks still grows unbounded.

**Decision.** Mark and sweep, per build, inside adapter. `#collect` records every key reached in per-build `visited` set -- hit, miss or reject. After motion loop and free-track loop, before `finalizeGraph`, `#sweep` deletes cache keys absent from `visited`. `build` receives whole project → cache pure function of last project; residency rule on class: after build, cache holds exactly tracks that build walked.

Sweep completion path only, never `finally`. Throwing build leaves `visited` partial; partial set says nothing about residency → sweep evicts live entries, costs hits, gains no correctness. `EV-6` pins count: motion tracks walked, free tracks throw before reached.

Two deletes stay separate, documented separate. Reject-path `delete`: "walked, but incomplete". Sweep: "not walked at all". One condition brings leak back.

`get cachedNodeCount(): number` on `IncrementalGraphBuilder`, deliberately not `GraphBuilder`, which keeps single `build`. Observable residency asserted through; without it eviction test needs GC probing -- flaky, not worth owning. Not public surface: `adapters/index.ts` re-exports `graph-builder/default`, not this module; no export map entry, entrypoint, boundary allow-list entry moves.

Cost O(cache size) per build; cache bounded by last project's track count, already walked. No new allocation shape, failure shape, public surface.

**Alternatives rejected.** `evict(nodeId)` on `GraphBuilder` port, called from `#removeTrack`, `destroyMotion`, `dispose`. Widens one-method build port with cache-lifecycle knowledge exactly one adapter has; forces `ProjectRuntime` and `GraphRuntime` to route eviction through `GraphBinding` for concern neither owns. Three call sites in step forever -- bug class being fixed. `nodeId` not cache key: key built from `track.id` before validation → every caller reconstructs key builder owns.

`WeakMap` keyed on `TrackDefinition`, rejected twice over. One definition legitimately backs two node ids when shared across motions → definition alone cannot be key; cached `GraphNode` holds strong reference back to definition → value-to-key reference keeps entry alive as long as map. Classic `WeakMap` footgun, not fix.

LRU or size cap: cap makes retention smaller, not correct; evicts live entries under churn. Correct residency set is exactly tracks in last built project, which builder already knows.

**Consequences.** One `IncrementalGraphBuilder` shared across two projects thrashes to permanent miss: each build sweeps other project's entries. Correctness unaffected, throughput not. Ownership explicit, not constructor-implied: one builder instance per project, what `Engine.load` already does; `EV-7` pins cost so later reader finds it stated, not surprising.

Nothing enters `ports/`, `runtime/`, `graph/`. Fix lives entirely adapter ring -- honest test whether this was ever runtime concern: it was not.

**Evidence.** Cases `EV-1` through `EV-8`. `EV-1` residency across rebuild dropping one track and rebuild dropping all; `EV-2`/`EV-3` drive removal and `destroyMotion` through `ProjectRuntime`, no eviction hook anywhere; `EV-4` node identity across unchanged rebuild -- without it every eviction case passes against builder caching nothing; `EV-5` freshness at re-authored node id; `EV-6` throwing build beside completed-and-rejected one; `EV-7` sharing cost; `EV-8` walks `finalizeGraph` corpus with one shared builder → every rebuild evicts, no diagnostic moves.

No red or green CI run archived on `ci-logs` for this record yet; this section says so rather than citing one. Branch carries test commit before source commit → red run is first CI run on it.
