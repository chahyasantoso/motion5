# Motion5 rescue wave plan

This is the **single live checklist** for `rescue/restore-motionpath-parity`. `RECOVERY.md` is the short restart handoff; this file owns the current status, next action, wave plan, evidence links, and exit gates. If the prose below conflicts with the table, the table is the current status.

## Live status dashboard

| ID | Slice | Status | Branch | Related code / tests | Commit or evidence |
|---|---|---|---|---|---|
| W0 | Rescue loop and audit baseline | Not started | `rescue/restore-motionpath-parity` | [RECOVERY.md](RECOVERY.md), [progress template](progress/README.md), planned [.github/workflows/recovery-audit.yml](.github/workflows/recovery-audit.yml) | No workflow run yet |
| A1 | Final-value memo consistency | Done on main, verify on rescue | `fix/A1-final-value-memo` | [graph-publisher.ts](packages/core/src/runtime/graph-publisher.ts), [consistency test](packages/core/test/integration/publisher-output-merge-consistency.test.ts) | [1d59c087](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a) |
| A2 | Preserve subscriber errors | Done on main, verify on rescue | `fix/A2-subscriber-errors` | [patch-registry.ts](packages/core/src/runtime/patch-registry.ts), [subscriber test](packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts) | [1d59c087](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835a) |
| A3 | Guard subscriber-triggered reentrancy | Not started | `fix/A3-publisher-reentrancy` | Publisher/runtime notification boundary | No evidence yet |
| B1 | Prepare-stage plugin contribution | Not started | `fix/B1-track-contribution` | [track.ts](packages/core/src/domain/track.ts), [plugins.ts](packages/core/src/domain/plugins.ts) | No evidence yet |
| B2 | Real GSAP multi-stop compilation | Not started | `fix/B2-gsap-stop-compilation` | [gsap.ts](packages/core/src/adapters/interpolator/gsap.ts), [adapter tests](packages/core/test/contract/adapters.test.ts) | No evidence yet |
| C1 | React store resubscription | Not started | `fix/C1-react-store-lifecycle` | [patch-store.ts](packages/react/src/patch-store.ts), [store test](packages/react/test/patch-store.test.ts) | No evidence yet |
| C2 | React hook and public exports | Not started | `fix/C2-react-public-surface` | Planned [react index](packages/react/src/index.ts) and hook | No evidence yet |
| C3 | DOM metadata, serialization, and clear coverage | Not started | `fix/C3-dom-contract` | [dom.ts](packages/core/src/adapters/dom.ts), [DOM test](packages/core/test/integration/dom-patch-apply.test.ts), oracle [domRenderer.js](https://github.com/chahyasantoso/motionpath/blob/1bc8d044347fa3b1732e6dad3bc8437ad23e2687/packages/core/src/adapters/domRenderer.js) | No evidence yet |
| D1 | Discover consumer packages | Not started | `fix/D1-boundary-discovery` | [boundary-scan.mjs](scripts/boundary-scan.mjs) | No evidence yet |
| D2 | Planted boundary self-test | Not started | `fix/D2-boundary-self-test` | [boundary test](packages/core/test/unit/scripts/boundary-scan.test.ts), [fixtures](scripts/boundary-scan-fixtures.mjs) | No evidence yet |
| D3 | Acceptance and failing-first evidence gates | Not started | `fix/D3-evidence-gates` | Planned acceptance checker and manual audit workflow | No evidence yet |
| E1 | Required declaration build | Not started | `fix/E1-required-build` | [.github/workflows/ci.yml](.github/workflows/ci.yml), package exports | No evidence yet |
| E2 | Real end-to-end product path | Not started | `fix/E2-end-to-end-proof` | Planned integration fixture | No evidence yet |
| E3 | Mutation baseline and ratchet | Not started | `fix/E3-mutation-gate` | Planned Stryker config and audit artifact | No baseline yet |

### How to update this table

After each slice PR merges into rescue, update exactly this table first:

- `Not started` -> `In progress` when the branch exists and work has begun.
- `In progress` -> `Red test recorded` when the failing-first run is saved.
- `Red test recorded` -> `Green, pending wave gate` when the real acceptance test and cheap CI pass.
- `Green, pending wave gate` -> `Done` only when the slice's dependencies and wave exit gate pass.
- Put the PR or commit link in the final column, plus links to durable CI artifacts when available.

The detailed `progress/<slice>.md` files are optional supporting logs, not a second status system. If one exists, link it from the relevant row. Do not mark a slice done from code inspection or a generic green test suite.

## Operating rules

Every slice gets its own branch from the latest rescue tip and one PR back into rescue. Do not combine unrelated slices. Before production changes, add a test derived from motionpath behavior and run it against the parent commit. Save the red run in the PR or workflow artifact. Then implement the smallest adapter that preserves motion5's graph and TypeScript boundaries. A slice is green only when its real acceptance test passes and the relevant cheap CI checks are green.

The oracle is evidence, not a wholesale-copy target. Inspect the named oracle files, record the behavior matrix in the test, and adapt the behavior at motion5's ports.

## Wave 0: establish the rescue loop

**Goal:** make recovery resumable and observable.

- Create `rescue/restore-motionpath-parity` from frozen `main`.
- Add one `progress/<slice>.md` file per slice using `progress/README.md` when detailed evidence is useful.
- Add `.github/workflows/recovery-audit.yml` as the manual audit workflow described below.
- Run the workflow on baseline before fixing code.
- Record the initial mutation score, failing-first result, and missing acceptance mappings.

**Exit gate:** baseline report is attached to the rescue tracking issue; no code slice is marked complete from the baseline run.

## Manual audit workflow specification

This workflow is planned but does not exist yet. Do not tell a future session that it was run until the file is committed and a GitHub Actions run has produced artifacts.

**File:** `.github/workflows/recovery-audit.yml`

**Trigger:** `workflow_dispatch` with a required `ref` input, defaulting to `main`. The checkout must use that ref explicitly.

**Jobs and artifacts:**

- `contract`: install locked dependencies and run real GSAP, DOM, React lifecycle, boundary, and end-to-end contract tests; upload the test result.
- `mutation`: run Stryker only against runtime and adapter source; upload the HTML and JSON reports. The first run establishes the baseline, not a made-up pass threshold.
- `acceptance`: run the acceptance-map checker and upload the mapping report.
- `failing-first`: compare the changed ref with its parent, run only newly added tests against the parent implementation, and upload the red/green evidence. If the implementation is a refactor with no meaningful new test, require an explicit documented exception instead of silently skipping.
- `build`: run declaration emission and public-import smoke tests; upload logs.

The workflow should report a nonzero failure for broken evidence, but it should not hide the artifacts behind `continue-on-error`. A failed audit is useful only if its report survives the failure.

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
- Status at baseline: implemented in commit `1d59c087231c3c3f9c3cde6822d34835ee94705a`.

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

### D2: planted boundary self-test

- Branch: `fix/D2-boundary-self-test`.
- Areas: boundary scanner and test.
- Invariant: the shipped `scan(tempFixtureRoot)` detects planted consumer leakage, renderer import, and bad public export; direct predicate tests are supplementary only.
- Evidence: weaken each relevant scanner rule and confirm the planted test goes red.

### D3: acceptance and failing-first evidence

- Branch: `fix/D3-evidence-gates`.
- Areas: acceptance map/checker and manual audit workflow.
- Invariant: every acceptance item maps to a test ID that exists and ran; new tests fail on the parent implementation commit before implementation.
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
- Invariant: mutations in runtime and adapters cannot silently survive; first run establishes the baseline, not a made-up pass threshold.
- Evidence: uploaded mutation report and a checked-in threshold generated from observed data, never invented.

**Wave E exit gate:** required build, end-to-end fixture, and cheap PR checks are green; mutation score is recorded and ratcheted; only then update status docs and merge rescue into `main`.

## Final merge checklist

- All wave PRs merged into rescue in dependency order.
- Every slice has a `progress/` record with commit, tests, oracle paths, and CI artifacts.
- `main` branch protection requires format, typecheck, contract tests, boundaries, build, and end-to-end checks.
- Mutation testing is manual or nightly until fast enough for PRs, but its report is never ignored.
- `docs/SESSION-STATUS.md` describes only verified behavior.
- Open a single final PR from rescue into `main`.
