# Triggers

A motion's trigger decides where its progress comes from. The type is enforced, not decorative: a declared type resolves a real driver or the load fails. Nothing falls back to manual, and no trigger field is accepted and then ignored.

## time

```ts
const trigger = { type: "time", duration: 1000 };
```

`duration` is required, finite, and greater than zero, in the same units as your clock's delta. The driver accumulates clock deltas, emits `elapsed / duration`, latches at `1`, and then emits nothing further. Playback always starts: `autoplay` may be absent or `true`, and `false` is not representable because explicit paused behavior does not exist yet.

`repeat` and `yoyo` are rejected at validation at any value, including `0`. Loop semantics are undesigned, and a field that validates has to be honored.

## scroll

```ts
const trigger = { type: "scroll", source: "hero-scene" };
```

Scroll is push-driven and registers no clock consumer, so a clock tick never moves it. `source` is a serializable string key, never a selector or an element. You resolve that key to a progress source at load time, which is the only way core stays free of DOM and animation-engine imports:

```ts
import { Engine, createTriggerFactory } from "@motion5/core";

// Any push source works: native scroll, GSAP ScrollTrigger, Lenis, Locomotive.
const heroScroll = {
  subscribe(onProgress: (progress: number) => void) {
    const handler = () => onProgress(window.scrollY / window.innerHeight);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  },
};

const engine = new Engine({
  clock,
  interpolator,
  scheduler,
  triggerFactory: createTriggerFactory({
    scroll: ({ trigger }) => (trigger.source === "hero-scene" ? heroScroll : undefined),
  }),
});
```

Returning `undefined` from your resolver is a refusal, and it fails loudly at `load()` or `addMotion` with `trigger-driver-unavailable`, naming the motion id and the key. A missing `source` is not a validation error, because whether a key is required is your factory's business.

Your source is the one place normalization belongs, because it is the only place that understands the measurement. The built-in port clamps a measured overshoot such as `1.0000001` to `1`, but it rejects a non-finite push outright with `ScrollSource progress must be a finite number.` rather than forwarding it.

## manual

```ts
const trigger = { type: "manual" };
```

Manual takes no other fields. Progress arrives through `signal`, and the motion also advances on the project clock:

```ts
handle.signal("hero", { type: "manual", progress: 0.25 });
flush();
```

## signal versus seek

These are different tools and the difference is deliberate.

`signal(motionId, signal)` is composite control. It only works on a `manual` motion; a driver-backed motion rejects it with `Motion has a configured trigger driver and does not accept external signals.` That is not a limitation to work around, it is the guarantee that a motion has exactly one source of progress.

`seek(nodeId, progress)` is leaf-level scrubbing and is never gated by the trigger. It writes one node's progress directly and returns the resulting `PatchBatch`. On a driver-backed node it works, and the next driver emission overwrites it. Use it for editors, inspectors, and scrub bars.

## Progress that reaches a motion is validated, not clamped

Every `TriggerPort` funnels into one validator. Anything outside `[0, 1]`, and anything non-finite, throws at the emit site:

- non-finite throws `TypeError: Motion progress must be finite.`
- out of range throws `RangeError: Progress must be between 0 and 1.`

This fires even when the motion is attached but not advancing, on purpose: a motion that quietly swallowed a malformed emission taught your driver nothing, and the failure used to surface later at the flush, blaming the wrong object. If your source can emit `1.0000001`, normalize it in your source.

`seek` still clamps, and a track guards its own progress. Those are different owners with different jobs, not a second opinion about trigger input.
