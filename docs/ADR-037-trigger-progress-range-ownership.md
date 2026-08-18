# ADR-037: the trigger progress range has one owner, and normalization is a different job

**Status:** accepted  
**Date:** 2026-08-18  
**Closes:** deferred finding 8.4 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md`, filed as [issue #138](https://github.com/chahyasantoso/motion5/issues/138), originally flagged in `docs/EXPLORATION-trigger-drivers.md` section 4.1

## Context

Section 10 of the trigger plan states the invariant as _"One Motion input: normalized progress in `[0, 1]`."_ Three objects implemented that sentence and gave three different answers for the same value.

- `Motion.signal()` threw `TypeError` for non-finite and `RangeError` for outside `[0, 1]`.
- `createManualTriggerPort().emit()` validated nothing.
- `createScrollTriggerPort` clamped, and `Motion.#scheduleProgress` clamped again.

So `1.5` threw through `handle.signal()`, was silently clamped through a manual port, and was silently clamped twice through a scroll port. One value, three contracts, decided by which door it entered.

The non-finite path was not merely inconsistent. `Math.max(0, Math.min(1, NaN))` is `NaN`, so both clamps were partial and a non-finite emission passed straight through: `#scheduleProgress` stored `#pendingProgress = NaN`, the flush assigned `#position = NaN` **before** the track sweep, and `Track.setProgress` then threw `TypeError: Track progress must be finite.` The result was a permanently `NaN` `Motion.position`, a throw at the scheduler flush rather than the emit site, and a message blaming the `Track` for a value a port handed in. `#setProgress` deliberately does not abort the sweep on failure, so the existing guard could not catch it either.

That also violated rule 6 of section 0.1: a declared trigger either works or fails loudly. A port handing in garbage got a quiet clamp or a misattributed deferred throw.

## Decision

Two distinct jobs, one owner each.

**Normalization belongs to the source adapter, and only where the signal is physically noisy.** A scroll position is measured, so clamping `1.0000001` to `1` is noise removal rather than a fallback that hides a declared trigger failure. The clamp stays in `createScrollTriggerPort`, but it becomes total: a non-finite push is rejected with `TypeError: ScrollSource progress must be a finite number.` instead of being forwarded.

**Validation belongs to `Motion.#scheduleProgress`, the single funnel every `TriggerPort` reaches.** After the adapter, progress is already normalized, so anything outside `[0, 1]` is a contract violation and must be loud. Two consequences are load-bearing:

- The rule is checked **before** the liveness guard. A Motion that is attached but not advancing must still teach the port about its own bug; dropping the value silently is how the defect stayed invisible.
- `#scheduleProgress` no longer clamps at all. Clamping and validating the same value in the same place is just two owners in one function.

`signal()` delegates instead of keeping its own copy of the rule, so there is exactly one implementation. Both error types and both message strings are unchanged, so the contract asserted by case `2.7` of the trigger plan is preserved.

`#onTick` clamps its own arithmetic, because that is an internal computation rather than external input, and it previously relied on `#scheduleProgress` for the lower bound.

`createManualTriggerPort` stays a dumb transport and validates nothing. The code says so in a comment, so the next reader does not add a fourth owner. A malformed emission still fails at the emit site: the throw propagates out of the listener and out of `emit`.

## What is deliberately not changed

`Motion.seek` still clamps, and `ProjectRuntime.seek` still forwards raw progress to `Track.setProgress`. That is the `seek` boundary of section 8.3, documented by `T5`, pinned by case `T-12`, and owned by ADR-021, which says not to gate it. `Track.setProgress` also keeps its own clamp; it is a leaf guarding its own domain, not a second owner of the trigger input rule.

The time driver already emits `Math.min(1, elapsed / duration)` and `createManualClock` rejects negative deltas, so no in-tree driver can trip the new guard.

## Two corrections to the issue as filed

Both were found while implementing it, and both are recorded here rather than fixed silently.

**Case `R-3` cannot be written against `pause()`.** The issue asserted that `trigger.emit(2)` should throw on a paused Motion, reasoning that `#scheduleProgress` returns on the liveness guard before looking at the value. It does, but `Motion.pause()` also runs `#triggerUnsubscribe`, so a paused Motion's port has no listener left and nothing can throw through it. Making that form pass would require either validating inside the manual port, which is the fourth owner this record exists to prevent, or changing what `pause()` means, which is out of scope and is asserted by three other cases. `R-3` therefore uses the reachable form of the same rule: mounted, attached, and not yet playing, and `R-5` pins the paused case as detachment by design so nobody restates `R-3` and then adds the fourth owner to make it pass.

**The regression surface was incomplete.** The issue states that no test asserts a clamped trigger emission. Case `2` of `packages/core/test/integration/phase3-trigger-port.test.ts` asserted exactly that, through `createManualTriggerPort` into a live Motion, with `trigger.emit(-0.5)` then `expect(motion.position).toBe(0)` and `trigger.emit(1.5)` then `expect(motion.position).toBe(1)`. It is inverted to the new contract in the same commit as the red tests rather than deleted, because the case is about the boundary and the boundary still exists; it also keeps an in-range emission so it proves behavior rather than only a throw.

## Consequences

An out-of-range or non-finite emission through a `TriggerPort` now throws at the emit site instead of being clamped or deferred. No signature changes and no export changes, so `public-declaration-surface.test.ts` runs unchanged.

A custom driver that relied on the clamp to accept `1.0000001` must normalize in its own adapter, which is where the measurement is understood. That is the point of the split rather than a side effect of it.

`docs/TRD.md` requirement `TR-M-07` says progress "must be clamped to `[0, 1]` and non-finite progress input must be rejected." Both halves still hold somewhere, but the sentence does not say where, and after this record clamping and rejection have different owners. Restating it is a wording change to a requirements document and is left to its own change rather than folded into a bug fix.

## Evidence

`packages/core/test/unit/domain/motion-progress-range.test.ts`:

- `R-1` an out-of-range port emission is rejected exactly as `signal()` rejects it, and no `Track.setProgress` call survives the flush.
- `R-2` a non-finite emission is rejected at the boundary: nothing is queued and `position` stays `0`, instead of the deferred throw that blamed the `Track`.
- `R-3` a mounted Motion that is not playing rejects rather than swallows.
- `R-5` a paused Motion's port is detached rather than silently swallowing. Not red, and not claimed as red; it guards `R-3`'s wording.

`packages/core/test/unit/adapters/scroll-trigger-range.test.ts`:

- `R-4` the adapter still clamps `1.5` and `-1` to `1` and `0`, and rejects `NaN` and `Infinity` rather than forwarding them.

Red before green is executed and archived rather than described. The first commit on the fix branch is tests only, so run [32129333099](https://github.com/chahyasantoso/motion5/actions/runs/32129333099), archived at `logs/32129333099/` on `ci-logs`, is the failing run against the unmodified parent `dba6cfd`. It reports `5 failed | 446 passed` in `quality`, the five being `R-1` through `R-4` and the inverted phase 3 case, and it confirms `R-5` and the other 446 cases are green on the parent.

Case `3.1` of `packages/core/test/integration/trigger-scroll.test.ts` asserts end-to-end clamping of `2` and `-1` and stays green, because the adapter keeps clamping. The only other clamp assertions in the suite are on `Motion.seek` and `Track.setProgress`, and neither is touched.

The `R-` series is new. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` matched only `C-` and `T-`, so `CASE_TITLE` is widened to `(?:C|E|R|T)` in the same commit. `E-` is included for [issue #137](https://github.com/chahyasantoso/motion5/issues/137) so that whichever of the two lands second rebases instead of widening the pattern again.
