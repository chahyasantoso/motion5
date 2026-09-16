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
 */

const DOCS = fileURLToPath(new URL("../../../../../docs/", import.meta.url));
const STATUS = join(DOCS, "SESSION-STATUS.md");
const LINK = /\]\((\.\/[^)]+\.md)\)/g;
const HEADING = /^## .*$/gm;

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
 * Answers the top-level bullets under `heading`, and nothing about what they say.
 *
 * A nested bullet is deliberately not counted. The rule is one entry, not one line, and an entry
 * that genuinely needs a sub-list is still one entry; forbidding that would be a budget shaping the
 * writing again, one level further down. The slice runs to the next level-two heading or to the end
 * of the file, which is why the section list is asserted before this is trusted.
 */
function bulletsUnder(text: string, heading: string): string[] {
  const start = text.indexOf(`${heading}\n`);
  const rest = text.slice(start + heading.length);
  const end = rest.indexOf("\n## ");
  const body = end === -1 ? rest : rest.slice(0, end);
  return body.split("\n").filter((line) => line.startsWith("- "));
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
      expect(bulletsUnder(text, heading), `${heading} states exactly one entry`).toHaveLength(1);
    }
  });

  it("states no phase, because a phase is a second Now with a longer half-life", async () => {
    const bullets = (await status()).split("\n").filter((line) => line.startsWith("- "));
    expect(bullets.filter((line) => /^- \*\*Phase[:*]/.test(line))).toEqual([]);
  });

  it("hands the reader a real file for each log it stopped keeping", async () => {
    const targets = [...(await status()).matchAll(LINK)].map((match) => match[1]);
    expect(targets).toContain("./GUARDRAILS.md");
    expect(targets).toContain("./LIVE-EDIT-COST.md");
    expect(existsSync(join(DOCS, "GUARDRAILS.md"))).toBe(true);
    expect(existsSync(join(DOCS, "LIVE-EDIT-COST.md"))).toBe(true);
  });
});
