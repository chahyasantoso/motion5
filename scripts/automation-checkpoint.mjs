#!/usr/bin/env node
// The checkpoint transport: a patch set declares the bytes it produces, and publication writes
// exactly those bytes. Contract: ADR-100 and ADR-101. Preparation holds no credential.
import { execFileSync, spawnSync } from "node:child_process";
import { lstat, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { receipt, render, safeText } from "./automation-receipt.mjs";
import {
  AUTOMATION_WORKFLOWS,
  GitHub,
  SHA,
  blobSha,
  boundedBody,
  ensure,
  persistOutcome,
  reportPreparationFailure,
  reportToPull,
} from "./automation-report.mjs";
import { publishCandidate } from "./automation-publish.mjs";
import {
  CHECKPOINT_ROOT,
  MAX_PATCHES,
  MAX_PATHS,
  checkpointChain,
  checkpointDigest,
  checkpointDirectory,
  checkpointFiles,
  checkpointManifest,
  parsePatch,
  patchDigest,
  reconcilePatch,
} from "./checkpoint-policy.mjs";

const KIND = "checkpoint";
const WORKFLOW = AUTOMATION_WORKFLOWS.checkpoint;
const SET_TRAILER = "AI-Checkpoint-Set";
const PATCH_LINE = /^AI-Checkpoint: (\.ai\/checkpoints\/cp[0-9]{3}\/[0-9]{3}-[a-z0-9-]+\.diff)$/m;
const CHECKPOINT_FILE = /^\.ai\/checkpoints\/(cp[0-9]{3})\/[A-Za-z0-9][A-Za-z0-9.-]*$/;
const CANDIDATE_BYTES = 1800000;
const FILE_BYTES = 1500000;
const RETAINED_BYTES = 1000000;
const CHUNK_BYTES = 24000;
const MAX_EVIDENCE_FILES = 55;
// `--unidiff-zero` is deliberate, and ADR-100 records the reasoning. Without it the parser and the
// applier accept different sets: `parsePatch` blesses a zero-context hunk and `git apply` then
// refuses it with `patch does not apply`, which is the late and opaque failure this design exists to
// avoid. The flag does not loosen context checking; measured, a hunk whose context lines disagree
// with the file and a zero-context deletion whose removed line disagrees are both still refused with
// it. What it leaves unverified is a zero-context pure insertion, which carries neither context nor
// a removed line, and that is exactly the placement question the declared post-image already owns.
const APPLY_FLAGS = ["--unidiff-zero", "--whitespace=nowarn", "-p1"];
const SPLIT = "split the work into more, smaller checkpoints";
const ACTOR = {
  name: "github-actions[bot]",
  email: "41898282+github-actions[bot]@users.noreply.github.com",
};

function artifactName(run) {
  return `ai-checkpoint-candidate-${run.id}-${run.run_attempt}`;
}

function formatMessage(checkpoint) {
  return `style(checkpoint): normalise ${checkpoint} with the pinned formatter`;
}

function consumeMessage(checkpoint) {
  return `chore(checkpoint): consume ${checkpoint}`;
}

/** One patch-set commit carries the files of exactly one numbered checkpoint folder. */
function checkpointId(changed) {
  ensure(changed.length >= 2, "A patch-set commit carries a manifest and at least one patch");
  const ids = new Set();
  for (const file of changed) {
    const match = CHECKPOINT_FILE.exec(file);
    ensure(match !== null, `${JSON.stringify(file)} is not a checkpoint file`);
    ids.add(match[1]);
  }
  ensure(ids.size === 1, "A patch-set commit carries exactly one checkpoint folder");
  return [...ids][0];
}

async function regularText(root, file) {
  let current = root;
  const parts = file.split("/");
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    const last = index === parts.length - 1;
    let stat;
    try {
      stat = await lstat(current);
    } catch (error) {
      // A missing ancestor means the file is absent, which a creation patch declares as null.
      if (error.code === "ENOENT") return null;
      throw error;
    }
    ensure(!stat.isSymbolicLink(), `${JSON.stringify(file)} traverses a symbolic link`);
    ensure(last ? stat.isFile() : stat.isDirectory(), `${JSON.stringify(file)} is not a file`);
    if (last) ensure(stat.size <= FILE_BYTES, `${JSON.stringify(file)} exceeds the byte limit`);
  }
  const bytes = await readFile(path.join(root, file));
  const text = bytes.toString("utf8");
  ensure(!text.includes("\0"), `${JSON.stringify(file)} is not text`);
  ensure(Buffer.from(text).equals(bytes), `${JSON.stringify(file)} is not UTF-8`);
  return text;
}

function blobOf(content) {
  return content === null ? null : blobSha(Buffer.from(content));
}

function exactKeys(value, allowed) {
  ensure(value !== null && typeof value === "object" && !Array.isArray(value), "Expected object");
  ensure(
    Object.keys(value).every((key) => allowed.includes(key)),
    "Unknown candidate field",
  );
}

// The artifact reader is duplicated from the AI edit publisher knowingly rather than accidentally:
// it belongs in the GitHub adapter, and lifting it there is its own slice, not a drive-by edit.
async function readCheckpointCandidate(api, run) {
  const name = artifactName(run);
  const artifacts = await api.list(`/actions/runs/${run.id}/artifacts`, "artifacts");
  const matches = artifacts.filter((artifact) => artifact.name === name && !artifact.expired);
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
  const scratch = await mkdtemp(path.join(tmpdir(), "motion5-checkpoint-artifact-"));
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

async function formatSurviving(root, formatterRoot, surviving) {
  const entry = path.join(formatterRoot, "node_modules/prettier/index.mjs");
  const prettier = await import(pathToFileURL(entry).href);
  const options = JSON.parse(
    await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
  );
  const files = [];
  for (const file of surviving) {
    const content = await regularText(root, file);
    ensure(content !== null, `${JSON.stringify(file)} is absent at the chain tip`);
    // Filepath also controls printing, and candidate configuration is never discovered.
    const info = await prettier.getFileInfo(file, { resolveConfig: false, ignorePath: [] });
    if (!info.inferredParser) continue;
    const settings = { ...options, filepath: file, parser: info.inferredParser };
    const normalized = await prettier.format(content, settings);
    if (normalized === content) continue;
    await writeFile(path.join(root, file), normalized);
    files.push({ path: file, content: normalized });
  }
  return files;
}

/**
 * Apply the stack in a disposable checkout and adjudicate by digest. Git applies, because
 * reimplementing a hunk applier would be more code and more bugs, and the declared post-image
 * decides, because a clean exit only means the hunks found context somewhere.
 */
export async function prepareCheckpoint(root, trustedSha, formatterRoot, output) {
  ensure(SHA.test(trustedSha ?? ""), "A reviewed immutable runner SHA is required");
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 2000000,
      timeout: 30000,
      env: {
        PATH: process.env.PATH,
        HOME: process.env.RUNNER_TEMP ?? tmpdir(),
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_GLOBAL: "/dev/null",
        GIT_TERMINAL_PROMPT: "0",
      },
    }).trim();
  const parents = git("rev-list", "--parents", "-n", "1", "HEAD").split(" ");
  ensure(
    parents.length === 2 && parents.every((sha) => SHA.test(sha)),
    "A patch-set commit needs exactly one parent",
  );
  const [requestCommit, source] = parents;
  const changed = git("diff", "--no-renames", "--name-only", source, requestCommit)
    .split("\n")
    .filter(Boolean);
  const id = checkpointId(changed);
  const manifestPath = `${CHECKPOINT_ROOT}/${id}/manifest.json`;
  const text = await regularText(root, manifestPath);
  ensure(text !== null, `${JSON.stringify(manifestPath)} is absent`);
  const manifest = checkpointManifest(JSON.parse(text));
  ensure(manifest.checkpoint === id, "The manifest names another checkpoint");
  ensure(manifest.base === source, "Stale base; the patch set was cut against another commit");
  const files = checkpointFiles(manifest);
  const declared = files.slice().sort().join("\n");
  ensure(changed.slice().sort().join("\n") === declared, "A patch-set-only commit is required");
  const directory = checkpointDirectory(manifest);
  const present = await readdir(path.join(root, directory));
  const names = files.map((file) => path.posix.basename(file));
  ensure(
    present.slice().sort().join("\n") === names.slice().sort().join("\n"),
    "The checkpoint folder carries a file its manifest does not declare",
  );
  const stored = await readdir(path.join(root, CHECKPOINT_ROOT));
  ensure(stored.length === 1 && stored[0] === id, "Exactly one pending checkpoint is supported");
  const chain = checkpointChain(manifest);
  const patches = [];
  // The aggregate retained-evidence bound is checked here rather than only in the publisher. It is a
  // third bound alongside the per-patch and per-candidate ones, and preparation is the cheap place
  // to refuse it: the publisher enforces the same limit independently when it retains the bytes on
  // `ci-logs`, and discovering it there costs a push and a queue wait for a deterministic refusal.
  let retained = 0;
  for (const patch of manifest.patches) {
    const file = `${directory}/${patch.file}`;
    const bytes = await regularText(root, file);
    ensure(bytes !== null, `${JSON.stringify(file)} is absent`);
    ensure(
      patchDigest(Buffer.from(bytes)) === patch.sha256,
      `${JSON.stringify(file)} does not match its declared SHA-256`,
    );
    retained += Buffer.byteLength(bytes);
    ensure(retained <= RETAINED_BYTES, `Retained patch bytes exceed the limit; ${SPLIT}`);
    reconcilePatch(parsePatch(bytes, manifest.allow), patch);
    patches.push({ ...patch, file });
  }
  for (const [file, blob] of chain.base) {
    const content = await regularText(root, file);
    ensure(
      blobOf(content) === blob,
      `stale pre-image for ${JSON.stringify(file)}; the base changed under the patch set`,
    );
  }
  const commits = [];
  for (const patch of patches) {
    git("apply", "--check", ...APPLY_FLAGS, "--", patch.file);
    git("apply", ...APPLY_FLAGS, "--", patch.file);
    const produced = [];
    for (const file of Object.keys(patch.post).slice().sort()) {
      const content = await regularText(root, file);
      const observed = blobOf(content);
      ensure(
        observed === patch.post[file],
        `patch ${patch.seq} left ${JSON.stringify(file)} at ${observed} rather than its declared ${patch.post[file]}`,
      );
      produced.push({ path: file, content });
    }
    commits.push({
      seq: patch.seq,
      message: patch.message,
      patch: patch.file,
      patch_sha256: patch.sha256,
      files: produced,
    });
  }
  const dirty = [
    ...git("diff", "--no-renames", "--name-only").split("\n"),
    ...git("ls-files", "--others", "--exclude-standard").split("\n"),
  ].filter(Boolean);
  for (const file of dirty)
    ensure(chain.paths.includes(file), `${JSON.stringify(file)} changed outside the declaration`);
  const surviving = chain.paths.filter((file) => chain.tip.get(file) !== null);
  const formatted = await formatSurviving(root, formatterRoot, surviving);
  const candidate = {
    version: 1,
    kind: KIND,
    trusted_sha: trustedSha,
    request_commit: requestCommit,
    source_sha: source,
    checkpoint: id,
    checkpoint_digest: checkpointDigest(manifest),
    commits,
    format: formatted.length === 0 ? null : { message: formatMessage(id), files: formatted },
  };
  ensure(
    Buffer.byteLength(JSON.stringify(candidate)) <= CANDIDATE_BYTES,
    `The candidate exceeds ${CANDIDATE_BYTES} bytes; ${SPLIT}`,
  );
  if (output) await writeFile(output, `${JSON.stringify(candidate)}\n`);
  return candidate;
}

/** Content is believed only because it hashes to a post-image the reviewed manifest declared. */
function declaredFiles(files, declared, label) {
  const paths = Object.keys(declared);
  ensure(
    Array.isArray(files) && files.length === paths.length,
    `${label} has the wrong file count`,
  );
  const seen = new Set();
  for (const file of files) {
    exactKeys(file, ["path", "content"]);
    ensure(
      Object.hasOwn(declared, file.path) && !seen.has(file.path),
      `${label} carries an undeclared or duplicate path`,
    );
    seen.add(file.path);
    ensure(
      file.content === null || typeof file.content === "string",
      `${label} content must be text or a deletion`,
    );
    ensure(
      file.content === null || Buffer.byteLength(file.content) <= FILE_BYTES,
      `${label} content exceeds the byte limit`,
    );
    ensure(
      blobOf(file.content) === declared[file.path],
      `${label} content for ${JSON.stringify(file.path)} is not its declared post-image`,
    );
  }
}

export function validateCheckpointCandidate(candidate, expected) {
  exactKeys(candidate, [
    "version",
    "kind",
    "trusted_sha",
    "request_commit",
    "source_sha",
    "checkpoint",
    "checkpoint_digest",
    "commits",
    "format",
  ]);
  ensure(candidate.version === 1 && candidate.kind === KIND, "Unsupported candidate version");
  for (const key of ["trusted_sha", "request_commit", "source_sha", "checkpoint"])
    ensure(candidate[key] === expected[key], `Candidate ${key} mismatch`);
  ensure(
    candidate.checkpoint_digest === expected.checkpoint_digest,
    "Candidate checkpoint_digest mismatch",
  );
  ensure(
    Buffer.byteLength(JSON.stringify(candidate)) <= CANDIDATE_BYTES,
    `The candidate exceeds ${CANDIDATE_BYTES} bytes; ${SPLIT}`,
  );
  const patches = expected.manifest.patches;
  ensure(
    Array.isArray(candidate.commits) && candidate.commits.length === patches.length,
    "Candidate commit count differs from the manifest",
  );
  candidate.commits.forEach((commit, index) => {
    const patch = patches[index];
    const label = `commit ${index + 1}`;
    exactKeys(commit, ["seq", "message", "patch", "patch_sha256", "files"]);
    ensure(commit.seq === patch.seq, `${label} sequence mismatch`);
    ensure(commit.message === patch.message, `${label} subject mismatch`);
    ensure(commit.patch === `${expected.directory}/${patch.file}`, `${label} patch path mismatch`);
    ensure(commit.patch_sha256 === patch.sha256, `${label} patch digest mismatch`);
    declaredFiles(commit.files, patch.post, label);
  });
  if (candidate.format === null) return;
  exactKeys(candidate.format, ["message", "files"]);
  ensure(
    candidate.format.message === formatMessage(expected.checkpoint),
    "Formatting commit subject mismatch",
  );
  const files = candidate.format.files;
  ensure(
    Array.isArray(files) && files.length > 0 && files.length <= MAX_PATHS,
    "Invalid formatting file list",
  );
  const seen = new Set();
  for (const file of files) {
    exactKeys(file, ["path", "content"]);
    ensure(
      expected.surviving.includes(file.path) && !seen.has(file.path),
      "Formatting touched a path the checkpoint does not leave behind",
    );
    seen.add(file.path);
    ensure(
      typeof file.content === "string" && Buffer.byteLength(file.content) <= FILE_BYTES,
      "Formatting content must be bounded text",
    );
  }
}

function blobEntries(tree) {
  const entries = tree.tree.filter((entry) => entry.type !== "tree");
  return new Map(entries.map((entry) => [entry.path, entry]));
}

export async function checkpointSnapshot(api, run, trustedSha) {
  ensure(SHA.test(trustedSha ?? "") && run.path === WORKFLOW, "Untrusted publication workflow");
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
  ensure(commit.parents.length === 1, "A patch-set commit needs one parent");
  const source = commit.parents[0].sha;
  const sourceCommit = await api.request("GET", `/git/commits/${source}`);
  const [before, after] = await Promise.all([
    api.request("GET", `/git/trees/${sourceCommit.tree.sha}?recursive=1`),
    api.request("GET", `/git/trees/${commit.tree.sha}?recursive=1`),
  ]);
  ensure(!before.truncated && !after.truncated, "Snapshot tree is incomplete");
  const original = blobEntries(before);
  const current = blobEntries(after);
  const changed = [...new Set([...original.keys(), ...current.keys()])].filter(
    (file) =>
      original.get(file)?.sha !== current.get(file)?.sha ||
      original.get(file)?.mode !== current.get(file)?.mode,
  );
  const id = checkpointId(changed.slice().sort());
  for (const file of changed)
    ensure(current.get(file)?.mode === "100644", "A patch file must be a regular file");
  const directory = `${CHECKPOINT_ROOT}/${id}`;
  const text = (await api.content(`${directory}/manifest.json`, run.head_sha)).text;
  const manifest = checkpointManifest(JSON.parse(text));
  ensure(manifest.checkpoint === id, "The manifest names another checkpoint");
  ensure(manifest.base === source, "Stale base; the patch set was cut against another commit");
  const files = checkpointFiles(manifest);
  const declared = files.slice().sort().join("\n");
  ensure(changed.slice().sort().join("\n") === declared, "A patch-set-only commit is required");
  const stored = [...current.keys()].filter((file) => file.startsWith(`${CHECKPOINT_ROOT}/`));
  ensure(stored.slice().sort().join("\n") === declared, "Exactly one pending checkpoint");
  const chain = checkpointChain(manifest);
  for (const [file, blob] of chain.base) {
    const entry = original.get(file);
    ensure(
      !entry || (entry.type === "blob" && ["100644", "100755"].includes(entry.mode)),
      "Non-regular source file",
    );
    for (let parent = path.posix.dirname(file); parent !== "."; parent = path.posix.dirname(parent))
      ensure(!original.has(parent), "Non-directory source ancestor");
    ensure((entry?.sha ?? null) === blob, "Source blob mismatch");
  }
  return {
    trusted_sha: trustedSha,
    request_commit: run.head_sha,
    source_sha: source,
    checkpoint: id,
    checkpoint_digest: checkpointDigest(manifest),
    manifest,
    chain,
    directory,
    files,
    surviving: chain.paths.filter((file) => chain.tip.get(file) !== null),
    commit,
    original,
  };
}

function chunked(text) {
  const chunks = [];
  let remaining = text;
  while (remaining.length > 0) {
    const bytes = Buffer.from(remaining);
    let end = Math.min(bytes.length, CHUNK_BYTES);
    while (end < bytes.length && end > 0 && (bytes[end] & 0xc0) === 0x80) end -= 1;
    const chunk = bytes.subarray(0, end).toString("utf8");
    chunks.push(chunk);
    remaining = remaining.slice(chunk.length);
  }
  return chunks;
}

// Retention precedes consumption: patch bytes reach ci-logs before the commit that deletes them.
async function persistCheckpointEvidence(api, run, state, candidate) {
  const directory = `receipts/${KIND}/${run.id}/${run.run_attempt}/`;
  const files = {};
  const patches = [];
  let index = 0;
  let retained = 0;
  for (const patch of state.manifest.patches) {
    const source = `${state.directory}/${patch.file}`;
    // Retained chunks are sanitised, so they are evidence of what was transported rather than a
    // byte-exact copy: a token-shaped string or a control character is redacted out of them while
    // `sha256` below still names the digest over the original bytes. A reader comparing a chunk
    // against that digest must expect a mismatch, which is why the evidence says so in
    // `retained_text`. The declared digest is the authority; a chunk is a reading aid.
    const text = safeText((await api.content(source, state.request_commit)).text);
    retained += Buffer.byteLength(text);
    ensure(retained <= RETAINED_BYTES, `Retained patch bytes exceed the limit; ${SPLIT}`);
    const chunks = [];
    for (const chunk of chunked(text)) {
      const file = `${directory}diff-${String(index).padStart(3, "0")}.txt`;
      index += 1;
      ensure(index <= MAX_EVIDENCE_FILES, `Retained patch chunks exceed the limit; ${SPLIT}`);
      files[file] = chunk;
      chunks.push(file);
    }
    const produced = candidate.commits[patch.seq - 1].files;
    patches.push({
      seq: patch.seq,
      file: source,
      sha256: patch.sha256,
      message: patch.message,
      chunks,
      files: produced.map((file) => ({
        path: file.path,
        pre: patch.pre[file.path],
        declared: patch.post[file.path],
        observed: blobOf(file.content),
      })),
    });
  }
  const formatted =
    candidate.format === null ? [] : candidate.format.files.map((file) => file.path);
  files[`${directory}manifest.json`] =
    JSON.stringify({
      version: 1,
      kind: KIND,
      checkpoint: state.checkpoint,
      checkpoint_digest: state.checkpoint_digest,
      source_sha: state.source_sha,
      request_commit: state.request_commit,
      patches,
      formatted,
      retained_text: "sanitised_not_byte_exact",
      required_ci: "not_replaced",
      next_action: "inspect_published_commits_and_required_ci",
    }) + "\n";
  await api.persist(files);
}

function treeEntry(state, file) {
  const mode = state.original.get(file.path)?.mode ?? "100644";
  const entry = { path: file.path, mode, type: "blob" };
  return file.content === null ? { ...entry, sha: null } : { ...entry, content: file.content };
}

async function writeCommit(writer, input) {
  const next = await writer.request("POST", "/git/trees", {
    base_tree: input.tree,
    tree: input.entries,
  });
  const commit = await writer.request("POST", "/git/commits", {
    message: input.message,
    tree: next.sha,
    parents: [input.parent],
    author: input.actor,
    committer: input.actor,
  });
  ensure(SHA.test(commit.sha ?? ""), "Invalid published commit");
  return { parent: commit.sha, tree: next.sha };
}

/**
 * Publication writes bytes, not hunks. The disposable checkout is gone, so there is nothing to
 * apply here and no candidate code runs anywhere near the writer credential.
 */
export function buildCommits(writer, run, state, candidate) {
  return async () => {
    const actor = { ...ACTOR, date: state.commit.committer.date };
    const set = `${SET_TRAILER}: ${state.checkpoint_digest}`;
    let parent = run.head_sha;
    let tree = state.commit.tree.sha;
    for (const commit of candidate.commits) {
      const trailers = `AI-Checkpoint: ${commit.patch}\nAI-Checkpoint-Patch: sha256:${commit.patch_sha256}\n${set}`;
      ({ parent, tree } = await writeCommit(writer, {
        parent,
        tree,
        entries: commit.files.map((file) => treeEntry(state, file)),
        message: `${commit.message}\n\n${trailers}`,
        actor,
      }));
    }
    if (candidate.format !== null)
      ({ parent, tree } = await writeCommit(writer, {
        parent,
        tree,
        entries: candidate.format.files.map((file) => treeEntry(state, file)),
        message: `${candidate.format.message}\n\n${set}`,
        actor,
      }));
    const consumed = state.files.map((file) => ({
      path: file,
      mode: "100644",
      type: "blob",
      sha: null,
    }));
    ({ parent } = await writeCommit(writer, {
      parent,
      tree,
      entries: consumed,
      message: `${consumeMessage(state.checkpoint)}\n\n${set}`,
      actor,
    }));
    return parent;
  };
}

async function reportStored(api, run, saved) {
  render(saved);
  ensure(
    saved.kind === KIND &&
      saved.repository === api.repository &&
      saved.run_id === run.id &&
      saved.run_attempt === run.run_attempt &&
      saved.request_commit === run.head_sha,
    "Stored receipt identity mismatch",
  );
  if (saved.publication === "not_attempted" && run.conclusion !== "success")
    return reportPreparationFailure(api, run, saved);
  return reportToPull(api, run, saved);
}

// A published checkpoint deletes its own folder, and that push starts a run the workflow condition
// skips. Recording it keeps the trail complete; it cannot claim a publication, replace required CI,
// or upgrade a run to success, so a forged trailer buys only the absence of a prepared candidate.
async function classifySkipped(api, run, basic) {
  const commit = await api.request("GET", `/git/commits/${run.head_sha}`);
  const trailer = commit.message.split("\n").some((line) => line.startsWith(`${SET_TRAILER}: `));
  const evidence = `receipts/${KIND}/${run.id}/${run.run_attempt}/manifest.json`;
  const classification =
    trailer && commit.parents.length === 1 ? "cleanup_only" : "skipped_by_filter";
  const manifest = {
    version: 1,
    classification,
    run_conclusion: "skipped",
    required_ci: "not_replaced",
    outcome: receipt({ ...basic, phase: "selection" }),
    next_action: "inspect_published_commits_and_required_ci",
  };
  await api.persist({ [evidence]: `${JSON.stringify(manifest)}\n` });
  return { comment: classification, publication: "not_attempted", evidence };
}

async function reportUnprepared(api, run, basic) {
  if (run.conclusion === "skipped") return classifySkipped(api, run, basic);
  return reportPreparationFailure(api, run, receipt({ ...basic, phase: "selection" }));
}

function basicFacts(api, run) {
  return {
    kind: KIND,
    repository: api.repository,
    run_id: run.id,
    run_attempt: run.run_attempt,
    request_commit: run.head_sha,
  };
}

async function storedReceipt(api, run) {
  const file = `receipts/${KIND}/${run.id}/${run.run_attempt}/receipt.json`;
  try {
    return JSON.parse((await api.content(file, await api.head("ci-logs"))).text);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

export async function publishCheckpointRun(api, writer, run, trustedSha) {
  ensure(run.path === WORKFLOW, "Publication only accepts checkpoint runs");
  const basic = basicFacts(api, run);
  const stored = await storedReceipt(api, run);
  if (stored) return reportStored(api, run, stored);
  // Early failures never parse a candidate-controlled manifest or artifact.
  if (run.conclusion !== "success") return reportUnprepared(api, run, basic);
  const state = await checkpointSnapshot(api, run, trustedSha);
  const candidate = await readCheckpointCandidate(api, run);
  validateCheckpointCandidate(candidate, state);
  await persistCheckpointEvidence(api, run, state, candidate);
  const directory = `receipts/${KIND}/${run.id}/${run.run_attempt}/`;
  const facts = {
    ...basic,
    source_sha: state.source_sha,
    request_digest: state.checkpoint_digest,
    phase: "applied",
  };
  const result = await publishCandidate(facts, {
    createCandidate: buildCommits(writer, run, state, candidate),
    currentHead: () => api.head(run.head_branch),
    contains: async (candidateSha, head) => {
      const comparison = await api.request("GET", `/compare/${candidateSha}...${head}`);
      return comparison.status === "ahead" || comparison.status === "identical";
    },
    saveIntent: (value) =>
      api.persist({ [`${directory}intent.json`]: `${JSON.stringify(value)}\n` }),
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

/** Reconcile recorded intent against the immutable commit chain. A patch is never replayed. */
export async function reconcileCheckpointIntent(api, run, saved) {
  if (!saved.candidate_sha || !run.head_branch) return null;
  const head = await api.head(run.head_branch);
  if (head !== saved.candidate_sha) {
    const comparison = await api.request("GET", `/compare/${saved.candidate_sha}...${head}`);
    if (!["ahead", "identical"].includes(comparison.status)) return null;
  }
  const set = `${SET_TRAILER}: ${saved.request_digest}`;
  let current = saved.candidate_sha;
  for (let step = 0; step < MAX_PATCHES + 2; step += 1) {
    const commit = await api.request("GET", `/git/commits/${current}`);
    ensure(commit.parents.length === 1, "A published checkpoint commit needs one parent");
    ensure(commit.message.split("\n").includes(set), "A published commit lost its set trailer");
    const patch = PATCH_LINE.exec(commit.message)?.[1];
    current = commit.parents[0].sha;
    if (current !== saved.request_commit) continue;
    ensure(patch !== undefined, "The first published commit lost its patch trailer");
    const source = await api.request("GET", `/git/commits/${saved.request_commit}`);
    ensure(
      source.parents.length === 1 && source.parents[0].sha === saved.source_sha,
      "Recorded source parent mismatch",
    );
    const directory = path.posix.dirname(patch);
    const file = `${directory}/manifest.json`;
    const manifest = checkpointManifest(
      JSON.parse((await api.content(file, saved.request_commit)).text),
    );
    ensure(
      checkpointDigest(manifest) === saved.request_digest && manifest.base === saved.source_sha,
      "Recorded checkpoint identity mismatch",
    );
    return receipt({
      kind: KIND,
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
  return null;
}

export async function recoverCheckpointRun(api, run, trustedSha) {
  ensure(run.path === WORKFLOW, "Recovery only accepts checkpoint runs");
  ensure(SHA.test(trustedSha ?? ""), "A reviewed immutable runner SHA is required");
  const basic = basicFacts(api, run);
  const directory = `receipts/${KIND}/${run.id}/${run.run_attempt}/`;
  const evidenceHead = await api.head("ci-logs");
  for (const name of ["receipt.json", "intent.json"]) {
    let saved;
    try {
      saved = JSON.parse((await api.content(`${directory}${name}`, evidenceHead)).text);
    } catch (error) {
      if (error.status === 404) continue;
      throw error;
    }
    if (name === "receipt.json") return reportStored(api, run, saved);
    render(saved);
    ensure(
      saved.kind === KIND &&
        saved.repository === api.repository &&
        saved.run_id === run.id &&
        saved.run_attempt === run.run_attempt &&
        saved.request_commit === run.head_sha,
      "Recovery identity mismatch",
    );
    const confirmed = await reconcileCheckpointIntent(api, run, saved);
    if (!confirmed)
      return {
        publication: "unconfirmed",
        evidence: `${directory}intent.json`,
        next_action: "reconcile_before_retry",
      };
    const report = await reportToPull(api, run, confirmed);
    return { ...report, publication: "confirmed" };
  }
  if (run.conclusion !== "success") return reportUnprepared(api, run, basic);
  const fallback = receipt({ ...basic, phase: "selection" });
  const manifest = { version: 1, outcome: fallback, next_action: "retry_trusted_reporter" };
  await api.persist({ [`${directory}manifest.json`]: `${JSON.stringify(manifest)}\n` });
  return { publication: "not_attempted", evidence: `${directory}manifest.json` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv[2] === "prepare") {
      await prepareCheckpoint(
        process.env.CANDIDATE_ROOT,
        process.env.TRUSTED_SHA,
        process.env.FORMATTER_ROOT,
        process.env.CANDIDATE_OUTPUT,
      );
    } else if (process.argv[2] === "publish") {
      const api = new GitHub(process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
      const writer = new GitHub(process.env.GITHUB_REPOSITORY, process.env.PUBLISH_TOKEN);
      const run = await api.run(
        Number(process.env.REPORT_RUN_ID),
        Number(process.env.REPORT_RUN_ATTEMPT),
      );
      const outcome = await publishCheckpointRun(api, writer, run, process.env.TRUSTED_SHA);
      console.log(JSON.stringify(outcome));
    } else if (process.argv[2] === "recover") {
      const api = new GitHub(process.env.GITHUB_REPOSITORY, process.env.GH_TOKEN);
      const run = await api.run(
        Number(process.env.REPORT_RUN_ID),
        Number(process.env.REPORT_RUN_ATTEMPT),
      );
      const outcome = await recoverCheckpointRun(api, run, process.env.TRUSTED_SHA);
      console.log(JSON.stringify(outcome));
    } else throw new Error("Unknown operation");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
