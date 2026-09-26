import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyHandover,
  inspectArchive,
  runProcess,
  type Run,
  type RunOptions,
  type RunResult,
} from "../../../../../scripts/handover-apply.mjs";
import {
  HandoverRefusal,
  REFUSAL_KINDS,
  type Destination,
  type HandoverReview,
} from "../../../../../scripts/handover-format.mjs";
import { packHandover } from "../../../../../scripts/handover-pack.mjs";
import {
  BRANCH_STATES,
  BRANCH_SYNC_KINDS,
  DEFERRAL_KINDS,
  MAX_BODY_CHARACTERS,
  PUBLICATION_KINDS,
  PUBLICATION_PARTS,
  bounded,
  branchPullRequest,
  commentParts,
  describePublication,
  isSettled,
  marker,
  notesComment,
  publishHandover,
  publishPending,
  pullRequestBody,
  remoteRepository,
  reviewComment,
  reviewLine,
  type AppliedHandover,
  type Publication,
} from "../../../../../scripts/handover-publish.mjs";

/**
 * Publishing a handover's notes and independent review result after it applies, issue #507 and
 * ADR-119. Git is real: a bare repository stands in for GitHub's Git remote through `insteadOf`,
 * so whether the branch holds the applied tip is measured by `git ls-remote`, not asserted. The
 * GitHub API is the one fake, because it is the network: `FakeGitHub` answers exactly the `gh`
 * invocations the publisher makes and records every write, so "posted once" is counted rather
 * than inferred. The owner asked whether this needs a token; it does not, and the fake is also how
 * that is held: the publisher reaches GitHub only through `gh`, whose login is the human's.
 */

const REPO = fileURLToPath(new URL("../../../../../", import.meta.url));
const CLI = join(REPO, "scripts/handover.mjs");
const REPOSITORY = "octo/motion5";
const BRANCH = "feat/507-publish";
const URL_BASE = `https://github.com/${REPOSITORY}`;
const ENV: NodeJS.ProcessEnv = {
  ...process.env,
  GIT_AUTHOR_NAME: "Handover Test",
  GIT_AUTHOR_EMAIL: "handover@test.invalid",
  GIT_COMMITTER_NAME: "Handover Test",
  GIT_COMMITTER_EMAIL: "handover@test.invalid",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
};
const realRun = (command: string, args: readonly string[], options: RunOptions = {}) =>
  runProcess(command, args, { ...options, env: ENV });

const cleanup: string[] = [];
afterEach(async () => {
  for (const directory of cleanup.splice(0)) await rm(directory, { recursive: true, force: true });
});

async function temporary(prefix: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  cleanup.push(directory);
  return directory;
}

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: ENV });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}

interface PullRequest {
  readonly number: number;
  readonly url: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  readonly headRefName: string;
  readonly baseRefName: string;
  readonly headRepository: { readonly name: string } | null;
  readonly headRepositoryOwner: { readonly login: string } | null;
  readonly title: string;
  readonly body: string;
}

/** What `gh pr view|list --json` prints for a pull request: everything but the title. */
function listed({ title: _title, ...fields }: PullRequest): Omit<PullRequest, "title"> {
  return fields;
}

const ok = (stdout = ""): RunResult => ({ status: 0, stdout, stderr: "" });
const no = (stderr: string): RunResult => ({ status: 1, stdout: "", stderr });

function option(args: readonly string[], name: string): string {
  const index = args.indexOf(name);
  if (index === -1 || args[index + 1] === undefined) throw new Error(`gh call lacks ${name}`);
  return args[index + 1] as string;
}

/** The GitHub the publisher sees through `gh`: pull requests, issues, and comment threads. */
class FakeGitHub {
  installed = true;
  authenticated = true;
  readonly pulls: PullRequest[] = [];
  readonly issues = new Set<number>([507]);
  readonly threads = new Map<number, string[]>();
  readonly calls: string[][] = [];
  failPost: string | null = null;
  private next = 600;

  pull(
    headRefName: string,
    state: PullRequest["state"] = "OPEN",
    fields: Partial<PullRequest> = {},
  ): PullRequest {
    const number = this.next++;
    const pull: PullRequest = {
      number,
      url: `${URL_BASE}/pull/${number}`,
      state,
      headRefName,
      baseRefName: "main",
      headRepository: { name: "motion5" },
      headRepositoryOwner: { login: "octo" },
      title: "existing",
      body: "",
      ...fields,
    };
    this.pulls.push(pull);
    return pull;
  }

  thread(number: number): string[] {
    const found = this.threads.get(number) ?? [];
    this.threads.set(number, found);
    return found;
  }

  writes(): string[][] {
    return this.calls.filter(
      (call) => call.includes("create") || call.includes("POST") || call.includes("comment"),
    );
  }

  answer(args: readonly string[]): RunResult {
    this.calls.push([...args]);
    if (!this.installed) throw new HandoverRefusal({ kind: "tool-missing", tool: "gh" });
    const [first, second] = args;
    if (first === "--version") return ok("gh version 2.0.0\n");
    if (first === "auth" && second === "status")
      return this.authenticated ? ok() : no("You are not logged into any GitHub hosts.");
    if (!args.includes("--repo") && first !== "api") throw new Error("gh call lacks --repo");
    if (first === "pr" && second === "view") {
      const pull = this.pulls.find((each) => each.number === Number(args[2]));
      return pull === undefined ? no("no pull requests found") : ok(JSON.stringify(listed(pull)));
    }
    if (first === "pr" && second === "list") {
      const head = option(args, "--head");
      expect(option(args, "--limit")).toBe("200");
      const found = this.pulls
        .filter((each) => each.headRefName === head)
        .reverse()
        .map(listed);
      return ok(JSON.stringify(found));
    }
    if (first === "pr" && second === "create") {
      const number = this.next++;
      this.pulls.push({
        number,
        url: `${URL_BASE}/pull/${number}`,
        state: "OPEN",
        headRefName: option(args, "--head"),
        baseRefName: option(args, "--base"),
        headRepository: { name: "motion5" },
        headRepositoryOwner: { login: "octo" },
        title: option(args, "--title"),
        body: readFileSync(option(args, "--body-file"), "utf8"),
      });
      return ok(`${URL_BASE}/pull/${number}\n`);
    }
    if (first === "issue" && second === "view") {
      const number = Number(args[2]);
      return this.issues.has(number)
        ? ok(JSON.stringify({ number, url: `${URL_BASE}/issues/${number}` }))
        : no("issue not found");
    }
    if (first === "api") {
      const endpoint = args.find((each) => each.startsWith("repos/")) ?? "";
      const match = /^repos\/([^/]+\/[^/]+)\/issues\/([0-9]+)\/comments$/.exec(endpoint);
      if (match === null || match[1] !== REPOSITORY) return no(`unexpected endpoint ${endpoint}`);
      const thread = this.thread(Number(match[2]));
      if (args.includes("POST")) {
        const body = JSON.parse(readFileSync(option(args, "--input"), "utf8")).body as string;
        if (this.failPost !== null && body.includes(this.failPost)) return no("HTTP 502");
        thread.push(body);
        return ok("{}");
      }
      return ok(thread.map((body) => `${JSON.stringify(body)}\n`).join(""));
    }
    return no(`unexpected gh ${args.join(" ")}`);
  }
}

/** The run port the publisher gets: real Git, and `gh` answered by the fake. */
function portFor(github: FakeGitHub): Run {
  return (command, args, options = {}) =>
    command === "gh" ? github.answer(args) : realRun(command, args, options);
}

interface World {
  readonly repo: string;
  readonly bare: string;
  readonly work: string;
  readonly base: string;
  readonly tip: string;
  readonly github: FakeGitHub;
  readonly run: Run;
}

/** A checkout on `BRANCH` with a two-commit series, an `origin` that is GitHub by URL. */
async function world(): Promise<World> {
  const repo = await temporary("motion5-publish-repo-");
  const bare = await temporary("motion5-publish-bare-");
  const work = await temporary("motion5-publish-work-");
  git(bare, "init", "-q", "--bare");
  git(repo, "init", "-q", "-b", "main");
  await writeFile(join(repo, ".gitignore"), ".handover/\n");
  await writeFile(join(repo, "a.txt"), "one\n");
  git(repo, "add", "-A");
  git(repo, "commit", "-qm", "base");
  const base = git(repo, "rev-parse", "HEAD");
  git(repo, "checkout", "-q", "-b", BRANCH);
  await writeFile(join(repo, "a.txt"), "ONE\n");
  git(repo, "commit", "-qam", "feat: first");
  await writeFile(join(repo, "b.txt"), "bee\n");
  git(repo, "add", "b.txt");
  git(repo, "commit", "-qm", "feat: second");
  const tip = git(repo, "rev-parse", "HEAD");
  git(repo, "remote", "add", "origin", `${URL_BASE}.git`);
  git(repo, "config", `url.${bare}.insteadOf`, `${URL_BASE}.git`);
  await writeFile(join(work, "NOTES.md"), "# Publish the notes\n\nWhat changed and why.\n");
  const github = new FakeGitHub();
  return { repo, bare, work, base, tip, github, run: portFor(github) };
}

function push(w: World, revision = "HEAD"): void {
  git(w.repo, "push", "-q", "origin", `${revision}:refs/heads/${BRANCH}`);
}

function passed(overrides: Partial<HandoverReview> = {}): HandoverReview {
  return {
    format: "motion5-review",
    version: 1,
    status: "passed",
    reviewer: "independent quality pass",
    summary: "Read the whole change; nothing blocking remains.",
    findings: [
      { severity: "blocking", state: "fixed", title: "Duplicate comment on retry", detail: "" },
      {
        severity: "advisory",
        state: "deferred",
        title: "Wrap long titles",
        detail: "Later.\nMaybe.",
      },
    ],
    evidence: `${URL_BASE}/pull/1#issuecomment-2`,
    ...overrides,
  };
}

function handover(
  w: World,
  destination: Destination = { kind: "branch" },
  review: HandoverReview | null = passed(),
): AppliedHandover {
  return {
    identity: "motion5-507-handover@0123456789ab",
    name: "motion5-507-handover",
    issue: 507,
    address: {
      kind: "addressed",
      title: "Publish the notes",
      target: { repository: REPOSITORY, branch: BRANCH, into: "main", destination },
    },
    notes: "# Publish the notes\n\nWhat changed and why.\n",
    review,
    tip: w.tip,
    commits: [
      { sha: git(w.repo, "rev-parse", "HEAD^"), subject: "feat: first" },
      { sha: w.tip, subject: "feat: second" },
    ],
  };
}

async function pendingNames(w: World): Promise<string[]> {
  return readdir(join(w.repo, ".git/motion5-handover/pending")).catch(() => []);
}

function publish(w: World, h: AppliedHandover): Promise<Publication> {
  return publishHandover(h, { root: w.repo, run: w.run });
}

function marked(w: World, number: number, part: string): number {
  return w.github.thread(number).filter((body) => body.includes(`:${part} -->`)).length;
}

describe("publishing to an existing pull request (ADR-119)", () => {
  it("HO-39 posts the notes and the review once to the open pull request of the branch", async () => {
    const w = await world();
    push(w);
    w.github.pull(BRANCH, "CLOSED");
    const open = w.github.pull(BRANCH);
    w.github.pull("some/other-branch");
    const fork = w.github.pull(BRANCH, "OPEN", {
      headRepositoryOwner: { login: "forker" },
      headRepository: { name: "motion5" },
    });
    const outcome = await publish(w, handover(w));
    expect(outcome).toEqual({
      kind: "published",
      destination: { kind: "pull-request", number: open.number, url: open.url },
      created: false,
      branch: { kind: "up-to-date" },
      posted: ["notes", "review"],
      skipped: [],
    });
    expect(w.github.thread(open.number)).toHaveLength(2);
    expect(marked(w, open.number, "notes")).toBe(1);
    expect(marked(w, open.number, "review")).toBe(1);
    expect(w.github.thread(fork.number)).toEqual([]);
    expect(w.github.pulls).toHaveLength(4);
    expect(await pendingNames(w)).toEqual([]);
    expect(w.github.calls.some((call) => call.includes("create"))).toBe(false);
  });

  it("HO-40 an explicit pull request is posted to only when it is the branch's, and an issue destination posts to the issue", async () => {
    const w = await world();
    push(w);
    const mine = w.github.pull(BRANCH);
    const theirs = w.github.pull("someone/else");
    const forked = w.github.pull(BRANCH, "OPEN", {
      headRepositoryOwner: { login: "forker" },
    });
    const posted = await publish(w, handover(w, { kind: "pull-request", number: mine.number }));
    expect(posted).toMatchObject({ kind: "published", destination: { number: mine.number } });
    const elsewhere = await publish(
      w,
      handover(w, { kind: "pull-request", number: theirs.number }),
    );
    expect(elsewhere).toMatchObject({
      kind: "deferred",
      reason: {
        kind: "pull-request-elsewhere",
        number: theirs.number,
        head: "octo/motion5:someone/else",
      },
    });
    expect(w.github.thread(theirs.number)).toEqual([]);
    expect(
      await publish(w, handover(w, { kind: "pull-request", number: forked.number })),
    ).toMatchObject({
      kind: "deferred",
      reason: {
        kind: "pull-request-elsewhere",
        head: `forker/motion5:${BRANCH}`,
        branch: `${REPOSITORY}:${BRANCH}`,
      },
    });
    expect(w.github.thread(forked.number)).toEqual([]);
    const issue = await publish(w, handover(w, { kind: "issue" }));
    expect(issue).toMatchObject({
      kind: "published",
      destination: { kind: "issue", number: 507, url: `${URL_BASE}/issues/507` },
    });
    expect(marked(w, 507, "notes")).toBe(1);
  });
});

describe("publishing when the branch has no pull request (ADR-119)", () => {
  it("HO-41 opens one pull request from the handover's title, base, notes and review status, and never a second", async () => {
    const w = await world();
    push(w);
    const first = await publish(w, handover(w, { kind: "branch" }, passed({ status: "pending" })));
    expect(first).toMatchObject({
      kind: "published",
      created: true,
      posted: ["review"],
      skipped: ["notes"],
    });
    expect(w.github.pulls).toHaveLength(1);
    const [pull] = w.github.pulls;
    expect(pull).toMatchObject({
      headRefName: BRANCH,
      baseRefName: "main",
      title: "Publish the notes",
    });
    expect(pull?.body).toContain(marker("motion5-507-handover@0123456789ab", "pull-request"));
    expect(pull?.body).toContain("refs #507");
    expect(pull?.body).toContain("Independent review: **pending, not a pass**");
    expect(pull?.body).not.toMatch(/\*\*passed\*\*/);
    expect(pull?.body).toContain(marker("motion5-507-handover@0123456789ab", "notes"));
    expect(pull?.body).toContain("What changed and why.");
    expect(pull?.body).toContain(`- \`${w.tip.slice(0, 12)}\` feat: second`);
    const again = await publish(w, handover(w, { kind: "branch" }, passed({ status: "pending" })));
    expect(again).toMatchObject({
      kind: "published",
      created: false,
      posted: [],
      skipped: ["notes", "review"],
    });
    expect(w.github.pulls).toHaveLength(1);
    expect(w.github.thread(pull?.number ?? 0)).toHaveLength(1);
  });

  it("HO-42 a branch whose only pull request is closed is posted to, not given a duplicate", async () => {
    const w = await world();
    push(w);
    const closed = w.github.pull(BRANCH, "MERGED");
    expect(await publish(w, handover(w))).toMatchObject({
      kind: "published",
      created: false,
      destination: { number: closed.number },
    });
    expect(w.github.pulls).toHaveLength(1);
  });
});

describe("publishing without what it needs (ADR-119)", () => {
  it("HO-43 defers with instructions and keeps the payload when gh, its login or the remote is missing", async () => {
    const w = await world();
    const h = handover(w);

    w.github.installed = false;
    const missing = await publish(w, h);
    expect(missing).toMatchObject({ kind: "deferred", reason: { kind: "gh-missing" } });
    expect(describePublication(missing).join("\n")).toContain("gh auth login");

    w.github.installed = true;
    w.github.authenticated = false;
    expect(await publish(w, h)).toMatchObject({ reason: { kind: "gh-unauthenticated" } });

    w.github.authenticated = true;
    git(w.repo, "remote", "set-url", "origin", "https://example.com/octo/motion5.git");
    const calls = w.github.calls.length;
    expect(await publish(w, h)).toMatchObject({
      kind: "deferred",
      reason: { kind: "remote-missing", repository: REPOSITORY },
    });
    expect(w.github.calls.length).toBe(calls);

    expect(w.github.writes()).toEqual([]);
    expect(git(w.bare, "for-each-ref")).toBe("");
    expect(await pendingNames(w)).toEqual(["motion5-507-handover.json"]);
    const saved = JSON.parse(
      await readFile(
        join(w.repo, ".git/motion5-handover/pending/motion5-507-handover.json"),
        "utf8",
      ),
    );
    expect(saved).toEqual(JSON.parse(JSON.stringify(h)));
    expect(git(w.repo, "status", "--porcelain")).toBe("");

    git(w.repo, "remote", "set-url", "origin", `git@github.com:${REPOSITORY}.git`);
    git(w.repo, "config", `url.${w.bare}.insteadOf`, `git@github.com:${REPOSITORY}.git`);
    const retried = await publishPending({ root: w.repo, run: w.run });
    expect(retried).toEqual([
      {
        name: "motion5-507-handover",
        publication: expect.objectContaining({ kind: "published", created: true }),
      },
    ]);
    expect(await pendingNames(w)).toEqual([]);
    expect(await publishPending({ root: w.repo, run: w.run })).toEqual([]);
  });

  it("HO-44 a retry after a failed post writes only what is missing, so nothing is duplicated", async () => {
    const w = await world();
    push(w);
    const pull = w.github.pull(BRANCH);
    w.github.failPost = ":review -->";
    const failed = await publish(w, handover(w));
    expect(failed).toMatchObject({ kind: "failed", step: "post-review", reason: "HTTP 502" });
    expect(describePublication(failed).join("\n")).toContain("npm run patches:publish");
    expect(marked(w, pull.number, "notes")).toBe(1);
    expect(marked(w, pull.number, "review")).toBe(0);
    expect(await pendingNames(w)).toEqual(["motion5-507-handover.json"]);
    w.github.failPost = null;
    const [retried] = await publishPending({ root: w.repo, run: w.run });
    expect(retried?.publication).toMatchObject({
      kind: "published",
      posted: ["review"],
      skipped: ["notes"],
    });
    expect(marked(w, pull.number, "notes")).toBe(1);
    expect(marked(w, pull.number, "review")).toBe(1);
    await writeFile(join(w.repo, ".git/motion5-handover/pending/broken.json"), "{");
    const [broken] = await publishPending({ root: w.repo, run: w.run });
    expect(broken).toMatchObject({
      name: "broken",
      publication: { kind: "failed", step: "read-pending" },
    });
  });
});

describe("what a publication says about the review (ADR-119)", () => {
  it("HO-45 states pass, fail, pending and absence exactly, and never labels unresolved work passed", async () => {
    const w = await world();
    const identity = "motion5-507-handover@0123456789ab";
    const failed = handover(
      w,
      { kind: "branch" },
      passed({
        status: "failed",
        findings: [
          { severity: "blocking", state: "open", title: "Posts twice", detail: "On retry." },
        ],
        evidence: null,
      }),
    );
    const failedReview = reviewComment(failed);
    expect(failedReview).toContain(marker(identity, "review"));
    expect(failedReview).toContain("## Independent review of `motion5-507-handover`: failed");
    expect(failedReview).toContain("- **blocking**, open: Posts twice\n  On retry.");
    expect(failedReview).toContain("Evidence: not provided");
    expect(failedReview).not.toContain("passed");
    const pending = handover(w, { kind: "branch" }, passed({ status: "pending", findings: [] }));
    expect(reviewComment(pending)).toContain(": pending, not a pass");
    expect(reviewComment(pending)).toContain("Findings:\nNone reported.");
    const pass = handover(w);
    expect(reviewComment(pass)).toContain(`Evidence: ${URL_BASE}/pull/1#issuecomment-2`);
    expect(reviewComment(pass)).toContain(
      "- **advisory**, deferred: Wrap long titles\n  Later.\n  Maybe.",
    );
    expect(reviewLine(pass.review)).toBe(
      "Independent review: **passed** by independent quality pass.",
    );
    const none = handover(w, { kind: "branch" }, null);
    expect(commentParts(none)).toEqual(["notes"]);
    expect(commentParts(pass)).toEqual(["notes", "review"]);
    expect(notesComment(none)).toContain("Independent review: **not provided**");
    expect(pullRequestBody(none)).toContain("Independent review: **not provided**");
    expect(notesComment(pass)).toContain(marker(identity, "notes"));
    expect(notesComment(pass)).toContain(`- \`${w.tip.slice(0, 12)}\` feat: second`);
    expect(notesComment(pass)).toContain("What changed and why.");
    const long = { ...pass, notes: "x".repeat(MAX_BODY_CHARACTERS + 10) };
    const huge = handover(w, { kind: "branch" }, passed({ summary: "y".repeat(70000) }));
    for (const body of [notesComment(long), pullRequestBody(long), reviewComment(huge)]) {
      expect(body).toContain(`Cut at ${MAX_BODY_CHARACTERS} characters to fit GitHub`);
      expect(body.length).toBeLessThan(65536);
    }
    expect(bounded("short")).toBe("short");
    expect(() =>
      reviewLine({ ...passed(), status: "approved" } as unknown as HandoverReview),
    ).toThrow("Unhandled REVIEW_STATUSES");
  });

  it("HO-46 words every publication and deferral, says which are settled, and refuses unknowns", () => {
    const samples: Publication[] = [
      { kind: "opted-out" },
      { kind: "unaddressed" },
      { kind: "deferred", reason: { kind: "gh-missing" }, pending: "p" },
      { kind: "failed", step: "post-notes", reason: "HTTP 502", pending: null },
      {
        kind: "published",
        destination: { kind: "pull-request", number: 5, url: `${URL_BASE}/pull/5` },
        created: true,
        branch: { kind: "created" },
        posted: ["notes"],
        skipped: [],
      },
    ];
    expect(samples.map((sample) => sample.kind)).toEqual([...PUBLICATION_KINDS]);
    expect(samples.map(isSettled)).toEqual([true, true, false, false, true]);
    expect(describePublication(samples[4] as Publication).join("\n")).toContain(
      "which this run opened",
    );
    expect(describePublication(samples[3] as Publication).join("\n")).toContain("by hand");
    const reasons = [
      { kind: "remote-missing", repository: REPOSITORY },
      { kind: "gh-missing" },
      { kind: "gh-unauthenticated" },
      {
        kind: "branch-diverged",
        remote: "origin",
        branch: BRANCH,
        tip: "a".repeat(40),
        remoteTip: "b".repeat(40),
      },
      { kind: "pull-request-elsewhere", number: 3, head: "x", branch: BRANCH },
    ] as const;
    expect(reasons.map((reason) => reason.kind)).toEqual([...DEFERRAL_KINDS]);
    const words = reasons.map((reason) =>
      describePublication({ kind: "deferred", reason, pending: "p" }).join("\n"),
    );
    expect(new Set(words).size).toBe(reasons.length);
    expect(PUBLICATION_PARTS).toEqual(["pull-request", "notes", "review"]);
    const syncs = [
      { kind: "up-to-date" },
      { kind: "created" },
      { kind: "fast-forwarded", from: "c".repeat(40) },
    ] as const;
    expect(syncs.map((sync) => sync.kind)).toEqual([...BRANCH_SYNC_KINDS]);
    const synced = syncs.map((branch) =>
      describePublication({ ...(samples[4] as Publication & { kind: "published" }), branch }),
    );
    expect(new Set(synced.map((lines) => lines[0])).size).toBe(syncs.length);
    expect(synced[2]?.join("\n")).toContain("c".repeat(12));
    expect(() =>
      describePublication({
        ...(samples[4] as Publication & { kind: "published" }),
        branch: { kind: "forced" },
      } as unknown as Publication),
    ).toThrow("Unhandled BRANCH_SYNC_KINDS");
    expect(() => describePublication({ kind: "maybe" } as unknown as Publication)).toThrow(
      "Unhandled PUBLICATION_KINDS",
    );
    expect(() =>
      describePublication({
        kind: "deferred",
        reason: { kind: "offline" },
        pending: "p",
      } as unknown as Publication),
    ).toThrow("Unhandled DEFERRAL_KINDS");
    expect(() => isSettled({ kind: "maybe" } as unknown as Publication)).toThrow(
      "Unhandled PUBLICATION_KINDS",
    );
    expect(REFUSAL_KINDS).toContain("invalid-review");
  });

  it("HO-47 reads the GitHub repository out of every remote URL spelling and nothing else", () => {
    for (const url of [
      "https://github.com/Octo/motion5.git",
      "https://github.com/Octo/motion5",
      "https://x-access-token@github.com/Octo/motion5.git/",
      "git@github.com:Octo/motion5.git",
      "ssh://git@github.com/Octo/motion5.git",
      "ssh://git@github.com:22/Octo/motion5",
    ])
      expect(remoteRepository(`${url}\n`), url).toBe("Octo/motion5");
    for (const url of [
      "https://gitlab.com/octo/motion5.git",
      "https://github.com/octo",
      "/srv/git/motion5.git",
      "https://github.com.evil.example/octo/motion5.git",
    ])
      expect(remoteRepository(url), url).toBeNull();
  });
});

describe("publication inside npm run patches (ADR-119)", () => {
  async function stageArchive(w: World, options: Partial<Parameters<typeof packHandover>[0]> = {}) {
    const out = join(w.work, "motion5-507-handover.zip");
    const built = await packHandover({
      root: w.repo,
      from: w.base,
      to: w.tip,
      issue: 507,
      notes: join(w.work, "NOTES.md"),
      out,
      run: realRun,
      ...options,
    });
    git(w.repo, "reset", "-q", "--hard", w.base);
    await mkdir(join(w.repo, ".handover"), { recursive: true });
    await cp(built.out, join(w.repo, ".handover", "motion5-507-handover.zip"));
    return built.manifest;
  }

  it("HO-48 publishes once after a successful apply, before the inbox is emptied, and never on a dry run or opt-out", async () => {
    const w = await world();
    const reviewFile = join(w.work, "review.json");
    await writeFile(reviewFile, JSON.stringify(passed()));
    const manifest = await stageArchive(w, { review: reviewFile });
    expect(manifest).toMatchObject({
      version: 2,
      title: "Publish the notes",
      target: {
        repository: REPOSITORY,
        branch: BRANCH,
        into: "main",
        destination: { kind: "branch" },
      },
    });
    expect(manifest.components).toContainEqual({ kind: "review", path: "REVIEW.json" });
    const seen: AppliedHandover[] = [];
    const inboxWhenPublished: string[][] = [];
    const port = async (h: AppliedHandover): Promise<Publication> => {
      seen.push(h);
      inboxWhenPublished.push(await readdir(join(w.repo, ".handover")));
      return { kind: "opted-out" };
    };
    const verified = await applyHandover({
      root: w.repo,
      run: realRun,
      dryRun: true,
      publish: port,
    });
    expect(verified.kind).toBe("verified");
    expect(seen).toEqual([]);
    const applied = await applyHandover({ root: w.repo, run: realRun, publish: port });
    expect(applied).toMatchObject({ kind: "applied", inbox: "emptied" });
    expect(seen).toHaveLength(1);
    expect(inboxWhenPublished).toEqual([["motion5-507-handover.zip"]]);
    const [h] = seen;
    expect(h).toMatchObject({
      name: "motion5-507-handover",
      issue: 507,
      notes: "# Publish the notes\n\nWhat changed and why.\n",
      review: passed(),
      tip: git(w.repo, "rev-parse", "HEAD"),
      address: { kind: "addressed", title: "Publish the notes" },
    });
    expect(h?.identity).toMatch(/^motion5-507-handover@[0-9a-f]{12}$/);
    expect(h?.commits.map((commit) => commit.subject)).toEqual(["feat: first", "feat: second"]);

    git(w.repo, "reset", "-q", "--hard", w.base);
    await stageArchive(w);
    const optedOut = await applyHandover({ root: w.repo, run: realRun, publish: null });
    expect(optedOut).toMatchObject({ kind: "applied", publication: { kind: "opted-out" } });

    git(w.repo, "reset", "-q", "--hard", w.base);
    await stageArchive(w);
    const thrown = await applyHandover({
      root: w.repo,
      run: realRun,
      publish: () => Promise.reject(new Error("boom")),
    });
    expect(thrown).toMatchObject({
      kind: "applied",
      inbox: "emptied",
      publication: { kind: "failed", step: "publish", reason: "boom", pending: null },
    });
  });

  it("HO-49 an applied archive publishes its unpublished branch end to end, and a version 1 payload is unaddressed", async () => {
    const w = await world();
    await stageArchive(w, { pullRequest: null });
    const applied = await applyHandover({
      root: w.repo,
      run: w.run,
      publish: (h) => publishHandover(h, { root: w.repo, run: w.run }),
    });
    // `git am` makes new commits, so the tip the remote must hold exists only after the apply, and
    // the branch was never on the remote: publishing is what creates it there.
    expect(applied).toMatchObject({
      kind: "applied",
      publication: {
        kind: "published",
        created: true,
        branch: { kind: "created" },
        posted: [],
        skipped: ["notes"],
      },
    });
    expect(git(w.bare, "rev-parse", `refs/heads/${BRANCH}`)).toBe(git(w.repo, "rev-parse", "HEAD"));
    expect(await publishPending({ root: w.repo, run: w.run })).toEqual([]);
    const [pull] = w.github.pulls;
    expect(pull?.title).toBe("Publish the notes");
    expect(pull?.body).toContain("Independent review: **not provided**");
    expect(w.github.thread(pull?.number ?? 0)).toEqual([]);
    const v1 = { ...handover(w), address: { kind: "unaddressed" } } as AppliedHandover;
    expect(await publish(w, v1)).toEqual({ kind: "unaddressed" });
    expect(await pendingNames(w)).toEqual([]);
  });

  it("HO-50 pack addresses from options or the checkout, refuses a contradictory address and a review that passes over a blocker", async () => {
    const w = await world();
    const base = {
      root: w.repo,
      from: w.base,
      to: w.tip,
      issue: 507,
      notes: join(w.work, "NOTES.md"),
      run: realRun,
    };
    const explicit = await packHandover({
      ...base,
      out: join(w.work, "explicit.zip"),
      title: "Explicit title",
      repository: "other/repo",
      branch: "feat/x",
      into: "develop",
      pullRequest: 12,
    });
    expect(explicit.manifest).toMatchObject({
      title: "Explicit title",
      target: {
        repository: "other/repo",
        branch: "feat/x",
        into: "develop",
        destination: { kind: "pull-request", number: 12 },
      },
    });
    const issue = await packHandover({ ...base, out: join(w.work, "issue.zip"), toIssue: true });
    expect(issue.manifest).toMatchObject({ target: { destination: { kind: "issue" } } });
    await expect(
      packHandover({ ...base, out: join(w.work, "both.zip"), toIssue: true, pullRequest: 3 }),
    ).rejects.toThrow("choose one");
    git(w.repo, "remote", "remove", "origin");
    await expect(packHandover({ ...base, out: join(w.work, "none.zip") })).rejects.toThrow(
      "--repository is required",
    );
    await expect(
      packHandover({
        ...base,
        out: join(w.work, "same.zip"),
        repository: REPOSITORY,
        into: BRANCH,
      }),
    ).rejects.toThrow("must differ");
    const blocker = join(w.work, "blocker.json");
    await writeFile(
      blocker,
      JSON.stringify(
        passed({ findings: [{ severity: "blocking", state: "open", title: "t", detail: "" }] }),
      ),
    );
    const refused = await packHandover({
      ...base,
      out: join(w.work, "blocker.zip"),
      repository: REPOSITORY,
      review: blocker,
    }).catch((error: unknown) => error);
    expect(refused).toBeInstanceOf(HandoverRefusal);
    expect((refused as HandoverRefusal).refusal.kind).toBe("invalid-review");
    await writeFile(join(w.work, "untitled.md"), "no heading here\n");
    const untitled = await packHandover({
      ...base,
      notes: join(w.work, "untitled.md"),
      out: join(w.work, "untitled.zip"),
      repository: REPOSITORY,
    });
    expect(untitled.manifest).toMatchObject({ title: "untitled" });
  });

  it("HO-51 the command line opts out with --no-publish and retries with patches:publish", async () => {
    const manifest = JSON.parse(await readFile(join(REPO, "package.json"), "utf8"));
    expect(manifest.scripts["patches:publish"]).toBe("node scripts/handover.mjs publish");
    const w = await world();
    await stageArchive(w);
    const cli = (...args: string[]) =>
      spawnSync(process.execPath, [CLI, ...args], {
        cwd: w.repo,
        encoding: "utf8",
        env: ENV,
      });
    const nothing = cli("publish");
    expect(nothing.status).toBe(0);
    expect(nothing.stdout).toContain("Nothing to publish");
    const optedOut = cli("apply", "--no-publish");
    expect(optedOut.status).toBe(0);
    expect(optedOut.stdout).toContain("Publishing skipped because of --no-publish");
    expect(cli("publish").stdout).toContain("Nothing to publish");
    git(w.repo, "reset", "-q", "--hard", w.base);
    await stageArchive(w);
    git(w.repo, "remote", "set-url", "origin", "https://example.com/elsewhere.git");
    const deferred = cli("apply");
    expect(deferred.status).toBe(0);
    expect(deferred.stdout).toContain("Not published yet");
    expect(deferred.stdout).toContain("No Git remote here points at github.com/octo/motion5");
    const retry = cli("publish");
    expect(retry.status).toBe(1);
    expect(retry.stderr).toContain("motion5-507-handover:");
    expect(cli("publish", "--force").status).toBe(1);
  });
});

describe("what the review of #507 found (ADR-119)", () => {
  it("HO-52 the identity covers the notes and the review, and not the zip's metadata", async () => {
    const w = await world();
    const identity = async (notes: string, name: string, review: string | null = null) => {
      await writeFile(join(w.work, `${name}.md`), notes);
      const built = await packHandover({
        root: w.repo,
        from: w.base,
        to: w.tip,
        issue: 507,
        notes: join(w.work, `${name}.md`),
        out: join(w.work, name, "motion5-507-handover.zip"),
        title: "Same title",
        review,
        run: realRun,
      });
      const scratch = await temporary("motion5-identity-");
      return (await inspectArchive(built.out, { run: realRun, scratch })).identity;
    };
    const first = await identity("# Notes\n", "a");
    expect(await identity("# Notes\n", "b")).toBe(first);
    expect(await identity("# Notes, corrected\n", "c")).not.toBe(first);
    const reviewFile = join(w.work, "review.json");
    await writeFile(reviewFile, JSON.stringify(passed()));
    const reviewed = await identity("# Notes\n", "d", reviewFile);
    expect(reviewed).not.toBe(first);
    await writeFile(reviewFile, JSON.stringify(passed({ summary: "Changed." })));
    expect(await identity("# Notes\n", "e", reviewFile)).not.toBe(reviewed);
  });

  it("HO-53 a branch's pull request is its own repository's, preferring open and then its base", () => {
    const target = {
      repository: "Octo/Motion5",
      branch: BRANCH,
      into: "main",
      destination: { kind: "branch" as const },
    };
    const pull = (number: number, state: string, base: string, owner: string | null = "octo") => ({
      number,
      url: `${URL_BASE}/pull/${number}`,
      state,
      baseRefName: base,
      headRefName: BRANCH,
      headRepository: owner === null ? null : { name: "motion5" },
      headRepositoryOwner: owner === null ? null : { login: owner },
    });
    const fork = pull(1, "OPEN", "main", "forker");
    const deleted = pull(2, "OPEN", "main", null);
    const closedMain = pull(3, "CLOSED", "main");
    const openDevelop = pull(4, "OPEN", "develop");
    const openMain = pull(5, "OPEN", "main");
    const mergedDevelop = pull(6, "MERGED", "develop");
    expect(branchPullRequest([fork, deleted], target)).toBeUndefined();
    expect(branchPullRequest([fork, openDevelop, openMain], target)).toBe(openMain);
    expect(branchPullRequest([closedMain, openDevelop], target)).toBe(openDevelop);
    expect(branchPullRequest([mergedDevelop, closedMain], target)).toBe(closedMain);
    expect(branchPullRequest([mergedDevelop], target)).toBe(mergedDevelop);
    expect(branchPullRequest([{ ...openMain, headRefName: "other" }], target)).toBeUndefined();
  });
});

/**
 * The owner asked on #508 what happens when the branch is not published yet or not pushed yet.
 * Both are settled by the publisher with a push of the exact applied tip that Git itself refuses
 * unless it creates the branch or fast-forwards it; only a branch that holds commits the tip lacks
 * waits for the human, and nothing is posted to GitHub until the branch holds the tip.
 */
describe("publishing a branch that is not on GitHub yet (#508)", () => {
  function remoteTip(w: World): string | null {
    const result = spawnSync("git", ["rev-parse", "--verify", "-q", `refs/heads/${BRANCH}`], {
      cwd: w.bare,
      encoding: "utf8",
      env: ENV,
    });
    return result.status === 0 ? result.stdout.trim() : null;
  }

  /** A commit another clone pushed, which this checkout has never fetched. */
  async function pushedElsewhere(w: World, parent: string, file: string): Promise<string> {
    const other = await temporary("motion5-publish-other-");
    git(other, "clone", "-q", "--no-checkout", w.bare, ".");
    git(other, "checkout", "-q", "-B", "elsewhere", parent);
    await writeFile(join(other, file), `${file}\n`);
    git(other, "add", file);
    git(other, "commit", "-qm", `elsewhere: ${file}`);
    git(other, "push", "-q", "--force", "origin", `HEAD:refs/heads/${BRANCH}`);
    return git(other, "rev-parse", "HEAD");
  }

  it("HO-54 creates an unpublished branch and fast-forwards an unpushed one before posting", async () => {
    const w = await world();
    expect(remoteTip(w)).toBeNull();
    const created = await publish(w, handover(w));
    expect(created).toMatchObject({
      kind: "published",
      created: true,
      branch: { kind: "created" },
    });
    expect(describePublication(created)[0]).toContain("publishing the branch on GitHub");
    expect(remoteTip(w)).toBe(w.tip);

    const behind = await world();
    push(behind, "HEAD^");
    const pull = behind.github.pull(BRANCH);
    const forwarded = await publish(behind, handover(behind));
    const from = git(behind.repo, "rev-parse", "HEAD^");
    expect(forwarded).toMatchObject({
      kind: "published",
      destination: { number: pull.number },
      branch: { kind: "fast-forwarded", from },
      posted: ["notes", "review"],
    });
    expect(describePublication(forwarded)[0]).toContain(from.slice(0, 12));
    expect(remoteTip(behind)).toBe(behind.tip);
    expect(await pendingNames(behind)).toEqual([]);
    const again = await publish(behind, handover(behind));
    expect(again).toMatchObject({ branch: { kind: "up-to-date" }, posted: [] });
    expect(marked(behind, pull.number, "notes")).toBe(1);
  });

  it("HO-55 a remote that already holds the tip is left alone, even when this checkout never fetched it", async () => {
    const w = await world();
    push(w);
    const ahead = await pushedElsewhere(w, w.tip, "c.txt");
    expect(spawnSync("git", ["cat-file", "-e", ahead], { cwd: w.repo, env: ENV }).status).not.toBe(
      0,
    );
    const outcome = await publish(w, handover(w));
    expect(outcome).toMatchObject({ kind: "published", branch: { kind: "up-to-date" } });
    expect(remoteTip(w)).toBe(ahead);
    expect(git(w.repo, "status", "--porcelain")).toBe("");
    expect(git(w.repo, "rev-parse", "HEAD")).toBe(w.tip);
  });

  it("HO-56 a diverged branch is never force-pushed: it defers with merge instructions and posts nothing", async () => {
    const w = await world();
    push(w);
    const theirs = await pushedElsewhere(w, w.base, "d.txt");
    const outcome = await publish(w, handover(w));
    expect(outcome).toMatchObject({
      kind: "deferred",
      reason: { kind: "branch-diverged", remote: "origin", branch: BRANCH, tip: w.tip },
    });
    expect(outcome).toMatchObject({ reason: { remoteTip: theirs } });
    const words = describePublication(outcome).join("\n");
    expect(words).toContain(`git pull --no-rebase origin ${BRANCH}`);
    expect(words).toContain("never force-pushes");
    expect(remoteTip(w)).toBe(theirs);
    expect(w.github.writes()).toEqual([]);
    expect(await pendingNames(w)).toEqual(["motion5-507-handover.json"]);

    git(w.repo, "pull", "-q", "--no-rebase", "--no-edit", "origin", BRANCH);
    git(w.repo, "push", "-q", "origin", `HEAD:refs/heads/${BRANCH}`);
    const [retried] = await publishPending({ root: w.repo, run: w.run });
    expect(retried?.publication).toMatchObject({
      kind: "published",
      branch: { kind: "up-to-date" },
    });
    expect(await pendingNames(w)).toEqual([]);
  });

  it("HO-57 a refused push fails at the push step, keeps the payload, and reaches no GitHub write", async () => {
    const w = await world();
    const hook = join(w.bare, "hooks", "pre-receive");
    await writeFile(hook, "#!/bin/sh\necho 'protected branch' >&2\nexit 1\n", { mode: 0o755 });
    const outcome = await publish(w, handover(w));
    expect(outcome).toMatchObject({ kind: "failed", step: "push" });
    expect(outcome.kind === "failed" ? outcome.reason : "").toContain("protected branch");
    expect(describePublication(outcome).join("\n")).toContain("npm run patches:publish");
    expect(remoteTip(w)).toBeNull();
    expect(w.github.writes()).toEqual([]);
    expect(await pendingNames(w)).toEqual(["motion5-507-handover.json"]);
    await rm(hook);
    const [retried] = await publishPending({ root: w.repo, run: w.run });
    expect(retried?.publication).toMatchObject({ kind: "published", branch: { kind: "created" } });
  });

  it("HO-59 a remote that moves between the read and the push is refused by Git, not overwritten", async () => {
    const w = await world();
    push(w, "HEAD^");
    const read = git(w.bare, "rev-parse", `refs/heads/${BRANCH}`);
    const theirs = git(w.bare, "commit-tree", "-p", read, "-m", "raced", `${read}^{tree}`);
    // Another push lands after the publisher read the branch as behind and before its own push.
    const racing: Run = (command, args, options = {}) => {
      if (command === "git" && args[0] === "push")
        git(w.bare, "update-ref", `refs/heads/${BRANCH}`, theirs);
      return w.run(command, args, options);
    };
    const outcome = await publishHandover(handover(w), { root: w.repo, run: racing });
    expect(outcome).toMatchObject({ kind: "failed", step: "push" });
    expect(remoteTip(w)).toBe(theirs);
    expect(w.github.writes()).toEqual([]);
    expect(await pendingNames(w)).toEqual(["motion5-507-handover.json"]);
    expect(await publish(w, handover(w))).toMatchObject({
      kind: "deferred",
      reason: { kind: "branch-diverged", remoteTip: theirs },
    });
  });

  it("HO-58 the remote branch states are a closed union, and a dry run pushes nothing", async () => {
    expect(BRANCH_STATES).toEqual(["up-to-date", "absent", "behind", "diverged"]);
    expect(BRANCH_SYNC_KINDS).toEqual(["up-to-date", "created", "fast-forwarded"]);
    const w = await world();
    const out = join(w.work, "motion5-507-handover.zip");
    await packHandover({
      root: w.repo,
      from: w.base,
      to: w.tip,
      issue: 507,
      notes: join(w.work, "NOTES.md"),
      out,
      run: realRun,
    });
    git(w.repo, "reset", "-q", "--hard", w.base);
    await mkdir(join(w.repo, ".handover"), { recursive: true });
    await cp(out, join(w.repo, ".handover", "motion5-507-handover.zip"));
    const dry = await applyHandover({
      root: w.repo,
      run: w.run,
      dryRun: true,
      publish: (h) => publishHandover(h, { root: w.repo, run: w.run }),
    });
    expect(dry).toMatchObject({ kind: "verified" });
    expect(remoteTip(w)).toBeNull();
    expect(w.github.calls).toEqual([]);
  });
});
