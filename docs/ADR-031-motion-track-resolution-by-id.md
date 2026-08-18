# ADR-031: Motion resolves compiled Tracks by id

**Status:** Accepted, 2026-08-17

**Implements:** option C of [issue #114](https://github.com/chahyasantoso/motion5/issues/114).

## Context

ADR-029 fixed a stale-reference bug by teaching `Motion` to swap its captured compiled `Track` in place. That fix was correct and shipped, but it left the underlying condition intact: two objects owned the same compiled `Track`. `Engine` held the `tracks` map, which `compose`, `setProgress`, and `disposeTrack` already treated as the source of truth, and every `MotionTrackEntry` held a second reference to the same instance.

A second owner means every future path that disposes or recompiles a node has to remember to notify `Motion`. `#replaceTrack` forgot once already. Nothing structural stopped the next one from forgetting again, and a forgotten notification is invisible until a scheduled progress application throws `Track is disposed`.

## Decision

`MotionTrackEntry` carries `{ id, duration? }` and nothing else. `MotionOptions` gains a required `resolveTrack: (id: string) => Track | undefined`, and `Motion` calls it at every point of use. `Motion` never stores, caches, or memoizes a `Track`, and imports the type only.

`Engine` passes `resolveTrack: (id) => tracks.get(id)` into every `Motion`, and stops resolving Tracks on its behalf. The `addMotionTrack` and `replaceMotionTrack` hooks pass ids and durations; their `Unknown graph node` lookups are deleted. Hook signatures on `ProjectRuntimeOptions` are unchanged, because the runtime never handled `Track` instances in the first place.

`Motion.replaceTrack` survives with a narrowed job. It no longer swaps a reference, because there is no reference. It still validates the id and duration, writes the entry at its original array index, and re-seeds the resolved Track with the current effective progress. ADR-029's guarantee that replacement preserves index and stagger timing is therefore unchanged, and its evidence suite is unchanged.

## Failure ordering

An unresolved id is always loud, and never silently partial.

1. Single-track operations, `addTrack` and `replaceTrack`, throw immediately with `Motion track "<id>" has no compiled Track.`, and they leave the `Motion` unchanged. Both resolve the compiled Track **and** seed it with its effective progress before writing `#tracks` or `#trackMap`, so a rejection from either stage costs nothing and the caller can retry it once the Track is live. That second half was implicit here and only half true in the code until [issue #147](https://github.com/chahyasantoso/motion5/issues/147): resolution ran before any mutation, but the seeding call ran after both writes, and a resolvable Track can be disposed because this decision hands Track lifetime to the resolver's caller. "Immediately" is therefore stated as "and changes nothing" rather than left to be read into it.
2. A progress sweep does not abort. Every resolvable entry receives its effective progress, `invalidate` fires as normal, and only then does the sweep throw once, naming every unresolved id in array order: `Motion tracks have no compiled Track: a, b.` This mirrors the clock-consumer fanout in `Engine.load()`, which already collects failures and reports after the loop. Aborting mid-sweep was symptom 1 of issue #114, and suppressing invalidation was symptom 2; fixing the reference class of bug while keeping those two would have been pointless.
3. Disposal is best effort and never throws. An id the resolver no longer knows is a no-op, and the resolvable Tracks are still disposed.

The seeded value in point 1 is computed against the entry list the mutation is about to commit, not the one it starts from, because `#totalDuration` reduces over the entries. The pre-mutation list would seed a staggered Motion with a different number, so `#effectiveProgress` and `#totalDuration` take the list as an explicit parameter and each call site says which one it means. Seeding first is not implemented as catch-and-restore: there is no committed state to undo, so the class gains no second notion of rollback and ADR-035's precedence rule has nothing to arbitrate here.

`ProjectRuntime.#replaceTrack` keeps its existing order: validate the candidate graph, replace it, dispose the old compiled Track, compile the new one, then call `replaceMotionTrack`. The hook must stay after `compileTrack`, because the resolver reads the live compiled map and would otherwise resolve the disposed instance.

## Disposal ownership

`disposeTracks` defaults to **`false`**. A `Motion` never disposes a Track it merely resolved, because this decision hands Track lifetime to the resolver's caller, and a borrower that kills a lender's instance would reinstate the second owner the ADR removes. The flag survives as an explicit opt-in for callers that really do delegate lifetime, which is what directly constructed Motions in the unit suite do. `Engine` passes `false` explicitly and is therefore unaffected by the default in either direction.

This **amends decision C8** of `docs/IMPLEMENTATION-PLAN-motion-track-resolution.md`, which specified a `true` default and listed the flip under forbidden. The amendment and its consequences are recorded in `docs/IMPLEMENTATION-PLAN-motion-track-resolution-corrections.md`; the reasoning is that C8 was written before the single-owner invariant existed, so it answered a question that option C re-asks.

## Consequences

The stale-compiled-reference class of bug is gone rather than patched: no code path can leave a `Motion` pointing at a retired `Track`, because no path can make a `Motion` point at a `Track` at all. New recompilation paths need no notification hook.

The cost is that every direct `Motion` construction has to supply a resolver. The public surface does not move: `Motion` and `MotionOptions` are package-private, and `packages/core/src/index.ts` is untouched.

Handing Track lifetime to the resolver's caller also makes "resolvable but disposed" a normal state rather than an impossible one, which is the condition issue #147 turned into a defect. That is a consequence of this decision, not an accident of the code that implements it, which is why the atomicity guarantee is stated in `Failure ordering` above rather than left to each call site.

## Evidence

- `packages/core/test/unit/domain/motion-track-resolution.test.ts` covers the resolver contract, late registration, hot swap behind the Motion's back, partial sweep failure, dispose tolerance, and the narrowed `replaceTrack`. It also asserts on the domain source, because a cached reference that happens to be correct is invisible to behavioral tests.
- `packages/core/test/unit/domain/motion-dispose-ownership.test.ts`, cases C-14 through C-16, evidences the disposal ownership decision above: a resolver-owned Track survives Motion disposal, a rotated instance is never disposed, and a Track shared by two Motions stays usable after one of them is disposed.
- `packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts`, cases `M-1` through `M-6`, evidences the atomicity in point 1 of `Failure ordering`: a refused `addTrack` or `replaceTrack` commits nothing and can be retried, whether the seed fails on a disposed Track or inside injected interpolator code, and `M-6` pins the seeded value of a staggered Motion so the ordering cannot drift it.
- `packages/core/test/integration/option-c-track-resolution.test.ts` proves the public surface is unchanged: replacement, stagger index preservation, the observation path, disposal counts, and runtime add and remove.
- `packages/core/test/integration/issue-114-motion-track-regressions.test.ts` and `replace-motion-track.test.ts` stay green and unedited, which is what keeps ADR-029 evidenced independently of this change.
