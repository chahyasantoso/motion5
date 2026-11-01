# ADR-112: A handover applies whole or not at all

**Status:** Proposed in [#488](https://github.com/chahyasantoso/motion5/pull/488), 2026-09-24,
stacked on #349 phase 6 (ADR-111) in the same pull request. Closes
[#487](https://github.com/chahyasantoso/motion5/issues/487) when merged; no merge is claimed here.
**Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

Issue #487 = infrastructure for human with Codespaces access, not AI automation. Procedure deliberately small: download handover zip into dedicated folder, run one command; command scans folder, extracts zip, applies patches, clears contents only after success. Contract must make procedure safe without human understanding AI checkpoint transport. Human-facing contract [HANDOVER-FORMAT.md](./HANDOVER-FORMAT.md); this record owns why application atomic.

Infrastructure; AGENTS.md asks separate landing from #349 behavior work. Pull request #488 carries both, phase 6 commits first, these after → separable commit by commit despite one review. ADR-111 = phase 6 record → this record takes ADR-112. #349 phase 7 plan earmarked 112 for envelope record; second to land takes next free number; `adr-integrity` refuses collision.

Measurements: sandbox 2026-09-24, main snapshot `7e6f4edc`, sample `motion5-349-handover-p6-cp001.zip`.

**The patch series was sufficient.** `git am -3 p6/patches/*.patch` on repository built from main snapshot: all three commits clean. Blob ids = final `post` ids declared in sample `p6/cpstore/cp001/manifest.json`, all nine of nine touched paths. Application source stays authored format-patch series; post-image ids = gate after each patch.

**The bundle was not portable as received.** `git bundle verify work.bundle` failed: `Repository lacks these prerequisite commits: 24e14071c39c...`. Sandbox local mirror: same tree as `7e6f4edc`, different commit id. Bundle names commit prerequisites, not just tree → bundle from that base unusable to consumer holding declared base.

**The sample had no owner for its layout.** No manifest. Shape = whatever sandbox build script copied: `tools/`, `p6/{cpstore,patches,corpus,probe}`, `NOTES.md`, `harness-baseline.sum`, `work.bundle`. Consumer could not separate required input from supporting evidence, detect missing or stray file, reject future layout without second version.

**The same change had two unlinked representations.** Sample carried format-patch series + checkpoint diffs; nothing stated agreement. Two representations, no comparison = two owners → consumer could apply bytes other representation never certified.

## Decision

Invariant: **handover changes checkout only after complete archive, base, patch chain, every declared post-image pass validation in disposable worktree; else checkout and inbox zip unchanged.** Patch series = sole change owner; notes, checkpoint store, bundle, opaque evidence = declared components, narrower roles.

### The inbox and human command

Repository-root `.handover/` gitignored = inbox. `npm run patches` finds exactly one zip. Empty inbox → `nothing-to-do`, exit 0. Multiple zips → `ambiguous-inbox`; non-zip entry → `foreign-entry`. `--dry-run` = same pipeline, no final fast-forward; `--keep` = retain archive after successful apply.

Preflight refuses missing committer identity, detached HEAD, operation in progress (`am`, rebase, merge, cherry-pick, revert), dirty tree including untracked files. Human must commit or stash `git stash -u`; command never hides those changes in recovery. Inbox excluded from dirty-tree check by pathspec, not `.gitignore`: first handover lands on checkout without ignore rule, zip untracked; rule reliance refused exactly that handover. `discoverInbox` already owns inbox contents → exclusion hides nothing check was for.

### The v1 archive and manifest

Archive: exactly one top-level folder, name = `handover.json` `name`. Listing read before extraction. Max 2,000 entries, 64 MiB uncompressed, regular files and directories only, no symlinks or special entries, path segments matching `[A-Za-z0-9_.@+-]`. Refuses absolute paths, backslashes, dot segments, empty segments, files outside one root. Extracted set must equal listing.

Manifest: exactly keys `format`, `version`, `name`, `issue`, `base`, `patches`, `components`. Format `motion5-handover`, version `1` required; unknown format or version refused by name, not guessed. Every patch: exactly `seq`, `file`, `sha256`, `pre`, `post`. Sequence number + four-digit filename agree; digest covers patch bytes; pre/post maps cover same paths, full blob ids or null.

Chain reuses `checkpointChain()` from `checkpoint-policy.mjs` → existing max 20 patches, 50 paths inherited, not restated by second owner. First patch pre image per path = base blob; later pre image = preceding post image. `base-disagrees` = checkout base bytes differ from first pre image. Commit subjects not duplicated: patch file owns commit metadata.

Components: closed union. Exactly one Markdown `notes`; at most one `checkpoint` folder `cpNNN`, one `.bundle`; `opaque` may carry extracted material consumer never executes. Manifest declares every stored file; every declaration present. Checkpoint derived from series: own manifest + declared diff digests match, base = handover base, final post-image map = series tip. Comparison = sole agreement owner; checkpoint never applied instead of series.

### Validation and application

Producer and consumer share `inspectArchive`: listing, extraction, manifest, exact contents, patch SHA-256 digests, checkpoint agreement, bundle header, before repository validation. Bundle accepted only with exactly one prerequisite = handover base. Producer refuses `--bundle` when `--from` not base → no sandbox-only commit id shipped as portable prerequisite.

Base proved by commit where checkout holds it, by content where not. Held base commit: ancestor of HEAD, carries every first pre-image. Paths changed since base allowed through `git am --3way`, reported `reconciled` for human review, not silently author's post-image. Base commit not held: content proof — HEAD carries every first pre-image, nothing reconciled, every post-image compared; else `base-missing`, naming first differing path. Fallback = measurement, not preference: slice stacked on unpublished #349 phase 6 series, commit ids exist only in producing sandbox, differ again after human `git am` → commit-only rule refuses every stacked handover while bytes present. Content = rule checkpoint route already chains by ([ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md)), strictly stronger per path than ancestry: every post-image compared. Declared bundle also Git-checked.

Series applied patch by patch, `git am --3way` in detached `git worktree` of HEAD, temporary directory. After each patch, every declared post blob read back from worktree. Only all patches passing → real checkout `git merge --ff-only` to temporary tip. Nothing holds checkout while series proved → HEAD moved = `head-moved`; tree edited meantime = `dirty-tree`; both leave checkout as other process left it, keep zip. Edit fast-forward does not touch (new file beside series) carried by Git as any `merge --ff-only`: series lands on proved tip, edit survives. Refusing or rolling back proved publication because another writer touched something else rejected: would discard or undo bytes command does not own. Lock considered, not taken: Git index lock already atomic; second lock = second owner crash can leave behind. Conflict aborts temporary `git am`, real checkout untouched, inbox zip kept, extracted series retained → printed recovery command: `git am --3way` all patches, resolve and stage conflicts, `git am --continue` or `git am --abort`.

`describeRefusal` = sole refusal-word owner; `describeOutcome` = sole outcome-word + exit-status owner. Closed switches exhaustively cover inbox discovery, refusal kinds, outcome kinds, component kinds, zip entry kinds. Format/apply/pack/CLI modules therefore no competing failure interpretations.

### Producer and ownership

Producer: `node scripts/handover.mjs pack --issue <n> --from <rev> [--to <rev>] [--base <sha>] --notes <file> --out <name>.zip [--checkpoint <dir>] [--bundle] [--opaque <path>]...`. Creates versioned archive; inspects own output with consumer pipeline. `--base` lets sandbox commit id with same tree declare intended GitHub commit; unrelated tree stays unrelated.

Patch series = only change owner. Checkpoint = [AI checkpoint transport view](./AI-CHECKPOINT-WORKFLOW.md), validated against series. `git apply` of checkpoint diffs not alternative: loses authored commit sequence, authorship `git am` preserves.

### What a patch and a recipient may not decide

Every `git am` commit read back: touched paths must be declared by manifest entry (`undeclared-change` otherwise) — digest proves which patch packed, not that manifest describes it. Commit proved to exist first. `git am --3way` exits zero without committing when change already in tree; `HEAD^..HEAD` then reads previous commit: unrelated → undeclared change; same path → clean application of zero commits. Patch making no commit stops series as `already-applied`, naming patch, checkout + zip unchanged. Skipping rejected: partly present series = state human must inspect; handover reporting success for bytes not written is not whole. Apply commands: empty scratch `core.hooksPath`, `--whitespace=nowarn`, `--no-gpg-sign` → repository hooks, `apply.whitespace`, `commit.gpgSign` cannot run code or refuse valid handover. After fast-forward inbox state closed union (`emptied`, `kept`, `cleanup-failed`) → cleanup failure never reads "nothing changed". Producer refuses range start not ancestor of end, empty commit, gitlink (id names commit in another repository; every declared image blob → consumer proved it absent at base cut from), output path inside checkout; copies archive out only after own inspection. `core.autocrlf` considered, not pinned: no blob id changed when measured; post-image comparison catches divergence.

## Rejected

**The unversioned sample as format v0.** Copied sandbox layout = second owner; missing-versus-foreign undefined. Sample repacked through `pack`, not implicit version.

**Applying checkpoint diffs.** Checkpoint = AI transport representation. `git apply` loses authorship + sequence; series applies cleanly, carries post-image assertions. Checkpoint certifies, never replaces.

**Deleting inbox after a conflict.** Conflict = case human needs zip + extracted patches for recovery. Cleanup restricted to `applied`; `--keep` = explicit successful retention.

**A pure-Node zip reader.** Repository already relies on `unzip` in `scripts/automation-checkpoint.mjs`. New reader = another parser + security surface, no measured need.

**Fake Git ports for pipeline tests.** Fake `git am` tests fake, not atomic property. Pipeline uses real temporary Git repositories; pure format decisions stay in pure module.

**A separate `inspect` command.** `--dry-run` runs complete inspect/validate/apply/post-image pipeline without checkout change. Second command = second user surface + another owner of inspection meaning.

## Consequences

Human: one durable procedure, named outcome, not half-applied checkout. Inbox safe after every failure; worktree fast-forward = last publication step, all-or-nothing for checkout. Archive listing + exact manifest membership = reviewable handover; reject zip bombs, path tricks, unknown layouts, silent omissions before patch application.

Modest temporary-worktree cost; no partial commits in real checkout. Branch changed since base reconciled by Git three-way merge, paths explicitly reported. Post-image mismatch not auto-repaired; new handover required — archive failed to describe own bytes.

Optional checkpoint/bundle = evidence only under declared contracts. Checkpoint must agree with series; bundle cut from declared base. Sandbox base commit id differing from intended still produces patches with `--base`; no valid bundle for that range.

No CI run yet. Typecheck not run in sandbox (TypeScript unavailable). Sandbox tests Node 22 + vitest shim, not vitest; these limit evidence, not claims of repository CI coverage.

## Evidence

2026-09-24 measurements = load-bearing evidence: three format-patch commits clean, nine of nine declared paths final post ids, bundle named unavailable mirror prerequisite, no manifest, two representations without agreement statement.

`HO-` series. `HO-1` through `HO-14` in `packages/core/test/unit/scripts/handover-format.test.ts` = pure layer: listing parser + count check, every unsafe entry kind, manifest schema + version refusal, chain, exact contents, checkpoint agreement, bundle prerequisite, inbox discovery, word per refusal kind. `HO-15` through `HO-30` in `packages/core/test/unit/scripts/handover-apply.test.ts` = real temporary repositories, producer pack + consumer apply: whole application + cleanup, dry run + `--keep`, conflict leaving checkout and inbox untouched, reconciliation on newer branch, every preflight and base refusal, tampered/undeclared/unversioned/linked/future archives, series onto undeclared bytes, three inbox states, bundle rule, checkpoint agreement end to end, every outcome's words + exit status, command line.

Review of #488 added `HO-31` to `HO-34` in same file: patch already on branch stops `already-applied`, related or not; `pack` refuses gitlink, writes no archive; HEAD moves or tree edited before fast-forward → `head-moved`/`dirty-tree`, zip kept, no worktree left; unrelated edit survives applied fast-forward; first handover applies without ignore rule, untracked file elsewhere still refused. Each killed by removing its fix: pathspec exclusion, commit check, `head-moved`/`dirty-tree` mapping, gitlink refusal.

Sandbox: all 30 original cases passed; each mutation killed by at least one case: skipping post-image comparison, applying on dry run, emptying inbox under `--keep`, skipping patch digest, skipping dirty-tree refusal, discarding extracted series on conflict, treating every path unreconciled, skipping extraction-equals-listing check, admitting stray file, skipping checkpoint tip agreement, admitting second bundle prerequisite, admitting any path segment, skipping base pre-image comparison. Last two first-round survivors (extraction-equals-listing, second bundle prerequisite) added smuggling case to `HO-21`, two-prerequisite case to `HO-12`.

Consumer + producer both call `inspectArchive` → producer cannot silently create archive consumer rejects. No live CI run claimed until exists.
