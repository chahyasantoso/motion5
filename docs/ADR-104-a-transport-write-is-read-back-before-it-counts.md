# ADR-104: A transport write is read back before it counts

**Status:** Accepted, 2026-09-23. Closes [#478](https://github.com/chahyasantoso/motion5/issues/478). **Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

[ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) made patch declare bytes it produces,
[ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md) made request sealed by its manifest → checkpoint
store arrives across several contents-API writes, only manifest starts run. Both about what CI does with bytes
that arrived. Neither says about step before: implementor with no local checkout re-emits every byte of every
store file into JSON string argument,
[#477](https://github.com/chahyasantoso/motion5/pull/477) is what that step costs when nobody checks.

Everything below measured 2026-09-23 against cp001 store on #477's branch, read as tree listings at `cc4c947`,
`2442b5e`, `ed190b3`, and against three sealed files carried byte for byte into this repository as fixtures,
verified by Git blob id.

**What first seal carried.** At `cc4c947`, seal preparation run
[35805919432](https://github.com/chahyasantoso/motion5/actions/runs/35805919432) refused with
`does not match its declared SHA-256`: patch 004 blob `36731f6` at 26,548 bytes against declared `80b7bee` at
28,080, patch 005 `d559264` at 6,523 against `a06c81f` at 6,524. Issue #478's table names `267a7fa` as 004's
first failure. Listing says otherwise: `267a7fa`, 28,079 bytes, is what later "exact bytes" re-push `db4a471` left
behind, and what unsealed listing at `2442b5e` shows for 004. Both wrong; correction matters only because record
citing wrong id for refused seal is record next reader cannot check.

**What repair carried.** At `2442b5e`, first repair of 005 = `a3354d3` at 6,522 bytes: final line, single space,
gone with its LF. `8b527da` then matched `a06c81f`, `17d685e` matched `80b7bee`, re-seal `ed190b3` carried
manifest `f95a9fc`. Every write in repair compared with declared id before next — only reason repair took two
writes of 005 rather than another refused run.

**Where bytes go wrong.** Mapped over sealed files: 004 carries exactly seven lines that are one space and
nothing else, at 6, 8, 11, 14, 16, 115, 124; 005 carries eight, at 6, 8, 13, 15, 18, 20, 23, 25. Defects #478
diffed out of botched blobs all sit on one of those lines, on line after hunk header, on backtick span, or at end
of file. Unified diff: every blank context line = line containing exactly one space → not property of these two
patches but of format meeting transcriber normalising whitespace; stronger model dropping line 25 of 005 on repair
= measurement saying transcriber's tier does not decide it.

**What check costs.** Nothing. `create_or_update_file` returns `content.sha`, Git blob id of what stored. Id it
should equal already written down before write, ADR-100 requires mirror computing it. Incident = absence of one
string comparison between two values both already in hand.

## Decision

Invariant one sentence: **a transport write is not done until its returned blob id equals the id declared before
it, and the manifest is never pushed over a store that has not been read back.** Two owners, different questions →
neither restates other.

**Rule owned by [AGENTS.md](../AGENTS.md).** Needs no runtime → every implementor can follow: compare every
write's `content.sha` with id declared for that path, stop at mismatch without writing next file, manifest, or
claiming success, re-write and compare again, before manifest list store at branch head, confirm every patch's id
and size. `push_files` returns no per-file blob id → checkpoint files travel through `create_or_update_file`, one
file per call. Lives in AGENTS.md because file API-only implementor reads first;
[AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) and [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) point at
it rather than carrying second copy that can drift.

**Helper owned by `scripts/checkpoint-transport.mjs`,** declaration file beside it, cases in
`packages/core/test/unit/scripts/checkpoint-transport.test.ts`. Serves implementor with runtime, which checkpoint
author always has. Pure core + thin command line, restates no bound and no store rule: local store read through
`checkpointStore()` + `sealedRequest()` — same owners preparation and publication use → file-name rule,
regular-file rule, 32,000-byte transport bound, exact manifest-plus-patches set cannot drift between planning push
and refusing one. Git blob id = `blobSha()` from `automation-report.mjs`, one both checkpoint and AI edit
publication already read; hunk header = parser's own `HUNK_HEADER`, exported from `checkpoint-policy.mjs` for this
rather than copied.

`plan <store-dir>` prints, push order with manifest last, each file's path, byte size, Git blob id, SHA-256,
numbered hazard map. Prints not writes: store must hold exactly its manifest + patches, stray file under
`.ai/checkpoints/` refuses every later checkpoint → no default location inside mirror safe. Redirect to file
outside repository. Patch whose bytes disagree with declared digest refused by `plan` itself, likewise one
`parsePatch()` would refuse or `reconcilePatch()` finds disagreeing with manifest entry — carrying it only moves
same refusal to preparation run.

Map stated only over bytes that are lines. Store file decoded UTF-8, fatal decoder, byte-order mark kept; file with
invalid sequence or CR refused by name rather than mapped. Lossy decode reads every invalid byte as U+FFFD → map
would name code point file does not hold; CRLF line that is one space + CR neither whitespace-only nor
trailing-whitespace to reader splitting on LF → hazard map exists for would be one it misses.

Hazards closed union read through exhaustive `switch`: `whitespace-only-line` with exact bytes,
`adjacent-to-hunk-header`, `trailing-whitespace` on line not wholly whitespace, `final-line` with exact bytes and
whether LF follows, `non-ascii` with distinct code points, `backtick-span` with count. Line carrying several lists
them in declared order. `newline` field on `final-line` = one addition to shape #478 proposed, because hazard is
final line + terminator together: `a3354d3` lost both, transcriber told only line's bytes not told whether LF
follows.

`verify <store-dir> <path>=<blob-id>...` answers one verdict per planned path, one per unplanned observation:
`match`, `mismatch`, `absent`, `stray`, `unsealed`. `unsealed` = second addition, makes rule's own gate passable.
Listing rule demands before manifest taken while manifest legitimately missing → reading that absence as `absent`
would make `verify` fail at only moment asked. `unsealed` = manifest not yet observed, passes; missing patch =
`absent`, fails. Exit status 0 only when every verdict passes, 1 when one does not, 2 when invocation or local store
refused. Observation must carry full 40-character id — prefix comparison weaker than rule's claim; bare file name
read as file of planned store.

`localize <expected-file> <observed-file>` reports first differing line with both sides escaped + byte offset,
missing line as end of file → lost final LF itself difference. Compares bytes never decoded text, renders
byte-safely: printable ASCII stands for itself, byte starting no valid UTF-8 sequence or control → `\xNN`, valid
non-ASCII → `\u{N}`. Two different invalid bytes never render alike; no-break space or curly quote, which
transcriber substitutes for ASCII it resembles, cannot pass for it by eye. Unlike `plan`, refuses nothing — remote
bytes handed are ones already known wrong. On mismatch question always which line; answering by eye on 28 KB diff =
how second attempt goes wrong too.

Helper's exhaustive sink local function not `lang/exhaustive.ts`: script plain ESM, cannot import TypeScript
source. Declaration file types every reader's subject as union, cases pin declared kinds, exported kind lists and
rendered arms agree, value outside union refused by name with `TypeError` — how
[ADR-092](./ADR-092-reading-a-closed-union-is-exhaustive.md) says reader refuses one.

**Patch can be cut cheaper to carry.** Model transporting slice: prefer splitting large slice into smaller patches
over one near bound, prefer cut with fewer whitespace-only context lines. `-U0` accepted and adjudicated by
declared post-image under ADR-100, costs reviewers context → judgement per slice, never default, never edit to diff
already generated. AI-CHECKPOINT-WORKFLOW's procedure owns that paragraph.

**`.tools/` holds only retained Prettier archive.** Third-party, checksummed, excluded from formatting. First-party
automation in `scripts/` with cases under `packages/core/test/unit/scripts/`; helper in `.tools/` would escape
ownership and testing every other automation owner held to. AGENTS.md says so → no agent goes looking there.

## Rejected

**Serializer whose output model copies into tool argument.** Corruption when model types argument, no script can sit
between model and call. Serializer moves copying, does not remove it; agent whose tool path passes script output
verbatim needs none, API-only agent has no runtime to run it in.

**Base64 or archive transport.** ADR-102 rejected: JSON string not byte channel, archive destroys reviewability of
self-certifying diff, saving ~40 percent at best. Worse for fidelity not better: encoding has no redundancy, one
dropped character corrupts everything after.

**No-credential workflow reporting blob ids on patch-only pushes.** Every write response already carries id, run
per patch contradicts ADR-102's decision that patch-only push inert.

**Lowering `MAX_TRANSPORT_BYTES` as fix.** 005 failed at 6.5 KB, twice. Bound stays size ceiling not fidelity
control.

**Partial mode for `verify`.** Checking one write needs no command: plan already states id to compare
`content.sha` with. Flag suppressing `absent` gives one verdict two meanings, `unsealed` already covers one absence
protocol makes legitimate.

**Whole cp001 store as fixtures.** Patches 001-003 = 54,775 bytes no hazard question about. Three fixtures carried
are files incident altered or sealed, 40,007 bytes; 001-003 enter cases as ids their listing returns. Fixtures end
in `.txt`: `.gitattributes` marks `*.diff` `-diff` → checkpoint cutting them read as binary patch; pinned formatter
infers no parser for `.txt` → no format pass rewrites manifest whose id is assertion.

## What this does not fix, stated rather than discovered

Model still types every byte. Decision makes wrong byte visible at write introducing it, not impossible; rule not
gate — nothing in CI observes whether implementor compared id before writing next file. What CI can observe it
already refuses, at preparation, one round trip later.

`verify` reads ids implementor pasted, `localize` needs remote bytes, which API-only reader receives same way it
sends. Both narrow question, neither removes transcriber.

Tab = byte shape models known to rewrite, not hazard kind. Nothing in #477 or #478 measured it, accepted grammar
deliberately allows, kind added without incident = guess in union otherwise recording measurements. Obvious next
member if one measured.

## Evidence

`checkpoint-transport.test.ts` asserts, over sealed fixtures: seven whitespace-only lines of 004, eight of 005 with
its final line and line after its hunk header, ids `80b7bee`, `a06c81f`, `f95a9fc`, fixtures' SHA-256 digests equal
what sealed manifest declares. Asserts `mismatch` for 004 at `36731f6` and `267a7fa`, for 005 at `d559264` and
`a3354d3`; `match` for repaired store before and after seal; `absent`, `stray`; `localize` finding line 25 of 005 and
header merge at line 5, rendering invalid, look-alike, truncated bytes distinctly; `plan` refusing invalid UTF-8, CR,
patch outside `allow`, patch its entry misdeclares; every hazard and verdict kind through one exhaustive reader
refusing kind outside union.
