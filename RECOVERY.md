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

## Recovery order

1. Create the rescue branch from the baseline. Freeze feature work on `main`.
2. Build behavior matrices from motionpath before implementing each slice. Record oracle file paths and expected outputs in the corresponding test.
3. Add failing-first tests against current motion5. Do not make the fake smarter to make the test pass.
4. Replace the GSAP fake contract with real GSAP and test a multi-stop property at progress 0, 0.5, and 1.
5. Wire prepare-stage `contribute` into Track construction before interpolator creation, then compile the contributed keyframes.
6. Add DOM serialization, metadata-based internal-key filtering, and clear-on-teardown coverage.
7. Add React resubscription, hooks, public exports, and lifecycle tests.
8. Choose and test reentrancy behavior: deferred follow-up or explicit next-tick invalidation. Never allow recursive batch opening.
9. Repair boundary discovery and planted-fixture testing.
10. Add the required declaration build and public-import smoke test, then one real end-to-end fixture.
11. Run mutation testing over runtime and adapters. Use the first report as a baseline, then ratchet upward instead of inventing a threshold.
12. Update status docs only after executable evidence passes.

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

1. Read this file and the latest files under `progress/`.
2. Inspect current `main` and recent CI artifacts.
3. Pick one recovery item only.
4. Identify the oracle behavior and write or verify the failing-first test before changing production code.

At session end:

1. Record what changed, what was proven, and what remains red in `progress/<wave>.md`.
2. Include commit SHA, test commands, artifact links, and any oracle paths consulted.
3. Never mark a slice complete from code inspection alone.
