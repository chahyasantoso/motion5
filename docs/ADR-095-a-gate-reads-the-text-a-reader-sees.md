# ADR-095: A gate reads the text a reader sees, and an invariant it checks has a mechanism

**Status:** Accepted, 2026-09-18

## Context

Two findings land in the same layer, a gate that reads a document: the status gate's first live bypass in [#436](https://github.com/chahyasantoso/motion5/issues/436), and the missing mechanism behind ADR-093's invariant in [#441](https://github.com/chahyasantoso/motion5/issues/441).

The status gate refuses a phase label by reading it where a label goes. It strips emphasis, trims, then removes leading non-word characters before matching, and that strip stops at the first word character. So markup whose own text is a word survives it, and two bullets that render as a phase label passed the gate: `- <!-- x -->Phase: live editing`, where the strip stops at `x`, and `- &nbsp;Phase: live editing`, where it stops at `nbsp`. Neither is exotic and neither needs an argument to write. `isEntry` counted the first as a real entry, because it strips HTML comments before asking whether a bullet states something, while the label rule had never been told what a comment is. That is one question with two answers, and the cheaper of the two is the one a writer reaches. ADR-085's own amendment says a decorated label is still a label; the rule refused every spelling nobody would use to evade it.

ADR-093 decided that a number names exactly one record, in a directory where the duplicate that motivated it had survived three weeks. Nothing enforces it. `DECISIONS.md` carried a second, shorter ADR-051 beside the record that owns the subject, the two did not contradict each other, and no mechanism owned the claim. The slice that extracted twenty-seven records hand-wrote roughly thirty-eight relative links, and the only thing behind them was a reviewer's eye.

## Decision

**One normalisation owner answers what a bullet says, and both readings of a bullet read it.** `bulletSubject` removes HTML comments and resolves character references before either the entry count or the label grammar runs. `isEntry` and `statesPhase` therefore agree about what a comment is, which is the thing they disagreed about, and markup is removed where every other decoration already was.

A numeric character reference is decoded and a named one becomes a space. The asymmetry is the decision rather than an omission: `&#80;hase:` spells the label, so neutralising a numeric reference would move the bypass one spelling along, while no named reference in HTML produces an ASCII word character, so a named one cannot spell the label and a table of them would become the thing maintained. That is the reason #422 refused enumerating terminators, applied one layer down. A malformed or out-of-range numeric reference becomes a space rather than a guess.

**The grammar does not move.** Normalisation changes the subject and nothing else, so the label is still read in the label position only: a comment or a reference inside a real entry is prose and stays allowed. One consequence follows and is taken deliberately: a bullet that renders as nothing but a reference states nothing, so the entry count stops counting it, exactly as it already declined to count a comment-only bullet.

**ADR-093's invariant gets a mechanism, and it is a filename and link check rather than a prose check.** `packages/core/test/unit/scripts/adr-integrity.test.ts` enumerates `docs/ADR-*.md`, asserts one file per number and no gap, and resolves every relative `./ADR-*.md` link in the top-level documents to a file that exists. It sits inside ADR-008's allowed family beside the boundary scan, because a filename and a path are behaviour of the directory rather than an opinion about a record: it makes no claim that a record is correct, only that its number resolves to one file and that its links resolve at all.

**The status file's head line says what it is.** `Inspected main` could not name the head it ships on, because a status file cannot name the commit it is about to be published as, so every honest edit of that line named its own parent and the line was stale by one slice by construction. It is restated as `Read against`, which is the head the rewrite was verified at, and exact-head evidence stays where this repository already puts it, in the owning pull request. The shape gate gains no opinion about the line: a gate that checked it would be claiming the freshness ADR-085's decision four says it cannot check.

## Alternatives rejected

**Declaring Markdown out of the status gate's contract.** The gate already reads links, emphasis, emoji and comments deliberately, so narrowing the contract after the fact would contradict the grammar #421 and #422 wrote down.

**Decoding named references through a table.** Refused above: a list to maintain in exchange for a bypass that cannot spell the label.

**Refusing any bullet that contains a character reference.** Refused. It would fail a status file for prose that names `&amp;` correctly, which is a gate shaping the writing rather than reading it.

**Dropping the head line from the status file.** Read and refused. It answers a real question, which is the tree a reader can check the claims against, and the fix is one word rather than a deletion.

**Letting the shape gate read the head line.** Refused as a freshness claim, which ADR-085's decision four gives to the human.

**Registering the record gate in `docs/acceptance-map.json`.** Refused: that map names tests which prove acceptance items, and this is a directory invariant with a record behind it.

## Consequences

No source, no public surface, no runtime behaviour, no diagnostic and no rule id moves. The status gate refuses two bullet spellings it used to allow, and stops counting one that states nothing.

The record gate was measured before it was written, on `6cc4e1fd57722889380e0bbded3b4c4eaa568dd7`: ninety-four records, one file per number, no gap, and fifty-six relative record links across thirty-four documents, all resolving. So it lands green, which is the honest description of a gate for an invariant the tree already satisfies: its value is the next slice, and the duplicate it would have caught is the case it cannot have.

`docs/README.md` regains the paragraph saying what a record is for and what shape one has, which `DECISIONS.md` opened with and the extraction dropped rather than moved. That is the last thing [#439](https://github.com/chahyasantoso/motion5/issues/439)'s no-content-lost criterion was short of.

## Evidence

Helper cases in `packages/core/test/unit/scripts/session-status-shape.test.ts` refusing `<!-- x -->Phase:`, `&nbsp;Phase:`, a decimal and a hexadecimal reference that spell the label, and a comment splitting the word, plus the nested case under a real entry. All of them are red before this change. Beside them, cases keeping an entry that merely contains a comment or a reference, and a bullet that is nothing but a reference counted as no entry.

`packages/core/test/unit/scripts/adr-integrity.test.ts` for the record invariant, green on both sides by construction and stated as such rather than claimed as a regression.
