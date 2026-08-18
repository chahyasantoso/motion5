# Implementation Plan: trigger drivers + observation identity fix

**Status:** Committed plan. Decisions in section 1 are locked and MUST NOT be re-litigated.

**Branch:** `feat/adopt-motion-track`

**Supersedes the open questions in:** `docs/EXPLORATION-trigger-drivers.md` section 14. That document remains the architectural rationale. This document is the executable contract.

---

## 0. How to use this plan

This plan is written to be executed by an implementer (human or AI) who has **no authority to change the design**. Read this section before touching code.

### 0.1 Non-negotiables

1. **Do not re-open section 1.** Every open question from the exploration doc has been answered by the maintainer. If you believe an answer is wrong, stop and raise it. Do not implement an alternative.
2. **Do not widen a slice.** Each slice below has an explicit "in scope" and "forbidden" list. Work outside the in-scope list is drift, even if it is an obvious improvement.
3. **Do not add `if (trigger.type === ...)` branches inside `Motion`.** `Motion` stays ignorant of trigger kinds. This is the whole point of the refactor. Capability flags, not type branching.
4. **Do not import GSAP, `window`, `document`, or any DOM type into `packages/core`.** `npm run test:boundaries` enforces this and will fail the build.
5. **Do not add a second clock subscription.** The project owns exactly one `Clock.subscribe`, in `GraphRuntime`. Test 8 in section 9 exists to catch violations.
6. **Do not silently fall back.** A declared trigger type either selects a real driver or fails loudly. No `catch` that degrades to manual.
7. **Every slice must leave `npm run check` green** (`format:check` + `typecheck` + `test`). No slice may be landed with a skipped or `.todo` test.
8. **Diagnostic rule IDs in this plan are the contract.** Use the exact strings. They are asserted in tests and consumed by editors.

### 0.2 Required reading before you start

Read these files in full. They are the ones you will change or must not break:

- `packages/core/src/engine.ts` (`buildMotion`, `onClockTick`, `disposeComposition`)
- `packages/core/src/domain/motion.ts` (`signal`, `#onTick`, `#attachTrigger`, `#scheduleProgress`, `pause`)
- `packages/core/src/ports/trigger.ts`
- `packages/core/src/ports/clock.ts`
- `packages/core/src/adapters/scroll-trigger.ts`
- `packages/core/src/runtime/project-runtime.ts` (`#replaceWithObservation`, `#replaceTrack`, `addMotion`)
- `packages/core/src/runtime/graph-runtime.ts` (`#onTick`, `replaceGraph`)
- `packages/core/src/graph/ir.ts` (`edgeKey`, `collectTrack`, `qualifySource`)
- `packages/core/src/graph/binding.ts` (`validateGraphResult`, `#applyDelta`)
- `packages/core/src/contract/v5.ts` and `packages/core/src/contract/validate-v5.ts`
- `packages/core/test/support/` — reuse the existing fake clock/scheduler helpers. Do not write new ones.

Test runner is **vitest**. Test style convention: see `packages/core/test/unit/runtime/clock-tick-identity.test.ts`. Follow it, including the habit of commenting _why_ an assertion exists.

### 0.3 Execution order

`T0` → `T1` → `T2` → `T3` → `T4` → `T5`.

`T0` is independent of the trigger work and ships first because it is a live correctness bug. Do not bundle `T0` into a trigger commit.

---

## 1. Locked decisions

These replace section 14 of the exploration doc.

| #   | Question                                                                    | **Decision**                                                                                                                                                                                         | Enforcement                         |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | Does a time Motion stop at `1`, loop, or ping-pong?                         | **Stop at `1`** in the first slice. The driver latches at `1`, emits `1` exactly once, then goes idle.                                                                                               | T2, test 2.3                        |
| 2   | Should `autoplay` default to `true`?                                        | **`true` for `time`.** `false` is only legal once explicit paused-behavior exists, which is not in this plan. Until then, `autoplay: false` is **rejected at validation**, not accepted-and-ignored. | `trigger-time-autoplay-unsupported` |
| 3   | What does a scroll source key resolve against?                              | **An injected, application-owned registry.** Never a DOM selector, element, or GSAP field inside core. Core receives a normalized progress source and nothing else.                                  | T3 + `npm run test:boundaries`      |
| 4   | Do explicit `signal()` calls override a configured driver?                  | **Hard reject.** Not a documented override. Implemented via an `acceptsExternalSignal` capability flag on the Motion, **not** by branching on `trigger.type`.                                        | T2, test 2.6                        |
| 5   | Should a missing scroll driver reject `load()` or leave the Motion dormant? | **Reject.** A dormant Motion is too easy to mistake for a working one.                                                                                                                               | `trigger-driver-unavailable`        |
| 6   | Are `repeat`/`yoyo` needed before the first time-driver release?            | **No, deferred.** And because deferred fields must not look supported: the presence of `repeat` or `yoyo` on a time trigger is **rejected at validation**.                                           | `trigger-time-repeat-unsupported`   |

### 1.1 Consequences you must honor

Decision 2 and 6 both resolve to the same principle already stated in the exploration doc: _never accept a field you do not honor_. The exploration doc's example shape included `repeat: 0` and `autoplay: true`. In this plan:

- `autoplay` may be **absent** or **`true`**. `false` is an error.
- `repeat` and `yoyo` may **only be absent**. Any value, including `0`, is an error.

This is deliberately stricter than the exploration sketch. It buys us the freedom to define loop semantics later without a migration, and it means no author can write a config that silently does nothing.

Decision 4 is the subtle one. The naive implementation is `if (this.#definition.trigger.type !== "manual") throw`. **That is forbidden.** It puts trigger-kind knowledge back inside `Motion`, which is exactly the coupling this whole effort removes. Instead the factory declares the capability and `Motion` only knows about the boolean. See section 6.4.

---

## 2. Verified current state

Every claim below was read out of the branch, not assumed.

1. **`trigger.type` is validated but ignored.** `validate-v5.ts` checks only that `trigger` is an object whose `type` is in `SUPPORTED_TRIGGER_TYPES` (rule `trigger-shape`). `Engine.load()`'s `buildMotion` calls `createManualTriggerPort()` unconditionally for every Motion.
2. **`Motion.signal()` ignores `signal.type`.** It acts on `signal.progress` alone, clamped to `[0, 1]`, rejecting non-finite and out-of-range values.
3. **There is exactly one clock subscription per project**, taken in the `GraphRuntime` constructor. `Engine` passes `listenToClock: false` to every `Motion` and instead fans out from `ProjectRuntime`'s `onClockTick` hook.
4. **But that fanout already advances every Motion.** `Engine.load()` sets `onClockTick: (event) => { for (const motion of motions.values()) motion.onTick(event); }`, and `Motion.#onTick` advances `#position` by `delta / totalDuration`. **Every Motion in the project, including `manual` ones, is already clock-driven playback today.** This is the single highest-risk fact in this plan. See section 6.3.
5. **`TriggerPort` is `{ subscribe(onProgress): () => void }`.** The manual port adds `emit(progress)` and `dispose()`. The scroll adapter (`createScrollTriggerPort(source)`) already wraps a push `ScrollSource`, clamps to `[0, 1]`, and disposes its source subscription. No GSAP import.
6. **`Motion.pause()` detaches the trigger subscription and calls `lifecycle.detach()`.** `play()` re-mounts. So "pause" is a lifecycle transition, not a soft flag. Relevant to decision 1: a completed time Motion must **not** call `pause()`.
7. **`edgeKey()` exists in `graph/ir.ts` and is already the canonical edge identity** for `ObservationState.hasEdge/addEdge/removeEdge`, for duplicate detection in `buildGraphIR`, and for the delta computation in `GraphBinding.#applyDelta`.
8. **`ProjectRuntime.#replaceWithObservation` does not use it.** It uses `JSON.stringify`. This is bug B1.

---

## 3. Bug B1: observation identity uses `JSON.stringify` instead of `edgeKey()`

**Severity:** high. Silent data-model corruption reachable from normal editor use.

**Status:** reproduced and root-caused. Confirmed present on `feat/adopt-motion-track`.

### 3.1 The defect

`packages/core/src/runtime/project-runtime.ts`:

```ts
#replaceWithObservation(id, token, observation, add) {
  const entry = this.#tracks.get(id);
  if (!entry || entry.token !== token) return;
  const observations = [...(entry.track.observes ?? [])];
  const key = JSON.stringify(observation);
  const index = observations.findIndex((candidate) => JSON.stringify(candidate) === key);
  if (add && index < 0) observations.push(observation);
  if (!add && index >= 0) observations.splice(index, 1);
  this.#replaceTrack(id, token, { ...entry.track, observes: observations });
}
```

This is the shared implementation behind **both** `TrackHandle.addObserve` and `TrackHandle.removeObserve`.

`JSON.stringify` serializes own enumerable properties in insertion order. It is therefore an **identity function over object construction order**, not over meaning.

### 3.2 Confirmed failure modes

All four are the same root cause. Only the first was originally reported; the other three fall out of the code and must be covered by the same fix.

**B1-a — property order.** The reported case.

```ts
handle.addObserve({ source: "hero/arm", role: "input" }); // '{"source":"hero/arm","role":"input"}'
handle.removeObserve({ role: "input", source: "hero/arm" }); // '{"role":"input","source":"hero/arm"}'
// no match -> nothing removed, no error
```

**B1-b — defaulted `role`.** `collectTrack` defaults a missing `role` to `"output"`. So `{ source: "a" }` and `{ source: "a", role: "output" }` are **the same graph edge** but different JSON strings. Add via one panel, remove via the other, silent failure.

**B1-c — equivalent source spellings.** `qualifySource` in `ir.ts` resolves a bare source against the owning motion. For a track in motion `hero`, `{ source: "arm" }` and `{ source: "hero/arm" }` resolve to the identical `sourceId` `"hero/arm"`, i.e. the same edge, with different JSON strings. This is _more_ likely across panels than B1-a, because a tree panel naturally emits fully-qualified ids while an inline property panel naturally emits bare ones.

**B1-d — `projection.map` key order.** `{ map: { a: "x", b: "y" } }` and `{ map: { b: "y", a: "x" } }` are the same projection.

### 3.3 The asymmetric symptoms (both are bad, in different ways)

**`removeObserve` fails silently.** `index < 0`, no splice, and then `#replaceTrack` is called anyway with a logically identical `observes` array. The user's click does nothing and reports nothing. This is the reported symptom.

**`addObserve` does not fail silently. It throws.** The dedupe miss appends a duplicate observation. The candidate project then goes through `#replaceTrack` → `GraphRuntime.replaceGraph` → `GraphBinding.replace` → `buildGraphIR`, which detects the duplicate by `edgeKey` and pushes an **error**-severity `observation-duplicate` diagnostic. `validateGraphResult` throws a `TypeError`. So the intended-idempotent `addObserve` becomes a hard crash whose message blames a duplicate edge the user never authored twice.

That asymmetry is itself evidence for the fix: the graph layer already agrees with `edgeKey`, and only this one call site disagrees.

### 3.4 Root cause

The codebase has a canonical edge identity, `edgeKey()`, used everywhere edges are actually diffed. `#replaceWithObservation` reimplements identity ad hoc at the authored-definition layer, where the canonical form has not yet been resolved. Two identity notions for one concept.

### 3.5 The fix

One resolver, used by both `collectTrack` and `ProjectRuntime`. Do not fix this by sorting keys before `JSON.stringify` — that only addresses B1-a and B1-d and leaves B1-b and B1-c live.

**Step 1 — make `edgeKey` order-insensitive for projections.** In `graph/ir.ts`:

```ts
export function canonicalizeProjection(projection: InputProjection): string {
  if (projection.pick !== undefined)
    return `pick:${[...projection.pick].sort(compareCodeUnits).join(",")}`;
  const map = projection.map ?? {};
  return `map:${Object.keys(map)
    .sort(compareCodeUnits)
    .map((key) => `${key}=${map[key]}`)
    .join(",")}`;
}

export function edgeKey(edge: GraphEdge): string {
  const proj = edge.projection ? canonicalizeProjection(edge.projection) : "";
  return `${edge.observerId}|${edge.sourceId}|${edge.role}|${edge.target ?? ""}|${proj}`;
}
```

`pick` is a set of keys to select; its order does not affect the composed record, so sorting it for identity is correct. `validateProjection` already rejects duplicate `pick` entries and duplicate `map` targets, so the canonical form is unambiguous.

**Step 2 — extract one observation resolver.** In `graph/ir.ts`, export a single function that turns an authored `ObservationDefinition` into a `GraphEdge`, carrying the exact validation rules `collectTrack` uses today:

```ts
export interface ResolvedObservation {
  readonly edge?: GraphEdge;
  readonly diagnostics: readonly Diagnostic[];
}

export function resolveObservationEdge(
  observation: ObservationDefinition,
  observerNodeId: string,
  ownerId: string,
  path: string,
): ResolvedObservation;
```

It must reproduce, in this order, the behavior currently inline in `collectTrack`:

1. `role = observation.role ?? "output"`; reject anything other than `"input" | "output"` → `observation-role`.
2. `observation.source` must be a non-empty string → `observation-source`.
3. `role === "output"` with a defined `target` → `observation-output-target`.
4. `projection` is validated **only** when `role === "input"`, and is dropped otherwise → `observation-input-projection`.
5. `sourceId = qualifySource(observation.source, ownerId)`, with the thrown `TypeError` converted to an `observation-source` diagnostic carrying `ids: [observation.source]`.
6. Emit a frozen edge, omitting `target` and `projection` when undefined.

**Step 3 — `collectTrack` must call it.** Replace the inline loop body in `collectTrack` with a call to `resolveObservationEdge`, forwarding diagnostics and skipping on failure. There must be exactly one implementation of these rules after this change. If you leave both, you have not fixed the bug, you have added a third identity notion.

**Step 4 — `ProjectRuntime` uses canonical keys.** Replace `#replaceWithObservation` with:

```ts
#observationKey(entry: TrackEntry, nodeId: string, observation: ObservationDefinition): string {
  const resolved = resolveObservationEdge(
    observation,
    nodeId,
    entry.motionId ?? "~",
    `observe(${nodeId})`,
  );
  if (!resolved.edge)
    throw new TypeError(
      resolved.diagnostics
        .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
        .join(" "),
    );
  return edgeKey(resolved.edge);
}

#replaceWithObservation(
  id: string,
  token: number,
  observation: ObservationDefinition,
  add: boolean,
): void {
  const entry = this.#tracks.get(id);
  if (!entry || entry.token !== token) return;
  const observations = [...(entry.track.observes ?? [])];
  const key = this.#observationKey(entry, id, observation);
  const index = observations.findIndex(
    (candidate) => this.#observationKey(entry, id, candidate) === key,
  );
  if (add) {
    if (index >= 0) return; // already live: idempotent no-op, and no track churn
    observations.push(observation);
  } else {
    if (index < 0) return; // not live: no-op, and no track churn
    observations.splice(index, 1);
  }
  this.#replaceTrack(id, token, { ...entry.track, observes: observations });
}
```

The early returns are part of the fix, not a bonus. Today a missed match still calls `#replaceTrack`, which disposes and recompiles the `Track` for a no-op edit. See section 8.1 for why that is worse than wasteful.

**Step 5 — `ownerId` for free tracks is `"~"` and that is load-bearing.** `qualifySource("arm", "~")` throws, because `"~"` is a reserved motion id. So a free track observing a bare source is an error, and `#observationKey` will now surface it as a thrown `TypeError` instead of a silent miss. **This is intended.** Test it (test 0.7). Do not "fix" it by defaulting free tracks to some other owner.

### 3.6 Regression risk you must check before landing T0

Changing `edgeKey`'s output string changes two observable things:

1. The `observation-duplicate` diagnostic message embeds the key: `` `Duplicate observation edge "${key}".` ``. Grep the test suite for `Duplicate observation edge` and for `observation-duplicate` and update expectations.
2. Any test asserting on a raw key string. Grep for `"|"`-joined literals in `test/unit/graph` and `test/integration`.

Also confirm the duplicate-edge behavior under **both** graph builders: `Engine` injects `IncrementalGraphBuilder`, while `GraphBinding`'s default is `defaultGraphBuilder`. Add coverage through `Engine` (incremental path), not only through a bare `ProjectRuntime`.

---

## 4. Slice T0 — canonical observation identity (bug B1)

**Ships first. Independent of trigger work. Separate commit.**

### In scope

- `packages/core/src/graph/ir.ts`: add `canonicalizeProjection`, rewrite `edgeKey`, add and export `resolveObservationEdge`, refactor `collectTrack` to use it, export `qualifySource`.
- `packages/core/src/runtime/project-runtime.ts`: `#observationKey` + rewritten `#replaceWithObservation`.
- Tests below.

### Forbidden

- Touching `Motion`, `Engine`, any trigger file, or `validate-v5.ts`.
- Changing the `|` separator scheme in `edgeKey` (see 8.2).
- Changing `#replaceTrack` (see 8.1).

### Tests — `packages/core/test/unit/runtime/observation-identity.test.ts`

Each test drives the **public** `TrackHandle` API and asserts on `runtime.graph.state.snapshot().edges`, so it proves user-visible behavior rather than the helper's return value.

- **0.1** add `{ source, role }`, remove `{ role, source }` → edge count returns to its pre-add value. _(B1-a, the reported bug. This test must fail before the fix.)_
- **0.2** add `{ source: "hero/arm" }`, remove `{ source: "hero/arm", role: "output" }` → removed. _(B1-b)_
- **0.3** for a track in motion `hero`: add `{ source: "arm", role: "input", target: "x" }`, remove `{ source: "hero/arm", role: "input", target: "x" }` → removed. _(B1-c)_
- **0.4** add `{ source, role: "input", projection: { map: { a: "x", b: "y" } } }`, remove with `{ map: { b: "y", a: "x" } }` → removed. _(B1-d)_
- **0.5** `addObserve` twice with swapped property order → **does not throw**, and edge count increases by exactly `1`. _(This is the crash from 3.3; it must become an idempotent no-op.)_
- **0.6** `removeObserve` for an observation that was never added → no throw, and `runtime.graph.sequence` is unchanged, proving no graph replacement happened. _(no-op must not churn)_
- **0.7** a **free** track calling `addObserve({ source: "arm" })` (bare source, no owning motion) throws a `TypeError` mentioning `observation-source`. _(intended, per 3.5)_
- **0.8** `addObserve` with `role: "output"` and a `target` throws mentioning `observation-output-target`, and the live edge set is unchanged.

### Tests — `packages/core/test/unit/graph/edge-key-canonical.test.ts`

- **0.9** `edgeKey` is equal for `{ map: { a: "x", b: "y" } }` and `{ map: { b: "y", a: "x" } }`.
- **0.10** `edgeKey` is equal for `pick: ["a", "b"]` and `pick: ["b", "a"]`.
- **0.11** `edgeKey` still differs for genuinely different projections (`pick: ["a"]` vs `pick: ["a", "b"]`, and `map: { a: "x" }` vs `map: { a: "y" }`).
- **0.12** `resolveObservationEdge` and `collectTrack` produce byte-identical `edgeKey`s for the same authored observation. _(Guards against the two-implementations regression from step 3.)_

### Acceptance gate

`npm run check` green. Tests 0.1 through 0.5 must be demonstrated red on the pre-fix tree and green after. Record that in the PR description.

---

## 5. Slice T1 — trigger contract and ports

No behavior change. Seams only.

### 5.1 Schema types — `packages/core/src/contract/v5.ts`

Keep `MotionDefinition.trigger` structurally open (it currently allows extension keys), but add the narrow per-type shapes for validation and driver code to consume:

```ts
export interface ManualTriggerDefinition {
  readonly type: "manual";
}
export interface TimeTriggerDefinition {
  readonly type: "time";
  readonly duration: number;
  readonly autoplay?: true;
}
export interface ScrollTriggerDefinition {
  readonly type: "scroll";
  readonly source?: string;
}
export type TriggerDefinition =
  | ManualTriggerDefinition
  | ScrollTriggerDefinition
  | TimeTriggerDefinition;
```

`autoplay?: true` is not a typo. Per decision 2, `false` is not representable.

### 5.2 Validation — `packages/core/src/contract/validate-v5.ts`

Extend the existing `trigger-shape` block with per-type rules. Exact rule IDs:

| Rule ID                             | Condition                                                                        | Path                                  |
| ----------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------- |
| `trigger-shape`                     | not an object, or `type` not in `SUPPORTED_TRIGGER_TYPES` _(existing)_           | `motions[i].trigger`                  |
| `trigger-time-duration`             | `type === "time"` and `duration` is not a finite number `> 0` (including absent) | `motions[i].trigger.duration`         |
| `trigger-time-autoplay-unsupported` | `type === "time"` and `autoplay` is present and not `true`                       | `motions[i].trigger.autoplay`         |
| `trigger-time-repeat-unsupported`   | `type === "time"` and `repeat` or `yoyo` is present at all                       | `motions[i].trigger.repeat` / `.yoyo` |
| `trigger-scroll-source`             | `type === "scroll"` and `source` is present but not a non-empty string           | `motions[i].trigger.source`           |

All severity `error`. A missing `scroll.source` is **not** a validation error: whether a key is required is the injected factory's business, and that failure is `trigger-driver-unavailable` at load time (decision 5).

Extract this as `export function validateMotionTrigger(trigger: unknown, path: string): Diagnostic[]` so `ProjectRuntime.addMotion` can reuse it verbatim in T4. Do not copy-paste it.

### 5.3 Ports — new file `packages/core/src/ports/trigger-factory.ts`

```ts
import type { MotionDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "./clock";
import type { Scheduler } from "./scheduler";
import type { TriggerPort } from "./trigger";

export interface ClockConsumer {
  onTick(event: ClockTick): void;
  dispose(): void;
}

export interface TriggerFactoryContext {
  readonly motionId: string;
  readonly definition: MotionDefinition;
  readonly clock: Clock;
  readonly scheduler: Scheduler;
}

export interface CreatedTrigger {
  readonly port: TriggerPort;
  /** False for driver-backed Motions. Enforces locked decision 4 without type branching. */
  readonly acceptsExternalSignal: boolean;
  /** Present only when this driver needs project clock ticks. */
  readonly onTick?: (event: ClockTick) => void;
  /** Must be idempotent. */
  dispose(): void;
}

export interface TriggerFactory {
  create(context: TriggerFactoryContext): CreatedTrigger;
}

export function assertTriggerFactory(
  factory: unknown,
  context = "TriggerFactory",
): asserts factory is TriggerFactory;
```

`EngineOptions` gains `readonly triggerFactory?: TriggerFactory;`.

`TriggerPort` itself is **unchanged**. Do not add `dispose` to it.

### 5.4 Default factory

`packages/core/src/adapters/trigger-factory/default.ts` exports `createDefaultTriggerFactory()`, which in T1 returns a manual port with `acceptsExternalSignal: true` and no `onTick`, for **all three** types. T1 therefore preserves today's behavior exactly, including the inert `scroll`/`time` handling. T1 is a pure seam.

### Tests — `packages/core/test/contract/trigger-factory.test.ts`

- **1.1** `Engine` with no `triggerFactory` behaves identically to before: existing suite green, unchanged.
- **1.2** `assertTriggerFactory` rejects `null`, `{}`, and `{ create: 1 }`.
- **1.3** `validateMotionTrigger` produces exactly the expected rule ID for each row of the 5.2 table, and an empty array for `{ type: "time", duration: 1000 }`, `{ type: "time", duration: 1000, autoplay: true }`, `{ type: "manual" }`, `{ type: "scroll" }`, `{ type: "scroll", source: "hero" }`.
- **1.4** `{ type: "time", duration: 1000, repeat: 0 }` is rejected. _(Explicitly: `0` is not a free pass.)_

### Forbidden in T1

Wiring any real driver. Changing `Engine.onClockTick`. Changing `Motion`.

---

## 6. Slice T2 — manual and time drivers, and the clock-consumer refactor

This is the highest-risk slice. Read section 2 fact 4 again before starting.

### 6.1 The time driver

`packages/core/src/adapters/trigger-factory/time-driver.ts`:

```ts
export function createTimeDriver(duration: number): CreatedTrigger;
```

Required semantics, exactly:

1. Throws `TypeError` if `duration` is not finite or not `> 0`. (Validation should have caught it; this is the boundary assertion.)
2. Holds `elapsed = 0`. On each `onTick(event)`, `elapsed += event.delta`.
3. Emits `Math.min(1, elapsed / duration)` through its own manual-style port.
4. **Latches at `1`.** Once `1` has been emitted, all subsequent `onTick` calls are ignored and nothing is emitted again. Per decision 1. The latch is what makes "stop at 1" observable rather than "emit 1 forever".
5. Emits nothing before the first tick. No emission at construction.
6. `acceptsExternalSignal: false`. Per decision 4.
7. `dispose()` is idempotent; after dispose, `onTick` is inert and emits nothing.
8. **No `setInterval`, no `requestAnimationFrame`, no `Clock.subscribe`.** The driver is fed; it does not subscribe.
9. Does **not** call `motion.pause()` on completion. `pause()` detaches the lifecycle (fact 6) and would break reactivation. The Motion stays mounted at progress `1`.

No internal queue. `Motion.#scheduleProgress` already coalesces to the latest pending value; a second queue here would be a second backpressure policy. Forbidden.

### 6.2 Factory wiring

`createDefaultTriggerFactory()` becomes:

- `manual` → manual port, `acceptsExternalSignal: true`, no `onTick`, and the Motion is registered as a clock consumer that forwards to `motion.onTick` (see 6.3).
- `time` → `createTimeDriver(definition.trigger.duration)`, `acceptsExternalSignal: false`, `onTick` present.
- `scroll` → still inert manual in T2. T3 changes this. Do not reject scroll yet; that would break the demos mid-stack.

`autoplay` is `true` by default and only `true` is representable, so T2 always calls `motion.play()`. Do not write an `if (autoplay)` branch for a value that cannot be `false`; write the assertion instead.

### 6.3 Clock ownership — Option B, mandatory

Adopt the exploration doc's Option B: **one project-owned `ClockConsumer` collection**.

Today, `Engine.load()` does:

```ts
onClockTick: (event) => {
  for (const motion of motions.values()) motion.onTick(event);
};
```

Because `Motion.#onTick` advances progress by `delta / totalDuration`, **leaving this line in place while adding a time driver double-advances every time Motion.** Replace it with a single consumer fanout:

```ts
const consumers = new Map<string, ClockConsumer>();

onClockTick: (event) => {
  for (const consumer of consumers.values()) consumer.onTick(event);
},
```

Registration rules, per Motion, at `buildMotion` time:

| Trigger type  | Clock consumer registered                  | Rationale                                                                                                 |
| ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `manual`      | forwards to `motion.onTick(event)`         | **Preserves today's behavior byte for byte.** Manual Motions are clock-advanced today and must remain so. |
| `time`        | forwards to `createdTrigger.onTick(event)` | The driver owns time semantics.                                                                           |
| `scroll` (T3) | none                                       | Push-driven. A scroll Motion must not advance on the clock.                                               |

Exactly one consumer per Motion. Never both `motion.onTick` and a driver `onTick`. Assert this in code, not just in tests: the registration site should be a single `switch`-free expression derived from `createdTrigger.onTick === undefined`.

Deregistration: `destroyMotion` and `disposeComposition` must remove the consumer and call `createdTrigger.dispose()` exactly once, before/alongside `motion.dispose()`.

> **Known debt, do not fix here:** `manual` today _is_ an implicit time trigger with `duration = totalDuration`. Unifying manual onto the time driver is a follow-up, tracked separately. Attempting it in T2 will break a large number of existing tests and is out of scope.

### 6.4 `Motion` changes — the only ones permitted

Add one option and one guard. Nothing else.

```ts
export interface MotionOptions {
  // ...existing
  /** Defaults to true. When false, signal() is rejected. */
  readonly acceptsExternalSignal?: boolean;
}

signal(signal: TriggerSignal): void {
  this.assertActive();
  if (!this.#acceptsExternalSignal)
    throw new TypeError(
      "Motion has a configured trigger driver and does not accept external signals.",
    );
  // ...existing body unchanged
}
```

The message string is part of the contract; assert it in tests. `Engine` passes `acceptsExternalSignal: createdTrigger.acceptsExternalSignal`.

**Forbidden:** reading `trigger.type`, `definition`, or anything trigger-kind-shaped inside `Motion`. If `Motion` needs to know the kind, the design is wrong.

### Tests — `packages/core/test/unit/domain/time-driver.test.ts` and `.../integration/trigger-time.test.ts`

Use the existing fake clock and scheduler from `test/support`. Flush the scheduler between ticks so coalescing does not hide intermediate values.

- **2.1 factory selection** — `manual`, `time`, `scroll` definitions each select the intended driver; assert on `acceptsExternalSignal` and on `onTick === undefined`.
- **2.2 time math** — `duration = 1000`, deltas `250`, `250`, `500` produce progress exactly `0.25`, `0.5`, `1`. Exact equality, not `toBeCloseTo`.
- **2.3 stop at `1`** — after reaching `1`, three further ticks of `250` emit **nothing**. Assert emission count, not just final progress. _(Decision 1.)_
- **2.4 no emission before first tick** — progress is `0` and the port has emitted `0` times immediately after `load()`.
- **2.5 one clock subscription** — a project with 5 time Motions and 5 manual Motions produces `Clock.subscribe` call count `1`. _(Non-negotiable 5.)_
- **2.6 hard reject** — `handle.signal("timeMotion", { type: "time", progress: 0.5 })` throws `TypeError` with the 6.4 message, and progress is unchanged afterward. Same for a scroll-driven Motion in T3. _(Decision 4.)_
- **2.7 manual still accepts signals** — unchanged behavior, including the existing `RangeError` for `progress` outside `[0, 1]`.
- **2.8 no double advance** — a time Motion with `duration = 1000` and one `1000`ms tick lands at exactly `1`, not clamped-from-`2`. Assert the emitted sequence has length `1`. _(This is the test that catches the fact-4 trap.)_
- **2.9 lifecycle** — `pause()` stops progress; `play()` resumes without duplicate callbacks (assert subscription count `1`); `dispose()` detaches and a post-dispose `onTick` emits nothing.
- **2.10 validation** — `{ type: "time" }` with no duration fails `Engine.load()` with `trigger-time-duration` in the thrown message.
- **2.11 backpressure** — 100 rapid driver emissions before a scheduler flush result in exactly one `setProgress` call, with the latest value.
- **2.12 isolated listener failure** — a throwing subscriber on one driver does not stop another driver's emissions, and disposal still works.

---

## 7. Slices T3 to T5

### T3 — scroll driver injection

**In scope**

- `createTriggerFactory({ scroll })` accepting an application-owned resolver: `(context: TriggerFactoryContext) => ScrollSource | undefined`.
- The resolver is keyed by `definition.trigger.source` (a **serializable string key**) or by `motionId`. Per decision 3, core never sees a selector, element, or GSAP object.
- When the resolver returns `undefined`, `Engine.load()` **throws** with `trigger-driver-unavailable` naming the motion id and the source key. Per decision 5. No dormant Motion, no warning-and-continue.
- Reuse `createScrollTriggerPort` / `ScrollSource` as-is. Clamping already lives there; do not duplicate it.
- Scroll Motions register **no** clock consumer, and `acceptsExternalSignal: false`.
- Update the demo app to register a GSAP-backed `ScrollSource` in the registry and **delete its manual `signal()` calls**.

**Tests**

- **3.1** a fake scroll source drives progress end to end; out-of-range emissions clamp to `[0, 1]`.
- **3.2** subscribe count is exactly `1` per Motion; `dispose()` unsubscribes exactly once.
- **3.3** missing source → `load()` throws `trigger-driver-unavailable`; the thrown message names the motion.
- **3.4** a failed `load()` leaves no live `Track`, no live Motion, and no undisposed scroll subscription.
- **3.5** `npm run test:boundaries` green: no GSAP or DOM symbol reachable from `packages/core`.

### T4 — runtime Motion parity

**In scope**

- `ProjectRuntime.addMotion` calls the shared `validateMotionTrigger` from 5.2 **before** touching the graph, and rejects with the same diagnostics as `load()`.
- Runtime-created Motions go through the **same** `buildMotion` closure and the same factory. No second construction path.
- Failure ordering on `createMotion`: dispose the created trigger, do not commit the definition to `#motions`, do not register a clock consumer, leave the candidate graph unchanged.
- `destroyMotion` ordering: validate the candidate graph, remove from `#motions`, dispose Motion and trigger exactly once, remove the clock consumer.

**Tests**

- **4.1** `addMotion({ trigger: { type: "time", duration: 500 } })` animates identically to the same Motion authored at load time. Compare emitted progress sequences for equality.
- **4.2** `addMotion` with `{ type: "time" }` and no duration throws `trigger-time-duration`, and `instanceCount` / graph node count are unchanged.
- **4.3** `addMotion` with `{ type: "scroll" }` and no registered source throws `trigger-driver-unavailable` and leaves nothing behind.
- **4.4** `destroyMotion` disposes the driver exactly once (assert a dispose counter equals `1`), and a subsequent clock tick reaches no disposed driver.
- **4.5** project `dispose()` leaves zero live driver subscriptions.

### T5 — remove inert semantics

- `scroll` and `time` no longer fall back to manual anywhere. Grep for `createManualTriggerPort` and confirm the only remaining call site is the manual branch of the factory.
- Update `docs/PUBLIC-API.md`, `docs/AUTHORED-SCHEMA.md`, `docs/SESSION-STATUS.md`, `docs/DECISIONS.md`.
- Replace tests that assert all three trigger types share the manual signal path.
- Add a migration note: `time` now requires `duration`; `repeat`/`yoyo`/`autoplay: false` are rejected; `signal()` on a driver-backed Motion now throws.
- Only after T5 may loop/`repeat`/`yoyo` semantics be designed. That is a new plan, not an extension of this one.

---

## 8. Adjacent findings — DO NOT FIX IN THIS PLAN

These were found while verifying B1. They are real. They are also out of scope, and fixing them inside these slices will make the diffs unreviewable. Each needs its own issue.

### 8.1 `#replaceTrack` swaps the compiled `Track` out from under `Motion` (high severity)

`ProjectRuntime.#replaceTrack` calls `disposeTrack(id)` then `compileTrack(accepted, id)`. In `Engine`, `disposeTrack` disposes the `Track` and deletes it from the `tracks` map, and `compileTrackDefinition` inserts a **new** `Track` instance. But `#replaceTrack` never calls `removeMotionTrack`/`addMotionTrack`, so the owning `Motion` still holds a `MotionTrackEntry` pointing at the **old, disposed** `Track`. After any `replace()`, `addObserve()`, or `removeObserve()` on a motion-owned track, the Motion drives a disposed Track while the graph composes with a live one.

B1 makes this reachable far more often than it looks, because today every failed dedupe still runs `#replaceTrack`. T0's early returns reduce the blast radius but do not fix the underlying identity swap.

**Action:** file an issue titled "replaceTrack does not re-register the recompiled Track with its Motion". Add a failing regression test in T0 only if you can do so **without** changing `#replaceTrack`; otherwise leave it to the issue.

### 8.2 `edgeKey` uses `|` as a separator, and `|` is a legal id character

`assertAuthoredTrackId` forbids only `/` and empty strings. `target` is an arbitrary string. So `|` can appear in an id or target and collide two distinct edges into one key. A length-prefixed encoding would eliminate the class.

**Action:** separate issue. Tempting to bundle into T0 since T0 already changes key strings, but it broadens the regression surface (see 3.6) and T0 must stay reviewable. Do not bundle without maintainer sign-off.

### 8.3 `ProjectHandle.seek(nodeId, progress)` bypasses the Motion

`seek` writes track progress directly. On a driver-backed Motion the next driver emission overwrites it. This is not the same hole as decision 4 (`signal()` is Motion-level, `seek` is node-level), and it is arguably legitimate for scrubbing. **Action:** document the interaction in T5. Do not gate `seek` behind `acceptsExternalSignal`.

### 8.4 `Motion.signal()` and the manual port disagree on range

`Motion.signal()` throws `RangeError` outside `[0, 1]`; `createManualTriggerPort().emit()` accepts raw values and `Motion.#scheduleProgress` silently clamps. The exploration doc flagged this (section 4.1). **Action:** separate issue. Normalizing it inside T2 would change manual behavior mid-refactor and muddy test 2.7.

---

## 9. Acceptance gates

No slice lands until all of these hold.

1. `npm run check` green.
2. `npm run test:boundaries` green — no DOM or GSAP reachable from `packages/core`.
3. `Clock.subscribe` call count is `1` per loaded project, asserted by test 2.5.
4. Grep proves exactly one implementation of observation-to-edge resolution (`resolveObservationEdge`) and exactly one edge identity function (`edgeKey`). No `JSON.stringify` used as an equality key anywhere in `packages/core/src`.
5. Every rule ID in the 5.2 table has a test asserting it, and each is asserted by exact string.
6. No `.skip`, `.todo`, or commented-out test introduced.
7. Tests 0.1 to 0.5 demonstrated red before T0 and green after, recorded in the PR.
8. No Motion has two clock consumers. Test 2.8 covers the time case; add an invariant assertion at the registration site.

---

## 10. Bottom line

Two independent problems, one shared cause: **duplicated notions of identity and ownership.**

B1 is a second edge-identity function competing with the canonical one. The trigger work is a missing source-selection seam that leaves `trigger.type` decorative. Both fixes are the same move: name the single owner, delete the ad hoc duplicate.

The decisive rules, restated so they cannot drift:

- **One edge identity: `edgeKey()`.** Nothing compares observations any other way.
- **One clock fanout owner, one consumer per Motion.** Never a driver _and_ `motion.onTick`.
- **One Motion input: normalized progress in `[0, 1]`.** `Motion` never learns what a trigger type is.
- **A declared trigger type either selects a real driver or fails loudly.** Never a silent fallback, never an accepted-but-ignored field.
