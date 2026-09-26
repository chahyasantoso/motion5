# ADR-119: A handover publishes its notes and review

**Status:** Proposed in [#508](https://github.com/chahyasantoso/motion5/pull/508), 2026-09-26,
for [#507](https://github.com/chahyasantoso/motion5/issues/507); no merge is claimed here.

## Context

A handover currently gives a human a safe way to apply an authored patch series from a Codespaces
checkout. Issue #507 adds the missing end of that workflow: after `npm run patches` applies a
handover, the notes and the independent review should reach the GitHub discussion that owns the
work. The archive has to carry enough address and review information for that publication without
making the human reconstruct it or making a v1 archive mean something different.

The handover is applied before publication starts. That ordering matters: Git application is the whole-or-not-at-all operation owned by [ADR-112](./ADR-112-a-handover-applies-whole-or-not-at-all.md), while this record owns the publication boundary after the checkout has moved. Publication can stop without undoing an applied series, but every stop must leave enough durable information for a human to repair the cause and retry.

The owner asked on PR #508, “what if the branch is not published yet or not pushed yet?” The first
answer deferred that mechanical step as `branch-not-pushed`. That made the human do work the tool
can safely perform, and it prevented pull-request creation when the branch did not yet exist on the
remote. The publisher can instead push the exact applied tip, provided it never overwrites remote
commits. The branch decision therefore needs to be explicit, closed, and recorded alongside the
publication decision.

The review is independent evidence, not a gate that this publisher may reinterpret. Its source
format needs a pending state, needs to permit evidence to be unavailable as the issue says “when
available,” and must not let a publisher strengthen a result. The notes and review also need
idempotent publication: retrying after authentication, branch, or network repair must not create
duplicate comments, while corrected bytes must not be mistaken for an already published handover.

## Decision

The invariant is: **after a v2 handover applies, the publisher fast-forwards the addressed remote
branch to the exact applied tip when safe, then publishes the notes and the review exactly as
carried, at most once per publication identity; every non-published result retains its payload for
`npm run patches:publish`, and no operation force-pushes or rolls back the applied checkout.**

### Versioned address and compatibility

The handover manifest remains `motion5-handover`, and version 2 adds exactly `title` and `target`
to the v1 keys. `target` has exactly `repository`, `branch`, `into`, and `destination`. The
repository is a GitHub `owner/name`; `branch` is the branch carrying the applied tip; `into` is
the intended merge target; and destination is the closed union `pull-request { number }`, `branch`,
or `issue`.

A v1 manifest remains readable and applies with its old semantics. It has no publication address,
is represented as `unaddressed`, and is never published. The consumer never guesses a repository,
branch, title, or issue destination for v1, and it never upgrades v1 by adding v2 fields in memory.
The producer writes v2 and resolves missing address parts from explicit options or its checkout:
`--review`, `--title`, `--repository`, `--branch`, `--into`, `--pr`, and `--to-issue` are the
corresponding pack options.

The explicit pull-request destination is verified in the target repository and must have exactly
the target repository and target branch as its head. A branch destination discovers pull requests
for the target branch, filters out same-named heads from forks, and prefers an open pull request
into `target.into`. If there is no matching pull request, it opens one with the manifest title,
base branch, and notes-bearing body. An issue destination verifies and uses the manifest issue in
the target repository.

### Review contract

The optional `REVIEW.json` component has format `motion5-review`, version `1`, and exactly
`status`, `reviewer`, `summary`, `findings`, and `evidence` in addition to those format fields.
Status is `passed`, `failed`, or `pending`. A finding has `severity` (`blocking` or `advisory`),
`state` (`open`, `fixed`, or `deferred`), `title`, and `detail`. A `passed` review is refused as
`invalid-review` while any blocking finding is not fixed; advisory findings do not block a pass,
and failed or pending reviews carry no extra blocking-finding rule.

`evidence` is either a string or null. A string is a link or identifier for the full evidence when
available; null is valid because evidence may not be available. Null renders as `not provided` in
the published review, rather than refusing the archive. The review is carried verbatim: publication
never upgrades a status, closes a finding, invents evidence, or otherwise claims more than the
review file states. When no review component exists, the notes body says that the independent
review was not provided.

### Identity, markers, and durable retry

The publication identity is the handover name followed by a short SHA-256 digest. The digest covers
the exact `handover.json` bytes and the exact bytes of every notes and review component, each framed
by its component path. It deliberately excludes zip metadata and does not cover checkpoint, bundle,
opaque, compression, or timestamp bytes. Repacking the same manifest, notes, and review therefore
keeps the identity; changing any publication content produces a new identity.

The publisher marks each part with a hidden identity marker. The pull-request body opened by this
publisher carries the pull-request and notes markers; a notes comment carries the notes marker; and
a review comment carries the review marker. Before posting, the publisher reads the pull-request
body and all comments and skips an already marked part. This makes a retry idempotent for the same
identity. It does not hide a changed notes or review file, because changed publication bytes have a
different identity.

The publisher writes the complete applied payload to the Git directory under the resolved
`motion5-handover/pending` path before it contacts GitHub. The payload includes the identity,
address, notes, review, exact applied tip, and applied commits. It removes that file only after all
owed publication parts are present. Deferrals, failures, and crashes leave the payload for
`npm run patches:publish`, which retries pending payloads in name order. A malformed saved payload
is reported as a failed read and remains for investigation.

### Branch publication is safe, exact, and first

GitHub checks happen through the human's own `gh` login. The publisher does not read or accept a stored token. It first finds a configured Git remote whose raw GitHub URL names the target repository and whose every `pushurl`, when set, names it as well, because `git push` uses a `pushurl` in place of the URL; it then verifies `gh` exists, and checks `gh auth status` for github.com.

After those checks, it reads the remote branch with `git ls-remote`. If the remote tip is not known
locally, it fetches it first with `git fetch --no-tags <remote> refs/heads/<branch>`. A shallow
checkout can hold both tips without the history joining them, so there a divergence verdict is
checked again after `git fetch --unshallow`. Network Git commands run with `GIT_TERMINAL_PROMPT=0`:
publication runs inside a bounded subprocess, so a missing credential must fail as a `failed` push
rather than wait on a prompt nobody sees. The result is classified into a closed union:

- `up-to-date`: the remote tip equals the applied tip or already contains the applied tip; nothing
  is pushed.
- `absent`: the remote branch is not published; the publisher runs
  `git push <remote> <tip>:refs/heads/<branch>` to create it.
- `behind`: the remote tip is an ancestor of the applied tip; the same refspec fast-forwards it.
- `diverged`: the remote has commits the applied tip lacks; the publisher never force-pushes and
  defers as `branch-diverged { remote, branch, tip, remoteTip }`.

Before either push, the checkout's own `refs/heads/<branch>` must contain the applied tip, or the publisher defers as `branch-not-local { branch, tip }` and writes nothing. A push publishes the whole history under the tip, so a handover applied on another branch would otherwise publish that branch's unrelated commits under the target's name.

A rejected push, including a race or missing Git credentials, is a `failed` publication at step
`push`, and the payload remains for retry. The push names the exact applied tip SHA, not `HEAD`, and
is fast-forward-only. It occurs before any GitHub comment, issue, or pull-request write, so every
posted comment cites commits GitHub can show. A successful publication reports a branch result of
`{ kind: "up-to-date" }`, `{ kind: "created" }`, or `{ kind: "fast-forwarded", from: "<sha>" }`.

For `branch-diverged`, the human must merge the remote branch without rewriting the applied commits,
for example `git pull --no-rebase <remote> <branch>`, push the merge, and run
`npm run patches:publish`. A merge keeps the applied commits so the notes still cite real commits;
a rebase would orphan those commits and is not the recovery instruction. The old `branch-not-pushed`
deferral is removed: absent and behind branches are mechanical safe pushes, while only divergence
requires a human decision.

### Content, bounds, and publication outcomes

A notes body names the applied commits and tip, includes one independent-review line, and then carries the notes. A review comment carries status, reviewer, summary, findings, and evidence, with null evidence rendered as `not provided`. Bodies are bounded to 60,000 characters, the cut notice included. A body that would exceed the bound is cut and carries a pointer to the complete `NOTES.md` and `REVIEW.json` files in the handover zip.

A branch-created pull request contains the notes in its body and is marked as already carrying the
notes, so it does not receive a separate notes comment. An existing pull request or an issue gets a
notes comment and, when present, a review comment. Markers make the parts individually retryable.

Publication outcomes are `opted-out`, `unaddressed`, `deferred`, `failed`, and `published`. `opted-out` is selected by `--no-publish`; it also skips the branch push, while normal inbox cleanup still applies unless `--keep` is supplied. `unaddressed` is the v1 compatibility result. `deferred` names a repairable human condition and retains its payload. `failed` names a step and reason and retains its payload, including a rejected push. `published` reports the destination, whether a pull request was created, which parts were posted or already present, and the branch result. Dry-run never pushes, contacts GitHub, or creates a pending publication.

The deferral union is `remote-missing`, `gh-missing`, `gh-unauthenticated`, `branch-not-local`, `branch-diverged`, and `pull-request-elsewhere`. For `remote-missing`, the human adds a matching remote, for example `git remote add origin https://github.com/<owner>/<name>.git`; for `gh-missing`, the human installs `gh` and runs `gh auth login`; and for `gh-unauthenticated`, the human runs `gh auth login`. Each then reruns `npm run patches:publish`. An explicit pull request with the wrong head is not touched; the human must address a new handover correctly or post the notes by hand.

## Rejected

**Deferring every unpublished branch.** The owner’s PR #508 question exposed that an absent or
behind branch required only a safe mechanical push. Deferring it made the human repeat work the
tool can do, and it prevented the publisher from creating the pull request it was asked to create.
The publisher now pushes the exact applied tip when the remote is absent or behind.

**Force-pushing the target branch.** A force push could erase remote commits and conceal a race. The
closed ancestry check and fast-forward-only push preserve remote work; divergence is deferred with
an explicit merge-and-retry instruction.

**Pushing `HEAD`.** `HEAD` is not the publication contract after application and may move or name a
different commit. The applied tip is captured from the proved patch worktree and is the only SHA
pushed or cited.

**Refusing a review with null evidence.** The issue says evidence is included “when available.”
Null is therefore a valid declaration rendered as `not provided`, not a reason to reject an
otherwise valid review.

**Upgrading a review while publishing.** Publication is transport, not a second reviewer. A
pending or failed source result remains pending or failed, and the source findings remain unchanged.

**A local lock against concurrent publishers.** The issue asks that repeated attempts not duplicate, and a sequential retry reads every marker and the branch's pull requests before it writes. Two publishers running at the same moment could still both see nothing and both write, but GitHub offers no create-if-absent primitive for a comment or a pull request, so a lock in one checkout would not cover a second checkout and would add a stale-lock failure mode of its own. Concurrent publication of one handover is left as a known limit rather than half-solved.

**Assuming comments are idempotent by text.** Text equality would conflate corrected content with an
old publication. Identity markers make exactly one archive’s parts retryable and leave changed
publication bytes distinct.

## Consequences

A human can apply a v2 handover and have its exact applied commits made visible before the notes are
posted, including when the remote branch did not exist or merely lagged. Pull-request creation now
has the branch it needs, and comments never intentionally cite commits GitHub cannot resolve. The
publisher is non-destructive: it never force-pushes, and it asks for a merge when remote history
and the applied tip diverge.

Applying a handover can now leave a durable payload in the Git directory and require a later
`npm run patches:publish`; that is intentional rather than a lost note or a second application.
Publication remains best-effort after application, so a GitHub outage or credential problem cannot
undo the applied commits. The 60,000-character bound means GitHub may show a pointer rather than
all note or review text, while the zip remains the complete record.

V1 remains useful for compatibility but has no publication behavior. Producers must supply or
resolve an address for v2, and reviewers must understand that a passed review is rejected while a
blocking finding remains open or deferred. A review without available evidence is still useful but
is visibly marked as such.

The implementation and test suite are the evidence owners for the exact command invocations and
result shapes. This ADR records the contract and rationale; it does not claim a merge or a CI run
that is not named here.

## Evidence

Issue [#507](https://github.com/chahyasantoso/motion5/issues/507) requested publishing handover notes and independent review after `npm run patches`. The owner’s question on [PR #508](https://github.com/chahyasantoso/motion5/pull/508) asked what happens when the branch is not published or not pushed, which motivated replacing the mechanical deferral with an exact-tip, fast-forward-only push. The implementation comments and format validators name ADR-119 and define the v2 address, review validation, publication identity, markers, pending payload, and `gh` boundary. No merge or CI result is claimed by this proposed record.
