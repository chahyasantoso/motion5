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
 * departed logs actually grew. It also refuses the staleness a ceiling cannot see: **Now** held six
 * entries and five described closed work, and two of the three under **Next in line** called
 * merged pull requests unmerged. The phase bullet was a second Now with a different name and the
 * longest half-life of anything in the file, so it is refused by name. See ADR-085.
 *
 * Issue #403 is that gate's own machinery rather than its policy. The section reader answered from
 * an arbitrary byte offset for a heading it could not find, a bare marker counted as an entry, and
 * the phase rule refused one formatting of the label rather than the label itself. A gate that
 * answers confidently from the wrong place is the defect this file exists to refuse, so the reader
 * is total, an entry has to state something, and the label is read where a label goes. See ADR-085.
 */

const DOCS = fileURLToPath(new URL("../../../../../docs/", import.meta.url));
const STATUS = join(DOCS, "SESSION-STATUS.md");
const LINK = /\]\((\.\/[^)]+\.md)\)/g;
const HEADING = /^## .*$/gm;
const COMMENTS = /<!--[\s\S]*?-->/g;
const EMPHASIS = /[*_]/g;

/**
 * The forbidden bullet's label, in the label position and read case-insensitively.
 *
 * Optionally `current`, then `phase`, then the end of the label rather than more words: a colon, a
 * hyphen, an en dash, an em dash or nothing at all end it, because the spellings issue #403 found
 * use every one of them. Prose that mentions a phase further along a real entry is not a label and
 * is not refused, and this file's own **Open, and not scheduled** section relies on that.
 */
const PHASE_LABEL = /^(?:current\s+)?phase\s*(?:[:\u2013\u2014-]|$)/i;

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
 */
function sectionLines(text: string, heading: string): readonly string[] {
  const lines = text.split("\n");
  const start = lines.indexOf(heading);
  if (start === -1) throw new Error(`${heading} is absent, so its entries cannot be counted.`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return end === -1 ? rest : rest.slice(0, end);
}

/** The top-level bullets in `lines`, so every rule below reads a bullet the same way. */
function topLevelBullets(lines: readonly string[]): readonly string[] {
  return lines.filter((line) => line.startsWith("- "));
}

/**
 * Whether `bullet` states something, which is what makes it an entry rather than a line.
 *
 * `- ` alone and `- <!-- placeholder -->` are both bullets and neither is an entry: the rule ADR-085
 * wrote down is one entry, and a marker with nothing after it satisfies a counter while stating
 * nothing a reader can check or a later slice can replace. Issue #403.
 */
function isEntry(bullet: string): boolean {
  return bullet.slice("- ".length).replace(COMMENTS, "").trim() !== "";
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
 */
function statesPhase(bullet: string): boolean {
  return PHASE_LABEL.test(bullet.slice("- ".length).replace(EMPHASIS, "").trim());
}

async function status(): Promise<string> {
  return readFile(STATUS, "utf8");
}

describe("session status shape", () => {
  it("carries exactly the sections a status file owns, and in that order", async () => {
    const headings = [...(await status()).matchAll(HEADING)].map((match) => match[0]);
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
    const bullets = topLevelBullets((await status()).split("\n"));
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
    ];
    for (const bullet of allowed) expect(statesPhase(bullet), bullet).toBe(false);
  });
});
