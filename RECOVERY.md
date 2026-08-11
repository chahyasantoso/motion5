# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of the oracle repository, `chahyasantoso/motionpath`, while preserving motion5's graph ownership and TypeScript boundaries. Do not treat a green test suite as proof unless the test exercises the real behavior at the boundary.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Main baseline reviewed: commit `1d59c087231c3c3f9c3cde6822d34835ee94705a`
- Oracle: `chahyasantoso/motionpath`
- Oracle revision inspected for this handoff: `1bc8d044347fa3b1732e6dad3bc8437ad23e2687`
- Rescue branch to create locally: `rescue/restore-motionpath-parity`

## How work is merged

Freeze feature work on `main`. Create the rescue branch once, then create one short-lived fix branch from the latest rescue tip for each slice. Each fix branch merges back into `rescue/restore-motionpath-parity` only after its failing-first test, implementation, and CI evidence are present. Merge rescue into `main` once, after all wave exit gates pass.

The detailed slice order, dependencies, acceptance tests, and exit gates live in [`WAVE-PLAN.md`](WAVE-PLAN.md). Keep this file as the handoff index and keep the plan as the execution map.

## Verdict at baseline

A1 and A2 are implemented: publisher memo stores post-merge values, and subscriber failures preserve the original error while resetting batch state.

The remaining review findings are real, with one correction: DOM `clear()` only drops the adapter cache, which matches the oracle's teardown primitive and the written plan. The real DOM gap is missing plugin-driven internal-key filtering and output serialization, plus missing clear coverage.

Open defects and proof gaps:

- GSAP adapter compiles only the final stop, and the current contract test's fake performs the interpolation itself.
- `PluginDefinition.contribute` exists but is never called during Track construction.
- Patch subscriber-triggered reentrancy is not guarded or documented.
- React patch store unsubscribes at zero listeners but never resubscribes; hooks and the public React entrypoint are absent.
- Boundary scanner hardcodes `react`; its self-test does not exercise `importsCoreInternals` or a planted scanner failure.
- No required build job or honest authored-project-to-real-interpolation-to-clock-to-DOM end-to-end fixture.
- `docs/SESSION-STATUS.md` overstates the GSAP gate and must not be used as evidence until corrected.

## Session-only decisions now made explicit

These decisions were made during the recovery discussion but were not previously recorded in the repository. They are part of the handoff now.

### Manual audit workflow

There is **currently no manual audit workflow in the repository**. The phrase "add the manual audit workflow" in the wave plan is a future task, not an existing command or file.

The planned file is `.github/workflows/recovery-audit.yml`. It should use `workflow_dispatch`, accept a branch or commit ref, run against that ref, and upload durable artifacts for:

- real GSAP contract tests, including multi-stop values at progress `0`, `0.5`, and `1`;
- mutation testing scoped to `packages/core/src/runtime/**` and `packages/core/src/adapters/**`;
- acceptance-map validation, proving every acceptance item maps to a test that exists and ran;
- failing-first replay, proving new tests fail on the parent implementation commit and pass on the changed commit;
- the declaration build, public-import smoke test, boundary scan, and end-to-end fixture.

Run it first on the frozen baseline to measure the gap, then on the rescue branch after each relevant wave. The first mutation report is a baseline measurement. Do not invent a threshold before that run; later runs must not regress from the measured baseline.

Manual audit is for expensive evidence and baseline measurement. It does **not** replace required PR checks. Once the rescue path is proven, format, typecheck, real contract tests, boundaries, build smoke, and end-to-end must run automatically and block merges; mutation testing can remain manual or nightly if it is too slow.

### Four anti-drift controls

1. Mutation testing over runtime and adapters, starting with an observed baseline and then ratcheting upward.
2. Failing-first replay as a CI artifact, not merely a promise in a PR description.
3. Real dependencies at contract boundaries, especially GSAP. A fake must not implement the interpolation behavior being tested.
4. An acceptance map where every plan acceptance criterion names a test ID and the workflow verifies that the test exists and ran.

### Immediate human action

After creating the rescue branch, run the future manual audit workflow on current `main` and save its artifact links in `progress/W0-baseline.md`. If the workflow has not yet been implemented, do not claim the baseline audit is complete: create the workflow as Wave 0 work first.

## Non-negotiable evidence rules

- Every acceptance criterion maps to a test ID and a test file.
- The test must fail on the parent implementation commit before the implementation change is applied.
- Contract-boundary tests use the real dependency where practical, especially GSAP. A fake must not implement the behavior under test.
- A test that only asserts a placeholder's output is not evidence of the intended contract.
- Cheap proof is required on every PR: format, typecheck, real contract tests, boundaries, build smoke, and end-to-end.
- Expensive mutation testing runs manually or nightly, uploads its report, and cannot silently lower the baseline.
- `main` is not considered recovered until the build gate and end-to-end fixture are green.

## Session protocol

At session start:

1. Read this file, [`WAVE-PLAN.md`](WAVE-PLAN.md), and the latest files under `progress/`.
2. Inspect current `main`, the rescue branch, and recent CI artifacts.
3. Pick one recovery slice only.
4. Identify the oracle behavior and write or verify the failing-first test before changing production code.

At session end:

1. Record what changed, what was proven, and what remains red in `progress/<wave>.md`.
2. Include commit SHA, test commands, artifact links, and any oracle paths consulted.
3. Never mark a slice complete from code inspection alone.
