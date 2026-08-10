# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `main`
**Phase:** 0, contract baseline
**Next action:** P0-03, complete the v5 schema validator and diagnostic aggregation.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

The repository has an executable v5 contract surface, a pure migration helper with fresh tests, a committed npm lockfile, and CI using Node 24 with `npm ci` and npm caching. The full validator, graph, ports, adapters, React package, benchmarks, and boundary scripts do not exist yet.

## Landed

- Authored schema v5 docs with `perspective`, `freeTracks`, qualified ids, and diagnostic severity.
- Pure `migrateV4ToV5` implementation that does not mutate input and rejects ambiguous source shapes.
- Fresh migration tests covering rename scope, immutability, v5 rejection, dual-field ambiguity, malformed input, and perspective preservation.
- Public contract constants and TypeScript types.
- Committed `package-lock.json` generated with Node 24/npm.
- CI quality job uses `npm ci --ignore-scripts --no-audit --no-fund` and `actions/setup-node` npm caching.
- Expanded documentation set and manual-only formatting workflow.

## Not landed

- No full v5 validator or diagnostic aggregation beyond migration diagnostics.
- No migration validation for reserved ids and reference qualification yet.
- No Clock, Interpolator, or Scheduler ports and fakes.
- No graph kernel, runtime, publisher, adapters, React package, benchmarks, or boundary scanner.

## Immediate queue

1. **P0-03:** implement v5 schema validation and diagnostic aggregation: schema version, ids, triggers, perspective, freeTracks, observations, duplicates, and cycles.
2. **P0-04:** implement Clock, Interpolator, Scheduler ports and fakes.
3. **P0-05:** add golden fixture serialization and integration CI.
4. **P1-01:** begin immutable values and the Track leaf.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, exports, and tests move with the code they describe.
