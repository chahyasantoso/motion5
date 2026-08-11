# Implementor brief: restore motionpath behavior in motion5

## Mission

Complete `motion5` without rewriting its graph kernel. Preserve the strongest architecture already in motion5, and restore the proven animation-value pipeline from `motionpath`.

The target is not a copy of either repository:

- **motion5 owns architecture:** graph IR, qualified IDs, transactional GraphBinding, canonical ordering, one project runtime, immutable patches, failure containment, package boundaries, and renderer separation.
- **motionpath is the behavioral oracle:** authored keyframes, proxy-backed interpolation, plugin compilation and composition, input/output observation semantics, Motion controls, and renderer output behavior.

## Non-negotiable rules

1. Do not replace motion5's Phase 2/3 graph ownership with motionpath's old publisher or Track-owned graph traversal.
2. Do not copy files wholesale from motionpath. Port behavior and contracts into motion5's boundaries.
3. Do not add a sampler API to the interpolator. The interpolator owns an adapter-managed mutable state object; Track reads it.
4. Do not add a second RAF/ticker. Keep one clock owner per project.
5. Do not accept a green placeholder test as evidence. Every new behavior test must fail on the starting commit.
6. Do not claim Phase 4 complete until the required build job and end-to-end fixture are green.
7. Keep `PatchRegistry` and graph internals out of the public package surface.

## Required reading

Read these in order:

1. [motion5 consolidated audit](./PHASE-3-4-CONSOLIDATED-AUDIT.md)
2. [motion5 recovery plan](./PHASE-3-4-RECOVERY-PLAN.md)
3. [motion5 Phase 4 review](./PHASE-4-IMPLEMENTATION-REVIEW.md)
4. [motion5 implementation plan](./IMPLEMENTATION-PLAN.md)
5. [motionpath v4 system guide](https://github.com/chahyasantoso/motionpath/blob/master/docs/MOTIONPATH-V4-SYSTEM-GUIDE.md)
6. [motionpath v5 observation-graph branch](https://github.com/chahyasantoso/motionpath/tree/v5-pr-15-observation-graph)
7. [motionpath v5 Track](https://github.com/chahyasantoso/motionpath/blob/v5-pr-15-observation-graph/packages/core/src/lib/Track.js)
8. [motionpath v5 GraphPublisher](https://github.com/chahyasantoso/motionpath/blob/v5-pr-15-observation-graph/packages/core/src/usecases/GraphPublisher.js)
9. [motionpath v5 GraphBinding](https://github.com/chahyasantoso/motionpath/blob/v5-pr-15-observation-graph/packages/core/src/usecases/GraphBinding.js)
10. [motionpath v5 tween compiler](https://github.com/chahyasantoso/motionpath/blob/v5-pr-15-observation-graph/packages/core/src/usecases/BuildTrackTween.js)
11. [motionpath v5 DOM renderer](https://github.com/chahyasantoso/motionpath/blob/v5-pr-15-observation-graph/packages/core/src/adapters/domRenderer.js)

## What must be restored

### 1. Value contract

Change the interpolator contract so a timeline exposes:

```ts
interface InterpolationTimeline {
  readonly duration: number;
  readonly state: Readonly<Record<string, unknown>>;
  progress(): number;
  progress(value: number): void;
  kill(): void;
}
```

The GSAP adapter should animate an adapter-owned proxy. The fake interpolator must expose deterministic state. Track must never mutate the state directly.

### 2. Typed authored keyframes

Replace `Record<string, unknown>` with a typed stop structure containing `p`, `v`, and optional `ease`. Validate finite, monotonic, unique positions and produce deterministic diagnostics. Reject or explicitly diagnose unsupported keys.

### 3. Plugin compilation and composition

Restore the useful parts of the motionpath plugin contract:

- authored key ownership through `keys`/`claimsKey`;
- compile-time `contribute()`;
- runtime `compose()`;
- `inputs` metadata;
- deterministic `stage` and `priority` ordering;
- output ownership and merge modes;
- serializer and internal-key metadata;
- lazy loading/preparation only if required by the v5 contract.

Resolve plugins once per Track. Do not resolve them during every flush.

### 4. Track lifetime and progress

Compile each Track once per committed project/runtime graph. `GraphRuntime.flush()` must reuse composition functions and Tracks, never construct new Tracks per flush. ProjectRuntime owns Track lifetime and disposal.

Wire Motion/trigger progress to Track progress and publisher invalidation without creating another clock.

### 5. Graph compatibility

Keep motion5's graph semantics:

- inputs feed the source object before local composition;
- outputs merge over the final local patch;
- canonical edge order wins deterministic collisions;
- dirty closure and blocked downstream behavior remain publisher responsibilities;
- published values are immutable;
- graph mutations remain transactional and rollback-safe.

Memoize final published values consistently. A downstream node must see the same upstream value whether that upstream was seeded in the current flush or came from the registry.

## Suggested implementation order

1. Add a failing fake-interpolator state test.
2. Add `state` to the interpolator contract and adapters.
3. Add typed keyframe stops and validation tests.
4. Restore plugin metadata, contribution, resolution, and compile-time collision checks.
5. Make Track compile once and read timeline state.
6. Wire progress invalidation through the existing clock owner.
7. Fix final-value memo consistency and batch error preservation.
8. Repair boundary scanner self-tests and React resubscription.
9. Define the public runtime exports.
10. Add the required build job and real end-to-end fixture.
11. Update status/docs only after evidence is green.

## Definition of done

The work is complete only when:

- a fake and GSAP-backed interpolator both produce non-empty values;
- authored stops compile and interpolate at 0, 0.5, and 1;
- plugins compose real renderer-neutral output;
- the same Track/timeline survives multiple flushes and is disposed once;
- progress invalidates the correct downstream closure;
- input and output observations are deterministic and immutable;
- DOM and React consumers pass lifecycle tests;
- public package imports work without source-internal paths;
- the required build job and end-to-end fixture are green;
- docs make no claims unsupported by executable evidence.

## Suggested task/PR template

### Invariant

What becomes true in one sentence?

### Failing-first evidence

Which test fails on the parent commit, and what exact assertion proves the bug?

### Owner

Which single object owns the new state transition?

### Motionpath oracle

Which file or behavior in motionpath is the reference, and what is intentionally not copied?

### Motion5 boundary

Which existing motion5 owner or boundary remains unchanged?

### Deletions

What placeholder, duplicate owner, dead API, or stale claim is removed?

### Exit

What exact command and test make the slice green?
