# Testing strategy

Tests are evidence for the contract, not a museum of implementation details. No test, helper, fixture, or snapshot is copied from motionpath. Behavioral intent may be independently recreated against the motion5 contract.

## Test tiers

1. **Unit:** one module, fake dependencies, deterministic and headless.
2. **Contract:** one suite per Clock, Interpolator, and Scheduler port, run against fakes and real adapters.
3. **Integration:** multiple owners: loading, graph transactions, rollback, lifecycle, publication, cross-motion, and free-track membership.
4. **Migration:** pure v4-to-v5 transformation and validation assumptions.
5. **Golden:** authored v5 project in, sorted serialized patch batches out. P0-05 establishes the stable JSON serializer and fixture format; runtime patch goldens land with the graph publisher.
6. **Package:** packed tarball installed into a clean consumer with documented imports.
7. **Performance:** deterministic graph benchmarks compared against committed budgets.

## P0-05 golden and integration evidence

Golden fixtures are JSON-safe values with a stable serializer: object keys sort lexicographically, arrays preserve authored order, and output ends with one newline. Fixtures must state their intent and expected observable result. They may represent validation/migration now and published patch batches later.

The P0-05 suite proves deterministic serialization, round-trip parsing, v5 free-track acceptance, perspective warning semantics, cycle rejection before mounting, and v4 migration immutability. It uses fresh fixtures written for motion5, not predecessor files.

## Invariant evidence

Each architecture invariant has a named executable test. I-1 proves stable ObservationState identity. I-2 compares pre/post snapshots after failed mutation. I-3 inspects the public publisher contract through behavior, not comments. I-5 counts composition calls in a diamond. I-6 observes subscriber timing across one flush. I-7 attempts deep mutation of published values. I-11 is enforced by an import boundary job plus a headless test.

## Determinism

Tests use the manual clock. They do not read wall time, random values, browser animation frames, or unordered collection iteration. Fixture serializers sort object keys and use canonical qualified-id order.

## Prohibited evidence

No comment-density gates, non-shrinking file allowlists, source-text scans presented as behavioral tests, snapshots of private object graphs, or value-only parity tests that ignore payload shape. Boundary scans are allowed as mechanical enforcement; they complement, never replace, runtime tests.

## Failure hygiene

A flaky test is fixed or deleted in the same working session. Skipping a test to get green is treated as a revert. Test names should describe the contract and failure mode, not the implementation method.

## Coverage policy

Coverage is reported but not the release gate. The release gate is the invariant matrix, public package consumer, migration suite, contract suites, integration behavior, and deterministic benchmarks.
