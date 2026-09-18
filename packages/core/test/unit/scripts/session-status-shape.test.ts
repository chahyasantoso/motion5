import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * `docs/SESSION-STATUS.md` is the one document allowed to claim what has landed, and it is also the
 * file every pull request is asked to update. Those two facts together made it append-only: it
 * reached 99,180 bytes while its own first paragraph called it deliberately small, and issue #267's
 * read-budget scan named it on the way past without gating it, because that scan reads
 * `packages/core/src` and no documentation.
 *
 * Three of its sections grew once per slice and none of them had to, because each already had an
 * owner named in the file itself. The per-slice narrative belongs to the pull request that landed
 * the slice and the ADR that decided it. The red and green run ids belong to that same pull request
 * body, which the old file's last bullet already said out loud. The standing rules belong to
 * `docs/GUARDRAILS.md`, and what a caller may do to a loaded project belongs to
 * `docs/LIVE-EDIT-COST.md`.
 *
 * So this gate is a shape and a ceiling rather than a ceiling alone. A ceiling by itself is
 * satisfied by deleting whichever paragraph is cheapest, which is the gate ADR-008 refuses wearing
 * a nicer hat, and it cannot say which paragraph should never have been here. The closed section
 * list is what refuses a returning log by name, on its heading, before its bytes are the problem.
 * The ceiling is what catches growth inside a section the list allows.
 *
 * Issue #284, and its follow-up #384.
 *
 * The ceiling alone then walked into the failure the paragraph above predicts. The file reached
 * 7,960 of its 8,000 bytes, which is less than one markdown link, so the count correction #375 made
 * spent two of the forty that were left and the follow-up issue it wanted to name could not be
 * linked. The number is not the problem and it does not move. What moves is the shape: **Now** and
 * **Next in line** carry exactly one entry each, and no bullet states a phase.
 *
 * A section that may hold one entry cannot accumulate a log at all, which is the property the
 * closed list above already had for headings, applied one level down to the place all three
 * departed logs actually grew. What it refuses is an accumulated log, by cardinality, and that is
 * what all three of them were: **Now** held six entries and five described closed work, and two of
 * the three under **Next in line** called merged pull requests unmerged. Cardinality is the whole
 * of it, which is issue #423. One entry that is false satisfies every case in this file, so
 * freshness is not gated here and is not claimed to be: it is the human check `AGENTS.md` names and
 * ADR-085's decision four owns, and a gate that claims more than it checks invites the reader to
 * stop being the mechanism that does. The phase bullet was a second Now with a different name and
 * the longest half-life of anything in the file, so it is refused by name. See ADR-085.
 *
 * Issue #403 is that gate's own machinery rather than its policy. The section reader answered from
 * an arbitrary byte offset for a heading it could not find, a bare marker counted as an entry, and
 * the phase rule refused one formatting of the label rather than the label itself. A gate that
 * answers confidently from the wrong place is the defect this file exists to refuse, so the reader
 * is total, an entry has to state something, and the label is read where a label goes. See ADR-085.
 *
 * Issues #420, #421 and #422 are the same layer again, and they are why the grammar is now written
 * down rather than inferred. The reader had a line grammar narrower than Markdown and said so
 * nowhere, so it depended on Prettier for two thirds of it while `core.autocrlf` was never a
 * formatter question at all. One bullet set answered two questions and carried the entry count's
 * nested exemption across to the label rule, which had never argued for one. And the label was
 * terminated by a list of four characters with no room for the number a writer puts after the word.
 * See ADR-085.
 *
 * Issue #436 is the last of that family and the first that was a live bypass rather than a latent
 * one. Two helpers disagreed about what a comment is, so a bullet that renders as a phase label was
 * counted as a real entry and refused by nothing, and the bypass cost one HTML comment and no
 * argument. The subject both of them read has one owner now. See ADR-095.
 */

const DOCS = fileURLToPath(new URL("../../../../../docs/", import.meta.url));
const STATUS = join(DOCS, "SESSION-STATUS.md");
const LINK = /\]\((\.\/[^)]+\.md)\)/g;
const COMMENTS = /<!--[\s\S]*?-->/g;
const HTML_TAG = /<\/?[a-zA-Z][^>]*>/g;
const NUMERIC_REFERENCE = /&#(\d+|[xX][0-9a-fA-F]+);/g;
const NAMED_REFERENCE = /&[a-zA-Z][a-zA-Z0-9]*;/g;
const MAX_CODE_POINT = 0x10ffff;
const EMPHASIS = /[*_]/g;
const LINE_END = /\s+$/;
const LABEL_LEAD = /^\W+/;
const SECTION_MARKER = "## ";
const BULLET = "- ";

/**
 * The forbidden bullet's label, in the label position and read case-insensitively.
 *
 * Optionally `current`, then `phase`, then an optional numeric designator, then the end of the label
 * rather than more words. Prose that mentions a phase further along a real entry is not a label and
 * is not refused, and this file's own **Open, and not scheduled** section relies on that.
 *
 * Issue #422 is the two halves of that sentence an enumeration could not reach. `Phase 6:` was
 * allowed, because the number sat between the label and the colon the rule was looking for, so a
 * writer could satisfy the gate by numbering the phase they were already numbering; #384 exists
 * because a reminder was not enough, and a rule satisfied by numbering is a reminder again. And the
 * terminator was a list of four characters, so `Phase = live editing` and `Phase / live editing`
 * passed a rule whose own issue existed to lengthen that list. Any character that is neither a word
 * character nor whitespace ends the label now, which is the answer that stops the list from being
 * the thing maintained. Naming a closed set of terminators here instead is refused for that reason.
 *
 * The distinction the live file depends on survives both widenings, and it is the same one the rule
 * already drew without a number. `Phase 6 packaging follows the current phase.` is a real entry
 * under **Open, and not scheduled** and stays allowed, because no separator follows its designator.
 * The label is refused; the noun is not. See ADR-085.
 */
const PHASE_LABEL = /^(?:current\s+)?phase(?:\s*\d+)?\s*(?:[^\w\s]|$)/i;

/**
 * Comfortably above the rewritten file and far below any of the three logs that left it. The number
 * is deliberately not tight. A status file edited under a budget it can breach in one honest
 * sentence gets edited to satisfy the budget instead of to state the status, and the closed section
 * list is what actually keeps the logs out; this catches the slow case that list cannot see.
 */
const CEILING = 8000;

const SECTIONS = [
  "## Now",
  "## Next in line",
  "## Open, and not scheduled",
  "## Where the rest of it lives",
];

/**
 * The two sections that state current state, and therefore the two that may hold one entry each.
 *
 * The other two are not per-slice narrative and neither has ever grown, so the rule is not applied
 * to them: a constraint enforced where it is not needed is the kind that gets deleted for being
 * noise. See ADR-085.
 */
const SINGLE_ENTRY = ["## Now", "## Next in line"];

/**
 * The lines under `heading`, up to the next level-two heading or to the end of the file.
 *
 * Total, and that is the first half of issue #403. This sliced by byte offset from `indexOf`, so a
 * heading the file does not have made the offset `-1`, the slice began `heading.length - 1` bytes
 * in, and the helper counted bullets from an arbitrary place while the failure message named a
 * section it had never found. The section-list case catches a missing heading first today, so it
 * was latent rather than live, and a helper that answers confidently from the wrong place is the
 * shape of defect this file exists to refuse. A heading that is absent is not a section with no
 * entries, so it is refused here rather than answered.
 *
 * Lines rather than bytes, so a heading on the last line of the file is found like any other and
 * the arithmetic that caused the defect is deleted rather than corrected.
 *
 * The lines arrive normalised, which is issue #421: exact equality is the right comparison for a
 * closed section list and the wrong one for a line a checkout may have added a carriage return to.
 */
function sectionLines(text: string, heading: string): readonly string[] {
  const lines = statusLines(text);
  const start = lines.indexOf(heading);
  if (start === -1) throw new Error(`${heading} is absent, so its entries cannot be counted.`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith(SECTION_MARKER));
  return end === -1 ? rest : rest.slice(0, end);
}

/**
 * The file as lines, with the trailing whitespace a checkout or an unformatted edit can add removed.
 *
 * The one owner of how this file becomes lines, and the first half of issue #421. Each reader used
 * to split for itself and compare a heading by exact equality, so a Windows checkout with
 * `core.autocrlf` stored the first line as `## Now` followed by a carriage return, the heading was
 * absent, and the gate refused a file that has it while naming a section it had never found. A
 * heading a writer left a trailing space on read the same way, and Prettier strips that one, which
 * is the actual finding: the gate depended on the formatter for its grammar and said so nowhere.
 *
 * Two things it deliberately does not normalise, stated here rather than assumed. A list marker is a
 * hyphen, because Prettier normalises `*` and `+` to `-`: one marker in one file is a contract worth
 * defending and three markers is a parser a status file does not need. Prose is fence-free, because
 * an unindented section marker inside a fenced code block is read as a real boundary; this file has
 * never had a fenced block, and what that produces is a loud failure against the section list rather
 * than a bypass of anything, which is why it is the part left alone. See ADR-085.
 */
function statusLines(text: string): readonly string[] {
  return text.split("\n").map((line) => line.replace(LINE_END, ""));
}

/** The top-level bullets in `lines`, which is what the entry count reads and only it. */
function topLevelBullets(lines: readonly string[]): readonly string[] {
  return lines.filter((line) => line.startsWith(BULLET));
}

/**
 * Every list bullet in `lines`, at any indentation, answered without its indent.
 *
 * The phase rule read `topLevelBullets`, and issue #420 is what one bullet set answering two
 * questions cost. The nested exemption was argued for the entry count, where the rule is one entry
 * rather than one line, and it was never argued for the label, so a phase bullet indented once under
 * a real entry was counted by nothing, refused by nothing, and fully visible to every reader of the
 * file. The bypass cost one indent and no argument. The entry count stays top-level and the label is
 * read on every bullet, which is the honest shape: an entry may need a sub-list, and no part of an
 * entry may be labelled a phase. Amending ADR-085 to permit a nested phase bullet is refused,
 * because the nested text is exactly as readable as the top-level one, so it recreates the stale
 * second **Now** that decision removed. See ADR-085.
 */
function allBullets(lines: readonly string[]): readonly string[] {
  return lines.map((line) => line.trimStart()).filter((line) => line.startsWith(BULLET));
}

/**
 * The text a reader sees in `bullet`, and the one owner of what that text is.
 *
 * Both readings of a bullet are about this string, and issue #436 is that they disagreed about it.
 * `isEntry` stripped HTML comments before asking whether a bullet states something and the label rule
 * never did, so `- <!-- x -->Phase: live editing` was counted as a real entry, rendered as a phase
 * label, and refused by nothing: stripping leading non-word characters reaches decoration made of
 * them and stops at the first word character, which `x` is. One question with two answers, and the
 * cheaper of the two is the one a writer reaches. See ADR-095.
 *
 * A numeric character reference is decoded and a named one becomes a space, which is asymmetric on
 * purpose. `&#80;hase:` spells the label, so neutralising it would move the bypass one spelling
 * along; no named reference produces an ASCII word character, so a named one cannot spell the label,
 * and a table of them would be the list #422 already refused to start maintaining. A malformed or
 * out-of-range reference becomes a space rather than a guess.
 *
 * A raw HTML element goes the way the comment goes, and for the same reason: Markdown passes inline
 * HTML through, so `<span>Phase:</span>` renders as the label with the markup invisible, and a tag
 * whose own name is a word is exactly what the leading strip stops at. Found by the quality pass over
 * this change rather than by the issue, and it is the reported defect one spelling out. Only the tags
 * are removed and never the text between them, so an entry that legitimately emphasises a word keeps
 * what it says.
 *
 * A reference missing its closing semicolon is deliberately not decoded. Markdown renders `&#80hase`
 * and `&nbsp Phase:` literally, ampersand and all, so a reader never sees a label there and decoding
 * one here would refuse prose instead of a bypass.
 */
function bulletSubject(bullet: string): string {
  return bullet
    .slice(BULLET.length)
    .replace(COMMENTS, "")
    .replace(HTML_TAG, "")
    .replace(NUMERIC_REFERENCE, decodeReference)
    .replace(NAMED_REFERENCE, " ");
}

/** The character a numeric reference names, or a space when it names none. */
function decodeReference(_reference: string, digits: string): string {
  const hex = digits.startsWith("x") || digits.startsWith("X");
  const code = Number.parseInt(hex ? digits.slice(1) : digits, hex ? 16 : 10);
  if (!Number.isInteger(code) || code < 0 || code > MAX_CODE_POINT) return " ";
  return String.fromCodePoint(code);
}

/**
 * Whether `bullet` states something, which is what makes it an entry rather than a line.
 *
 * `- ` alone and `- <!-- placeholder -->` are both bullets and neither is an entry: the rule ADR-085
 * wrote down is one entry, and a marker with nothing after it satisfies a counter while stating
 * nothing a reader can check or a later slice can replace. Issue #403. A bullet that renders as
 * nothing but a character reference states nothing either, which follows from reading the subject
 * rather than the line. See ADR-095.
 */
function isEntry(bullet: string): boolean {
  return bulletSubject(bullet).trim() !== "";
}

/**
 * Answers the entries under `heading`, and nothing about what they say.
 *
 * A nested bullet is deliberately not counted. The rule is one entry, not one line, and an entry
 * that genuinely needs a sub-list is still one entry; forbidding that would be a budget shaping the
 * writing again, one level further down.
 */
function entriesUnder(text: string, heading: string): readonly string[] {
  return topLevelBullets(sectionLines(text, heading)).filter(isEntry);
}

/**
 * Whether `bullet` is the phase bullet, read by its label rather than by one formatting of it.
 *
 * ADR-085 says the gate refuses the bullet by its own label, and it read one spelling of it: bold,
 * capitalised, and terminated by a colon or an asterisk. An unbolded, a lowercase, a dash-separated
 * and a `Current phase` bullet all passed the gate that exists to refuse them. Emphasis is stripped
 * and the label is matched in the label position only, which is narrower than matching the word on
 * purpose: the noun is allowed anywhere in an entry, the label is allowed nowhere. Issue #403.
 *
 * Leading non-word characters are stripped before the match, which is the decoration half of issue
 * #422 decided rather than left to omission. A decorated label is still a label, so an emoji before
 * the word and a bare `[Phase](./IMPLEMENTATION-PLAN.md):` are both refused. A link inside a
 * sentence is not a label and stays allowed, because stripping only what leads the bullet cannot
 * reach it. See ADR-085.
 *
 * The subject it reads is `bulletSubject`, shared with the entry count, which is issue #436: leading
 * non-word characters stop being stripped at the first word character, so markup whose own text is a
 * word survived that strip and `<!-- x -->Phase:` and `&nbsp;Phase:` both rendered as labels while
 * passing the gate. Decoration is removed before the grammar runs, and the grammar is unchanged. See
 * ADR-095.
 */
function statesPhase(bullet: string): boolean {
  const subject = bulletSubject(bullet).replace(EMPHASIS, "").trim().replace(LABEL_LEAD, "");
  return PHASE_LABEL.test(subject);
}

async function status(): Promise<string> {
  return readFile(STATUS, "utf8");
}

describe("session status shape", () => {
  it("carries exactly the sections a status file owns, and in that order", async () => {
    const headings = statusLines(await status()).filter((line) => line.startsWith(SECTION_MARKER));
    expect(headings).toEqual(SECTIONS);
  });

  it("stays under a ceiling current state has no honest reason to cross", async () => {
    const { size } = await stat(STATUS);
    expect(size).toBeGreaterThan(0);
    expect(size).toBeLessThanOrEqual(CEILING);
  });

  it("states one Now and one Next in line, so neither can become a log", async () => {
    const text = await status();
    for (const heading of SINGLE_ENTRY) {
      // Exactly one rather than at most one: a project with nothing queued still has to say so in a
      // sentence a reader can check, and an empty section reads the same as an unupdated one.
      expect(entriesUnder(text, heading), `${heading} states exactly one entry`).toHaveLength(1);
    }
  });

  it("states no phase, because a phase is a second Now with a longer half-life", async () => {
    // Every bullet at any indent, which is issue #420: the nested exemption was argued for the
    // entry count, and the label was never part of that argument.
    const bullets = allBullets(statusLines(await status()));
    expect(bullets.filter(statesPhase)).toEqual([]);
  });

  it("hands the reader a real file for each log it stopped keeping", async () => {
    const targets = [...(await status()).matchAll(LINK)].map((match) => match[1]);
    expect(targets).toContain("./GUARDRAILS.md");
    expect(targets).toContain("./LIVE-EDIT-COST.md");
    expect(existsSync(join(DOCS, "GUARDRAILS.md"))).toBe(true);
    expect(existsSync(join(DOCS, "LIVE-EDIT-COST.md"))).toBe(true);
  });
});

/**
 * The gate's own machinery, exercised directly rather than through the file it guards.
 *
 * Both halves of issue #403 are latent: the section-list case catches a missing heading before the
 * reader can misread one, and the live file is clean of every phase spelling today. A latent defect
 * is only pinned where the helper is handed the input the live file never has, so these cases hand
 * it that input rather than arguing about it. See ADR-085.
 */
describe("the shape gate reads a section totally", () => {
  it("refuses a heading it cannot find rather than counting from an arbitrary offset", () => {
    expect(() => entriesUnder("# Title\n\n- one\n", "## Now")).toThrow(/## Now is absent/);
  });

  it("answers no entries for a heading on the last line of the file", () => {
    expect(entriesUnder("## Now\n- one\n\n## Next in line", "## Next in line")).toEqual([]);
  });

  it("stops at the next section rather than reading on to the end of the file", () => {
    expect(entriesUnder("## Now\n- one\n\n## Next in line\n- two\n", "## Now")).toHaveLength(1);
  });

  it("counts a bullet that states something, and not a marker that states nothing", () => {
    expect(entriesUnder("## Now\n- \n- <!-- placeholder -->\n", "## Now")).toEqual([]);
    expect(entriesUnder("## Now\n- one\n", "## Now")).toEqual(["- one"]);
  });

  it("counts an entry that needs a sub-list once, and two entries twice", () => {
    expect(entriesUnder("## Now\n- one\n  - detail\n  - more detail\n", "## Now")).toHaveLength(1);
    expect(entriesUnder("## Now\n- one\n- two\n", "## Now")).toHaveLength(2);
  });

  it("reads a section a Windows checkout handed it with carriage returns", () => {
    expect(entriesUnder("## Now\r\n- one\r\n", "## Now")).toEqual(["- one"]);
  });

  it("reads a heading an unformatted edit left a trailing space on", () => {
    expect(entriesUnder("## Now \n- one\n", "## Now")).toEqual(["- one"]);
  });

  it("counts hyphen markers only, because one marker in one file is the contract", () => {
    expect(entriesUnder("## Now\n* one\n+ two\n", "## Now")).toEqual([]);
  });

  it("counts the hyphen entry in a mixed section, which is what that contract costs", () => {
    // Two visible entries and one counted, so the one-entry rule passes on a section that breaks it.
    // Recognising `*` and `+` is refused, and this is the cost of that refusal pinned rather than
    // discovered: Prettier normalises markers before this gate ever reads them, and the case exists
    // so that dependency is written down instead of assumed. Issue #421.
    expect(entriesUnder("## Now\n- one\n* two\n", "## Now")).toEqual(["- one"]);
  });

  it("treats a section marker inside a fence as a real boundary, loudly rather than quietly", () => {
    // Left alone rather than fixed, and the least valuable of the four: it produces a
    // correct-looking failure against the section list rather than a bypass, and this file has never
    // had a fenced block. Issue #421.
    const fenced = "## Now\n- one\n\n```md\n## Next in line\n```\n";
    expect(entriesUnder(fenced, "## Now")).toEqual(["- one"]);
  });

  it("counts one entry and refuses a phase nested under it", () => {
    // The two readings split, which is issue #420. The entry count keeps its nested exemption; the
    // label rule never had one to keep.
    const nested = "## Now\n- one\n  - **Phase:** live editing\n";
    expect(entriesUnder(nested, "## Now")).toEqual(["- one"]);
    expect(allBullets(statusLines(nested)).filter(statesPhase)).toEqual([
      "- **Phase:** live editing",
    ]);
  });

  it("leaves an ordinary nested bullet uncounted and unrefused", () => {
    // The widening reads every bullet for a label, and starts counting none of them as entries.
    const nested = "## Now\n- one\n  - a detail that is not a label\n";
    expect(entriesUnder(nested, "## Now")).toEqual(["- one"]);
    expect(allBullets(statusLines(nested)).filter(statesPhase)).toEqual([]);
  });
});

describe("the shape gate refuses the phase label rather than one spelling of it", () => {
  it("reads the label whatever emphasis and case the writing gave it", () => {
    const labelled = [
      "- **Phase:** live editing",
      "- Phase: live editing",
      "- **phase:** live editing",
      "- **Phase \u2014** live editing",
      "- Current phase: live editing",
      "- **Current Phase**",
    ];
    for (const bullet of labelled) expect(statesPhase(bullet), bullet).toBe(true);
  });

  it("allows an entry whose prose mentions a phase, because the label position is the rule", () => {
    const allowed = [
      "- Phase 6 packaging follows the current phase.",
      "- **The publication seam is the live area:** the second pass is landing on one base.",
      "- A phase with no inverse completes rather than refusing partway.",
      "- A slice that [names a phase](./IMPLEMENTATION-PLAN.md) is not labelling one.",
    ];
    for (const bullet of allowed) expect(statesPhase(bullet), bullet).toBe(false);
  });

  it("refuses a numbered label, which is the spelling a writer reaches for first", () => {
    // The live file's legitimate entry and the forbidden label differed by a colon the old rule
    // could not see, because the number sat between the label and it. Issue #422.
    const numbered = [
      "- Phase 6: live editing",
      "- Phase\u00a06: live editing",
      "- **Phase 6 \u2014** live editing",
    ];
    for (const bullet of numbered) expect(statesPhase(bullet), bullet).toBe(true);
  });

  it("refuses a decorated label, because a decorated label is still a label", () => {
    const decorated = [
      "- \u{1f9ed} Phase: live editing",
      "- [Phase](./IMPLEMENTATION-PLAN.md): live editing",
      "- \u2192 Phase: live editing",
    ];
    for (const bullet of decorated) expect(statesPhase(bullet), bullet).toBe(true);
  });

  it("ends the label at any separator rather than at a list of four", () => {
    const separated = [
      "- Phase = live editing",
      "- Phase / live editing",
      "- Phase | live editing",
      "- Phase\u00a0: live editing",
    ];
    for (const bullet of separated) expect(statesPhase(bullet), bullet).toBe(true);
  });

  it("refuses a label whose decoration is markup that renders as nothing", () => {
    // Red before this change, and the live bypass of issue #436: every one of these renders as a
    // phase label, and the leading strip stopped at the first word character inside the markup.
    const hidden = [
      "- <!-- x -->Phase: live editing",
      "- &nbsp;Phase: live editing",
      "- &#80;hase: live editing",
      "- &#x50;hase 6: live editing",
      "- Ph<!-- split -->ase: live editing",
      // Inline HTML renders as the label too, and the tag name is the word the leading strip stopped
      // at, so these are the reported defect one spelling out. Found by the pass over this change.
      "- <span>Phase:</span> live editing",
      "- <b>Phase:</b> live editing",
      "- <span class='x'>Phase 6:</span> live editing",
    ];
    for (const bullet of hidden) expect(statesPhase(bullet), bullet).toBe(true);
  });

  it("refuses a hidden label nested under a real entry, and still counts the entry once", () => {
    // The two readings share a subject and keep disagreeing about nesting, which is the split issue
    // #420 made and this change does not undo.
    const nested =
      "## Now\n- one\n  - <!-- x -->Phase: live editing\n  - <span>Phase:</span> live editing\n";
    expect(entriesUnder(nested, "## Now")).toEqual(["- one"]);
    expect(allBullets(statusLines(nested)).filter(statesPhase)).toEqual([
      "- <!-- x -->Phase: live editing",
      "- <span>Phase:</span> live editing",
    ]);
  });

  it("keeps an entry that merely contains a comment or a character reference", () => {
    const allowed = [
      "- An entry with a <!-- note --> comment, about the phase it is not labelling.",
      "- The gate reads AT&amp;T and every other reference as ordinary prose.",
      "- A slice that names a phase&nbsp;6 target is not labelling one.",
      "- An entry that <b>emphasises</b> a phase noun mid-sentence is not labelling one.",
      "- A reference with no semicolon reads as &nbsp Phase, which no reader sees as a label.",
    ];
    for (const bullet of allowed) expect(statesPhase(bullet), bullet).toBe(false);
    expect(entriesUnder("## Now\n- one <!-- note -->\n", "## Now")).toEqual([
      "- one <!-- note -->",
    ]);
    // And a bullet that renders as nothing but a reference states nothing, which is the entry count
    // reading the subject rather than the line.
    expect(entriesUnder("## Now\n- &nbsp;\n", "## Now")).toEqual([]);
  });
});
