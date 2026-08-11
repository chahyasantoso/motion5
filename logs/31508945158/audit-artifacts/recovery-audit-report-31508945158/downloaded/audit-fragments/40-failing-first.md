## failing-first

- ref: 406e0c4325d6eafe0e9cb0de3d41d664bbbe8f8d
- base: 5707bc7be98ba5fa3e72f1c6c9f9980510714f36
- new or modified test files:
  - packages/core/test/integration/dom-patch-apply.test.ts
- source files changed:
  - none
- base run: passed-on-base
- ref run: passed-on-ref
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- documented exception: C3 closes the previously missing DOM integration evidence named by the recovery plan; no source regression is introduced and the new test is intentionally green on the parent.
- verdict: exception
