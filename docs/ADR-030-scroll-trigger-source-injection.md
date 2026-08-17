# ADR-030: Scroll drivers are injected by serializable source key

**Status:** Accepted, 2026-08-17

## Context

Core must support scroll-driven Motions without importing DOM or GSAP types. A scroll trigger's authored `source` is a serializable key, not a selector or element. Leaving a scroll Motion dormant when its source is missing makes configuration failures look like working animation.

## Decision

`createTriggerFactory({ scroll })` accepts an application-owned resolver that returns a `ScrollSource` or `undefined`. Core wraps the source with `createScrollTriggerPort`, so clamping and source unsubscribe remain in one adapter. Core never receives a selector, element, GSAP object, or DOM type.

A missing source throws `trigger-driver-unavailable` during `Engine.load()`. The default factory intentionally has no scroll registry and therefore fails loudly for declared scroll triggers. Hosts opt in by injecting the resolver at the composition root.

## The canonical trigger read

`MotionDefinition.trigger` stays structurally open so authored extension keys survive validation, which leaves `source` and `duration` typed `unknown`. Narrowing therefore happens once, at the validation boundary, in `resolveTriggerDefinition`, and is carried on the factory context:

- `context.trigger` is a `TriggerDefinition`. It is the canonical read and the only supported way to read trigger fields.
- `context.definition.trigger` is raw authored input. The two are **not** interchangeable.

Every injected factory therefore gets the discriminated union for free instead of re-deriving it with its own `typeof` guards. `resolveTriggerDefinition` holds the only cast from authored input to `TriggerDefinition`, immediately behind the one implementation of the trigger rules.

The resolver takes no second `sourceKey` argument, because `sourceKey === context.trigger.source` would pass the same value twice. Its context type narrows `trigger` to `ScrollTriggerDefinition`, so a time trigger is unrepresentable at the call site.

## The clock relationship is a single total field

A scroll Motion registers no clock consumer. That is expressed as `CreatedTrigger.clockBinding`, a tagged union over the three states that exist: `driver` (time), `motion` (manual, which is an implicit time trigger today), and `none` (scroll).

An optional `onTick` plus a `pushDriven` flag was rejected. Two fields encoding one decision can express `{ pushDriven: true, onTick: fn }`, so it needs a runtime invariant to police a state the type system should have forbidden. With one total field, the Engine's registration site is an exhaustive switch with no fallback, and "never a driver *and* `motion.onTick`" is unrepresentable rather than merely tested.

This also names manual's implicit-time behavior instead of leaving it emergent, which makes the unification tracked in the implementation plan a later one-line change.

## Diagnostic path

`trigger-driver-unavailable` is a real `Diagnostic` built by `contract/diagnostics.ts` and rendered by the same `describeDiagnostics` the validator and the Engine use. Rule ids are contractual, so their rendering is not a template literal in an adapter.

Its path is id-keyed (`motions.<id>.trigger.source`) rather than index-keyed (`motions[i].trigger`), because a factory has no motion index. This is deliberate and asserted.

## Public seam

`createTriggerFactory`, `createDefaultTriggerFactory`, `TriggerFactoryOptions`, `ScrollSourceResolver`, `ScrollSourceResolverContext`, `ClockBinding`, and `ScrollSource` are exported from the package entrypoint and the adapters barrel. Without that, "hosts opt in at the composition root" is not reachable through the `exports` map. The boundary allow list is updated in the same change, so the export gate stays a gate.

## Failure ordering

Source resolution happens before a Motion is committed to the runtime maps. A failed load disposes any already-created drivers and compiled Tracks through the existing Engine cleanup path, so a resolved source ahead of an unresolvable one is unsubscribed. A successful load owns exactly one source subscription per scroll Motion and disposes it exactly once with the Motion.

## Evidence

`packages/core/test/integration/trigger-scroll.test.ts` covers injected progress with clamping in both directions, standalone subscribe/unsubscribe counts, missing-source rejection down to the rule id and path, the two-Motion cleanup ordering case, external-signal rejection, and the invariant that a scroll Motion is never advanced by the clock. Contract coverage verifies factory selection by `clockBinding.kind`, the narrowed resolver context, and the default fail-loudly behavior. Boundary CI verifies no DOM or GSAP dependency enters `packages/core`.
