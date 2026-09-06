#!/usr/bin/env node
// Trusted GitHub adapter. Candidate files and logs are data, never executable inputs.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { diagnostics, receipt, render, summaryAllowed } from "./automation-receipt.mjs";

export function ensure(condition, message) {
  if (!condition) throw new Error(message);
}
export const SHA = /^[a-f0-9]{40}$/;
const WORKFLOWS = new Set([
  ".github/workflows/ci.yml",
  ".github/workflows/recovery-audit.yml",
  ".github/workflows/ai-edit.yml",
]);
export function verifyRun(run, repository, id, attempt) {
  ensure(run.id === id && run.run_attempt === attempt, "Run identity mismatch");
  ensure(
    Number.isSafeInteger(id) && id > 0 && Number.isSafeInteger(attempt) && attempt > 0,
    "Invalid run identity",
  );
  ensure(run.repository?.full_name === repository, "Repository mismatch");
  ensure(run.head_repository?.full_name === repository, "Fork runs are not publication targets");
  ensure(SHA.test(run.head_sha) && WORKFLOWS.has(run.path), "Unrecognized workflow or SHA");
  ensure(["push", "pull_request", "workflow_dispatch"].includes(run.event), "Unsupported event");
  ensure(run.status === "completed", "Run has not completed");
  return run;
}

export async function collectDiagnostics(fetchLogs) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return diagnostics({ exit_code: 0, text: await fetchLogs() });
    } catch {
      // A retrieval error is never passed off as test output.
    }
  }
  return diagnostics({ exit_code: 1, text: "" });
}

export async function reportOutcome(value, ports, detail = null, scope = "default") {
  const projection = render(value).body;
  ensure(/^(default|\d+)$/.test(String(scope)), "Invalid summary scope");
  await ports.persist(value, detail);
  const head = value.published_sha ?? value.head_sha ?? value.request_commit;
  if ((await ports.currentHead()) !== head) return { comment: "stale" };
  const prefix = `<!-- motion5-summary:${value.kind}:${scope}:`;
  const owned = (await ports.comments()).filter(
    (comment) =>
      comment.user?.id === 41898282 &&
      comment.user?.type === "Bot" &&
      comment.body?.startsWith(prefix),
  );
  ensure(owned.length <= 1, "Multiple bot summaries require reconciliation");
  const previous = owned[0];
  const match = previous?.body.slice(prefix.length).match(/^([a-f0-9]{40}):(\d+):(\d+) -->/);
  ensure(!previous || match, "Malformed bot summary");
  const sameHead = match?.[1] === head;
  if (
    !summaryAllowed({
      current_head: head,
      incoming_head: head,
      incoming_run: value.run_id,
      incoming_attempt: value.run_attempt,
      ...(sameHead ? { previous_run: Number(match[2]), previous_attempt: Number(match[3]) } : {}),
    }).allowed
  )
    return { comment: "stale" };
  // Reporters are serialized by the workflow. GitHub comments have no conditional update API.
  if ((await ports.currentHead()) !== head) return { comment: "stale" };
  const diagnosticLink = `https://github.com/${value.repository}/blob/ci-logs/${value.evidence_path.replace("receipt.json", "diagnostics.json")}`;
  const details = detail
    ? `\n\nDiagnostics: **${detail.state}**. [Retained evidence](${diagnosticLink}).\n<pre>${detail.excerpt}</pre>`
    : "";
  const body = `${prefix}${head}:${value.run_id}:${value.run_attempt} -->\n${projection}${details}`;
  await ports.writeComment(previous?.id ?? null, body);
  return { comment: (await ports.currentHead()) === head ? "published" : "published_historical" };
}

export async function boundedBody(response, limit) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    ensure(bytes <= limit, "GitHub response exceeds byte limit");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export class GitHub {
  constructor(repository, token) {
    ensure(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository), "Invalid repository");
    ensure(typeof token === "string" && token.length > 0, "Missing credential");
    this.repository = repository;
    this.token = token;
  }
  async request(method, path, body) {
    ensure(
      path.startsWith("/") &&
        !path.split(/[/?]/).some((part) => part === ".." || part === ".") &&
        !path.includes("\\") &&
        !path.includes("#"),
      "Unsafe API path",
    );
    const response = await fetch(`https://api.github.com/repos/${this.repository}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
      redirect: "error",
    });
    if (!response.ok) {
      const error = new Error(`GitHub request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    const bytes = await boundedBody(response, 6000000);
    return bytes.length ? JSON.parse(bytes.toString("utf8")) : null;
  }
  async list(path, key = null) {
    const all = [];
    for (let page = 1; page <= 10; page++) {
      const data = await this.request(
        "GET",
        `${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`,
      );
      const rows = key ? data[key] : data;
      ensure(Array.isArray(rows), "Invalid GitHub collection");
      all.push(...rows);
      if (rows.length < 100) return all;
    }
    throw new Error("GitHub collection exceeds pagination limit");
  }
  async content(path, ref) {
    ensure(SHA.test(ref), "Content reads require immutable SHA");
    const value = await this.request(
      "GET",
      `/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${ref}`,
    );
    ensure(
      value.type === "file" && value.encoding === "base64" && value.size <= 1500000,
      "Expected bounded regular file",
    );
    const bytes = Buffer.from(value.content, "base64");
    ensure(
      bytes.length === value.size && blobSha(bytes) === value.sha,
      "Incomplete or corrupt contents response",
    );
    return { ...value, text: bytes.toString("utf8") };
  }
  async run(id, attempt) {
    ensure(
      Number.isSafeInteger(id) && id > 0 && Number.isSafeInteger(attempt) && attempt > 0,
      "Invalid run identity",
    );
    return verifyRun(
      await this.request("GET", `/actions/runs/${id}/attempts/${attempt}`),
      this.repository,
      id,
      attempt,
    );
  }
  async head(branch) {
    ensure(
      typeof branch === "string" && branch.length > 0 && !/[\x00-\x20\\~^:?*\[]/.test(branch),
      "Unsafe branch",
    );
    const ref = await this.request("GET", `/git/ref/heads/${encodeURIComponent(branch)}`);
    ensure(SHA.test(ref.object?.sha), "Invalid ref response");
    return ref.object.sha;
  }
  async persist(files) {
    const entries = Object.entries(files);
    ensure(entries.length > 0 && entries.length <= 60, "Invalid evidence file count");
    for (const [path, content] of entries) {
      ensure(
        /^receipts\/(?:ci|ai-edit)\/[1-9]\d*\/[1-9]\d*\/(?:(?:receipt|intent|diagnostics|manifest)\.json|log-\d{3}\.txt)$/.test(
          path,
        ),
        "Invalid evidence destination",
      );
      ensure(typeof content === "string", "Evidence must be text");
    }
    ensure(
      entries.reduce((sum, [, text]) => sum + Buffer.byteLength(text), 0) <= 1800000,
      "Evidence exceeds limit",
    );
    for (let attempt = 0; attempt < 3; attempt++) {
      const head = await this.head("ci-logs");
      const commit = await this.request("GET", `/git/commits/${head}`);
      const tree = await this.request("GET", `/git/trees/${commit.tree.sha}?recursive=1`);
      ensure(!tree.truncated, "Evidence tree is incomplete");
      const existing = new Map(tree.tree.map((entry) => [entry.path, entry]));
      const changed = [];
      for (const [path, content] of entries) {
        const old = existing.get(path);
        if (old)
          ensure(
            old.type === "blob" && old.sha === blobSha(Buffer.from(content)),
            "Refusing to overwrite historical evidence",
          );
        else changed.push({ path, mode: "100644", type: "blob", content });
      }
      if (changed.length === 0) return;
      const nextTree = await this.request("POST", "/git/trees", {
        base_tree: commit.tree.sha,
        tree: changed,
      });
      const next = await this.request("POST", "/git/commits", {
        message: "ci(automation): retain exact-run evidence",
        tree: nextTree.sha,
        parents: [head],
      });
      try {
        await this.request("PATCH", "/git/refs/heads/ci-logs", { sha: next.sha, force: false });
        return;
      } catch {
        // Retry only evidence publication after re-reading the immutable files.
      }
    }
    throw new Error("Evidence publication could not be confirmed");
  }
}
export function blobSha(bytes) {
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}
export async function persistOutcome(api, value, detail = null) {
  render(value);
  const directory = value.evidence_path.slice(0, -"receipt.json".length);
  const files = { [value.evidence_path]: `${JSON.stringify(value)}\n` };
  if (detail) {
    const { chunks, ...metadata } = detail;
    const paths = chunks.map((text, index) => {
      const path = `${directory}log-${String(index).padStart(3, "0")}.txt`;
      files[path] = text;
      return path;
    });
    files[`${directory}diagnostics.json`] = `${JSON.stringify({ ...metadata, paths })}\n`;
  }
  await api.persist(files);
}
export async function reportToPull(api, run, value, detail = null) {
  await persistOutcome(api, value, detail);
  const pulls = await api.list(`/commits/${run.head_sha}/pulls`);
  const verified = pulls.filter(
    (pr) =>
      pr.state === "open" &&
      pr.base?.repo?.full_name === api.repository &&
      pr.head?.repo?.full_name === api.repository &&
      pr.head?.ref === run.head_branch,
  );
  if (verified.length !== 1) return { comment: "no_unique_pr", evidence: value.evidence_path };
  const number = verified[0].number;
  ensure(Number.isSafeInteger(number) && number > 0, "Invalid PR number");
  return reportOutcome(
    value,
    {
      persist: async () => {},
      currentHead: async () => {
        const pr = await api.request("GET", `/pulls/${number}`);
        ensure(
          pr.head?.repo?.full_name === api.repository && pr.head.ref === run.head_branch,
          "PR association changed",
        );
        return pr.state === "open" ? pr.head.sha : null;
      },
      comments: () => api.list(`/issues/${number}/comments`),
      writeComment: (id, body) =>
        id
          ? api.request("PATCH", `/issues/comments/${id}`, { body })
          : api.request("POST", `/issues/${number}/comments`, { body }),
    },
    detail,
    String(run.workflow_id),
  );
}
export async function reportCompletedRun(api, run, trustedSha) {
  ensure(SHA.test(trustedSha), "A reviewed immutable runner SHA is required");
  let tested = null;
  if (run.path === ".github/workflows/ci.yml") {
    const [actual, trusted] = await Promise.all([
      api.content(run.path, run.head_sha),
      api.content(run.path, trustedSha),
    ]);
    if (actual.sha === trusted.sha) tested = run.head_sha;
  }
  const value = receipt({
    kind: "ci",
    repository: api.repository,
    run_id: run.id,
    run_attempt: run.run_attempt,
    head_sha: run.head_sha,
    tested_sha: tested,
    ci: run.conclusion ?? "unavailable",
  });
  let exists = false;
  let retainedDetail = null;
  try {
    const saved = await api.content(value.evidence_path, await api.head("ci-logs"));
    ensure(
      saved.text === `${JSON.stringify(value)}\n`,
      "Existing receipt conflicts with run metadata",
    );
    exists = true;
    const savedDetail = await api.content(
      value.evidence_path.replace("receipt.json", "diagnostics.json"),
      await api.head("ci-logs"),
    );
    retainedDetail = JSON.parse(savedDetail.text);
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  const detail = exists
    ? null
    : await collectDiagnostics(async () => {
        const result = spawnSync(
          "gh",
          [
            "run",
            "view",
            String(run.id),
            "--repo",
            api.repository,
            "--attempt",
            String(run.run_attempt),
            "--log-failed",
          ],
          {
            encoding: "utf8",
            timeout: 45000,
            maxBuffer: 8000000,
            env: {
              PATH: process.env.PATH,
              GH_TOKEN: api.token,
              HOME: process.env.RUNNER_TEMP ?? "/tmp",
            },
          },
        );
        ensure(result.status === 0 && !result.error, "Log retrieval failed");
        return result.stdout;
      });
  if (exists) {
    const ports = Object.create(api);
    // Reuse the retained diagnostic projection without re-persisting its removed chunk array.
    ports.persist = async (files) => {
      const receiptOnly = Object.fromEntries(
        Object.entries(files).filter(([key]) => key.endsWith("/receipt.json")),
      );
      await api.persist(receiptOnly);
    };
    return reportToPull(
      ports,
      run,
      value,
      retainedDetail ? { ...retainedDetail, chunks: [] } : null,
    );
  }
  return reportToPull(api, run, value, detail);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const api = new GitHub(process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
    const run = await api.run(
      Number(process.env.REPORT_RUN_ID),
      Number(process.env.REPORT_RUN_ATTEMPT),
    );
    ensure(run.path !== ".github/workflows/ai-edit.yml", "AI edits use the publication adapter");
    console.log(JSON.stringify(await reportCompletedRun(api, run, process.env.TRUSTED_SHA)));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
