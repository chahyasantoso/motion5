# Phase 7 ledger

Work Phase 4 deliberately left for the phase that removes superseded paths.

## Internal output-role machinery

Retained in S2 with the authored `observes` surface deleted: `graph/binding.ts`, the output arm of `graph/order.ts`, `graph/observation-state.ts`, the output phase of `runtime/graph-publisher.ts` (`#mergeOutputs`), and the output handling in `graph/builders/incremental.ts`.

Reason: authored output edges had exactly one producer, and it is gone, so no project can populate this machinery today. Deleting it inside S2 would have widened the slice into the publisher's composition phase, the transaction journal, ordering and invalidation, and roughly fifteen tests that Phase 4 is still rebuilding. Phase 7 owns removing superseded paths and can delete the machinery whole once the identified-table publisher has no output-role consumer, rather than reshaping it now for a caller that no longer exists.
