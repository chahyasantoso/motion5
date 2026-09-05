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

No comment-density gates, non-shrinking file allowlists, source-text scans presented as behavioral tests, snapshots of private object graphs, or value-only parity tests that ignore payload shape. Boundary scans are allowed as mechanical enforcement; they complement, never replace, runtime tests. A source-text claim inside a behavioral case is neither of those things, and the section below is what it is held to instead.

## Source-text claims

A source-text assertion is allowed, and it is bounded by its own subject. Some claims are mutant killers no behavioral rig can replace: a spy on `invalidate` counts calls, so it cannot see a second diagnostics channel on the same batch, a second flush statement on a branch the case does not drive, or a cost the case exists to prove is skipped being paid anyway. Those claims stay. What is refused is the address, because an assertion's address is part of the assertion.

Two rules follow, and `packages/core/test/unit/scripts/source-region-anchors.test.ts` enforces both.

**A region is bounded by the declaration it is about.** A class member is addressed by its own signature and its own closing brace, and a top-level declaration by its own terminator. Never by the name of the next member: a neighbour's name is part of no claim about its neighbour, so a rename, a reorder, or a member declared between the two turns the case red for no behavioral reason, or widens its window in silence, which is the worse direction. The lower bound is the same rule and the easier half to get wrong, because a private name matches every call site as well as its declaration and a call site declared earlier in the file wins. Issue #314 is the whole of the reason: two cases reading a fifteen-member window that both of their claims happened to be true of, one of them a claim about a single owner measured across two of them. Where the subject genuinely is a span of several declarations, the claim is spelled once per declaration, because a span has no bound that belongs to it.

**A `toContain` claim names a statement, not a phrase.** `code()` strips whole-line comments only, so a commented-out statement can neither satisfy a `toContain` nor defeat a `not.toContain`; a trailing comment on a code line survives, and prose is not evidence.

One owner does the reading. `packages/core/test/helpers/source-region.ts` exports `code`, `member` and `declaration`, and a case that reads source imports them rather than declaring its own copy. The retired two-bound `region(from, until)` is deleted rather than discouraged, because its second parameter is the affordance that produced every one of these defects, and one of them was hand-rolled with `indexOf` after the helper already existed.

## Failure hygiene

A flaky test is fixed or deleted in the same working session. Skipping a test to get green is treated as a revert. Test names should describe the contract and failure mode, not the implementation method.

## Coverage policy

Coverage is reported but not the release gate. The release gate is the invariant matrix, public package consumer, migration suite, contract suites, integration behavior, and deterministic benchmarks.
