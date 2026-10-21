# B6 — Execute collect/fold and publish owned outputs

Status: not implemented. Depends on: B2, B4, B5.

## Start here

Read `00-overview.md`, `42-cache-contract.md` sections 4–5, compiled plan/local input seams, `packages/core/src/domain/track.ts`, `packages/core/src/runtime/graph-publisher.ts` and existing renderer-neutral validation/freezing/serializer helpers. Use synthetic plugins before final skeleton consumers.

## Outcome and work

Walk entries in authored order. Build one immutable local evaluation per entry. Run collect first if present, fold second if present; no collect/fold/both mode union. Collect returns one record; core rejects own id, stamps entry ID and appends. Collect sees neither fold state nor collections.

Fold sees preceding fold state and returns only a top-level delta. Validate own keys against declared outputs and safe-merge them; omissions preserve earlier fields, nested values replace as a whole. No deletion, undefined/null sentinel, undeclared writes, mutation or spread obligation. Fold cannot read collections or its own collect result. Equal output routing does not establish payload compatibility; consumer capabilities validate it.

Dispatch through the B2 execution strategy exactly once; B7 later plugs in its generic stateful evaluator without another operation loop or publication owner. Factory-backed entries share one immutable prepared local evaluation across operations. Prepare cannot read fold state or collections. Collect output is never passed to fold; final opaque private state is proposed, not committed inside a callback. Stateless definitions stay unchanged. Do not cache entire callbacks/deltas centrally: a fold cache must explicitly include every consumed prior-fold value.

At track end combine fold state and collection buffers under collision-free claims; validate serializers/values and freeze through the existing path. The full evaluation transaction accepts once, not per entry or earlier track. Do not copy all authored leaves into outputs or gratuitously clone safe nested immutable references. Any operation, validation or freeze failure abandons all staged ready outputs and B7 state/cache proposals while retaining normal error/last-ready behavior.

## Evidence and finish

Test collect-only/fold-only/both, single callback counts/order, scoped same-named values/inputs, noncommutative folds, shared collections, field last-write/omission, foreign writes/id spoofing, cross-op collisions, malformed/undefined/non-finite results, empty values and late serializer/freeze failure. Assert no earlier track/entry is accepted after a later failure. Type-test execution strategy coverage; B7 supplies injected-provider/state tests through this same loop.

Done when generic operations have one execution/publication path without skeleton branches or hidden collect-to-fold channels. Record actual changed APIs, commands/results and tested transaction scope. Next: B7.
