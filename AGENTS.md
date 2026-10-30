# Agent instructions

Rules only. Nothing here narrates: no incident story, no history, no rationale. A rule worth keeping
is one line, and a rule this file does not carry is not a rule.

## Read these first, in this order

1. [docs/SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has
   landed, and it states current state only. Rewrite the entry your slice makes stale rather than
   appending one beside it, and verify a claim against the pull request or the tree before writing it.

## Read on demand

- Who owns what: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- What a caller may do to a loaded project and what each edit pays:
  [docs/LIVE-EDIT-COST.md](docs/LIVE-EDIT-COST.md).
- What a complete change looks like: [docs/PR-WORKFLOW.md](docs/PR-WORKFLOW.md).
- Which gate runs what: [docs/CI-WORKFLOW.md](docs/CI-WORKFLOW.md).
- Prettier's reach and the manual repair: [docs/FORMATTING.md](docs/FORMATTING.md).
- The authoring schema: [docs/AUTHORED-SCHEMA.md](docs/AUTHORED-SCHEMA.md).
- Public API navigation: [docs/API-CAPABILITIES.md](docs/API-CAPABILITIES.md).
- Why a decision went one way: `docs/ADR-nnn-title.md`. Search them before proposing a flag, alias,
  facade, second owner, compatibility path or new public export.
- How to use the runtime: [the user guide](docs/guide/README.md).
- A human contributor: [README.md](README.md) and [the documentation map](docs/README.md).

## Commands

- `npm run check` — the four gates in order, one `PASS` or `FAIL` line each, and the full log only
  for the step that fails. Green before any pull request.
- `npm run typecheck` — `tsc --noEmit` over packages and apps.
- `npm test` — the full suite on the quiet reporter: a green run states its counts, a red one prints
  every assertion diff.
- `npm run test:verbose -- <file>` — the human reporter, with per-file and per-test lines.
- `npm run test:related -- <file>` — every test that reaches the given source.
- `npm run metrics` — the four costs of working in this repository, on one line.

## Rules

- Write the invariant first, name its single owner, and add the test that fails without the change.
- One owner per question. Two owners for one question is the defect this project cares most about.
- Read a closed union with an exhaustive `switch` over every member, never with a predicate chain or
  a ternary whose else arm nobody wrote down.
- No `any` and no unchecked cast.
- Never weaken a failing test, and delete a gate's test only in the commit that deletes the gate.
- Author no markdown tables anywhere: Prettier realigns them, and the drift fails `format:check`.
- Prettier is pinned at the `package.json` version, `printWidth` is 100, quotes are double, trailing
  commas are everywhere and `proseWrap` is `preserve`, so prose is never rewrapped: keep a paragraph
  on one line or break it yourself at or under 100 columns.
