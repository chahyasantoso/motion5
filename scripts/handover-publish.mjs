// The handover publisher: after `npm run patches` applies a version 2 handover, its notes and its
// independent review result are posted to the GitHub pull request or issue the manifest names, or
// a pull request is opened for the branch when it has none. Before anything is posted the target
// branch is made to hold the applied tip: created when it is not published yet, fast-forwarded
// when it is behind, and never force-pushed. Contract: ADR-119 and docs/HANDOVER-FORMAT.md.
// Tests: packages/core/test/unit/scripts/handover-publish.test.ts.
//
// GitHub is reached only through the human's own `gh` login, never a token this script reads, and
// every process runs through the injected `run` port. Publication cannot fail an application: the
// checkout has already moved when it starts, so every way it stops is a value, and every stop
// short of `published` leaves the payload in the Git directory for `patches:publish` to retry.
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { HandoverRefusal, unreachable } from "./handover-format.mjs";

/** The closed set of ways a publication attempt ends. */
export const PUBLICATION_KINDS = Object.freeze([
  "opted-out",
  "unaddressed",
  "deferred",
  "failed",
  "published",
]);

/** The closed set of reasons a publication waits for the human rather than failing. */
export const DEFERRAL_KINDS = Object.freeze([
  "remote-missing",
  "gh-missing",
  "gh-unauthenticated",
  "branch-diverged",
  "pull-request-elsewhere",
]);

/** The closed set of things publishing did to the remote branch before it posted anything. */
export const BRANCH_SYNC_KINDS = Object.freeze(["up-to-date", "created", "fast-forwarded"]);

/** The closed set of things a publication writes to GitHub, each marked so it is written once. */
export const PUBLICATION_PARTS = Object.freeze(["pull-request", "notes", "review"]);

// GitHub refuses a pull request or comment body over 65,536 characters. Every body is cut well
// inside that, whatever part of it is long, and the cut says where the whole text still is.
export const MAX_BODY_CHARACTERS = 60000;
// `gh pr list` pages internally up to its limit; a branch with more pull requests than this is not
// a case a handover meets, and the limit is what keeps "none found" from meaning "not looked".
const PULL_REQUEST_LIMIT = "200";
const PENDING = "motion5-handover/pending";
const GITHUB_HOST = "github.com";
const REMOTE_URL =
  /^(?:https?:\/\/(?:[^@/]+@)?github\.com\/|ssh:\/\/git@github\.com(?::[0-9]+)?\/|git@github\.com:)([^/]+\/[^/]+?)(?:\.git)?\/?$/i;
const PULL_URL = /\/pull\/([0-9]+)\s*$/;

/** The hidden line that names one part of one exact handover in a GitHub body. */
export function marker(identity, part) {
  return `<!-- motion5-handover:${identity}:${part} -->`;
}

function statusWord(status) {
  switch (status) {
    case "passed":
      return "passed";
    case "failed":
      return "failed";
    case "pending":
      return "pending, not a pass";
    default:
      return unreachable(status, "REVIEW_STATUSES");
  }
}

/** The one line every body carries about the review, so no body can say more than the review. */
export function reviewLine(review) {
  if (review === null)
    return "Independent review: **not provided**. This handover carries no independent review result.";
  return `Independent review: **${statusWord(review.status)}** by ${review.reviewer}.`;
}

function commitLines(commits) {
  return commits.map((commit) => `- \`${commit.sha.slice(0, 12)}\` ${commit.subject}`);
}

/** Any body cut to what GitHub accepts, with the cut saying where the whole text is. */
export function bounded(body) {
  if (body.length <= MAX_BODY_CHARACTERS) return body;
  return `${body.slice(0, MAX_BODY_CHARACTERS)}\n\n_Cut at ${MAX_BODY_CHARACTERS} characters to fit GitHub; the whole text is \`NOTES.md\` and \`REVIEW.json\` in the handover zip._\n`;
}

/** The notes as every body carries them: the applied commits, the review line, then the file. */
function notesSection(handover) {
  return [
    `Applied by \`npm run patches\` as ${handover.commits.length} commit(s), tip \`${handover.tip}\`:`,
    ...commitLines(handover.commits),
    "",
    reviewLine(handover.review),
    "",
    "---",
    "",
    handover.notes,
  ];
}

/**
 * The body of a pull request opened for a handover's branch. It carries the notes itself, marked
 * as the notes part, so a pull request this publisher opened owes no separate notes comment and
 * never exists without its notes, even when every later post fails.
 */
export function pullRequestBody(handover) {
  return bounded(
    [
      marker(handover.identity, "pull-request"),
      marker(handover.identity, "notes"),
      `Opened by \`npm run patches\` for the handover \`${handover.name}\`, refs #${handover.issue}.`,
      "",
      ...notesSection(handover),
    ].join("\n"),
  );
}

/** The comment carrying a handover's notes to a thread this publisher did not open. */
export function notesComment(handover) {
  return bounded(
    [
      marker(handover.identity, "notes"),
      `## Handover notes: \`${handover.name}\``,
      "",
      ...notesSection(handover),
    ].join("\n"),
  );
}

function findingLines(findings) {
  if (findings.length === 0) return ["None reported."];
  return findings.flatMap((finding) => [
    `- **${finding.severity}**, ${finding.state}: ${finding.title}`,
    ...(finding.detail.trim() === ""
      ? []
      : finding.detail
          .trim()
          .split("\n")
          .map((line) => `  ${line}`)),
  ]);
}

/** The comment carrying the independent review result, stated exactly as the review states it. */
export function reviewComment(handover) {
  const { review } = handover;
  if (review === null) throw new TypeError(`${handover.name} carries no review to comment with`);
  return bounded(
    [
      marker(handover.identity, "review"),
      `## Independent review of \`${handover.name}\`: ${statusWord(review.status)}`,
      "",
      `Reviewer: ${review.reviewer}`,
      "",
      `Summary: ${review.summary}`,
      "",
      "Findings:",
      ...findingLines(review.findings),
      "",
      `Evidence: ${review.evidence ?? "not provided"}`,
      "",
    ].join("\n"),
  );
}

/** The comments a handover owes its destination, in the order they are posted. */
export function commentParts(handover) {
  return handover.review === null ? ["notes"] : ["notes", "review"];
}

function commentBody(handover, part) {
  switch (part) {
    case "notes":
      return notesComment(handover);
    case "review":
      return reviewComment(handover);
    case "pull-request":
      throw new TypeError("a pull request body is written by `gh pr create`, never as a comment");
    default:
      return unreachable(part, "PUBLICATION_PARTS");
  }
}

/** The GitHub `owner/name` a remote URL points at, as spelled, or null for anything else. */
export function remoteRepository(url) {
  const match = REMOTE_URL.exec(String(url).trim());
  return match === null ? null : match[1];
}

function must(run, command, args, cwd) {
  const result = run(command, args, { cwd });
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed: ${String(result.stderr).trim()}`);
  return String(result.stdout);
}

/** A publication step that stopped; carried as a value so it can be reported and retried. */
class Stop extends Error {
  constructor(publication) {
    super(publication.kind);
    this.publication = publication;
  }
}

function defer(reason) {
  throw new Stop({ kind: "deferred", reason });
}

function fail(step, reason) {
  throw new Stop({ kind: "failed", step, reason });
}

/** A `gh` call; a missing binary is a deferral, and any other failure names the step it was. */
function gh(run, root, step, args) {
  let result;
  try {
    result = run("gh", args, { cwd: root });
  } catch (error) {
    if (error instanceof HandoverRefusal && error.refusal.kind === "tool-missing")
      defer({ kind: "gh-missing" });
    throw error;
  }
  if (result.status !== 0) fail(step, String(result.stderr).trim() || `gh exited ${result.status}`);
  return String(result.stdout);
}

function remoteFor(run, root, repository) {
  const wanted = repository.toLowerCase();
  for (const name of must(run, "git", ["remote"], root).split("\n").filter(Boolean)) {
    // The raw configured URL rather than `git remote get-url`, which expands `insteadOf`: the
    // question is which GitHub repository the human means, not where Git would fetch it from.
    const url = run("git", ["config", "--get", `remote.${name}.url`], { cwd: root });
    if (url.status === 0 && remoteRepository(url.stdout)?.toLowerCase() === wanted) return name;
  }
  return defer({ kind: "remote-missing", repository });
}

/**
 * What the remote branch is, measured against the applied tip. The owner asked on #508 what
 * happens when the branch is not published or not pushed yet: both are states the publisher can
 * settle itself with a fast-forward push, so only a remote that holds commits the tip lacks waits
 * for the human, because the one write that could settle it is a force push, which is never ours.
 */
export const BRANCH_STATES = Object.freeze(["up-to-date", "absent", "behind", "diverged"]);

function isAncestor(run, root, ancestor, descendant) {
  return (
    run("git", ["merge-base", "--is-ancestor", ancestor, descendant], { cwd: root }).status === 0
  );
}

function hasCommit(run, root, sha) {
  return run("git", ["cat-file", "-e", `${sha}^{commit}`], { cwd: root }).status === 0;
}

/** The remote branch's state; a tip this checkout has never seen is fetched before it is judged. */
function branchState(run, root, remote, branch, tip) {
  const ref = `refs/heads/${branch}`;
  const listed = run("git", ["ls-remote", "--heads", remote, ref], { cwd: root });
  if (listed.status !== 0) fail("ls-remote", String(listed.stderr).trim());
  const line = String(listed.stdout)
    .split("\n")
    .find((each) => each.endsWith(`\t${ref}`));
  if (line === undefined) return { kind: "absent" };
  const remoteTip = line.slice(0, line.indexOf("\t"));
  if (remoteTip === tip) return { kind: "up-to-date" };
  if (!hasCommit(run, root, remoteTip)) {
    const fetched = run("git", ["fetch", "--quiet", "--no-tags", remote, ref], { cwd: root });
    if (fetched.status !== 0) fail("fetch", String(fetched.stderr).trim());
  }
  if (isAncestor(run, root, tip, remoteTip)) return { kind: "up-to-date" };
  if (isAncestor(run, root, remoteTip, tip)) return { kind: "behind", remoteTip };
  return { kind: "diverged", remoteTip };
}

function pushTip(run, root, remote, branch, tip) {
  // The exact applied commit rather than HEAD, and never forced: Git itself refuses anything but
  // a creation or a fast-forward, so a remote that moved since it was read fails here instead of
  // losing its commits.
  const pushed = run("git", ["push", "--quiet", remote, `${tip}:refs/heads/${branch}`], {
    cwd: root,
  });
  if (pushed.status !== 0) fail("push", String(pushed.stderr).trim() || "git push failed");
}

/**
 * The remote branch must hold the applied tip before anything is posted, or a comment would cite
 * commits GitHub cannot show. Returns what was done to get there, which the result reports.
 */
function publishBranch(run, root, remote, branch, tip) {
  const state = branchState(run, root, remote, branch, tip);
  switch (state.kind) {
    case "up-to-date":
      return { kind: "up-to-date" };
    case "absent":
      pushTip(run, root, remote, branch, tip);
      return { kind: "created" };
    case "behind":
      pushTip(run, root, remote, branch, tip);
      return { kind: "fast-forwarded", from: state.remoteTip };
    case "diverged":
      return defer({ kind: "branch-diverged", remote, branch, tip, remoteTip: state.remoteTip });
    default:
      return unreachable(state, "BRANCH_STATES");
  }
}

function json(text, step) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fail(step, `gh returned something that is not JSON: ${error.message}`);
  }
}

const PULL_FIELDS =
  "number,url,state,body,baseRefName,headRefName,headRepository,headRepositoryOwner";

/** `owner/name` of a pull request's head repository, lower-cased, or null for a deleted fork. */
function headRepositoryOf(pull) {
  const owner = pull.headRepositoryOwner?.login;
  const name = pull.headRepository?.name;
  return typeof owner === "string" && typeof name === "string"
    ? `${owner}/${name}`.toLowerCase()
    : null;
}

/** Whether a pull request is the target branch's: same head branch in the target repository. */
function isTargetBranch(pull, target) {
  return (
    pull.headRefName === target.branch && headRepositoryOf(pull) === target.repository.toLowerCase()
  );
}

/**
 * The branch's pull request to publish to, or undefined. `gh pr list --head` matches the branch
 * name in any repository, so a fork's same-named branch is filtered out by head repository. Among
 * the branch's own, an open one merging into `target.into` wins, then any open one, then the most
 * recent into `target.into`, then the most recent at all: posting to a closed thread is noise,
 * and opening a second pull request for the same branch is the duplicate issue #507 forbids.
 */
export function branchPullRequest(pulls, target) {
  const own = pulls.filter((pull) => isTargetBranch(pull, target));
  const open = own.filter((pull) => pull.state === "OPEN");
  const into = (pull) => pull.baseRefName === target.into;
  return open.find(into) ?? open[0] ?? own.find(into) ?? own[0];
}

/**
 * The pull request or issue the handover publishes to, whether this attempt created it, and the
 * body it already carries (a pull request's may hold the notes part). A branch destination opens
 * a pull request only when the branch has none at all, so a retry finds what an earlier attempt
 * opened.
 */
async function destinationOf(run, root, handover, address, scratch) {
  const { target } = address;
  const repo = ["--repo", target.repository];
  const { destination } = target;
  switch (destination.kind) {
    case "pull-request": {
      const found = json(
        gh(run, root, "view-pull-request", [
          "pr",
          "view",
          String(destination.number),
          ...repo,
          "--json",
          PULL_FIELDS,
        ]),
        "view-pull-request",
      );
      if (!isTargetBranch(found, target))
        defer({
          kind: "pull-request-elsewhere",
          number: destination.number,
          head: `${headRepositoryOf(found) ?? "(deleted repository)"}:${found.headRefName}`,
          branch: `${target.repository}:${target.branch}`,
        });
      return {
        kind: "pull-request",
        number: found.number,
        url: found.url,
        created: false,
        body: String(found.body ?? ""),
      };
    }
    case "issue": {
      const found = json(
        gh(run, root, "view-issue", [
          "issue",
          "view",
          String(handover.issue),
          ...repo,
          "--json",
          "number,url",
        ]),
        "view-issue",
      );
      return { kind: "issue", number: found.number, url: found.url, created: false, body: "" };
    }
    case "branch": {
      const listed = json(
        gh(run, root, "list-pull-requests", [
          "pr",
          "list",
          ...repo,
          "--head",
          target.branch,
          "--state",
          "all",
          "--json",
          PULL_FIELDS,
          "--limit",
          PULL_REQUEST_LIMIT,
        ]),
        "list-pull-requests",
      );
      const existing = branchPullRequest(listed, target);
      if (existing !== undefined)
        return {
          kind: "pull-request",
          number: existing.number,
          url: existing.url,
          created: false,
          body: String(existing.body ?? ""),
        };
      const text = pullRequestBody(handover);
      const body = path.join(scratch, "pull-request.md");
      await writeFile(body, text);
      const url = gh(run, root, "create-pull-request", [
        "pr",
        "create",
        ...repo,
        "--head",
        target.branch,
        "--base",
        target.into,
        "--title",
        address.title,
        "--body-file",
        body,
      ]).trim();
      const number = PULL_URL.exec(url);
      if (number === null) fail("create-pull-request", `gh printed no pull request URL: ${url}`);
      return { kind: "pull-request", number: Number(number[1]), url, created: true, body: text };
    }
    default:
      return unreachable(destination, "DESTINATION_KINDS");
  }
}

/**
 * Which of this handover's parts already sit in the thread, read from their markers in every
 * comment and in the pull request body, which carries the notes when this publisher opened it.
 */
function presentParts(run, root, repository, found, identity) {
  const { number } = found;
  const out = gh(run, root, "list-comments", [
    "api",
    "--paginate",
    `repos/${repository}/issues/${number}/comments`,
    "--jq",
    ".[].body | @json",
  ]);
  const bodies = [
    found.body,
    ...out
      .split("\n")
      .filter(Boolean)
      .map((line) => json(line, "list-comments")),
  ];
  return new Set(
    PUBLICATION_PARTS.filter((part) =>
      bodies.some((body) => String(body).includes(marker(identity, part))),
    ),
  );
}

async function post(run, root, repository, number, body, scratch, part) {
  const input = path.join(scratch, `${part}.json`);
  await writeFile(input, JSON.stringify({ body }));
  gh(run, root, `post-${part}`, [
    "api",
    "--method",
    "POST",
    `repos/${repository}/issues/${number}/comments`,
    "--input",
    input,
  ]);
}

function pendingDirectory(run, root) {
  return path.resolve(root, must(run, "git", ["rev-parse", "--git-path", PENDING], root).trim());
}

function pendingFile(directory, handover) {
  return path.join(directory, `${handover.name}.json`);
}

/**
 * Publishes one applied handover. The payload is written to the Git directory before GitHub is
 * touched and removed only once every part is in place, so a deferral, a failure or a crash leaves
 * exactly what a retry needs, outside the tree the next handover requires clean.
 */
export async function publishHandover(handover, { root, run, temporary = tmpdir() }) {
  const { address } = handover;
  switch (address.kind) {
    case "unaddressed":
      return { kind: "unaddressed" };
    case "addressed":
      break;
    default:
      return unreachable(address, "ADDRESS_KINDS");
  }
  const target = address.target;
  const directory = pendingDirectory(run, root);
  const saved = pendingFile(directory, handover);
  await mkdir(directory, { recursive: true });
  await writeFile(saved, `${JSON.stringify(handover, null, 2)}\n`);
  const scratch = await mkdtemp(path.join(temporary, "motion5-publish-"));
  try {
    const remote = remoteFor(run, root, target.repository);
    gh(run, root, "gh-version", ["--version"]);
    if (run("gh", ["auth", "status", "--hostname", GITHUB_HOST], { cwd: root }).status !== 0)
      defer({ kind: "gh-unauthenticated" });
    const branch = publishBranch(run, root, remote, target.branch, handover.tip);
    const found = await destinationOf(run, root, handover, address, scratch);
    const present = presentParts(run, root, target.repository, found, handover.identity);
    const posted = [];
    const skipped = [];
    for (const part of commentParts(handover)) {
      if (present.has(part)) {
        skipped.push(part);
        continue;
      }
      await post(
        run,
        root,
        target.repository,
        found.number,
        commentBody(handover, part),
        scratch,
        part,
      );
      posted.push(part);
    }
    await rm(saved, { force: true });
    return {
      kind: "published",
      destination: { kind: found.kind, number: found.number, url: found.url },
      created: found.created,
      branch,
      posted,
      skipped,
    };
  } catch (error) {
    if (error instanceof Stop) return { ...error.publication, pending: saved };
    return {
      kind: "failed",
      step: "unexpected",
      reason: error instanceof Error ? error.message : String(error),
      pending: saved,
    };
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

/**
 * `npm run patches:publish`: retries every publication an earlier apply left pending, in name
 * order. A payload that cannot be read is reported rather than skipped, and left where it is.
 */
export async function publishPending({ root, run, temporary = tmpdir() }) {
  const directory = pendingDirectory(run, root);
  const names = await readdir(directory).then(
    (entries) => entries.filter((entry) => entry.endsWith(".json")).sort(),
    () => [],
  );
  const results = [];
  for (const name of names) {
    const file = path.join(directory, name);
    let handover;
    try {
      handover = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      results.push({
        name: name.replace(/\.json$/, ""),
        publication: { kind: "failed", step: "read-pending", reason: error.message, pending: file },
      });
      continue;
    }
    results.push({
      name: handover.name,
      publication: await publishHandover(handover, { root, run, temporary }),
    });
  }
  return results;
}

function deferralLines(reason) {
  switch (reason.kind) {
    case "remote-missing":
      return [
        `No Git remote here points at github.com/${reason.repository}.`,
        `Add one (git remote add origin https://github.com/${reason.repository}.git), then run npm run patches:publish.`,
      ];
    case "gh-missing":
      return [
        "The GitHub CLI (gh) is not installed; it is what publishes, with your own login and no token.",
        "Install it (https://cli.github.com), run gh auth login, then npm run patches:publish.",
      ];
    case "gh-unauthenticated":
      return [
        "The GitHub CLI (gh) is not logged in to github.com.",
        "Run gh auth login, then npm run patches:publish.",
      ];
    case "branch-diverged":
      return [
        `${reason.remote}/${reason.branch} is at ${reason.remoteTip.slice(0, 12)}, which has commits the applied tip ${reason.tip.slice(0, 12)} lacks; publishing never force-pushes.`,
        `Merge it (git pull --no-rebase ${reason.remote} ${reason.branch}), push (git push ${reason.remote} HEAD:${reason.branch}), then run npm run patches:publish.`,
        "Merge rather than rebase: a rebase rewrites the applied commits the notes cite.",
      ];
    case "pull-request-elsewhere":
      return [
        `Pull request #${reason.number} is for ${reason.head}, not the handover's branch ${reason.branch}; nothing was posted to it.`,
        "Ask for a handover addressed to the right pull request, or post NOTES.md from the zip by hand.",
      ];
    default:
      return unreachable(reason, "DEFERRAL_KINDS");
  }
}

function branchLine(branch) {
  switch (branch.kind) {
    case "up-to-date":
      return "The branch on GitHub already held the applied commits.";
    case "created":
      return "Pushed the applied commits, publishing the branch on GitHub.";
    case "fast-forwarded":
      return `Pushed the applied commits, fast-forwarding the branch on GitHub from ${branch.from.slice(0, 12)}.`;
    default:
      return unreachable(branch, "BRANCH_SYNC_KINDS");
  }
}

function partList(parts) {
  return parts.length === 0 ? "nothing" : parts.join(" and ");
}

/** The lines a human reads about one publication, one arm per kind and nowhere else. */
export function describePublication(publication) {
  switch (publication.kind) {
    case "opted-out":
      return ["Publishing skipped because of --no-publish; NOTES.md is only in the zip."];
    case "unaddressed":
      return [
        "Not published: this is a version 1 handover, which names no repository or branch to post to.",
      ];
    case "deferred":
      return [
        "Not published yet; the notes and review are saved for a retry.",
        ...deferralLines(publication.reason),
      ];
    case "failed":
      return [
        `Publishing failed at ${publication.step}: ${publication.reason}`,
        publication.pending === null
          ? "Nothing was saved for a retry; post NOTES.md from the zip by hand."
          : "The notes and review are saved; fix the cause and run npm run patches:publish.",
      ];
    case "published":
      return [
        branchLine(publication.branch),
        `Published to ${publication.destination.kind === "issue" ? "issue" : "pull request"} #${publication.destination.number}${publication.created ? ", which this run opened" : ""}: ${publication.destination.url}`,
        `Posted ${partList(publication.posted)}; already there: ${partList(publication.skipped)}.`,
      ];
    default:
      return unreachable(publication, "PUBLICATION_KINDS");
  }
}

/** Whether a publication left nothing for the human to do. */
export function isSettled(publication) {
  switch (publication.kind) {
    case "opted-out":
    case "unaddressed":
    case "published":
      return true;
    case "deferred":
    case "failed":
      return false;
    default:
      return unreachable(publication, "PUBLICATION_KINDS");
  }
}
