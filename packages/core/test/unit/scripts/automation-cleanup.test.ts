import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
function scenario(operation: string, body: string) {
  const source = String.raw`
    import assert from "node:assert/strict";
    import { identity, receipt } from "./scripts/automation-receipt.mjs";
    import { reportToPull, verifyRun } from "./scripts/automation-report.mjs";
    import { publishRun, recoverRun } from "./scripts/automation-publish.mjs";
    const A = "a".repeat(40), B = "b".repeat(40), C = "c".repeat(40), D = "d".repeat(40);
    const repository = "chahyasantoso/motion5", requestPath = ".ai/edits/test.json";
    const operation = ${JSON.stringify(operation)};
    const request = {version: 1, operation, expected_head: A, expected_blobs: {"docs/a.md": D}, message: "test(fixture): operation", ...(operation === "preview" ? {edits: [{path: "docs/a.md", find: "before", replace: "after"}]} : {paths: ["docs/a.md"], checks: ["format"]})};
    const digest = identity(request).digest;
    const confirmed = receipt({kind: "ai-edit", repository, run_id: 42, run_attempt: 1, source_sha: A, request_commit: B, request_digest: digest, phase: "publication", candidate_sha: C, published_sha: C});
    const original = {id: 42, run_attempt: 1, workflow_id: 7, head_sha: B, head_branch: "fix/example", event: "push", path: ".github/workflows/ai-edit.yml", status: "completed", conclusion: "success", repository: {full_name: repository}, head_repository: {full_name: repository}};
    const run = {...original, id: 43, head_sha: C, conclusion: "skipped"};
    const leaf = {path: "docs/a.md", type: "blob", mode: "100644", sha: D};
    const pending = {path: requestPath, type: "blob", mode: "100644", sha: B};
    const trees = {source: {truncated: false, tree: [leaf]}, request: {truncated: false, tree: [leaf, pending]}, cleanup: {truncated: false, tree: [leaf]}};
    const commits = {[A]: {parents: [], tree: {sha: "source"}}, [B]: {parents: [{sha: A}], tree: {sha: "request"}}, [C]: {parents: [{sha: B}], tree: {sha: "cleanup"}, message: "arbitrary subject, not classification evidence"}};
    const jobs = [{name: "prepare isolated candidate", run_id: 43, head_sha: C, status: "completed", conclusion: "skipped"}];
    const writes = [], comments = [], saved = new Map();
    let workflowMismatch = false, missingOriginal = false, currentHead = C;
    const missing = () => {const error = new Error("missing"); error.status = 404; throw error;};
    const api = {
      repository,
      head: async (branch) => branch === "ci-logs" ? A : currentHead,
      run: async (id, attempt) => verifyRun({...original, id, run_attempt: attempt}, repository, id, attempt),
      content: async (path, sha) => {
        if (path === run.path) return {sha: workflowMismatch && sha === C ? C : D};
        if (path === requestPath) {assert.equal(sha, B); return {text: JSON.stringify(request)};}
        if (path === confirmed.evidence_path && !missingOriginal) return {text: JSON.stringify(confirmed)};
        if (saved.has(path)) return {text: saved.get(path)};
        return missing();
      },
      list: async (path, key) => {
        if (path.startsWith("/actions/workflows/7/runs?")) {assert.ok(path.includes("head_sha=" + B)); assert.equal(key, "workflow_runs"); return [original];}
        if (path === "/actions/runs/43/attempts/1/jobs") {assert.equal(key, "jobs"); return jobs;}
        if (path.startsWith("/commits/") && path.endsWith("/pulls")) return [{number: 9, state: "open", base: {repo: {full_name: repository}}, head: {repo: {full_name: repository}, ref: run.head_branch, sha: currentHead}}];
        if (path === "/issues/9/comments") return comments;
        assert.fail("unexpected list: " + path);
      },
      request: async (method, path, data) => {
        if (method === "GET" && path.startsWith("/git/commits/")) return commits[path.slice(13)];
        if (method === "GET" && path.startsWith("/git/trees/")) return trees[path.slice(11).split("?")[0]];
        if (method === "GET" && path === "/pulls/9") return {state: "open", head: {repo: {full_name: repository}, ref: run.head_branch, sha: currentHead}};
        if (method === "POST" && path === "/issues/9/comments") {comments.push({id: 8, user: {id: 41898282, type: "Bot"}, body: data.body}); return;}
        if (method === "PATCH" && path === "/issues/comments/8") {comments[0].body = data.body; return;}
        assert.fail("unexpected API write/read: " + method + " " + path);
      },
      persist: async (files) => {writes.push(files); for (const [path, text] of Object.entries(files)) {assert.ok(!saved.has(path) || saved.get(path) === text, "immutable evidence"); saved.set(path, text);}},
    };
    const writer = {request: async () => assert.fail("cleanup must never publish a candidate")};
    await reportToPull(api, original, confirmed);
    const before = comments[0].body;
    assert.ok(before.includes("**confirmed**") && before.includes("receipts/ai-edit/42/1/"));
    writes.length = 0;
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", source + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 1000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

describe("verified cleanup lifecycle reporting", () => {
  it.each(["preview", "validate"])(
    "preserves a confirmed %s projection across skipped cleanup and recovery",
    (operation) => {
      scenario(
        operation,
        String.raw`
      const result = await publishRun(api, writer, run, A);
      assert.equal(comments[0].body, before, "cleanup replaced the confirmed operation summary");
      assert.equal(result.comment, "cleanup_only");
      const manifest = JSON.parse(saved.get("receipts/ai-edit/43/1/manifest.json"));
      assert.equal(manifest.classification, "cleanup_only");
      assert.equal(manifest.outcome.publication, "not_attempted");
      assert.equal(manifest.outcome.ci, "not_run");
      assert.equal(manifest.operation_receipt, confirmed.evidence_path);
      assert.equal(manifest.operation, operation);
      await recoverRun(api, run, A);
      assert.equal(comments[0].body, before);
      assert.equal(comments.length, 1);
    `,
      );
    },
  );
  it("keeps genuine failed runs actionable even on a cleanup-shaped tree", () => {
    scenario(
      "preview",
      String.raw`
      run.conclusion = "failure";
      await publishRun(api, writer, run, A);
      assert.notEqual(comments[0].body, before);
      assert.ok(comments[0].body.includes("inspect_evidence") && comments[0].body.includes("receipts/ai-edit/43/1/"));
    `,
    );
  });
  it.each([
    ["adjacent content change", "trees.cleanup.tree = [{...leaf, sha: A}];"],
    ["mode change", 'trees.cleanup.tree = [{...leaf, mode: "100755"}];'],
    ["truncated tree", "trees.cleanup.truncated = true;"],
    ["unreviewed workflow", "workflowMismatch = true;"],
    [
      "missing publication evidence",
      "missingOriginal = true; saved.delete(confirmed.evidence_path);",
    ],
    ["wrong publication head", "confirmed.published_sha = A;"],
    ["wrong request identity", 'request.message = "changed";'],
    ["non-skipped job", 'jobs[0].conclusion = "failure";'],
    ["manual dispatch", 'run.event = "workflow_dispatch";'],
    ["multiple parents", "commits[C].parents.push({sha: A});"],
  ])("does not suppress reporting for %s", (_name, mutation) => {
    scenario(
      "preview",
      mutation +
        String.raw`
      await publishRun(api, writer, run, A);
      assert.notEqual(comments[0].body, before);
      assert.ok(!saved.has("receipts/ai-edit/43/1/manifest.json"));
    `,
    );
  });
  it("does not swallow cleanup evidence persistence failures", () => {
    scenario(
      "validate",
      String.raw`
      api.persist = async () => {throw new Error("archive unavailable");};
      await assert.rejects(publishRun(api, writer, run, A), /archive unavailable/);
      assert.equal(comments[0].body, before);
    `,
    );
  });
});
