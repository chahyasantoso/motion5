import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../", import.meta.url));
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
      const test = {file: "packages/rig/test/chain.test.ts", name: "suite > test"};
      const inventory = {version: 1, identity, all: [test]};
      const result = {version: 1, identity, reason: "passed", errors: [], modules: [{state: "passed"}], tests: [{...test, state: "passed"}]};
      ${body}
      `,
    ],
    { cwd: root, encoding: "utf8", timeout: 10000 },
  );
  expect(result.status, result.stderr).toBe(0);
}

describe("single-suite CI evidence", () => {
  it("accepts complete exact-run evidence", () => {
    scenario(`
      assert.equal(verify(inventory, result, identity, "all").tests, 1);
    `);
  });

  it("refuses missing, failed, skipped, cancelled, or incomplete evidence", () => {
    scenario(`
      for (const patch of [
        {reason: "interrupted"}, {reason: "failed"}, {errors: ["error"]},
        {modules: []}, {modules: [{state: "failed"}]}, {tests: []},
        {tests: [{...test, state: "skipped"}]}, {tests: [{...test, state: "failed"}]},
        {tests: [{...test, state: "pending"}]},
      ]) assert.throws(() => verify(inventory, {...result, ...patch}, identity, "all"));
      assert.throws(() => verify(inventory, undefined, identity, "all"));
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

  it("compares discovery multiplicity and rejects results that differ from discovery", () => {
    scenario(`
      const other = {file: "packages/rig/test/ik/other.test.ts", name: "other > test"};
      const expanded = {...inventory, all: [test, other]};
      const executed = {...result, tests: [...result.tests, {...other, state: "passed"}]};
      assert.equal(verify(expanded, executed, identity, "all").tests, 2);
      assert.throws(() => verify(expanded, result, identity, "all"));
      assert.throws(() => verify({...inventory, all: [test, test]}, result, identity, "all"));
      assert.throws(() => verify(inventory, {...result, tests: [...result.tests, ...result.tests]}, identity, "all"));
      assert.throws(() => verify(inventory, result, identity, "unknown"));
    `);
  });

  it("keeps one suite owner and real scans", () => {
    const workflow = readFileSync(new URL(".github/workflows/ci.yml", `file://${root}`), "utf8");
    expect(workflow.match(/run: npm test/g)).toHaveLength(1);
    expect(workflow).not.toContain("run: npx vitest run");
    expect(workflow).toContain("node scripts/boundary-scan.mjs");
    expect(workflow).toContain("node scripts/ci-evidence.mjs verify all");
  });
});
