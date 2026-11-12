# Apps and reference plan

**Status:** Done, 2026-11-12.
**Base:** `main` at `85c5b728` plus pull request 582.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` ("After the values plan"),
`.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent making a piece works in a folder that holds only pieces and their moves, and the reference it reads is
built from the code, so it cannot drift from it.**

Today `apps/react-demo` holds 20 pages: the seven worked examples that tests read, nine proof pieces, two showreels,
the live page and `src/moves`. An agent making a piece sits beside all of them. And
`docs/guide/agent-reference.md` restates every export in about 600 hand-written lines; a worker opened package source
four times where it had gaps.

## 2. Decisions

- **Two apps, not three.**
  - `apps/examples` holds the worked examples and their tests. The tests read them; the guide never names them.
  - `apps/pieces` holds what agents and people make: the proof pieces, the showreels, `src/moves`, and the live page.
    It is the tools' default root and the scaffold's target.
  The live page stays with the pieces because it edits their files through its dev server; pulling it out now means
  serving one app's files from another's server. It leaves when the live kit becomes a package (roadmap stage 4),
  which is when a second app needs it.
- **The split is one mechanical commit,** made by a script (`git mv` and a path rewrite), with every scene sampled
  the same before and after and every page's frames captured before and after.
- **The reference is generated from the declarations and doc comments.** A script reads each package's declared
  exports with the TypeScript compiler (already a dependency of `@gerak/tools`) and writes, per export, its signature
  and its doc comment, between markers in `docs/guide/agent-reference.md`. Hand-written text outside the markers
  stays: a few lines per package on how its pieces fit, and the short code examples.
- **A test holds the generated part current,** as the source map's test does: `npm run reference -- --write`
  rewrites it, and the check fails when the file differs from what the script would write.
- **A doc comment becomes the one owner of what an export does.** Where the reference says more than the comment,
  the comment grows to say it, within the comment rule (three lines, 200 characters); where that is not enough, the
  hand-written part says it once.

## 3. Slices

### S1. The split

- **Invariant:** `apps/examples` and `apps/pieces` exist with their own `package.json`, Vite config and tests;
  `apps/react-demo` is gone. `DEFAULT_ROOT` and the scaffold point at `apps/pieces`; `motion:live`, `motion:moves`
  and the review tools work there; the tests that read worked examples import them from `apps/examples`.
- **Owner:** the two apps; `packages/tools/src/page/page.ts`; `scripts/repo-map.mjs`.
- **Test:** `npm run check`; every scene samples the same as before; every page's frames match before and after; the
  agent-guide test that refuses a guide naming a worked example reads the folder of `apps/examples`.

### S2. The generated reference

- **Invariant:** `npm run reference -- --write` writes the generated sections; a test fails when they are stale;
  every export of every package a scene can use appears with its signature and doc comment.
- **Owner:** a new `scripts/reference.mjs` (or `packages/tools/src/reference/`), `docs/guide/agent-reference.md`.
- **Test:** the existing reference test (every export named) still passes; a new test compares the file with the
  script's output.

### S3. Comments that carry the reference

- **Invariant:** no export's line in the generated reference is empty or says less than the hand-written reference
  said; the hand-written part keeps every code example and stays near 300 lines; the whole file is shorter than the hand-written one it replaced.
- **Owner:** the doc comments in `packages/*/src`.
- **Test:** the generator refuses an export with no doc comment.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor, by script | S1 | mechanical; a script costs less than a brief and a large diff to review |
| 2 | Sonnet, medium | S2 | a script against a clear spec |
| 2 | Sonnet, medium | S3 | comments only, in files S2 does not touch |
| 3 | Sonnet, medium | cold review | packages and tools change |

One pull request per wave.

## 5. Risks

- **Paths are named in many places:** tests, the scaffold, the live plugin, the map, the guides, `launch.json`. The
  script rewrites them and the check finds the rest.
- **A generated reference reads flatter** than one written for agents. The hand-written part keeps the examples and
  the "how it fits" lines, and the proof's next run says whether agents miss anything.
- **Moving the live page later** is deferred, not avoided; the live kit stage owns it.

## 6. What it cost

| Wave | Who | Slices | Tokens | Time | What the conductor fixed on combining |
| --- | --- | --- | --- | --- | --- |
| 1 | Conductor, by script | S1 | not shown | | the script rewrote plans and decision records, which are history; reverted |
| 2 | Sonnet, medium | S2 | 106 k | 5.3 min | three lines an export made the file 956 lines; one line each made it 532 |
| 2 | Sonnet, medium | S3 | 150 k | 6.8 min | nothing |
| 3 | Sonnet, medium, cold review | | 108 k | 5.7 min | seven findings: three fixed, four left as cosmetic or with no case today |

The review found `npm run test:frames` broken by the split (it opened examples from the pieces app) and the live
guide naming examples that no longer play live; neither is in `npm run check`. Both are fixed, and the reference check now
fails on an export with no doc comment.

## 7. Done when

`apps/react-demo` is gone, the reference's generated part is current under test, `npm run check` is green, and
`docs/SESSION-STATUS.md` says so.
