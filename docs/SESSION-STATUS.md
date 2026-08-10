# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `main`
**Phase:** 0, baseline
**Next action:** P0-02, commit the lockfile and switch CI to `npm ci` with caching.

This is the only status file in the repository. If it is out of date, that is a defect.

## Where things actually are

The repository contains its charter and the v5 authored contract. There is no runtime. One placeholder module and one smoke test exercise the toolchain.

What has landed:

- Schema v5 contract: [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md), explicit [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md), and ADR-011.
- Product and architecture docs: [PRD.md](./PRD.md), [ARCHITECTURE.md](./ARCHITECTURE.md).
- Delivery process and automation: implementation plan, PR workflow, CI workflow, manual formatting workflow, testing strategy.
- Toolchain: Node 24, ESM, TypeScript strict, Vitest, Prettier.

What has not landed:

- No lockfile. CI installs with `npm install` and caching is off. P0-02 fixes both.
- No runtime, ports, graph, adapters, React package, benchmarks, or boundary scripts.
- No validator implementation yet. The v5 schema and migration are documented contracts, not shipped behavior.

## Immediate queue

1. **P0-02** lockfile, `npm ci`, caching on.
2. **P0-03** contract layer, including `AUTHORED_SCHEMA_VERSION = 5`, diagnostic severity, v5 validation, and the explicit v4 migration diagnostic.
3. **P0-04** port interfaces and fakes.
4. **P0-05** golden fixtures, including v5 projects with perspective and freeTracks, v4 rejection, and migration output.

## Guardrails

- One authority per state transition.
- Nothing is copied from the reference repository.
- No capability, rollout, or schema-version aliases in shipped code.
- No claim of enforcement without a CI job that runs.
- Formatting never rides along with behavior.
- Docs, types, exports, and tests move with the code they describe.
