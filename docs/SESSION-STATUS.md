# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `docs/p0-06-trd-and-detailed-plan`
**Phase:** 0, requirements and plan detail
**Next action:** Review and merge the P0-06 documentation pull request after quality checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-03, P0-04, and P0-05 are merged on `main`. P0-05 added deterministic golden serialization, fresh schema/migration integration fixtures, and a required integration CI job. The runtime, graph, adapters, React package, benchmarks, and boundary scripts do not exist yet.

P0-06 is documentation only: a slice-level implementation plan, a normative technical requirements document, and ADR-014 through ADR-018. It asserts no runtime invariant and adds no executable evidence. The four product questions plus the deep-freezing policy are now closed.

## Landed on main

- Reproducible Node 24 install with committed lockfile and `npm ci` quality gate.
- Typed schema v5 contract and validator with deterministic diagnostics.
- Injectable Clock, Interpolator, and Scheduler ports plus deterministic fakes.
- Stable JSON-safe golden serializer and parser.
- Fresh v5 fixtures for minimal projects, perspective warnings, free tracks, cycles, and migration.
- Integration tests covering deterministic serialization, warning/error semantics, free-track acceptance, cycle rejection, and migration immutability.
- Required GitHub Actions integration job using the committed lockfile.

## Decisions closed by P0-06

- Qualified runtime ids stay internal; no schema v6 is planned to make them authorable (ADR-014).
- GSAP remains the supported v1 interpolator behind the port; no built-in sampler (ADR-015).
- Runtime diagnostics stay inline on patches and batch summaries; no separate stream (ADR-016).
- `@motion5/react` ships in the v1 package set and its gates are release-blocking (ADR-017).
- Published patches, batches, and nested values are deeply frozen in every v1 environment, with no production opt-out (ADR-018).

## Not landed yet

- P0-06 is not on `main` until its documentation PR is reviewed and merged.
- Full graph runtime and publication behavior remain unimplemented.
- Boundary, benchmark, build, and package-consumer jobs are planned, not live.

## Immediate queue

1. Review and merge the P0-06 documentation PR.
2. Start Phase 1 with P1-01 immutable value snapshots, then P1-03 Track leaf.
3. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

Against the implementation plan, the repository is correctly at the end of Phase 0: P0-01 through P0-05 are implemented, and P0-06 is documentation-only on this branch. No Phase 1 runtime slice has started. The main remaining audit issue is documentation synchronization: the plan still labels P0-05 as “In review” and must be updated before P0-06 is merged.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, exports, and tests move with the code they describe.
