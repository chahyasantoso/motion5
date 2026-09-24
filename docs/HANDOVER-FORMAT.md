# Handover format

This document is for a human contributor working in a Codespaces checkout who receives a motion5
handover zip and needs to apply it without asking an AI agent to edit the repository.

## Human procedure

Download the handover zip in Codespaces. At the repository root, create `.handover/` if it does
not exist and put exactly that one zip in it. The directory is gitignored, and the clean-tree
check below skips it even on a branch that does not carry that ignore rule yet, so the zip is
never part of the change being applied.

Optionally preview the application without changing the checkout:

```text
npm run patches -- --dry-run
```

Apply it after the preview, or directly if no preview is needed:

```text
npm run patches
```

The command discovers the inbox before opening the archive. An empty inbox is normal and exits
successfully with nothing to do. More than one zip is ambiguous and is refused. Any non-zip
entry is a foreign entry and is refused; remove it before trying again.

Before reading the archive, the command requires a committer identity, an attached branch rather
than a detached HEAD, no Git operation in progress, and a clean tree. The clean-tree check
includes untracked files everywhere except `.handover/`, so commit or stash with `git stash -u`
before applying a handover.

The command reads the zip listing before extraction, checks the archive shape and bounds,
extracts it into a temporary directory, and compares the extracted file set with the listing. It
validates the manifest, every patch digest, the optional checkpoint, and the optional bundle
before it touches the checkout. It then applies the patch series in a detached temporary
worktree of the current HEAD with `git am --3way`.

After each patch, every declared post-image blob is checked. A path that the checkout changed
after the handover base is merged by Git's three-way application and reported as `reconciled`
for review instead of being compared with the author's post-image. Only after every patch passes
does the command fast-forward the real checkout to the temporary worktree tip. A dry run
performs the same pipeline but does not fast-forward.

The inbox is emptied only after an `applied` outcome. Pass `--keep` to retain the zip after a
successful application. Refusals, conflicts, post-image mismatches, and errors leave the zip in
the inbox; do not delete it while investigating a failure.

### Outcomes

- `nothing-to-do` means `.handover/` contains no zip. The exit status is 0 and the checkout is
  unchanged.
- `refused` means a preflight, archive, manifest, base, checkpoint, or bundle rule failed, or the
  checkout moved or was edited while the series was being proved (`head-moved`, `dirty-tree`).
  The exit status is 1, the checkout is unchanged by the command, and the zip is retained.
- `conflict` means a patch did not apply cleanly even with `git am --3way`. The exit status is 1,
  the checkout is unchanged, the zip is retained, and the extracted series is retained in the
  temporary directory named in the output.
- `undeclared-change` means a patch changed a path its manifest entry does not declare. A patch
  digest proves the patch is the one packed, not that the manifest describes it, so every commit
  is read back. The exit status is 1 and the checkout is unchanged.
- `post-mismatch` means a patch applied but a declared post-image blob did not land. The exit
  status is 1, the checkout is unchanged, and the handover must be replaced or corrected.
- `already-applied` means a patch applied without changing anything, because this branch already
  carries its change; the output names the patch. The exit status is 1, the checkout is unchanged,
  and the zip is retained. If the whole series is already in, empty `.handover/` by hand.
- `verified` is the successful dry-run result. The exit status is 0, the commits and any
  reconciled paths are printed, and the checkout is unchanged.
- `applied` means every check passed and the real checkout was fast-forwarded. The exit status is
  0, the commits and any reconciled paths are printed, and the inbox is emptied unless `--keep`
  was used.

### Conflict recovery

The conflict output prints all extracted patch paths. On the branch where the handover should
land, run the printed `git am --3way` command with all of those patch paths, resolve each
reported conflict, stage the resolutions, and run `git am --continue`. If the handover should
not be applied, run `git am --abort`. The temporary extracted series is kept specifically so
this recovery does not depend on a second download. After a manually completed series, empty
`.handover/` only when you have verified the result, or ask for a new handover rebased onto the
current branch.

## Archive layout

A v1 zip has exactly one top-level directory. Its name is the manifest's `name`, and every
archive path is relative to that directory. The root contains `handover.json`, one or more patch
files below `patches/`, exactly one notes file, and any declared checkpoint, bundle, or opaque
components.

```text
motion5-487-handover/
  handover.json
  patches/
    0001-first-change.patch
    0002-second-change.patch
  NOTES.md
  checkpoint/cp001/
    manifest.json
    001-first-change.diff
    002-second-change.diff
```

The archive listing is authoritative for safety checks before extraction. It may contain at most
2,000 entries and at most 64 MiB of uncompressed data. Every entry must be a regular file or
directory. Symlinks and other special entries are refused. Extraction must produce exactly the
files named by the listing; a mismatch is an unreadable archive.

Every path segment is restricted to `[A-Za-z0-9_.@+-]`. Absolute paths, backslashes, empty
segments, `.` and `..` segments, directory paths where a file is expected, and names outside
that character set are refused. The archive must have one root folder, and a file may not sit
outside it. The manifest and `patches/` are reserved and cannot be claimed by a component.

The manifest must declare every stored file, and every declared patch or component file must be
present. A stored file not declared by the manifest is a `stray-file` refusal. A declared file
not present in the archive is a `missing-file` refusal. Unknown manifest keys are refused rather
than ignored.

### Components

The closed component union is `notes`, `checkpoint`, `bundle`, and `opaque`.

- `notes` is required exactly once and must name one Markdown file ending in `.md`.
- `checkpoint` is optional and may occur at most once. Its path names a folder whose final segment
  is `cpNNN`, where `NNN` is three digits. The checkpoint is a derived transport view, not a
  second owner of the handover.
- `bundle` is optional and may occur at most once. Its path names one `.bundle` file. It is
  validated but never used as the patch application source.
- `opaque` is optional and may occur any number of times. Its files are validated in a temporary
  extraction, never executed, and never copied into the checkout; they survive a successful apply
  only in the zip, so keep your download or pass `--keep` to read them. Tools, corpus files,
  probes, and evidence belong here.

Component paths may not overlap one another. A checkpoint component must contain its
`manifest.json` and exactly the files that its own manifest declares. Its stored patch digests
must match, its base must equal the handover base, and its final post-image map must equal the
handover patch series. The checkpoint policy remains the owner of its own chain limits,
including the inherited maximum of 20 patches and 50 paths; this format does not duplicate those
rules.

## Manifest v1

The manifest is `handover.json` at the archive root. Its top-level keys are exactly `format`,
`version`, `name`, `issue`, `base`, `patches`, and `components`.

`format` must be `motion5-handover` and `version` must be `1`. A different format or version is
refused as `unsupported-version`; it is never guessed as an older or newer layout. `name` must
equal the archive's one root-folder name. `issue` is a positive integer. `base` is a full
40-character lowercase commit SHA.

`patches` is a non-empty ordered array of at most 20 entries. Each entry has exactly `seq`,
`file`, `sha256`, `pre`, and `post`. `seq` starts at 1 and increases by one. `file` is
`patches/NNNN-slug.patch`, where the four-digit number equals `seq`. `sha256` is the SHA-256
digest of the patch bytes. `pre` and `post` are non-empty maps from safe repository paths to
full blob ids or `null` for absence, and they contain exactly the same paths.

The patch chain is inherited from `checkpointChain()`. For every path, the first patch's `pre`
value must equal the blob at that path in `base`; each later patch's `pre` must equal the
preceding patch's `post`; and a path may not be absent in both images. The patch series is the
single owner of the changes and their final post-image. Commit subjects are not copied into the
manifest because the patch file owns its commit metadata.

`components` is an array of component objects with exactly `kind` and `path`. The component
rules are those in the Components section above. The archive must contain exactly the manifest,
all patch files, and all files owned by those components.

This is a valid v1 manifest example:

```json
{
  "format": "motion5-handover",
  "version": 1,
  "name": "motion5-487-handover",
  "issue": 487,
  "base": "7e6f4edc00000000000000000000000000000000",
  "patches": [
    {
      "seq": 1,
      "file": "patches/0001-first-change.patch",
      "sha256": "1111111111111111111111111111111111111111111111111111111111111111",
      "pre": {
        "packages/core/src/example.ts": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      "post": {
        "packages/core/src/example.ts": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      }
    },
    {
      "seq": 2,
      "file": "patches/0002-second-change.patch",
      "sha256": "2222222222222222222222222222222222222222222222222222222222222222",
      "pre": {
        "packages/core/src/example.ts": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      },
      "post": {
        "packages/core/src/example.ts": "cccccccccccccccccccccccccccccccccccccccc"
      }
    }
  ],
  "components": [
    {
      "kind": "notes",
      "path": "NOTES.md"
    },
    {
      "kind": "opaque",
      "path": "evidence"
    }
  ]
}
```

The SHA values in this example are syntactically valid examples, not claims about a real
archive. A producer must calculate the patch digests and blob ids from the actual bytes and
commits.

## How the base is proved

The base is proved by commit where the checkout can and by content where it cannot, and the
checkout never has to guess which.

When the checkout holds the `base` commit, it must be an ancestor of HEAD (`base-not-ancestor`
otherwise), and every path's first `pre` must equal that commit's blob (`base-disagrees`
otherwise). A path HEAD has changed since the base is merged by `git am --3way` and reported as
`reconciled`; every other path must land on its declared `post`.

When the checkout does not hold the `base` commit, HEAD itself must carry every path's first
`pre`, and then nothing is reconciled and every `post` is compared. Otherwise the handover is
refused as `base-missing`, naming the first path that differs. This is what lets a handover be
stacked on another one that was applied locally: the second handover's author knows the first
one's commit ids only in their own sandbox, and `git am` gives the human different ones, but the
bytes are the same. It is the rule the checkpoint route already chains by
([ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md)). If the base is merely not fetched
yet, `git fetch` and run the command again.

## What the recipient cannot change

`git am` normally runs the repository hooks and reads the recipient's configuration. The command
runs `git am`, `git worktree add` and the final fast-forward with `core.hooksPath` pointed at an
empty scratch directory, applies with `--whitespace=nowarn` and `--no-gpg-sign`, and so a hook,
`apply.whitespace=error` or `commit.gpgSign=true` neither runs nor refuses anything. After the
fast-forward an inbox that cannot be emptied is reported as the applied outcome's inbox state
(`emptied`, `kept` or `cleanup-failed`), never as an error, because the series is already in.

## Producer command

An AI implementor or other producer creates a handover with:

```text
node scripts/handover.mjs pack --issue <n> --from <rev> [--to <rev>] [--base <sha>]
  --notes <file> --out <name>.zip [--checkpoint <dir>] [--bundle] [--opaque <path>]...
```

`--from` must be an ancestor of `--to`, no commit in the range may be a merge, empty, or change a
submodule gitlink, and `--out` must be outside the checkout or inside `.handover/`. The archive is
built and inspected in a stage and copied to `--out` only when it passes. `--from` and `--to` select
the range, with `--to` defaulting to `HEAD`. The producer writes one format-patch file per commit,
computes the manifest from the actual patch bytes and images, copies the notes and optional
components, zips the one-root layout, and inspects its own output with the same `inspectArchive`
used by the consumer.

Use `--base` when a sandbox has the same base tree as the intended repository base but a
different local commit id. The patch images are content-based, so this can make the handover
apply to the intended full SHA. It does not make an unrelated tree compatible.

Use `--bundle` only when `--from` is the declared `base`. A Git bundle may name exactly one
prerequisite, and that prerequisite must be the manifest base. If a sandbox's local base id
differs from the declared base, do not bundle that range; the producer refuses this combination.
An optional checkpoint is a derived validation and transport component, never the source of
application.

## AI implementors

Build a handover with `pack`, not by hand-assembling an unversioned sample layout. The format
owns one manifest, one patch-series representation, and exact archive membership so a consumer
can refuse drift before applying anything. Opaque material is safe to carry only because the
consumer never executes it.

The patch series owns what changes. A checkpoint component may carry the same work for the [AI
checkpoint workflow](./AI-CHECKPOINT-WORKFLOW.md), but it must validate against the handover base
and end at exactly the same post-image map. Applying checkpoint diffs with `git apply` is
deliberately not supported because it loses the authorship and commit sequence carried by `git am`.

## Refusal kinds

The implementation reads these closed unions exhaustively, and the messages and exit status are
owned by `describeRefusal` and `describeOutcome` rather than duplicated in this document. The
refusal kinds are:

- `ambiguous-inbox`
- `foreign-entry`
- `tool-missing`
- `identity-missing`
- `detached-head`
- `operation-in-progress`
- `dirty-tree`
- `unreadable-archive`
- `unsafe-entry`
- `archive-too-large`
- `missing-file`
- `stray-file`
- `invalid-manifest`
- `unsupported-version`
- `digest-mismatch`
- `broken-chain`
- `base-missing`
- `base-not-ancestor`
- `base-disagrees`
- `checkpoint-disagrees`
- `bundle-invalid`
- `bundle-prerequisite`
- `head-moved`

The other closed unions are the inbox discoveries `empty`, `one`, `ambiguous`, and `foreign`;
zip entry kinds `file`, `directory`, `symlink`, and `other`; and component kinds listed above.
An unknown member is a programming error, not a fallback case.
