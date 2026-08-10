# Testing strategy

Tests are evidence for the contract, not a museum of implementation details. No test, helper, fixture, or snapshot is copied from motionpath. Behavioral intent may be independently recreated against the motion5 contract.

## Test tiers

1. **Unit:** one module, fake dependencies, deterministic and headless.
2. **Contract:** one suite per Clock, Interpolator, and Scheduler port, run against fakes and real adapters.
3. **Integration:** multiple owners: loading, graph transactions, rollback, lifecycle, publication, cross-motion, and free-track membership.
4. **Migration:** pure v4-to-v5 transformation and validation assumptions.
5. **Golden:** authored v5 project in, sorted serialized patch batches out.
6. **Package:** packed tarball installed into a clean consumer with documented imports.
7. **Performance:** deterministic graph benchmarks compared against committed budgets.

## Fresh migration test requirements

The migration suite must prove all of the following:

- v4 becomes v5;
- only project-level `tracks` becomes `freeTracks`;
- motion-level `tracks` remains unchanged;
- free references gain `~/` qualification where required;
- the input object and nested arrays are not mutated;
- applying migration to v5 is idempotent;
- both old `tracks` and new `freeTracks` fail rather than silently merging;
- malformed top-level tracks, duplicate ids, reserved ids, and ambiguous references produce deterministic diagnostics;
- perspective is preserved, added only by an explicit caller decision, and never injected with a guessed value.

Tests must be authored from these rules. They must not import predecessor fixtures or assert predecessor internals.

## Invariant evidence

Each architecture invariant has a named executable test. I-1 proves stable ObservationState identity. I-2 compares pre/post snapshots after failed mutation. I-3 inspects the public publisher contract through behavior, not comments. I-5 counts composition calls in a diamond. I-6 observes subscriber timing across one flush. I-7 attempts deep mutation of published values. I-11 is enforced by an import boundary job plus a headless test.

## Determinism

Tests use the manual clock. They do not read wall time, random values, browser animation frames, or unordered collection iteration. Fixture serializers sort object keys and use canonical qualified-id order.

## Prohibited evidence

No comment-density gates, non-shrinking file allowlists, source-text scans presented as behavioral tests, snapshots of private object graphs, or value-only parity tests that ignore payload shape.

Boundary scans are allowed as mechanical enforcement. They complement, never replace, runtime tests.

## Failure hygiene

A flaky test is fixed or deleted in the same working session. Skipping a test to get green is treated as a revert. Test names should describe the contract and failure mode, not the implementation method.

## Coverage policy

Coverage is reported but not the release gate. The release gate is the invariant matrix, public package consumer, migration suite, contract suites, and deterministic integration behavior.
