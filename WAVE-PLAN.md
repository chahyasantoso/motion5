# Motion5 rescue wave plan

This file is the **detailed execution plan** for `rescue/restore-motionpath-parity`. It is not a status dashboard. The only live status, next action, branch state, commit links, and evidence links live in [`progress/STATUS.md`](progress/STATUS.md). Update that file, not this one, when work changes.

## Operating rules

Freeze `main`. Create the rescue branch once, then one short-lived fix branch from the latest rescue tip for each slice. Each slice gets a failing-first test derived from the working `motionpath` oracle, implementation, and durable CI evidence before it can be marked complete in `progress/STATUS.md`. Merge slices into rescue in dependency order, then merge rescue into `main` once all wave gates pass.

The oracle is evidence, not a wholesale-copy target. Preserve motion5's graph ownership and TypeScript boundaries while adapting the oracle's working behavior at motion5's ports. A green generic test suite is not proof of a slice.

## Wave 0: establish the rescue loop

**Goal:** make recovery resumable and observable.

- Create `rescue/restore-motionpath-parity` from frozen `main`.
- Implement `.github/workflows/recovery-audit.yml`.
- Run the audit on frozen `main` before fixing runtime code.
- Record mutation score, failing-first result, acceptance gaps, and artifact links in `progress/STATUS.md`.

**Exit gate:** a real GitHub Actions baseline run exists and is linked from W0. Until then, W0 is not complete.

### Manual audit workflow specification

The workflow is planned and does not yet exist. Do not claim it ran until the file is committed and GitHub Actions has produced artifacts.

**File:** `.github/workflows/recovery-audit.yml`

**Trigger:** `workflow_dispatch` with a required `ref` input, defaulting to `main`; checkout must use that ref explicitly.

**Jobs:**

- `contract`: real GSAP contract tests, DOM tests, React lifecycle tests, boundary tests, and end-to-end tests.
- `mutation`: Stryker scoped to `packages/core/src/runtime/**` and `packages/core/src/adapters/**`; upload HTML and JSON reports.
- `acceptance`: verify every acceptance-map item points to an existing test and that the test ran.
- `failing-first`: compare the selected ref with its parent, run newly added tests against the parent implementation, and upload red/green evidence. Require a documented exception for a genuine refactor with no new behavioral test.
- `build`: declaration emission and public-import smoke tests; upload logs.

Failed jobs must still upload their reports. Manual audit measures expensive evidence and does not replace required PR checks. After recovery, format, typecheck, real contract tests, boundaries, build, and end-to-end checks must block merges; mutation testing may remain manual or nightly.

## Wave A: publisher and runtime hardening

**Goal:** eliminate state and notification behavior that can make output depend on traversal timing.

- **A1 final-value memo consistency**, branch `fix/A1-final-value-memo`, area `packages/core/src/runtime/graph-publisher.ts`. Invariant: same-flush input consumers see the post-output-merge value. Evidence: output-overlay and partial-seed tests. Baseline implementation: [`1d59c087`](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a); verify on rescue.
- **A2 preserve subscriber errors**, branch `fix/A2-subscriber-errors`, areas `packages/core/src/runtime/patch-registry.ts` and publisher recovery. Invariant: every subscriber gets a turn, state resets, first original error rethrows. Evidence: node subscriber, batch subscriber, and reuse tests. Baseline implementation: [`1d59c087`](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a); verify on rescue.
- **A3 guard subscriber-triggered reentrancy**, branch `fix/A3-publisher-reentrancy`. Choose and document one policy, preferably queue one follow-up invalidation for the next tick. Evidence: subscriber-triggered flush proves no recursive batch error and no lost follow-up. Inspect motionpath scheduler behavior; do not add a second clock.

**Wave A exit gate:** A1, A2, and A3 evidence passes; registry is reusable after listener failures; subscribers cannot recursively open a second batch.

## Wave B: restore the value compiler

**Goal:** authored stops and plugin contributions produce values owned by the real interpolator.

- **B1 prepare-stage plugin contribution**, branch `fix/B1-track-contribution`, areas `packages/core/src/domain/track.ts`, plugin contract, and interpolation config. Prepare plugins run once during Track construction before interpolator creation; merged output is compiled. Evidence: transformed stop appears in output and contributor is not rerun on compose. Inspect motionpath contribution and compilation paths.
- **B2 real GSAP multi-stop compilation**, branch `fix/B2-gsap-stop-compilation`, area `packages/core/src/adapters/interpolator/gsap.ts`. A multi-stop property must be correct at progress `0`, `0.5`, and `1`. Use real GSAP, no interpolation fake. Do not initialize proxy with the final stop or pass only the last value to `timeline.to()`.

**Wave B exit gate:** real GSAP and contribution tests pass with authored stops compiled into an adapter-owned timeline. B2 depends on B1.

## Wave C: ship the consumer boundaries

**Goal:** prove output can be consumed safely by React and DOM.

- **C1 React store lifecycle**, branch `fix/C1-react-store-lifecycle`, area `packages/react/src/patch-store.ts`. Subscribe, remove the last listener, subscribe again, and receive future patches. Test resubscription, snapshot identity, and StrictMode-style lifecycle.
- **C2 React public hook and exports**, branch `fix/C2-react-public-surface`, areas `packages/react/src/index.ts`, hook, and dependencies. Use `useSyncExternalStore` without leaking core internals. Test render/update and public import. Depends on C1.
- **C3 DOM adapter contract**, branch `fix/C3-dom-contract`, area `packages/core/src/adapters/dom.ts` and plugin metadata. Match target resolution, dirty diff, omitted-key removal, blocked/error no-op, internal-key filtering, output serialization, and cache teardown. Test multi-target, serializer, and explicit `clear(target)`. `clear()` is cache teardown, not style restoration, unless the contract changes. Oracle: [`domRenderer.js`](https://github.com/chahyasantoso/motionpath/blob/1bc8d044347fa3b1732e6dad3bc8437ad23e2687/packages/core/src/adapters/domRenderer.js).

**Wave C exit gate:** React lifecycle/public imports pass; DOM matches oracle with explicit clear coverage.

## Wave D: make governance executable

**Goal:** stop documentation-only acceptance criteria becoming green claims.

- **D1 discover consumer packages**, branch `fix/D1-boundary-discovery`, area `scripts/boundary-scan.mjs`. Discover every package under `packages/` except `core`; no hardcoded list. Test with a temporary consumer fixture.
- **D2 planted boundary self-test**, branch `fix/D2-boundary-self-test`, areas scanner and test. `scan(tempFixtureRoot)` must detect planted consumer leakage, renderer import, and bad export. Direct predicate tests are supplementary. Weakening a scanner rule must make the planted test red.
- **D3 acceptance and failing-first evidence**, branch `fix/D3-evidence-gates`, areas acceptance checker and audit workflow. Every acceptance item maps to an existing test that ran; new tests fail on the parent before implementation. Preserve baseline and rescue artifacts.

**Wave D exit gate:** scanner self-test can fail, mappings are complete, and audit artifacts are durable.

## Wave E: prove the real product path

**Goal:** make “recovered” mean a real consumer path works.

- **E1 required declaration build**, branch `fix/E1-required-build`, areas package TypeScript config, exports, and `.github/workflows/ci.yml`. Every package emits declarations and public imports resolve without source internals. Bundling remains deferred.
- **E2 end-to-end fixture**, branch `fix/E2-end-to-end-proof`. Authored project -> real GSAP interpolation -> real/manual clock tick -> patch -> DOM writes a real numeric value. Must fail on baseline and pass on rescue. Depends on A1, B1, B2, C3, and E1.
- **E3 mutation baseline and ratchet**, branch `fix/E3-mutation-gate`. Scope Stryker to runtime and adapters. First run establishes the measured baseline; later runs cannot regress. Never invent the threshold.

**Wave E exit gate:** required build, end-to-end, and cheap PR checks are green; mutation score is recorded and ratcheted; only then update status docs and merge rescue into `main`.

## Final merge checklist

- `progress/STATUS.md` is current and links every slice's commit and evidence.
- All slice branches are merged into rescue in dependency order.
- Branch protection requires format, typecheck, contract tests, boundaries, build, and end-to-end checks.
- Mutation testing is manual or nightly until fast enough for PRs, but its report is never ignored.
- `docs/SESSION-STATUS.md` describes only verified behavior.
- Open one final PR from rescue into `main`.
