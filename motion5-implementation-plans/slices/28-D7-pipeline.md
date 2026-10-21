# D7 — Verify the explicit producer/root/solve/pose pipeline

Status: not implemented. Depends on: D2, D4, D5, D6, C7.

## Start here

Read `00-overview.md`, `42-cache-contract.md`, A4 fixtures and final plugin/requirement/runtime types. Follow existing runtime fixture conventions. Use the real new-contract plugin registrations, not fake solver output except in separately labelled validation tests.

## Outcome and work

Build the full point-chain/join-source/root-frame/target-frame/IK/FK graph with explicit cross-track references. Exercise FK-only chain and joined-source paths, a root-only FK source, and mandatory independent goal tracks. Root anywhere in source authoring must work; first JOIN determines topology root; imported chains cannot carry root entries.

Prove root changes reach IK/FK through the same canonical source; first tip is anchored exactly once; solved rotations are local; FK maps all point IDs to tip frames. C4 validates solver provenance rather than accepting equal-looking maps. Repeated entries retain generic ordered-delta semantics, not implicit per-solve namespaces. Same-track reads do not become a hidden compose pipeline.

Run the same graph/seek/edit sequences with default bounded, no-cache and an alternative provider selected at runtime construction. Verify there is no separate registration or authored cache option. A toy non-kinematic stateful plugin must also use the same services/types, proving the port is generic. Per-point FK and whole-solve IK call-count expectations apply only after confirming evaluator dispatch, effective inputs and transaction success.

## Evidence and finish

Compare full rotations/inspection/poses across cold/warm/disabled/evicted histories using deterministic exact-result checks and independent geometry tolerances as appropriate. Include local leaf edits, coupled goal edits, root motion, new equal records, inspection toggles, provider isolation, invalid coverage/provenance, blocked/error goals, overflow rejection and late failure/retry. Test rebind/remove/reinsert and disposal, including same IDs across two rigs.

Verify core source/boundary tests contain no FK/IK/cache-key/slot-name special cases and pure solver/frame modules have no provider import. Run focused actual pipeline and phase-D gates; report commands/results, numerical tolerances, solver/key audit and limits. Done when the explicit graph and both generic-provider-backed caches work together without renderer dependencies or hidden state. Phase D does not establish end-to-end performance or release. Next: E1.
