# ADR-031: Motion resolves compiled Tracks by id

**Status:** Accepted, 2026-08-17

**Implements:** option C of [issue #114](https://github.com/chahyasantoso/motion5/issues/114).

## Context

ADR-029 fixed stale-reference bug by teaching `Motion` to swap captured compiled `Track` in place. Fix correct, shipped, left underlying condition intact: two objects owned same compiled `Track`. `Engine` held `tracks` map, which `compose`, `setProgress` and `disposeTrack` already treated as source of truth; every `MotionTrackEntry` held second reference to same instance.

Second owner means every future path disposing or recompiling node must remember to notify `Motion`. `#replaceTrack` forgot once already. Nothing structural stopped next one forgetting again; forgotten notification invisible until scheduled progress application throws `Track is disposed`.

## Decision

`MotionTrackEntry` carries `{ id, duration? }` and nothing else. `MotionOptions` gains required `resolveTrack: (id: string) => Track | undefined`; `Motion` calls it at every point of use. `Motion` never stores, caches or memoizes a `Track`; imports type only.

`Engine` passes `resolveTrack: (id) => tracks.get(id)` into every `Motion`, stops resolving Tracks on its behalf. `addMotionTrack` and `replaceMotionTrack` hooks pass ids and durations; their `Unknown graph node` lookups deleted. Hook signatures on `ProjectRuntimeOptions` unchanged: runtime never handled `Track` instances.

`Motion.replaceTrack` survives with narrowed job. No longer swaps reference — there is none. Still validates id and duration, writes entry at original array index, re-seeds resolved Track with current effective progress. ADR-029's guarantee that replacement preserves index and stagger timing unchanged, evidence suite unchanged.

## Failure ordering

Unresolved id always loud, never silently partial.

1. Single-track operations, `addTrack` and `replaceTrack`, throw immediately with `Motion track "<id>" has no compiled Track.`, leave `Motion` unchanged. Both resolve compiled Track **and** seed it with effective progress before writing `#tracks` or `#trackMap`, so rejection from either stage costs nothing; caller can retry once Track live. Second half implicit here, only half true in code until [issue #147](https://github.com/chahyasantoso/motion5/issues/147): resolution ran before any mutation, seeding call ran after both writes; resolvable Track can be disposed because this decision hands Track lifetime to resolver's caller. "Immediately" therefore stated as "and changes nothing", not left to be read into it.
2. Progress sweep does not abort. Every resolvable entry receives effective progress; `invalidate` fires as normal; only then sweep throws once, naming every unresolved id in array order: `Motion tracks have no compiled Track: a, b.` Mirrors clock-consumer fanout in `Engine.load()`, already collects failures, reports after loop. Aborting mid-sweep symptom 1 of issue #114, suppressing invalidation symptom 2; fixing reference class of bug while keeping those two pointless.
3. Disposal best effort, never throws. Id resolver no longer knows is no-op; resolvable Tracks still disposed.

Seeded value in point 1 computed against entry list mutation about to commit, not one it starts from: `#totalDuration` reduces over entries. Pre-mutation list would seed staggered Motion with different number, so `#effectiveProgress` and `#totalDuration` take list as explicit parameter; each call site says which one it means. Seeding first not catch-and-restore: no committed state to undo, class gains no second notion of rollback, ADR-035's precedence rule nothing to arbitrate here.

`ProjectRuntime.#replaceTrack` keeps existing order: validate candidate graph, replace it, dispose old compiled Track, compile new one, then call `replaceMotionTrack`. Hook must stay after `compileTrack`: resolver reads live compiled map, would otherwise resolve disposed instance.

## Disposal ownership

`disposeTracks` defaults to **`false`**. `Motion` never disposes Track it merely resolved: this decision hands Track lifetime to resolver's caller; borrower killing lender's instance would reinstate second owner ADR removes. Flag survives as explicit opt-in for callers really delegating lifetime — what directly constructed Motions in unit suite do. `Engine` passes `false` explicitly, unaffected by default either direction.

This **amends decision C8** of `docs/IMPLEMENTATION-PLAN-motion-track-resolution.md`, which specified `true` default, listed flip under forbidden. Amendment and consequences recorded in `docs/IMPLEMENTATION-PLAN-motion-track-resolution-corrections.md`; reasoning: C8 written before single-owner invariant existed, answered question option C re-asks.

## Consequences

Stale-compiled-reference class of bug gone, not patched: no code path can leave `Motion` pointing at retired `Track`, because no path can make `Motion` point at `Track` at all. New recompilation paths need no notification hook.

Cost: every direct `Motion` construction must supply resolver. Public surface does not move: `Motion` and `MotionOptions` package-private; `packages/core/src/index.ts` untouched.

Handing Track lifetime to resolver's caller also makes "resolvable but disposed" normal state, not impossible one — condition issue #147 turned into defect. Consequence of this decision, not accident of implementing code; why atomicity guarantee stated in `Failure ordering` above, not left to each call site.

## Evidence

- `packages/core/test/unit/domain/motion-track-resolution.test.ts` covers resolver contract, late registration, hot swap behind Motion's back, partial sweep failure, dispose tolerance, narrowed `replaceTrack`. Also asserts on domain source: cached reference that happens to be correct invisible to behavioral tests.
- `packages/core/test/unit/domain/motion-dispose-ownership.test.ts`, cases C-14 through C-16, evidences disposal ownership above: resolver-owned Track survives Motion disposal; rotated instance never disposed; Track shared by two Motions stays usable after one disposed.
- `packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts`, cases `M-1` through `M-6`, evidences atomicity in point 1 of `Failure ordering`: refused `addTrack` or `replaceTrack` commits nothing, can be retried, whether seed fails on disposed Track or inside injected interpolator code; `M-6` pins seeded value of staggered Motion so ordering cannot drift it.
- `packages/core/test/integration/option-c-track-resolution.test.ts` proves public surface unchanged: replacement, stagger index preservation, observation path, disposal counts, runtime add and remove.
- `packages/core/test/integration/issue-114-motion-track-regressions.test.ts` and `replace-motion-track.test.ts` stay green, unedited — keeps ADR-029 evidenced independently of this change.
