import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

function scenario(body: string) {
  const source = String.raw`
    import assert from "node:assert/strict";
    import { identity, receipt } from "./scripts/automation-receipt.mjs";
    import { recoverRun } from "./scripts/automation-publish.mjs";
    const A = "a".repeat(40), B = "b".repeat(40), C = "c".repeat(40);
    const repository = "chahyasantoso/motion5";
    const request = {version: 1, expected_head: A, edits: [{path: "docs/a.md", create: "hello"}]};
    const digest = identity(request).digest;
    const intent = receipt({kind: "ai-edit", repository, run_id: 42, run_attempt: 1, source_sha: A, request_commit: B, request_digest: digest, phase: "publication", candidate_sha: C});
    const run = {id: 42, run_attempt: 1, head_sha: B, head_branch: "chore/example"};
    const writes = [];
    const candidate = {parents: [{sha: B}], message: "test(fixture): candidate\n\nAI-Edit-Request: .ai/edits/test.json\nAI-Edit-Digest: " + digest};
    const missing = () => {const error = new Error("missing"); error.status = 404; throw error;};
    const api = {
      repository,
      head: async (branch) => branch === "ci-logs" ? A : C,
      content: async (path, sha) => {
        if (path.endsWith("/receipt.json")) return missing();
        if (path.endsWith("/intent.json")) {assert.equal(sha, A); return {text: JSON.stringify(intent)};}
        assert.equal(path, ".ai/edits/test.json"); assert.equal(sha, B);
        return {text: JSON.stringify(request)};
      },
      request: async (method, path) => {
        assert.equal(method, "GET", "recovery must not update a development ref");
        if (path === "/git/commits/" + C) return candidate;
        if (path === "/git/commits/" + B) return {parents: [{sha: A}]};
        assert.fail("unexpected API path: " + path);
      },
      list: async (path) => {
        assert.equal(path, "/commits/" + B + "/pulls", "recovery must not need artifacts");
        return [];
      },
      persist: async (files) => writes.push(files),
    };
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", source + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 1000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

describe("artifact-independent publication recovery", () => {
  it("AE-72: a landed candidate is confirmed without an artifact or another ref update", () => {
    scenario(String.raw`
      const result = await recoverRun(api, run);
      assert.equal(result.publication, "confirmed");
      assert.equal(writes.length, 1);
      const saved = JSON.parse(writes[0]["receipts/ai-edit/42/1/receipt.json"]);
      assert.equal(saved.published_sha, C);
      assert.equal(saved.request_commit, B);
      assert.equal(saved.ci, "pending");
    `);
  });

  it("AE-73: a candidate absent from the target branch remains unconfirmed", () => {
    scenario(String.raw`
      api.head = async (branch) => branch === "ci-logs" ? A : B;
      api.request = async (method, path) => {
        assert.equal(method, "GET");
        assert.equal(path, "/compare/" + C + "..." + B);
        return {status: "behind"};
      };
      const result = await recoverRun(api, run);
      assert.equal(result.publication, "unconfirmed");
      assert.deepEqual(writes, []);
    `);
  });

  it("AE-74: a recorded candidate with the wrong parent cannot be promoted", () => {
    scenario(String.raw`
      candidate.parents = [{sha: A}];
      await assert.rejects(recoverRun(api, run), /candidate parent mismatch/);
      assert.deepEqual(writes, []);
    `);
  });

  it("AE-75: request bytes must match the retained canonical digest", () => {
    scenario(String.raw`
      request.edits[0].create = "different content";
      await assert.rejects(recoverRun(api, run), /request identity mismatch/);
      assert.deepEqual(writes, []);
    `);
  });
});
