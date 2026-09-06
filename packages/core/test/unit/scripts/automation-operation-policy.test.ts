import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
function scenario(body: string) {
  const setup = String.raw`
    import assert from "node:assert/strict";
    import * as fs from "node:fs/promises";
    import os from "node:os";
    import path from "node:path";
    import {execFileSync} from "node:child_process";
    import {identity} from "./scripts/automation-receipt.mjs";
    import {operationSpec, persistOperation} from "./scripts/automation-operation.mjs";
    import {prepareCandidate, validateCandidate, publishRun} from "./scripts/automation-publish.mjs";
    const A = "a".repeat(40), B = "b".repeat(40), C = "c".repeat(40);
    async function fixture(body) {
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "motion5-operation-test-"));
      try {
        for (const child of [".ai/edits", "docs", "packages/core/src"]) await fs.mkdir(path.join(dir, child), {recursive: true});
        await fs.writeFile(path.join(dir, "docs/a.json"), '{"a":1}\n');
        await fs.writeFile(path.join(dir, "packages/core/src/a.ts"), "export const a = 1;\n");
        await fs.writeFile(path.join(dir, ".prettierrc.cjs"), "throw new Error('candidate config executed')");
        const git = (...args) => execFileSync("git", args, {cwd: dir, encoding: "utf8"}).trim();
        git("init", "-q"); git("config", "user.name", "fixture"); git("config", "user.email", "fixture@example.invalid"); git("add", "."); git("commit", "-qm", "source");
        const source = git("rev-parse", "HEAD");
        const base = {version: 1, expected_head: source, expected_blobs: {"docs/a.json": git("rev-parse", "HEAD:docs/a.json")}, message: "test(fixture): operation"};
        async function prepare(request) {
          await fs.writeFile(path.join(dir, ".ai/edits/test.json"), JSON.stringify(request));
          git("add", ".ai/edits/test.json"); git("commit", "-qm", "request");
          const output = path.join(dir, "candidate.json");
          await prepareCandidate(dir, A, root, output);
          return JSON.parse(await fs.readFile(output, "utf8"));
        }
        await body({dir, git, source, base, prepare});
      } finally {await fs.rm(dir, {recursive: true, force: true});}
    }
    const root = process.cwd();
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", setup + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
    maxBuffer: 1000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

it("accepts only explicit bounded operations and refuses maintenance even with a token", () => {
  scenario(String.raw`
    const apply = {version: 1, expected_head: A, expected_blobs: {"docs/a.json": null}, message: "test(fixture): apply", edits: [{path: "docs/a.json", create: "{}"}]};
    assert.equal(operationSpec(apply).operation, "apply");
    assert.equal(operationSpec({...apply, operation: "preview"}).operation, "preview");
    assert.equal(operationSpec({...apply, dry_run: true}).operation, "preview");
    process.env.PERSONAL_ACCESS_TOKEN = "fixture-not-a-token";
    for (const patch of [{operation: "shell"}, {operation: "dependencies"}, {operation: "preview", dry_run: true}, {dry_rnu: true}, {command: "npm test"}, {version: 2}, {message: "test: [skip ci]"}, {edits: [{path: "docs/a.json", create: "{}", extra: true}]}]) assert.throws(() => operationSpec({...apply, ...patch}));
    const validation = {version: 1, expected_head: A, expected_blobs: {"docs/a.json": B}, message: "test(fixture): validate", operation: "validate", paths: ["docs/a.json"], checks: ["format"]};
    assert.equal(operationSpec(validation).operation, "validate");
    for (const patch of [{checks: ["npm test"]}, {checks: []}, {checks: ["format", "format"]}, {paths: []}, {paths: ["docs/a.json", "docs/a.json"]}, {edits: []}, {expected_blobs: {"docs/a.json": null}}]) assert.throws(() => operationSpec({...validation, ...patch}));
  `);
});

it("validation identifies source SHA, reports failed formatting, and leaves bytes unchanged", () => {
  scenario(String.raw`
    await fixture(async ({dir, git, source, base, prepare}) => {
      const request = {...base, operation: "validate", paths: ["docs/a.json"], checks: ["format", "read-budget"]};
      const candidate = await prepare(request), evidence = candidate.operation_result;
      assert.deepEqual(candidate.files, []); assert.equal(evidence.tested_sha, source);
      assert.equal(evidence.request_commit, git("rev-parse", "HEAD"));
      assert.equal(evidence.required_ci, "not_replaced"); assert.equal(evidence.diff, "");
      assert.equal(evidence.checks.find(check => check.check === "format").state, "failure");
      assert.equal(evidence.checks.find(check => check.check === "read-budget").state, "not_applicable");
      assert.equal(await fs.readFile(path.join(dir, "docs/a.json"), "utf8"), '{"a":1}\n');
      const expected = {...candidate, ...operationSpec(request)};
      assert.deepEqual(validateCandidate(candidate, expected), []);
      for (const patch of [{tested_sha: candidate.request_commit}, {checks: []}, {required_ci: "passed"}, {diff: "unverified"}, {files: [{path: "docs/a.json", change: "modify", before_bytes: 8, after_bytes: 9}]}]) assert.throws(() => validateCandidate({...candidate, operation_result: {...evidence, ...patch}}, expected));
      assert.throws(() => validateCandidate({...candidate, files: [{path: "docs/a.json", content: "replacement"}]}, expected), /must not modify/);
    });
  `);
});

it("preview and apply produce the same normalized bytes while preview publishes none", () => {
  scenario(String.raw`
    let preview;
    for (const operation of ["preview", "apply"]) await fixture(async ({base, prepare}) => {
      const candidate = await prepare({...base, operation, edits: [{path: "docs/a.json", find: '"a":1', replace: '"a":2'}]});
      if (operation === "preview") {preview = candidate.operation_result; assert.deepEqual(candidate.files, []); assert.match(preview.diff, /a.json/); assert.match(preview.diff, /a.*2/);}
      else {assert.equal(candidate.files[0].content, '{ "a": 2 }\n'); assert.equal(identity(candidate.files).digest, preview.proposed_digest);}
    });
  `);
});

it("stale blobs, unsafe paths, symlinks, and invalid text fail before a candidate exists", () => {
  scenario(String.raw`
    for (const mode of ["stale", "symlink", "binary"]) await fixture(async ({dir, base, prepare}) => {
      if (mode === "symlink") {await fs.rm(path.join(dir, "docs/a.json")); await fs.symlink("../package.json", path.join(dir, "docs/a.json"));}
      if (mode === "binary") await fs.writeFile(path.join(dir, "docs/a.json"), Buffer.from([0xff]));
      await assert.rejects(prepare({...base, expected_blobs: {"docs/a.json": B}, operation: "validate", paths: ["docs/a.json"], checks: ["format"]}));
      await assert.rejects(fs.access(path.join(dir, "candidate.json")));
    });
    for (const file of ["../outside", "docs/../outside", ".github/workflows/evil.yml", "docs/a b.json", "-option"]) assert.throws(() => operationSpec({version: 1, expected_head: A, expected_blobs: {[file]: B}, message: "test(fixture): path", operation: "validate", paths: [file], checks: ["format"]}));
  `);
});

it("targeted read-budget evidence uses trusted source checks rather than a green placeholder", () => {
  scenario(String.raw`
    await fixture(async ({git, base, prepare}) => {
      const file = "packages/core/src/a.ts";
      const candidate = await prepare({...base, expected_blobs: {[file]: git("rev-parse", "HEAD:" + file)}, operation: "validate", paths: [file], checks: ["read-budget"]});
      assert.equal(candidate.operation_result.checks[0].state, "passed");
    });
    await fixture(async ({git, base, prepare}) => {
      const file = "packages/core/src/a.ts";
      const candidate = await prepare({...base, expected_blobs: {[file]: git("rev-parse", "HEAD:" + file)}, operation: "preview", edits: [{path: file, find: "export const a = 1;", replace: "export const a = 1;\n// " + "x".repeat(61000)}]});
      assert.equal(candidate.operation_result.checks.find(check => check.check === "read-budget").state, "failure");
      assert.deepEqual(candidate.files, []);
    });
  `);
});

it("retained preview chunks are bounded, redacted, deterministic, and attempt-specific", () => {
  scenario(String.raw`
    await fixture(async ({base, prepare}) => {
      const candidate = await prepare({...base, operation: "preview", edits: [{path: "docs/a.json", find: '"a":1', replace: '"a":"ghp_fixturecredential123"'}]});
      const writes = [], api = {persist: async files => writes.push(files)};
      await persistOperation(api, {id: 42, run_attempt: 1}, candidate.operation_result);
      await persistOperation(api, {id: 42, run_attempt: 1}, candidate.operation_result);
      assert.deepEqual(writes[0], writes[1]);
      assert.ok(!JSON.stringify(writes).includes("ghp_fixturecredential123"));
      const manifest = JSON.parse(writes[0]["receipts/ai-edit/42/1/operation.json"]);
      assert.equal(manifest.redacted, true); assert.ok(manifest.diff_paths.length > 0);
      for (const file of manifest.diff_paths) assert.ok(Buffer.byteLength(writes[0][file]) <= 24000);
      await persistOperation(api, {id: 42, run_attempt: 2}, candidate.operation_result);
      assert.ok(Object.keys(writes[2]).every(file => file.startsWith("receipts/ai-edit/42/2/")));
      await assert.rejects(persistOperation({persist: async () => {throw new Error("storage unavailable");}}, {id: 42, run_attempt: 1}, candidate.operation_result), /storage unavailable/);
    });
  `);
});

it("oversized formatted diffs are refused instead of silently presenting a prefix", () => {
  scenario(String.raw`
    await fixture(async ({dir, base, prepare}) => {
      const file = "docs/large.txt";
      await assert.rejects(prepare({...base, expected_blobs: {[file]: null}, operation: "preview", edits: [{path: file, create: "x".repeat(1000001)}]}), /diff.*(?:unavailable|oversized|limit)/i);
      await assert.rejects(fs.access(path.join(dir, "candidate.json")));
    });
  `);
});
