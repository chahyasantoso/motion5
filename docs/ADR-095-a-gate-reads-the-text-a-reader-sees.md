# ADR-095: A gate reads the text a reader sees, and an invariant it checks has a mechanism

**Status:** Accepted, 2026-09-18

## Context

Two findings in same layer, gate that reads a document: status gate's first live bypass, [#436](https://github.com/chahyasantoso/motion5/issues/436), and missing mechanism behind ADR-093's invariant, [#441](https://github.com/chahyasantoso/motion5/issues/441).

Status gate refuses a phase label by reading it where a label goes: strips emphasis, trims, removes leading non-word characters before matching; strip stops at first word character. Markup whose own text is word survives → two bullets rendering as phase label passed: `- <!-- x -->Phase: live editing` (strip stops at `x`) + `- &nbsp;Phase: live editing` (stops at `nbsp`). Neither exotic; neither needs argument to write. `isEntry` counted first as real entry, stripping HTML comments before asking whether bullet states something, while label rule was never told what comment is. One question, two answers; cheaper one is the one a writer reaches. ADR-085's own amendment says decorated label is still label; rule refused every spelling nobody would use to evade it.

ADR-093 decided number names exactly one record, in directory where duplicate that motivated it survived three weeks. Nothing enforces it. `DECISIONS.md` carried second, shorter ADR-051 beside record owning subject; two did not contradict; no mechanism owned claim. Slice extracting twenty-seven records hand-wrote roughly thirty-eight relative links; behind them, only reviewer's eye.

## Decision

**One normalisation owner answers what a bullet says, and both readings of a bullet read it.** `bulletSubject` removes HTML comments + resolves character references before entry count or label grammar runs → `isEntry` + `statesPhase` agree about what a comment is, the thing they disagreed about; markup removed where every other decoration already was.

Numeric character reference decoded; named one becomes space. Asymmetry is decision, not omission: `&#80;hase:` spells label → neutralising numeric reference moves bypass one spelling along; no named reference in HTML produces ASCII word character → named one cannot spell label, and table of them becomes thing maintained. That is #422's refusal to enumerate terminators, one layer down. Malformed or out-of-range numeric reference → space, not guess.

**A raw HTML element is removed with the comment, and a reference without its semicolon is not decoded.** Both halves found by quality pass over this change, not by issue. First is reported defect one spelling out: Markdown passes inline HTML through → `<span>Phase:</span>` renders as label, markup invisible; tag whose name is word is what leading strip stops at. Only tag removed, never text between tags → entry legitimately emphasising word keeps what it says. Second is boundary of first: Markdown renders `&#80hase` + `&nbsp Phase:` literally, ampersand and all → reader never sees label there; decoding semicolonless reference would refuse prose, not bypass. Issue reporting one spelling of two-spelling rule is argument for owner at all, not for third patch at same place.

**The grammar does not move.** Normalisation changes subject, nothing else → label read in label position only: comment or reference inside real entry is prose, stays allowed. Consequence taken deliberately: bullet rendering as nothing but reference states nothing → entry count stops counting it, as it already declined comment-only bullet.

**ADR-093's invariant gets a mechanism, and it is a filename and link check rather than a prose check.** `packages/core/test/unit/scripts/adr-integrity.test.ts` enumerates `docs/ADR-*.md`, asserts one file per number + no gap, resolves every relative `./ADR-*.md` link in top-level documents to existing file. Inside ADR-008's allowed family beside boundary scan: filename + path are directory behaviour, not opinion about record → no claim record correct, only number resolves to one file + links resolve at all.

**The status file's head line says what it is.** `Inspected main` could not name head it ships on: status file cannot name commit it is about to be published as → every honest edit named own parent; line stale by one slice by construction. Restated as `Read against`, head rewrite verified at; exact-head evidence stays where repo puts it, owning pull request. Shape gate gains no opinion: gate checking it would claim freshness ADR-085's decision four says it cannot check.

## Alternatives rejected

**Declaring Markdown out of the status gate's contract.** Gate already reads links, emphasis, emoji + comments deliberately → narrowing contract after fact contradicts grammar #421 + #422 wrote down.

**Decoding named references through a table.** Refused above: list to maintain for bypass that cannot spell label.

**Refusing any bullet that contains a character reference.** Refused. Would fail status file for prose naming `&amp;` correctly — gate shaping writing, not reading it.

**Dropping the head line from the status file.** Read + refused. Answers real question — tree reader checks claims against — fix is one word, not deletion.

**Letting the shape gate read the head line.** Refused as freshness claim, which ADR-085's decision four gives human.

**Registering the record gate in `docs/acceptance-map.json`.** Refused: map names tests proving acceptance items; this is directory invariant with record behind it.

**Asserting the highest ADR number the gate expects.** Refused, raised by quality pass over this change. Gate naming ninety-six = file every new record must edit (failure ADR-093 deleted index to end) → red on slice adding ADR-097, not on defect. Invariant: uniqueness + contiguity from one — number cannot be answered by two files, cannot be skipped. How far sequence runs: no claim needing mechanism; `/^ADR-(\d{3})-[a-z0-9-]+\.md$/` already refuses `ADR-96` spelling that would make gap look like number.

## Consequences

No source, public surface, runtime behaviour, diagnostic or rule id moves. Status gate now refuses two bullet spellings it allowed, stops counting one stating nothing.

Record gate measured before written, on `6cc4e1fd57722889380e0bbded3b4c4eaa568dd7`: ninety-four records, one file per number, no gap, fifty-six relative record links across thirty-four documents, all resolving. Lands green — honest description of gate for invariant tree already satisfies: value is next slice; duplicate it would have caught is case it cannot have.

`docs/README.md` regains paragraph on what record is for + what shape one has, which `DECISIONS.md` opened with; extraction dropped it rather than moved. Last thing [#439](https://github.com/chahyasantoso/motion5/issues/439)'s no-content-lost criterion short of.

## Evidence

Helper cases in `packages/core/test/unit/scripts/session-status-shape.test.ts` refusing `<!-- x -->Phase:`, `&nbsp;Phase:`, decimal + hexadecimal reference spelling label, comment splitting word, nested case under real entry. All red before change. Beside them: cases keeping entry merely containing comment or reference; bullet nothing but reference counted as no entry.

`packages/core/test/unit/scripts/adr-integrity.test.ts` for record invariant: green both sides by construction, stated so, not claimed regression.
