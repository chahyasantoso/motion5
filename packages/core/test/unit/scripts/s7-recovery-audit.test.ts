import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("S7 recovery audit workflow", () => {
  it("ships the executable audit jobs instead of a documentation-only checklist", () => {
    const workflow = readFileSync(
      resolve(process.cwd(), ".github/workflows/recovery-audit.yml"),
      "utf8",
    );

    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toMatch(/contract:/);
    expect(workflow).toMatch(/mutation:/);
    expect(workflow).toMatch(/acceptance:/);
    expect(workflow).toMatch(/failing-first:/);
    expect(workflow).toMatch(/build:/);
    expect(workflow).toMatch(/report:/);
    expect(workflow).toContain("inputs:");
    expect(workflow).toContain("base:");
    expect(workflow).toContain("failing_first_exception");
    expect(workflow).toContain("ci-logs");
  });
});
