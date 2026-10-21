# C1 — Introduce narrow generic structural derivation

Status: not implemented. Depends on: B2, B5, B7, A1, A6.

## Start here

Read `00-overview.md`, A6's protocol, `packages/core/src/domain/plugins.ts`, `packages/core/src/graph/ir.ts`, `packages/core/src/contract/schema-transaction.ts`, and `packages/core/src/runtime/project-runtime.ts`. Inspect candidate construction before adding hooks.

## Outcome and work

Add a generic derivation capability that produces immutable descriptors/diagnostics from validated structural declarations. A plugin collection hook runs once per candidate structural revision with its participating entries, not once per instance/tick. It may inspect an explicit read-only own-track entry/operation inventory for semantic composition checks and descriptors of explicitly bound dependency sources. It cannot read live values/poses, sibling runtime output, undeclared sources, or engine services.

Reuse the existing graph dependency order and cycle diagnostics. No second metadata scheduler or registry-iteration dependency. Local inventory is structural data, not ordered runtime sibling execution. Descriptor/capability tokens and source locators are validated and owned unambiguously; core transports their payload opaquely without names like root/point/join/targets.

Only declared structural inputs affect invalidation. Entry identity/order/add/remove/plugin replacement, binding/dict-key changes, and upstream descriptor revisions rederive. A constant numeric length or animated root frame is NOT topology. Binding provenance can change independently of numeric equality. Source capability admission is explicit; output names/lookalike arrays are insufficient.

Keep descriptor construction staged until candidate acceptance. Numeric edits/ticks do not rebuild layouts. Initial implementation may rederive all descriptors on structural replacement; do not optimize reuse or migrate private caches yet.

## Evidence and finish

Run tests with a toy non-skeleton capability and consumer: deterministic repeated derivation, declared cross-source dependencies, local inventory check, missing/ambiguous capability, undeclared read refusal, cycle propagation, numeric edit no rederivation, binding change rederivation, failure leaves active descriptors/state untouched. Count derivation calls per structural version.

Done when plugins can implement root-aware skeleton constraints without a core import/name switch or live-data topology reconstruction. Record actual API paths, capability ownership, tests/results, and limitations. Next: C2.
