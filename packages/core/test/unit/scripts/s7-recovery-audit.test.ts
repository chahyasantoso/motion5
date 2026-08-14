import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("S7 recovery audit workflow", () => {
  it("ships the executable audit contract instead of a documentation-only checklist", () => {
    const workflow = readFileSync(
      resolve(process.cwd(), ".github/workflows/recovery-audit.yml"),
      "utf8",
    );

    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toMatch(/inputs:[\s\S]*ref:/);
    expect(workflow).toMatch(/inputs:[\s\S]*base:/);
    expect(workflow).toContain("failing_first_exception");
    expect(workflow).toMatch(/contract:/);
    expect(workflow).toMatch(/mutation:/);
    expect(workflow).toMatch(/acceptance:/);
    expect(workflow).toMatch(/failing-first:/);
    expect(workflow).toMatch(/build:/);
    expect(workflow).toMatch(/report:/);
    expect(workflow).toContain("ci-logs");

    expect(workflow).toContain("vitest");
    expect(workflow).toContain("stryker");
    expect(workflow).toContain("mutation-baseline.json");
    expect(workflow).toContain("npm run benchmark");
    expect(workflow).toContain("performance/benchmark-report.json");
    expect(workflow).toContain("acceptance-map.json");
    expect(workflow).toContain("actions/upload-artifact");
  });
});
