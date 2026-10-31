# ADR-048: test support is a declared tier, and no consumer may import it

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#167](https://github.com/chahyasantoso/motion5/issues/167)

This record amends ADR-036 by adding tier to declared entrypoints. ADR-036 not edited: records decision correct when made; this record supersedes its `./ports/fakes` clause.

## Context

`packages/core/src/ports/fakes.ts` is test support. Own doc comments describe fakes tests instantiate; every consumer here is a test. ADR-036 still declared it `./ports/fakes`, ordinary subpath at same tier as `./adapters/browser-clock` and `./plugins/fk`, documented as test support in prose alone.

Demo mistake behind #164 was not reach into forbidden internals. It picked something looking exactly as legitimate as real thing, because structurally it was: nothing in export surface distinguished test support from production adapter, nothing mechanical objected.

Issue right about that, stops one step short of reason. `scripts/boundary-scan.mjs` discovered consumers like this:

```js
async function discoverConsumerPackages(scanRoot) {
  let entries;
  try {
    entries = await readdir(join(scanRoot, "packages"), { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== "core")
    .map((entry) => entry.name);
}
```

**The scan never walked `apps/`.** Covered `packages/core/src/{contract,domain,graph,runtime,ports}`, core root entries, `packages/*/src` for non-core packages, `index.ts` export allow list. `apps/react-demo`, workspace that made #164 mistake, invisible to every gate in that file.

Both halves had to land together. Fixing only subpath leaves future demo importing `@motion5/core/testing` with equal confidence and silence.

## Decision

One module, one door, one tier, and a gate that can see every workspace.

`src/ports/fakes.ts` moves to `src/testing/fakes.ts`, declared once as `./testing`, last in export map after production adapters and plugins. `./ports/fakes` deleted.

```json
{
  "exports": {
    "./plugins/fk": {
      "types": "./dist/plugins/fk.d.ts",
      "default": "./dist/plugins/fk.js"
    },
    "./testing": {
      "types": "./dist/testing/fakes.d.ts",
      "default": "./dist/testing/fakes.js"
    }
  }
}
```

Four things deliberate.

**No barrel beside the module.** A `src/testing/index.ts` re-exporting `fakes.ts` would be two reachable spellings inside package for one module. `docs/ARCHITECTURE.md` and TR-A-08 both about single ownership → module mapped once, named directly.

**No shim at the old path.** `src/ports/fakes.ts` re-exporting from new location = facade; `bannedSymbol()` in boundary scan literally matches `/facade/i`, TR-A-08 forbids it by name. Breaking correct: every consumer in this repository → no external caller shim would serve.

**`testing` joins `coreLayers`.** Moving file out of `ports/` would otherwise remove it from renderer-import and banned-symbol checks; no existing test would notice. Fix that quietly reduces coverage worse than defect it closes.

**The gate reads its workspace roots from the root manifest.** `discoverConsumerPackages` becomes `discoverConsumerWorkspaces`, taking globs from `workspaces` array in root `package.json`, not naming `packages` and `apps` in scan. Third workspace glob added later scanned without editing this file; one declaration of what a workspace is, where it already lives. Both consumer predicates, `importsCoreInternals` and new `importsTestingEntrypoint`, run over every discovered workspace.

```js
export function importsTestingEntrypoint(source) {
  return /(?:from|import)\s*["'](?:@motion5\/core\/testing|[^"']*core\/src\/testing)(?:["'/]|$)/.test(
    source,
  );
}
```

Scan is `.mjs` module with hand-written `scripts/boundary-scan.d.mts` beside it → new export named in both. That declaration file is surface `W-1` reports against under `typecheck`, and why red `boundaries` job and red `quality` job are two pieces of evidence about same missing function, not one.

Scan root with no manifest refused, not treated as empty workspace list. Discovery step quietly walking nothing reports clean boundary for workspace it never opened — exact failure being removed.

Documentation states tier, not implies it. `docs/guide/api-reference.md` gains entrypoint tier table: second acceptance criterion of issue is public surface distinguishes test-only entrypoints from production adapters and plugins. Table makes it checkable by human reader, scan makes it checkable by CI. Both required; neither substitutes for other.

## Alternatives rejected

**Keep `./ports/fakes` and document it as test-only.** What ADR-036 already did; #164 result. Prose not a gate; TR-T-05 says mechanical boundary needs mechanical check.

**Leave a re-export shim at the old path.** Covered above: second door TR-A-08 bans; `bannedSymbol()` would reject the word anyway.

**Publish the fakes as a separate `@motion5/testing` package.** Duplicates version and build pipeline for one 5 KB module; port contracts fakes double live in core. Tier was thing that needed to exist, not another package.

**Fix the subpath and not the scan.** Rejected in context section. Subpath was symptom issue saw; unscanned workspace is why symptom mattered.

## Consequences

Public surface loses one declared subpath, gains one. Both breaking for anyone who adopted `./ports/fakes` — nobody: package private at `0.0.0`, every importer in this repository. Forty-seven test files change one import specifier each; `npm run typecheck` proves set complete, since missed file cannot resolve.

Boundary scan gains coverage in three directions at once: new violation class, new core layer, whole workspace root never opened. `apps/*/src` reaches into no core internals today → widened gate lands with no pre-existing violation, no exemption. Only `apps/react-demo/vite.config.ts` names `packages/core/src`; bundler alias outside `src/`.

TR-P-05 of `docs/TRD.md` says every port ships a fake, fake is implementation core suite uses. Stays true: fake still ships in package, contract suite in `packages/core/test/contract/ports.test.ts` still runs against it, per TR-P-06. Only subpath changed → **no TRD edit is needed**. Finding, not omission.

`packages/core/test/unit/scripts/governance-gates.test.ts` asserts `.` entry; `public-declaration-surface.test.ts` walks `index.ts` declaration closure. Fakes absent from `src/index.ts` — why subpath was their only door — so neither gate needed edit; both stay green unmodified.

Evidence ids gain `W-` series; `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens title pattern to admit it. Citation gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/scripts/boundary-scan.test.ts`, built against synthetic trees in temp directories, not real repository → each case proves gate can fail, not observes today it does not. TR-T-05 requires planted-violation fixture for every mechanical gate.

- `W-1` predicate names `@motion5/core/testing` and relative `core/src/testing` path, does not name `@motion5/core`, `/plugins/fk`, or `/adapters/browser-clock`.
- `W-2` scan reports app importing test-only entrypoint.
- `W-3` scan reports app reaching into core source. #164's actual mistake, finally visible to gate.
- `W-4` scan reports renderer import inside core testing layer — `coreLayers` guard.
- `W-5` export map declares `./testing`, not `./ports/fakes`. One case legitimately asserting on file content, not behavior, because export map is artifact under test.
- `W-6` real repository has no violation mentioning `testing`. Regression guard, only case allowed to read real tree.
- `W-7` workspace roots come from root manifest: tree declaring `packages/*` only does not report app that tree declaring `apps/*` too does report; tree with no manifest refused, not scanned as empty.

Red before green executed and archived, not described. `test(boundaries)` commit at base of pull request [#188](https://github.com/chahyasantoso/motion5/pull/188) carries `W-` evidence alone, against unmodified sources. Run [32568986919](https://github.com/chahyasantoso/motion5/actions/runs/32568986919), archived at `logs/32568986919/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck` with `TS2305: Module '"../../../../../scripts/boundary-scan.mjs"' has no exported member 'importsTestingEntrypoint'`. `boundaries` reports `6 failed | 12 passed`: `W-1` as `TypeError: importsTestingEntrypoint is not a function`, `W-2` and `W-3` as `expected [] to include 'apps/demo/src/main.ts: ...'`, `W-4` as same empty list for unscanned testing layer, `W-5` as `expected [ '.', './internal', …(5) ] to include './testing'`, `W-7` on manifest-driven discovery.

Those two empty violation lists are defect stated as assertion. Scan did not disagree with planted app; it never opened directory it was in.

`W-6` passed on that run, as regression guard must. `integration`, `build`, `end-to-end` and `performance` all green → red is assertion-level, not infrastructure-level — distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.
