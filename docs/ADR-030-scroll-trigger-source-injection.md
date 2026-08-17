# ADR-030: Scroll drivers are injected by serializable source key

**Status:** Accepted, 2026-08-17

## Context

Core must support scroll-driven Motions without importing DOM or GSAP types. A scroll trigger's authored `source` is a serializable key, not a selector or element. Leaving a scroll Motion dormant when its source is missing makes configuration failures look like working animation.

## Decision

`createTriggerFactory({ scroll })` accepts an application-owned resolver. The resolver receives the trigger factory context and authored source key, and returns a `ScrollSource` or `undefined`. Core wraps the source with `createScrollTriggerPort`, so clamping and source unsubscribe remain in one adapter.

A missing source throws `trigger-driver-unavailable` during `Engine.load()`. Scroll Motions are push-driven, register no clock consumer, and reject external `signal()` calls through the existing capability flag. Core never receives a selector, element, GSAP object, or DOM type.

The default factory intentionally has no scroll registry and therefore fails loudly for declared scroll triggers. Hosts opt in by injecting the resolver at the composition root.

## Failure ordering

Source resolution happens before a Motion is committed to the runtime maps. A failed load disposes any already-created drivers and compiled Tracks through the existing Engine cleanup path. A successful load owns exactly one source subscription per scroll Motion and disposes it exactly once with the Motion.

## Evidence

`packages/core/test/integration/trigger-scroll.test.ts` covers injected progress, clamping, subscription teardown, missing-source rejection, and external-signal rejection. Contract coverage verifies manual/time/scroll factory selection and the default fail-loudly behavior. Boundary CI verifies no DOM or GSAP dependency enters `packages/core`.