# Formatting

Prettier is the only formatting authority. Touched-file normalization may accompany the requested change; unrelated formatting stays in a separate mechanical commit. A behavior request never authorizes a repository-wide formatting pass.

## Local commands

```bash
npm run format
npm run format:check
```

The first writes changes. The second is read-only. Run the formatter before pushing when the repository toolchain is available; otherwise state that local checks were not run.

## The read-only CI gate

`quality` runs formatting, typechecking, discovery, and the full suite independently after a successful installation. Formatting drift fails the job without suppressing behavioral evidence. The integration and end-to-end compatibility contexts still require successful quality evidence. No CI job repairs the contributor branch. [CI-WORKFLOW.md](./CI-WORKFLOW.md) owns the complete gate contract.

## Manual repair escape hatch

[format.yml](../.github/workflows/format.yml), named **Format manually**, remains deliberately dispatch-only. It accepts a same-repository `branch`, uses `PERSONAL_ACCESS_TOKEN`, runs `npm run format`, and pushes a mechanical formatting commit when needed. Nothing dispatches it automatically after green behavioral checks.

Use a maintainer dispatch when your connection lacks it. Select the contributor branch explicitly, not the default `main`. Review the changed paths and fresh exact-head CI. A fork branch is not reachable by this same-repository repair route; format in the fork instead.

## Configuration and authoring traps

The reviewed `.prettierrc.json` uses 100 columns, double quotes, trailing commas everywhere, and `proseWrap: preserve`. `.prettierignore` excludes generated files. Changes to formatter version or configuration need their own review; unrelated resulting reformatting stays separate.

Keep prose paragraphs on one line or wrap them yourself at or under 100 columns. Do not author Markdown tables. Prettier formats recognized fenced code blocks as source, so use a `text` fence only for genuine templates or pseudocode. A malformed source fence can fail formatting.
