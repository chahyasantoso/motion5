import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

async function text(path: string): Promise<string> {
  return readFile(`${root}/${path}`, "utf8");
}

describe("P6-03 public documentation", () => {
  it("does not claim the old reopened Phase 4 reality", async () => {
    const [readme, docsReadme] = await Promise.all([text("README.md"), text("docs/README.md")]);
    expect(readme).not.toContain("Phase 4 is reopened");
    expect(docsReadme).not.toContain("Phase 4 reopened");
  });

  it("documents the Phase 6 base and the shipped packed consumer", async () => {
    const [status, session, plan] = await Promise.all([
      text("docs/SESSION-STATUS.md"),
      text("progress/STATUS.md"),
      text("docs/PHASE6-DETAILED-PLAN.md"),
    ]);
    expect(status).toContain("phase6/hardening-base");
    expect(status).toContain("P6-02");
    expect(session).toContain("P6-02");
    expect(plan).toContain("P6-03");
  });

  it("keeps the documentation map pointed at files that exist", async () => {
    const docsReadme = await text("docs/README.md");
    for (const link of docsReadme.matchAll(/\]\((\.\/[^)]+)\)/g)) {
      const target = link[1];
      if (target !== undefined) await expect(text(`docs/${target.slice(2)}`)).resolves.toBeTruthy();
    }
  });
});
