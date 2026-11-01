# ADR-119: A handover publishes its notes and review

**Status:** Proposed in [#508](https://github.com/chahyasantoso/motion5/pull/508), 2026-09-26,
for [#507](https://github.com/chahyasantoso/motion5/issues/507); no merge is claimed here.
**Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

Handover gives human safe way to apply authored patch series from Codespaces checkout. Issue #507 adds missing
end: after `npm run patches` applies handover, notes + independent review should reach GitHub discussion owning
work. Archive must carry enough address and review information for that publication without making human
reconstruct it, without making v1 archive mean something different.

Handover applied before publication starts. Ordering matters: Git application = whole-or-not-at-all operation
owned by [ADR-112](./ADR-112-a-handover-applies-whole-or-not-at-all.md), this record owns publication boundary
after checkout moved. Publication can stop without undoing applied series, but every stop must leave enough
durable information for human to repair cause and retry.

Owner asked on PR #508, "what if the branch is not published yet or not pushed yet?" First answer deferred that
mechanical step as `branch-not-pushed`. Made human do work tool can safely perform, prevented pull-request
creation when branch did not yet exist on remote. Publisher can instead push exact applied tip, provided it never
overwrites remote commits. Branch decision therefore needs explicit, closed, recorded alongside publication
decision.

Review = independent evidence, not gate this publisher may reinterpret. Source format needs pending state, needs
permit evidence unavailable as issue says "when available", must not let publisher strengthen result. Notes and
review also need idempotent publication: retry after authentication, branch or network repair must not create
duplicate comments, corrected bytes must not be mistaken for already published handover.

## Decision

Invariant: **after a v2 handover applies, the publisher fast-forwards the addressed remote
branch to the exact applied tip when safe, then publishes the notes and the review exactly as
carried, at most once per publication identity; every non-published result retains its payload for
`npm run patches:publish`, and no operation force-pushes or rolls back the applied checkout.**

### Versioned address and compatibility

Manifest remains `motion5-handover`, version 2 adds exactly `title` + `target` to v1 keys. `target` has exactly
`repository`, `branch`, `into`, `destination`. Repository = GitHub `owner/name`; `branch` = branch carrying
applied tip; `into` = intended merge target; destination = closed union `pull-request { number }`, `branch`,
`issue`.

v1 manifest stays readable, applies with old semantics. No publication address, represented `unaddressed`, never
published. Consumer never guesses repository, branch, title, issue destination for v1, never upgrades v1 by
adding v2 fields in memory. Producer writes v2, resolves missing address parts from explicit options or checkout:
`--review`, `--title`, `--repository`, `--branch`, `--into`, `--pr`, `--to-issue` = corresponding pack options.

Explicit pull-request destination verified in target repository, must have exactly target repository + target
branch as its head. Branch destination discovers pull requests for target branch, filters same-named heads from
forks, prefers open pull request into `target.into`. Discovery reads REST pull-request list filtered
`head=<owner>:<branch>`, `state=all`, `gh api --paginate` to its end → "no pull request" means none exists, not
none among first page; fixed `gh pr list --limit` read would open second pull request for branch whose own one
sat past limit. No matching pull request → opens one with manifest title, base branch, notes-bearing body. Issue
destination verifies and uses manifest issue in target repository.

### Review contract

Optional `REVIEW.json` component: format `motion5-review`, version `1`, exactly `status`, `reviewer`, `summary`,
`findings`, `evidence` besides format fields. Status `passed`, `failed`, `pending`. Finding has `severity`
(`blocking`/`advisory`), `state` (`open`/`fixed`/`deferred`), `title`, `detail`. `passed` review refused
`invalid-review` while any blocking finding not fixed; advisory findings do not block pass, failed or pending
reviews carry no extra blocking-finding rule.

`evidence` string or null. String = link/identifier for full evidence when available; null valid because evidence
may be unavailable. Null renders `not provided` in published review rather than refusing archive. Review carried
verbatim: publication never upgrades status, closes finding, invents evidence, claims more than review file
states. No review component → notes body says independent review not provided.

### Identity, markers, and durable retry

Publication identity = handover name + short SHA-256 digest. Digest covers exact `handover.json` bytes and exact
bytes of every notes and review component, each framed by its component path. Deliberately excludes zip metadata,
does not cover checkpoint, bundle, opaque, compression, timestamp bytes. Repacking same manifest, notes, review →
identity kept; changing any publication content → new identity.

Publisher marks each part with hidden identity marker. Pull-request body opened by this publisher carries
pull-request + notes markers; notes comment carries notes marker; review comment carries review marker. Before
posting, publisher reads pull-request body and all comments, skips already marked part. Retry idempotent for same
identity. Does not hide changed notes or review file — changed publication bytes have different identity.

Publisher writes complete applied payload to Git directory under resolved `motion5-handover/pending` path before
contacting GitHub. Payload includes identity, address, notes, review, exact applied tip, applied commits. Removes
file only after all owed publication parts present. Deferrals, failures, crashes leave payload for
`npm run patches:publish`, retries pending payloads in file-name order. File named `<identity>.json` not
`<name>.json` → repacked handover with corrected notes saves beside earlier publication still waiting rather than
overwriting. Retry trusts every field it publishes → saved payload validated whole before any Git or GitHub call:
exactly saved keys, identity naming its file, address held to manifest's own title and target rules by format
module (`addressedAddress`), review held to `handoverReview`, full-SHA commits ending at applied tip. Malformed or
foreign payload reported as failed `read-pending` result, remains for investigation.

Saving payload inside publication's result boundary. Failure to save = `failed` at step `save-pending` with
`pending: null` → human told nothing saved; any later failure names saved file. Removing scratch directory
best-effort, never replaces result already chosen.

### Branch publication is safe, exact, and first

GitHub checks through human's own `gh` login. Publisher reads/accepts no stored token. First finds configured Git
remote whose raw GitHub URL names target repository and whose every `pushurl`, when set, names it too — `git push`
uses `pushurl` in place of URL; then verifies `gh` exists, checks `gh auth status` for github.com.

After checks, reads remote branch with `git ls-remote`. Remote tip not known locally → fetch first
`git fetch --no-tags <remote> refs/heads/<branch>`. Shallow checkout can hold both tips without history joining
them → divergence verdict checked again after `git fetch --unshallow`. Network Git commands run
`GIT_TERMINAL_PROMPT=0`: publication inside bounded subprocess → missing credential must fail as `failed` push,
not wait on prompt nobody sees. Result classified into closed union:

- `up-to-date`: remote tip equals applied tip or already contains it; nothing pushed.
- `absent`: remote branch not published; publisher runs
  `git push <remote> <tip>:refs/heads/<branch>` to create it.
- `behind`: remote tip ancestor of applied tip; same refspec fast-forwards.
- `diverged`: remote has commits applied tip lacks; never force-pushes, defers
  `branch-diverged { remote, branch, tip, remoteTip }`.

Before either push, checkout's own `refs/heads/<branch>` must contain applied tip, else defers
`branch-not-local { branch, tip }` and writes nothing. Push publishes whole history under tip → handover applied
on another branch would publish that branch's unrelated commits under target's name.

Rejected push, race or missing Git credentials included = `failed` publication at step `push`, payload remains
for retry. Push names exact applied tip SHA not `HEAD`, fast-forward-only. Occurs before any GitHub comment,
issue, pull-request write → every posted comment cites commits GitHub can show. Successful publication reports
branch result `{ kind: "up-to-date" }`, `{ kind: "created" }`, `{ kind: "fast-forwarded", from: "<sha>" }`.

For `branch-diverged`, human must merge remote branch without rewriting applied commits, e.g.
`git pull --no-rebase <remote> <branch>`, push merge, run `npm run patches:publish`. Merge keeps applied commits so
notes still cite real commits; rebase would orphan them, not the recovery instruction. Old `branch-not-pushed`
deferral removed: absent and behind branches = mechanical safe pushes, only divergence requires human decision.

### Content, bounds, and publication outcomes

Notes body names applied commits + tip, includes one independent-review line, then carries notes. Review comment
carries status, reviewer, summary, findings, evidence, null evidence rendered `not provided`. Bodies bounded 60,000
characters, cut notice included. Body exceeding bound cut, carries pointer to complete `NOTES.md` and
`REVIEW.json` in handover zip.

Branch-created pull request contains notes in body, marked as already carrying notes → no separate notes comment.
Existing pull request or issue gets notes comment and, when present, review comment. Markers make parts
individually retryable.

Publication outcomes `opted-out`, `unaddressed`, `deferred`, `failed`, `published`. `opted-out` by `--no-publish`;
also skips branch push, normal inbox cleanup still applies unless `--keep`. `unaddressed` = v1 compatibility
result. `deferred` names repairable human condition, retains payload. `failed` names step + reason, retains
payload, rejected push included. `published` reports destination, whether pull request created, which parts posted
or already present, branch result. Dry-run never pushes, contacts GitHub, creates pending publication.

Deferral union `remote-missing`, `gh-missing`, `gh-unauthenticated`, `branch-not-local`, `branch-diverged`,
`pull-request-elsewhere`. `remote-missing` → human adds matching remote e.g.
`git remote add origin https://github.com/<owner>/<name>.git`; `gh-missing` → installs `gh`, runs `gh auth login`;
`gh-unauthenticated` → runs `gh auth login`. Each then reruns `npm run patches:publish`. Explicit pull request
with wrong head not touched; human must address new handover correctly or post notes by hand.

## Rejected

**Deferring every unpublished branch.** Owner's PR #508 question exposed absent or behind branch required only
safe mechanical push. Deferring made human repeat work tool can do, prevented publisher creating pull request it
was asked to create. Publisher now pushes exact applied tip when remote absent or behind.

**Force-pushing target branch.** Force push could erase remote commits, conceal race. Closed ancestry check +
fast-forward-only push preserve remote work; divergence deferred with explicit merge-and-retry instruction.

**Pushing `HEAD`.** `HEAD` not publication contract after application, may move or name different commit. Applied
tip captured from proved patch worktree, only SHA pushed or cited.

**Refusing review with null evidence.** Issue says evidence included "when available". Null = valid declaration
rendered `not provided`, not reason to reject otherwise valid review.

**Upgrading review while publishing.** Publication is transport, not second reviewer. Pending or failed source
result stays pending or failed, source findings unchanged.

**Local lock against concurrent publishers.** Issue asks repeated attempts not duplicate; sequential retry reads
every marker and branch's pull requests before writing. Two publishers same moment could both see nothing and both
write, but GitHub offers no create-if-absent primitive for comment or pull request → lock in one checkout would not
cover second checkout, adds stale-lock failure mode of its own. Concurrent publication of one handover left as
known limit rather than half-solved.

**Assuming comments idempotent by text.** Text equality conflates corrected content with old publication.
Identity markers make exactly one archive's parts retryable, leave changed publication bytes distinct.

## Consequences

Human applies v2 handover, its exact applied commits made visible before notes posted — including when remote
branch did not exist or merely lagged. Pull-request creation now has branch it needs, comments never
intentionally cite commits GitHub cannot resolve. Publisher non-destructive: never force-pushes, asks for merge
when remote history and applied tip diverge.

Applying handover can leave durable payload in Git directory, require later `npm run patches:publish` —
intentional, not lost note or second application. Publication stays best-effort after application → GitHub outage
or credential problem cannot undo applied commits. 60,000-character bound means GitHub may show pointer rather than
all note or review text, zip remains complete record.

v1 stays useful for compatibility, no publication behavior. Producers must supply or resolve address for v2,
reviewers must understand passed review rejected while blocking finding open or deferred. Review without available
evidence still useful, visibly marked.

Implementation and test suite own evidence for exact command invocations and result shapes. This ADR records
contract and rationale; claims no merge or CI run not named here.

## Third independent pass

Third pass, not told what first two concluded, read publisher, format and apply modules, end-to-end exercise
against bare remote and fake `gh`. Found five things, four fixed with case failing without fix: branch discovery
truncated at 200 pull requests (HO-65), pending payload trusted after checking two fields (HO-66), pending files
keyed by name so second publication of one name overwrote first (HO-67), saving or scratch setup failing outside
result boundary, reporting `pending: null` for payload that had been saved (HO-68). Format module accepted branch
components Git refuses — `feat/.hidden`, `feat/x.lock/y` → addressed handover could apply then fail at push; every
slash-separated component now held to Git's rules (HO-64). Fifth, concurrent publishers racing, is the lock already
rejected above, stays rejected same reason.

## Evidence

Issue [#507](https://github.com/chahyasantoso/motion5/issues/507) requested publishing handover notes and
independent review after `npm run patches`. Owner's question on
[PR #508](https://github.com/chahyasantoso/motion5/pull/508) asked what happens when branch not published or not
pushed, motivating replacing mechanical deferral with exact-tip, fast-forward-only push. Implementation comments
and format validators name ADR-119, define v2 address, review validation, publication identity, markers, pending
payload, `gh` boundary. No merge or CI result claimed by this proposed record.
