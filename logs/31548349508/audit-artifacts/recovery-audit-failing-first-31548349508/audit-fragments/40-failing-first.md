## failing-first

- ref: aecc6fed2c1d38f9d459f0a20eaef8a0fe70d967
- base: 2409672471cf673594c9970864dc8ff9a93184cd
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
