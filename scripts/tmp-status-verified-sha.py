"""Temporary, bounded correction of the "Verified on" line in docs/SESSION-STATUS.md.

Runs once, from the temporary workflow that removes itself and this script in the same commit.
The edit is a single exact-string replacement and the anchor is required to match exactly once: a
missing or duplicated anchor exits non-zero rather than writing a partial file, because a docs edit
that silently matched nothing is worse than one that failed loudly. See docs/PR-WORKFLOW.md,
"Temporary workflow edits".

The line claimed `main` at `e9e9188`, which predates both slice C3 (#246) and slice D (#247), so the
file asserted that two slices had landed while pinning a tree in which neither existed. The
replacement names `7e3c4ba`, the squash that landed D and the last commit on `main` that changed
`packages/`, and states the rule that chose it so the line is not re-broken the same way.
"""

import sys
from pathlib import Path

STATUS = Path("docs/SESSION-STATUS.md")

OLD = (
    "- **Verified on:** `main` at `e9e9188`, with slices A1, A2, A3, B1, B2, C1 and C2 of"
    " [issue #223](https://github.com/chahyasantoso/motion5/issues/223) landed together with"
    " optimisations 7a and 7c, and C3 and D landed after them."
)

NEW = (
    "- **Verified on:** `main` at `7e3c4ba`, the squash that landed slice D, with slices A1, A2, A3,"
    " B1, B2, C1, C2, C3 and D of"
    " [issue #223](https://github.com/chahyasantoso/motion5/issues/223) all landed, together with"
    " optimisations 7a and 7c. The sha names the last commit that changed `packages/` rather than the"
    " head of `main`, because a status file cannot cite the commit it is written in and a docs-only"
    " commit verifies no behaviour."
)


def main() -> int:
    text = STATUS.read_text(encoding="utf-8")
    found = text.count(OLD)
    if found != 1:
        print(f"anchor matched {found} times, expected exactly 1", file=sys.stderr)
        return 1
    STATUS.write_text(text.replace(OLD, NEW, 1), encoding="utf-8")
    print(f"corrected the Verified on line in {STATUS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
