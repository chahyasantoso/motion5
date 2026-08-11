# Recovery progress

Use one file per slice, for example `progress/B1-contribute.md` or `progress/C1-react-store.md`.

Copy this template:

```md
# <slice>

- Status: not started | red | green | blocked
- Branch:
- Commit:
- Oracle repository and revision:
- Oracle files inspected:
- Motion5 files changed:
- Acceptance test IDs:
- Failing-first evidence:
- Passing command and result:
- CI workflow run and artifact links:
- Known gaps:
- Next exact action:
```

Rules:

- `green` means the executable acceptance test passed against the real boundary, not merely that typecheck passed.
- Keep the first failing run and the final passing run linked from the PR or workflow artifact.
- One slice per file. Do not overwrite history; append a dated note when a result changes.
- If implementation and test disagree, compare against `motionpath` before changing either one.
