# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-15, Asia/Jakarta.
- **Read against:** `feat/installable`, the installable plan built on `main` at `a249afe8`.

## Now

- **A scene is `(time, events) => targets`, and an agent designs before it chooses.** `@gerak/moves` holds fields,
  parts by kind and moves in layer folders, with the time helpers in `@gerak/core`; `@gerak/rig`, `@gerak/player`, `@gerak/physics`,
  `@gerak/rapier`, `@gerak/dom`, `@gerak/react`, `@gerak/three` and `@gerak/stage` build, play and write it; the
  one `npx gerak <command>` from `@gerak/tools` makes, reviews, samples and renders pieces, here and in a person's own
  project after `npx gerak init`, which writes the page files, the skill and an `AGENTS.md` pointing at the guide the
  package ships; a fresh agent made the 30 s `launch-night` reel that way, from the shipped guide alone. Each brief is a folder of the pieces folder (`gerak.pieces`; `apps/pieces` here), played at `stage.html?piece=<name>` or live at `live.html?scene=<name>`. `gerak moves --anatomy`
  is the card of primitives, the catalog answers a piece's `design`, and `gerak review` checks the design. A brief
  folder is portable with its own parts; its optional `style.ts` card holds the share of lively motion per field, which
  `gerak review` checks for any piece naming it and `gerak style` measures (the `showreel` card, measured by
  `launch-day`). Decisions are ADR-170 to ADR-188; the agent guide and the generated `packages/<package>/docs/reference` pages describe use. Every package installs
  from its tarball; nothing is on npm (ADR-179, ADR-188).

## Next in line

- **The live kit and the web overlay** (`plan/roadmap.md`): the live editor's panel, timeline, swap and guard as their
  own kit, then a dev-only overlay on a running site.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- React Three Fiber integration is deferred; `talk.html` is untried with a microphone.
- Browser tests run in Chromium only.
- The instrument waits for a person who asks to live-code.

## Where the rest of it lives

- Exact commits, runs, decisions and evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier history remains in Git.
