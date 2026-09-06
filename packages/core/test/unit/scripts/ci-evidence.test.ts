import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
function scenario(body: string) {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
      import assert from "node:assert/strict";
      import {verify} from "./scripts/ci-evidence.mjs";
      const identity = {sha: "a".repeat(40), run: "42", attempt: "1"};
      const test = {file: "packages/core/test/integration/end-to-end.test.ts", name: "suite > test"};
      const inventory = {version: 1, identity, all: [test], integration: [test], "end-to-end": [test]};
      const result = {version: 1, identity, reason: "passed", errors: [], modules: [{state: "passed"}], tests: [{...test, state: "passed"}]};
      ${body}
      `,
    ],
    { cwd: root, encoding: "utf8", timeout: 10000 },
  );
  expect(result.status, result.stderr).toBe(0);
}

describe("single-suite CI evidence", () => {
  it("accepts complete exact-run evidence for both compatibility contexts", () => {
    scenario(`
      for (const scope of ["all", "integration", "end-to-end"])
        assert.equal(verify(inventory, result, identity, scope).tests, 1);
    `);
  });

  it("refuses missing, failed, skipped, cancelled, or incomplete evidence", () => {
    scenario(`
      for (const patch of [
        {reason: "interrupted"}, {reason: "failed"}, {errors: ["error"]},
        {modules: []}, {modules: [{state: "failed"}]}, {tests: []},
        {tests: [{...test, state: "skipped"}]}, {tests: [{...test, state: "failed"}]},
        {tests: [{...test, state: "pending"}]},
      ]) assert.throws(() => verify(inventory, {...result, ...patch}, identity, "integration"));
      assert.throws(() => verify(inventory, undefined, identity, "integration"));
    `);
  });

  it("refuses stale heads, other runs, other attempts, and different configurations", () => {
    scenario(`
      for (const patch of [{sha: "b".repeat(40)}, {run: "43"}, {attempt: "2"}, {configuration: "other"}]) {
        assert.throws(() => verify(inventory, {...result, identity: {...identity, ...patch}}, identity, "all"));
        assert.throws(() => verify({...inventory, identity: {...identity, ...patch}}, result, identity, "all"));
      }
    `);
  });

  it("compares discovery multiplicity and rejects missing subset assertions", () => {
    scenario(`
      assert.throws(() => verify({...inventory, integration: []}, result, identity, "all"));
      assert.throws(() => verify({...inventory, integration: [test, test]}, result, identity, "all"));
      assert.throws(() => verify(inventory, {...result, tests: [...result.tests, ...result.tests]}, identity, "all"));
      assert.throws(() => verify(inventory, result, identity, "unknown"));
    `);
  });

  it("keeps one suite owner and real scans without removing existing contexts", () => {
    const workflow = readFileSync(new URL(".github/workflows/ci.yml", `file://${root}`), "utf8");
    expect(workflow.match(/run: npm test/g)).toHaveLength(1);
    expect(workflow).not.toContain("run: npm run test:integration");
    expect(workflow).not.toContain("run: npx vitest run");
    expect(workflow).toContain("node scripts/boundary-scan.mjs");
    expect(workflow).toContain("node scripts/read-budget-scan.mjs");
    expect(workflow).toContain("node scripts/ci-evidence.mjs verify integration");
    expect(workflow).toContain("node scripts/ci-evidence.mjs verify end-to-end");
    expect(workflow).toContain("needs.quality.result");
  });
});
