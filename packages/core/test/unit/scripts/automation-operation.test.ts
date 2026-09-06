import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
it("dry-run preparation reports the formatted transformation without publishing target files", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      String.raw`
    import assert from "node:assert/strict";
    import {prepareCandidate} from "./scripts/automation-publish.mjs";
    import * as fs from "node:fs/promises";
    import os from "node:os";
    import path from "node:path";
    import {execFileSync} from "node:child_process";
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "motion5-preview-test-"));
    try {
      await fs.mkdir(path.join(dir, ".ai/edits"), {recursive: true});
      await fs.mkdir(path.join(dir, "docs"));
      await fs.writeFile(path.join(dir, "docs/old.json"), '{"old":1}\n');
      await fs.writeFile(path.join(dir, ".prettierrc.cjs"), "throw new Error('candidate config executed')");
      const git = (...args) => execFileSync("git", args, {cwd: dir, encoding: "utf8"}).trim();
      git("init", "-q"); git("config", "user.name", "fixture"); git("config", "user.email", "fixture@example.invalid");
      git("add", "."); git("commit", "-qm", "source");
      const source = git("rev-parse", "HEAD");
      const request = {version: 1, expected_head: source, expected_blobs: {"docs/new.json": null, "docs/old.json": git("rev-parse", "HEAD:docs/old.json")}, message: "test(fixture): preview", dry_run: true, edits: [{path: "docs/new.json", create: '{"hello":1}'}, {path: "docs/old.json", delete: true}]};
      await fs.writeFile(path.join(dir, ".ai/edits/test.json"), JSON.stringify(request));
      git("add", "."); git("commit", "-qm", "request");
      const head = git("rev-parse", "HEAD"), output = path.join(dir, "candidate.json");
      await prepareCandidate(dir, "a".repeat(40), process.cwd(), output);
      const candidate = JSON.parse(await fs.readFile(output, "utf8"));
      assert.deepEqual(candidate.files, [], "preview must not publish target files");
      assert.ok(candidate.operation_result, "formatted preview evidence is required");
      const evidence = candidate.operation_result;
      assert.equal(evidence.operation, "preview");
      assert.equal(evidence.source_sha, source);
      assert.equal(evidence.request_commit, head);
      assert.equal(evidence.required_ci, "not_replaced");
      assert.match(evidence.diff, /hello/);
      assert.match(evidence.diff, /old/);
      const created = evidence.files.find(file => file.path === "docs/new.json");
      assert.equal(created.change, "create");
      assert.equal(created.after_bytes, Buffer.byteLength('{ "hello": 1 }\n'));
      assert.equal(evidence.files.find(file => file.path === "docs/old.json").change, "delete");
      assert.equal(git("rev-parse", "HEAD"), head);
      assert.equal(git("show", "HEAD:docs/old.json"), '{"old":1}');
      assert.equal(git("ls-tree", "HEAD", "docs/new.json"), "");
    } finally {await fs.rm(dir, {recursive: true, force: true});}
  `,
    ],
    { cwd: root, encoding: "utf8", timeout: 20000, maxBuffer: 1000000 },
  );
  expect(result.status, result.stderr).toBe(0);
});

it("an explicit null operation is refused rather than defaulted to apply", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      String.raw`
    import assert from "node:assert/strict";
    import {operationSpec} from "./scripts/automation-operation.mjs";
    const request = {version: 1, expected_head: "a".repeat(40), expected_blobs: {"docs/new.md": null}, message: "docs(fixture): add", edits: [{path: "docs/new.md", create: "hello"}]};
    assert.equal(operationSpec(request).operation, "apply");
    for (const operation of [null, false, 0, "", {}, []]) assert.throws(() => operationSpec({...request, operation}), /Unsupported operation/);
  `,
    ],
    { cwd: root, encoding: "utf8", timeout: 10000 },
  );
  expect(result.status, result.stderr).toBe(0);
});
