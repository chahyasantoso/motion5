## failing-first

- ref: 5b7a313529045c3281d12615adfa047737a66008
- base: 4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de
- new or modified test files:
  - packages/core/test/unit/scripts/mutation-config.test.ts
- source files changed:
  - none
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
