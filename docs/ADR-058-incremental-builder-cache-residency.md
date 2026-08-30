# ADR-058: The incremental builder owns its cache residency, and residency is the last built project

**Status:** Accepted, 2026-08-30

**Context.** `IncrementalGraphBuilder.#trackCache` grew and never shrank. It is keyed `owner/ownerId/trackId` through `#cacheKey`, and `TrackDefinition` identity is compared only on a hit, so identity is a freshness check rather than the key. `delete` ran in exactly one place: the reject path in `#collect`, when `collectTrack` returned no node or complained. No removal path reached the builder at all. `ProjectRuntime.#removeTrack` calls `replaceGraph`, then `evictNode`, then `disposeTrack`; `destroyMotion` and `ProjectRuntime.dispose` are the same shape. None of them own builder state, and none of them should have to.

The blast radius is one `GraphNode` per node id ever built, retained for the builder's lifetime, and a `GraphNode` holds `track`, so the authored `TrackDefinition` is retained with it. `defaultGraphBuilder` is stateless, so this was the incremental adapter's defect alone and nothing in `ports/graph-builder.ts` was wrong.

One correction to the diagnosis in issue #225. It says `engine.ts` constructs one builder per Engine. `Engine.load` constructs it, so it is one builder per loaded project, and an Engine that loads twice already had two. That makes the retention per project runtime rather than per Engine, which shrinks the leak's ceiling and does not change its shape: a long-lived project that churns tracks still grows without bound.

**Decision.** Mark and sweep, per build, inside the adapter. `#collect` records every key it reaches in a per-build `visited` set, whether that key hit, missed, or was rejected. After the motion loop and the free-track loop, and before `finalizeGraph`, `#sweep` deletes every cache key absent from `visited`. `build` receives the whole project, so the cache is a pure function of the last project handed in, and the residency rule is stated on the class: once a build completes, the cache holds an entry for exactly the tracks that build walked.

The sweep runs on the completion path only, and never from a `finally`. A build that throws leaves `visited` partial, and a partial set says nothing about residency: sweeping against it would evict live entries and cost hits with no correctness gain. `EV-6` pins that as a count, with a project whose motion tracks are walked and whose free tracks throw before they are reached.

The two deletes stay separate and are documented as separate. The reject-path `delete` answers "walked, but incomplete". The sweep answers "not walked at all". Collapsing them into one condition is how this leak comes back.

`get cachedNodeCount(): number` is added to `IncrementalGraphBuilder` and deliberately not to `GraphBuilder`, which keeps its single `build` method. It is the observable the residency rule is asserted through; without it the only way to test eviction is GC probing, which is flaky and not worth owning. It is not public surface: `adapters/index.ts` re-exports `graph-builder/default` and not this module, and no export map entry, entrypoint, or boundary allow-list entry moves.

Cost is O(cache size) per build, and the cache is bounded by the last project's track count, which the build already walks. No new allocation shape, no new failure shape, no new public surface.

**Alternatives rejected.** An `evict(nodeId)` method on the `GraphBuilder` port, called from `#removeTrack`, `destroyMotion` and `dispose`. It widens a one-method build port with cache-lifecycle knowledge exactly one adapter has, and forces `ProjectRuntime` and `GraphRuntime` to route eviction through `GraphBinding` for a concern neither owns. It also needs three call sites to stay in step forever, which is the bug class being fixed, and `nodeId` is not the cache key: the key is built from `track.id` before validation, so every caller would reconstruct a key the builder owns.

A `WeakMap` keyed on `TrackDefinition`, rejected twice over. One definition legitimately backs two node ids when it is shared across motions, as the existing doc comment says, so the definition alone cannot be the key; and the cached `GraphNode` holds a strong reference back to the definition, so a value-to-key reference keeps the entry alive as long as the map is. That is the classic `WeakMap` footgun, not a fix.

An LRU or a size cap. A cap makes retention smaller rather than correct, and it evicts live entries under churn. The correct residency set is exactly the tracks in the last built project, and the builder already knows it.

**Consequences.** One `IncrementalGraphBuilder` shared across two projects thrashes to a permanent miss, because each build sweeps the other project's entries. Correctness is unaffected and throughput is not. Ownership becomes explicit rather than implied by the constructor: one builder instance per project, which is what `Engine.load` already does, and `EV-7` pins the cost so a later reader finds it stated rather than surprising.

Nothing enters `ports/`, `runtime/`, or `graph/`. The fix lives entirely in the adapter ring, which is the honest test of whether this was ever a runtime concern: it was not.

**Evidence.** Cases `EV-1` through `EV-8`. `EV-1` is residency across a rebuild that drops a track and a rebuild that drops all of them; `EV-2` and `EV-3` drive removal and `destroyMotion` through `ProjectRuntime` with no eviction hook anywhere; `EV-4` is node identity across an unchanged rebuild, without which every eviction case passes against a builder that caches nothing; `EV-5` is freshness at a re-authored node id; `EV-6` is the throwing build beside a completed-and-rejected one; `EV-7` is the sharing cost; `EV-8` walks the `finalizeGraph` corpus with one shared builder so that every rebuild is an evicting one and no diagnostic moves.

No red or green CI run is archived on `ci-logs` for this record yet, and this section says so rather than citing one. The branch carries the test commit before the source commit, so the red run is the first CI run on it.
