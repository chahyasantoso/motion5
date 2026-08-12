## failing-first

- ref: 2068e64a7d2412e3d2e6a040ee992f847adb8704
- base: 5a215cecb20269187589c6350f5e7af470f72643
- new or modified test files:
  - packages/core/test/contract/adapters.test.ts
  - packages/core/test/contract/gsap-paused-timeline.test.ts
- source files changed:
  - packages/core/src/adapters/interpolator/gsap.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
