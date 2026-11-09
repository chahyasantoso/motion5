# ADR-036: the declared entrypoints are the public surface

**Superseded in part by ADR-133, 2026-10-04.**

**Status:** accepted

**Date:** 2026-08-18

## Context

User guide surfaced gap: repository imports ≠ package declaration. `packages/core/package.json` declared three entries: `.`, `./internal`, `./adapters`. `apps/react-demo` imports `@motion5/core/adapters/browser-clock`, `@motion5/core/plugins/fk`, `@motion5/core/plugins/transform`, `@motion5/core/ports/fakes`.

Both Vite configs alias `@motion5/core` → `packages/core/src`, bypassing `exports`; published install fails all four with `ERR_PACKAGE_PATH_NOT_EXPORTED`. Demo should consume package as user does.

Docs left no honest option: public paths describe workspace-only resolution; three declared entries leave plugins unreachable; unreachable plugins animate nothing -- every authored keyframe key needs registered plugin → `transformPlugin` required for `x` track, not convenience.

## Decision

`exports` map is public surface, declares every consumed path. Four explicit entries, no wildcard → new file never silently public:

- `./adapters/browser-clock`, via `./adapters` barrel, now also direct demo path;
- `./plugins/transform` and `./plugins/fk`, plugin registration required for any authored track;
- `./ports/fakes`, supported test support for consumers and examples, not production rendering.

Nothing added to `packages/core/src/index.ts` → scanner allow-list unchanged; graph and runtime layers unreachable from entry declaration closure.

## Alternatives rejected

**A wildcard such as `./adapters/*`.** One line covers every current import; every future directory file becomes public undecided. `scripts/boundary-scan.mjs` allow-list exists: enumeration over convenience.

**Re-exporting plugins and fakes from `.`.** No new entry, but test doubles in main entrypoint; grows allow-list governing primary surface.

**Changing the demo's imports instead.** `createBrowserClock` moves cleanly to `./adapters` barrel; plugins and fakes have no declared home. Fixes one of four imports; docs problem remains.

**Documenting source paths as public.** False for any consumer installing package.

## Consequences

Guide names every import it shows; demo imports honest, not accidental. Four new paths resolve to `./dist/...` → need declaration build `tsconfig.build.json` already emits for `src` tree.

Public surface widening, deliberately small. Removing one entry later breaks adopters -- why enumerated, why `./ports/fakes` documented as test support, not runtime API.

Three gaps found alongside, recorded in guide, not fixed here, each needs own decision: no `Scheduler` implementation ships; `Clock` and `Scheduler` port types unexported though their assertions are; neither package published.

## Evidence

No behavior changes → no behavioral test changes. `packages/core/test/unit/scripts/public-declaration-surface.test.ts` scans declaration closure of `src/index.ts`, untouched here; `packages/core/test/unit/scripts/governance-gates.test.ts` asserts `.` entry still points at `./dist/index.d.ts` and `./dist/index.js`. Both green unedited: primary surface unchanged; only additional paths declared.
