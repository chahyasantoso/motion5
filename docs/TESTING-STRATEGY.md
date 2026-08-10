# Testing strategy

## No borrowed tests

No test, fixture, snapshot, or helper is copied from the reference repository. Behavioral intent may be reproduced from reading it; files may not be. Two reasons. A copied test encodes the old ownership model in its setup, and importing that setup quietly imports the architecture it was written against. And a copied test that passes proves the old behavior, which is not the same as proving the new contract.

When a reference behavior is worth preserving, it is written here as a new test against the new contract, with a comment naming the behavior, not the source file.

## Tiers

1. **Unit.** One module, fakes for everything else. Fast, no DOM, no animation engine. The bulk of the suite.
2. **Contract.** One suite per port, run against the fake and against every real adapter. If a fake and a real adapter can disagree, the port is not proven.
3. **Integration.** Multiple owners cooperating: graph transactions with rollback, mount and unmount lifecycles, cross-motion composition, patch batching, subscriber semantics.
4. **Golden fixtures.** Authored project in, serialized batch sequence out. Deterministic byte comparison.
5. **Package.** Pack the tarball, install it in a temporary consumer, import the documented public API. Catches export map mistakes nothing else catches.
6. **Performance.** Deterministic benchmarks with committed budgets, failing on a defined threshold.

## Invariant tests

Every invariant in [ARCHITECTURE.md](./ARCHITECTURE.md) section 4 has a test named after it, for example `I-2 failed mutation restores the pre-mutation snapshot`. Grepping for an invariant id must find both the rule and its proof. An invariant without a test is a comment.

## Determinism

- Time comes from the manual clock. No `Date.now`, no `performance.now`, no `requestAnimationFrame` in any test.
- No randomness. Where variety is needed, use a seeded generator committed alongside the test.
- No reliance on `Map` or `Set` iteration order for anything asserted. Canonical order is by qualified id, and tests assert that explicitly.
- Fixtures serialize with sorted keys.

## What is not a test

These are banned as evidence, because the reference project shipped all of them and none of them caught a real defect:

- Source-text scans asserting that a symbol still exists.
- Comment-to-code ratio or prose gates.
- File allowlists that may not shrink.
- Snapshot tests over pretty-printed internals.
- Tests that assert two code paths produce equal values, when the actual risk is that they produce different payload shapes. Compare shape and value, or do not claim parity.

## Coverage

Coverage is reported, not gated. A gate on a percentage buys tests for getters. The real gate is the invariant list: every invariant proven, every public API exercised by the package consumer test, every port covered by its contract suite.

## Failure hygiene

A flaky test is deleted or fixed within one working session. Skipping to get green is a revert in disguise, and it is treated as one.
