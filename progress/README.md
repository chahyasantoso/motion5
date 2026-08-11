# Recovery progress

`progress/STATUS.md` is the single source of truth for slice status. Read and update it first.

Use one optional file per slice, for example `progress/B2-gsap.md`, only when detailed evidence does not fit in the status table. Each slice log should contain:

```md
# <slice>

- Status:
- Branch:
- Parent commit:
- Final commit:
- Oracle repository and revision:
- Oracle files inspected:
- Motion5 files changed:
- Invariant:
- Acceptance test IDs and paths:
- Failing-first command and result:
- Passing command and result:
- CI workflow run:
- Artifact links:
- Known gaps:
- Next exact action:
```

Never let a slice log disagree with `progress/STATUS.md`. If the evidence changes, update the status table first, then the detailed log.
