## failing-first

- ref: 88ca0f3b552ec0513b9e31310fa7895d63ddba80
- base: 64178c0d0c751ca12f277f93c0ac7ed198722d05
- new or modified test files:
  - packages/core/test/unit/scripts/acceptance-scan.test.ts
- source files changed:
  - none
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
