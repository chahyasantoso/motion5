# motion5 Phase 3 and Phase 4 consolidated audit

**Date:** 2026-08-10, Asia/Jakarta  
**Repository:** `chahyasantoso/motion5`  
**Audited tree:** `main` @ `5d751a0`  
**Predecessor references:** `chahyasantoso/motionpath` `master` @ `1bc8d04` and `v5-pr-15-observation-graph` @ `c629e9b`  
**Method:** source and documentation review. No test run is claimed by this document.

## Executive verdict

Phase 3 and Phase 4 are **not complete**. The remediation work repaired much of the graph infrastructure, but it did not restore the behavior that makes the runtime an animation engine.

The core conclusion is:

> **motionpath's graph layer was broken, but its value pipeline worked. motion5 ported the graph repair successfully, then rebuilt the working value pipeline incompletely.**

motion5 currently has a credible graph kernel and publication boundary, but its runtime publishes empty or input-only values. It does not yet interpolate authored keyframes, resolve the plugin pipeline, or drive real progress through the graph.

## 1. Lineage: what motionpath actually did

### The working v4 value pipeline

motionpath's runtime had four real stages:

1. **Compile:** `buildTrackTween()` resolved plugins for authored keyframe keys, called `plugin.contribute()`, converted stops into GSAP keyframes and tween vars, seeded a plain proxy object, and built a paused GSAP tween over that proxy.
2. **Tick:** `Track.progress(p)` advanced the tween. GSAP mutated the proxy in place.
3. **Compose:** `Track.getSnapshot()` read the proxy; `Track.compose()` folded input observations, ran plugin `compose()` methods, and merged output observations.
4. **Render:** `domRenderer()` applied plugin serializers, removed internal keys, diffed against the previous patch, removed omitted keys with `undefined`, and called `gsap.set()`.

The timeline did not need to return values. The animated proxy **was** the value source.

### The broken v4 graph layer

The motionpath v4.3 audit identified A1-A10:

- publisher disconnected from real Track invalidation;
- no downstream dirty propagation;
- multiple graph representations with no authoritative bridge;
- destroyed sources left dependent edges behind;
- failed flushes lost pending work;
- input and output edges could overwrite each other;
- IDs were only locally enforced;
- invalid graphs could return partial order data;
- documentation claimed batched publishing was complete when it was not;
- application code could bypass orchestration.

The proposed fix introduced `GraphBinding`, explicit edge identity, persistent publisher cache, lifecycle invalidation, atomic graph mutation, and retry behavior.

That v4.3 implementation did **not** land on motionpath master. `GraphBinding` exists there only in the plan and v5 work. The old `GraphPublisher` remains a small order-and-dirty helper.

## 2. What motionpath v5 adds

The motionpath v5 branch is the clearest architectural source for the intended successor design.

It adds or formalizes:

- `ObservationGraph` as the immutable graph value object;
- `GraphBinding` as the bridge between live Track edges and publisher metadata;
- `GraphPublisher` with topological scheduling, persistent cache, downstream invalidation, blocked branches, retry state, and atomic graph replacement;
- Track-owned observation edges, reverse observers, lifecycle callbacks, cycle guards, and destruction handshake;
- explicit graph input modes and plugin-owned required inputs;
- recursive Motion scheduling and Motion-owned composite lifecycle;
- renderer-neutral clock, scheduler, and interpolator ports;
- deeply immutable patch values and revision-aware publication.

The v5 branch also confirms that the intended interpolation model remains proxy-backed GSAP composition, not a sampler-returning timeline.

## 3. What motion5 fixed correctly

Do not reopen these parts without evidence of a regression:

- **F-1 input resolution:** dirty nodes fall back to the registry's last published upstream values.
- **F-2 output merge direction:** output values merge over the local composition in canonical edge order, using a fresh object.
- **F-5 membership gating:** membership starts empty and only attached nodes seed default flushes.
- **F-6 package boundary:** `@motion5/core` and `@motion5/core/internal` exist; React imports through the internal entrypoint; `PatchRegistry` remains unexported.
- **F-10 batch state:** open/closed state is explicit and empty batches are represented correctly.
- **Graph kernel:** qualified IDs, immutable IR, canonical ordering, transactional binding, rollback discipline, diagnostics, and ownership separation are the strongest part of motion5.
- **R8 adapter shape:** target resolution, diffing, omitted-key removal, and patch immutability are present when the adapter is given a resolver and writer.

## 4. What is not fixed

### Critical: R5 does not produce animation values

`Engine.load()` now creates `Track` objects, but `Track.compose()` starts with inputs and runs an empty plugin list. The `InterpolationTimeline` port exposes only duration, progress, and kill. It has no animated state, and `Track` never reads one.

The fake interpolator and GSAP adapter therefore validate a value-free contract. The current headless test confirms the defect by asserting `{}` and progress `0`, rather than asserting a non-trivial interpolated value and advancing progress.

`Engine.load()` also passes the authored `TrackDefinition` directly to the interpolator. No authored stops become GSAP keyframes, no proxy is created, and no timeline is built over values.

**Result:** the old `{ nodeId }` placeholder became an empty payload. That is not real composition.

### Critical: Track lifetime is recreated on every flush

`GraphRuntime.flush()` calls the composition resolver for every graph node on every flush. `Engine` constructs a new `Track` inside that resolver. This creates new timelines repeatedly, overwrites the previous entry in the disposal map, and leaks prior timelines.

It also means Track input caching cannot work reliably: every Track is new and dirty, so R3's recomposition fix is effectively bypassed.

**Required ownership:** resolve Tracks once per committed graph/runtime lifetime. `ProjectRuntime` must own them, and flush must reuse them.

### High: the plugin contract was reduced too far

motionpath's plugin contract included `contribute`, authored keys, input declarations, stage and priority ordering, output merge modes, serializers, internal keys, lazy loading, and preparation. motion5's `PluginDefinition` contains only `name` and `compose`, and `Engine` never resolves plugins from authored keyframes.

This means motion5 cannot correctly support authored keyframes, FK-style inputs, output serialization, plugin-owned internal state, or compile-time output collision checks.

### High: typed stops and compile-time keyframe processing are missing

`TrackDefinition.keyframes` is `Record<string, unknown>`. There is no typed `{ p, v, ease }` stop contract, no monotonic or unique stop validation, no missing-endpoint warnings, no plugin contribution phase, and no compile-time keyframe-to-tween conversion.

This is the actual missing behavior behind the empty runtime.

### High: boundary self-test still has the old failure mode

The scanner was widened, but the test does not call `importsCoreInternals`, and its real-tree assertion only proves that the current tree is clean. It does not run the shipped scanner against a planted violating tree.

The R7 exit condition is therefore unmet.

### High: React acceptance is absent

`@motion5/react` has a patch store but no completed hook suite. The store unsubscribes from the source when its last listener leaves and never resubscribes if a later listener arrives. StrictMode or remount cycles can leave the store permanently stale.

### High: Phase 4 build gate does not exist

P4-05 requires an end-to-end fixture and a required build job. The current CI has quality, integration, boundaries, and advisory performance jobs only.

### Medium: memo and published values can diverge

The publisher memo stores the raw composition before output edges merge, while the registry stores the merged published patch. A downstream node seeded in the same flush can observe a different upstream value than it observes in a later flush. Memoize the final published value or explicitly separate raw and published caches.

### Medium: documentation still overclaims or leaves stale contracts

The plan still names absent evidence files and absent module paths. The Phase 3 review still calls composition resolver wiring deferred. The README claims real Track composition even though no interpolated state is produced. The performance budget remains advisory through 2026-08-17 without a recorded decision.

### Medium: flush error handling can mask subscriber failures

`closeBatch()` clears open state before notification. If a subscriber throws, the publisher catch path calls `closeBatch()` again and replaces the original error with `No patch batch is open.` Preserve the original failure and close only when the batch is still open.

### Medium: DOM adapter defaults to the old single-target behavior

The adapter is capable of target resolution, but its default resolver sends every node to the stage. Target resolution should be required for multi-node rendering. Writer injection should become an explicit port, and serializers/internal keys should come from plugin metadata rather than hardcoded filters.

### Medium: reentrancy claim is still unimplemented

The implementation plan claims a flush triggered during a flush returns immediately or queues safely. `GraphPublisher` itself has no explicit reentrancy guard. The runtime guard exists in the v5 predecessor design, but the motion5 claim needs an executable test and a clear chosen behavior.

## 5. Answers to the open questions

### Interpolator design

Use the motionpath model. Do not add a sampler and do not make Track own interpolation.

The interpolator should create a timeline over an adapter-owned mutable state object:

```ts
interface InterpolationTimeline {
  readonly duration: number;
  readonly state: Readonly<Record<string, unknown>>;
  progress(): number;
  progress(value: number): void;
  kill(): void;
}
```

`Track.compose()` should read `timeline.state`, fold input values, run resolved plugins, and return a renderer-neutral patch. The GSAP adapter should build a paused tween over a proxy; the fake should expose deterministic state for tests.

### DOM adapter scope

Ship it, but make the resolver required, make the writer a real port, and source filtering/serialization metadata from plugins. Do not hand-build transform or filter composition. The renderer should pass dirty values to the writer/GSAP.

### Public surface before P4-05

Expose the actual runtime boundary needed by an end-to-end consumer: `Engine`, adapter factories, plugin factory/registry, and the documented runtime entrypoints. Otherwise P4-05 must use forbidden source-internal imports.

### Performance budget

Extend the advisory period with a written reason and a new date beyond the Phase 0/1 restoration work. Do not promote a benchmark that currently measures an empty value pipeline into a required gate.

### Phase status

Do not close Phase 4. Reopen Phase 0/1 for the value contract, plugin compilation, typed stops, and runtime lifecycle. Keep the graph kernel from Phase 2/3, then rebuild P4-05 after the runtime carries real values.

## 6. Final architecture judgment

motion5's best work is the graph ownership model. Its biggest mistake was treating the value pipeline as disposable implementation detail instead of preserving the working proxy/compiler/plugin design from motionpath.

The project is not a failed rewrite. It is a strong graph substrate attached to an incomplete animation substrate. Save the project by restoring the missing value path, not by rewriting the graph again.
