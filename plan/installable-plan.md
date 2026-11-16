# Installable plan: gerak's tools in a person's own project

**Status:** Approved, 2026-11-15, after one round of critique.
**Base:** `main` at `a249afe8`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-179-*.md`,
`docs/ADR-187-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person with their own project installs gerak's packages and tools, drops in a brief folder (their own, or one
whose style they want), and an agent makes, reviews and checks pieces there with `npx gerak <command>`, reading a
guide that ships with the tools.** Nothing needs this repository.

- **One way to run a command:** `npx gerak <command>`, here and outside. The `npm run motion:*` scripts go.
- **The pieces folder is found, not assumed:** `--root`, else `gerak.pieces` in the nearest `package.json`.
- **The page code ships compiled with the tools; the pages are two-line files in the pieces folder**, written by
  `gerak init`, so the brief glob reads the person's own folder and page commands work in any project.
- **A reel is made the way a reel is produced:** brief, script (hook, story, call to action), a storyboard of shots,
  beats named by the shots, a camera group, and **seamless transitions**: no hard cut; at every shot change at least
  one named member carries through into the next shot, moved, morphed, or zoomed into until it becomes the next ground.

Not planned here: publishing to npm (ADR-179 keeps that waiting for a project that needs it); the live kit as its own
package; a `create-gerak` starter; Vue or Svelte; footage.

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| The command | `gerak <command> [args]`, one bin dispatching to each command module | `packages/tools/bin/gerak.mjs` | the bin |
| The pieces folder | where briefs live | `piecesRoot(cwd, flag?)` in `packages/tools/src/page/root.ts` | that function |
| The page code | the stage, live and talk pages' code, compiled | `packages/tools/src/pages/`, exported as `@gerak/tools/pages` | the package |
| The page files | `stage.html` + `stage.ts` (and live, talk), each entry two lines | the pieces folder, written by `gerak init` | `init` |
| The shipped guide | the agent guide, reference and skill | copied into the package's `guide/` at build | the build |
| A reel's storyboard | the script and shot list, written before code | `<brief>/STORYBOARD.md` | the brief |

```ts
// <pieces>/stage.ts, written by gerak init; the glob is the person's, so it reads their briefs
import { stagePage } from "@gerak/tools/pages";
stagePage(import.meta.glob("/*/src/*.ts"), import.meta.glob("/*/src/*.tsx"));
```

- **Two ways the bin resolves, one bin:** in this repository (a `../src` beside the bin) it registers the source
  loader and imports source, so nothing needs a build; installed, it imports `../dist`. `pack:check` covers the
  installed path.
- **Page commands inject their plugins inline** (`createServer({ root, configFile: false, plugins: [...] })`), so a
  pieces folder needs no `vite.config`; this repository's `apps/pieces/vite.config.ts` keeps only what the repository
  needs (source aliases, `optimizeDeps`), and its page files become the same two-line files `init` writes.
- Page tools open the system's Chrome or Edge, as now; nothing downloads a browser.

## 3. Decisions to record (ADR-188)

- **ADR-179 superseded in part:** `@gerak/tools` is no longer source-only. It builds to `dist`, joins
  `INSTALLABLE_PACKAGES` last, drops `private`, takes workspace-matched versions, and declares `bin`
  (`gerak`), `files` (`dist`, `guide`), and `exports` to `dist`. Rewrite the ADR-179 line in place and add the
  superseded-in-part line under its status. Publishing still waits.
- **One command, `gerak`.** `gerak <command>` runs what `npm run motion:<command>` ran, with the same arguments and
  output; `gerak --help` lists every command. The root `motion:*` scripts are removed, and every mention outside
  `plan/` and `docs/ADR-*` names `npx gerak <command>`, done by script in its own commit after the bin lands.
  `fromCaller` keeps its `INIT_CWD` read and falls back to `cwd` under `npx`.
- **`piecesRoot(cwd, flag)`:** the `--root` flag resolved from `cwd`; else the folder `gerak.pieces` names in the
  nearest `package.json` at or above `cwd`, resolved from that file; else a usage message naming both ways.
  `DEFAULT_ROOT` and `DEFAULT_SOURCE` go; every caller takes its root from `piecesRoot`.
- **Pages:** `stagePage`, `livePage`, `talkPage` in `@gerak/tools/pages` take the globs from the caller; React and
  React DOM become peer dependencies beside `vite` and `playwright-core`.
- **`gerak init [folder]`** writes, refusing any file that exists: `<folder>/` (default `pieces/`) with the three
  page files and entries, a `gerak.pieces` entry in the nearest `package.json`, `.claude/skills/make-motion/SKILL.md`,
  and an `AGENTS.md` pointing at `node_modules/@gerak/tools/guide/agent-motion.md`. `gerak init --refresh` rewrites
  only the page files.
- **The guide ships:** the build copies `docs/guide/agent-*.md` and the skill into `guide/`; a test refuses a guide
  link that leaves the guide folder, and one naming `npm run motion:`.

## 4. Slices

### S0. Decision and the root (planner)

ADR-188 and its index line; ADR-179 rewritten in part; `piecesRoot` with failing-first tests (flag, nearest
`package.json`, none found, `INIT_CWD` unset); the root `package.json` entry `"gerak": { "pieces": "apps/pieces" }`;
every `DEFAULT_ROOT` and `DEFAULT_SOURCE` caller moved to `piecesRoot`, each caller's existing test still green.

### S1. The bin and the build (executor)

- **Invariant:** `gerak` dispatches every command module, from source here and from `dist` installed; `@gerak/tools`
  builds (`scripts/build.mjs` learns it); `pack:check` installs it with `vite` and `playwright-core` among the peers,
  runs `npx gerak --help` and `npx gerak moves --anatomy` there, and checks `bin` and `files` resolve.
- **Test:** `gerak --help` lists every command module; an unknown command is usage; `npx gerak` in this repository
  resolves to the workspace bin.
- **Then, its own commit:** the rename by script; the repo test refusing `npm run motion:` outside `plan/` and
  `docs/ADR-*`; the tests and `scripts/repo-map.mjs` that read script lists updated in that commit.

### S2. The pages (executor, after S1)

- **Invariant:** the page code moves from `apps/pieces/src/` into `packages/tools/src/pages/`, compiled by the build;
  `apps/pieces` uses two-line entries; page commands inject their plugins inline and set `server.fs.allow` to the
  pieces root and the package.
- **Test:** a scratch root outside the repository with one brief and the two-line files plays at
  `stage.html?piece=<name>` (a browser test, including a brief added after the server starts); `gerak frames`
  renders it; the live page loads a scene from it. `pack:check` serves a scratch root from the tarball and fetches
  `stage.html` and its entry with no resolve error.

### S3b. Making a reel (planner, beside S2)

- `docs/guide/agent-reel.md`, routed from `agent-motion.md`'s table: brief; script (a hook in the first 3 s, the
  story, one call to action); `STORYBOARD.md` with one row per shot (start and end ms, framing, camera move, the
  member carried in, on-screen text, what the viewer must notice); beats named by the shots; a `world` group as the
  camera (zoom, push, pan, shake as moves on it); seamless transitions, the storyboard naming the carried member per
  shot change (a carry with `carried`; a morph of a path member's outline; a zoom-through, the camera pushed into a
  member until it fills the frame as the next ground; a whip-pan with a member riding through; a wipe grown from a
  member); b-roll as cutaways of the piece's own material; each shot's scene work kept local to its beat; the review
  read per shot and frames at each shot change.
- **Worked check, recorded:** the lead builds a 10 s, three-shot scratch reel from the page, records pass or fail and
  what the page lacked, fixes the page; the scratch reel is not kept.

### S3. `gerak init` and the shipped guide (executor, after S2 and S3b)

- **Invariant:** `init` and `--refresh` as decided; the guide (with `agent-reel.md`) and skill in the package.
- **Test:** `init` in a scratch project writes each file and refuses a second run; `--refresh` rewrites only the
  page files; the shipped guide's links resolve inside `guide/` and name no `npm run motion:`.

### S4. Proof (lead script, then a fresh executor model, then the cold review)

- **Install gate (the lead, scripted, must pass first):** a scratch Vite project outside the repository; every
  package installed from tarballs with its peers; `npx gerak init`; a hand-written 3 s piece; `npx gerak review`
  clean and `npx gerak frames` renders it. This answers whether the tools install.
- **Measure (a reading of the guide):** the `showreel` brief folder copied in; a fresh Sonnet worker at medium
  effort, from the shipped guide alone, makes `launch-night`: a 30 s product-launch reel in the showreel style (the
  product its own choice), with a hook, a story, b-roll cutaways, camera zooms and pans, at least four kinds of
  seamless transition and a call to action. It commits `STORYBOARD.md`, naming the carried member per shot change,
  before any scene code. It passes when `npx gerak review` is clean (its jump limit refuses a teleporting member),
  `npx gerak style check showreel` passes, the beats match the storyboard's shots, at every shot change the named
  member is in both beats' `on` lists and visible (opacity above 0, inside the frame) on the samples either side of
  the boundary, and it read nothing from this repository. The lead puts the frames either side of each shot change in
  the pull request and says, as a reading, whether the hook, the story and the call to action land.
- **On a fail:** the lead says whether the tools or the guide caused it, fixes that, and runs one fresh measure
  again; a second fail is reported as such.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | nothing |
| 2 | Executor | S1 | S0 |
| 3 | Executor; planner | S2; S3b beside it | S1 |
| 4 | Executor | S3 | S2, S3b |
| 5 | Planner, then executor model, fresh | S4: install gate, measure, cold review | S3 |

Sequential except S3b. One pull request, after wave 5.

## 6. Risks

- **The rename touches 44 files;** it lands as one scripted commit after the bin works, with the tests that read
  script lists.
- **Page files in the person's folder drift on upgrade;** they are two lines each and `init --refresh` rewrites them.
- **A 30 s reel is a large measure:** a 10 s piece of five beats cost a Sonnet worker 214k tokens; this one may cost
  300k to 500k. The install gate answers installability first, so a failed reel does not hide it.
- **Seamless is checked by presence, visibility and the jump limit,** not by eye; a carried member that is present
  but plays no part in the change passes the check, and the lead's reading of the frames is what catches it.

## 7. Done when

The install gate and the measure pass, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
