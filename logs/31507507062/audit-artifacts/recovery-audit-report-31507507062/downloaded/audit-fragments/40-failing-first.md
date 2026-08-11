## failing-first

- ref: ecc9ec00964ed43a29eb94675b4d41d0ae6029bd
- base: a31942809a744ca78ffc11cbcc49e0460a1a058b
- new or modified test files:
  - packages/react/test/public-hook-render.test.ts
  - packages/react/test/public-hook.test.ts
  - packages/react/test/public-package-surface.test.ts
- source files changed:
  - packages/react/src/index.ts
- base run: failed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: pass
