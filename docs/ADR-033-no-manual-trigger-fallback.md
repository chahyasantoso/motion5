# ADR-033: a declared trigger type never resolves to a manual fallback

**Status:** accepted  
**Date:** 2026-08-18  
**Slice:** `T5` of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` section 7, as detailed by the T4/T5 trigger parity plan and amended by `docs/IMPLEMENTATION-PLAN-t4-t5-trigger-parity-corrections.md`

## Context

`trigger.type` was validated and then ignored. `Engine.load()` called `createManualTriggerPort()` unconditionally for every Motion, so `scroll` and `time` were decorative: they loaded, they reported no error, and they behaved exactly like `manual`. An author could not tell a working configuration from an inert one, because both produced a Motion that moved only when something called `signal()`.

`T1` through `T4` removed that. `createTriggerFactory` now returns `createTimeDriver(trigger.duration)` for `time`, resolves an injected `ScrollSource` or throws `trigger-driver-unavailable` for `scroll`, and reaches `createManualTriggerPort()` only in the `manual` branch. `ClockBinding` is a total tagged union, so no Motion can hold both a driver and its own clock advance. Unsupported playback fields are rejected at validation rather than accepted and ignored.

So the structural work landed before this slice. What survived was the claim.

Three integration cases asserted that `manual`, `scroll`, and `time` "use the same scheduled progress path", and they asserted it by constructing `Motion` directly around a manual port with a `resolveTrack: () => current as never` track double. They never touched the factory, so they would have stayed green no matter what it did, while reading as evidence that all three types share one input path. That is the inert semantics restated as a test.

The documentation was worse than stale. `docs/AUTHORED-SCHEMA.md` is the normative input contract, and its flagship example authored `trigger: { type: "time", autoplay: false }` with no `duration`. That example is rejected twice over by the runtime it documents, with `trigger-time-duration` and `trigger-time-autoplay-unsupported`.

## Decision

A declared trigger type selects a real driver or fails loudly. No type resolves to a manual fallback, and that is proved by source rather than by behavior, because a behavioral test cannot see a fallback that happens to be unreachable today.

What is forbidden is a manual **fallback**, not the manual port as a transport. A fallback is a port handed back with `acceptsExternalSignal: true` and a `motion` clock binding for a declared `time` or `scroll` trigger. `time-driver.ts` builds its own manual-style port as its emission channel, exactly as section 6.1 of the trigger plan specifies, and that port is driver-owned: it reports `acceptsExternalSignal: false` and a `driver` binding. The guard is therefore positional and capability-based, not a raw count of call sites across `packages/core/src`.

The concrete rules:

- `adapters/trigger-factory/default.ts` contains exactly one `createManualTriggerPort(` call, and it sits after both the `time` and the `scroll` early returns.
- `engine.ts` contains none. Construction is its job; building a port is not.
- `time-driver.ts` contains one, named and allowed, because the port it builds is driver-owned.
- No other file under `src/adapters/trigger-factory/` builds one, so a driver added beside these two cannot quietly reintroduce the fallback.
- Tests that asserted all three trigger types share the manual signal path are retired, not relaxed. Renaming them would have preserved the claim.
- `seek` is documented, not gated. See ADR-021, which this record clarifies rather than supersedes.

Loop semantics stay undesigned. `repeat`, `yoyo`, ping-pong, and any looping behavior are a new plan now that this slice has landed, not an extension of the trigger plan.

## Relationship to other decisions

ADR-028 and ADR-030 are neither superseded nor edited. ADR-028 rejects an invalid definition, ADR-030 rejects an unresolvable scroll source, and ADR-032 rejects an unbuildable one before anything is committed. This record removes the last path by which a rejected concept could have been silently accepted instead.

ADR-021 separated composite `signal()` from leaf `seek()`. This record states the consequence for a driver-backed Motion: `seek` writes node progress directly and the next driver emission overwrites it. That is legitimate scrubbing, not the hole locked decision 4 closes, and gating it behind `acceptsExternalSignal` would need a new decision. ADR-021 carries the clarification in `docs/DECISIONS.md`.

ADR-031 is preserved. No compiled `Track` is captured anywhere, `packages/core/src/domain/motion.ts` is untouched, and the `C-3` source guard stays green without being edited. The trigger suites drop their last `as never` track doubles in favor of `createFakeTrackRegistry`, which is a test-infrastructure change and not a behavior opt-in.

## Consequences

The documented schema now matches the enforced schema. An author who writes `repeat: 0`, `yoyo`, or `autoplay: false` gets an error naming the rule, and an author who declares a `scroll` source with no registered resolver gets one naming the Motion and the key. No configuration silently does nothing.

The trigger factory is the only object that knows trigger kinds. `Motion` takes normalized progress in `[0, 1]` and one capability flag; `Engine` reads a three-state `ClockBinding`. Neither can be made to branch on a trigger type without a new owner appearing, which is what the source guard is for.

The three adjacent findings from section 8 of the trigger plan remain open and are not touched here: the `edgeKey` separator collision, `seek` bypassing the Motion beyond documenting it, and the `signal()` versus manual-port range disagreement.

The public surface is unchanged. No export, schema, or type changed, so `public-declaration-surface.test.ts` runs unchanged with no allowlist edit.

## Evidence

`packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts`:

- `T-8` the factory reaches the manual port exactly once, after both driver branches. Position is the assertion; a port built before the `time` or `scroll` return is a fallback however the branches below it read. The case also asserts both needles exist, so a renamed branch cannot make the guard vacuous.
- `T-9` the driver's own manual port is driver-owned, tying `acceptsExternalSignal: false` and the `driver` binding to the file that owns the third call site.
- `T-10` `engine.ts` has none, and no sibling under `src/adapters/trigger-factory/` builds one.

`packages/core/test/integration/motion-trigger-types.test.ts`:

- `T-11` replaces the three retired cases with one side-by-side contrast across all three types through `Engine` and the real factory: whether `signal()` is accepted, and whether a project clock tick moves the Motion. The per-type suites already prove each type alone, and isolation is how a fallback hides.
- `T-12` pins the `seek` interaction in executable form: a seek applies on a driver-backed node, and the next driver tick overwrites it.

No red-before-green evidence is required or claimed. This slice removes a claim rather than changing a behavior, so every case here passes on the parent by construction, and inventing a failing test to satisfy the guardrail would be theater. The red evidence for the behavior these cases describe is already durable: run [32036837861](https://github.com/chahyasantoso/motion5/actions/runs/32036837861) and run [32096251602](https://github.com/chahyasantoso/motion5/actions/runs/32096251602) on `ci-logs` cover option C and `T4`.
