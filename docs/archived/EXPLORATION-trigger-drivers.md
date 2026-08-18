# Exploration: scroll and time trigger drivers

**Status:** Exploratory proposal, not an implementation commitment.

**Current branch:** `feat/adopt-motion-track`

**Purpose:** decide how schema `trigger.type` should become real behavior without adding a second playback owner, leaking browser/GSAP dependencies into core, or making runtime-created Motions behave differently from authored Motions.

## 1. The short version

The cleanest design is a **TriggerFactory port** owned by `Engine` and consumed by `Motion` construction:

```text
ProjectDefinition.trigger
        |
        v
Engine TriggerFactory
   |          |          |
manual     scroll       time
   |          |          |
TriggerPort TriggerPort TriggerPort
        \      |      /
             Motion
```

`Motion` should continue to know only one thing: a `TriggerPort` emits normalized progress values from `0` to `1`. It should not know whether progress came from a button, scroll position, elapsed time, a browser clock, GSAP, or a test fake.

The factory is the missing seam. Today `Engine.load()` calls `createManualTriggerPort()` for every Motion, regardless of `MotionDefinition.trigger.type`. Add the seam once, then use it for both load-time and runtime-created Motions.

## 2. What the code does today

The current behavior is verified in `packages/core/src/engine.ts`, `packages/core/src/domain/motion.ts`, `packages/core/src/ports/trigger.ts`, `packages/core/src/adapters/browser-clock.ts`, and `packages/core/src/adapters/scroll-trigger.ts`.

### 2.1 `trigger.type` is validated but ignored

The schema accepts `scroll`, `time`, and `manual`. `Engine.load()` nevertheless constructs every Motion with `createManualTriggerPort()`.

`Motion.signal(signal)` also ignores `signal.type`; if `signal.progress` is a finite number, all three types use the same scheduled progress path.

That means the current runtime is honest only if `trigger.type` is treated as metadata and callers manually provide progress signals.

### 2.2 The existing `TriggerPort` is already the right low-level shape

```ts
interface TriggerPort {
  subscribe(onProgress: (progress: number) => void): () => void;
}
```

`Motion` subscribes to it when played, unsubscribes when paused, and routes emitted progress through its scheduler before setting Track progress and invalidating the project.

The manual port already exposes `emit(progress)` and `dispose()` for its owner. The scroll adapter already wraps a push-based `ScrollSource` into a `TriggerPort`, clamps progress to `[0, 1]`, and disposes its source subscription.

### 2.3 The browser clock is project-wide

`GraphRuntime` owns the one project clock subscription and calls `onClockTick` for every Motion. `Engine` currently uses that callback to call `motion.onTick(event)` for all Motions.

A Motion also has an optional direct clock subscription, but `Engine` deliberately sets `listenToClock: false`; this prevents one clock subscription per Motion.

This existing fanout is important. Time drivers must not add their own independent animation loop.

## 3. Recommended architecture

### 3.1 Add a TriggerFactory port

Introduce a renderer-neutral factory at the Engine boundary:

```ts
export interface TriggerFactoryContext {
  readonly motionId: string;
  readonly definition: MotionDefinition;
  readonly clock: Clock;
  readonly scheduler: Scheduler;
}

export interface TriggerFactory {
  create(context: TriggerFactoryContext): {
    readonly port: TriggerPort;
    readonly dispose?: () => void;
  };
}
```

Recommended `EngineOptions` shape:

```ts
interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry;
  readonly triggerFactory?: TriggerFactory;
}
```

The factory is optional for compatibility. If omitted, use a strict default that preserves today’s behavior: manual trigger ports only, with an explicit diagnostic or error policy for authored `scroll` and `time` definitions. Recommendation: **do not silently pretend those types are active**.

A better default for the next major contract is a built-in factory for `manual` and `time`, with `scroll` requiring an injected adapter. That decision should be made before changing the schema contract.

### 3.2 Keep `Motion` ignorant of trigger kinds

Do not add `scroll` or `time` branches to `Motion.signal()` or `Motion.#onTick()`.

`Motion` should remain responsible for:

- subscribing to a supplied `TriggerPort`;
- scheduling incoming normalized progress;
- applying staggered progress to Tracks;
- invalidating the owning runtime;
- pausing and disposing its trigger subscription.

The factory or driver owns source semantics. This prevents a second clock owner from appearing inside Motion.

### 3.3 Model driver lifetime explicitly

A `TriggerPort` currently has only `subscribe()`. The factory also needs a lifecycle owner for source resources.

Use a disposable result from the factory rather than making every `TriggerPort` know how to dispose itself:

```ts
interface CreatedTrigger {
  readonly port: TriggerPort;
  dispose(): void;
}
```

`Motion.dispose()` will stop its subscription. `Engine` or `ProjectRuntime` must also dispose the created driver resource, especially for scroll listeners, timers, observers, and third-party adapter subscriptions.

The ownership rule should be:

- `Engine` creates the driver;
- the Motion owns the subscription between the driver and Motion;
- the Engine/ProjectRuntime owns driver disposal;
- `dispose()` is idempotent;
- no driver survives project disposal.

For runtime-created Motions, the same factory path must run through the existing `createMotion` hook. Never duplicate trigger construction in `Engine.load()` versus `addMotion()`.

## 4. Semantics by trigger type

### 4.1 Manual

Manual is already implemented.

- Source: caller emits progress through a manual port or calls `Motion.signal()`.
- Input: finite progress in `[0, 1]`.
- Behavior: clamp or reject consistently. Current `Motion.signal()` rejects out-of-range values and the manual port itself accepts raw values, so normalize this inconsistency.
- Recommended rule: all public trigger sources normalize to `[0, 1]`; invalid non-finite values throw at the source boundary.
- Lifecycle: no external resource beyond the port.

### 4.2 Scroll

Scroll should be a push driver, not a clock loop.

Recommended adapter contract:

```ts
export interface ScrollProgressSource {
  subscribe(listener: (progress: number) => void): () => void;
}

export interface ScrollTriggerOptions {
  readonly source: ScrollProgressSource;
  readonly clamp?: boolean;
}
```

The existing `ScrollSource` and `createScrollTriggerPort()` are already close to this. The missing work is connecting a source to the Motion selected by `trigger.type: "scroll"` through the factory.

Recommended configuration approach:

```ts
const engine = new Engine({
  clock,
  scheduler,
  interpolator,
  triggerFactory: createTriggerFactory({
    scroll: ({ definition }) => scrollSources.get(definition.id),
  }),
});
```

Do not put a GSAP instance or DOM selector in `MotionDefinition` unless the authored schema explicitly decides to become browser-aware. Prefer an application-supplied source registry keyed by Motion id or a serializable source key.

A browser adapter may interpret fields such as `trigger.source`, `start`, `end`, and `scrub`, but core should receive only a normalized progress source.

### 4.3 Time

Time should be driven by the existing project clock, not `setInterval`, `requestAnimationFrame`, or a second timer.

There are two plausible meanings:

1. **Duration playback:** time advances progress from `0` to `1` over a configured duration.
2. **Looped timeline:** time wraps progress back to `0` after the duration.

Recommendation for v1: implement **finite duration playback**, with explicit loop policy deferred. A time trigger definition could be:

```ts
{
  type: "time",
  duration: 2500,
  autoplay: true,
  repeat: 0
}
```

The time driver receives `ClockTick.delta`, accumulates elapsed milliseconds, computes `elapsed / duration`, clamps to `1`, and emits progress through the same `TriggerPort` path.

Do not call `Motion.onTick()` for time Motions and also emit time progress from a driver. Choose one path. The safer design is:

```text
GraphRuntime clock fanout
        |
        v
TriggerDriver.onTick(delta)
        |
        v
TriggerPort.emit(progress)
        |
        v
Motion scheduler -> Tracks -> invalidate
```

That makes all trigger kinds use the same Motion input path and keeps time semantics outside Motion.

A practical alternative is a dedicated `onClockTick` callback on the created driver, but it must be one callback from the existing GraphRuntime fanout, not a new clock subscription.

## 5. The key design issue: who owns clock fanout?

Current ownership is almost right but needs one refinement.

Today `GraphRuntime.onClockTick` calls `motion.onTick(event)` for every Motion. If time drivers become real, this callback should instead fan out to **Motion-owned clock behavior and trigger-driver clock behavior exactly once**.

Recommended options, in order:

### Option A: Driver receives clock ticks, Motion remains trigger-only

```ts
onClockTick(event) {
  for (const driver of drivers.values()) driver.onTick(event);
  for (const motion of motions.values()) motion.onTick(event); // only if direct clock playback remains enabled
}
```

For trigger-driven Motions, set `listenToClock: false` and let the driver emit progress. This is the cleanest long-term model.

### Option B: Generalize the existing callback

Create a single project-owned `ClockConsumer` collection. Both Motion direct playback and trigger drivers implement `onTick(event)` and `dispose()`.

```ts
interface ClockConsumer {
  onTick(event: ClockTick): void;
  dispose(): void;
}
```

This makes one clock fanout owner explicit and avoids special-case loops in `Engine`.

Recommendation: **Option B** if time, scroll momentum, and future trigger types are expected. It names the ownership boundary and keeps GraphRuntime from knowing about Motion-specific behavior.

## 6. Runtime-created Motions

W4 already creates empty Motions at runtime through `ProjectRuntime.addMotion()` and Engine's shared `buildMotion()` closure.

The trigger factory must be part of that closure:

```ts
const buildMotion = (definition, entries) => {
  const createdTrigger = triggerFactory.create({
    motionId: definition.id,
    definition,
    clock: options.clock,
    scheduler: options.scheduler,
  });
  const motion = new Motion({
    ...,
    trigger: createdTrigger.port,
    listenToClock: false,
  });
  registerClockConsumer(createdTrigger);
  motion.play();
  return { motion, trigger: createdTrigger };
};
```

On runtime Motion creation failure:

1. dispose the created trigger resource;
2. do not commit the Motion definition into the runtime map;
3. do not expose the Motion through `signal()`;
4. leave the candidate graph unchanged.

On Motion destruction:

1. validate the candidate graph first;
2. remove the Motion definition from the runtime map;
3. dispose the Motion and its trigger driver exactly once;
4. remove it from the clock-consumer collection.

This is the same validate-then-commit discipline already installed for W2 and W5 Track mutation.

## 7. Do not overload `TriggerSignal`

The current `TriggerSignal` includes `type` and optional `progress`. It is useful for manual external control, but it should not become a configuration object for drivers.

Keep these concepts separate:

```ts
MotionDefinition.trigger; // declarative source configuration
TriggerSignal; // imperative event sent to a Motion
TriggerPort; // normalized progress stream from a source
```

For a scroll Motion, `signal({ type: "scroll", progress })` could remain a manual override, but it should not be required when the configured scroll driver is active. Decide whether manual signals override, merge with, or are rejected for non-manual Motions. Recommendation: allow explicit signals as a test/debug override, but document precedence.

## 8. Configuration and schema recommendation

Do not add browser-specific fields to the core schema in the first driver slice.

Use a serializable trigger definition with a small core-owned common shape:

```ts
interface ManualTriggerDefinition {
  readonly type: "manual";
}
interface TimeTriggerDefinition {
  readonly type: "time";
  readonly duration: number;
  readonly autoplay?: boolean;
  readonly repeat?: number;
}
interface ScrollTriggerDefinition {
  readonly type: "scroll";
  readonly source?: string;
}
```

Then keep environment-specific settings in the injected adapter registry:

```ts
interface TriggerDriverRegistry {
  createScroll(sourceKey: string | undefined, context: TriggerContext): CreatedTrigger;
}
```

Validate common fields in `validate-v5.ts`:

- time duration must be finite and positive;
- repeat must be an integer `>= 0` or a separately specified infinite value;
- scroll source key must be non-empty if required by the configured factory;
- unknown trigger fields remain allowed only if the schema intentionally permits extension fields.

Avoid silently accepting `scroll` or `time` and then falling back to manual. That was the current bug in the first place.

## 9. Error and fallback policy

Recommended behavior:

- `manual` without a factory: works with the manual port.
- `time` without a factory: works with the core clock-driven time driver once implemented.
- `scroll` without a configured source/factory: `Engine.load()` throws a diagnostic such as `trigger-driver-unavailable`.
- invalid time duration: load/mutation rejects with `trigger-time-duration`.
- driver creation failure: load/mutation rejects atomically and disposes the partially created driver.
- driver callback failure: isolate the failing listener, keep disposal possible, and surface a bounded runtime diagnostic. Follow the existing browser-clock and patch-registry first-error-after-settlement pattern.

A strict failure is better than silently running the wrong animation source.

## 10. Lifecycle and backpressure

Trigger sources can emit faster than the scheduler can apply progress. The current Motion scheduler already coalesces queued progress: it keeps the latest pending value and schedules one job.

Keep that behavior as the backpressure mechanism. Do not add a second queue in each driver.

Lifecycle tests must prove:

- driver subscribes exactly once when the Motion becomes active;
- pause/unmount removes the Motion subscription;
- dispose removes source subscriptions, timers, and clock consumers;
- reactivation does not duplicate callbacks;
- a driver cannot emit after disposal;
- a failing source listener does not permanently stop unrelated drivers.

## 11. Recommended implementation sequence

### Slice T1: contract and driver ports

- Define discriminated trigger definitions or validate the current extensible object shape.
- Add `TriggerFactory`, `CreatedTrigger`, and optionally `ClockConsumer` ports.
- Keep `TriggerPort` unchanged.
- Add unit contract tests for normalization, clamping, disposal, and unavailable drivers.

### Slice T2: manual and time drivers

- Extract current manual construction behind the factory.
- Add a core time driver driven by injected `ClockTick.delta`.
- Decide finite completion behavior and whether a completed Motion pauses or stays at `1`.
- Add deterministic fake-clock tests for duration, pause, resume, disposal, and repeat policy.

### Slice T3: scroll driver injection

- Reuse `ScrollSource` / `createScrollTriggerPort()` or rename them to a generic progress-source adapter.
- Add an application-owned registry from schema source key to `ScrollSource`.
- Wire the factory without importing GSAP into core.
- Add adapter tests using a fake scroll source and demo integration using GSAP.

### Slice T4: runtime Motion parity

- Route W4 `addMotion()` through the same factory closure.
- Verify driver resources are disposed when a runtime Motion is destroyed or the project is disposed.
- Test failed driver creation leaves no Motion in the runtime map.

### Slice T5: remove inert semantics

- Update `PUBLIC-API.md`, `AUTHORED-SCHEMA.md`, and `SESSION-STATUS.md`.
- Replace tests that currently assert all trigger types use the same manual signal path.
- Add a migration note if trigger definitions become stricter.
- Only then consider changing the default policy for missing scroll drivers.

## 12. Evidence plan

Required tests:

1. **Factory selection:** manual, time, and scroll definitions select the intended driver.
2. **Time math:** `duration=1000`, clock deltas `250 + 250 + 500` produces `0.25`, `0.5`, `1` exactly.
3. **Time lifecycle:** pause stops progress, resume continues without duplicate callbacks, dispose detaches.
4. **Scroll lifecycle:** source progress clamps, subscription/disposal counts are exact.
5. **Missing driver:** scroll without a configured source rejects with a stable diagnostic.
6. **Runtime Motion parity:** `addMotion()` and load-time Motion use identical factory wiring.
7. **Atomic failure:** failed driver construction leaves graph, Motion map, and resources unchanged.
8. **One clock subscription:** project clock subscription count remains one regardless of Motion count.
9. **Backpressure:** rapid driver emissions produce the latest scheduled progress, not unbounded jobs.
10. **Consumer behavior:** scroll demo no longer manually calls `signal()` for a configured scroll Motion, unless explicit override is part of the contract.

## 13. Recommendation

Ship T1 and T2 first: factory seam plus time driver. They are core-owned, deterministic, and do not require browser-specific schema fields.

Then ship T3 as an adapter integration. Keep scroll configuration outside core until the source registry contract is settled.

The decisive rule: **a declared trigger type must either select a real driver or fail clearly. It must never silently fall back to manual behavior.**

## 14. Open questions

1. Does a time Motion stop at `1`, loop, or ping-pong? Recommendation: stop at `1` in the first slice.
2. Should `autoplay` default to true? Recommendation: true for `time`, false only if explicitly paused behavior is added.
3. What does a scroll source key resolve against? Recommendation: injected application registry, never DOM/GSAP fields in core.
4. Do explicit `signal()` calls override configured drivers? Recommendation: allow as debug/test override with documented precedence.
5. Should a missing scroll driver reject load or leave the Motion dormant? Recommendation: reject for strict correctness; a dormant Motion is too easy to mistake for a working one.
6. Are `repeat` and `yoyo` needed before the first time-driver release? Recommendation: no, defer them.

## 15. Bottom line

The current problem is not that `Motion` lacks more `if` statements. It lacks a source-selection seam.

Add one factory, keep normalized progress as the only Motion input, reuse the existing project clock, and make driver resources transactional and disposable. That gets real time and scroll behavior without duplicating graph, Motion, or clock ownership.
