# Code review: `rescue/restore-motionpath-parity` (post-E3)

**Reviewed commit:** `f048a58` · **Oracle:** motionpath `v5-pr-15-observation-graph` (`c629e9b`)
**Date:** 2026-08-12

**Method:** full read of `packages/core/src`, `packages/react/src`, `scripts/`, `.github/workflows/`, and every test file, plus the oracle's `Track.js`, `GraphPublisher.js`, `BuildTrackTween.js`, and `domRenderer.js`. Nothing was executed (no runner is available on this recovery), so every claim below is traceable to source, not to a run. Findings that need a runner to confirm are marked as such.

## Verdict

**Do not open the rescue → main PR yet.**

The architecture is genuinely good. Graph ownership, transactional binding, canonical ordering, and failure containment are real, well-factored, and well-tested. But the *value pipeline* and the *renderer edge* are the two things this rescue existed to fix, and both still contain correctness bugs. Three governance gates (E1 build, D3 acceptance, W0 failing-first) can pass while the property they gate is false.

| #          | Severity | Finding                                                              |
| ---------- | -------- | -------------------------------------------------------------------- |
| P0-1       | Blocking | Tick-counter collision permanently kills the clock after any `seek()` |
| P0-2       | Blocking | Production GSAP timeline is never paused → second ticker, stale memo  |
| P0-3       | Blocking | Multi-property stop timing collapses onto shared ordinal segments     |
| P0-4       | Blocking | DOM writer cannot write transforms; omitted-key removal removes nothing |
| P1-5..12   | High     | Shallow change detection, half-copied listener sets, undrainable deferred flush, dual reentrancy policy, graph internals on the public surface, validation off the product path, inverted self-reference rule, duplicated validation owners |
| P2         | Medium   | Dead `sourceRevisions`, inconsistent publisher snapshot, O(graph) per-frame allocation, repeated deep freezes, value loss on error patches, dead and buggy `Motion`/`createTrigger` |
| G-1..G-7   | High     | Build, acceptance, failing-first, and mutation gates measure the wrong thing |
| X-1..X-3   | High     | Unported oracle behavior nobody owns: input projection, plugin output ownership, `contribute()` contract |

---

## P0-1 · `seek()` permanently kills the clock

`packages/core/src/runtime/graph-runtime.ts`:

```ts
invalidate(seeds) { return this.flush(seeds, this.#lastTick + 1); }
#onTick(event) {
  if (event.tick <= this.#lastTick) throw new RangeError("Clock ticks must be strictly increasing.");
  ...
}
```

`#lastTick` is a single counter serving two unrelated identities: the clock's frame number and a synthetic invalidation sequence. `ProjectRuntime.seek()` → `invalidate()` pushes `#lastTick` past the clock's own counter. The next real tick then satisfies `event.tick <= #lastTick` and throws, from inside the clock's listener loop.

Neither clock isolates listeners, and `adapters/browser-clock.ts` reschedules *after* dispatch:

```ts
for (const listener of [...listeners]) listener(event);
handle = source.requestFrame(frame);   // never reached if a listener throws
```

So one `seek()` before the first frame produces a `RangeError` on frame 1, the RAF is never rescheduled, and **every animation in the project is dead for the page's lifetime**.

The same class of failure applies to the A2 rethrow path: `PatchRegistry.closeBatch` deliberately rethrows the first subscriber error, and `GraphRuntime.#onTick` does not catch it, so one buggy React subscriber also freezes the RAF loop forever. A2 hardened the registry and left its only caller unprotected.

Why no test caught it: `engine-headless.test.ts` ("keeps one clock owner") calls `seek()` and then never ticks; `end-to-end.test.ts` never ticks at all.

**Fix.** Split the identities. `tick` belongs to the clock; batch identity should be a separate monotone `#sequence` owned by the registry. `invalidate()` must not synthesize a tick: flush at the current tick, or hand the seed to the scheduler so it lands on the next real frame (see P1-7). Independently, `#onTick` must be non-throwing (catch, publish a diagnostic, continue), and `browser-clock` must reschedule in a `finally` before dispatching. Regression test: `mount → seek → clock.tick() × 3`, assert three batches and no throw.

## P0-2 · The real GSAP timeline is never paused

`packages/core/src/adapters/interpolator/gsap.ts`:

```ts
const timeline = gsap.timeline();   // not { paused: true }
```

The oracle is explicit. `BuildTrackTween.js` ends with `gsap.to(proxy, { keyframes, ...vars, duration, paused: true })`.

Unpaused, GSAP's global ticker drives the proxy on its own clock, which violates non-negotiable rule 4 (one clock owner per project) and mutates `timeline.state` between flushes while `Track.#dirty` is `false`. `Track.compose()` only recomputes when `#dirty` (set solely by `setProgress`) or when inputs change, so the published value becomes a race between two clocks and the memo hands out stale frames.

This survived because **no test executes that line.** `adapters.test.ts`, `gsap-multi-stop.test.ts`, and `end-to-end.test.ts` each hand-roll a `GsapTimelineLike` wrapping `gsap.timeline({ paused: true })` inside the test file. The "real GSAP contract job" verifies a timeline the tests constructed, not the one the adapter constructs.

**Fix.** Use `gsap.timeline({ paused: true })` in the adapter. Move the seam up: `createGsapInterpolator(gsap)` already types `GsapLike` as the real namespace, so fixtures should pass `gsap` directly and `createRealGsapInterpolator` should be deleted from the tests. Its existence is the bug's camouflage. Also make `to` non-optional on `GsapTimelineLike`: `timeline.to?.(...)` means a timeline missing `to` silently animates nothing, and one `adapters.test.ts` case depends on exactly that.

## P0-3 · Per-property stop timing collapses onto shared ordinal segments

`compileKeyframes()` builds segments indexed by stop *ordinal*, shared across all properties:

```ts
for (const [key, property] of Object.entries(keyframes)) {
  ...
  for (let index = 1; index < stops.length; index += 1) {
    segment[key] = stop.v;
    segmentDurations[index - 1] = Math.max(0, stop.p - previous.p);  // last property wins
    if (stop.ease !== undefined) segmentEases[index - 1] = stop.ease; // ditto
  }
}
```

Two distinct bugs:

1. **Cross-property timing corruption.** `x` on `[0, .5, 1]` and `y` on `[0, .25, 1]` share `segmentDurations`, so whichever key `Object.entries` yields last dictates both properties' timing. Same for `ease`. The oracle raises `Ease collision on track "…"` rather than letting one silently win.
2. **Positions are treated as deltas, not absolute positions.** `stops: [{ p: 0.2, v: 0 }, { p: 1, v: 100 }]` produces one segment of length `0.8` starting at `t = 0`, so the leading hold disappears. Trailing holds are lost the same way.

The B2 test uses a single property on a uniform grid, the one shape where ordinal segments happen to be correct.

**Fix.** Port the oracle's compilation strategy in shape: build one percent-keyed map across all properties (`{ "0%": {...}, "25%": {...}, "100%": {...} }`) and emit a single `timeline.to(proxy, { keyframes: map, duration, paused: true })`. GSAP percent keyframes are per-property correct by construction, absolute by definition, and carry per-keyframe `ease`. Port the oracle's ease-collision and output-collision rejections as motion5 diagnostics. New contract test: two properties on different grids, asserted at `p = 0, 0.2, 0.25, 0.5, 1`.

## P0-4 · The DOM writer cannot write transforms, and omitted-key removal removes nothing

`packages/core/src/adapters/dom.ts`:

```ts
function defaultWriter(target, values) {
  for (const [key, value] of Object.entries(values)) {
    if (key in target.style || key.startsWith("--")) target.style[key] = value;
    else target[key] = value;
  }
}
```

The oracle wrote through `gsap.set(target, dirty)`. Consequences:

- `x`, `y`, `rotation`, `scale`, `rotationX`, `rotationY`, `z` (the entire motionpath use case) are not CSS properties, so they fall to `target[key] = value` and become expando JS properties on the element. **Nothing renders.**
- The removal path sets `dirty[key] = undefined` and assigns `undefined` into a real `CSSStyleDeclaration`, which is a silent no-op. `clear()` is documented as cache teardown only, so nothing else restores it either.

Both pass today because C3's test injects a recording writer and asserts the *call*, and E2 animates `opacity`, the one property for which `key in target.style` is true and a numeric assignment works.

**Fix.** Keep core renderer-neutral but stop shipping a default writer that cannot render. Either move the real writer into a `@motion5/dom` consumer package that may import `gsap` and use `gsap.set` (matching the oracle, and legal under the boundary scanner's consumer rules), or implement transform composition plus `style.removeProperty(key)` for removals inside the adapter. Then test against a real element in `jsdom`/`happy-dom`, asserting `getComputedStyle` or `style.transform` rather than a spy. A spy-only renderer test cannot fail on a rendering bug.

---

## P1 findings

### P1-5 · Registry change detection is shallow, so nested values republish every frame

`patch-registry.ts#sameRecord` compares with `Object.is` per key. Any node with an input observation publishes a *nested* record (`values.fromA = {...}`, freshly allocated each compose, which is exactly what the A1 test asserts), so `samePatch` is always false: the revision bumps, every listener fires, React re-renders, and the DOM diff churns on every flush. `equalValues` in `domain/values.ts` already implements the correct structural compare and is not used here. `sameDiagnostics` is `JSON.stringify` on both sides, an allocation plus a key-order dependency in the hottest path in the system.

**Fix.** Structural compare for `values` and `sourceRevisions`; field-wise compare for diagnostics.

### P1-6 · `closeBatch` copies half of what it means to copy

```ts
const nodeListeners = new Map(this.#nodeListeners);   // shares the Sets
const batchListeners = new Set(this.#batchListeners); // real copy
```

The node-listener `Set`s are still live during iteration, so a listener that unsubscribes (React unmount, StrictMode) or subscribes mid-notification mutates the collection being walked, and the two listener kinds behave differently for the same event.

**Fix.** Snapshot both to arrays before notifying.

### P1-7 · A3's queued follow-up can never drain without a clock tick

`GraphRuntime.flush` defers reentrant seeds into `#pendingSeeds` and drains them "on the next flush". Nothing schedules that flush. For a scroll- or manual-driven project with no ticking clock, the follow-up sits queued forever; the "not lost" invariant only holds in the test's `clock.tick()` world. Meanwhile `Engine` validates a `Scheduler` and never uses it: the only consumer is the unwired `Motion`.

**Fix.** Give `GraphRuntime` the scheduler and `schedule(() => this.flush(drained))` at defer time. That adds no clock (the scheduler is an injected seam) and makes A3's promise real. Test: defer with **zero** clock ticks, flush the scheduler, assert the follow-up published.

### P1-8 · Two policies for one invariant

`GraphRuntime` *defers* a reentrant flush and returns a warning batch; `GraphPublisher` *throws* on the same condition. Both are reachable from a subscriber, because `GraphRuntime` publicly exposes `registry`, `publisher`, and `binding`.

**Fix.** Pick one. The runtime is the only flush entry point; the registry and publisher guards become internal assertions.

### P1-9 · Graph internals are on the public surface (non-negotiable rule 7)

`index.ts` exports `Engine`. `Engine.load(): ProjectRuntime` → `.graph: GraphRuntime` → `.registry: PatchRegistry`, `.publisher`, `.binding: GraphBinding`. So `new Engine(o).load(p).graph.registry.publish(...)` is public API, at runtime and in the `.d.ts` closure the E1 job emits.

`boundary-scan.mjs` cannot see this: it allow-lists *names* in `index.ts`. It also cannot see `export * from "./runtime/patch-registry"`, because `extractExportNames` only matches `export {…}` and `export const|function|class|interface|type`.

**Fix.** `Engine.load()` returns a narrow `ProjectHandle` (mount, unmount, seek, subscribe, dispose) and the classes stay internal. Add a scanner rule that walks the emitted `index.d.ts` import closure and fails when anything under `runtime/` or `graph/` is reachable. Plant an `export *` fixture so the rule can fail.

### P1-10 · The authored-stop validation the brief demanded exists, but not on the product path

`validate-v5.ts#validateKeyframes` correctly checks finite, range, monotonic, unique, missing-start, and missing-end. Nothing on `Engine.load → GraphBinding → buildGraphIR` calls `validateV5`. The GSAP compiler's `readStops` silently *filters out* malformed stops; the fake casts `stops as readonly FakeStop[]` unchecked. So `p: NaN`, descending positions, or duplicate positions animate something arbitrary and diagnose nothing.

Two further leaks in the same area: `validateV5` returns `value: input as ProjectDefinition` with no clone, and `buildGraphIR` stores `track` by reference inside a frozen node, so "immutable, validated snapshot" is neither for authored data. And `prepareConfig` merges plugin `contribute()` output into keyframes *after* any validation would have run, so contributed stops are never checked at all.

**Fix.** `Engine.load` validates and rejects, or accepts only a branded `ValidatedProject` that `validateV5` alone can mint. Deep-freeze on accept. Re-validate post-contribution. Make `readStops` diagnose instead of filter.

### P1-11 · `observation-self-reference` is inverted

```ts
if (source === ownerId || qualifiedSource === `${ownerId}/${ownerId}` || qualifiedSource === ownerId)
```

`ownerId` is the *motion* id. A track observing a sibling track that happens to be named after its motion (`hero/arm` observes `hero`) is falsely rejected as self-reference, while an actual self-reference (`arm` observes `arm`) is not caught here at all and only trips `hasCycle`.

**Fix.** Compare against the observer's own qualified id. `ir.ts` already does this correctly.

### P1-12 · Duplicated, already-drifted validation owners

Observation rules live twice: `contract/validate-v5.ts`, and `graph/ir.ts` + `graph/order.ts`. They disagree on edge identity (`source|role|target` vs `observer|source|role|target`), cycle algorithm (recursive DFS vs iterative Kahn), rule ids (`observation-cycle` vs `graph-cycle`), and the diagnostics produced for the same authored mistake. `ir.ts` claims in a comment that `edgeKey` is "the single spelling of edge identity … every duplicate check and every live-state index keys off this and nothing else"; the validator contradicts it.

**Fix.** One owner. Drop the recursive `hasCycle` (stack depth on deep graphs) in favor of the existing iterative ordering.

---

## P2 · Code smells worth fixing while in here

- **`sourceRevisions` is dead.** `engine.ts` hardcodes `sourceRevisions: {}`, yet the field is in `Patch`, `PublisherComposition`, and `samePatch`. The publisher owns the edges, so it should compute it from `registry.get(sourceId).revision` rather than trusting `compose()`. Populate it there or delete it.
- **The publisher snapshot is internally inconsistent.** `GraphRuntime.flush` does `{ ...graph, nodes: composedNodes }`, leaving `nodeById` pointing at compose-less nodes. Two views of one snapshot disagree. Rebuild both, or drop `nodeById` from `PublisherSnapshot`.
- **Per-frame allocation is O(graph), not O(dirty).** Every flush maps every node into a new frozen object with a new compose closure, and the publisher rebuilds `dependents` and `affected` from scratch even for a single dirty seed. Precompute dependents and compose per *committed* graph, invalidated by `GraphBinding.replace`. That is what "reuse composition functions" was meant to deliver: the Track is reused, the wrapper is not.
- **`freezeValue` re-walks the whole tree per plugin.** `Track.compose` calls it inside the plugin loop and again after it, and each call builds two fresh `WeakSet`s and re-descends the entire value graph. N plugins cost N+1 deep walks per frame per track. Freeze once, after the last plugin.
- **`rendererNeutralState` casts instead of validating.** It strips `_`-prefixed keys and then does `values as ImmutableRecord`. Anything else GSAP parked on the proxy (non-plain objects, functions) flows into `freezeValue`, which *throws* `Unsupported immutable value`. That throw happens inside `compose()`, so the publisher converts a renderer detail into a node `error` patch and blocks the whole downstream closure. Validate and diagnose at the adapter edge; never let proxy shape escalate to a graph failure.
- **Error and blocked patches destroy last-known-good values.** `publish` fills `values: input.values ?? {}`, so an `error` or `blocked` publication overwrites the registry entry with `{}`. A downstream node that later resolves that source through the registry fallback reads `{}` instead of the last good frame, and `sourceProgress` resets to `0`: a visible jump on recovery. Preserve the previous `values` on non-ready statuses, or leave `values` absent so consumers can distinguish "no value" from "empty value".
- **`inputs[edge.target ?? ""]`.** The publisher accepts any `PublisherSnapshot` (it is exported), so a malformed input edge silently writes into the `""` key. In the same block, `memo.get(...)?.values ?? registry.get(...)?.values` yields `undefined` when neither exists, and `compose()` receives a hole with no diagnostic. The oracle's `#prepareGraph` refused to install a graph whose order did not respect an edge; motion5 should diagnose the missing upstream rather than inject `undefined`.
- **Blocked-diagnostic naming is authored-order dependent.** `node.edges.map(e => e.sourceId).find(...)` picks whichever failed upstream comes first in *authored* order, but diagnostics are supposed to be a pure function of qualified ids. Sort by `edgeKey` before `find`.
- **A throwing flush drops the seeds it was asked to publish.** `GraphRuntime.flush`'s catch re-queues `carried` but not `seeds`. Re-queue both, or the follow-up guarantee only covers seeds that were already follow-ups.
- **Tracks can be resurrected after disposal.** `Engine.load`'s `compile()` creates a Track on cache miss, and `disposeComposition` *clears* the cache, so any flush after dispose builds a new Track and a new GSAP timeline that nobody will ever kill. This directly contradicts "the same Track survives multiple flushes and is disposed once". Add a disposed flag to the composition owner and throw.
- **Plugin resolution is lazy per node, so authored-key errors surface at the wrong time.** `compile()` calls `resolveForKeyframes` on first compose and throws a `TypeError` *inside* the flush. A project with an unknown authored key loads clean and then explodes on whatever frame that node first composes, as a `composition-failure` diagnostic instead of a load-time rejection. Resolve and compile every track eagerly in `load()` and return diagnostics.
- **The qualified-id spelling is duplicated a third time.** `engine.ts` builds `` `${motion.id}/${track.id}` `` and `` `~/${track.id}` `` by hand instead of calling `qualifyMotionTrack` / `qualifyFreeTrack`. `graph/ids.ts` exists precisely so this string appears once. Its `compose` resolver also takes an inline structural type and ignores `node.track`, re-looking-up by id and hiding the coupling.
- **`deferredBatch` abuses `Diagnostic.path`.** `path: ids.join(",")` puts a list into a single-path field, so tooling that groups by path sees a synthetic composite key. Use the first seed and put the rest in `ids`.
- **`Motion` and `createTrigger` are dead code, and buggy dead code.** Nothing constructs `Motion`; `Engine` validates a `Scheduler` and never uses one. Inside the dead code: `#onTick` does `position + event.delta`, treating a millisecond delta as progress; `mount()` re-subscribes to the clock without releasing the previous listener (leak); `pause()` does not detach, so `play()` after `pause()` re-enters `mount()` and throws "already mounted"; and `Motion.seek()` sets Track progress with no publisher invalidation. This matters because brief item 4 ("wire Motion/trigger progress to Track progress and publisher invalidation") is satisfied only by `ProjectRuntime.seek`. **Triggers are wired to nothing.** Either wire them (trigger → `ProjectRuntime.seek` → `invalidate`) or delete both files; leaving them is a false claim in code. Note they sit outside the Stryker scope, so the mutation gate is structurally blind to them.

---

## Governance gates: what they certify vs. what they measure

### G-1 · The E1 "declaration build" does not build anything a consumer would use

Both packages declare `"types": "./src/index.ts"` and `exports.default: "./src/index.ts"`: the public entry *is* TypeScript source. The build job then checks that the file named by `types` exists (it does, it is the source) and emits declarations into a throwaway `dist-audit` that nothing imports. "Every package emits declarations and public imports resolve without source internals" passes because the public import *is* a source internal.

**Fix.** Per-package `tsconfig.build.json` with `outDir: dist`, `declaration`, `declarationMap`, and project references; `exports` pointing at `./dist/index.js` plus `./dist/index.d.ts`; and a consumer smoke test that imports the built entry from outside the workspace.

### G-2 · The declaration emit runs over the root config, which includes tests and path aliases

`include: ["packages/**/*.ts"]` pulls every `*.test.ts` into the emit, and `paths` rewrites `@motion5/*` to source, so the emitted `.d.ts` files reference aliases that do not exist for consumers. Green here means nothing about publishability.

### G-3 · The acceptance gate is exactly the anti-pattern the wave plan bans

The spec says "verify every acceptance-map item points to an existing test **and that the test ran**". `acceptance-scan.mjs` calls `access()` and stops. A `describe.skip`, an empty file, or a `test.todo` satisfies it. That is a file-existence checklist that exits zero.

**Fix.** Run vitest with the JSON reporter, then assert each mapped path contributed at least one *passing* test and zero skipped.

### G-4 · The failing-first gate accepts import errors and cannot tell a real red from a broken checkout

The verdict derives from vitest's *exit code* on the base leg. An import-resolution failure, a lockfile mismatch after `git checkout -f "$BASE_SHA"`, or a vitest config error all read as `failed-on-base` → `pass`. The job's own report text admits import-resolution red is weaker evidence, but the verdict does not act on it. Two more holes: `--diff-filter=AM` counts *modified* tests, so weakening an existing assertion qualifies as failing-first evidence; and the shell runs `set -uo pipefail` **without `-e`**, so a failed `git checkout` or `xargs` does not fail the step.

**Fix.** Parse the JSON report, require at least one assertion-level failure in a file whose imports resolved, and add `-e`.

### G-5 · The mutation gate's score reporting is a literal tautology

```bash
SCORE=$(node -p "const r=require('./reports/mutation/mutation.json');r.thresholds&&r.thresholds.high?'reported':'reported'")
```

Both ternary branches return `'reported'`. The job cannot report a score; it only proves a file exists. Separately, `mutation-summary.mjs` computes `killed / total` **including NoCoverage**, a different definition from Stryker's own score, so the 65.43 / 68.79 figures in `STATUS.md` and whatever that script prints are not comparable.

**Fix.** Pick one definition, print it into the fragment, and fail on it.

### G-6 · The ratchet is one global number, so it cannot detect local rot

65.42 across `runtime/**` plus `adapters/**` lets `gsap.ts` decay while `patch-registry.ts` improves. Two Timeout mutants count toward Stryker's score, so the baseline is slightly inflated. Stated plainly: **152 Survived plus 25 NoCoverage in runtime and adapters is where P0-1 through P0-4 live.** Those survivors are not a coverage statistic, they are the bugs.

**Fix.** Per-directory thresholds, a baseline committed to a file, and a diff check that fails on any file-level regression.

### G-7 · E1's exit criterion is not on the required-check path

`ci.yml` runs quality, integration, boundaries, and performance. There is **no build job and no dedicated end-to-end job**, and `performance` is `continue-on-error: true`. The final-merge checklist requires branch protection on "format, typecheck, contract tests, boundaries, build, and end-to-end". Contract and end-to-end are covered only transitively by `npm test`; build is not covered at all outside the manual audit. E1 is marked Done against a workflow file that does not contain the job.

Smaller: `format.yml`, `format-manual.yml`, and `archive-ci-logs.yml` are three workflows doing bookkeeping that `ci.yml` mostly already does. Consolidate.

---

## X · Oracle behavior that was never ported, and nobody owns

### X-1 · Input observations are nested, not projected

The oracle spreads a *projected* contribution into the source object before composition:

```js
const contribution = mapFn(observedSource.compose(undefined, ctx));
if (contribution) source = { ...source, ...contribution };
```

motion5 assigns the upstream's whole values record under a key (`inputs[edge.target] = sourceValues`) and `Track.compose` does `{ ...state, ...inputs }`. A plugin can therefore never see an input as an authored key, and the published record contains a nested object (`{ fromA: { base: 1, overlay: 99 } }`) that reaches the DOM adapter as garbage. This is a parity gap *and* the root cause of P1-5's per-frame churn. The brief's wording ("inputs feed the source object before local composition") describes the oracle, not the code.

**Fix.** Edges carry an optional projection (pick or map); inputs merge flat into the source record; a non-flat input value becomes a compile-time diagnostic.

### X-2 · Plugin output ownership, internal keys, and serializers are declared and never read

`PluginDefinition` carries `outputs`, `internalKeys`, and (per the brief) serializer metadata. `outputs` is used *only* for the duplicate-owner diagnostic in `resolveForKeyframes`; `internalKeys` is read **nowhere**; there is no serializer plumbing at all. The oracle's `domRenderer` called `getInternalKeys()` and `getOutputSerializers()`, while motion5's `dom.ts` hardcodes the `_` prefix and `offset` instead. C3's brief line ("serializer and internal-key metadata") is unimplemented while C3 is marked Done.

**Fix.** Thread `ResolvedPlugins` metadata into the DOM adapter as an option, or delete the fields. Declared-and-unread metadata is worse than absent metadata.

### X-3 · The `contribute()` contract was reduced without saying so

Oracle: `contribute(propKey, stops, trackConfig) → { percentPatch, tweenVars }`, per authored key, with explicit ease-collision, tweenVars-collision, and output-collision rejections. motion5: `contribute(allKeyframes) → unknown`, shallow-merged over the whole keyframe map, no collision checks, no `tweenVars` path, so one contributor can silently overwrite another's authored key and the last registered wins.

Related: `stageRank` recognizes only `"prepare"` and `"compose"`, bucketing everything else at 2, which discards the oracle's `base/filter/media/transform/override` stage vocabulary and leaves `priority` as the only real ordering. Contributed stops also bypass validation entirely (see P1-10).

**Fix.** Per-key contribute with collision diagnostics, or document the reduction explicitly and delete the unused surface.

---

## Recommended order of work

1. **P0-1** clock/tick split, non-throwing `#onTick`, `finally` reschedule. One `seek()` currently bricks the page; nothing else matters more.
2. **P0-2** `paused: true` in the adapter, pass real `gsap` into fixtures, delete `createRealGsapInterpolator` from the tests, make `to` required.
3. **P0-3** percent-keyframe compilation ported from `BuildTrackTween`, plus a two-properties-different-grids contract test.
4. **P0-4** move the real writer into a `@motion5/dom` consumer package using `gsap.set`; test against a real element, not a spy.
5. **X-1** flat projected inputs: unblocks P1-5 and removes the nested-garbage patches.
6. **P1-5, P1-6** structural equality in the registry; snapshot both listener collections.
7. **P1-7, P1-8** scheduler-driven drain; one reentrancy policy, one flush entry point.
8. **P1-9** `ProjectHandle` return type plus a scanner rule that walks the emitted `index.d.ts` closure.
9. **P1-10, P1-12** validation on the product path, a single validation owner, a `ValidatedProject` brand.
10. **G-1, G-3, G-4, G-5, G-7** fix the gates *before* trusting any of them again, then re-dispatch the audit and re-baseline mutation.

## One structural note

Every P0 here shares a single failure mode: **the tests construct the seam they are supposed to be testing.** The GSAP fixture builds its own paused timeline. The DOM test injects its own writer. The acceptance scan checks its own file list. The failing-first gate trusts its own exit code.

The architecture is strong and the discipline around evidence is unusually serious, but the evidence is pointed one layer inside the boundary it claims to prove. Push each fixture out to the real edge (real `gsap`, real element, real vitest report) and these four defects become impossible to reintroduce.

## Status implications

`progress/STATUS.md` currently marks E1 and C3 as `Done`. Both are complete against evidence that does not cover their stated exit criteria (G-1, G-2, G-7 for E1; P0-4 and X-2 for C3). They should return to `Done, gate open` until the gaps above are closed.
