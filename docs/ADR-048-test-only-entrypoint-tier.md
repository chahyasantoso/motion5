# ADR-048: test support is a declared tier, and no consumer may import it

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#167](https://github.com/chahyasantoso/motion5/issues/167)

This record amends ADR-036 by adding a tier to the declared entrypoints. ADR-036 itself is not edited: it records the decision that was correct when it was made, and this record supersedes its `./ports/fakes` clause.

## Context

`packages/core/src/ports/fakes.ts` is test support. Its own doc comments describe fakes that tests instantiate, and every consumer of it in this repository is a test. ADR-036 nonetheless declared it as `./ports/fakes`, an ordinary subpath sitting at the same tier as `./adapters/browser-clock` and `./plugins/fk`, and documented it as test support in prose alone.

So the demo mistake behind #164 was not a reach into forbidden internals. It picked something that looked exactly as legitimate as the real thing, because structurally it was: nothing in the export surface distinguished test support from a production adapter, and nothing mechanical objected.

The issue is right about that, and it stops one step short of the reason. `scripts/boundary-scan.mjs` discovered consumers like this:

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

**The scan never walked `apps/`.** It covered `packages/core/src/{contract,domain,graph,runtime,ports}`, the core root entries, `packages/*/src` for non-core packages, and the `index.ts` export allow list. `apps/react-demo`, the workspace that made the #164 mistake, was invisible to every gate in that file.

Both halves therefore had to land together. Fixing only the subpath leaves a future demo importing `@motion5/core/testing` with equal confidence and equal silence.

## Decision

One module, one door, one tier, and a gate that can see every workspace.

`src/ports/fakes.ts` moves to `src/testing/fakes.ts` and is declared once, as `./testing`, last in the export map after the production adapters and plugins. `./ports/fakes` is deleted.

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

Four things about that shape are deliberate.

**No barrel beside the module.** A `src/testing/index.ts` re-exporting `fakes.ts` would be two reachable spellings from inside the package for one module. `docs/ARCHITECTURE.md` and TR-A-08 are both about single ownership, so the module is mapped once and named directly.

**No shim at the old path.** A `src/ports/fakes.ts` that re-exported from the new location is a facade; `bannedSymbol()` in the boundary scan literally matches `/facade/i` and TR-A-08 forbids it by name. Breaking is correct here because every consumer is in this repository, so there is no external caller a shim would serve.

**`testing` joins `coreLayers`.** Moving the file out of `ports/` would otherwise remove it from the renderer-import and banned-symbol checks, and no existing test would have noticed. A fix that quietly reduces coverage is worse than the defect it closes.

**The gate reads its workspace roots from the root manifest.** `discoverConsumerPackages` becomes `discoverConsumerWorkspaces`, taking the globs from the `workspaces` array in the root `package.json` rather than naming `packages` and `apps` in the scan. A third workspace glob added later is scanned without editing this file, and there is one declaration of what a workspace is, where it already lives. Both consumer predicates, `importsCoreInternals` and the new `importsTestingEntrypoint`, run over every discovered workspace.

```js
export function importsTestingEntrypoint(source) {
  return /(?:from|import)\s*["'](?:@motion5\/core\/testing|[^"']*core\/src\/testing)(?:["'/]|$)/.test(
    source,
  );
}
```

The scan is an `.mjs` module with a hand-written `scripts/boundary-scan.d.mts` beside it, so a new export is named in both. That declaration file is the surface `W-1` reports against under `typecheck`, and it is the reason a red `boundaries` job and a red `quality` job are two different pieces of evidence about the same missing function rather than one.

A scan root with no manifest is refused rather than treated as an empty workspace list. A discovery step that quietly walks nothing reports a clean boundary for a workspace it never opened, which is the exact failure being removed.

Documentation states the tier rather than implying it. `docs/guide/api-reference.md` gains an entrypoint tier table, because the second acceptance criterion of the issue is that the public surface distinguishes test-only entrypoints from production adapters and plugins. A table is how that becomes checkable by a human reader and the scan is how it becomes checkable by CI. Both are required; neither substitutes for the other.

## Alternatives rejected

**Keep `./ports/fakes` and document it as test-only.** That is what ADR-036 already did, and #164 is the result. Prose is not a gate, and TR-T-05 says a mechanical boundary needs a mechanical check.

**Leave a re-export shim at the old path.** Covered above: it is the second door TR-A-08 bans, and `bannedSymbol()` would reject the word anyway.

**Publish the fakes as a separate `@motion5/testing` package.** It duplicates a version and a build pipeline for one 5 KB module, and the port contracts the fakes double live in core. The tier is the thing that needed to exist, not another package.

**Fix the subpath and not the scan.** Rejected in the context section. The subpath was the symptom the issue saw; the unscanned workspace is why the symptom mattered.

## Consequences

The public surface loses one declared subpath and gains one. Both are breaking for anyone who adopted `./ports/fakes`, which is nobody: the package is private at `0.0.0` and every importer is in this repository. Forty-seven test files change one import specifier each, and `npm run typecheck` is what proves that set complete, since a missed file cannot resolve.

The boundary scan gains coverage in three directions at once: a new violation class, a new core layer, and a whole workspace root it had never opened. `apps/*/src` reaches into no core internals today, so the widened gate lands with no pre-existing violation and no exemption. Only `apps/react-demo/vite.config.ts` names `packages/core/src`, and it is a bundler alias outside `src/`.

TR-P-05 of `docs/TRD.md` says every port ships a fake and the fake is the implementation the core suite uses. That stays true: the fake still ships in the package and the contract suite in `packages/core/test/contract/ports.test.ts` still runs against it, per TR-P-06. Only the subpath changed, so **no TRD edit is needed**. That is a finding, not an omission.

`packages/core/test/unit/scripts/governance-gates.test.ts` asserts the `.` entry, and `public-declaration-surface.test.ts` walks the `index.ts` declaration closure. The fakes are absent from `src/index.ts`, which is why the subpath was their only door in the first place, so neither gate needed an edit and both stay green unmodified.

Evidence ids gain the `W-` series, and `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens its title pattern to admit it. A citation the gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/scripts/boundary-scan.test.ts`, built against synthetic trees in temp directories rather than against the real repository, so each case proves the gate can fail rather than observing that today it does not. TR-T-05 requires a planted-violation fixture for every mechanical gate.

- `W-1` the predicate names `@motion5/core/testing` and a relative `core/src/testing` path, and does not name `@motion5/core`, `/plugins/fk`, or `/adapters/browser-clock`.
- `W-2` the scan reports an app that imports the test-only entrypoint.
- `W-3` the scan reports an app that reaches into core source. This is #164's actual mistake, finally visible to a gate.
- `W-4` the scan reports a renderer import inside the core testing layer, which is the `coreLayers` guard.
- `W-5` the export map declares `./testing` and does not declare `./ports/fakes`. The one case that legitimately asserts on file content rather than behavior, because the export map is the artifact under test.
- `W-6` the real repository has no violation mentioning `testing`. The regression guard, and the only case allowed to read the real tree.
- `W-7` the workspace roots come from the root manifest: a tree declaring `packages/*` only does not report the app that a tree declaring `apps/*` too does report, and a tree with no manifest is refused rather than scanned as empty.

Red before green is executed and archived rather than described. The `test(boundaries)` commit at the base of pull request [#188](https://github.com/chahyasantoso/motion5/pull/188) carries the `W-` evidence alone, against unmodified sources. Run [32568986919](https://github.com/chahyasantoso/motion5/actions/runs/32568986919), archived at `logs/32568986919/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck` with `TS2305: Module '"../../../../../scripts/boundary-scan.mjs"' has no exported member 'importsTestingEntrypoint'`. `boundaries` reports `6 failed | 12 passed`: `W-1` as `TypeError: importsTestingEntrypoint is not a function`, `W-2` and `W-3` as `expected [] to include 'apps/demo/src/main.ts: ...'`, `W-4` as the same empty list for the unscanned testing layer, `W-5` as `expected [ '.', './internal', …(5) ] to include './testing'`, and `W-7` on manifest-driven discovery.

Those two empty violation lists are the defect stated as an assertion. The scan did not disagree with the planted app; it never opened the directory it was in.

`W-6` passed on that run, as the regression guard must. `integration`, `build`, `end-to-end` and `performance` were all green, so the red is assertion-level rather than infrastructure-level, which is the distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.
