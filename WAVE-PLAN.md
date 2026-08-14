# Motion5 rescue wave plan

This file is the **detailed execution plan** for `rescue/restore-motionpath-parity`. It is not a status dashboard. The only live status, next action, branch state, commit links, and evidence links live in [`progress/STATUS.md`](progress/STATUS.md). Update that file, not this one, when work changes.

## Operating rules

Freeze `main`. Create the rescue branch once, then one short-lived fix branch from the latest rescue tip for each slice. Each slice gets a failing-first test derived from the working `motionpath` oracle, implementation, and durable CI evidence before it can be marked complete in `progress/STATUS.md`. Merge slices into rescue in dependency order, then merge rescue into `main` once all wave gates pass.

The oracle is evidence, not a wholesale-copy target. Preserve motion5's graph ownership and TypeScript boundaries while adapting the oracle's working behavior at motion5's ports. A green generic test suite is not proof of a slice.

## Execution constraint: no local checkout

There is no developer machine on this recovery. Nothing can be run locally. Manually dispatched GitHub Actions is the only runner, and the GitHub web interface is the only way to read the oracle. Three rules follow and they override any older wording in this file.

1. **CI is the evidence source.** A slice exit is a workflow dispatch plus the resulting run URL, never a shell command. A slice log that states `npm run check` as its exit states something nobody can perform; restate it as the dispatch and the run that proves it.
2. **`recovery-audit.yml` is the terminal.** Any capability missing from that workflow is a capability this recovery does not have. It is built to the specification below before Wave B continues, not later at D3.
3. **The audit fails when evidence is absent.** A file-existence checklist that exits zero is the documentation-only green this plan exists to prevent. Every gate job is red until its evidence exists, and a red baseline run is the correct result, not a problem to suppress.

### Failing-first is automated, not hand-cut

A3 proved the manual cost: an evidence branch that inherited triggers firing only on `main` produced zero checks, and a strictly typed failing-first test could not compile against the code it indicted, so the slice shipped two copies of the same test differing only in accessors. Two copies drift, and once they drift the red evidence stops proving what the green test asserts.

The `failing-first` job now resolves the base, ports only the new test files onto it, and runs them with `vitest` directly. Vitest transpiles tests without typechecking them, so a strictly typed test executes against an implementation that does not expose its API yet and fails on behavior. **Slices ship exactly one copy of each test.** No evidence branch, no relaxed duplicate, no manual parent comparison.

An import-resolution failure on the base leg is weaker evidence than a behavioral assertion failure. The job records both legs' logs so the reader can tell which happened.

## Wave 0: establish the rescue loop

**Goal:** make recovery resumable and observable.

- Create `rescue/restore-motionpath-parity` from frozen `main`.
- Implement `.github/workflows/recovery-audit.yml` to the full specification below.
- Dispatch the audit against frozen `main` and against the rescue tip before fixing further runtime code.
- Record mutation status, failing-first result, acceptance gaps, and artifact links in `progress/STATUS.md`.

**Exit gate:** the workflow implements all five jobs, and `progress/STATUS.md` links a real `actions/runs/<id>` URL for a dispatch against `main` and one against rescue. Artifact ZIPs pasted from elsewhere are not run links: their labels can be wrong, and one already was. Until both run URLs exist, W0 is not complete.

### Audit workflow specification

**File:** `.github/workflows/recovery-audit.yml`

**Trigger:** `workflow_dispatch` with a required `ref` input defaulting to `main`, an optional `base` input for the failing-first comparison, and an optional `failing_first_exception` input. Checkout must use `ref` explicitly.

**Jobs:**

- `contract`: real GSAP contract tests, DOM tests, React lifecycle tests, boundary tests, and end-to-end tests. A surface whose test file does not exist is reported `MISSING` and fails the job.
- `mutation`: Stryker scoped to `packages/core/src/runtime/**` and `packages/core/src/adapters/**`; upload HTML and JSON reports. With no `stryker.config.json` the job records the absence and fails. It never invents a score or a threshold.
- `acceptance`: verify every acceptance-map item points to an existing test and that the test ran.
- `failing-first`: resolve the base, apply the ref's new test files to it, run them there, then run them on the ref. Pass requires red on base and green on ref. A genuine refactor with no new behavioral test passes only with `failing_first_exception` filled in, and the reason is recorded in the report.
- `build`: declaration emission plus public entry resolution for every package; upload logs.

Failed jobs must still upload their reports, and a final `report` job assembles every fragment into one artifact and the run summary. Manual audit measures expensive evidence and does not replace required PR checks. After recovery, format, typecheck, real contract tests, boundaries, build, and end-to-end checks must block merges; mutation testing may remain manual or nightly.

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

**Wave B exit gate:** real GSAP and contribution tests pass with authored stops compiled into an adapter-owned timeline. B2 depends on B1, and B2 does not start until the audit workflow meets the W0 specification, because B2 is the first slice whose correctness claim rests on the real GSAP contract job.

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
- **D3 acceptance evidence**, branch `fix/D3-evidence-gates`, areas acceptance checker and audit workflow. Every acceptance item maps to an existing test that ran. Preserve baseline and rescue artifacts. The failing-first half of this slice moved into W0 and is delivered by the audit workflow's `failing-first` job; what remains here is `scripts/acceptance-scan.mjs`, `docs/acceptance-map.json`, and artifact durability.

**Wave D exit gate:** scanner self-test can fail, mappings are complete, and audit artifacts are durable.

## Wave E: prove the real product path

**Goal:** make "recovered" mean a real consumer path works.

- **E1 required declaration build**, branch `fix/E1-required-build`, areas package TypeScript config, exports, and `.github/workflows/ci.yml`. Every package emits declarations and public imports resolve without source internals. Bundling remains deferred.
- **E2 end-to-end fixture**, branch `fix/E2-end-to-end-proof`. Authored project -> real GSAP interpolation -> real/manual clock tick -> patch -> DOM writes a real numeric value. Must fail on baseline and pass on rescue. Depends on A1, B1, B2, C3, and E1.
- **E3 mutation baseline and ratchet**, branch `fix/E3-mutation-gate`. Scope Stryker to runtime and adapters. First run establishes the measured baseline; later runs cannot regress. Never invent the threshold.

**Wave E exit gate:** required build, end-to-end, and cheap PR checks are green; mutation score is recorded and ratcheted; only then update status docs and merge rescue into `main`.

## Final merge checklist

- `progress/STATUS.md` is current and links every slice's commit and evidence.
- No slice log states a local command as its exit; every exit is a dispatch and a run URL.
- All slice branches are merged into rescue in dependency order.
- Branch protection requires format, typecheck, contract tests, boundaries, build, and end-to-end checks.
- Mutation testing is manual or nightly until fast enough for PRs, but its report is never ignored.
- `docs/SESSION-STATUS.md` describes only verified behavior.
- Open one final PR from rescue into `main`.
