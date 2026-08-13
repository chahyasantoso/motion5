## failing-first

- ref: c738b3f81a68c871104825dc3f35b63fb3d1f9b5
- base: 2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a
- new or modified test files:
  - packages/core/test/contract/gsap-absolute-stops.test.ts
  - packages/core/test/contract/gsap-multi-stop.test.ts
  - packages/core/test/contract/gsap-paused-timeline.test.ts
  - packages/core/test/integration/end-to-end.test.ts
- source files changed:
  - packages/core/src/adapters/interpolator/gsap.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
