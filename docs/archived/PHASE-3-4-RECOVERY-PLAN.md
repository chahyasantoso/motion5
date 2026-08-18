# motion5 Phase 3 and Phase 4 recovery plan

**Goal:** preserve the strong graph kernel, restore real animation behavior, and reach a defensible Phase 4 exit.  
**Starting point:** `main` @ `5d751a0`.  
**Rule:** no more green tests that assert placeholders. Every behavior slice starts with a test that fails on the current tree.

## Stop conditions

Do not close Phase 4, do not make performance required, and do not build packaging acceptance on top of the current runtime until these are true:

- a fake interpolator produces deterministic non-empty values;
- a GSAP adapter produces the same value contract;
- authored stops compile into an adapter-owned proxy/timeline;
- plugins are resolved from authored keys and compose real output;
- one Track instance survives multiple flushes;
- input and output observations use the same final-value cache;
- React can unsubscribe and resubscribe safely;
- a planted boundary violation makes the actual scanner fail;
- the required build job and end-to-end fixture are green.

## Phase 0R: restore the value contract

### 0R-1: decide and record the proxy contract

**Owner:** `ports/interpolator.ts`, fake port, GSAP adapter.  
**Change:** add `readonly state` to `InterpolationTimeline`. The adapter owns the mutable object; Track reads it but never mutates it.  
**Acceptance:** fake interpolation of numeric stops produces expected values at progress `0`, `0.5`, and `1`; GSAP contract exposes equivalent state; no sampler method is added.  
**Failing-first test:** replace the current value-free port assertion with a state assertion.

### 0R-2: restore typed authored stops

**Owner:** `contract/v5.ts`, validator, fixtures.  
**Change:** define keyframes as properties with `{ stops: [{ p, v, ease? }] }`; validate monotonic positions, unique positions, finite progress, and endpoint warnings. Keep unsupported keys explicit through diagnostics.  
**Acceptance:** malformed stops fail before Track/timeline construction; valid stop fixtures are immutable and deterministic.

## Phase 1R: restore compilation and plugin ownership

### 1R-1: restore plugin metadata and contribution

**Owner:** `domain/plugins.ts`, new/updated plugin contract.  
**Change:** restore `keys`/`claimsKey`, `inputs`, `contribute`, `compose`, `stage`, `priority`, `outputs`, `internalKeys`, and optional `prepare/load` only where required. Resolve each track's plugins once at construction.  
**Acceptance:** unknown authored key/plugin produces a load diagnostic; duplicate output ownership fails before runtime; plugin order is deterministic.

### 1R-2: compile a Track once

**Owner:** `domain/track.ts`, compiler helper, `engine.ts`, `project-runtime.ts`.  
**Change:** compile authored keyframes once into a proxy-backed timeline. Track composition reads timeline state, folds input observations, runs plugins, then applies output merges. Do not create Tracks in `GraphRuntime.flush()`.  
**Acceptance:** two flushes reuse the same Track/timeline; dispose kills exactly that timeline; input cache works across flushes.

### 1R-3: wire progress to the graph

**Owner:** `Motion`, `ProjectRuntime`, `GraphRuntime`.  
**Change:** preserve one clock owner, but connect Motion/trigger progress changes to Track `setProgress` and publisher invalidation. Do not add a second RAF/ticker.  
**Acceptance:** advancing the fake clock changes Track progress, marks the affected node dirty, and publishes its downstream closure once.

## Phase 2/3 hardening: keep the kernel, close the leaks

### 2/3-1: final-value memo consistency

**Owner:** `runtime/graph-publisher.ts`.  
**Change:** memoize the final post-output-merge value used for publication, or maintain clearly named raw and final caches. Downstream inputs must see the same value whether an upstream was seeded this flush or came from the registry.  
**Acceptance:** partial-seed test covers an upstream with output edges and a same-tick downstream input.

### 2/3-2: preserve original flush failures

**Owner:** `runtime/patch-registry.ts`, publisher flush path.  
**Change:** close an open batch without replacing subscriber errors. Add a narrow `isBatchOpen`/`closeIfOpen` internal path.  
**Acceptance:** a throwing node subscriber and a throwing batch subscriber preserve their original errors and leave the registry reusable.

### 2/3-3: prove reentrancy behavior

**Owner:** `runtime/graph-publisher.ts` or `runtime/graph-runtime.ts`.  
**Change:** choose one behavior: return immediately and defer to next tick, or queue one follow-up flush. Document it and implement the guard.  
**Acceptance:** a subscriber-triggered flush cannot recursively open a second batch or lose the next invalidation.

### 2/3-4: repair boundary self-testing

**Owner:** `scripts/boundary-scan.mjs`, boundary test.  
**Change:** test the shipped `importsCoreInternals` predicate directly and run `scan(tempFixtureRoot)` over a planted consumer leak, renderer import, and bad export. Discover consumer packages dynamically instead of hardcoding only `react`.  
**Acceptance:** weakening any scanner rule makes the test fail.

## Phase 4R: adapters and consumers

### 4R-1: repair the DOM adapter contract

**Owner:** `adapters/dom.ts`, new writer port, plugin metadata.  
**Change:** require per-node target resolution; make writer injection explicit; filter internal keys and serialize outputs from plugin metadata; implement target cache cleanup for teardown. Do not write a transform composer.  
**Acceptance:** multi-node target resolution, dirty diff, omitted-key removal, blocked/error no-op, serialization, and clear-on-teardown tests.

### 4R-2: repair React subscription lifecycle

**Owner:** `packages/react/src/patch-store.ts`, hooks.  
**Change:** resubscribe when the first listener returns after the store has been fully unsubscribed. Add the missing hook and concurrency tests; include React as an actual package dependency if hooks are shipped.  
**Acceptance:** subscribe → unsubscribe → subscribe receives future patches; StrictMode double mount has no leaked or dead source subscription; unchanged revisions return the same frozen snapshot.

### 4R-3: define the consumer-facing public surface

**Owner:** `packages/core/src/index.ts`, package exports, API allow-list.  
**Change:** expose the documented runtime entrypoints needed by a real consumer: Engine, adapter factories, plugin factory/registry, and any intended runtime controls. Do not expose graph internals or PatchRegistry.  
**Acceptance:** an end-to-end test imports only documented package exports and constructs a real runtime without source-internal paths.

### 4R-4: build the actual P4-05 gate

**Owner:** `.github/workflows/ci.yml`, package build configuration, integration fixture.  
**Change:** add required `build` job that compiles every package and runs public import smoke tests; add the end-to-end fixture from authored project to real interpolation, real clock, patch, and applied output.  
**Acceptance:** build job is required and green; fixture fails on the current tree and passes after restoration.

## Documentation truth pass

After behavior is repaired:

- update `SESSION-STATUS.md` with the actual branch/commit and completed gates;
- strike or rename absent evidence files in `IMPLEMENTATION-PLAN.md`;
- amend `PHASE-3-IMPLEMENTATION-REVIEW.md` so the R5 deferral is resolved honestly;
- remove the README claim that real Track composition is shipped until the end-to-end gate proves it;
- record the benchmark decision and new advisory expiry;
- add the evidence-name checker only after the named tests are real, and require failing-first proof in review.

## Suggested merge order

1. 0R-1 proxy state contract.
2. 0R-2 typed stops and validation.
3. 1R-1 plugin contract and resolver.
4. 1R-2 Track compiler and one-lifetime ownership.
5. 1R-3 progress-to-invalidation wiring.
6. 2/3-1 memo consistency.
7. 2/3-2 batch error preservation.
8. 2/3-3 reentrancy guard.
9. 2/3-4 boundary self-test.
10. 4R-1 DOM adapter contract.
11. 4R-2 React lifecycle.
12. 4R-3 public surface.
13. 4R-4 required build and end-to-end gate.
14. Documentation truth pass.

## Definition of done

Phase 4 is complete only when the build job is required and green, the end-to-end fixture proves non-empty interpolated values, the same Track/timeline survives multiple flushes, graph invalidation is observable, React and DOM consumers pass lifecycle tests, and docs match the shipped behavior.

The project is salvageable. **Preserve Phase 2/3 graph ownership; restore the motionpath value/compiler/plugin path; then prove the seam with one real end-to-end test.**
