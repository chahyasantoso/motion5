import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));
function scenario(body: string) {
  const source = `
    import assert from "node:assert/strict";
    import { receipt } from "./scripts/automation-receipt.mjs";
    import { reportOutcome, verifyRun, collectDiagnostics } from "./scripts/automation-report.mjs";
    import { publishCandidate, validateCandidate } from "./scripts/automation-publish.mjs";
    const A = "a".repeat(40), B = "b".repeat(40), C = "c".repeat(40);
    const repository = "chahyasantoso/motion5";
    const facts = {kind: "ai-edit", repository, run_id: 42, run_attempt: 1, source_sha: A, request_commit: B, request_digest: "d".repeat(64), phase: "formatted"};
    const ci = receipt({kind: "ci", repository, run_id: 42, run_attempt: 1, head_sha: B, tested_sha: B, ci: "success"});
    const calls = [];
    const ports = {
      persist: async (value) => {calls.push(["persist", value]);},
      currentHead: async () => B,
      comments: async () => [],
      writeComment: async (id, body) => {calls.push(["comment", id, body]);},
      createCandidate: async () => C,
      saveIntent: async (value) => {calls.push(["intent", value]);},
      saveReceipt: async (value) => {calls.push(["receipt", value]);},
      advance: async (sha) => {calls.push(["advance", sha]);},
      contains: async () => false,
    };
    ${body}
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", source], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 1000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

describe("trusted automation adapters", () => {
  it("AE-65: concrete API client accepts compare syntax but refuses traversal", () => {
    scenario(String.raw`
      const {GitHub} = await import("./scripts/automation-report.mjs");
      const api = new GitHub(repository, "fixture-only");
      let url; globalThis.fetch = async (value) => {url = value; return new Response(JSON.stringify({status: "ahead"}));};
      assert.equal((await api.request("GET", "/compare/" + A + "..." + B)).status, "ahead");
      assert.equal(url, "https://api.github.com/repos/" + repository + "/compare/" + A + "..." + B);
      await assert.rejects(api.request("GET", "/../other"), /Unsafe/);
    `);
  });
  it("AE-66: real candidate preparation ignores branch executable configuration", () => {
    scenario(String.raw`
      const {prepareCandidate} = await import("./scripts/automation-publish.mjs");
      const fs = await import("node:fs/promises"), os = await import("node:os"), path = await import("node:path"), cp = await import("node:child_process");
      const dir = await fs.mkdtemp(path.join(os.tmpdir(), "motion5-trust-test-"));
      try {
        for (const child of [".ai/edits", "docs", "scripts"]) await fs.mkdir(path.join(dir, child), {recursive: true});
        await fs.writeFile(path.join(dir, "docs/.keep"), "keep");
        await fs.writeFile(path.join(dir, "scripts/apply-ai-edit.mjs"), "throw new Error('candidate code executed')");
        await fs.writeFile(path.join(dir, ".prettierrc.cjs"), "throw new Error('candidate config executed')");
        const git = (...args) => cp.execFileSync("git", args, {cwd: dir, encoding: "utf8"}).trim();
        git("init", "-q"); git("config", "user.name", "fixture"); git("config", "user.email", "fixture@example.invalid"); git("add", "."); git("commit", "-qm", "source");
        const source = git("rev-parse", "HEAD");
        const request = {version: 1, expected_head: source, expected_blobs: {"docs/a.json": null}, message: "test(fixture): add JSON", edits: [{path: "docs/a.json", create: '{"hello":1}'}]};
        await fs.writeFile(path.join(dir, ".ai/edits/test.json"), JSON.stringify(request)); git("add", "."); git("commit", "-qm", "request");
        const requestCommit = git("rev-parse", "HEAD"), output = path.join(dir, "candidate.json");
        await prepareCandidate(dir, A, process.cwd(), output);
        const bundle = JSON.parse(await fs.readFile(output, "utf8"));
        assert.equal(bundle.request_commit, requestCommit); assert.equal(bundle.source_sha, source);
        assert.deepEqual(JSON.parse(bundle.files[0].content), {hello: 1});
        assert.equal(bundle.files[0].content, '{\n  "hello": 1\n}\n'.replaceAll('\n', '
'));
        assert.equal(git("rev-parse", "HEAD"), requestCommit);
        // Reset the disposable application output, then submit a request whose actual formatter fails.
        await fs.rm(path.join(dir, "docs/a.json")); await fs.rm(output);
        request.edits[0].create = "{"; request.expected_head = requestCommit;
        await fs.writeFile(path.join(dir, ".ai/edits/test.json"), JSON.stringify(request)); git("add", ".ai/edits/test.json"); git("commit", "-qm", "malformed JSON request");
        const failedHead = git("rev-parse", "HEAD");
        await assert.rejects(prepareCandidate(dir, A, process.cwd(), output));
        await assert.rejects(fs.access(output)); assert.equal(git("rev-parse", "HEAD"), failedHead);
      } finally {await fs.rm(dir, {recursive: true, force: true});}
    `);
  });
  it("AE-67: concrete evidence storage is idempotent and refuses history replacement", () => {
    scenario(String.raw`
      const {GitHub, blobSha} = await import("./scripts/automation-report.mjs");
      const api = new GitHub(repository, "fixture-only"), file = "receipts/ci/42/1/receipt.json";
      api.head = async () => A;
      api.request = async (method, path) => {
        assert.equal(method, "GET");
        if (path.startsWith("/git/commits/")) return {tree: {sha: B}};
        return {truncated: false, tree: [{path: file, type: "blob", sha: blobSha(Buffer.from("same"))}]};
      };
      await api.persist({[file]: "same"});
      await assert.rejects(api.persist({[file]: "different"}), /historical/);
      await assert.rejects(api.persist({"../../escape": "same"}), /destination/);
    `);
  });
  it("AE-68: early adapter failure has durable fallback without a parsed request", () => {
    scenario(String.raw`
      const {recoverRun} = await import("./scripts/automation-publish.mjs");
      const saved = [];
      const api = {repository, head: async () => A, content: async () => {const error = new Error("missing"); error.status = 404; throw error;}, persist: async (files) => saved.push(files)};
      const result = await recoverRun(api, {id: 42, run_attempt: 1, head_sha: B});
      assert.equal(result.publication, "not_attempted");
      const manifest = JSON.parse(saved[0]["receipts/ai-edit/42/1/manifest.json"]);
      assert.equal(manifest.outcome.request_commit, B); assert.equal(manifest.outcome.publication, "not_attempted");
    `);
  });
  it("AE-69: recovery retains ambiguous intent without claiming or replaying publication", () => {
    scenario(String.raw`
      const {recoverRun} = await import("./scripts/automation-publish.mjs");
      const intent = receipt({...facts, phase: "publication", candidate_sha: C});
      const api = {repository, head: async () => A, content: async (path) => {if (path.endsWith("intent.json")) return {text: JSON.stringify(intent)}; const error = new Error("missing"); error.status = 404; throw error;}};
      const result = await recoverRun(api, {id: 42, run_attempt: 1, head_sha: B});
      assert.equal(result.publication, "unconfirmed"); assert.equal(result.evidence, "receipts/ai-edit/42/1/intent.json");
    `);
  });
  it("AE-51: durable evidence precedes a failed comment and retry does not replay edits", () => {
    scenario(`
      ports.writeComment = async () => {calls.push(["comment"]); throw new Error("comment unavailable");};
      await assert.rejects(reportOutcome(ci, ports), /comment unavailable/);
      assert.deepEqual(calls.map(x => x[0]), ["persist", "comment"]);
      calls.length = 0; ports.writeComment = async () => calls.push(["comment"]);
      await reportOutcome(ci, ports);
      assert.deepEqual(calls.map(x => x[0]), ["persist", "comment"]);
    `);
  });
  it("AE-52: stale completion retains evidence without replacing a current summary", () => {
    scenario(`
      ports.currentHead = async () => A;
      assert.equal((await reportOutcome(ci, ports)).comment, "stale");
      assert.deepEqual(calls.map(x => x[0]), ["persist"]);
    `);
  });
  it("AE-53: only the verified bot-owned marker can be updated", () => {
    scenario(`
      const first = await reportOutcome(ci, ports);
      const body = calls.find(x => x[0] === "comment")[2];
      calls.length = 0;
      ports.comments = async () => [{id: 8, body, user: {id: 1, type: "User"}}, {id: 9, body, user: {id: 41898282, type: "Bot"}}];
      await reportOutcome(ci, ports);
      assert.equal(calls.find(x => x[0] === "comment")[1], 9);
      assert.equal(first.comment, "published");
    `);
  });
  it("AE-54: reruns cannot be overwritten by an older attempt", () => {
    scenario(`
      await reportOutcome({...ci, run_attempt: 2, evidence_path: "receipts/ci/42/2/receipt.json"}, ports);
      const body = calls.find(x => x[0] === "comment")[2]; calls.length = 0;
      ports.comments = async () => [{id: 9, body, user: {id: 41898282, type: "Bot"}}];
      assert.equal((await reportOutcome(ci, ports)).comment, "stale");
      assert.deepEqual(calls.map(x => x[0]), ["persist"]);
    `);
  });
  it("AE-55: failed or partial candidate preparation never reaches publication", () => {
    scenario(`
      for (const failure of ["formatter failure", "partial application"]) {
        ports.createCandidate = async () => {throw new Error(failure);};
        await assert.rejects(publishCandidate(facts, ports), new RegExp(failure));
        assert.deepEqual(calls, []);
      }
    `);
  });
  it("AE-56: publication intent is durable before the conditional ref update", () => {
    scenario(`
      let head = B; ports.currentHead = async () => head;
      ports.advance = async (sha) => {calls.push(["advance", sha]); head = sha;};
      const result = await publishCandidate(facts, ports);
      assert.deepEqual(calls.map(x => x[0]), ["intent", "advance", "receipt"]);
      assert.equal(result.published_sha, C); assert.equal(result.ci, "pending");
    `);
  });
  it("AE-57: rejected publication stays unconfirmed without a blind retry", () => {
    scenario(`
      ports.advance = async () => {calls.push(["advance"]); throw new Error("rejected");};
      const result = await publishCandidate(facts, ports);
      assert.equal(result.publication, "unconfirmed");
      assert.equal(result.next_action, "reconcile_before_retry");
      assert.equal(calls.filter(x => x[0] === "advance").length, 1);
    `);
  });
  it("AE-58: a lost push response is reconciled against the remote commit", () => {
    scenario(`
      let head = B; ports.currentHead = async () => head;
      ports.advance = async () => {head = C; throw new Error("lost response");};
      const result = await publishCandidate(facts, ports);
      assert.equal(result.publication, "confirmed");
      assert.equal(result.published_sha, C);
    `);
  });
  it("AE-59: retry after publication and report failure never republishes", () => {
    scenario(`
      ports.currentHead = async () => C;
      const result = await publishCandidate(facts, ports);
      assert.equal(result.publication, "confirmed");
      assert.equal(calls.filter(x => x[0] === "advance").length, 0);
    `);
  });
  it("AE-60: stale branches are refused without force or semantic rebase", () => {
    scenario(`
      ports.currentHead = async () => A;
      await assert.rejects(publishCandidate(facts, ports), /advanced/);
      assert.equal(calls.filter(x => x[0] === "advance").length, 0);
    `);
  });
  it("AE-61: run identity comes from verified repository and workflow metadata", () => {
    scenario(`
      const run = {id: 42, run_attempt: 1, head_sha: B, head_branch: "chore/test", event: "push", path: ".github/workflows/ci.yml", status: "completed", conclusion: "failure", repository: {full_name: repository}, head_repository: {full_name: repository}};
      assert.equal(verifyRun(run, repository, 42, 1).head_sha, B);
      for (const extra of [{id: 43}, {run_attempt: 2}, {path: ".github/workflows/evil.yml"}, {repository: {full_name: "other/repo"}}, {head_repository: {full_name: "fork/repo"}}])
        assert.throws(() => verifyRun({...run, ...extra}, repository, 42, 1));
    `);
  });
  it("AE-62: log retries distinguish unavailable diagnostics from retained output", () => {
    scenario(`
      let attempts = 0;
      const missing = await collectDiagnostics(async () => {attempts++; throw new Error("403");});
      assert.equal(attempts, 3); assert.equal(missing.state, "unavailable");
      assert.deepEqual(missing.chunks, []);
      const large = await collectDiagnostics(async () => "x".repeat(1100000));
      assert.equal(large.truncated, true); assert.equal(large.retained_bytes, 1000000);
    `);
  });
  it("AE-63: the publisher independently bounds candidate identities and paths", () => {
    scenario(String.raw`
      const expected = {trusted_sha: A, request_commit: B, source_sha: A, request_digest: "d".repeat(64), request_path: ".ai/edits/test.json", paths: ["docs/a.md"], dry_run: false};
      const candidate = {version: 1, trusted_sha: A, request_commit: B, source_sha: A, request_digest: "d".repeat(64), files: [{path: "docs/a.md", content: "hello\n"}]};
      assert.equal(validateCandidate(candidate, expected).length, 1);
      for (const patch of [{trusted_sha: C}, {request_commit: C}, {extra: true}, {files: [{path: ".github/workflows/evil.yml", content: "x"}]}, {files: [{path: "docs/../a.md", content: "x"}]}, {files: [{path: "docs/a.md", content: "x".repeat(1500001)}]}])
        assert.throws(() => validateCandidate({...candidate, ...patch}, expected));
    `);
  });
  it("AE-64: a persistence failure prevents both comment and publication", () => {
    scenario(`
      ports.persist = async () => {throw new Error("archive failure");};
      await assert.rejects(reportOutcome(ci, ports), /archive failure/);
      assert.deepEqual(calls, []);
      ports.saveIntent = async () => {throw new Error("archive failure");};
      await assert.rejects(publishCandidate(facts, ports), /archive failure/);
      assert.deepEqual(calls, []);
    `);
  });
});
