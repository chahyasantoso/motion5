# Trigger Refactoring Feasibility Study

## Executive summary

The current `TriggerDelegate` abstraction (three identical subclasses, one signal validation behavior) is unfinished scaffolding blocking the walker demo and obscuring the actual design. **Propose removing it entirely from core and replacing with a simpler `Clock` port abstraction** that handles both time and scroll progression uniformly.

The insight: what makes a motion "time-driven" vs "scroll-driven" isn't a trigger type, it's the **clock it listens to**. A `BrowserClock` emits RAF deltas; a `ScrollClock` emits scroll deltas. Same motion code, different clock backend.

## Current state: three classes, one behavior

### What exists

`packages/core/src/domain/triggers.ts`:

```ts
class ManualTrigger extends BaseTrigger { constructor() { super("manual"); } ... }
class ScrollTrigger extends BaseTrigger { constructor() { super("scroll"); } ... }
class TimeTrigger extends BaseTrigger { constructor() { super("time"); } ... }

protected handle(signal: TriggerSignal): void {
  if (signal.progress === undefined) throw new TypeError("... requires progress.");
  assertProgress(signal.progress);
  this.emit({ setProgress: signal.progress });
}
```

Three classes. Identical bodies. Each validates 0..1 and forwards `setProgress`.

### What they're supposed to own (but don't)

- **Time trigger**: autoplay, time progression, play/pause control, duration-aware speed. None of this is in `TimeTrigger`; it's all in `Motion#onTick`.
- **Scroll trigger**: scroll reading, scrub smoothing, pinning, direction reversal. None in `ScrollTrigger`; it's supposed to be in the app driver.
- **Manual trigger**: just validation. At least this one is honest.

### The problem

Two contradictions:

1. **Time progression is implemented in Motion, not TimeTrigger.** `Motion#onTick` owns the clock subscription and `position += delta / duration` math. The trigger that's supposed to drive time doesn't touch any of it.
2. **The app has to re-implement scroll anyway.** `ScrollTrigger` only validates progress; the scroll driver (app side) reads the DOM and computes progress, then calls `signal()`. But the trigger.type is `scroll` in the schema, claiming the motion knows it's scroll-driven. Lie.

Result: three identical objects taking up cognitive load, masking the actual design.

## Proposed design: remove triggers, use Clock polymorphism

### The key insight

Motion already owns the time progression logic:

```ts
#onTick(event: ClockTick): void {
  if (!this.#playing) return;
  const next = Math.min(1, this.#position + this.#progressDelta(event.delta));
  // schedule setProgress(next)
}

#progressDelta(delta: number): number {
  const duration = this.#tracks.reduce((max, entry) => Math.max(max, entry.duration ?? 1), 1);
  return delta / duration;
}
```

This works for **any** clock. If the clock emits RAF deltas, position advances in real time. If the clock emits scroll deltas, position advances in scroll space. The motion doesn't need to know which; it just listens and updates.

So instead of having the trigger type determine behavior, **have the clock determine it**.

### Changes required

#### Core (packages/core)

1. **Remove `src/domain/triggers.ts` entirely** (or keep it as a private app helper, not core export).
2. **Remove the `trigger` parameter from Motion constructor.**
3. **Simplify Motion.signal():** only accept `{ progress: number }` directly (no type tag). Remove the trigger delegate.
4. **Keep the schema's `trigger: { type, ...metadata }` as documentation only.** The runtime ignores it; the app reads it to know what clock to build.

Before:
```ts
const motion = new Motion({
  clock,
  scheduler,
  tracks,
  trigger: createTrigger(definition.trigger.type), // ← remove this
  invalidate,
  stagger,
});
motion.play(); // or the trigger decides
```

After:
```ts
const motion = new Motion({
  clock,
  scheduler,
  tracks,
  invalidate,
  stagger,
});
if (definition.trigger.type === "time") motion.play();
// else motion stays paused; app calls motion.seek() or motion.signal({ progress: 0.5 })
```

#### App (walker demo + examples)

1. Build clock implementations for each trigger type:
   - `createBrowserClock(rafFrameSource)` — existing, unchanged. Motion auto-advances on RAF.
   - `createScrollClock(triggerRef, pinRef, { scrub, start, end })` — new. Reads DOM, emits scroll deltas.
   - `createGsapScrollClock(gsap, triggerRef, pinRef, triggerConfig)` — new. GSAP ScrollTrigger wrapped as a Clock.
   - `createManualClock()` — existing test double. App drives progress by hand.

2. Load a motion and wire the clock:

```ts
const walkerMotion = walkerProject.motions[0];
const triggerType = walkerMotion.trigger.type; // "scroll"

let clock;
if (triggerType === "scroll") {
  clock = createGsapScrollClock(gsap, triggerRef, pinRef, walkerMotion.trigger);
} else if (triggerType === "time") {
  clock = createBrowserClock(rafFrameSource());
} else {
  clock = createManualClock();
}

const motion = new Motion({ clock, scheduler, tracks, invalidate });
if (triggerType === "time") motion.play();
```

### Why this is cleaner

1. **Honest ownership.** Motion owns progression logic (which it always did); Clock owns the timing source (which is now polymorphic). No false attribution.
2. **Scroll is a first-class clock.** Not a special trigger type that the app has to work around. Just another clock backend.
3. **Reusable:** `createScrollClock` can back any motion, not just scroll-triggered ones. `createGsapScrollClock` is a polished option for web apps.
4. **GSAP decoupled.** ScrollTrigger becomes a library choice (as an optional clock), not baked into core.
5. **Test-friendly.** `createManualClock` drives headless tests without mocking or fake RAF.
6. **Extensible.** A game engine could create a `GameEngineClock` emitting frame deltas. A state machine could create a `StateMachineClock` emitting progress updates. All work with the same Motion.

## What stays in the schema

```ts
interface MotionDefinition {
  id: string;
  trigger: {
    type: "manual" | "scroll" | "time";
    // metadata for the app to read and build a clock
    scrub?: number;
    pin?: string; // element selector or ref
    start?: string; // GSAP ScrollTrigger syntax
    end?: string;
    // for time-driven motions
    loop?: boolean;
    yoyo?: boolean;
  };
  tracks: readonly TrackDefinition[];
  stagger?: number;
}
```

The runtime ignores the metadata. The app reads `type` to decide which clock to build, then reads `scrub`, `pin`, etc. as config for that clock. Honest separation.

## Feasibility

### Effort

- **Remove triggers from core:** ~50 lines deleted (three classes + factory), tests updated. Low risk.
- **Update Engine.load():** ~10 lines changed. Check `trigger.type` before `motion.play()`.
- **Implement clock backends:**
  - `ScrollClock` (hand-rolled): ~60 lines, no deps.
  - `GsapScrollClock`: ~30 lines wrapping GSAP ScrollTrigger.
  - Already have: `BrowserClock`, `createManualClock`.

- **Update walker demo:** use the new pattern (see walker implementation plan for the wiring).

### Risk

- **Breaking:** removing triggers breaks consuming code. But nothing is exported yet (triggers are internal), and the walker is the first real consumer. Safe window to change.
- **Testing:** existing trigger tests are basically "assert it validates 0..1." Replacing with clock tests (assert BrowserClock emits RAF, ScrollClock reads DOM) is more useful.
- **GSAP dependency:** making GSAP ScrollTrigger optional is cleaner than baking it in. Apps that don't want it just don't use `createGsapScrollClock`.

### Upside

- **Clearer model for Phase 2/3 work.** When time autoplay or scroll advanced features ship, they're changes to the clock, not new trigger subclasses. Simpler surface.
- **Unblocks the walker demo.** No more designing around a vestigial abstraction.
- **Aligns with brief.** One clock owner per project, no second RAF, renderer-neutral. This design actually delivers on those principles instead of muddying them.

## Exit criteria

1. TriggerDelegate removed from `@motion5/core`.
2. Motion constructor updated; `trigger` parameter gone.
3. `createScrollClock` and `createGsapScrollClock` implementations exist and are tested.
4. Walker demo wires a clock (either hand-rolled or GSAP) and motion plays without a trigger object.
5. Schema's `trigger` metadata stays; runtime ignores it cleanly.
6. `npm run check` green; boundary scan passes.

## Decision

This is a recommend-merge. The current design is incomplete and confusing; this finishes it with a cleaner model that's been battle-tested by GSAP and React Spring. Low effort, high clarity gain.
