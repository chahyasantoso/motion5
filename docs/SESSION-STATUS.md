# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `main`
**Phase:** 0, contract baseline
**Next action:** Run CI for P0-03, then start P0-04 ports and fakes.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

The repository has an executable v5 contract surface, a pure migration helper with fresh tests, a committed npm lockfile, CI using Node 24 with `npm ci` and npm caching, and an initial v5 validator with contract tests. P0-03 is implemented but its GitHub Actions run is the acceptance gate. The graph, ports, adapters, React package, benchmarks, and boundary scripts do not exist yet.

## Landed

- Authored schema v5 docs with `perspective`, `freeTracks`, qualified ids, and diagnostic severity.
- Pure `migrateV4ToV5` implementation and fresh migration tests.
- Typed contract constants and schema types.
- Initial `validateV5` validator and tests for schema version, perspective, ids, triggers, free tracks, observations, and cycles.
- Committed `package-lock.json` generated with Node 24/npm.
- CI quality job uses `npm ci --ignore-scripts --no-audit --no-fund` and npm caching.
- Expanded documentation set and manual-only formatting workflow.

## Not landed

- CI acceptance for the new validator is pending.
- Full diagnostic aggregation and cross-motion qualified-id normalization remain to be hardened.
- No Clock, Interpolator, or Scheduler ports and fakes.
- No graph kernel, runtime, publisher, adapters, React package, benchmarks, or boundary scanner.

## Immediate queue

1. **P0-03 acceptance:** inspect the GitHub Actions quality run and fix any format/type/test failures.
2. **P0-04:** implement Clock, Interpolator, Scheduler ports and fakes.
3. **P0-05:** add golden fixture serialization and integration CI.
4. **P1-01:** begin immutable values and the Track leaf.
