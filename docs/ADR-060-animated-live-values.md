# ADR-060: an animated live value, on both entry points, through one record-shaped port member

- **Status:** accepted
- **Date:** 2026-08-31
- **Supersedes nothing. Narrows:** [ADR-059](./ADR-059-live-value-overlay.md)
- **Issue:** [#231](https://github.com/chahyasantoso/motion5/issues/231), follow-up to
  [#222](https://github.com/chahyasantoso/motion5/issues/222)

## Context

ADR-059 gave a loaded project two cheap live-value members and refused an animated key by name on
both of them. The refusal was correct for the mechanism it had: `Track.interpolated()` returns
`{ ...interpolated, ...this.#values }`, so a masked key shadows the timeline at every progress, and
accepting a stop list there would have been a permanently frozen animation. `LV-12` pinned that the
`Interpolator` port had grown no per-key member, so the refusal could not be replaced quietly by a
half-built capability.

Two plans then tried to lift it. Plan v1 wanted a paused `gsap.to` per key and a widened `add()`.
Plan v2 wanted `patchKey(key, leaf)` on the timeline adapter and concluded that `overrideValues`
could not be lifted at all, because the mask is what an override is. Both were verified against the
same `main`; the second's conclusion is the one this ADR reverses.

## Decision

**One invariant.** An animated key's tweens are replaced on the still-live timeline against a
retained base record, and every reader of `state` sees only the effective stops; an overlay is
revertible wholesale and a rebase is sticky; or the write is refused by name before anything mutates,
or it escalates to the recompile that was always available and is correct there, at the same
progress.

**The mask is not the definition of an override.** `#writeValues` already stated the real one in its
own doc comment: the retained definition is the only difference between the two entry points. So an
animated override is a timeline write that does not move the retained definition, which means it must
be revertible. The mask gets revertibility for free by being rebuilt from the definition on every
write; a patched timeline does not get it for free at all. Revertibility, not the mask, is the entire
cost of lifting `overrideValues`, and plan v2 priced it as impossible instead of pricing it.

**The port member is record-shaped, and there is exactly one of it.**
`InterpolationTimeline.patchKeys?(overlay, rebase?)` takes the whole overlay rather than one key,
because a per-key member cannot express "this key is no longer overridden": there is no leaf to pass,
since the only surviving answer is the record the adapter compiled from and only the adapter still
has it. A companion `restoreKey` would be a second member with a second refusal set that has to agree
with the first. The effective record is the base with the overlay written over it, so a key dropped
from the overlay is restored by exactly the code that patches a changed one, and
wholesale-replacement semantics are identical to the mask's. `rebase: true` makes the effective
record the new base, which is `setValues`: one boolean at the adapter mirroring `retained` being the
one difference at the runtime. The boolean selects which retained record the effective set is written
into, not which behavior runs, and there is exactly one behavior.

**`patchKeys` has no refusal set, and that is what makes the optional member Liskov-safe.** `false`
means escalate, always, and nothing else. Key legality is `Track`'s and is answered before the call.
Compilation failure is `create()`'s, which already throws `KeyframeCompilationError` from the one
place that owns it, so an overlay that cannot compile is declined, escalated, and the recompile
raises the same error the same way it would have without the capability. The patching backend and the
declining backend are therefore observably identical on success and on failure.

**Whole-record compilation closes the ease-collision hole instead of arguing about it.**
`plugin-contribution-ease-collision` fires only when two different keys author a conflicting `ease`
at one percent, so a one-entry compile was structurally blind to it. The effective record is the
whole record, so the compiler sees exactly the diagnostics a fresh compile would.

**The refusal set narrows rather than disappearing.** `LiveValueRefusal` becomes
`"unknown" | "kind" | "prepared"`. A kind change is refused because a scalar for an animated key
would delete the key from `compiled.properties` and a stop list for a static key would add one:
neither is a patch, both are recompiles of a different shape, and a live write moves a value rather
than changing what a leaf is. A plugin-prepared key is refused because `Track.preparedConfig` merges
`plugins.preparation.keyframes` over the authored keyframes while an overlay sits over the base, so
patching one would invert that precedence and make the live timeline disagree with the next real
recompile.

**`"animated"` is retired entirely, and that is a break to name.** With both entry points lifted and
a decline escalating rather than refusing, no code path can produce it. The codebase's own rule
applies to a union member as much as to a field: removed and then refused, never left declared. A
caller branching on `error.reason` is affected.

**`LiveValues` stays closed to `AuthoredStaticValue`, and only the boundary widens.**
`contract/track-handle` gains `AuthoredValues`, which is `LiveValues` widened per key to
`AuthoredProperty`, and both members take it. `LiveValues` survives unchanged as the type of the
mask, of `Track.#values`, and of the hook's static half. That is the finding stated as a type rather
than only as a check: the mechanism that could freeze an animation remains structurally unable to
receive one.

**Validation goes through `validateTrackDefinition`, once, and it is the same object the escalation
compiles.** ADR-059's "no whole-definition validation" held because `LiveValues` was closed to
scalars, so nothing a caller could pass had a shape to get wrong. An authored stop list is
definition-shaped input and `validateKeyframes` owns its shape, so an animated write validates the
rewritten definition before anything mutates, on both entry points, and that same value is what an
escalation compiles from. A static-only write skips it and keeps today's cost exactly.

**The escalation needs neither `#replaceTrack` nor `replaceGraph`.** `#replaceTrack` validates
topology, replaces the graph, and sets the map entry to the definition it compiled, and all three are
wrong here: topology did not change, `#writeValues` deliberately avoids `replaceGraph`, and the
compiled and retained definitions have to be able to differ. The escalation is `stageTrack` on the
compile input, `commit()`, a re-seek through the `#setProgress` the runtime already holds, and then
the single `invalidate` `#writeValues` already ended with. Progress restoration is therefore one
explicit line in the only path that escalates, rather than a patch on top of a path that resets it.

**ADR-059's one-hook decision is restored rather than reversed.** Plan v2 split
`ProjectRuntimeOptions` into two hooks because it had two mechanisms with different refusal sets.
There is one mechanism again, so there is one hook: it is renamed `writeValues`, takes the static
mask, the animated overlay and the rebase flag, and returns whether the write was patched plus the
progress the Track is holding. Plan v2's reversal was wrong because it inferred two owners from two
spellings of one operation.

## Consequences

- `TrackEntry` gains an `overlay` field, the animated half of the last live write. It is a private map
  entry and no public surface carries it. It exists because a revert names no key at all, so without
  it an `overrideValues({})` would be indistinguishable from a static-only write and would leave a
  patched timeline patched.
- `GsapTimelineLike` gains `recent()`. `to()` returns the timeline rather than the tween it added, so
  collecting its return value gives N references to one object and the first `kill()` takes every
  sibling with it. A real `gsap.timeline()` already answers `recent()`, so no host shim moves and
  `test/support/real-gsap.ts` is unchanged.
- The terminal padding tween is excluded from the retained per-key map explicitly. It is owned by no
  key and pins total length, so killing it would renormalize `progress()` against a shorter timeline
  and move every mapped time silently.
- `createGsapOneTweenInterpolator` and the fake in `testing/` decline the capability by design. One
  `gsap.to` carrying a `keyframes` map has no per-key child to kill, so declaring the member there
  would be a lie. Interface segregation because an implementation genuinely cannot honor it.
- A static-only live write is byte-identical to what it was: no whole-record recompile, no capability
  lookup, and no definition validation.
- `assertInterpolator` is unchanged, because the capability is not part of what makes something an
  `Interpolator`, and `EngineOptions.interpolator` needs no new member for it to be reachable.
- Nothing in `graph/`, `contract/authored-leaf`, `domain/keyframe-compiler`, `runtime/` below
  `project-runtime`, or the plugins is touched. `domain/keyframe-compiler.ts` and
  `contract/authored-leaf.ts` gain no import, and `domain/track.ts` gains no GSAP type.

## Evidence

`PK-1` through `PK-19`. `PK-1` through `PK-11` own the timeline adapter, in
`packages/core/test/contract/gsap-patch-keys.test.ts`, against real gsap. `PK-12` through `PK-19` own
`Track` and the runtime, in `packages/core/test/unit/domain/track-live-values.test.ts`,
`packages/core/test/unit/runtime/live-value-animated.test.ts`, and
`packages/core/test/unit/runtime/live-value-updates.test.ts`.

`LV-11` and `LV-12` retire in full, by name. `LV-11` asserted that both entry points refuse an
animated key and `LV-12` asserted that the port grew no member, and this slice deletes the reason
both assert. `PK-18` replaces `LV-12` with the inverse gate: the series that owns whether a thing
exists retires the case that pinned its absence.
