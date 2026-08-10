# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `main`
**Phase:** 0, contract baseline
**Next action:** P0-02, generate the lockfile on a Node/npm environment, then switch CI to `npm ci` with caching.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

The repository now has an executable v5 contract surface and a fresh migration suite. The runtime, full validator, graph, ports, adapters, React package, benchmarks, and boundary scripts do not exist yet.

## Landed

- Authored schema v5 docs with `perspective`, `freeTracks`, qualified ids, and diagnostic severity.
- Pure `migrateV4ToV5` implementation that does not mutate input and rejects ambiguous source shapes.
- Fresh migration tests covering rename scope, immutability, v5 rejection, dual-field ambiguity, malformed input, and perspective preservation.
- Public contract constants and TypeScript types.
- Expanded documentation set and manual-only formatting workflow.

## Not landed

- No lockfile or npm cache gate. The generation environment used for this session has no npm executable, so the lockfile was not fabricated.
- No full v5 validator, runtime, ports, graph, adapters, React package, benchmarks, or boundary scanner.

## Immediate queue

1. **P0-02:** generate `package-lock.json` with Node 24/npm, switch CI install to `npm ci`, enable `actions/setup-node` npm caching, and run the full check.
2. **P0-03:** complete schema validation and diagnostic aggregation around the contract types.
3. **P0-04:** implement Clock, Interpolator, Scheduler ports and fakes.
4. **P0-05:** add golden fixture serialization and integration CI.
