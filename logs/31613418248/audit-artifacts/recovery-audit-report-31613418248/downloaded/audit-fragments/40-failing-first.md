## failing-first

- ref: 2e24201930f890fc7c3c83d836707e661b3cae83
- base: c7aae62a94897aa84a652cd13f42fb4fddfd67b5
- new or modified test files:
  - packages/core/test/unit/runtime/clock-tick-identity.test.ts
- source files changed:
  - packages/core/src/adapters/browser-clock.ts
  - packages/core/src/runtime/graph-runtime.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
