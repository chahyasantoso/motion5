# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `main`
**Phase:** 0, baseline
**Next action:** P0-02, commit the lockfile and switch CI to `npm ci` with caching.

This is the only status file in the repository. If it is out of date, that is a defect, not an inconvenience.

## Where things actually are

The repository exists and contains its charter. There is no runtime. There is one placeholder module and one smoke test, present so the toolchain is exercised by something real rather than configured against nothing.

What has landed:

- Charter and contracts: [PRD.md](./PRD.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md), [DECISIONS.md](./DECISIONS.md) with ADR-001 through ADR-009.
- Delivery process: [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) with seven phases and their exit gates, [PR-WORKFLOW.md](./PR-WORKFLOW.md), [CI-WORKFLOW.md](./CI-WORKFLOW.md), [TESTING-STRATEGY.md](./TESTING-STRATEGY.md), [FORMATTING.md](./FORMATTING.md).
- Automation: `ci.yml` with the `quality` job, `format.yml` dispatched manually only, pull request template.
- Toolchain: Node 24, ESM, TypeScript strict, Vitest, Prettier.

What has not landed, and is not pretending to have landed:

- No lockfile. CI installs with `npm install` and dependency caching is off, because `actions/setup-node` caching requires one. P0-02 fixes both.
- No `integration`, `boundaries`, `performance`, `build`, or `package` job. Each lands with the phase that gives it something to verify. The schedule is in [CI-WORKFLOW.md](./CI-WORKFLOW.md).
- No core package beyond the placeholder. No ports, no graph, no runtime, no adapters, no React package, no benchmarks, no scripts.

## Immediate queue

1. **P0-02** lockfile, `npm ci`, caching on. Removes the conditional install from `ci.yml`.
2. **P0-03** `packages/core` skeleton: contract layer, diagnostic type, allow-listed export map, `internal.ts`, Vitest unit and integration projects.
3. **P0-04** port interfaces and fakes, plus the contract test harness that fakes and future adapters both run.
4. **P0-05** golden fixture format and the `integration` CI job.

Phase 0 exits when the core package builds and tests with no animation engine present, contracts are typed, and fixtures reproduce byte for byte across two machines.

## Open decisions

Tracked as open questions in [PRD.md](./PRD.md) section 12, repeated here so nobody has to go looking:

- **Q1** Stay on authored schema version 4 permanently, or introduce version 5 with qualified ids as authored syntax. Current position: stay on 4. Revisit before v1.
- **Q2** Reference interpolator: GSAP adapter, or a built-in sampler with GSAP optional. Current position: GSAP first. Decide at Phase 4.
- **Q3** Diagnostics inline on patches, or a separate stream. Current position: inline, with a batch-level summary. Decide at P3-03.
- **Q4** Is `packages/react` in v1. Current position: yes, minimal surface.

## Guardrails carried into every session

- One authority per state transition. A second way to do an existing thing is a rejection, not a discussion.
- Nothing is copied from the reference repository. Intent may be reproduced; files may not.
- No capability or rollout flags in shipped code.
- No CI job that does not check something real, and no claim of enforcement without a job that runs.
- Formatting never rides along with behavior.
- Docs, types, and exports move in the same pull request as the code they describe.

## Handoff

Read [ARCHITECTURE.md](./ARCHITECTURE.md) sections 1 through 4 first, then the Phase 0 block of [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md), then start P0-02. Everything else can wait until you need it.

The single most likely way this project fails is the way the last one did: a reasonable local decision that gives one responsibility two owners. When in doubt, ask which single object owns the transition, and write that down before writing code.
