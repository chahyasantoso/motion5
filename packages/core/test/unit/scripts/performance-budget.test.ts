import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

describe("P6-04 required performance budget", () => {
  it("promotes the budget to required after its expiry and removes advisory continuation", async () => {
    const budget = JSON.parse(await readFile(`${root}/performance/budgets.json`, "utf8")) as {
      status: string;
      expiresOn: string;
    };
    const workflow = await readFile(`${root}/.github/workflows/ci.yml`, "utf8");
    expect(budget.status).toBe("required");
    expect(budget.expiresOn).toBe("2026-08-17");
    expect(workflow).not.toContain("continue-on-error: true");
    expect(workflow).toContain("npm run benchmark");
  });
});
