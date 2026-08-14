# Recovery progress

`progress/STATUS.md` is the single source of truth for slice status. Read and update it first.

There is no local checkout on this recovery. Manually dispatched GitHub Actions is the only runner, so a slice log records dispatches and run URLs, never shell commands that nobody can execute.

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
- CI workflow run (slice checks):
- Recovery audit dispatch (ref, base, run URL):
- Failing-first verdict from that run:
- Artifact links:
- Known gaps:
- Next exact action:
```

Failing-first is proven by the audit workflow's `failing-first` job, which runs the slice's new tests against the base commit and then against the slice head. Do not hand-cut a red evidence branch, and do not ship a second relaxed copy of a test: vitest transpiles without typechecking, so one strictly typed test file executes correctly on both legs.

Never let a slice log disagree with `progress/STATUS.md`. If the evidence changes, update the status table first, then the detailed log.
