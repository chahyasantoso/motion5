# Agent instructions

This file is for an AI implementor working on motion5. A human contributor wants [the README](README.md) and [the documentation map](docs/README.md).

## Read these first, in this order

1. [docs/SESSION-STATUS.md](docs/SESSION-STATUS.md) -- the only document allowed to claim what has landed. Rewrite it (replace, never append); **Now** and **Next in line** carry exactly one entry each; no phase bullet. CI enforces the section list, one-entry rule, and a byte ceiling. See ADR-085.
2. [docs/GUARDRAILS.md](docs/GUARDRAILS.md) -- standing rules every slice is held to. [docs/LIVE-EDIT-COST.md](docs/LIVE-EDIT-COST.md) -- what a caller may do to a loaded project and what each edit pays for.
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) -- who owns what.
4. [docs/CI-WORKFLOW.md](docs/CI-WORKFLOW.md) and [docs/FORMATTING.md](docs/FORMATTING.md) -- the gates you have to pass.

## The rules that get broken most

**Single owner.** Write the invariant first, name the one owner, add the test that fails without the change, keep the slice vertical. Two owners for one question is the defect this project cares about most.

**Status is replaced, not accumulated.** The honest edit to `docs/SESSION-STATUS.md` is a deletion and a rewrite. A rule you earned goes in `docs/GUARDRAILS.md`, a run id goes in your PR body; neither goes in the status file.

**Formatting stays separate.** Touched-file normalization may accompany the requested change. Unrelated formatting stays in a separate mechanical commit; a behavior request never authorizes a repository-wide formatting pass.

**No markdown tables.** Prettier rewrites their alignment unpredictably, and the drift is fatal to `format:check`.

**Prettier config:** `printWidth: 100`, double quotes, trailing commas everywhere, `proseWrap: preserve`. Keep prose on one line or break it yourself at or under 100 columns. Tag fenced blocks `text` when genuinely not source (Prettier formats `json`, `ts`, `yaml` blocks as code).

**No predecessor copies.** Recreate the contract from first principles.

## Coding rules

1. Minimal working code: correctness first (clean architecture, DRY, SOLID).
2. Use discriminated unions with exhaustive checks only where they add clarity.
3. Self-explanatory function names over comments.
4. Comments only when a name cannot carry the meaning.
5. Max 250 characters per comment.

## Standing instructions

**Decide.** Choose for correctness: clean architecture, DRY, SOLID, closed unions read by exhaustive checks (ADR-092). Record the decision in the PR body or ADR. A question asked instead leaves nothing behind.

**Quality pass before done.** A separate pass reads the whole change and reports as a PR comment. Separate means it was not told what the previous inventory concluded.

**Read-budget limits.** No file under `packages/core/src` may exceed **60,000 bytes** (markdown included). A source over **30,000 bytes** keeps private reasoning in a sibling `x.md` beside `x.ts`. The `read-budget` CI job enforces this; `node scripts/read-budget-scan.mjs` is the command it runs. Do not mix infrastructure with behavior in one PR, and do not widen a slice past the file count its own body claims.

**Transport choice (with local checkout).** Use git directly: `npm run format` before pushing, run the suite, cite the Actions run id. Do not claim local checks when using the GitHub API only.

**Transport choice (no local checkout).** Use a reviewed transport rather than single-file writes. One slice uses AI edit (`.ai/edits/<name>.json`); a dependent stack uses AI checkpoint (`.ai/checkpoints/`). Pick with [docs/AUTOMATION-TRANSPORT-CHOICE.md](docs/AUTOMATION-TRANSPORT-CHOICE.md). Full protocol details: [docs/AI-EDIT-WORKFLOW.md](docs/AI-EDIT-WORKFLOW.md) and [docs/AI-CHECKPOINT-WORKFLOW.md](docs/AI-CHECKPOINT-WORKFLOW.md). Read the published commit and verify CI on that exact SHA.

## XERJ (code search)

This project uses XERJ for reference coding. Before writing code that touches
unfamiliar territory: `xerj def "<symbol>"` for go-to-definition, or
`xerj search "<plain words>"` for ranked, definition-first passages.
Index a repo with `xerj autoindex <folder>`. Cite file:line for anything you rely on.
