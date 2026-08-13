## failing-first

- ref: e2bce7742f5746909201746f2ff2a0561bb4476c
- base: 8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3
- new or modified test files:
  - packages/core/test/contract/gsap-authored-duration.test.ts
- source files changed:
  - packages/core/src/adapters/interpolator/gsap.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
