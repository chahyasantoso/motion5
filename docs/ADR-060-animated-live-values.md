# ADR-060: an animated live value, on both entry points, through one record-shaped port member

- **Status:** accepted
- **Date:** 2026-08-31
- **Supersedes nothing. Narrows:** [ADR-059](./ADR-059-live-value-overlay.md)
- **Issue:** [#231](https://github.com/chahyasantoso/motion5/issues/231), follow-up to
  [#222](https://github.com/chahyasantoso/motion5/issues/222)

## Context

ADR-059 gave loaded project two cheap live-value members and refused animated key by name on both. Refusal correct for mechanism it had: `Track.interpolated()` returns `{ ...interpolated, ...this.#values }` → masked key shadows timeline at every progress, and accepting stop list there would be permanently frozen animation. `LV-12` pinned `Interpolator` port grew no per-key member, so refusal could not be replaced quietly by half-built capability.

Two plans then tried to lift it. Plan v1 wanted paused `gsap.to` per key and widened `add()`. Plan v2 wanted `patchKey(key, leaf)` on timeline adapter and concluded `overrideValues` could not be lifted at all, because mask is what override is. Both verified against same `main`; second's conclusion is one this ADR reverses.

## Decision

**One invariant.** Animated key's tweens are replaced on still-live timeline against retained base record, and every reader of `state` sees only effective stops; overlay revertible wholesale and rebase sticky; or write refused by name before anything mutates, or escalates to recompile always available and correct there, at same progress.

**The mask is not the definition of an override.** `#writeValues` already stated real one in its doc comment: retained definition is only difference between two entry points. So animated override is timeline write that does not move retained definition → must be revertible. Mask gets revertibility free by being rebuilt from definition on every write; patched timeline does not get it free at all. Revertibility, not mask, is entire cost of lifting `overrideValues`, and plan v2 priced it as impossible instead of pricing it.

**The port member is record-shaped, and there is exactly one of it.** `InterpolationTimeline.patchKeys?(overlay, rebase?)` takes whole overlay rather than one key, because per-key member cannot express "this key is no longer overridden": no leaf to pass, since only surviving answer is record adapter compiled from and only adapter still has it. Companion `restoreKey` would be second member with second refusal set that must agree with first. Effective record is base with overlay written over it → key dropped from overlay restored by exactly code that patches changed one; wholesale-replacement semantics identical to mask's. `rebase: true` makes effective record new base, which is `setValues`: one boolean at adapter mirroring `retained` being one difference at runtime. Boolean selects which retained record effective set written into, not which behavior runs; exactly one behavior.

**`patchKeys` has no refusal set, and that is what makes optional member Liskov-safe.** `{ kind: "recompile" }` means escalate, always, nothing else. Key legality is `Track`'s and answered before call. Compilation failure is `create()`'s, which already throws `KeyframeCompilationError` from one place that owns it → overlay that cannot compile declined, escalated, recompile raises same error same way it would have without capability. Patching backend and declining backend therefore observably identical on success and failure.

**Whole-record compilation closes the ease-collision hole instead of arguing about it.** `plugin-contribution-ease-collision` fires only when two different keys author conflicting `ease` at one percent → one-entry compile structurally blind to it. Effective record is whole record → compiler sees exactly diagnostics fresh compile would.

**The refusal set narrows rather than disappearing.** `LiveValueRefusal` becomes `"unknown" | "kind" | "prepared"`. Kind change refused because scalar for animated key would delete key from `compiled.properties` and stop list for static key would add one: neither patch; both recompiles of different shape; live write moves value rather than changing what leaf is. Plugin-prepared key refused because `Track.preparedConfig` merges `plugins.preparation.keyframes` over authored keyframes while overlay sits over base → patching one inverts that precedence and makes live timeline disagree with next real recompile.

**`"animated"` is retired entirely, and that is a break to name.** Both entry points lifted and decline escalates rather than refuses → no code path can produce it. Codebase's own rule applies to union member as much as field: removed then refused, never left declared. Caller branching on `error.reason` affected.

**`LiveValues` stays closed to `AuthoredStaticValue`, and only the boundary widens.** `contract/track-handle` gains `AuthoredValues`, which is `LiveValues` widened per key to `AuthoredProperty`, and both members take it. `LiveValues` survives unchanged as type of mask, of `Track.#values`, and of hook's static half. Finding stated as type rather than only check: mechanism that could freeze animation remains structurally unable to receive one.

**Validation goes through `validateTrackDefinition`, once, and it is same object escalation compiles.** ADR-059's "no whole-definition validation" held because `LiveValues` closed to scalars → nothing caller could pass had shape to get wrong. Authored stop list definition-shaped input and `validateKeyframes` owns its shape → animated write validates rewritten definition before anything mutates, on both entry points, and that same value is what escalation compiles from. Static-only write skips it and keeps today's cost exactly.

**The escalation needs neither `#replaceTrack` nor `replaceGraph`.** `#replaceTrack` validates topology, replaces graph, and sets map entry to definition it compiled; all three wrong here: topology did not change, `#writeValues` deliberately avoids `replaceGraph`, and compiled and retained definitions must be able to differ. Escalation is `stageTrack` on compile input, `commit()`, re-seek through `#setProgress` runtime already holds, then single `invalidate` `#writeValues` already ended with. Progress restoration therefore one explicit line in only path that escalates, rather than patch on top of path that resets it.

**ADR-059's one-hook decision is restored rather than reversed.** Plan v2 split `ProjectRuntimeOptions` into two hooks because it had two mechanisms with different refusal sets. One mechanism again → one hook: renamed `writeValues`, takes static mask, animated overlay and rebase flag, returns whether write was patched plus progress Track is holding. Plan v2's reversal wrong because it inferred two owners from two spellings of one operation.

## Consequences

- `TrackEntry` gains `overlay` field, animated half of last live write. Private map entry, no public surface carries it. Exists because revert names no key at all, so without it `overrideValues({})` indistinguishable from static-only write and would leave patched timeline patched.
- `GsapTimelineLike` gains `recent()`. `to()` returns timeline rather than tween it added, so collecting return value gives N references to one object and first `kill()` takes every sibling with it. Real `gsap.timeline()` already answers `recent()`, so no host shim moves and `test/support/real-gsap.ts` unchanged.
- Terminal padding tween excluded from retained per-key map explicitly. Owned by no key and pins total length → killing it would renormalize `progress()` against shorter timeline and move every mapped time silently.
- `createGsapOneTweenInterpolator` and fake in `testing/` decline capability by design. One `gsap.to` carrying `keyframes` map has no per-key child to kill → declaring member there would be lie. Interface segregation because implementation genuinely cannot honor it.
- Static-only live write byte-identical to what it was: no whole-record recompile, no capability lookup, no definition validation.
- `assertInterpolator` unchanged, because capability is not part of what makes something an `Interpolator`, and `EngineOptions.interpolator` needs no new member for it to be reachable.
- Nothing in `graph/`, `contract/authored-leaf`, `domain/keyframe-compiler`, `runtime/` below `project-runtime`, or plugins touched. `domain/keyframe-compiler.ts` and `contract/authored-leaf.ts` gain no import, and `domain/track.ts` gains no GSAP type. **Refined by [ADR-105](./ADR-105-adapters-do-not-depend-on-domain.md), 2026-09-23:** compiler now lives in `contract/keyframe-compiler.ts`, and domain path no longer exists.

## Evidence

`PK-1` through `PK-19`. `PK-1` through `PK-11` own timeline adapter, in `packages/core/test/contract/gsap-patch-keys.test.ts`, against real gsap. `PK-12` through `PK-19` own `Track` and runtime, in `packages/core/test/unit/domain/track-live-values.test.ts`, `packages/core/test/unit/runtime/live-value-animated.test.ts`, and `packages/core/test/unit/runtime/live-value-updates.test.ts`.

`LV-11` and `LV-12` retire in full, by name. `LV-11` asserted both entry points refuse animated key; `LV-12` asserted port grew no member; this slice deletes reason both assert. `PK-18` replaces `LV-12` with inverse gate: series that owns whether thing exists retires case that pinned its absence.
