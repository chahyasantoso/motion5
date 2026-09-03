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
 * Issue #284.
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

  it("hands the reader a real file for each log it stopped keeping", async () => {
    const targets = [...(await status()).matchAll(LINK)].map((match) => match[1]);
    expect(targets).toContain("./GUARDRAILS.md");
    expect(targets).toContain("./LIVE-EDIT-COST.md");
    expect(existsSync(join(DOCS, "GUARDRAILS.md"))).toBe(true);
    expect(existsSync(join(DOCS, "LIVE-EDIT-COST.md"))).toBe(true);
  });
});
