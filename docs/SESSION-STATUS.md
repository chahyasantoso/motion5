# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-15, Asia/Jakarta.
- **Read against:** `main` at `a249afe8`, with the style plan merged.

## Now

- **A scene is `(time, events) => targets`, and an agent designs before it chooses.** `@gerak/moves` holds fields,
  parts by kind, moves and compose in layer folders; `@gerak/rig`, `@gerak/player`, `@gerak/physics`,
  `@gerak/rapier`, `@gerak/dom`, `@gerak/react`, `@gerak/three` and `@gerak/stage` build, play and write it; the
  `motion:*` commands in `@gerak/tools` make, review, sample and render pieces. Each brief is a folder of
  `apps/pieces`, played at `stage.html?piece=<name>` or live at `live.html?scene=<name>`. `motion:moves -- --anatomy`
  is the card of primitives, the catalog answers a piece's `design`, and `motion:review` checks the design. A brief
  folder is portable with its own parts; its optional `style.ts` card holds the share of lively motion per field, which
  `motion:review` checks for any piece naming it and `motion:style` measures (the `showreel` card, measured by
  `launch-day`). Decisions are ADR-170 to ADR-187; the agent guide and the generated `docs/guide/agent-reference.md` describe use. Nothing is
  on npm (ADR-179).

## Next in line

- **Installable tools (`plan/installable-plan.md`, proposed):** one `gerak` command, the pages and the guide in
  `@gerak/tools`, and `gerak init`, so a person's own project makes and checks pieces; then the live kit and overlay.

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
