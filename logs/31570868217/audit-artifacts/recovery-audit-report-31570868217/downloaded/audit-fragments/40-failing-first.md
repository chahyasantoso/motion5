## failing-first

- ref: 79b2824098ab102c6c44f1c343d144ba6305c6ce
- base: 83eb44d2da7e118e284d96c890f82cd90c84f960
- new or modified test files:
  - none
- source files changed:
  - none
- base run: no-new-tests
- ref run: no-new-tests
- typecheck is deliberately not run on the base leg: vitest transpiles
  tests without checking them, so a strictly typed test executes against
  an implementation that does not yet expose its API and fails on
  behavior rather than on compilation. Slices ship one test file.
- verdict: fail
