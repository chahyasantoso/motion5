"""Temporary, bounded edit of docs/SESSION-STATUS.md for slice D of issue #223.

Runs once, from the temporary workflow that removes itself and this script in the same commit.
Every edit is an exact-string replacement and every anchor is required: a missing anchor exits
non-zero rather than writing a partial file, because a docs edit that silently matched nothing is
worse than one that failed loudly. See docs/PR-WORKFLOW.md, "Temporary workflow edits".
"""

import sys
from pathlib import Path

STATUS = Path("docs/SESSION-STATUS.md")

D_LANDED = """- **Just landed.** Slice D, `edit(recipe)`, and the hook derivation it earned. One recipe is one transaction: `n` authored ops across `m` tracks cost one candidate build, one `GraphBinding.replace`, one `ObservationState.commit`, one side-effect ordering with one rollback, and one flush, and a throw inside the recipe commits nothing, reaches no hook, and issues no live handle. `ProjectRuntime` is the one transaction owner and gains one piece of state, the open pair of maps; every structural read resolves against it while a recipe is open, so a two-step edit sees its own first step. `SchemaTransaction` is declared in `contract/` and `ProjectHandle` gains `edit`. `RA-62` through `RA-68` are its evidence and [ADR-064](./ADR-064-schema-transaction-derived-hooks.md) records the derivation, the two refusals, and the deferral that was read and refused.
- **The decision worth carrying forward from it.** A commit's hooks are derived from what it commits, because a hook list assembled by the entry point is correct for one change and cannot compose two. An add contributes an `addMotionTrack` to the settle steps and an edit contributes a `replaceMotionTrack` to the effects, effects run before the graph is asked and settle steps run after it accepted, so a track added and then edited in one recipe would have had the Motion asked to replace a track it had not been told about yet. Add-then-remove was the same shape one level worse: a mount settling for a node the committed graph does not contain. `SchemaPlan` is now the two maps and nothing else, and every entry point is a map builder that names no hook.
- **The second one, about when a refactor may travel with a capability.** The guardrail that a refactor exists to unblock a later slice ships alone still holds, and this one is the exception it always allowed: before a recipe exists, every commit carries exactly one change, so a derived hook list and a per-entry-point one are indistinguishable through the public surface. A slice shipped alone would have had no evidence of its own to write, only "the suite is still green". `RA-65` is the first case in this project's history that can tell the two apart, and it cannot exist without `edit`. That is the seventh entry in the "a plan's prescription is a measurement, not a premise" list.
- **Landed just before it.** Slice C3, the recompile predicate,"""

GUARDRAIL = """which is why the recompile predicate is not inside C2's four verbs. D is the one exception the rule always allowed rather than a break in it: a refactor whose correctness is indistinguishable from the behaviour it replaces until a new capability exists has no evidence of its own to ship with, so it ships with the first case that can tell the two apart and that case is named in the body.
- A verb that applies immediately is refused by name inside a transaction rather than deferred into it. A settle step cannot refuse, so deferring one would move its failure to after the graph committed and after the retained definition moved, and one condition would end up with two failure contracts. Tier 0 and tier 2 are both refused inside a recipe for that one reason, named at the verb so the message tells a caller which call to move out."""

COST = """- One recipe is one transaction. `edit(recipe)` opens one, hands the recipe a narrowed `SchemaTransaction`, and commits what it staged exactly once, so `n` authored ops across `m` tracks cost one candidate build, one graph replacement, one `ObservationState` commit and one flush. Reads inside it resolve against the staged pair, a handle issued inside it is live for the rest of the recipe and never live after an abort, and the recipe's own return value is the caller's. A recipe that staged nothing commits nothing, answered by identity on the pair rather than by a dirty flag. A recipe inside a recipe is `schema-transaction-nested`, and a tier 0 or tier 2 edit inside one is `schema-transaction-immediate`, named at the verb; `mount`, `seek`, `subscribe` and `dispose` are not reachable through the transaction at all.
- Every capability handle has one shape and one failure family."""

ANCHOR = """- The one recipe, one transaction slice: `RA-62` through `RA-68` in `packages/core/test/unit/runtime/schema-transaction.test.ts`. Red run [33393621794](https://github.com/chahyasantoso/motion5/actions/runs/33393621794), archived at `logs/33393621794/` on `ci-logs`. `typecheck` and `format:check` passed first, then 7 failed and 845 passed, all seven on assertions, with the other five checks green: `editing()` asserts the seam is a function before it is used, so no case failed on a call that could not run. Seven of seven red is what a capability slice should turn, and the derivation that travels with it has `RA-1` through `RA-7` and `U-5` through `U-8` as its equivalence evidence on both sides. The green run and its head sha live in the pull request body. See [ADR-064](./ADR-064-schema-transaction-derived-hooks.md).
- Animated live values: the failing-first and green runs are the `CI` runs on the pull request"""

EDITS = [
    (
        "landed together with optimisations 7a and 7c, and C3 open on"
        " `perf/ra-57-recompile-predicate`.",
        "landed together with optimisations 7a and 7c, and C3 and D landed after them.",
    ),
    (
        "authored under are all shipped. See `docs/DECISIONS.md` and ADR-028 through ADR-063.",
        "authored under, and one recipe committed as one transaction with a commit's hooks derived"
        " from what it commits rather than accumulated per op, are all shipped. See"
        " `docs/DECISIONS.md` and ADR-028 through ADR-064.",
    ),
    (
        "C is landed in both of its capability slices, and C3 is open with its evidence pushed"
        " first.",
        "C is landed in all three of its slices, and so is D.",
    ),
    (
        "**D is next, and it is `edit(recipe)`:** `n` ops over `m` tracks collapsing to one"
        " `builder.build`, one `GraphBinding.replace`, one `ObservationState.commit` and one flush,"
        " with abort semantics free from A1 because only `#commit` registers a handle's token."
        " `#snapshot` identity stability is what converts that from nice to load-bearing: every plan"
        " must reuse the existing `TrackDefinition` object for an untouched entry, or"
        " `IncrementalGraphBuilder`'s `cached.track === track` check stops hitting and a 200-op build"
        " stops being one rebuild.",
        "**E is next, and it is tier 2:** `setKeyframe(plugin, key, value)` and"
        " `removeKeyframe(plugin, key)`, routed through the existing `#writeValues` for a key the"
        " group already authors and through a pure editor for a new leaf in a bound group, with"
        " `keyframe-group-unbound` keeping the unbound case where C1 put it.",
    ),
    (
        "- **After it.** E is tier 2, `setKeyframe(plugin, key, value)` and"
        " `removeKeyframe(plugin, key)`, routed through the existing `#writeValues` for a key the"
        " group already authors and through a pure editor for a new leaf in a bound group, with"
        " `keyframe-group-unbound` keeping the unbound case where C1 put it. F deletes",
        "- **After it.** F deletes",
    ),
    ("- **Just landed.** Slice C3, the recompile predicate,", D_LANDED),
    ("which is why the recompile predicate is not inside C2's four verbs.", GUARDRAIL),
    ("- Every capability handle has one shape and one failure family.", COST),
    (
        "- Animated live values: the failing-first and green runs are the `CI` runs on the pull"
        " request",
        ANCHOR,
    ),
    (
        "C3 adds nothing to that list, because it changed no public surface and no rule id.",
        "C3 added nothing to that list, because it changed no public surface and no rule id. D adds"
        " three things to it: `api-reference.md` names no `edit(recipe)` and no `SchemaTransaction`,"
        " and `errors-and-diagnostics.md` enumerates neither `schema-transaction-nested` nor"
        " `schema-transaction-immediate`.",
    ),
]


def main() -> int:
    text = STATUS.read_text(encoding="utf-8")
    missing = [old for old, _ in EDITS if text.count(old) != 1]
    if missing:
        for old in missing:
            print(f"anchor not found exactly once: {old[:80]!r}", file=sys.stderr)
        return 1
    for old, new in EDITS:
        text = text.replace(old, new, 1)
    STATUS.write_text(text, encoding="utf-8")
    print(f"applied {len(EDITS)} bounded edits to {STATUS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
