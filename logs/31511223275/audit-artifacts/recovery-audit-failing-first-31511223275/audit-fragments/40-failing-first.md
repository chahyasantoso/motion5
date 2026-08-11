## failing-first

- ref: 475b58526658aca2692c9375be88565a1590ab94
- base: c1aeb6ce77ba312fc4dbb952204889af56f09d8d
- new or modified test files:
  - packages/core/test/unit/scripts/boundary-scan.test.ts
- source files changed:
  - none
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
