# Motion5 rescue wave plan

This is the execution plan for `rescue/restore-motionpath-parity`. It is intentionally separate from `RECOVERY.md`: `RECOVERY.md` is the short handoff, this file is the detailed work queue.

## Operating rules

Every slice gets its own branch from the latest rescue tip and one PR back into rescue. Do not combine unrelated slices. Before production changes, add a test derived from motionpath behavior and run it against the parent commit. Save the red run in the PR or workflow artifact. Then implement the smallest adapter that preserves motion5's graph and TypeScript boundaries. A slice is green only when its real acceptance test passes and the relevant cheap CI checks are green.

The oracle is evidence, not a wholesale-copy target. Inspect the named oracle files, record the behavior matrix in the test, and adapt the behavior at motion5's ports.

## Wave 0: establish the rescue loop

**Goal:** make recovery resumable and observable.

- Create `rescue/restore-motionpath-parity` from frozen `main`.
- Add one `progress/<slice>.md` file per slice using `progress/README.md`.
- Add the manual audit workflow and run it on baseline before fixing code.
- Record the initial mutation score, failing-first result, and missing acceptance mappings.

**Exit gate:** baseline report is attached to the rescue tracking issue; no code slice is marked complete from the baseline run.

## Wave A: close publisher and runtime hardening

**Goal:** eliminate state and notification behavior that can make downstream output depend on traversal timing.

### A1: final-value memo consistency

- Branch: `fix/A1-final-value-memo`.
- Area: `packages/core/src/runtime/graph-publisher.ts`.
- Invariant: same-flush input consumers see exactly the post-output-merge value that was published.
- Evidence: same-flush output-overlay test and partial-seed fallback test.
- Status at baseline: implemented in commit `1d59c087231c3c3f9c3cde6822d34835ee94705a`.

### A2: preserve subscriber errors

- Branch: `fix/A2-subscriber-errors`.
- Area: `packages/core/src/runtime/patch-registry.ts` and publisher recovery path.
- Invariant: every subscriber gets a turn, the registry resets, and the first original error is rethrown.
- Evidence: throwing node subscriber, throwing batch subscriber, and registry reuse tests.
- Status at baseline: implemented in commit `1d59c087231c3c3f9c3cde6822d34835a`.

### A3: define and guard reentrancy

- Branch: `fix/A3-publisher-reentrancy`.
- Area: publisher/runtime notification boundary.
- Decision: choose one explicit policy, preferably queue one follow-up invalidation for the next tick rather than recursively opening a batch.
- Evidence: subscriber-triggered flush test proves no recursive batch error and proves the follow-up invalidation is not lost.
- Oracle check: inspect motionpath's scheduler/notification behavior; do not invent a second clock.

**Wave A exit gate:** A1, A2, and A3 tests pass; registry is reusable after all listener failures; no subscriber can recursively open a second batch.

## Wave B: restore the value compiler

**Goal:** make authored stops and plugin contributions produce the values that the real interpolator owns.

### B1: prepare-stage contribution

- Branch: `fix/B1-track-contribution`.
- Areas: `packages/core/src/domain/track.ts`, plugin contract, interpolation config.
- Invariant: matching `stage: "prepare"` plugins run once during Track construction, before interpolator creation; their merged output is compiled.
- Evidence: contributor transforms an authored stop and the composed value reflects the transformed stop; contributor is not rerun on every compose.
- Oracle checks: plugin contribution and keyframe compilation paths in motionpath.

### B2: real GSAP multi-stop compilation

- Branch: `fix/B2-gsap-stop-compilation`.
- Area: `packages/core/src/adapters/interpolator/gsap.ts`.
- Invariant: a multi-stop property has correct state at progress `0`, `0.5`, and `1`.
- Evidence: real GSAP devDependency, no interpolation fake, multi-stop numeric and at least one non-numeric contract case where supported.
- Required correction: do not initialize the proxy with the final stop and do not pass only the last value to `timeline.to()`.

**Wave B exit gate:** real GSAP and prepare-stage contribution tests pass, with authored stops compiled into an adapter-owned timeline. B2 depends on B1.

## Wave C: make consumers shippable

**Goal:** prove runtime output can be consumed safely by React and DOM boundaries.

### C1: React store lifecycle

- Branch: `fix/C1-react-store-lifecycle`.
- Area: `packages/react/src/patch-store.ts`.
- Invariant: subscribe, remove the last listener, then subscribe again still receives future patches.
- Evidence: exact 0-to-1 resubscription test, unchanged snapshot identity test, and StrictMode-style subscribe/unsubscribe lifecycle test.

### C2: React public hook and exports

- Branch: `fix/C2-react-public-surface`.
- Areas: `packages/react/src/index.ts`, hook, package dependencies.
- Invariant: a real hook reads the external store through `useSyncExternalStore` without leaking core internals.
- Evidence: render/update test and public-import smoke test.
- Dependency: C1.

### C3: DOM adapter contract

- Branch: `fix/C3-dom-contract`.
- Area: `packages/core/src/adapters/dom.ts` and plugin metadata boundary.
- Invariant: target resolution, dirty diff, omitted-key removal, blocked/error no-op, internal-key filtering, output serialization, and cache teardown match the documented contract.
- Evidence: multi-target test, serializer test, and explicit `clear(target)` test. Treat `clear()` as cache teardown, not style restoration, unless the contract is deliberately changed.
- Oracle check: `motionpath/packages/core/src/adapters/domRenderer.js`.

**Wave C exit gate:** React lifecycle and public import tests pass; DOM behavior matches the oracle and has explicit clear coverage.

## Wave D: make governance executable

**Goal:** stop documentation-only acceptance criteria from becoming green claims.

### D1: discover consumer packages

- Branch: `fix/D1-boundary-discovery`.
- Area: `scripts/boundary-scan.mjs`.
- Invariant: scanner discovers every package under `packages/` except `core`; no hardcoded consumer list.
- Evidence: temporary package fixture is scanned and its internal import is detected.

### D2: planted scanner self-test

- Branch: `fix/D2-boundary-self-test`.
- Areas: boundary scanner and test.
- Invariant: the shipped `scan(tempFixtureRoot)` detects planted consumer leakage, renderer import, and bad public export; direct predicate tests are supplementary only.
- Evidence: weaken each relevant scanner rule and confirm the planted test goes red.

### D3: acceptance and failing-first evidence

- Branch: `fix/D3-evidence-gates`.
- Areas: acceptance map/checker and manual audit workflow.
- Invariant: every acceptance item maps to a test ID that exists and ran; new tests fail on the parent commit before implementation.
- Evidence: uploaded reports for baseline and rescue runs.

**Wave D exit gate:** scanner self-test is capable of failing, acceptance mappings are complete, and the manual workflow produces durable artifacts.

## Wave E: prove the real product path

**Goal:** make “recovered” mean a real consumer path works.

### E1: required declaration build

- Branch: `fix/E1-required-build`.
- Areas: package TypeScript config, package exports, `.github/workflows/ci.yml`.
- Invariant: every package emits declarations and public imports resolve without source-internal paths.
- Evidence: required GitHub job and public-import smoke test.
- Bundling remains deferred; declaration build plus public import is the current acceptance boundary.

### E2: end-to-end fixture

- Branch: `fix/E2-end-to-end-proof`.
- Areas: integration test and adapter wiring.
- Invariant: authored project -> real GSAP interpolation -> real/manual clock tick -> patch publication -> DOM adapter writes a real numeric value.
- Evidence: one honest fixture that fails on baseline and passes on rescue; depends on A1, B1, B2, C3, and E1's public surface.

### E3: mutation baseline and ratchet

- Branch: `fix/E3-mutation-gate`.
- Areas: Stryker configuration and workflow.
- Invariant: mutations in runtime and adapters cannot silently survive; first run establishes the measured baseline, later runs cannot regress.
- Evidence: uploaded mutation report and a checked-in threshold generated from observed data, never invented.

**Wave E exit gate:** required build, end-to-end fixture, and cheap PR checks are green; mutation score is recorded and ratcheted; only then update status docs and merge rescue into `main`.

## Final merge checklist

- All wave PRs merged into rescue in dependency order.
- Every slice has a `progress/` record with commit, tests, oracle paths, and CI artifacts.
- `main` branch protection requires format, typecheck, contract tests, boundaries, build, and end-to-end checks.
- Mutation testing is manual or nightly until fast enough for PRs, but its report is never ignored.
- `docs/SESSION-STATUS.md` describes only verified behavior.
- Open a single final PR from rescue into `main`.
