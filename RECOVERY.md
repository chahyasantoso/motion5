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
