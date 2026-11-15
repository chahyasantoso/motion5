# Installable plan: gerak's tools in a person's own project

**Status:** Proposed, 2026-11-15.
**Base:** `main` at `a249afe8`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-179-*.md`,
`docs/ADR-187-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person with their own project installs gerak's packages and tools, drops in a brief folder (their own, or one
whose style they want), and an agent makes, reviews and checks pieces there with `npx gerak <command>`, reading a
guide that ships with the tools.** Nothing needs this repository.

- **One way to run a command:** `npx gerak <command>` here and outside. The `npm run motion:*` scripts go.
- **The pieces folder is found, not assumed:** `--root`, else `gerak.pieces` in the nearest `package.json`.
- **The pages ship with the tools:** the stage, live and talk pages are served by `@gerak/tools` over any pieces
  folder, so page commands (`frames`, `render`, `fps`, page `review`) work in any project.
- **`npx gerak init`** sets a project up: a pieces folder, `gerak.pieces`, the guide and the agent skill.
- **A reel is made the way a reel is produced:** a guide page takes an agent from brief to script (hook, story, call
  to action), to a storyboard of shots (time, framing, camera, transition, text), to beats named by those shots, with
  a camera group for zooms and pans and transitions as moves, then reviewed shot by shot.

Not planned here: publishing to npm (it waits for a project that needs it, ADR-179); the live kit as its own
package; a `create-gerak` starter; Vue or Svelte.

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| The command | `gerak <command> [args]`, one bin dispatching to each command module | `packages/tools/bin/gerak.mjs` | the bin |
| The pieces folder | where briefs live | `piecesRoot(cwd, flag?)` in `packages/tools/src/page/root.ts` | that function |
| The pages | `stage.html`, `live.html`, `talk.html` and their entries | `packages/tools/pages/`, served by `gerakPages()` in `@gerak/tools/vite` | the plugin |
| The shipped guide | the agent guide, reference and skill | copied into `@gerak/tools`' `guide/` at build | the build |
| A reel's storyboard | the script and shot list, written before code | `<brief>/STORYBOARD.md` | the brief |

- `@gerak/tools` builds to `dist` like the runtime packages and joins `INSTALLABLE_PACKAGES`; `pack:check` installs
  it from a tarball outside the repository and runs `npx gerak --help` and `npx gerak moves --anatomy` there.
- `apps/pieces` keeps its briefs and uses `gerakPages()`; its own copies of the pages and `src/` entries go.
- This repository's root `package.json` declares `"gerak": { "pieces": "apps/pieces" }`.

## 3. Decisions to record (ADR-188)

- **One command, `gerak`.** `gerak <command>` runs what `npm run motion:<command>` ran, with the same arguments and
  output; `gerak --help` lists the commands. The root `motion:*` scripts are removed in the same change, and every
  guide page, skill and test names `npx gerak <command>`.
- **`piecesRoot(cwd, flag)`:** the `--root` flag resolved from `cwd`; else the folder `gerak.pieces` names in the
  nearest `package.json` at or above `cwd`, resolved from that file; else a usage message naming both ways.
  `DEFAULT_ROOT` goes; every command takes its root from `piecesRoot`.
- **The pages are the tools'.** `gerakPages(options?)` is a Vite plugin serving the three pages and their entries from
  the installed package over the Vite root (the pieces folder); the stage loader's glob reads that root's briefs.
  React and React DOM become peer dependencies of `@gerak/tools`, as `vite` and `playwright-core` are.
- **`gerak init [folder]`** writes, refusing any file that exists: `<folder>/` (default `pieces/`), a
  `gerak.pieces` entry in the nearest `package.json`, `.claude/skills/make-motion/SKILL.md`, and `AGENTS.md` lines
  pointing the agent at `node_modules/@gerak/tools/guide/agent-motion.md`.
- **The guide ships.** The build copies `docs/guide/agent-*.md` and the skill into the package's `guide/`; a guide
  link that leaves the guide folder is refused by a test, so shipped pages never point into this repository.

## 4. Slices

### S0. Decision and the root (planner)

ADR-188 and its index line; `piecesRoot` with its tests; the root `package.json` entry; `DEFAULT_ROOT` replaced at
its two uses. Commit and push before briefing S1.

### S1. The bin and the build (executor)

- **Invariant:** `gerak` dispatches every command; `@gerak/tools` builds to `dist` with no source loader; the
  `motion:*` scripts are gone and every mention is `npx gerak`; `pack:check` covers the tools.
- **Test:** `gerak --help` lists every command module in `bin/`; an unknown command is usage; a repo test refuses
  `npm run motion:` anywhere in docs, skills and tests; `pack:check` runs `gerak moves --anatomy` from the tarball.

### S2. The pages (executor, after S1)

- **Invariant:** `gerakPages()` serves the three pages over any root; `apps/pieces` uses it; page commands serve a
  root through it.
- **Test:** a scratch root outside the repository with one brief plays at `stage.html?piece=<name>` (a browser
  test); `gerak frames` renders it; the live page loads a scene from it.

### S3. `gerak init` and the shipped guide (executor, after S2)

- **Invariant:** `init` as decided; the guide and skill in the package; no shipped link leaves the guide.
- **Test:** `init` in a scratch project writes each file and refuses a second run; the shipped guide's links
  resolve inside `guide/`.

### S3b. Making a reel (planner, beside S3)

- `docs/guide/agent-reel.md`, routed from `agent-motion.md`'s table: the production steps in order. Brief; script
  (a hook in the first 3 s, the story, one call to action); `STORYBOARD.md` with one row per shot (start and end ms,
  framing, camera move, transition in, on-screen text, what the viewer must notice); beats named by the shots; a
  `world` group as the camera (zoom, push, pan, shake as moves on it); transitions as moves (a cut is a beat
  boundary, a whip-pan a fast camera `x` with blur, a zoom-through a push into a member, a wipe a growing clip, a
  match cut a member carried between layouts); b-roll as cutaway shots of the piece's own material; the review read
  per shot and a frame sheet per transition. No footage: a clip as an object waits for the video stage.
- A worked check before the measure: the lead builds a 10 s, three-shot scratch reel from the page and fixes what the
  page lacked; the scratch reel is not kept.

### S4. Proof (fresh executor model, then the cold review)

- **Measure:** in a scratch Vite project outside the repository, with every package installed from tarballs and
  `npx gerak init` run, the `showreel` brief folder copied in; a fresh Sonnet worker at medium effort, from the
  shipped guide alone, makes `launch-night`: a 30 s product-launch reel in the showreel style (the product is its
  own choice), with a hook, a story, b-roll cutaways, camera zooms and pans, at least four kinds of transition and a
  call to action. It writes `STORYBOARD.md` and commits it before any scene code. It passes when `npx gerak review`
  is clean, `npx gerak style check showreel` passes, `npx gerak frames` renders one frame per shot, the beats match
  the storyboard's shots, and it read nothing from this repository. The lead reads the frames against the storyboard
  and says, as a reading, whether the hook, the story and the call to action land.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | nothing |
| 2 | Executor | S1 | S0 |
| 3 | Executor | S2 | S1 |
| 4 | Executor; planner | S3; S3b beside it | S2 |
| 5 | Executor model, fresh | S4, then the cold review | S3, S3b |

Sequential: each needs the last one's build or pages. One pull request, after wave 5.

## 6. Risks

- **Renaming every command mention** touches many docs and tests; S1 does it by script, in its own commit.
- **The pages' entries import `apps/pieces` code** (`stage-module.ts`, the live panel); S2 moves them whole into the
  package, and the live kit later takes the panel from there.
- **A 30 s reel is a large measure:** a 10 s piece of five beats cost a Sonnet worker 214k tokens; this one may cost
  300k to 500k. The installability checks (`init`, `review`, `frames`) are read first, so a failed reel does not hide
  whether the tools installed.
- **A long piece's review cost:** a step that reads all of the past grows over 30 s; the guide's reel page says to
  keep each shot's scene work local to its beat.
- **Peer dependencies** (React, Vite, Playwright) must be in the scratch project; the measure installs them as a
  person would and the plan's guide page says which.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
