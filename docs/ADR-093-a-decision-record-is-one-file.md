# ADR-093: A decision record is one file, and there is no index

**Status:** Accepted, 2026-09-17

## Context

`docs/DECISIONS.md` held ADR-001 through ADR-027 inline. Every record from ADR-028 onward is its own `ADR-nnn-title.md` file in the same directory. So one kind of record had two shapes, and which shape a number resolved to was a fact about when it was written rather than about what it says.

The cost is not the duplication of shape. It is that the index was also a record. `DECISIONS.md` carried a second, shorter ADR-051 beside the real one in `ADR-051-derived-solver-membership.md`, and its own usage note forbade exactly that: never leave two active records that say opposite things. They did not contradict each other, which is why nothing caught it, and one of them held a paragraph the other did not. Four places pointed at the index for that paragraph rather than at the record that owns the subject: `ADR-051`, `ADR-052`, `ADR-054` and a comment in `packages/core/src/plugins/ik.ts`. A reader following any of them arrived at a file whose ADR-051 was not the ADR-051 the repository means.

Two premises from [issue #439](https://github.com/chahyasantoso/motion5/issues/439) are refused rather than implemented, and recorded here because a plan's prescription is measured before it is followed.

**The scale was ninety-one and it is twenty-seven.** The issue asked for ADR-001 through ADR-091 to be extracted. ADR-028 onward were already individual files, so sixty-four of those extractions had already happened. Extracting a record that is already extracted would have meant overwriting sixty-four live files with the index's shorter summaries of them, which is the one way this slice could have lost content.

**The read-budget claim does not hold, and is not what justifies the change.** The issue says the file truncates between ADR-027 and ADR-051 and exceeds the read-budget bounds. It is 21,306 bytes, it arrives whole in one contents read, and `scripts/read-budget-scan.mjs` scans `packages/core/src` rather than `docs/`, so no gate measured it and none would have. The reason to retire it is the duplicate record and the two shapes, both of which a reader hits without a budget being involved.

## Decision

A decision record is one file, named `docs/ADR-nnn-title.md`, and a number names exactly one file. `docs/DECISIONS.md` is deleted. **Refined by [ADR-095](./ADR-095-a-gate-reads-the-text-a-reader-sees.md), 2026-09-18.** This invariant was enforced by nothing when it was written, which is how the duplicate ADR-051 survived three weeks and is [#441](https://github.com/chahyasantoso/motion5/issues/441)'s recommendation; `packages/core/test/unit/scripts/adr-integrity.test.ts` now enforces one file per number, no gap, and every relative record link in this directory resolving. The decision is unchanged, and the Evidence section's claim that none was available holds for the extraction it describes.

There is no replacement index, and that is the decision rather than an omission. An index of ninety-three records is a second place every new record has to be written down, it is the kind of file that goes stale without any gate being able to see it, and this one demonstrated the failure by holding a record of its own. A search across `docs/ADR-*.md` answers what an index would have, and the filename carries the title, so the directory listing is the index.

The pre-flight rule the index carried in its own prose survives, and moves to [the documentation map](./README.md#decisions): before introducing a flag, alias, facade, second owner, compatibility path, new public export, authored identity form, diagnostics channel, or interpolation engine, search the records; a conflicting proposal is either rejected or superseded in the same pull request. It is a rule about reading the records, so it belongs with the navigation rather than inside one of them.

The twenty-seven extracted records keep their text exactly as the index held it, including the inline `**Context.**`, `**Decision.**`, `**Alternatives rejected.**` and `**Consequences.**` labels rather than being promoted to the level-two headings ADR-028 onward use. Rewriting them into the newer shape would have been an edit to ninety-odd paragraphs whose only reviewable claim is that nothing changed, in the same diff that moves them. The one thing added is a link: an `ADR-nnn` naming a superseding or superseded record now points at that record's file.

The paragraph the index held alone, that a solve's convergence record is deliberately not published, moves into `ADR-051-derived-solver-membership.md` beside the dispatch it is about, and the four references now point there.

## Alternatives rejected

**Keep the index as a table of contents.** It would still be a file that every new record has to update, and no check in this repository can tell whether it did. The failure mode is not hypothetical: the file this record deletes was a table of contents that had acquired a record.

**Keep `DECISIONS.md` for ADR-001 through ADR-027 and stop adding to it.** That is the state this record ends. It is stable only while nobody reads a number without already knowing which era it came from.

**Promote the twenty-seven to the ADR-028 heading shape in this slice.** Refused. It mixes a mechanical move with a rewrite of the moved text, so a reviewer checking that nothing was lost has to diff prose that deliberately changed. A later slice may do it per record, where the diff is readable.

## Consequences

A number resolves to one file for every record rather than for two thirds of them, and `ADR-051` in particular resolves to the record that owns the subject rather than to a summary of it beside the real one.

There is no single file to read to see every decision. That is a real loss, and the trade is that there is also no single file that can be wrong about them.

Historical documents under `docs/archived/` still name `DECISIONS.md`, and their prose is left alone: they are records of what a past plan said, and rewriting them would make them wrong about their own moment. `docs/archived/README.md` is the exception, because it makes a live claim about which documents stayed, and it is updated. The two `docs/IMPLEMENTATION-PLAN.md` mentions are inside a completed slice's own change manifest, which is the same kind of historical statement, and are left alone for the same reason.

## Evidence

None claimed, and none available: this slice moves prose and changes no behaviour, so there is no case that goes red without it. The `quality`, `read-budget`, `boundaries` and `build` contexts are what it has to keep green, and the boundary and read-budget scanners never read `docs/` in the first place.
