# Agent instructions

This file is for an AI implementor working on motion5. A human contributor wants [the README](README.md) and [the documentation map](docs/README.md).

## Read these first, in this order

1. [docs/SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has landed. Every plan, ADR, and architecture note describes intent unless it says otherwise. It states current state only, in four sections, and you **rewrite** it rather than appending to it: replace the entry your slice makes stale instead of adding one beside it. **Now** and **Next in line** carry exactly one entry each, and there is no phase bullet. So your slice replaces the one entry that is there, and if that feels lossy, what you are about to lose is history and it already lives in the pull request that landed it. Verify the claim before you write it: two entries called merged pull requests unmerged for nine days, and no gate in this repository can catch that, because this file is the only place the claim exists. The gate holds the section list, the one-entry rule, the absent phase, and a byte ceiling, so a fifth section, a second **Now** entry and a returning log all fail `CI`. See ADR-085.
2. [docs/GUARDRAILS.md](docs/GUARDRAILS.md) for the standing rules and the working constraints every slice is held to, and [docs/LIVE-EDIT-COST.md](docs/LIVE-EDIT-COST.md) for what a caller may do to a loaded project and what each edit pays for. The status file carried both until issue #284 and carries neither now.
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for who owns what.
4. [docs/PR-WORKFLOW.md](docs/PR-WORKFLOW.md) for what a complete change looks like: invariant, evidence, ownership, public surface, deletions, status.
5. [docs/CI-WORKFLOW.md](docs/CI-WORKFLOW.md) and [docs/FORMATTING.md](docs/FORMATTING.md) for the gates you have to pass.

## The rules that get broken most

Write the invariant first, name the single owner, add the test that fails without the change, and keep the slice vertical. Two owners for one question is the defect this project cares about most.

Status is replaced, never accumulated. `docs/SESSION-STATUS.md` is the file you are most likely to break that rule in, because every pull request is asked to update it, and the honest edit is usually a deletion and a rewrite rather than a new bullet. State the project as it is now and remove the entry that is no longer it. A rule you earned goes in `docs/GUARDRAILS.md`, a red or green run id goes in your pull request body, and neither goes in the status file. It reached 99,180 bytes the other way, while its own first sentence called it small.

Keep unrelated formatting in a separate commit. A behavior change is not permission for a repository-wide formatting pass.

Author no markdown tables anywhere. Prettier rewrites their alignment to widths you cannot predict, and the drift is invisible to you while being fatal to `format:check`.

Prettier is pinned at the version in `package.json`, `printWidth` is 100, quotes are double, trailing commas are everywhere, and `proseWrap` is `preserve`. Because prose is never rewrapped, keep a paragraph on one line or break it yourself at or under 100 columns. Prettier also formats the contents of a fenced code block whose language it recognises, so a `json`, `ts`, or `yaml` sample is held to the same standard as a real file. Tag a block `text` when it genuinely is not source.

Do not copy anything from the predecessor repository. Recreate the contract from first principles.

## Standing instructions

Standing rather than per-slice, so a request does not have to restate them and a slice that ignored one is incomplete rather than merely different.

Decide, rather than stopping to ask which of two defensible designs to take. Decide for correctness: clean architecture, DRY and SOLID, and a closed union read by an exhaustive check rather than by a predicate chain or a ternary whose else arm nobody wrote down. [docs/GUARDRAILS.md](docs/GUARDRAILS.md) and ADR-092 own what that means here, and its last bullet is the one this restates. Then write the decision down where a reader looks for it, in the pull request body or the record: a question asked instead of a decision leaves nothing behind, and a decision taken and not recorded is the same gap one step later.

Work on focused branches with standard git and pull requests. Keep commits small, logical, and verified before submitting. Each pull request should represent a single vertical slice that leaves the repository green.

Be verbose in the record. A pull request body, an ADR and a quality-pass comment are read by someone who was not there and cannot run anything, so state the invariant, the measurement behind it, what was withdrawn and why it was withdrawn rather than implemented, and the evidence with its exact commit and run. Prose that says less than its own diff is a defect the same way a docblock describing a member that no longer exists is.

Hand the finished work to an independent quality pass before calling it done. A separate pass reads the whole change for remaining bugs and issues and reports as a comment on the pull request rather than into the record, and separate is the load-bearing word: a pass told what the previous inventory concluded confirms it instead of measuring it, which is how this project measured one union wrong three times before a pass that had not been told caught it. What it found, what was fixed, and what is deliberately left as a follow-up all belong in that comment.

Checkpoint to the pull request as you go, because you can run out of time, context or budget mid-slice, and the next implementor has only what you wrote down. A checkpoint comment names the head you read against, which slice and which step is in progress, what is published as against merely prepared or requested, the exact commits and runs that are evidence so far, what you decided and what you withdrew on the way, and the single next action. It is a handover rather than a project-state claim, so it belongs on the pull request and never in `docs/SESSION-STATUS.md`, which still states only what has landed. Stopping without one is the same defect as a decision taken and not recorded, one step further on: the work survives and the reason for it does not, and the next implementor pays for the reconstruction. A slice that ended without a checkpoint is incomplete rather than merely unfinished.

## Plain git and pull-request workflow

Work directly on branches off `main`. Keep slices small and commits clean. Run local verification (`npm run format:check`, `npm run typecheck`, and the test suites) before opening or updating a pull request. Every pull request targets `main` and must pass CI cleanly.

### Your read has a budget, and it fails silently

A truncated contents read is indistinguishable from a whole one. There is no error, no marker, and no second call that returns the part the first one dropped, so a file past the response cap hands you a prefix and lets you believe it is the file. An anchor placed in that prefix can contradict an invariant written in the bytes you never received, which is the failure this budget exists to prevent rather than a readability preference.

Two numbers follow from it, and both are checked. No file under `packages/core/src` may exceed **60,000 bytes**, markdown included. A source over **30,000 bytes** keeps its private reasoning in a sibling document, `x.ts` beside `x.md`, so the member list arrives whole in one read even on a day the source does not.

The `read-budget` job in `CI` enforces them, and `node scripts/read-budget-scan.mjs` is the command it runs; scanner unit tests run in the single full suite. What you can do is act on them before the gate does: a slice that pushes a file past either number owes the split or the sister doc in the same commit.

Do not open a pull request that mixes infrastructure with behavior, and do not widen a slice past the file count its own body claims.
