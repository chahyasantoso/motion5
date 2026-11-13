# Publish plan: a first `0.x` release

**Status:** Proposed, 2026-11-13.
**Base:** `main` at `21a2cc2f`, the merge of pull request 588.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` sections 2 and 5,
`plan/composition-four-plan.md` section 3a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A site installs gerak from npm, with no clone, and makes a piece from the guide.**

Every package is `private` at `0.0.0`, and its `exports` point at TypeScript source, so nothing outside this
repository can use it. There is no build, no LICENSE file and no package README. The boundary scan holds only the
pure layer, and `npm run check` does not run it, so nothing stops a package from importing an app.

## 2. Decisions to record (G0, ADR-179)

- **What publishes in `0.1`:** the runtime, `@gerak/rig`, `moves`, `player`, `stage`, `dom`, `react`, `three`,
  `physics` and `rapier`. `@gerak/tools` stays private: its commands assume this repository's layout, and a site
  needs the runtime first. The unscoped `gerak` and `da-lang` stay held, unpublished; there is no umbrella package,
  since it would be a second way to import every export.
- **One version for all.** The published packages share one version and move together; `0.1.0` first. Within `0.x` a
  minor version may break the surface, and the changelog says how.
- **Built, not source.** Each package ships ESM JavaScript and `.d.ts` built by `tsc` from `src` into `dist`;
  `exports` point at `dist`. Inside the repository, tests, apps and tools keep resolving `@gerak/*` to source
  through the workspace aliases that exist today, so no gate needs a build first.
- **Peers stay peers:** `react` and `three` are peer dependencies; Rapier's package stays a dependency of
  `@gerak/rapier`.
- **The release command prepares, a person publishes.** `npm run release -- <version>` runs the check, builds,
  packs every package, installs the tarballs into an empty temporary project that imports each export, sets the
  versions and writes the changelog entry. It publishes only with `--publish`, which needs the owner's npm login and
  second factor; an agent never runs it.
- **The app boundary is scanned in the check.** A package never imports an app; an app imports a package only by its
  declared exports, never a path inside it; an app never imports another app. `npm run check` runs the boundary scan.
- **The review without a browser says what it cannot see.** A stage module with `layouts` and no `rests`, reviewed
  without a browser, gets one finding that names the browser review instead of a "never moved" per carried member.

## 3. Slices

### G1. Build and exports

- **Invariant:** `npm run build` writes `dist` for each published package; each `exports` entry resolves to a built
  file with its types; the repository still resolves `@gerak/*` to source.
- **Owner:** each published package's `package.json` and `tsconfig.build.json`, `scripts/workspace-source-aliases.mjs`.
- **Test:** a test reads every published manifest and checks that each export names a file the build writes.

### G2. Release command

- **Invariant:** `npm run release -- 0.1.0` without `--publish` ends with every tarball installed into an empty
  project, every export imported under Node, and nothing published; with `--publish` it publishes in dependency order.
- **Owner:** `scripts/release.mjs`.
- **Test:** the dry run in a temporary folder; a package whose export does not resolve fails it by name.

### G3. App boundary in the check

- **Invariant:** the three app rules above fail the scan with the importing file and the import, and `npm run check`
  runs it.
- **Owner:** `scripts/boundary-scan.mjs`, `scripts/check.mjs`.
- **Test:** a fixture for each rule fails; the tree passes.

### G4. Package documents

- A README per published package: what it answers, its install line, and a link to the guide on GitHub.
- A LICENSE file at the root and in each published package (MIT, as the root manifest says).
- A `CHANGELOG.md` the release command writes to.

### G5. The review without a browser

- **Invariant:** as decided above; a module with `rests`, or without `layouts`, is reviewed as today.
- **Owner:** `packages/tools/src/scene/review.ts`.
- **Test:** `shop` reviewed without a browser gives the one finding and no "never moved".

### G6. Proof

- **Measure, alone, fresh:** a Sonnet worker in an empty folder outside the repository installs the packed tarballs
  and the published guide's link only, and makes a small animated title on a plain Vite page. It passes when it
  never opens this repository's source. Tokens and tool calls are recorded.
- **Cold review:** a Sonnet agent reviews the diff and runs the release dry run.
- **The owner publishes `0.1.0`** with `--publish` after the pull request merges.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | G0, G5 | the decisions, and the small review fix |
| 2 | Sonnet, medium | G1 | manifests and the build |
| 2 | Sonnet, medium | G3 | scripts only |
| 3 | Sonnet, medium | G2, G4 | the release command reads G1's build |
| 4 | Sonnet, medium, fresh | G6 measure | |
| 4 | Sonnet, medium | G6 cold review | |

One pull request, after wave 4.

## 5. Risks

- **Source and build drifting:** the repository runs on source, a site on `dist`. The dry run installing the
  tarballs is what catches a difference; it runs in the release command, not in every check.
- **A `.d.ts` that names a type from another package's source:** the build's path mapping points each package at
  its dependencies' built types, as `packages/moves/tsconfig.build.json` does today.
- **Names:** the GitHub repository is still `motion5`; links in READMEs use its address until the owner renames it.

## 6. Open for the owner

- The name on the copyright line of the LICENSE file.
- Whether `0.1.0` is published under the `latest` tag or `next`.

## 7. Done when

The dry run passes in the pull request, the measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md`
says what is published. The owner's publish follows the merge.
