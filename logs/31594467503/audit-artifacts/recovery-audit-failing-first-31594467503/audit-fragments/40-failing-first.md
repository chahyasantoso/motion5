## failing-first

- ref: 30c7be24953f44ee31eec5fb732a6dfe4511f537
- base: fb38313e76c411dee6ce25b8fee5c3aa307fe068
- new or modified test files:
  - packages/core/test/contract/gsap-multi-stop.test.ts
  - packages/core/test/integration/end-to-end.test.ts
- source files changed:
  - packages/core/src/adapters/interpolator/gsap.ts
  - packages/core/src/domain/track.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
