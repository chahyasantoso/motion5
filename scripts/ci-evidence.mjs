#!/usr/bin/env node
// One owner for discovery parity and consumption of the single suite's evidence.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const filters = {
  all: "",
  integration: "packages/core/test/integration",
  "end-to-end": "packages/core/test/integration/end-to-end.test.ts",
};
const directory = () => process.env.CI_EVIDENCE_DIR;
const read = (file) => {
  const bytes = readFileSync(file);
  assert.ok(bytes.length <= 20000000, "Evidence exceeds read limit");
  return JSON.parse(bytes.toString("utf8"));
};
const write = (name, value) => {
  assert.ok(directory(), "CI_EVIDENCE_DIR is required");
  mkdirSync(directory(), { recursive: true });
  writeFileSync(path.join(directory(), name), `${JSON.stringify(value)}\n`);
};
function identity() {
  const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  assert.match(sha, /^[a-f0-9]{40}$/);
  const configuration = createHash("sha256");
  for (const file of ["package-lock.json", "vite.config.ts", "scripts/ci-evidence.mjs"])
    configuration.update(file).update("\0").update(readFileSync(file));
  return {
    sha,
    run: process.env.GITHUB_RUN_ID,
    attempt: process.env.GITHUB_RUN_ATTEMPT,
    configuration: configuration.digest("hex"),
    node: process.version,
  };
}
function relative(file) {
  const value = path.relative(process.cwd(), file).split(path.sep).join("/");
  assert.ok(value && !value.startsWith("../") && !path.isAbsolute(value));
  return value;
}
function key(test) {
  assert.equal(typeof test.file, "string");
  assert.equal(typeof test.name, "string");
  assert.ok(test.file && test.name && !test.projectName, "Unsupported test identity");
  return JSON.stringify([test.file, test.name]);
}
function counts(tests) {
  assert.ok(Array.isArray(tests) && tests.length > 0, "Missing or empty inventory");
  const result = new Map();
  for (const test of tests) {
    const id = key(test);
    result.set(id, (result.get(id) ?? 0) + 1);
  }
  return [...result].sort(([a], [b]) => a.localeCompare(b));
}
export function verify(inventory, result, expected, scope) {
  assert.ok(Object.hasOwn(filters, scope), "Unknown evidence scope");
  assert.equal(inventory.version, 1);
  assert.equal(result.version, 1);
  assert.deepEqual(inventory.identity, expected, "Discovery identity mismatch");
  assert.deepEqual(result.identity, expected, "Execution identity mismatch");
  assert.equal(result.reason, "passed", "Suite did not complete successfully");
  assert.deepEqual(result.errors, [], "Unhandled suite errors");
  assert.ok(result.modules.length > 0, "Missing modules");
  assert.ok(result.modules.every((module) => module.state === "passed"), "Failed module");
  const all = counts(inventory.all);
  for (const subset of ["integration", "end-to-end"]) {
    const selected = inventory.all.filter((test) => test.file.includes(filters[subset]));
    assert.deepEqual(counts(inventory[subset]), counts(selected), "Discovery parity failed");
  }
  const passed = result.tests.filter((test) => test.state === "passed");
  assert.deepEqual(counts(passed), all, "Executed tests differ from discovery");
  const selected = result.tests.filter((test) => test.file.includes(filters[scope]));
  assert.ok(selected.length > 0, "Missing scoped results");
  if (scope !== "all")
    assert.ok(selected.every((test) => test.state === "passed"), "Skipped or failed subset");
  return { scope, tests: inventory[scope].length, identity: expected };
}

export default class EvidenceReporter {
  onTestRunEnd(modules, errors, reason) {
    write("execution.json", {
      version: 1,
      identity: identity(),
      reason,
      errors: errors.map((error) => String(error.message)),
      modules: modules.map((module) => ({
        file: relative(module.moduleId),
        state: module.state(),
      })),
      tests: modules.flatMap((module) =>
        [...module.children.allTests()].map((test) => ({
          file: relative(module.moduleId),
          name: test.fullName,
          projectName: module.project.name || undefined,
          state: test.result().state,
        })),
      ),
    });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const command = process.argv[2];
    if (command === "discover") {
      const inventory = { version: 1, identity: identity() };
      assert.ok(directory(), "CI_EVIDENCE_DIR is required");
      mkdirSync(directory(), { recursive: true });
      for (const [scope, filter] of Object.entries(filters)) {
        const output = path.join(directory(), `${scope}.json`);
        execFileSync(
          process.execPath,
          [
            "node_modules/vitest/vitest.mjs",
            "list",
            ...(filter ? [filter] : []),
            `--json=${output}`,
          ],
          { stdio: "inherit", timeout: 180000 },
        );
        inventory[scope] = read(output).map((test) => ({ ...test, file: relative(test.file) }));
        counts(inventory[scope]);
      }
      write("inventory.json", inventory);
    } else {
      assert.equal(command, "verify", "Unsupported operation");
      const inventory = read(path.join(directory(), "inventory.json"));
      const result = read(path.join(directory(), "execution.json"));
      console.log(JSON.stringify(verify(inventory, result, identity(), process.argv[3])));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
