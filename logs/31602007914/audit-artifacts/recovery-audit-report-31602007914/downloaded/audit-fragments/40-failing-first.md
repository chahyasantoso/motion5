## failing-first

- ref: 45c8c5662a5d36eedc32dccd25b50d68888456fa
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
