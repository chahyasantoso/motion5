# ADR-166: motion:review and a one-call loop

**Status:** Accepted, 2026-11-08

## Context

The owner saw repo agents run the tools far more than agents without the repo, 20 calls against 8, and traced it to
the guide's loop, which told agents to repeat timeline, sample, frames, probe and check after every change. A wrong
selector in `--action` waited 30 seconds and printed a stack trace.

## Decision

- `motion:review <page> --watch <selectors> --to <ms>` runs `motion:check`, `motion:read` and `motion:frames` at once,
  each in its own browser, and prints the findings, up to 40 moves and the sheet's path. Frames fall at six even
  times unless `--at` names them. It exits 1 on any finding.
- The guide's loop is: scaffold, choose a look, lay out and write the scene, review, fix what it flags, review again,
  typecheck once. The other tools are for digging into what a review showed.
- An action on a selector the page lacks fails at once, by name, and every page tool prints an error as one JSON line
  with `kind: "error"`.

## Consequences

A review costs one call and about five seconds for a short piece. The guide also names `liveAt`, `elapsedOf` and the
fields of a body's state, which the CONFETTI agent read source to find.

## Rejected

- One browser stepping once for all three: the gain is seconds, and three existing tools would need splitting.
- Dropping the separate tools: digging into one element still needs `probe`, `read` or `sample`.
