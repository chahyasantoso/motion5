# Publish plan: ready to publish, not published

**Status:** Approved by the owner, 2026-11-13.
**Base:** `main` at `21a2cc2f`, the merge of pull request 588.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` sections 2 and 5,
`plan/composition-four-plan.md` section 3a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**gerak installs into a project outside this repository, and an agent makes a piece there from the guide alone.**

Every package is `private` at `0.0.0`, and its `exports` point at TypeScript source, so nothing outside this
repository can use it. There is no build and no LICENSE file. The boundary scan holds only the pure layer, and
`npm run check` does not run it, so nothing stops a package from importing an app.

Nothing is published to npm in this plan: no one outside needs it yet, and the names are held. When a real project
wants it, publishing is one command added to what this plan builds.

## 2. Decisions to record (G0, ADR-179)

- **What is made installable:** the runtime, `@gerak/rig`, `moves`, `player`, `stage`, `dom`, `react`, `three`,
  `physics` and `rapier`. `@gerak/tools` stays source-only: its commands assume this repository's layout. There is no
  umbrella package, since it would be a second way to import every export.
- **One version for all,** `0.1.0`, moved together.
- **Built, not source.** Each package ships ESM JavaScript and `.d.ts` built by `tsc` from `src` into `dist`;
  `exports` point at `dist`. Inside the repository, tests, apps and tools keep resolving `@gerak/*` to source
  through the workspace aliases, so no gate needs a build first.
- **Peers stay peers:** `react` and `three` are peer dependencies; Rapier's package stays a dependency of
  `@gerak/rapier`.
- **Packing is checked by installing.** `npm run pack:check` builds, packs every package into a folder, installs the
  tarballs into an empty temporary project and imports each export under Node. It publishes nothing; no command in
  the repository does.
- **The app boundary is scanned in the check.** A package never imports an app; an app imports a package only by its
  declared exports, never a path inside it; an app never imports another app. `npm run check` runs the boundary scan.
- **The review without a browser says what it cannot see.** A stage module with `layouts` and no `rests`, reviewed
  without a browser, gets one finding that names the browser review instead of a "never moved" per carried member.
- **When it is published:** MIT, copyright Chahya Santoso; under the `latest` tag.

## 3. Slices

### G1. Build and exports

- **Invariant:** `npm run build` writes `dist` for each installable package; each `exports` entry resolves to a built
  file with its types; the repository still resolves `@gerak/*` to source.
- **Owner:** each installable package's `package.json` and `tsconfig.build.json`,
  `scripts/workspace-source-aliases.mjs`.
- **Test:** a test reads every installable manifest and checks that each export names a file the build writes.

### G2. Pack check

- **Invariant:** `npm run pack:check` ends with every tarball installed into an empty project and every export
  imported under Node; a package whose export does not resolve fails it by name.
- **Owner:** `scripts/pack-check.mjs`.
- **Test:** the run itself in a temporary folder; a fixture manifest with a missing export fails by name.

### G3. App boundary in the check

- **Invariant:** the three app rules above fail the scan with the importing file and the import, and `npm run check`
  runs it.
- **Owner:** `scripts/boundary-scan.mjs`, `scripts/check.mjs`.
- **Test:** a fixture for each rule fails; the tree passes.

### G4. Documents

- A LICENSE file at the root and in each installable package: MIT, copyright 2026 Chahya Santoso.
- One README section, "Use it in another project": pack, install the tarballs, and the guide's link.

### G5. The review without a browser

- **Invariant:** as decided above; a module with `rests`, or without `layouts`, is reviewed as today.
- **Owner:** `packages/tools/src/scene/review.ts`.
- **Test:** a carried member in a module with layouts and no `rests` gives the one finding and no "never moved".

### G6. Proof

- **Measure, alone, fresh:** a Sonnet worker in an empty folder outside the repository installs the packed tarballs
  and reads only the guide's pages, and makes a small animated title on a plain Vite page. It passes when it never
  opens this repository's source. Tokens and tool calls are recorded.
- **Cold review:** a Sonnet agent reviews the diff and runs the pack check.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | G0, G5 | the decisions, and the small review fix |
| 2 | Sonnet, medium | G1, G2 | the pack check reads the build; one worker owns both |
| 2 | Sonnet, medium | G3, G4 | scripts and documents |
| 3 | Sonnet, medium, fresh | G6 measure | |
| 3 | Sonnet, medium | G6 cold review | |

One pull request, after wave 3.

## 5. Risks

- **Source and build drifting:** the repository runs on source, an outside project on `dist`. The pack check is
  what catches a difference; it runs on demand and in the pull request, not in every check.
- **A `.d.ts` that names a type from another package's source:** the build's path mapping points each package at
  its dependencies' built types, as `packages/moves/tsconfig.build.json` does today.

## 6. Done when

The pack check passes in the pull request, the measure passes, `npm run check` is green, and
`docs/SESSION-STATUS.md` says gerak installs outside the repository.
