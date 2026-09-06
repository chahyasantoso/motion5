#!/usr/bin/env node
// Publication owns the transition from a bounded candidate to a confirmed remote commit.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, readdir, lstat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { identity, receipt, render } from "./automation-receipt.mjs";
import {
  operationSpec,
  safeRequestPath as safePath,
  prepareOperation,
  validateOperationResult,
  persistOperation,
} from "./automation-operation.mjs";
import {
  GitHub,
  SHA,
  ensure,
  boundedBody,
  verifyRun,
  persistOutcome,
  reportToPull,
} from "./automation-report.mjs";

function exactKeys(value, allowed) {
  ensure(value && typeof value === "object" && !Array.isArray(value), "Expected object");
  ensure(
    Object.keys(value).every((key) => allowed.includes(key)),
    "Unknown field",
  );
}
export function validateCandidate(candidate, expected) {
  exactKeys(candidate, [
    "version",
    "trusted_sha",
    "request_commit",
    "source_sha",
    "request_digest",
    "files",
    "operation_result",
  ]);
  ensure(candidate.version === 1, "Unsupported candidate version");
  for (const key of ["trusted_sha", "request_commit", "source_sha", "request_digest"])
    ensure(candidate[key] === expected[key], `Candidate ${key} mismatch`);
  ensure(Array.isArray(candidate.files) && candidate.files.length <= 50, "Invalid candidate files");
  ensure(Buffer.byteLength(JSON.stringify(candidate)) <= 1800000, "Candidate exceeds byte limit");
  const seen = new Set();
  for (const file of candidate.files) {
    exactKeys(file, ["path", "content"]);
    safePath(file.path);
    ensure(
      expected.paths.includes(file.path) && !seen.has(file.path),
      "Unexpected or duplicate candidate path",
    );
    seen.add(file.path);
    ensure(
      file.content === null || typeof file.content === "string",
      "Candidate content must be text or deletion",
    );
    ensure(
      file.content === null || Buffer.byteLength(file.content) <= 1500000,
      "Candidate file exceeds byte limit",
    );
  }
  const readOnly = expected.dry_run || ["preview", "validate"].includes(expected.operation);
  ensure(
    !readOnly || candidate.files.length === 0,
    "Read-only operation must not modify target files",
  );
  validateOperationResult(candidate.operation_result, expected);
  return candidate.files;
}

export async function publishCandidate(facts, ports) {
  render(receipt(facts));
  const candidate = await ports.createCandidate();
  ensure(SHA.test(candidate), "Invalid candidate commit");
  const intent = receipt({ ...facts, phase: "publication", candidate_sha: candidate });
  const head = await ports.currentHead();
  if (head === candidate || (await ports.contains(candidate, head))) {
    const result = receipt({
      ...facts,
      phase: "publication",
      candidate_sha: candidate,
      published_sha: candidate,
    });
    await ports.saveReceipt(result);
    return result;
  }
  ensure(head === facts.request_commit, "Branch advanced; publication refused");
  await ports.saveIntent(intent);
  try {
    await ports.advance(candidate);
  } catch {
    // A lost response is not evidence of a rejected push. Reconcile, never replay.
  }
  let confirmed = false;
  try {
    const remote = await ports.currentHead();
    confirmed = remote === candidate || (await ports.contains(candidate, remote));
  } catch {
    // Keep the candidate and its durable intent discoverable when remote state is unknown.
  }
  const result = confirmed
    ? receipt({
        ...facts,
        phase: "publication",
        candidate_sha: candidate,
        published_sha: candidate,
      })
    : intent;
  await ports.saveReceipt(result);
  return result;
}

async function regular(file) {
  const stat = await lstat(file);
  ensure(stat.isFile() && !stat.isSymbolicLink(), "Expected regular file");
  ensure(stat.size <= 1800000, "File exceeds byte limit");
  return readFile(file, "utf8");
}
export async function prepareCandidate(root, trustedSha, formatterRoot, output) {
  ensure(SHA.test(trustedSha), "A reviewed immutable runner SHA is required");
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 2000000,
      timeout: 10000,
    }).trim();
  for (const directory of [".ai", ".ai/edits"]) {
    const stat = await lstat(path.join(root, directory));
    ensure(stat.isDirectory() && !stat.isSymbolicLink(), "Unsafe request directory");
  }
  const requests = (await readdir(path.join(root, ".ai/edits"))).filter((name) =>
    name.endsWith(".json"),
  );
  ensure(
    requests.length === 1 && /^[A-Za-z0-9][A-Za-z0-9._-]*\.json$/.test(requests[0]),
    "Expected one bounded request",
  );
  const requestPath = `.ai/edits/${requests[0]}`;
  ensure(
    !process.env.DISPATCH_REQUEST || process.env.DISPATCH_REQUEST === requestPath,
    "Dispatch must name the sole pending request",
  );
  const parents = git("rev-list", "--parents", "-n", "1", "HEAD").split(" ");
  ensure(
    parents.length === 2 && parents.every((sha) => SHA.test(sha)),
    "Request commit needs one parent",
  );
  const [requestCommit, source] = parents;
  ensure(
    git("diff", "--no-renames", "--name-only", source, requestCommit) === requestPath,
    "Request-only commit required",
  );
  const request = JSON.parse(await regular(path.join(root, requestPath)));
  const spec = operationSpec(request);
  const candidate = await prepareOperation(
    root,
    trustedSha,
    formatterRoot,
    requestPath,
    requestCommit,
    source,
    request,
  );
  validateCandidate(candidate, { ...candidate, ...spec });
  await writeFile(output, `${JSON.stringify(candidate)}\n`);
}

async function readCandidate(api, run) {
  const artifacts = await api.list(`/actions/runs/${run.id}/artifacts`, "artifacts");
  const matches = artifacts.filter(
    (artifact) =>
      artifact.name === `ai-edit-candidate-${run.id}-${run.run_attempt}` && !artifact.expired,
  );
  ensure(matches.length === 1, "Candidate artifact is absent or ambiguous");
  const artifact = matches[0];
  ensure(
    Number.isSafeInteger(artifact.id) &&
      artifact.size_in_bytes <= 2000000 &&
      artifact.workflow_run?.head_sha === run.head_sha,
    "Artifact identity or size mismatch",
  );
  const response = await fetch(
    `https://api.github.com/repos/${api.repository}/actions/artifacts/${artifact.id}/zip`,
    {
      headers: { Authorization: `Bearer ${api.token}` },
      redirect: "manual",
      signal: AbortSignal.timeout(30000),
    },
  );
  ensure(response.status === 302, "Artifact download unavailable");
  const location = new URL(response.headers.get("location"));
  ensure(
    location.protocol === "https:" && !location.username && !location.password,
    "Unsafe artifact redirect",
  );
  // Never forward the GitHub credential to blob storage.
  const download = await fetch(location, { redirect: "error", signal: AbortSignal.timeout(30000) });
  ensure(download.ok, "Artifact download failed");
  const bytes = await boundedBody(download, 2000000);
  const scratch = await mkdtemp(path.join(tmpdir(), "motion5-artifact-"));
  try {
    const zip = path.join(scratch, "candidate.zip");
    await writeFile(zip, bytes);
    const result = spawnSync("unzip", ["-p", zip, "candidate.json"], {
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 1800000,
      env: { PATH: process.env.PATH },
    });
    ensure(result.status === 0 && !result.error, "Candidate archive is unreadable or oversized");
    return JSON.parse(result.stdout);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

async function snapshot(api, run, trustedSha) {
  ensure(
    SHA.test(trustedSha) && run.path === ".github/workflows/ai-edit.yml",
    "Untrusted publication workflow",
  );
  ensure(
    ["push", "workflow_dispatch"].includes(run.event) &&
      run.head_branch !== "main" &&
      run.head_branch !== "ci-logs",
    "Unsupported publication target",
  );
  const [actual, trusted] = await Promise.all([
    api.content(run.path, run.head_sha),
    api.content(run.path, trustedSha),
  ]);
  ensure(actual.sha === trusted.sha, "Candidate workflow differs from reviewed runner");
  const commit = await api.request("GET", `/git/commits/${run.head_sha}`);
  ensure(commit.parents.length === 1, "Request commit needs one parent");
  const source = commit.parents[0].sha;
  const sourceCommit = await api.request("GET", `/git/commits/${source}`);
  const [before, after] = await Promise.all([
    api.request("GET", `/git/trees/${sourceCommit.tree.sha}?recursive=1`),
    api.request("GET", `/git/trees/${commit.tree.sha}?recursive=1`),
  ]);
  ensure(!before.truncated && !after.truncated, "Snapshot tree is incomplete");
  const original = new Map(
    before.tree.filter((entry) => entry.type !== "tree").map((entry) => [entry.path, entry]),
  );
  const current = new Map(
    after.tree.filter((entry) => entry.type !== "tree").map((entry) => [entry.path, entry]),
  );
  const changed = [...new Set([...original.keys(), ...current.keys()])].filter(
    (file) =>
      original.get(file)?.sha !== current.get(file)?.sha ||
      original.get(file)?.mode !== current.get(file)?.mode,
  );
  ensure(
    changed.length === 1 &&
      /^\.ai\/edits\/[A-Za-z0-9][A-Za-z0-9._-]*\.json$/.test(changed[0]) &&
      current.get(changed[0])?.mode === "100644",
    "Request-only regular-file snapshot required",
  );
  const requestPath = changed[0];
  ensure(
    [...current.keys()].filter((file) => /^\.ai\/edits\/.*\.json$/.test(file)).length === 1,
    "Multiple pending requests",
  );
  const request = JSON.parse((await api.content(requestPath, run.head_sha)).text);
  const spec = operationSpec(request);
  ensure(request.expected_head === source, "Invalid source request");
  const paths = spec.paths;
  ensure(
    request.expected_blobs && Object.keys(request.expected_blobs).length === paths.length,
    "Invalid blob preconditions",
  );
  for (const file of paths) {
    safePath(file);
    const entry = original.get(file);
    ensure(
      !entry || (entry.type === "blob" && ["100644", "100755"].includes(entry.mode)),
      "Non-regular source file",
    );
    for (let parent = path.posix.dirname(file); parent !== "."; parent = path.posix.dirname(parent))
      ensure(!original.has(parent), "Non-directory source ancestor");
    ensure(
      Object.hasOwn(request.expected_blobs, file) &&
        request.expected_blobs[file] === (entry?.sha ?? null),
      "Source blob mismatch",
    );
  }
  return {
    trusted_sha: trustedSha,
    request_commit: run.head_sha,
    source_sha: source,
    request_digest: identity(request).digest,
    request_path: requestPath,
    paths,
    dry_run: spec.operation === "preview",
    operation: spec.operation,
    checks: spec.checks,
    request,
    commit,
    original,
  };
}

async function reconcileRecordedIntent(api, run, saved) {
  if (!saved.candidate_sha || !run.head_branch) return null;
  const head = await api.head(run.head_branch);
  if (head !== saved.candidate_sha) {
    const comparison = await api.request("GET", `/compare/${saved.candidate_sha}...${head}`);
    if (!["ahead", "identical"].includes(comparison.status)) return null;
  }
  const commit = await api.request("GET", `/git/commits/${saved.candidate_sha}`);
  ensure(
    commit.parents.length === 1 && commit.parents[0].sha === saved.request_commit,
    "Recorded candidate parent mismatch",
  );
  const source = await api.request("GET", `/git/commits/${saved.request_commit}`);
  ensure(
    source.parents.length === 1 && source.parents[0].sha === saved.source_sha,
    "Recorded source parent mismatch",
  );
  const requestPath = commit.message.match(
    /^AI-Edit-Request: (\.ai\/edits\/[A-Za-z0-9][A-Za-z0-9._-]*\.json)$/m,
  )?.[1];
  ensure(requestPath, "Recorded request trailer is absent");
  const request = JSON.parse((await api.content(requestPath, saved.request_commit)).text);
  ensure(
    request.expected_head === saved.source_sha &&
      identity(request).digest === saved.request_digest &&
      commit.message.split("\n").includes(`AI-Edit-Digest: ${saved.request_digest}`),
    "Recorded request identity mismatch",
  );
  return receipt({
    kind: "ai-edit",
    repository: saved.repository,
    run_id: saved.run_id,
    run_attempt: saved.run_attempt,
    source_sha: saved.source_sha,
    request_commit: saved.request_commit,
    request_digest: saved.request_digest,
    phase: "publication",
    candidate_sha: saved.candidate_sha,
    published_sha: saved.candidate_sha,
  });
}

// Suppression is earned by immutable publication identity and complete tree evidence,
// never by a bot-looking author or a user-controlled commit subject.
async function cleanupProof(api, run, trustedSha) {
  if (
    run.path !== ".github/workflows/ai-edit.yml" ||
    run.event !== "push" ||
    run.conclusion !== "skipped"
  )
    return null;
  try {
    verifyRun(run, api.repository, run.id, run.run_attempt);
    ensure(SHA.test(trustedSha), "Cleanup classification needs a reviewed runner");
    ensure(
      Number.isSafeInteger(run.workflow_id) && run.workflow_id > 0,
      "Invalid workflow identity",
    );
    const [actual, trusted, jobs, commit] = await Promise.all([
      api.content(run.path, run.head_sha),
      api.content(run.path, trustedSha),
      api.list(`/actions/runs/${run.id}/attempts/${run.run_attempt}/jobs`, "jobs"),
      api.request("GET", `/git/commits/${run.head_sha}`),
    ]);
    ensure(actual.sha === trusted.sha, "Cleanup workflow differs from reviewed runner");
    ensure(
      jobs.length === 1 &&
        jobs[0].name === "prepare isolated candidate" &&
        jobs[0].run_id === run.id &&
        jobs[0].head_sha === run.head_sha &&
        jobs[0].status === "completed" &&
        jobs[0].conclusion === "skipped",
      "Not a skipped preparation-only run",
    );
    ensure(
      commit.parents.length === 1 && SHA.test(commit.parents[0].sha),
      "Cleanup needs one request parent",
    );
    const requestCommit = commit.parents[0].sha;
    const [tree, candidates, evidenceHead] = await Promise.all([
      api.request("GET", `/git/trees/${commit.tree.sha}?recursive=1`),
      api.list(
        `/actions/workflows/${run.workflow_id}/runs?head_sha=${requestCommit}`,
        "workflow_runs",
      ),
      api.head("ci-logs"),
    ]);
    ensure(!tree.truncated && Array.isArray(tree.tree), "Incomplete cleanup tree");
    // Enumeration is bounded independently of API pagination. An unavailable proof
    // leaves ordinary reporting active; it never upgrades a skipped run to success.
    ensure(candidates.length <= 20, "Too many operation runs to classify");
    let attempts = 0;
    for (const candidate of [...candidates].sort((a, b) => a.id - b.id)) {
      ensure(
        Number.isSafeInteger(candidate.id) &&
          candidate.id > 0 &&
          Number.isSafeInteger(candidate.run_attempt) &&
          candidate.run_attempt > 0,
        "Invalid operation run identity",
      );
      attempts += candidate.run_attempt;
      ensure(attempts <= 20, "Too many operation attempts to classify");
      for (let attempt = 1; attempt <= candidate.run_attempt; attempt++) {
        let saved;
        try {
          saved = JSON.parse(
            (
              await api.content(
                `receipts/ai-edit/${candidate.id}/${attempt}/receipt.json`,
                evidenceHead,
              )
            ).text,
          );
        } catch (error) {
          if (error.status === 404) continue;
          throw error;
        }
        render(saved);
        if (
          saved.kind !== "ai-edit" ||
          saved.repository !== api.repository ||
          saved.run_id !== candidate.id ||
          saved.run_attempt !== attempt ||
          saved.request_commit !== requestCommit ||
          saved.published_sha !== run.head_sha ||
          saved.publication !== "confirmed"
        )
          continue;
        const originalRun = await api.run(candidate.id, attempt);
        verifyRun(originalRun, api.repository, candidate.id, attempt);
        ensure(
          originalRun.workflow_id === run.workflow_id &&
            originalRun.path === run.path &&
            originalRun.head_sha === requestCommit &&
            originalRun.head_branch === run.head_branch &&
            originalRun.conclusion === "success",
          "Operation run metadata mismatch",
        );
        // Reuse the publication owner's snapshot checks, including request-only
        // input, schema, source parent, regular paths, and original blob hashes.
        const state = await snapshot(api, originalRun, trustedSha);
        ensure(
          ["preview", "validate"].includes(state.operation) &&
            state.source_sha === saved.source_sha &&
            state.request_digest === saved.request_digest,
          "Read-only operation identity mismatch",
        );
        const remaining = new Map(
          tree.tree.filter((entry) => entry.type !== "tree").map((entry) => [entry.path, entry]),
        );
        const expected = new Map(state.original);
        expected.delete(state.request_path);
        ensure(
          !remaining.has(state.request_path) && remaining.size === expected.size,
          "Cleanup must only remove its request",
        );
        for (const [file, entry] of expected) {
          const actualEntry = remaining.get(file);
          ensure(
            actualEntry?.sha === entry.sha &&
              actualEntry?.mode === entry.mode &&
              actualEntry?.type === entry.type,
            "Adjacent content or mode change is not cleanup-only",
          );
        }
        return { operation: state.operation, operation_receipt: saved.evidence_path };
      }
    }
  } catch {
    // Missing, conflicting, oversized, or unverifiable evidence cannot authorize
    // suppression. Genuine failures keep the existing actionable reporting path.
  }
  return null;
}

async function retainCleanup(api, run, trustedSha) {
  const proof = await cleanupProof(api, run, trustedSha);
  if (!proof) return null;
  const outcome = receipt({
    kind: "ai-edit",
    repository: api.repository,
    run_id: run.id,
    run_attempt: run.run_attempt,
    request_commit: run.head_sha,
    phase: "selection",
  });
  const evidence = `receipts/ai-edit/${run.id}/${run.run_attempt}/manifest.json`;
  const manifest = {
    version: 1,
    classification: "cleanup_only",
    run_conclusion: "skipped",
    required_ci: "not_replaced",
    outcome,
    ...proof,
  };
  // Persist outside the proof catch: evidence failures must remain visible. Never
  // rewrite an older receipt, create a candidate, or touch a PR comment here.
  await api.persist({ [evidence]: `${JSON.stringify(manifest)}\n` });
  return { comment: "cleanup_only", publication: "not_attempted", evidence };
}

export async function recoverRun(api, run, trustedSha) {
  const cleanup = await retainCleanup(api, run, trustedSha);
  if (cleanup) return cleanup;
  const directory = `receipts/ai-edit/${run.id}/${run.run_attempt}/`;
  const evidenceHead = await api.head("ci-logs");
  for (const name of ["receipt.json", "intent.json"]) {
    let saved;
    try {
      saved = JSON.parse((await api.content(`${directory}${name}`, evidenceHead)).text);
    } catch (error) {
      if (error.status === 404) continue;
      throw error;
    }
    render(saved);
    ensure(
      saved.repository === api.repository &&
        saved.run_id === run.id &&
        saved.run_attempt === run.run_attempt &&
        saved.request_commit === run.head_sha,
      "Recovery identity mismatch",
    );
    if (name === "receipt.json") return reportToPull(api, run, saved);
    // Reconcile only remote facts. No artifact, formatter, candidate creation, or ref update.
    const confirmed = await reconcileRecordedIntent(api, run, saved);
    if (confirmed) {
      const report = await reportToPull(api, run, confirmed);
      return { ...report, publication: "confirmed" };
    }
    return {
      publication: "unconfirmed",
      evidence: `${directory}intent.json`,
      next_action: "reconcile_before_retry",
    };
  }
  const fallback = receipt({
    kind: "ai-edit",
    repository: api.repository,
    run_id: run.id,
    run_attempt: run.run_attempt,
    request_commit: run.head_sha,
    phase: "selection",
  });
  await api.persist({
    [`${directory}manifest.json`]: `${JSON.stringify({ version: 1, outcome: fallback, next_action: "retry_trusted_reporter" })}\n`,
  });
  return { publication: "not_attempted", evidence: `${directory}manifest.json` };
}

export async function publishRun(api, writer, run, trustedSha) {
  const cleanup = await retainCleanup(api, run, trustedSha);
  if (cleanup) return cleanup;
  const basic = {
    kind: "ai-edit",
    repository: api.repository,
    run_id: run.id,
    run_attempt: run.run_attempt,
    request_commit: run.head_sha,
  };
  // Recovery of a confirmed publication needs no retained artifact and never applies again.
  try {
    const saved = JSON.parse(
      (
        await api.content(
          `receipts/ai-edit/${run.id}/${run.run_attempt}/receipt.json`,
          await api.head("ci-logs"),
        )
      ).text,
    );
    render(saved);
    ensure(
      saved.repository === api.repository &&
        saved.run_id === run.id &&
        saved.run_attempt === run.run_attempt &&
        saved.request_commit === run.head_sha,
      "Stored receipt identity mismatch",
    );
    return reportToPull(api, run, saved);
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  // Early failures do not require parsing a candidate-controlled request or artifact.
  if (run.conclusion !== "success") {
    const value = receipt({ ...basic, phase: "selection" });
    return reportToPull(api, run, value);
  }
  const state = await snapshot(api, run, trustedSha);
  const candidate = await readCandidate(api, run);
  const files = validateCandidate(candidate, state);
  // Durable operation evidence precedes request consumption and survives report retries.
  await persistOperation(api, run, candidate.operation_result);
  const facts = {
    ...basic,
    source_sha: state.source_sha,
    request_digest: state.request_digest,
    phase: state.operation === "validate" ? "validated" : "formatted",
  };
  const tree = files.map((file) => ({
    path: file.path,
    mode: state.original.get(file.path)?.mode ?? "100644",
    type: "blob",
    ...(file.content === null ? { sha: null } : { content: file.content }),
  }));
  tree.push({ path: state.request_path, mode: "100644", type: "blob", sha: null });
  const directory = `receipts/ai-edit/${run.id}/${run.run_attempt}/`;
  const result = await publishCandidate(facts, {
    createCandidate: async () => {
      const nextTree = await writer.request("POST", "/git/trees", {
        base_tree: state.commit.tree.sha,
        tree,
      });
      const date = state.commit.committer.date;
      const actor = {
        name: "github-actions[bot]",
        email: "41898282+github-actions[bot]@users.noreply.github.com",
        date,
      };
      const subject =
        state.operation === "apply"
          ? state.request.message
          : `chore(ai-edit): ${state.operation} complete, target files unchanged`;
      ensure(
        typeof subject === "string" &&
          subject.length > 0 &&
          !/[\x00-\x1f\x7f]/.test(subject) &&
          !/\[(?:skip ci|ci skip|no ci|skip actions|actions skip)\]|skip-checks\s*:/i.test(subject),
        "Invalid commit subject",
      );
      const commit = await writer.request("POST", "/git/commits", {
        message: `${subject}\n\nAI-Edit-Request: ${state.request_path}\nAI-Edit-Digest: ${state.request_digest}`,
        tree: nextTree.sha,
        parents: [run.head_sha],
        author: actor,
        committer: actor,
      });
      return commit.sha;
    },
    currentHead: () => api.head(run.head_branch),
    contains: async (candidateSha, head) => {
      const comparison = await api.request("GET", `/compare/${candidateSha}...${head}`);
      return comparison.status === "ahead" || comparison.status === "identical";
    },
    saveIntent: (value) =>
      api.persist({ [`${directory}intent.json`]: `${JSON.stringify(value)}\n` }),
    // An uncertain publication retains intent, not an immutable false-negative terminal receipt.
    saveReceipt: (value) =>
      value.publication === "confirmed" ? persistOutcome(api, value) : Promise.resolve(),
    advance: (sha) =>
      writer.request("PATCH", `/git/refs/heads/${encodeURIComponent(run.head_branch)}`, {
        sha,
        force: false,
      }),
  });
  if (result.publication !== "confirmed")
    throw new Error("Publication unconfirmed; inspect durable intent before retrying");
  return reportToPull(api, run, result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv[2] === "prepare") {
      await prepareCandidate(
        process.env.CANDIDATE_ROOT,
        process.env.TRUSTED_SHA,
        process.env.FORMATTER_ROOT,
        process.env.CANDIDATE_OUTPUT,
      );
    } else if (process.argv[2] === "recover") {
      const api = new GitHub(process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
      const run = await api.run(
        Number(process.env.REPORT_RUN_ID),
        Number(process.env.REPORT_RUN_ATTEMPT),
      );
      ensure(run.path === ".github/workflows/ai-edit.yml", "Recovery only accepts AI edit runs");
      console.log(JSON.stringify(await recoverRun(api, run, process.env.TRUSTED_SHA)));
    } else if (process.argv[2] === "publish") {
      const api = new GitHub(process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
      const writer = new GitHub(process.env.GITHUB_REPOSITORY, process.env.PUBLISH_TOKEN);
      const run = await api.run(
        Number(process.env.REPORT_RUN_ID),
        Number(process.env.REPORT_RUN_ATTEMPT),
      );
      console.log(JSON.stringify(await publishRun(api, writer, run, process.env.TRUSTED_SHA)));
    } else throw new Error("Unknown operation");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
