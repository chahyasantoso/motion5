# ADR-191: Shapes and curves

**Status:** Accepted, 2026-11-18

## Context

`@gerak/core` already held three shapes: timings (`Timing`), curves (`Ease`, `arch`, `wave`, `attack`, `decay`, `taper`, `ballistic`, `along`, `along3d`, `mix*`), and signals (`(time, events) => value`). Only `Timing` was named; `@gerak/player` named the signal shape `Scene<T>`, `velocity` and `velocity3d` wrote its function signature out each time, and the seven non-ease curve functions took progress alongside loose settings instead of building a `Curve` once from their settings as `backEase` and `springEase` do. Meanwhile `NAMED_CURVES` in `packages/tools/src/page/curves.ts` kept its own copies of core's eases under a local `Curve` type.

## Decision

1. **Core names its three shapes.** `packages/core/src/time/shapes.ts` exports `Curve<T = number> = (progress: number) => T` and `Signal<T = Pose2d> = (time: Time, events: Events) => T`. `Ease` stays exported as `Curve<number>`. `velocity` takes `Signal<Pose2d>` and `velocity3d` takes `Signal<Pose3d>`. `@gerak/player` drops `Scene`, and `@gerak/player`, `@gerak/dom`, `@gerak/react` and `@gerak/tools` use `Signal` from `@gerak/core` with no alias. `core.md` opens its API section with a three-row table of `Timing`, `Curve` and `Signal`.
2. **A curve with settings is built from them.** `wave({ count, phase? })`, `attack({ rate })`, `decay({ rate })`, `taper({ power })`, `ballistic(options)`, `along(cubics, options?)` and `along3d(cubics, options?)` take their settings once and return a `Curve`. `arch`, `mix*`, `ease.*`, `spring`, `springEase`, `backEase` and `springMemory` are unchanged. Every caller in `packages/` and `apps/` moves over, building fixed-setting curves once outside the scene.
3. **One owner for the eases.** `NAMED_CURVES` in `packages/tools/src/page/curves.ts` is built from `@gerak/core`'s `ease` and `Curve`, deleting the local copies. `scripts/boundary-scan.mjs` permits `@gerak/core` (still forbidding libraries and renderers) in `packages/tools/src/page/`, refining [ADR-155](./ADR-155-motion-tools-package.md) and superseding in part [ADR-158](./ADR-158-motion-read-and-held-css-animations.md).

## Consequences

- Every curve with settings builds once outside the frame loop (including `arcLength` for `along`/`along3d` and parabola constants for `ballistic`). Every sampled value is unchanged; `along` and `along3d` now refuse an empty path when built, not when sampled, and `@gerak/tools/page` no longer exports its own `Curve` type.
- One type (`Signal`) names `(time, events) => T` across core, player, renderers and tools.
- `packages/tools/src/page/` still imports nothing from `@gerak/stage`, `@gerak/dom`, `@gerak/player`, `@gerak/react` or `@gerak/moves`.
