# F1 — Rewrite maintained callers, fixtures, and generators

Status: not implemented. Depends on: B1–B8, C1–C7, D1–D7, E1–E7; A5 inventory.

## Start here

Read `00-overview.md`, the deletion/consumer inventory, final public authoring/entry/adapter types, and search-derived maintained callers in `apps`, `packages`, and `docs`. Read only matched producers/consumers; no historical-plan reload or full-repository transcript dump.

## Outcome and work

Rewrite maintained inputs directly to singleton-map arrays with IDs for every entry and explicit collect/fold definitions. Update transforms/root/IK/FK as well as repeated points/joins. Public writes are entry-nested; content edits use handles; skeleton root lives on source; imported chains stay local/rootless. Update free-track qualification and entry-specific requirements rather than translating them heuristically.

Classify existing tests by invariant before editing: keep generic transaction/subscription/interpolation/math guarantees; rewrite supported behavior; remove retired-contract-only assertions with an explicit reason. Test helpers must not hide a converter or old parser. No golden retired patch parity requirement or runtime migration path.

Audit all authored generators and serialized fixtures, including demo/playground/UI editing, package test utilities, exported helpers, pose tooling, and docs examples. Retire/defer incompatible 3D skeleton features and update dependent imports/tests/docs coherently. Independent transforms/drivers/pose aggregation stay only where compatible; do not silently redefine their payloads.

Smoke-validate every retained generator's output through the actual public parser/loader. Runnable docs should exercise root plugin positioning, no-root origin, FK-only and joined IK/FK, value edits, and explicit pose binding. Avoid adding wrappers to keep obsolete snapshots loadable.

## Evidence and finish

Run scoped parser/example/app/consumer smoke tests and typechecks. Record the actual searched locations, rewritten producer list, test deletions and contract reasons, supported/deferred features, and commands/results. Known remaining legacy references go into F2's concrete worklist, not “cleanup later.”

Done when maintained repository callers express only supported hybrid behavior and remaining references are classified. This is not final release verification; F6 runs the exact final candidate. Next: F2.
