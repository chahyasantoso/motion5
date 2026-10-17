# Formatting

Prettier is the only formatting authority. Touched-file normalization may accompany the requested change;
unrelated formatting stays in a separate mechanical commit. A behavior request never authorizes a
repository-wide formatting pass.

## Local commands

```bash
npm run format        # writes changes
npm run format:check  # read-only
```

Run the formatter before pushing. If you do not have the toolchain, state that local checks were not run.

## Configuration

`.prettierrc.json`: 100 columns, double quotes, trailing commas everywhere, `proseWrap: preserve`. Keep
prose on one line or wrap it yourself at or under 100 columns. Do not author Markdown tables. Prettier
formats recognized fenced code blocks as source; use a `text` fence only for genuine pseudocode or
templates. Changes to formatter version or configuration need their own review.

## CI gate

`quality` runs formatting read-only after a successful install. Drift fails the job without suppressing
behavioral evidence. No CI job repairs the contributor branch. See [CI-WORKFLOW.md](./CI-WORKFLOW.md).

## Manual repair

[format.yml](../.github/workflows/format.yml) (**Format manually**) is dispatch-only. Select the
contributor branch explicitly, not `main`. Review changed paths and fresh exact-head CI before merging.
