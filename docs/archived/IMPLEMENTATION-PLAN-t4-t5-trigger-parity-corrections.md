# Corrections to `IMPLEMENTATION-PLAN-t4-t5-trigger-parity.md`

This amendment is part of the T4/T5 implementation plan and must be read together with it. The plan itself lives on branch `docs/t4-t5-trigger-parity-plan` and has not landed on `feat/adopt-motion-track` yet; this document lands with the T4 implementation so the amendment record is never a promise.

The plan states that it reads the tree as it exists on `feat/option-c-motion-track-resolution` at `d022b67`. That is the merge of PR [#129](https://github.com/chahyasantoso/motion5/pull/129). Four commits landed after it before PR [#126](https://github.com/chahyasantoso/motion5/pull/126) squash-merged, including PR [#130](https://github.com/chahyasantoso/motion5/pull/130). The real base is `a57634f`.

All nine claims in section 2 were re-read against `a57634f` and all nine still hold, including the gap in fact 5. What follows is everything else that changed, is wrong, or is not buildable as written. Locked decisions `T4-1` through `T4-6` and `T5-1` through `T5-6` are unchanged in intent; where the text describing one is wrong, the correction says so and the decision stands.

## Section 2 fact 13 is resolved

The plan records `MotionOptions.disposeTracks` as unresolved review feedback on PR [#126](https://github.com/chahyasantoso/motion5/pull/126) and forbids either slice from depending on the default. The review resolved it: the default is now `false`, recorded in ADR-031 under `Disposal ownership` and in the option C corrections doc as the `C8` amendment. `Engine` passes `disposeTracks: false` explicitly at the only production construction site. The instruction is unchanged, because neither slice may depend on the default either way, but it is no longer an open question.

## Section 3.1's conditional ordering comment is already satisfied

Section 3.1 says to add the `replaceMotionTrack` ordering comment in `#replaceTrack` if PR [#126](https://github.com/chahyasantoso/motion5/pull/126) landed without it. It landed with it, in commit `7d8139e`, and `#addTrack` carries the matching comment for `addMotionTrack`. Adding either again is drift. `T4` therefore changes exactly one method in `project-runtime.ts`.

## Evidence case ids move to their own series

The plan uses `T4-1` through `T4-6` for locked decisions in section 1 **and** `T4-1` through `T4-7` for test cases in section 4, and the two sets do not correspond: decision `T4-1` is creation ordering, test `T4-1` is sequence parity. The same collision exists across `T5-1` through `T5-6`. `docs/PR-WORKFLOW.md` requires a single flat series per plan where an id names exactly one test in the whole suite, and PR [#130](https://github.com/chahyasantoso/motion5/pull/130) added `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to enforce it. The plan predates that gate and is not mentioned by it.

Correction: locked decisions keep `T4-n` and `T5-n`. Test cases take a separate flat series, `T-1` upward, across both slices. `T4` owns `T-1` through `T-7` in the order section 4 lists them. `T5` owns `T-8` upward. The gate is widened to police the new prefix:

```ts
const CASE_TITLE = /it\(\s*"((?:C|T)-\d+)/g;
```

That pattern does not match `T4-1`, so a decision id can never be mistaken for a case declaration. The change is additive: the gate's second test asserts floors rather than exact counts, so new series never fail it.

## T5-1's manual port call-site count is wrong

`T5-1` claims `createManualTriggerPort` may be called from exactly two places in `packages/core/src`, and section 8.2's grep gate repeats it as "exactly two sites". Section 6's `T5-4` goes further and demands zero occurrences in any file under `src/adapters/trigger-factory/` other than `default.ts`.

There are three sites, and the third is correct. `time-driver.ts` calls `createManualTriggerPort()` to build its own emission channel, exactly as section 6.1 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` specifies: "Emits `Math.min(1, elapsed / duration)` through its own manual-style port." As written, `T5` would ship a gate that fails on green code.

Correction: what `T5` forbids is a manual **fallback**, not the manual port as a transport. A fallback is a port returned with `acceptsExternalSignal: true` and `clockBinding.kind` of `"motion"` for a declared `time` or `scroll` trigger. The gate becomes:

- `default.ts` contains exactly one `createManualTriggerPort(` call, and it sits after both the `time` and the `scroll` early returns.
- `engine.ts` contains zero.
- `time-driver.ts` contains one, named and allowed, because the port it builds is driver-owned and reports `acceptsExternalSignal: false`.
- The per-type capability matrix in `T5-2` is what actually proves no type degrades, since it asserts all three of `clockBinding.kind`, `acceptsExternalSignal`, and the throw.

## T4-6 cannot inject a graph builder through `Engine`

Section 4 case `T4-6` says to force `replaceGraph` to reject by injecting a `graphBuilder` that throws for a candidate containing the new motion id. `ProjectRuntimeOptions` accepts `graphBuilder`, but `EngineOptions` does not: `Engine.load()` hardcodes `new IncrementalGraphBuilder()`. Adding an option for a test is a new flag, which section 7 forbids.

Correction: a real graph rejection is already reachable through the public surface. `IncrementalGraphBuilder.build` runs `assertAuthoredMotionId` per motion and emits an error-severity `motion-id` diagnostic, which `validateGraphResult` turns into a `TypeError`. So `addMotion` with an id containing `/`, or the reserved `~`, rejects at the graph stage with no injection at all. `runtime-motion-lifecycle.test.ts` already relies on this. Use `id: "bad/id"` and assert the thrown message still starts with `motion-id at motions[0].id:`, which is how "the throw propagates unchanged" is proved.

## T4-6 is red on the factory counters, not on "nothing left behind"

Section 4.1 names `T4-6` as required red evidence. It is not, as written. On the parent, `addMotion` replaces the graph before it calls `#createMotion`, so a graph rejection means the Motion was never built, and "no Motion survived, no consumer survived, nothing was disposed twice" all pass trivially, for the wrong reason. A guard that passes on the parent because the code path does not exist is not evidence that the rollback works.

Correction: the red assertion is the pair of factory counters. Inject a factory that records a creation after `create` returns and counts outer `dispose()` calls. On the parent the creation list is empty; after the fix it is `["bad/id"]` with a dispose count of exactly `1`. Same case, same file, honest red. Section 4.1's list becomes: `T-3` and `T-6` are the red evidence, and `T-1`, `T-2`, `T-4`, `T-5`, `T-7` are behavior-preservation guards that must pass on the parent.

## T4-3's message assertion is not the evidence

Section 4 case `T4-3` asserts that after the failed `addMotion`, a following `addTrack(track, { motionId: "late" })` throws `Unknown motion "late".` and that the graph node count is unchanged. Neither discriminates.

- Both trees throw that exact message, one layer apart. On the parent it comes from `Engine`'s `addMotionTrack` hook, after `#addTrack` has already compiled a Track, replaced the graph, and committed `#tracks`. After the fix it comes from `#addTrack`'s own `#motions` check, before anything happens.
- A runtime Motion starts with empty tracks, so it contributes no graph node at all. "Node count unchanged" is true on both trees before the follow-up `addTrack` and is therefore not a discriminator on its own.

Correction: assert the ghost's side effects instead. After the failed `addMotion` and the failed `addTrack`, `handle.track("late/arm")` must throw `Unknown graph node` (on the parent it returns a live handle to a committed, unmounted Track), and `destroyMotion("late")` must throw `Unknown motion "late".` (on the parent it reports `still has 1 track(s)`). Also attempt `addMotion` exactly once: on the parent a second attempt reports `Motion "late" already exists.`, which would mask the real failure behind a regex that still matches.

## T4-4 and T4-5 need a wrapping factory

Both cases assert a driver dispose counter of exactly `1`. `createTimeDriver` returns a sealed `CreatedTrigger` with no counter, and module mocking would defeat the point. Wrap the real factory: call `createTriggerFactory(...)`, then return a `CreatedTrigger` that spreads the inner one and overrides `dispose` to increment per motion id before delegating. Counting the outer call is what makes "exactly once" observable, since the inner contract is idempotent and would happily absorb a double dispose.

## Section 4.2's frozen list gains three files

The list was verified against `d022b67`. Three suites landed or were renumbered after it and must also stay byte-identical through `T4`: `packages/core/test/unit/engine/motion-entry-shape.test.ts`, `packages/core/test/unit/domain/motion-dispose-ownership.test.ts`, and `packages/core/test/unit/scripts/evidence-case-ids.test.ts`. The last one is the exception to its own rule: `T4` widens its regex, as recorded above, and nothing else in it changes.

## T5-2 and the `as never` gate conflict

Section 5.2 says to keep the two clock-ownership and pause-or-remount cases in `motion-trigger-types.test.ts` unchanged, and section 8.2 demands zero `as never` in `packages/core/test/integration/motion-trigger-*.test.ts`. Those two cases also construct `Motion` around `resolveTrack: () => current as never`, and the glob additionally captures `motion-trigger-lifecycle.test.ts`, which carries one more.

Correction: the retained cases keep their names, assertions, and expected values, and get a mechanical resolver swap to `createFakeTrackRegistry` from `packages/core/src/ports/fakes.ts`. `motion-trigger-lifecycle.test.ts` gets the same mechanical swap. That is a test-infrastructure change, not a behavior opt-in, and it is the only way both gates can be true at once.

## Markdown tables are the live formatting hazard

Non-negotiable 9 says to run `npm run format` before every push because `docs/SESSION-STATUS.md` is behind the two most recent archived formatting failures on this base. Both are confirmed: run [32084718662](https://github.com/chahyasantoso/motion5/actions/runs/32084718662), archived at `logs/32084718662/` on `ci-logs`, fails `quality` on `format:check` naming `docs/SESSION-STATUS.md` and nothing else. The maintainer's own fix, commit `a392b32`, is titled "docs: state the option C slice in prose instead of a hand-padded table".

The cause is hand-padded markdown tables. Prettier pads every cell and every separator to the column's widest content, so a table is the one markdown construct an implementer cannot get right by eye, and `format:check` inside `quality` is a hard gate that runs before the write-enabled `format` job can repair anything.

Correction: new or edited status, ADR, and plan content uses prose and bullet lists. Do not add a markdown table, and convert one you are already editing. Prettier here is `printWidth: 100`, `singleQuote: false`, `trailingComma: "all"`, `proseWrap: "preserve"`; with prose wrapping preserved, unpadded prose and `-` lists are stable under the formatter.

## T5 amendments, added while implementing T5

Everything above was written against the `T4` base. The seven items below were found while building `T5` and are recorded the same way rather than worked around silently. As before, the locked decisions stand; only the text describing how to prove them changes.

### T5-2 and T5-3 are already proved, so the new unit file must not restate them

Section 5.1 asks the new `trigger-factory-no-fallback.test.ts` to carry the per-type capability matrix (`T5-2`) and the scroll throw (`T5-3`). Both already exist. `packages/core/test/contract/trigger-factory.test.ts` case "selects manual, time, and injected scroll drivers" asserts `acceptsExternalSignal` and `clockBinding.kind` for all three types, and case "fails loudly when a declared scroll trigger has no registered source" asserts the `trigger-driver-unavailable` throw. `packages/core/test/unit/domain/time-driver.test.ts` asserts the driver's flags a third time.

Correction: the new file carries only what nothing else can see, which is the structure. `T-8` is the positional source guard on `default.ts`, `T-9` ties the driver's capability pair to the third `createManualTriggerPort` call site so the corrected `T5-1` gate is a transport claim rather than a count, and `T-10` proves `engine.ts` and every sibling under `src/adapters/trigger-factory/` build no port. Re-asserting a green matrix in a second file would be duplicated ownership of evidence, which is the same defect as duplicated ownership of behavior.

### Section 5.2's three replacement cases would duplicate the per-type suites

Section 5.2 replaces the three retired "same scheduled progress path" cases with three per-type cases through `Engine`. Written literally, all three are already covered: `trigger-time.test.ts` asserts that `time` rejects `signal()` with the exact message, that `manual` accepts one and still throws `RangeError` out of range, and that the driver latches; `trigger-scroll.test.ts` asserts that `scroll` rejects `signal()`, registers no clock consumer, and moves only when its source emits.

Correction: one case, `T-11`, asserts the contrast across all three types side by side through the real factory: whether `signal()` is accepted, and whether a project clock tick moves the Motion. The retired cases were wrong because they claimed the three types share one path, and the per-type suites each prove one type in isolation. Isolation is how a fallback hides, so the replacement is the comparison, not three more isolated cases.

### A cited case id has to be a plain `it` declaration

The gate regex is `/it\(\s*"((?:C|T)-\d+)/g`, so `it.each([...])("T-11 ...")` declares an id the gate cannot see. A citation the gate cannot verify is the exact problem `evidence-case-ids.test.ts` exists to prevent.

Correction: any case a plan, ADR, or pull request body cites by id is declared with a plain `it("T-n ...")`. Table-driven coverage goes inside such a case, not around it. `T-11` does exactly that.

### The retained cases need a spy, not a replacement double

The resolver swap above is not quite mechanical. `createFakeTrackRegistry<T>()` is generic but `MotionOptions.resolveTrack` is `(id: string) => Track | undefined`, so registering a `vi.fn()` track double into it only trades `as never` for `as unknown as Track`. The gate would pass and nothing would improve.

Correction: register real `Track` instances built on `createFakeInterpolator()` and wrap `setProgress` and `dispose` with `vi.spyOn`. `vi.spyOn` calls through, so the assertions keep their exact shape, names, and expected values while the cast disappears for real. This is the pattern `motion-track-resolution.test.ts` already uses for the same reason.

### AUTHORED-SCHEMA.md's own example does not load

Section 5.4 asks for the per-type trigger shapes to be documented. It does not mention that the document's flagship example is invalid input: it authors `trigger: { type: "time", autoplay: false }` with no `duration`, which the runtime rejects with both `trigger-time-duration` and `trigger-time-autoplay-unsupported`.

Correction: the example is fixed to `{ type: "time", duration: 1000 }` in the same slice, and the fix is called out in the document rather than made quietly. This is documentation drift of exactly the kind `T5` exists to close, in the one file the schema calls normative, so it is in scope rather than adjacent.

### Section 5.6 needs no new ADR number

Section 5.6 says to record `T5-5` in `docs/DECISIONS.md`. That file already owns the decision: ADR-021 separates composite `signal()` from leaf `seek()`. Adding a second record about the same boundary would leave two active records on one question, which the file's own usage note forbids, and the plan already reserves ADR-033 for the no-fallback record.

Correction: `T5-5` lands as a dated clarification under ADR-021, cross-referenced from ADR-033. No new number is claimed. The highest ADR after `T5` is therefore `ADR-033`.

### T5 is ten semantic files, not seven

Section 5 lists seven files and section 8.4 calls `T5` a seven-file slice. The honest count is ten: the new unit test, the `motion-trigger-types.test.ts` rewrite, the `motion-trigger-lifecycle.test.ts` swap this document added, `ARCHITECTURE.md`, `AUTHORED-SCHEMA.md`, `MIGRATION-V4-TO-V5.md`, `DECISIONS.md`, `ADR-033`, `SESSION-STATUS.md`, and this amendment. Section 5 omitted the lifecycle suite, the status file it mentions only in passing at the end of 5.7, and itself.

Correction: `T5` is ten semantic files. That is at the plan's own ten-file drift line and well under the twenty-file ceiling in `docs/PR-WORKFLOW.md`, and per that document the count is stated once, in the pull request body. A plan or amendment that maintains its own count will eventually disagree with the diff.
