# ADR-036: the declared entrypoints are the public surface

**Status:** accepted

**Date:** 2026-08-18

## Context

Writing the user guide surfaced a gap between what the repository imports and what the package declares. `packages/core/package.json` declared three entries: `.`, `./internal`, and `./adapters`. Meanwhile `apps/react-demo` imports `@motion5/core/adapters/browser-clock`, `@motion5/core/plugins/fk`, `@motion5/core/plugins/transform`, and `@motion5/core/ports/fakes`.

Those imports resolve today only because both Vite configs alias `@motion5/core` to `packages/core/src`, which bypasses the `exports` map entirely. A published install would fail on all four with `ERR_PACKAGE_PATH_NOT_EXPORTED`, and the demo is supposed to consume the package the way a user does.

That left the documentation with no honest option. Documenting the paths as public would describe a resolution that only a workspace checkout provides. Documenting only the three declared entries would leave plugins unreachable, and a runtime whose plugins are unreachable cannot animate anything: every authored keyframe key must be claimed by a registered plugin, so `transformPlugin` is not a convenience, it is a requirement for an `x` track.

## Decision

The `exports` map is the public surface, and it now declares every path the repository actually consumes. Four entries are added, each named explicitly rather than through a wildcard, so adding a file never silently adds public API:

- `./adapters/browser-clock`, already reachable through the `./adapters` barrel and now also by the direct path the demo uses;
- `./plugins/transform` and `./plugins/fk`, because plugin registration is required for any authored track;
- `./ports/fakes`, as supported test support for consumers and examples, not for production rendering.

Nothing is added to `packages/core/src/index.ts`, so the boundary scanner's allow-list is unchanged and the graph and runtime layers stay unreachable from the entry declaration closure.

## Alternatives rejected

**A wildcard such as `./adapters/*`.** One line covers every current import, and every future file in that directory becomes public without anyone deciding it should be. The allow-list in `scripts/boundary-scan.mjs` exists because this project prefers enumeration to convenience.

**Re-exporting plugins and fakes from `.`.** It needs no new entry, but it puts test doubles in the main entrypoint and grows the one allow-list that governs the primary surface.

**Changing the demo's imports instead.** `createBrowserClock` would move cleanly to the `./adapters` barrel, but the plugins and the fakes have no declared home to move to, so this fixes one of four imports and leaves the documentation with the same problem.

**Documenting the source paths as public.** Rejected because it is false for any consumer who installs the package.

## Consequences

The guide can name every import it shows, and the demo's imports are honest rather than accidentally working. The four new paths resolve to `./dist/...`, so they require the declaration build that `tsconfig.build.json` already emits for the whole `src` tree.

This is a public surface widening and it is deliberately small. Removing one of these entries later is a breaking change to whoever adopted it, which is exactly why they are enumerated and why `./ports/fakes` is documented as test support rather than as runtime API.

Three gaps found alongside this one are recorded in the guide rather than fixed here, because each needs its own decision: no `Scheduler` implementation ships, the `Clock` and `Scheduler` port types are not exported even though their assertions are, and neither package is published.

## Evidence

No behavior changes, so no behavioral test changes. `packages/core/test/unit/scripts/public-declaration-surface.test.ts` scans the declaration closure of `src/index.ts`, which this record does not touch, and `packages/core/test/unit/scripts/governance-gates.test.ts` asserts the `.` entry still points at `./dist/index.d.ts` and `./dist/index.js`. Both stay green without being edited, which is the point: the primary surface is unchanged and only additional paths are declared.
