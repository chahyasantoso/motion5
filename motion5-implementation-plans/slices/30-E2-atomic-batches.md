# E2 — Accept structural recipes atomically

Status: not implemented. Depends on: E1, C7, B7.

## Start here

Read `00-overview.md`, A6/C7's acceptance protocol, `packages/core/src/contract/schema-transaction.ts`, `packages/core/src/runtime/authoring-edit.ts`, `packages/core/src/runtime/project-runtime.ts`, and relevant transaction tests.

## Outcome and work

Apply an entire structural recipe to private authoring state. Compile, derive cross-source/root/goal contracts, prepare/evaluate, validate/freeze the FINAL candidate, and accept once. Intermediate recipe states may be invalid. One complete candidate owner protects insert/remove/move/replace and requirement edits; no operation-specific live-cache or weaker validation shortcut.

Support coordinated leaf/goal updates, chain replacement/link rewiring, and root ownership changes in one recipe. Root source rebinding is structural; numeric root values remain B8/E3 edits. A batch making a rooted chain local and importing it may succeed only if its final complete candidate satisfies all affected consumers.

Stage timelines, descriptors, plugin state, handle changes, overlays, subscriptions, and binding transitions. Retire old resources only after accepted replacement. No arbitrary user/plugin callback in the no-fail pointer swap. Preserve existing one-flush observation behavior; notify after acceptance.

Recipe exception or compile/derive/evaluate/freeze failure discards staged work without changing active authoring, values, graph, outputs, handles, bindings, subscriptions, or committed FK state. Postcommit adapter/subscriber errors are reported delivery failures, not rejected edits or rollback claims.

## Evidence and finish

Run real public transaction tests: remove a leaf and update goal keys together; replace chain plus links; move root entry without changing pose; remove imported chain root while updating bindings; intermediate-invalid/final-valid batch succeeds; invalid final IDs/goals/root imports refuse; recipe exception cleans resources; injected late failure preserves outputs/cache; one accepted flush only.

Done when all structural verbs share the same atomic candidate boundary and no observer sees partial topology. Record actual test commands/results, observed notification counts, refusal evidence, and delivery-policy caveats. Next: E3.
