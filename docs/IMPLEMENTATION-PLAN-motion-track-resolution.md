# Implementation Plan: Option C, Motion resolves Tracks by id

**Status:** Committed plan. Section 1 is locked and MUST NOT be re-litigated.

**Branch base:** `feat/adopt-motion-track`

**Implements:** Option C of [issue #114](https://github.com/chahyasantoso/motion5/issues/114), per the maintainer's directive on that issue: _"Option C as its own architecture PR before T4 runtime Motion parity."_

**Supersedes:** nothing. This is the follow-up that section 8.1 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` and ADR-029 both defer. Option A has already landed on the base branch (`Motion.replaceTrack` + the `replaceMotionTrack` hook). Option C removes the reason Option A was needed.

---

## 0. How to use this plan

This plan is written to be executed by an implementer with **no authority to change the design**. Read this section before touching code.

### 0.1 Non-negotiables

1. **Do not re-open section 1.** Every decision is made. If you believe one is wrong, stop and raise it. Do not implement an alternative.
2. **Do not widen the slice.** Section 5 is the forbidden list. Work outside section 3's file list is drift, even when it is an obvious improvement.
3. **Do not delete `Motion.replaceTrack`.** Option C removes the stale-reference responsibility, not the duration-and-reseed responsibility. See C5.
4. **Do not change the stagger formula.** `#effectiveProgress` is copied nowhere and edited nowhere in this slice.
5. **Do not touch triggers, drivers, clock bindings, or the graph.** T3 has landed. This slice is `Motion` ownership only.
6. **Do not add a public export.** `packages/core/src/index.ts` must be byte-identical after this slice. `Motion` and `MotionOptions` are package-private today and stay that way.
7. **Every commit must leave `npm run check` green** (`format:check` + `typecheck` + `test`). No skipped, `.todo`, deleted, or weakened test.
8. **Error message strings in this plan are the contract.** Use them verbatim; they are asserted by tests.

### 0.2 Required reading before you start

Read these in full. They are what you change or must not break.

- `packages/core/src/domain/motion.ts` (the whole file)
- `packages/core/src/domain/track.ts` (`setProgress`, `dispose`, `assertActive`)
- `packages/core/src/engine.ts` (`load`, `buildMotion`, `compile`, `compileTrackDefinition`, `disposeTrack`, the `addMotionTrack` / `replaceMotionTrack` / `removeMotionTrack` hooks, `disposeComposition`)
- `packages/core/src/runtime/project-runtime.ts` (`#addTrack`, `#removeTrack`, `#replaceTrack`, `#replaceWithObservation`)
- `packages/core/src/ports/fakes.ts`
- `packages/core/test/unit/domain/motion.test.ts`
- `packages/core/test/integration/issue-114-motion-track-regressions.test.ts`
- `docs/ADR-029-motion-track-replacement-ownership.md`
- `docs/PR-WORKFLOW.md` and `docs/CI-WORKFLOW.md`

Test runner is **vitest**. Helpers live in `packages/core/src/ports/fakes.ts` (`createFakeInterpolator`, `createFakeScheduler`, `createFakeTriggerPort`) and `packages/core/src/ports/clock.ts` (`createManualClock`). There is no `packages/core/test/support/` directory. Do not create one, and do not write replacement fakes.

### 0.3 Position in the sequence

T0 through T3 have landed on the base branch. `ProjectRuntime.addMotion` already calls `validateMotionTrigger`, and ADR-028 is accepted, so the trigger-validation half of T4 is done. This slice lands next, as its own pull request, before any remaining T4 or T5 work. Do not bundle it with trigger work, and do not re-implement trigger validation.

---

## 1. Locked decisions

**C1. `MotionTrackEntry` carries an id and a duration. Never a Track.**

```ts
export interface MotionTrackEntry {
  readonly id: string;
  readonly duration?: number;
}
```

**C2. Resolution is injected, required, and called per use.**

`MotionOptions` gains `readonly resolveTrack: (id: string) => Track | undefined;`. It is **required**, not optional, and has no default. A missing or non-function value throws at construction:

```text
Motion requires a resolveTrack function.
```

The name is `resolveTrack`. Not `getTrack`, not `tracks`, not a Map. A function, so the caller owns the storage.

**C3. `Motion` never stores, caches, or memoizes a `Track` instance.**

No field, no local kept across calls, no `WeakMap`. Every use resolves at the moment of use. `Track` may only be imported as a **type-only** import in `motion.ts`. This is the entire point of the slice and it is enforced by a source-level test (C-3 in section 4).

**C4. Resolution failure policy, three cases, no fourth.**

- **Single-track operations** (`addTrack`, `replaceTrack`): an unresolved id throws immediately.

  ```text
  Motion track "<id>" has no compiled Track.
  ```

- **Progress application** (`#setProgress`): an unresolved id **must not abort the loop**. Apply progress to every resolvable entry, fire `#invalidate` as normal, then throw once at the end naming every unresolved id, comma-separated in array order:

  ```text
  Motion tracks have no compiled Track: a, b.
  ```

  This is deliberate. Issue #114's second and third symptoms were exactly "one bad track aborts the sweep and suppresses `#invalidate`". Fixing the reference class of bug while keeping that failure mode would be pointless. The pattern mirrors the existing clock-consumer fanout in `Engine.load()`, which already collects failures and throws after the loop.

- **Disposal** (`beforeDispose` when `disposeTracks` is `true`): an unresolved id is a **silent no-op**. Dispose is best-effort and must never throw. Use `this.#resolveTrack(entry.id)?.dispose()`.

**C5. `Motion.replaceTrack` stays, with a narrowed job.**

Under Option C it no longer swaps a reference, because there is no reference. It still: finds the entry by id, **fails on unknown id with the existing message** `Unknown Motion track id: <id>.`, validates duration, writes the new entry **at the same array index**, and re-seeds the resolved Track with `#effectiveProgress(index, entry)`.

The `replaceMotionTrack(motionId, trackId, duration)` hook signature on `ProjectRuntimeOptions` is **unchanged**. ADR-029's index-and-stagger preservation guarantee is unchanged and its evidence suite stays green.

**C6. Hook ordering in `ProjectRuntime.#replaceTrack` is unchanged and load-bearing.**

The order stays: validate candidate graph, `replaceGraph`, `disposeTrack(id)`, `compileTrack(accepted, id)`, then `replaceMotionTrack(...)`. Under Option C the hook must still run **after** `compileTrack`, because the resolver reads the live `tracks` map and would otherwise resolve the disposed instance or nothing at all. Add a one-line comment saying so. Change no behavior in this file.

**C7. `Engine` performs no Track lookup on `Motion`'s behalf. Anywhere.**

The `tracks.get(...)` calls currently inside the `addMotionTrack` and `replaceMotionTrack` hooks are deleted, along with the `Unknown graph node` throws they guard, and so is the lookup in the load-time entry-building loop. `Motion` resolves, `Motion` throws. One owner. Grep-verified in section 6.

**C8. `disposeTracks` stays as an option, default `true`.**

`Engine` keeps passing `false`. Directly constructed Motions keep owning their tracks. Do not remove the flag and do not flip the default; that is a separate behavioral change with its own blast radius.

**C9. The test registry helper is generic and lives in `fakes.ts`.**

Add exactly one export to `packages/core/src/ports/fakes.ts`:

```ts
export function createFakeTrackRegistry<T>(): {
  resolveTrack: (id: string) => T | undefined;
  register(id: string, value: T): T;
  drop(id: string): void;
  readonly ids: readonly string[];
};
```

It is generic on purpose: `ports/fakes.ts` must **not** import from `domain/`. Do not inline a private copy of this helper in test files, and do not create a second one.

**C10. Public surface is unchanged.**

`packages/core/src/index.ts` is not edited. `fakes.ts` is not exported from the entrypoint, so C9 adds nothing to the published API. If you find yourself editing `index.ts`, you have drifted.

---

## 2. Verified current state

Every claim below was read out of `feat/adopt-motion-track`, not assumed.

1. `MotionTrackEntry` is `{ id, track, duration? }`. `Motion` keeps `#tracks: MotionTrackEntry[]` plus a parallel `#trackMap`, so a compiled `Track` is captured in two places.
2. `Motion` touches `entry.track` in exactly four places: `beforeDispose`, `addTrack`, `replaceTrack`, and `#setProgress`. Those four are the whole surface of this slice.
3. `Motion.replaceTrack` exists and preserves the array index. Option A has landed; ADR-029 is accepted; issue #114 is closed by [#115](https://github.com/chahyasantoso/motion5/pull/115).
4. `Engine.load()` owns the single `tracks: Map<string, Track>` and it is already the source of truth for `compose`, `setProgress`, and `disposeTrack`. Only `Motion` holds a second copy. Option C deletes the second copy.
5. The `addMotionTrack` and `replaceMotionTrack` hooks in `engine.ts` each do `tracks.get(trackId)` and throw `Unknown graph node "<id>".` when absent. Those are the two duplicate-resolution sites C7 removes.
6. `Motion.#setProgress` sets `#position` before the loop and calls `#invalidate` after it, so a mid-loop throw both skips siblings and suppresses invalidation. C4 fixes this for the resolution case.
7. `Track.setProgress` calls `assertActive()` before its `Object.is` no-op check, so a disposed Track throws on every call, including one that would have changed nothing.
8. `Motion` is not exported from `packages/core/src/index.ts`. Neither is `fakes.ts`.
9. `motion.test.ts` has 11 tests and builds every Motion directly with `tracks: [{ id, track: new Track(...) }]`. It is the main test-side cost of this slice.
10. `ProjectRuntime` never sees a `Track` instance. Its hooks pass ids and durations only, which is why C6 needs no signature change.

---

## 3. The change, file by file

Nine files. Nothing else.

### 3.1 `packages/core/src/domain/motion.ts`

Change the `Track` import to `import type { Track } from "./track";`.

Entry and options:

```ts
export interface MotionTrackEntry {
  readonly id: string;
  readonly duration?: number;
}

export interface MotionOptions {
  // ...all existing members unchanged...
  readonly resolveTrack: (id: string) => Track | undefined;
}
```

Field and constructor guard, placed with the other option reads:

```ts
readonly #resolveTrack: (id: string) => Track | undefined;

// in the constructor, before the Lifecycle is built
if (typeof options.resolveTrack !== "function")
  throw new TypeError("Motion requires a resolveTrack function.");
this.#resolveTrack = options.resolveTrack;
```

One private accessor, the only strict resolution path:

```ts
#track(id: string): Track {
  const track = this.#resolveTrack(id);
  if (track === undefined) throw new TypeError(`Motion track "${id}" has no compiled Track.`);
  return track;
}
```

The four call sites:

```ts
// beforeDispose: best-effort, never throws
if (this.#disposeTracks)
  for (const entry of this.#tracks) this.#resolveTrack(entry.id)?.dispose();

// addTrack tail, index is this.#tracks.length - 1
this.#track(entry.id).setProgress(this.#effectiveProgress(index, entry));

// replaceTrack tail, index is the found index
this.#track(entry.id).setProgress(this.#effectiveProgress(index, entry));
```

```ts
#setProgress(progress: number): void {
  this.#position = progress;
  const unresolved: string[] = [];
  for (let index = 0; index < this.#tracks.length; index += 1) {
    const entry = this.#tracks[index]!;
    const track = this.#resolveTrack(entry.id);
    // A missing compiled Track must not abort the sweep: siblings still advance and
    // invalidation still fires. See issue #114 symptoms 1 and 2.
    if (track === undefined) {
      unresolved.push(entry.id);
      continue;
    }
    track.setProgress(this.#effectiveProgress(index, entry));
  }
  this.#invalidate(progress);
  if (unresolved.length > 0)
    throw new TypeError(`Motion tracks have no compiled Track: ${unresolved.join(", ")}.`);
}
```

Everything else in the file, including `#effectiveProgress`, `#totalDuration`, `schedule`, `reflow`, `signal`, `onTick`, `pause`, `play`, and every duplicate-id and duration validation, is untouched.

### 3.2 `packages/core/src/engine.ts`

Four edits, no more.

1. Load-time entry building loses its lookup:

   ```ts
   const entries = ids.map((id) => ({ id, duration: nodes.get(id)?.duration }));
   ```

2. `buildMotion` passes the resolver into `new Motion({ ... })`:

   ```ts
   resolveTrack: (id) => tracks.get(id),
   ```

3. The two motion-track hooks stop resolving:

   ```ts
   addMotionTrack: (motionId, trackId, duration) => {
     const motion = motions.get(motionId);
     if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
     motion.addTrack({ id: trackId, duration });
   },
   replaceMotionTrack: (motionId, trackId, duration) => {
     const motion = motions.get(motionId);
     if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
     motion.replaceTrack({ id: trackId, duration });
   },
   ```

4. `removeMotionTrack`, `createMotion`, `destroyMotion`, `disposeComposition`, `compile`, `compileTrackDefinition`, `disposeTrack`, the `invalidate` closure, the clock-consumer switch, and both catch blocks are **unchanged**.

If `typecheck` objects to an explicitly `undefined` optional `duration`, use the conditional-spread idiom already used elsewhere in the repo (`...(duration === undefined ? {} : { duration })`). Do not change the shape of `MotionTrackEntry` to accommodate it.

### 3.3 `packages/core/src/ports/fakes.ts`

Add `createFakeTrackRegistry<T>()` exactly as specified in C9. Map-backed. `register` returns the value it stored so tests can chain. No `domain/` import. Nothing else in the file changes.

### 3.4 `packages/core/src/runtime/project-runtime.ts`

Comment only, immediately above the `replaceMotionTrack` call in `#replaceTrack`:

```ts
// Must run after compileTrack: Motion resolves by id against the live compiled map,
// so an earlier call would resolve the disposed instance.
```

Zero behavior change in this file. If you changed logic here, you have drifted.

### 3.5 `packages/core/test/unit/domain/motion.test.ts`

Rewrite the construction helper to use `createFakeTrackRegistry`, keep all **11** tests, and change no assertion, no expected value, and no test name. Sketch:

```ts
function createMotion(stagger = 0, duration?: number) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const interpolator = createFakeInterpolator();
  const registry = createFakeTrackRegistry<Track>();
  const tracks = [0, 1, 2].map((index) => {
    const id = `track-${index}`;
    const track = registry.register(id, new Track({ interpolator }));
    return { entry: { id, ...(duration === undefined ? {} : { duration }) }, track };
  });
  return {
    clock,
    scheduler,
    registry,
    interpolator,
    motion: new Motion({
      clock,
      scheduler,
      tracks: tracks.map(({ entry }) => entry),
      stagger,
      resolveTrack: registry.resolveTrack,
    }),
    tracks,
  };
}
```

The `addTrack` and `removeTrack` tests must register the new Track in the registry **before** calling `addTrack`, since `addTrack` seeds progress immediately.

### 3.6 New test files

- `packages/core/test/unit/domain/motion-track-resolution.test.ts`
- `packages/core/test/integration/option-c-track-resolution.test.ts`

Contents specified in section 4.

### 3.7 `docs/ADR-031-motion-track-resolution-by-id.md`

New ADR, accepted, dated. Required sections: Context (two owners of the same compiled Track), Decision (C1 through C4 restated), Relationship to ADR-029 (Option A's in-place swap is subsumed; `replaceTrack` survives for duration and re-seed, ADR-029's index-and-stagger guarantee is unchanged and still separately evidenced), Failure ordering (C4 verbatim), Evidence (the two new test files by path). Do not supersede or edit ADR-029.

### 3.8 `docs/SESSION-STATUS.md`

One status file, updated in this PR. Add the slice, its PR link, and its CI run. Do not create a parallel handoff note. Run `npm run format` after editing it, see gate 6.2.

---

## 4. Test plan

### 4.1 Unit, `motion-track-resolution.test.ts`

Comment _why_ each assertion exists, matching the convention in `test/unit/runtime/clock-tick-identity.test.ts`.

- **C-1 constructor guard.** Omitting `resolveTrack`, and passing `null`, `{}`, and `1`, each throw `TypeError` matching `/Motion requires a resolveTrack function\./`.
- **C-2 entry shape.** `motion.tracks[0]` has `"track" in entry === false`, and `Object.keys(entry)` is a subset of `["id", "duration"]`.
- **C-3 source guard.** Read `src/domain/motion.ts` from disk and assert: zero matches for `/entry\.track/`, zero for `/\.track\.setProgress/`, zero for `/#trackMap\.get\(.*\)\.track/`, and that the `Track` import is type-only (`/import type \{ Track \}/` matches, `/^import \{ Track \}/m` does not). _This is the test that makes C3 undriftable._
- **C-4 late registration.** Construct with an empty registry, then `register` the Track, then `seek(0.5)`. The Track is at `0.5`. _Proves resolution is per-call, not captured at construction._
- **C-5 hot swap with no Motion call.** Register track A, `seek(0.5)`, then `register` a different Track B under the same id, then `seek(0.75)`. B is at `0.75`; A is still at `0.5` and is never touched again. _This is the entire class of bug Option C eliminates; issue #114 was one instance of it._
- **C-6 partial failure.** Three entries, `drop` the middle id, `seek(0.5)`. Entries 0 and 2 are at their effective progress, the `invalidate` callback fired exactly once with `0.5`, `motion.position` is `0.5`, and the call threw `TypeError` matching `/Motion tracks have no compiled Track: track-1\./` naming only that id.
- **C-7 dispose tolerance.** `disposeTracks: true`, one of three ids dropped from the registry, `dispose()` does not throw and the two resolvable Tracks are disposed.
- **C-8 replaceTrack narrowed job.** Replacing an existing id updates `duration`, keeps the array index, and re-seeds the resolved Track; replacing an unknown id still throws `/Unknown Motion track id/`; a non-positive or non-finite duration still throws `/Motion track duration must be a finite positive number/`.

### 4.2 Integration, `option-c-track-resolution.test.ts`

Drive the public `Engine` / `ProjectHandle` surface only. Use `createManualClock` + `createFakeScheduler` and flush explicitly between ticks, or `Motion.#scheduleProgress` coalescing will hide intermediate values.

- **C-9 replace on a motion-owned track.** `signal` to `0.5`, `replace` with a new definition, tick and flush: no `Track is disposed`, and the composed value reflects the new definition at `0.5`.
- **C-10 stagger index preserved.** Three motion-owned tracks with `stagger: 100`; replace the first; composed values match index `0` timing, not index `2`.
- **C-11 observation path.** `addObserve` then `removeObserve` on a motion-owned track, then apply progress: no throw.
- **C-12 disposal count.** `handle.dispose()` kills each compiled timeline exactly once. Count via an interpolator wrapper that increments on `kill()`.
- **C-13 runtime add then remove.** `handle.addTrack(track, { motionId })`, mount, apply progress, `remove()`, then apply progress again: the removed id is gone from the Motion, nothing throws, and re-adding the same id works. _Proves `removeTrack` and the resolver cannot disagree._

### 4.3 Red-before-green evidence

- **C-4, C-5, C-6 are the required red evidence.** Run them on the parent commit and record the output in the PR. They will fail to compile there, because `resolveTrack` does not exist yet; a typecheck failure on the parent is acceptable red evidence under the repo's failing-first guardrail, but you must **also** record C-5 as an assertion failure. To do that, temporarily express C-5 against the current API (capture the Track reference, dispose it behind the Motion's back, apply progress, observe `Track is disposed`) and paste that output. Then delete the temporary form; it does not ship.
- **C-9 through C-13 must pass both before and after.** They are behavior-preservation guards, not new-behavior proofs. If any of them is red on the parent, stop: you have found a separate bug and this plan is not the place to fix it.

### 4.4 Suites that must stay byte-identical

`issue-114-motion-track-regressions.test.ts`, `replace-motion-track.test.ts`, `phase2-motion-scheduling.test.ts`, `phase3-trigger-port.test.ts`, `motion-trigger-lifecycle.test.ts`, `trigger-time.test.ts`, `trigger-scroll.test.ts`, `unified-mutation-surface.test.ts`, `observation-identity.test.ts`.

If any of them needs an edit to pass, **stop and escalate**. A green suite that had to be edited is not evidence of preserved behavior.

---

## 5. Forbidden in this slice

- Touching any trigger, driver, factory, clock-binding, or graph file.
- Changing `#effectiveProgress`, `#totalDuration`, `#progressDelta`, or `schedule()`.
- Removing or defaulting `disposeTracks`, or removing `#trackMap`'s duplicate-id role.
- Editing `packages/core/src/index.ts` or any export list.
- Editing `ProjectRuntime` beyond the C6 comment.
- Fixing the adjacent findings still open from the trigger plan: `edgeKey`'s `|` separator collision (8.2), `seek` bypassing the Motion (8.3), the `signal()` versus manual-port range disagreement (8.4).
- Unifying `manual` onto the time driver, or designing loop / `repeat` / `yoyo`.
- Any new flag, mode, alias, or facade. If one becomes unavoidable, stop; `docs/DECISIONS.md` would need to change and that is a different conversation.

---

## 6. Acceptance gates

Nothing lands until all of these hold.

### 6.1 Commands

`npm run check` green locally, then all seven CI jobs green: `quality`, `integration`, `boundaries`, `build`, `end-to-end`, `performance`, `format`.

### 6.2 Run `npm run format` before every push

The last two archived failures on this base branch, runs [32030244298](https://github.com/chahyasantoso/motion5/actions/runs/32030244298) and [32027461324](https://github.com/chahyasantoso/motion5/actions/runs/32027461324), were both `prettier . --check` flagging **`docs/SESSION-STATUS.md`** and nothing else. This slice edits that exact file. Format before pushing. The write-enabled `format` job only runs after all five behavioral jobs are green and only on same-repo PRs, so cosmetic drift costs a full CI cycle.

### 6.3 Grep gates

- `entry.track` in `packages/core/src`: **zero** hits.
- `track:` inside any `MotionTrackEntry` literal anywhere in the repo: **zero** hits.
- `tracks.get(` in `engine.ts`: exactly four sites, and they are `compile`, the `setProgress` hook, `disposeTrack`, and the `resolveTrack` closure. Nothing else.
- `Unknown graph node` in `packages/core/src`: the surviving throw sites are `Engine.compile`, `Engine.compileTrackDefinition`'s caller path, and `ProjectRuntime.track` / `destroyAdopted`. The two motion-track hooks no longer appear. Grep the test suite for that string and confirm no expectation pointed at the removed sites.
- `import { Track }` in `motion.ts`: **zero**. `import type { Track }`: one.

### 6.4 Counting gates

- `motion.test.ts` still contains 11 tests, with unchanged names and unchanged expected values.
- Total test count strictly increases against the parent commit (parent baseline was 403 passing across 97 files on run [32017487360](https://github.com/chahyasantoso/motion5/actions/runs/32017487360); re-measure on your actual parent, do not hardcode).
- Zero `.skip`, `.todo`, `.only`, or commented-out test introduced.
- `public-declaration-surface.test.ts` and `boundary-scan` green with no allowlist edit.

### 6.5 Semantic size

Nine semantic files, well under the twenty-file ceiling in `docs/PR-WORKFLOW.md`. If your diff exceeds fifteen, you have drifted; re-read section 3.

---

## 7. Commits and pull request

### 7.1 Commit sequence, in order

1. `test(motion): red suite for id-based Track resolution` — the two new test files only. Capture the red output before moving on.
2. `feat(motion): resolve Tracks by id through an injected resolver` — `motion.ts`, `engine.ts`, `fakes.ts`, the `project-runtime.ts` comment, and the `motion.test.ts` rewrite. Green after this commit.
3. `docs(adr): record id-based Motion track resolution` — ADR-031 and `SESSION-STATUS.md`.

Formatting never shares a behavior commit. If the `format` job pushes a `chore: apply prettier` child commit, review it as mechanical-only and let it ride into the squash.

### 7.2 Pull request

Base `feat/adopt-motion-track`. Fill the template, and state all six items `docs/PR-WORKFLOW.md` requires:

1. **Invariant:** a compiled `Track` has exactly one owner, `Engine`'s `tracks` map; no other object can hold a stale reference to one.
2. **Evidence:** `motion-track-resolution.test.ts` C-5 (hot swap) and C-6 (partial failure), plus `option-c-track-resolution.test.ts`.
3. **Ownership:** `Motion` loses Track storage and gains an injected resolver; `Engine` loses two duplicate lookup sites. No responsibility now has two owners.
4. **Public surface:** unchanged. `index.ts` untouched.
5. **Deletions:** the `track` member of `MotionTrackEntry`, `Motion`'s captured Track references, and the `tracks.get` lookups in the `addMotionTrack` / `replaceMotionTrack` hooks.
6. **Status:** `SESSION-STATUS.md` updated here, not promised.

Link the original Actions run as the primary citation. Failed `CI` runs are archived on the `ci-logs` branch at `logs/<run-id>/` with `README.md`, `run.json`, and `failed-jobs.log`; `workflow_run` is unfiltered by head branch now, so a `docs/**` branch does get archived. If a run you need is missing, dispatch **Archive CI logs** manually with the run id. Never develop on `ci-logs`.

Squash merge only when every required check is green. Never weaken a test to merge.

---

## 8. Bottom line

Option A stopped the bleeding by teaching `Motion` to swap its captured Track in place. Option C removes the capture.

The decisive rules, restated so they cannot drift:

- **One compiled Track owner: `Engine`'s `tracks` map.** Every other consumer resolves by id, per use.
- **`Motion` holds ids and durations. Never instances.**
- **A missing Track is loud, and never silently partial.** Single-track operations throw immediately; a progress sweep completes, invalidates, then throws.
- **`replaceTrack` survives, narrowed.** Same index, same stagger, updated duration, re-seeded progress.
